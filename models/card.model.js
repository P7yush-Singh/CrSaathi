// models/card.model.js
import mongoose from 'mongoose';

const CardSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  bank: { type: String, trim: true },
  category: { type: String, trim: true }, // e.g., "Travel", "Cashback", "Rewards"
  annualFee: { type: Number, default: 0 },
  rewardsText: { type: String, trim: true },
  eligibility: {
    minScore: { type: Number, default: 0 },
    minIncome: { type: Number, default: 0 },
  },
  features: [String],
  pros: [String],
  cons: [String],
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

CardSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Card || mongoose.model('Card', CardSchema);
