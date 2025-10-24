# CreditSea - Credit Report Analysis System

A full-stack MERN application that processes XML files containing soft credit pull data from Experian, extracts relevant information, stores it in MongoDB, and presents comprehensive credit reports through a React-based user interface.

## 🚀 Features

- **XML File Upload**: Upload Experian credit report XML files
- **Data Extraction**: Automatically parse and extract credit information
- **MongoDB Storage**: Persistent storage with well-designed schema
- **Interactive Reports**: Beautiful, responsive UI to view credit reports
- **RESTful API**: Clean API endpoints following REST principles
- **Error Handling**: Robust error handling and validation
- **Responsive Design**: Mobile-friendly interface

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)

## ⚙️ Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**
- **Git**

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/creditsea-assignment.git
cd creditsea-assignment
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

## 🔧 Configuration

### Backend Configuration

1. Create a `.env` file in the `backend` directory:
```bash
cd backend
touch .env
```

2. Add the following environment variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/creditsea
NODE_ENV=development
```

### MongoDB Setup

1. **Start MongoDB** (if not already running):
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
```

2. **Verify MongoDB is running**:
```bash
mongo --eval "db.adminCommand('ping')"
```

## 🏃 Running the Application

### Method 1: Run Backend and Frontend Separately

#### Start the Backend Server
```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

#### Start the Frontend Development Server

Open a new terminal:
```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

### Method 2: Using Concurrently (Optional)

You can add a root `package.json` to run both servers simultaneously:

**Root package.json:**
```json
{
  "name": "creditsea-fullstack",
  "version": "1.0.0",
  "scripts": {
    "install-all": "cd backend && npm install && cd ../frontend && npm install",
    "start": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm start\"",
    "backend": "cd backend && npm run dev",
    "frontend": "cd frontend && npm start"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

Then run:
```bash
npm install
npm run install-all
npm start
```

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Upload XML File

**POST** `/upload`

Upload and process an XML credit report file.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with key `xmlFile` containing the XML file

**Response:**
```json
{
  "success": true,
  "message": "File processed successfully",
  "data": {
    "_id": "64f123abc...",
    "reportNumber": "1595504758919",
    "basicDetails": {
      "name": "Sagar ugle",
      "mobilePhone": "9819137672",
      "pan": "AOZPB0247S",
      "creditScore": 719
    },
    "reportSummary": {
      "totalAccounts": 4,
      "activeAccounts": 3,
      "closedAccounts": 1,
      "currentBalance": 245000,
      "securedAmount": 85000,
      "unsecuredAmount": 160000,
      "last7DaysEnquiries": 0
    },
    "creditAccounts": [...]
  }
}
```

#### 2. Get All Reports

**GET** `/reports`

Retrieve all stored credit reports.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f123abc...",
      "reportNumber": "1595504758919",
      "basicDetails": {...},
      "reportSummary": {...},
      "creditAccounts": [...],
      "createdAt": "2023-09-01T10:30:00.000Z"
    }
  ]
}
```

#### 3. Get Report by ID

**GET** `/reports/:id`

Retrieve a specific report by its MongoDB ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f123abc...",
    "reportNumber": "1595504758919",
    ...
  }
}
```

#### 4. Delete Report

**DELETE** `/reports/:id`

Delete a specific report by its MongoDB ID.

**Response:**
```json
{
  "success": true,
  "message": "Report deleted successfully"
}
```

#### 5. Health Check

**GET** `/health`

Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## 🗄️ Database Schema

### CreditReport Model
```javascript
{
  reportNumber: String (unique, required),
  basicDetails: {
    name: String,
    mobilePhone: String,
    pan: String,
    creditScore: Number
  },
  reportSummary: {
    totalAccounts: Number,
    activeAccounts: Number,
    closedAccounts: Number,
    currentBalance: Number,
    securedAmount: Number,
    unsecuredAmount: Number,
    last7DaysEnquiries: Number
  },
  creditAccounts: [
    {
      bank: String,
      accountNumber: String,
      accountType: String,
      portfolioType: String,
      currentBalance: Number,
      amountOverdue: Number,
      accountStatus: String,
      openDate: String,
      closedDate: String,
      creditLimit: Number,
      address: String
    }
  ],
  reportDate: String,
  uploadedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Schema Design Decisions

1. **reportNumber as Unique Identifier**: Used to prevent duplicate reports
2. **Nested Objects**: basicDetails and reportSummary grouped for logical organization
3. **Array of Credit Accounts**: Flexible structure to handle multiple accounts
4. **Timestamps**: Automatic tracking of creation and update times
5. **Number Types**: Used for all monetary values and counts for calculations
6. **String Dates**: Preserved original date format from XML for accuracy

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Test Coverage
```bash
npm test -- --coverage
```

### Manual Testing

1. **Upload XML File**: Use the provided `Sagar_Ugle1.xml` file
2. **Verify Data Extraction**: Check MongoDB for correct data storage
3. **View Reports**: Navigate through the frontend to view the report

### Testing with cURL
```bash
# Upload XML file
curl -X POST http://localhost:5000/api/upload \
  -F "xmlFile=@./sample-xml/Sagar_Ugle1.xml"

# Get all reports
curl http://localhost:5000/api/reports

# Health check
curl http://localhost:5000/health
```

## 📁 Project Structure
```
creditsea-assignment/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   └── CreditReport.js       # Mongoose schema
│   ├── routes/
│   │   └── api.js                # API routes
│   ├── utils/
│   │   └── xmlParser.js          # XML parsing logic
│   ├── middleware/
│   │   └── upload.js             # Multer configuration
│   ├── tests/
│   │   └── api.test.js           # API tests
│   ├── .env                      # Environment variables
│   ├── server.js                 # Express server setup
│   └── package.json              # Backend dependencies
│
├── frontend/
│   ├── public/
│   │   └── index.html            # HTML template
│   ├── src/
│   │   ├── App.js                # Main App component
│   │   ├── CreditReportApp.js    # Credit report component
│   │   ├── index.js              # React entry point
│   │   └── index.css             # Tailwind CSS
│   ├── tailwind.config.js        # Tailwind configuration
│   └── package.json              # Frontend dependencies
│
├── sample-xml/
│   └── Sagar_Ugle1.xml           # Sample XML file
│
└── README.md                      # Project documentation
```

## 🛠️ Technologies Used

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **Multer**: File upload middleware
- **xml2js**: XML parser
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **Morgan**: HTTP request logger

### Frontend
- **React**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Fetch API**: HTTP client

### Development Tools
- **Nodemon**: Auto-restart server on changes
- **Jest**: Testing framework
- **Supertest**: HTTP assertion library

## 🎨 Features Breakdown

### Data Extraction
- ✅ Name extraction from First_Name and Last_Name
- ✅ Mobile phone number
- ✅ PAN (Permanent Account Number)
- ✅ Credit score with confidence level
- ✅ Total, active, and closed accounts count
- ✅ Current balance calculation
- ✅ Secured vs unsecured account amounts
- ✅ Recent credit enquiries (last 7 days)
- ✅ Individual account details with bank names
- ✅ Account numbers and types
- ✅ Current balance and overdue amounts
- ✅ Complete address information

### UI/UX Features
- 📱 Fully responsive design
- 🎨 Modern gradient backgrounds
- 💳 Color-coded account status indicators
- 📊 Financial data formatting (INR currency)
- 📅 Date formatting (DD/MM/YYYY)
- ⚡ Loading states and error handling
- 🔄 Tab-based navigation
- ✨ Smooth transitions and hover effects

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running:
```bash
sudo systemctl status mongod  # Linux
brew services list  # macOS
```

**2. Port Already in Use**
```bash
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Kill the process or change the port:
```bash
lsof -ti:5000 | xargs kill -9
# Or change PORT in .env file
```

**3. CORS Error in Browser**
```bash
Access to fetch at 'http://localhost:5000' from origin 'http://localhost:3000' has been blocked
```
**Solution**: Ensure CORS is properly configured in backend (already included).

**4. File Upload Error**
```bash
Error: File too large
```
**Solution**: Check file size limit in `middleware/upload.js` (default: 10MB).

## 📝 Additional Notes

### Account Type Mapping
- **10**: Credit Card
- **51**: Personal Loan
- **52**: Home Loan

### Account Status Codes
- **11**: Active
- **13**: Closed
- **53**: Active (with suit filed)
- **71**: Active

### Portfolio Types
- **R**: Revolving (Credit Cards)
- **I**: Installment (Loans)

## 🔐 Security Considerations

- File size limits implemented (10MB)
- File type validation (XML only)
- Input sanitization through Mongoose
- Environment variables for sensitive data
- Error messages don't expose internal structure

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)

1. Create `Procfile`:
```
web: node backend/server.js
```

2. Set environment variables in deployment platform

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `build` folder

### Database (MongoDB Atlas)

1. Create a free cluster on MongoDB Atlas
2. Update `MONGODB_URI` in `.env` with Atlas connection string

## 📹 Video Demo

Create a 3-5 minute video covering:
1. Project overview and features
2. Running the backend server
3. Starting the frontend application
4. Uploading an XML file
5. Viewing the processed credit report
6. Showing MongoDB data
7. API testing with Postman/cURL

## 👨‍💻 Author

[Your Name]
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- CreditSea for the assignment
- Experian for the XML format reference
- React and Node.js communities

---

**Made with ❤️ for CreditSea Assignment**