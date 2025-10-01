import mongoose from 'mongoose';

const LoanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  borrowedAt: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnedAt: { type: Date, default: null },
  status: { type: String, enum: ['borrowed','returned','overdue'], default: 'borrowed' }
}, { timestamps: true });

const Loan = mongoose.model('Loan', LoanSchema);

export default Loan;

