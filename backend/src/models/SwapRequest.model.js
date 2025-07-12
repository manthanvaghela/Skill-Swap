import mongoose from 'mongoose'

const swapSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,   // optional now
    default: null
  },
  offeredSkill: {
    type: String,
    required: true,
    trim: true
  },
  requestedSkill: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    default: '',
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'open', 'closed'],
    default: 'pending'
  }
}, { timestamps: true })

export default mongoose.model('Swap', swapSchema)
