import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

/**
 * @desc    Create a new order & deduct product stock
 * @route   POST /api/orders
 * @access  Private (Logged-in customer)
 */
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress } = req.body;

    // 1. Validate order items
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order',
      });
    }

    // 2. Validate shipping address
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete shipping details: name, phone, address, city',
      });
    }

    // 3. Verify stock availability for all products before placing order
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of orderItems) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({
          success: false,
          message: `Invalid product ID: ${item.product}`,
        });
      }

      const productFromDB = await Product.findById(item.product);

      if (!productFromDB) {
        return res.status(404).json({
          success: false,
          message: `Product "${item.name || item.product}" not found`,
        });
      }

      if (productFromDB.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${productFromDB.name}". Available: ${productFromDB.stock}, Requested: ${item.quantity}`,
        });
      }

      calculatedTotal += productFromDB.price * item.quantity;

      validatedItems.push({
        product: productFromDB._id,
        name: productFromDB.name,
        image: productFromDB.image,
        price: productFromDB.price,
        quantity: item.quantity,
      });
    }

    // 4. Deduct stock from each product in database
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // 5. Create and save order in MongoDB
    const order = await Order.create({
      user: req.user._id,
      orderItems: validatedItems,
      shippingAddress: {
        name: shippingAddress.name.trim(),
        phone: shippingAddress.phone.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
      },
      totalAmount: Number(calculatedTotal.toFixed(2)),
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    console.error('createOrder Controller Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating order',
    });
  }
};

/**
 * @desc    Get logged in user's orders
 * @route   GET /api/orders/my-orders
 * @access  Private (Logged-in customer)
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('getMyOrders Controller Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching your orders',
    });
  }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Private (Order owner or Admin)
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid order ID format',
      });
    }

    const order = await Order.findById(id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('getOrderById Controller Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching order details',
    });
  }
};

/**
 * @desc    Get all orders across all customers
 * @route   GET /api/orders
 * @access  Private/Admin
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('getAllOrders Controller Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching all orders',
    });
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      'Pending',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled',
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid order ID format',
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to "${status}"`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error('updateOrderStatus Controller Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating order status',
    });
  }
};
