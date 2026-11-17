const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const userRouter = require('./routes/userRouter');
const newsRouter = require('./routes/newsRouter');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/user', userRouter);
app.use('/news', newsRouter);

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: 'wgol8gey',
  api_key: '563454521994185',
  api_secret: 'pMPpo11TKdwtFAq2yiw4wa3VJyo'
});

const storage = multer.memoryStorage();
const upload = multer({ 
  storage, 
  limits: { fileSize: 50 * 1024 * 1024 } 
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' });
  const resourceType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
  const uploadStream = cloudinary.uploader.upload_stream(
    { resource_type: resourceType, folder: 'dailynews' },
    (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Cloudinary upload failed' });
      }
      res.json({ url: result.secure_url });
    }
  );
  uploadStream.end(req.file.buffer);
});

// Connect to MongoDB in the background
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dailynews')
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// START SERVER IMMEDIATELY so Render detects the open port right away!
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});