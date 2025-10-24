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


