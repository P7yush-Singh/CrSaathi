// models/callback.model.js
import mongoose from 'mongoose';

const CallbackSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  note: { type: String, trim: true, maxlength: 1000 },
  ip: { type: String },
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// IMPORTANT: use a regular function here (not an arrow) so `this` and `next` work correctly.
CallbackSchema.pre('save', function (next) {
  // update timestamp
  this.updatedAt = Date.now();
  // call next() to continue; next will be the middleware callback function
  next();
});

export default mongoose.models.CallbackRequest || mongoose.model('CallbackRequest', CallbackSchema);
