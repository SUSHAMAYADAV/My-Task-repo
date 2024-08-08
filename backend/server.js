const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const pdfParse = require('pdf-parse');
const app = express();
app.use(fileUpload());
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB Atlas
const mongoUri = 'mongodb+srv://susha:Sush1024@cluster0.zbfhqkt.mongodb.net/files';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define a schema and model for storing file data
const fileSchema = new mongoose.Schema({
  name: String,
  content: String,
  summary: String,
});

const File = mongoose.model('File', fileSchema);

app.post('/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const uploadedFile = req.files.file;
  const filePath = path.join(__dirname, uploadedFile.name);

  const fileExtension = path.extname(uploadedFile.name).toLowerCase();

  if (fileExtension !== '.txt' && fileExtension !== '.pdf') {
    return res.status(400).send('Only text and PDF files are supported.');
  }

  uploadedFile.mv(filePath, async (err) => {
    if (err) return res.status(500).send(err);

    let fileContent;
    if (fileExtension === '.txt') {
      fileContent = fs.readFileSync(filePath, 'utf8');
      await processFile(fileContent, uploadedFile.name, res, filePath);
    } else if (fileExtension === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      pdfParse(dataBuffer).then(async data => {
        fileContent = data.text;
        await processFile(fileContent, uploadedFile.name, res, filePath);
      }).catch(parseErr => {
        fs.unlink(filePath, () => {});
        return res.status(500).send(parseErr);
      });
    }
  });
});

const processFile = async (content, fileName, res, filePath) => {
  const summary = summarizeText(content);

  // Save file data to MongoDB
  const newFile = new File({
    name: fileName,
    content,
    summary,
  });

  await newFile.save();

  // Delete the file after processing
  fs.unlink(filePath, (unlinkErr) => {
    if (unlinkErr) console.error('File deletion error:', unlinkErr);
  });

  res.json({ summary });
};

const summarizeText = (text) => {
  // Simple summarization: return the first 3 sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  if (!sentences) return text.substring(0, 100) + '...';
  return sentences.slice(0, 5).join(' ');
};

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
