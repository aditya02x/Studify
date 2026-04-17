import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },  
  user: {   // ✅ change author → user
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lecture: {   // ✅ ADD THIS (VERY IMPORTANT)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture',
    required: true,
  }
}, {
  timestamps: true,
});

export default mongoose.model('Comment', commentSchema);