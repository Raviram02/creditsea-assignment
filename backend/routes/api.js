const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { parseXML, extractCreditData } = require('../utils/xmlParser');
const CreditReport = require('../models/CreditReport');

// Upload and process XML file
router.post('/upload', upload.single('xmlFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Parse XML
    const xmlData = req.file.buffer.toString('utf-8');
    const parsedXML = await parseXML(xmlData);

    // Extract credit data
    const creditData = extractCreditData(parsedXML);

    // Check if report already exists
    const existingReport = await CreditReport.findOne({
      reportNumber: creditData.reportNumber,
    });

    let savedReport;
    if (existingReport) {
      // Update existing report
      Object.assign(existingReport, creditData);
      savedReport = await existingReport.save();
    } else {
      // Create new report
      const newReport = new CreditReport(creditData);
      savedReport = await newReport.save();
    }

    res.status(200).json({
      success: true,
      message: 'File processed successfully',
      data: savedReport,
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing file: ' + error.message,
    });
  }
});

//Get all reports
router.get('/reports', async (req, res) => {
  try {
    const reports = await CreditReport.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reports: ' + error.message,
    });
  }
});


module.exports = router;