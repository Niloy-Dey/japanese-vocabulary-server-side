
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors


// Initialize the app
const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors()); 

// Correct MongoDB connection
const mongoURI = 'mongodb+srv://niloydeyce:aG2a1F8pvMpzDi0d@cluster0.n8nk7.mongodb.net/e-japanis-project';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const Lesson = mongoose.model('Lesson', {}, 'lessons'); // Empty schema object


app.get('/api/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching lessons' });
  }
});


app.get('/api/lessons/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (lesson) {
      res.json(lesson);
    } else {
      res.status(404).json({ error: 'Lesson not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching lesson' });
  }
});



// Route to add a new lesson
app.post('/api/lessons', async (req, res) => {
  try {
    const newLesson = new Lesson(req.body);
    const savedLesson = await newLesson.save();
    res.status(201).json(savedLesson);
  } catch (err) {
    res.status(500).json({ error: 'Error saving lesson' });
  }
});





// Define the User schema and model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// GET method to fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// POST method to create a new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const newUser = new User({ name, email, role });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    // Handle duplicate email error
    if (err.code === 11000) {
      res.status(400).json({ error: 'Email already exists.' });
    } else {
      res.status(500).json({ error: 'Error saving user' });
    }
  }
});




















app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
