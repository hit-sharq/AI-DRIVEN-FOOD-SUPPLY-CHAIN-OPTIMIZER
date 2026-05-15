# AI-Driven Food Supply Chain Optimizer

> **Transforming post-harvest food loss into profitable, sustainable transactions for emerging markets**

## Table of Contents
- [Overview](#overview)
- [Current Status](#current-status)
- [Features Implemented](#features-implemented)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Frontend Components](#frontend-components)
- [Next Steps](#next-steps)
- [Contributing](#contributing)
- [License](#license)

## Overview
This project implements a software platform designed to optimize food supply chains in emerging markets by:
- Predicting produce shelf-life using computer vision
- Enabling dynamic pricing to reduce waste
- Connecting vendors with B2B buyers for surplus stock
- Providing analytics for better decision-making

The platform helps smallholder farmers and vendors reduce post-harvest losses, increase profits, and contribute to food security and environmental sustainability.

## Current Status
As of May 15, 2026, we have implemented the foundational infrastructure:

### ✅ Completed Components
1. **Backend API** (Node.js/Express)
   - RESTful API with proper routing and middleware
   - File upload handling for produce images
   - Simulated shelf-life prediction endpoint
   - Vendor authentication system (registration, login, profile)
   - MongoDB integration with Mongoose
   - Environment configuration

2. **Frontend Application** (React/Vite)
   - Modern React 18 app with Vite bundler
   - Image upload component for shelf-life prediction
   - HTTP client (Axios) for API communication
   - Responsive design foundation

3. **Database Model**
   - Vendor schema with geolocation support
   - Authentication with password hashing and JWT

4. **Documentation**
   - Comprehensive PROJECT_DOC.md
   - Inline code comments
   - API endpoint documentation

### 🔧 In Progress / To Be Implemented
- Actual TensorFlow Lite shelf-life prediction model (currently simulated)
- Dynamic pricing engine endpoints
- B2B marketplace functionality
- Analytics dashboard
- Offline-first capabilities
- Vendor dashboard UI

## Features Implemented
- **Vendor Management**: Registration, login, profile updates
- **Image Upload**: Secure file upload for produce images
- **Shelf-Life Prediction**: API endpoint (currently returns simulated predictions)
- **Authentication**: JWT-based protected routes
- **Geolocation Support**: Store vendor locations for proximity-based services
- **Error Handling**: Proper HTTP status codes and error messages
- **Middleware**: Security (helmet), logging (morgan), CORS, body parsing

## Technology Stack
### Backend
- **Runtime**: Node.js v24.15.0
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (jwt), bcryptjs for password hashing
- **File Upload**: Multer
- **Security**: Helmet.js
- **Logging**: Morgan
- **Validation**: Built-in with Mongoose

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS (planned migration to Tailwind or Material-UI)
- **HTTP Client**: Axios
- **State Management**: React hooks (useState, useEffect)

### DevOps
- **Version Control**: Git
- **Package Management**: npm
- **Environment Variables**: dotenv pattern
- **Linting**: Planned (ESLint, Prettier)

### AI/ML (Planned)
- **Model**: TensorFlow Lite for on-device inference
- **Training**: Transfer learning with MobileNetV2/EfficientNet
- **Input**: Produce images (tomatoes, avocados, mangoes, etc.)
- **Output**: Estimated shelf-life in days (regression)

## Project Structure
```
AI-DRIVEN-FOOD-SUPPLY-CHAIN-OPTIMIZER/
├── ai_models/                    # TensorFlow Lite models and training scripts
│   ├── README.md
│   └── shelf_life_model.tflite   # Placeholder model
├── backend/                      # Node.js/Express server
│   ├── src/
│   │   ├── config/               # Database configuration
│   │   │   └── db.js
│   │   ├── controllers/          # Request handlers
│   │   │   ├── shelfLifeController.js
│   │   │   └── vendorController.js
│   │   ├── middleware/           # Custom middleware
│   │   │   └── authMiddleware.js
│   │   ├── models/               # Database models
│   │   │   └── Vendor.js
│   │   ├── routes/               # API route definitions
│   │   │   ├── shelfLifeRoutes.js
│   │   │   └── vendorRoutes.js
│   │   ├── uploads/              # Uploaded produce images
│   │   ├── .env.example          # Environment variables template
│   │   ├── server.js             # Entry point
│   │   ├── package.json
│   │   └── package-lock.json
├── frontend/                     # React/Vite application
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   └── ShelfLifePredictor.js
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # Entry point
│   │   ├── index.html            # HTML template
│   │   └── vite.config.js        # Vite configuration
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
├── docs/                         # Additional documentation
├── .gitignore                    # Global gitignore
├── PROJECT_DOC.md                # Detailed project documentation
├── README.md                     # This file
└── LICENSE                       # MIT License
```

## Setup Instructions
### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas cluster)
- npm (comes with Node.js)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` to set your:
   - `MONGODB_URI` (MongoDB connection string)
   - `JWT_SECRET` (a strong secret for JWT signing)
   - `PORT` (optional, defaults to 5000)

5. Start the development server:
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev   # (if you add nodemon as dev dependency)
   ```

6. The API will be available at `http://localhost:5000`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The app will be available at `http://localhost:5173` (or another port if 5173 is in use)

### Important Notes
- The frontend is configured to proxy API requests to `http://localhost:5000` during development
- Make sure the backend is running before testing frontend features that require API calls
- Uploaded images are stored in `backend/uploads/` directory

## API Endpoints
### Health Check
- `GET /` - API status information
- `GET /health` - Health check endpoint

### Shelf-Life Prediction
- `POST /api/shelf-life/predict` - Upload a produce image to get shelf-life prediction
  - **Headers**: `Content-Type: multipart/form-data`
  - **Body**: `produceImage` (file)
  - **Response**: 
    ```json
    {
      "success": true,
      "data": {
        "shelfLifeDays": 5,
        "confidence": 0.85,
        "fileId": "produceImage-123456789.jpg",
        "message": "Shelf-life prediction: 5 day(s)"
      }
    }
    ```

### Vendor Management
- `POST /api/vendors/register` - Register a new vendor
  - **Body**: 
    ```json
    {
      "name": "joshua mwendwa",
      "phoneNumber": "+254700000000",
      "password": "securepassword123",
      "location": [36.8219, -1.2921], // [longitude, latitude]
      "market": "Marikiti",
      "stallNumber": "A12",
      "primaryProduce": ["tomatoes", "onions"],
      "preferredLanguage": "en"
    }
    ```
  - **Response**: Vendor data and JWT token

- `POST /api/vendors/login` - Login vendor
  - **Body**: 
    ```json
    {
      "phoneNumber": "+254700000000",
      "password": "securepassword123"
    }
    ```
  - **Response**: Vendor data and JWT token

- `GET /api/vendors/profile` - Get vendor profile (protected)
  - **Headers**: `Authorization: Bearer <token>`
  - **Response**: Vendor data (excluding password)

- `PUT /api/vendors/profile` - Update vendor profile (protected)
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**: Fields to update (same as registration schema)
  - **Response**: Updated vendor data and new JWT token

## Frontend Components
### ShelfLifePredictor
Located at `frontend/src/components/ShelfLifePredictor.js`
- Allows users to upload an image of produce
- Sends image to backend for shelf-life prediction
- Displays prediction results with confidence percentage
- Handles loading states and error messages

## Next Steps
### Immediate Priorities
1. **Implement Actual AI Model**
   - Collect and label dataset of produce images with shelf-life measurements
   - Train regression model using transfer learning (MobileNetV2/EfficientNet)
   - Convert to TensorFlow Lite format
   - Replace simulated prediction with real model inference in backend

2. **Expand API Functionality**
   - Dynamic pricing engine endpoints
   - B2B marketplace APIs (listings, transactions, matching)
   - Analytics dashboard endpoints
   - Inventory management endpoints

3. **Enhance Frontend**
   - Vendor dashboard with inventory overview
   - Marketplace browsing interface
   - Analytics visualization
   - Offline-first capabilities with service workers
   - Push notifications for expiring produce

4. **Partnerships & Integrations**
   - Boda-Boda logistics API integration
   - Mobile money payment gateway (M-Pesa, etc.)
   - Local market partnerships for pilot programs

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [PROJECT_DOC.md](PROJECT_DOC.md) for detailed contribution guidelines and project roadmap.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Inspired by the need to reduce food waste in emerging markets
- Built with ❤️ for smallholder farmers and vendors
- Special thanks to open-source contributors whose tools make this possible

---
*Last updated: May 15, 2026*
*This README reflects the current state of implementation as documented in PROJECT_DOC.md*