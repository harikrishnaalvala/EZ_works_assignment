const File = require('../models/File');
const crypto = require('crypto');
const path = require('path');

exports.uploadFile = async (req, res) => {
  try {
    console.log('Request Headers:', req.headers); 
    console.log('Request Body:', req.body);      
    console.log('Request File:', req.file);      

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.status(201).json({ message: 'File uploaded successfully', file: req.file });
  } catch (err) {
    console.error('Error during file upload:', err.message);
    res.status(500).json({ message: 'Error uploading file', error: err.message });
  }
};


exports.listFiles = async (req, res) => {
  try {
    const files = await File.find({}).populate('uploaded_by', 'username');
    res.json({ files });
  } catch (err) {
    res.status(500).json({ message: 'Error listing files', error: err.message });
  }
};


exports.downloadFile = async (req, res) => {
  try {
    const { file_id } = req.params;
    const file = await File.findById(file_id);

    if (!file) return res.status(404).json({ message: 'File not found' });

    res.json({ download_link: `http://localhost:3000/uploads/${file.encrypted_url}` });
  } catch (err) {
    res.status(500).json({ message: 'Error downloading file', error: err.message });
  }
};
