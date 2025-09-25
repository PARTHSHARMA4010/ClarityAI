import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from './db.js';
import User from './models/User.js';

dotenv.config();
connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const AssignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  fileUrl: String,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
const Assignment = mongoose.model('Assignment', AssignmentSchema);

const SubmissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submissionFileUrl: String,
  qaFormat: Array,
});
const Submission = mongoose.model('Submission', SubmissionSchema);

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

app.post('/api/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ detail: 'User already exists.' });
    user = new User({ email, password, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) { res.status(500).json({ detail: 'Server error' }); }
});

// --- CORRECTED LOGIN ROUTE ---
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ detail: 'Invalid credentials.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ detail: 'Invalid credentials.' });
    
    // Create the payload
    const payload = { user: { id: user.id, role: user.role } };
    // If the user is a student, add their teacherId to the payload
    if (user.role === 'student') {
      payload.user.teacherId = user.teacherId;
    }
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ access_token: token });
  } catch (error) { res.status(500).json({ detail: 'Server error' }); }
});

app.post('/api/assignments', auth, upload.single('assignmentFile'), async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ detail: 'Access denied.' });
  }
  try {
    const { title, description } = req.body;
    let fileUrl = null;
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'auto', folder: 'clarity-ai-assignments' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
        uploadStream.end(req.file.buffer);
      });
      fileUrl = uploadResult.secure_url;
    }
    const assignment = new Assignment({ title, description, fileUrl, teacherId: req.user.id });
    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ detail: 'Server error while creating assignment.' });
  }
});

app.get('/api/assignments', auth, async (req, res) => {
   if (req.user.role !== 'teacher') {
    return res.status(403).json({ detail: 'Access denied.' });
  }
  try {
    const assignments = await Assignment.find({ teacherId: req.user.id });
    const assignmentsWithCounts = await Promise.all(
      assignments.map(async (assignment) => {
        const submissionCount = await Submission.countDocuments({ assignmentId: assignment._id });
        return { ...assignment.toObject(), submissionCount };
      })
    );
    res.json(assignmentsWithCounts);
  } catch (error) {
     res.status(500).json({ detail: 'Server error while fetching assignments.' });
  }
});

// --- CORRECTED STUDENT ASSIGNMENTS ROUTE ---
// In backend/index.js

app.get('/api/assignments/student', auth, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ detail: 'Access denied.' });
  }
  try {
    if (!req.user.teacherId) {
      return res.json([]);
    }
    const assignments = await Assignment.find({ teacherId: req.user.teacherId });
    
    // ADD THIS LINE
    console.log('--- BACKEND CHECK --- Found assignments:', assignments); 
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ detail: 'Server error fetching assignments.' });
  }
});

app.post('/api/assignments/:id/submit', auth, upload.single('submissionFile'), async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ detail: 'Access denied.' });
  }
  try {
    const assignmentId = req.params.id;
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ detail: 'Assignment not found.' });
    }
    const mockQaFormat = [
      { question: 'Placeholder Question 1', answer: 'Placeholder Answer 1' },
      { question: 'Placeholder Question 2', answer: 'Placeholder Answer 2' },
    ];
    const submission = new Submission({
      assignmentId,
      studentId: req.user.id,
      teacherId: assignment.teacherId,
      qaFormat: mockQaFormat,
    });
    await submission.save();
    res.status(201).json({ message: 'Submission successful!' });
  } catch (error) {
    res.status(500).json({ detail: 'Server error during submission.' });
  }
});

// Add this new route to backend/index.js

app.get('/api/assignments/:id/analyze', auth, async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ detail: 'Access denied.' });
  }
  try {
    const assignmentId = req.params.id;
    const submissions = await Submission.find({ assignmentId });

    if (submissions.length === 0) {
      return res.status(400).json({ detail: 'No submissions yet for this assignment.' });
    }

    // TODO: Your ML teammate's logic goes here.
    // They will take the 'submissions' array, process the qaFormat of each,
    // and send it to LLM #2 to generate the final report.
    
    // For now, we return a mock report.
    const mockReport = {
      clusters: [
        {
          title: "Mock: Misunderstanding of Core Concept",
          explanation: "This is a placeholder explanation showing that some students are confusing the main idea.",
          examples: ["'The sun revolves around the Earth.'"],
          actionPlan: {
            suggestion: "Consider a 5-minute review of the heliocentric model.",
            quiz: [{ question: "True or False: The Earth revolves around the Sun." }]
          }
        }
      ]
    };

    res.json(mockReport);

  } catch (error) {
    res.status(500).json({ detail: 'Server error during analysis.' });
  }
});


// Add this new route to backend/index.js

// Replace the old /api/assignments/:id/submit route in backend/index.js

app.get('/api/assignments/:id/submissions', auth, async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ detail: 'Access denied.' });
  }
  try {
    const assignmentId = req.params.id;
    const submissions = await Submission.find({ assignmentId });

    // Manually populate student emails for robustness
    const populatedSubmissions = await Promise.all(
      submissions.map(async (sub) => {
        const student = await User.findById(sub.studentId).select('email');
        return {
          ...sub.toObject(),
          studentId: student // Replace the ID with the student object (containing email)
        };
      })
    );
    
    res.json(populatedSubmissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ detail: 'Server error fetching submissions.' });
  }
});




// The rest of the file stays the same



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});