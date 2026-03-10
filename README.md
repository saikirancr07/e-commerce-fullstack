E-Commerce Full Stack Application

A full stack e-commerce web application built using React (Vite) for the frontend and Node.js with Express for the backend.
The application includes user authentication, protected routes, product browsing, cart functionality, and API integration with loading indicators.

🚀 Tech Stack
Frontend
--------------
React (Vite)
react-router-dom – Routing between pages
react-loader-spinner – Display loading indicators during API calls
react-icons – Icons for UI
js-cookie – Manage authentication tokens in cookies

Backend
---------------
Node.js
Express.js – REST API server
bcrypt – Password hashing
jsonwebtoken (JWT) – Authentication and authorization
path – File path utilities

📌 Features
------------------

User Authentication (Login)
Authorization using JWT
Protected Routes
API integration between frontend and backend
Loading Spinner before API responses
Product Listing
Product Filtering
Shopping Cart
Secure password storage using bcrypt
Token-based authentication using JWT
Clean routing structure for both frontend and backend
Logout button jwt token removed from Cookies and logout

📂 Project Structure
final/
│
├── client/                 # Frontend (Vite + React)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/                 # Backend (Node + Express)
│   ├── routes/
│   ├── database.db
│   ├── db.js
│   ├── index.js
│   └── package.json
│
└── README.md

🧭 Application Routes
Frontend Routes
Route	Description
--------------------
/login	User login page
/register User register page
/	Home page after login
/products	 Products page Displays all products
/products/:id ProductItemDetails page display Product details
/cart	Shopping cart page

🔐 Authentication Flow
--------------------------
User logs in from the Login page.
Backend verifies credentials using bcrypt.
If valid, backend returns a JWT token.
The token is stored in cookies using js-cookie.
Protected routes check for valid authentication before granting access.

🔄 API Loading Behavior
-----------------------------
When an API request is made:
A loader (react-loader-spinner) is displayed.
After the API call succeeds:
The data is rendered on the UI.

🛍 Product Features
-------------------------
Display product list from API
Filter products based on categories
Search products by name
Add products to cart
View products in cart page
Delete products in cart

⚙️ Installation
--------------------------
Clone the repository
git clone https://github.com/saikirancr07/e-commerce-fullstack
cd final

Install Frontend Dependencies
------------------------------------
cd client
npm install
npm run dev

Install Backend Dependencies
------------------------------------
cd server
npm install
node server.js

📦 Third Party Packages
FRONTEND
--------------------------
react-router-dom
react-loader-spinner
react-icons
js-cookie

BACKEND
------------------------
express
bcrypt
jsonwebtoken
path

🔮 Future Improvements
---------------------------
User Registeration
Product search
Product Filter
Cart Products
