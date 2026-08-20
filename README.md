# 🛒 Modern MERN E-Commerce Platform

A feature-rich, full-stack **E-Commerce Application** built using the **MERN** stack (MongoDB, Express.js, React 18, Node.js) and **Vite**. This platform provides a seamless shopping experience for customers and a comprehensive management portal for administrators.

---

## 🌟 Key Features

### 👤 User & Authentication
- **User Registration & Login**: Secure authentication with hashed passwords (`bcryptjs`) and JSON Web Tokens (`JWT`).
- **Role-Based Access Control**: Strict separation between customer (`user`) and administrator (`admin`) privileges.
- **Persistent Sessions**: Token-based authentication preserved in client storage with automatic Axios request interceptors.

### 🛍️ Product Catalog & Shopping
- **Interactive Product Catalog**: Browse products with search, category filtering, price sorting, and live stock tracking.
- **Product Details Page**: Detailed view with high-resolution imagery, descriptions, ratings, and stock status.
- **Shopping Cart**: Real-time cart calculations, quantity adjustment, and persistent local storage sync.
- **Checkout & Order Placement**: Multi-step checkout with delivery address management, payment selection (COD / Card simulation), and order summary.

### 📦 Order Management
- **Customer Order Tracking**: Real-time view of past orders, detailed breakdowns, invoice info, and status progression (`Pending` ➔ `Processing` ➔ `Shipped` ➔ `Delivered` / `Cancelled`).
- **Admin Order Processing**: Update order status, track customer shipments, and manage fulfillment.

### 📊 Admin Dashboard & Control Panel
- **Analytics Overview**: Real-time metrics including total revenue, order count, registered users, and low-stock alerts.
- **Product Management (CRUD)**: Create, view, update, and delete products with image URLs, inventory count, and categories.
- **Order Control**: Complete oversight of all platform transactions and customer orders.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Axios, Modern Responsive CSS3 |
| **Backend** | Node.js, Express.js (ES Modules) |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Authentication** | JSON Web Token (JWT), bcryptjs |
| **Tooling** | Nodemon, Vite Plugin React, Git |

---

## 📁 Project Structure

```text
e-commerce/
├── .gitignore
├── README.md
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js    # Admin analytics & dashboard logic
│   │   ├── authController.js     # User registration & login
│   │   ├── orderController.js    # Order processing & history
│   │   └── productController.js  # Product listing & details
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification & role authorization
│   ├── models/
│   │   ├── Order.js              # Order schema & statuses
│   │   ├── Product.js            # Product schema & inventory
│   │   └── User.js               # User schema & password hashing
│   └── routes/
│       ├── adminRoutes.js        # Admin management endpoints
│       ├── authRoutes.js         # Authentication endpoints
│       ├── orderRoutes.js        # Order endpoints
│       └── productRoutes.js      # Public & protected product endpoints
└── frontend/
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx               # Main application routing
        ├── main.jsx              # React DOM root entry
        ├── index.css             # Global styling & design system
        ├── api/
        │   └── axiosInstance.js  # Configured Axios with JWT interceptor
        ├── components/
        │   ├── AdminRoute.jsx    # Protected route for administrators
        │   ├── Navbar.jsx        # Navigation bar with dynamic auth links
        │   ├── ProductCard.jsx   # Product preview card
        │   ├── ProductFormModal.jsx # Modal for product create/edit
        │   └── ProtectedRoute.jsx# Protected route for logged-in users
        ├── context/
        │   ├── AuthContext.jsx   # Global user state & login/logout
        │   └── CartContext.jsx   # Shopping cart state & actions
        └── pages/
            ├── AdminDashboard.jsx
            ├── AdminOrders.jsx
            ├── AdminProducts.jsx
            ├── Cart.jsx
            ├── Checkout.jsx
            ├── CustomerDashboard.jsx
            ├── Home.jsx
            ├── Login.jsx
            ├── MyOrders.jsx
            ├── OrderDetails.jsx
            ├── ProductDetails.jsx
            └── Register.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or local MongoDB instance
- [Git](https://git-scm.com/) installed

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Nimrahghumman/e-commerce.git
cd e-commerce
```

---

### 2️⃣ Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Configure environment variables in `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=30d
   ```
5. Start the backend server:
   ```bash
   # Development mode with Nodemon
   npm run dev

   # Production mode
   npm start
   ```
   Backend will be running at: `http://localhost:5000`

---

### 3️⃣ Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Set the backend API URL:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
5. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Frontend will be running at: `http://localhost:5173`

---

## 🔌 API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user | No |
| `POST` | `/login` | Authenticate user & get JWT token | No |
| `GET` | `/profile` | Get current logged-in user profile | Yes |

### Products (`/api/products`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Fetch all products (supports search/filter) | No |
| `GET` | `/:id` | Fetch single product details | No |
| `POST` | `/` | Create new product | Yes (Admin) |
| `PUT` | `/:id` | Update product details | Yes (Admin) |
| `DELETE`| `/:id` | Delete a product | Yes (Admin) |

### Orders (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Create a new order | Yes |
| `GET` | `/myorders` | Get logged-in user's order history | Yes |
| `GET` | `/:id` | Get specific order details | Yes |

### Admin (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/stats` | Platform statistics & metrics | Yes (Admin) |
| `GET` | `/orders` | View all platform orders | Yes (Admin) |
| `PUT` | `/orders/:id/status` | Update order delivery status | Yes (Admin) |

---

## 🛡️ Security Features
- **Password Hashing**: Salted and hashed passwords with `bcryptjs`.
- **JWT Protection**: Protected routes validated with Bearer token authentication.
- **Role Guards**: Admin-only routes guarded against unauthorized customer access on both client and server.
- **Input Sanitization**: Express request validation and Mongoose schema constraints.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
