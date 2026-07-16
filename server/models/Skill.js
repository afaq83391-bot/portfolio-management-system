import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    maxlength: 50
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: 50
  },
  proficiency: {
    type: Number,
    required: [true, 'Proficiency level is required'],
    min: 1,
    max: 100
  },
  icon: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#f59e0b'
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Skill', skillSchema);