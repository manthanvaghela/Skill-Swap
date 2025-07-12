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
    required: true 
  },
  offeredSkill: { 
    type: String, 
    required: true, 
    trim: true,
    minlength: 1,
    maxlength: 100
  },
  requestedSkill: { 
    type: String, 
    required: true, 
    trim: true,
    minlength: 1,
    maxlength: 100
  },
  message: { 
    type: String, 
    trim: true,
    maxlength: 500,
    default: ''
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending',
    required: true
  }
}, { timestamps: true })

export default mongoose.model('Swap', swapSchema)
