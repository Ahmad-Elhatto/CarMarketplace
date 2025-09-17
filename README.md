# Car Marketplace

**Full-Stack Node.js & Express Application with MongoDB**

Car Marketplace is a class project that demonstrates backend and full-stack development using Node.js, Express, MongoDB, and EJS templates. The app is cloud-ready and showcases session management, routing, and database integration.

---

## **Technologies Used**
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Frontend:** EJS Templates, HTML/CSS
- **Authentication & Sessions:** express-session, connect-mongo
- **Other:** Morgan, method-override, connect-flash

---

## **Features**
- User registration and login with session handling
- Browse and manage car listings
- CRUD functionality for marketplace items (Create, Read, Update, Delete)
- Flash messages for success/error feedback
- Structured routes and MVC architecture

---

## **Setup & Installation**
1. Clone the repository:
   ```bash
   git clone git@github.com:Ahmad-Elhatto/CarMarketplace.git
2. Navigate to the project folder:
    ```bash
   cd CarMarketplace
3. Install dependencies:
    ```bash
   npm install
4. Create a .env file in the root directory:
    ```bash
    PORT=3000
    HOST=localhost
    MONGO_URI=your_mongodb_uri
    SESSION_SECRET=your_session_secret
5. Run the app:
    ```bash
    npm start

6. Open your browser and go to http://localhost:3000

## **Project Learnings**
- Implemented full-stack web application using Node.js and Express
- Integrated MongoDB with Mongoose for persistent storage
- Handled user sessions and authentication securely
- Built a clean MVC structure with separate routes and controllers
- Applied best practices for handling sensitive information (environment variables)

## **License**
This project is licensed under the MIT License. See the LICENSE file for details.