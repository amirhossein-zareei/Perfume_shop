<div align="center">

# Perfume Shop Backend API

### A Complete E-Commerce Solution for Fragrance Retail

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)

**[Live Demo](https://perfume-shop-f8ys.onrender.com/api-docs/)** • **[Features](#key-features)** • **[Installation](#installation)** • **[API Documentation](#api-documentation)**



</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Core Modules](#core-modules)
- [Security Features](#security-features)
- [Payment Integration](#payment-integration)
- [License](#license)

---

## Overview

**Perfume Shop** is a full-featured RESTful API backend for a specialized fragrance e-commerce platform. Built with modern technologies and best practices, it provides everything needed to run a professional online perfume store.

### What Makes This Special?

- 🎨 **Multi-Variant Products**: Support for multiple product variants (e.g., 100ml bottle, 50ml bottle, 10ml decant) with independent pricing and stock management.

- 🔐 **Enterprise-Grade Security**: Implements JWT authentication with refresh tokens managed via **Redis** for enhanced session security and stateless session invalidation. Includes role-based access control (RBAC) and secure `bcrypt` password hashing.

- ⚡️ **High-Performance Caching**: Leverages **Redis** for caching temporary but critical data, such as CAPTCHA codes, to reduce database load and improve response times.

- 💳 **Dual Payment Gateway**: Integrated with both **Stripe** and **PayPal** for flexible and secure payment options.

- 🛒 **Persistent Shopping Cart**: Features a database-backed (MongoDB) shopping cart that persists for authenticated users across multiple sessions, ensuring a seamless user experience.

- 📦 **Complete Order Management**: Full lifecycle management from checkout and payment confirmation to shipping and delivery status tracking.

- 📧 **Email Notifications**: Automated transactional emails using **Nodemailer** for account verification, password resets, and order updates.

- 📱 **RESTful Architecture**: Clean, intuitive API endpoints designed according to REST principles, with robust validation using **Joi**.

---

## Key Features

### 👥 User Management

- ✅ User registration with email verification
- ✅ Secure login with JWT access & refresh tokens
- ✅ Password reset via email
- ✅ Profile management with avatar upload (Cloudinary)
- ✅ Account deactivation/reactivation
- ✅ User ban system (admin)
- ✅ CAPTCHA protection for sensitive operations

### 🛍️ Product Management

- ✅ Multi-variant product support (different sizes/volumes)
- ✅ Product categories and brands
- ✅ Product images with CDN integration
- ✅ Stock management per variant
- ✅ Discount system (percentage-based)
- ✅ Product filtering
- ✅ Pagination and sorting
- ✅ Product activation/deactivation

### 🛒 Shopping Experience

- ✅ Persistent shopping cart (MongoDB)
- ✅ Add/update/remove cart items
- ✅ Cart item synchronization
- ✅ Price calculation with discounts

### 💳 Checkout & Payments

- ✅ Multi-step checkout process
- ✅ Address management
- ✅ Payment method selection (Stripe/PayPal)
- ✅ Secure payment session creation
- ✅ Payment verification & callback handling
- ✅ Multi-currency support (USD, EUR, GBP, JPY, etc.)
- ✅ Transaction tracking

### 📦 Order Management

- ✅ Order creation and tracking
- ✅ Order status updates (pending, processing, shipped, delivered, cancelled)
- ✅ Order history for users
- ✅ Admin order management
- ✅ Stock adjustment on order completion

### 💬 Reviews & Comments

- ✅ Product reviews with ratings (1-5 stars)
- ✅ Comment moderation (admin)
- ✅ Review replies
- ✅ Comment approval system

### 🔐 Admin Features

- ✅ Complete user management
- ✅ Product CRUD operations
- ✅ Brand & category management
- ✅ Order management
- ✅ Comment moderation
- ✅ Role-based access control

---

## Tech Stack

### Core Technologies

| Technology     | Version | Purpose                   |
| -------------- | ------- | ------------------------- |
| **Node.js**    | Latest  | Runtime environment       |
| **Express.js** | ^5.1.0  | Web framework             |
| **MongoDB**    | ^8.14.3 | Primary database          |
| **Mongoose**   | ^8.14.3 | ODM for MongoDB           |
| **Redis**      | ^5.6.1  | Caching & session storage |

### Authentication & Security

- **JWT** (^9.0.2) - Token-based authentication
- **bcrypt** (^6.0.0) - Password hashing
- **Joi** (^17.13.3) - Input validation

### Payment Processing

- **Stripe** (^19.2.0) - Credit card payments
- **@paypal/checkout-server-sdk** (^1.0.3) - PayPal integration

### File Management

- **Cloudinary** (^1.41.3) - Image hosting & transformation
- **Multer** (^2.0.1) - File upload handling

### Email Services

- **Nodemailer** (^7.0.3) - Email sending

### API Documentation

- **Swagger UI Express** (^5.0.1) - Interactive API documentation
- **Swagger JSDoc** (^6.2.8) - API documentation generation

### Additional Tools

- **Winston** (^3.17.0) - Logging
- **svg-captcha** (^1.4.0) - CAPTCHA generation
- **cookie-parser** (^1.4.7) - Cookie handling
- **CORS** (^2.8.5) - Cross-origin resource sharing

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher)
- **Redis** (v7 or higher)
- **npm** or **yarn**

### External Services Required

- **Cloudinary Account** - For image storage
- **SMTP Server** - For email notifications
- **Stripe Account** - For credit card payments (optional)
- **PayPal Developer Account** - For PayPal payments (optional)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/amirhossein-zareei/Perfume_shop.git
cd Perfume_shop
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` with your configuration (see [Environment Variables](#environment-variables) section).

### 4. Seed the Database with Location Data

**This is a crucial step!** Before you can create user addresses or process checkouts, you need to populate the database with geographical data (states/provinces and cities).

The `seed` script fetches this data for a specified country and adds it to your MongoDB database.

#### Usage

Run the following command in your terminal, replacing `<countryName>` with the name of the country you want to add. The country name should be in English and is case-insensitive.

```bash
npm run seed <countryName>
```

#### Examples

To populate the database with data for United States:

```bash
npm run seed United States
```

<details>
<summary><strong>Click to see more supported countries</strong></summary>

You can find the full list of supported countries and their exact names inside the `scripts/seedLocations.js` file. Some examples include:

- `Canada`
- `Germany`
- `Australia`
- `United Kingdom`
- ...and many more.

</details>

**Production Mode:**

```bash
npm start
```

The server will start on `http://localhost:{prot}` (or your configured PORT).

---

## Environment Variables

Create a `.env` file with the following variables:

```env
# Application
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
MONGO_URL=mongodb://localhost:27017/perfume_shop

# Redis
REDIS_URL=redis://localhost:6379

# JWT Secrets
ACCESS_TOKEN_SECRET_KEY=your_access_token_secret_here
REFRESH_TOKEN_SECRET_KEY=your_refresh_token_secret_here
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Gateways
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Currency
DEFAULT_CURRENCY=USD
```

### How to Get API Keys

#### Cloudinary

1. Sign up at [cloudinary.com](https://cloudinary.com/)
2. Get credentials from your dashboard

#### Stripe

1. Create account at [stripe.com](https://stripe.com/)
2. Get test keys from [Dashboard → Developers → API Keys](https://dashboard.stripe.com/test/apikeys)

#### PayPal

1. Sign up at [developer.paypal.com](https://developer.paypal.com/)
2. Create a Sandbox app
3. Get Client ID and Secret from app credentials

---

## API Documentation

### Interactive Documentation

Access the [**live Swagger documentation**](https://perfume-shop-f8ys.onrender.com/api-docs/)

> **Note:** The live demo is hosted on a free Render instance, which may go to sleep after a period of inactivity. The first request might take **10-15 seconds** to wake up the server. Please be patient!

Or run locally and visit: `http://localhost:{port}/api-docs`

### Quick API Overview

#### Authentication Endpoints

```
POST   /api/v1/auth/register       - Register new user
POST   /api/v1/auth/login          - User login
POST   /api/v1/auth/logout         - User logout
POST   /api/v1/auth/refresh-token  - Refresh access token
GET    /api/v1/auth/captcha        - Generate CAPTCHA
POST   /api/v1/auth/forgot-password - Request password reset
POST   /api/v1/auth/reset-password/:token - Reset password
```

#### Products

```
GET    /api/v1/products            - Get all products
GET    /api/v1/products/:slug      - Get single product
POST   /api/v1/admin/products      - Create product (Admin)
PUT    /api/v1/admin/products/:slug - Update product (Admin)
DELETE /api/v1/admin/products/:slug - Delete product (Admin)
```

#### Shopping Cart

```
GET    /api/v1/cart                - Get user's cart
POST   /api/v1/cart                - Add item to cart
PATCH  /api/v1/cart/:itemId        - Update cart item
DELETE /api/v1/cart/:itemId        - Remove cart item
```

#### Checkout & Orders

```
POST   /api/v1/checkout            - Create checkout session
GET    /api/v1/checkout            - Get checkout details
PATCH  /api/v1/checkout            - Update checkout
DELETE /api/v1/checkout            - Cancel checkout
POST   /api/v1/checkout/payment    - Initiate payment
GET    /api/v1/checkout/callback   - Payment callback
GET    /api/v1/orders              - Get user's orders
GET    /api/v1/orders/:orderNumber - Get order details
```

#### Brands & Categories

```
GET    /api/v1/brands              - Get all brands
GET    /api/v1/brands/:slug        - Get single brand
GET    /api/v1/categories          - Get all categories
GET    /api/v1/categories/:slug    - Get single category
```

---

## Project Structure

```
Perfume_shop/
├── 📂 src/
│   ├── 📂 config/              # Configuration files
│   │   ├── cloudinary.js       # Cloudinary setup
│   │   ├── db.js               # MongoDB connection
│   │   ├── env.js              # Environment variables
│   │   ├── redis.js            # Redis connection
│   │   └── swagger/            # Swagger configuration
│   ├── 📂 middlewares/         # Express middlewares
│   │   ├── authMiddleware.js   # JWT authentication
│   │   ├── errorHandlerMiddleware.js
│   │   ├── uploadMiddleware.js # File upload handling
│   │   └── validateMiddleware.js # Input validation
│   ├── 📂 models/              # Mongoose models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Brand.js
│   │   ├── Category.js
│   │   ├── Cart.js
│   │   ├── CartItem.js
│   │   ├── Checkout.js
│   │   ├── Order.js
│   │   ├── Comment.js
│   │   ├── Address.js
│   │   └── index.js
│   ├── 📂 modules/             # Feature modules (routes, controllers, validation)
│   │   └── 📂 v1/
│   │       ├── 📂 auth/
│   │       ├── 📂 user/
│   │       ├── 📂 product/
│   │       ├── 📂 brand/
│   │       ├── 📂 category/
│   │       ├── 📂 cart/
│   │       ├── 📂 checkout/
│   │       ├── 📂 order/
│   │       ├── 📂 comment/
│   │       └── 📂 address/
│   ├── 📂 services/            # Business logic
│   │   ├── cartService.js
│   │   ├── captchaService.js
│   │   ├── cloudinaryService.js
│   │   ├── commentService.js
│   │   ├── emailService.js
│   │   ├── orderService.js
│   │   ├── tokenService.js
│   │   └── 📂 payment/
│   │       ├── paymentService.js
│   │       ├── stripeService.js
│   │       └── paypalService.js
│   ├── 📂 templates/           # Email templates
│   │   ├── passwordReset.html
│   │   └── verification.html
│   ├── 📂 utils/               # Utility functions
│   │   ├── apiFeatures.js      # Query helpers
│   │   ├── apiResponse.js      # Response formatters
│   │   ├── AppError.js         # Custom error class
│   │   ├── cookieHelper.js
│   │   ├── currency.js
│   │   ├── logger.js           # Winston logger
│   │   └── validationHelpers.js
│   ├── app.js                  # Express app setup
│   └── server.js               # Server entry point
├── 📂 data/                    # Seed data
├── 📂 scripts/                 # Utility scripts
│   └── seedLocations.js
├── .env.example                # Environment template
├── .gitignore
├── package.json
├── swagger.js                  # Swagger configuration
└── README.md
```

---

## Core Modules

### Authentication Module (`/auth`)

- User registration with email verification
- Login/Logout with JWT
- Password reset flow
- Refresh token mechanism
- CAPTCHA generation and verification

### Product Module (`/products`)

- Multi-variant product management
- Product search, filter, and sort
- Stock management
- Image upload and management
- Discount application

### Cart Module (`/cart`)

- Add/update/remove items
- Real-time stock validation
- Cart persistence with Redis
- Price calculation

### Checkout Module (`/checkout`)

- Checkout session creation
- Address management
- Payment method selection
- Payment gateway integration

### Order Module (`/orders`)

- Order creation from checkout
- Order status tracking
- Order history
- Admin order management

### Admin Module (`/admin/...`)

- User management (ban/unban, role change)
- Product CRUD operations
- Order management
- Comment moderation

---

## Security Features

### Authentication & Authorization

- ✅ **JWT-based authentication** with access and refresh tokens
- ✅ **Role-based access control** (Admin/User)
- ✅ **Password hashing** with bcrypt (10 rounds)
- ✅ **Token versioning** for forced logout
- ✅ **Refresh token rotation** for enhanced security

### Input Validation & Sanitization

- ✅ **Joi validation** for all inputs
- ✅ **MongoDB injection prevention**
- ✅ **XSS protection** through input sanitization
- ✅ **CAPTCHA protection** for sensitive operations

### Session & Token Management

- ✅ **Access token blocklisting** on logout
- ✅ **Refresh token revocation**
- ✅ **One-time tokens** for password reset and email verification
- ✅ **Token expiration handling**

### Data Protection

- ✅ **Secure cookie handling** (httpOnly, secure, sameSite)
- ✅ **CORS configuration**
- ✅ **Rate limiting** (can be added)
- ✅ **Environment variable protection**

---

## Payment Integration

### Supported Payment Methods

#### 1. Stripe

- **Credit/Debit Cards**: Full support for card payments
- **Session-based Checkout**: Secure hosted checkout page
- **Webhook Support**: For real-time payment updates
- **Multi-currency**: Support for 135+ currencies

#### 2. PayPal

- **PayPal Account**: Pay with PayPal balance
- **Credit/Debit Cards**: Via PayPal
- **Order-based API**: Modern REST API integration
- **Buyer Protection**: Built-in dispute resolution

### Payment Flow

```
1. User adds items to cart
2. Proceeds to checkout
3. Selects payment method (Stripe/PayPal)
4. System creates payment session
5. User redirected to payment gateway
6. After payment, redirected to callback URL
7. System verifies payment
8. Order is created
9. Stock is adjusted
10. Cart is cleared
```

---

## Authors

**Amirhossein Zareei**

- GitHub: [@amirhossein-zareei](https://github.com/amirhossein-zareei)

---

## Acknowledgments

- Express.js team for the amazing framework
- MongoDB team for the powerful database
- Stripe and PayPal for payment processing
- Cloudinary for image management

---

## Support

For support or inquiries, you can contact me via email at [amirhossein2004zareei@gmail.com](mailto:amirhossein2004zareei@gmail.com).

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

Made with ❤️ by [Amirhossein Zareei](https://github.com/amirhossein-zareei)

</div>
