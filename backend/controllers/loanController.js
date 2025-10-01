import Loan from '../models/Loan.js';
import Book from '../models/Book.js';

export const getUserLoans = async (req, res) => {
  try {
    const user = req.user;
    let loans;

    if (user.role === 'admin') {
      // Admin ve todos los préstamos
      loans = await Loan.find().populate('book user').sort({ borrowedAt: -1 });
    } else {
      // Student ve solo sus préstamos
      loans = await Loan.find({ user: user._id }).populate('book').sort({ borrowedAt: -1 });
    }

    const now = new Date();
    for (const loan of loans) {
      if (loan.status === 'borrowed' && loan.dueDate < now) loan.status = 'overdue';
    }

    res.json(loans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const borrow = async (req, res) => {
  try {
    if (req.user.role !== 'student')
      return res.status(403).json({ msg: 'Solo estudiantes pueden pedir prestado' });

    const { bookId, days } = req.body;
    if (!bookId) return res.status(400).json({ msg: 'bookId es requerido' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ msg: 'Libro no encontrado' });

    if (book.copiesAvailable < 1) return res.status(400).json({ msg: 'No hay copias disponibles' });

    book.copiesAvailable -= 1;
    await book.save();

    const borrowedAt = new Date();
    const dueDate = new Date(borrowedAt);
    dueDate.setDate(dueDate.getDate() + (parseInt(days) || 14));

    const loan = new Loan({
      user: req.user._id,
      book: book._id,
      borrowedAt,
      dueDate,
      status: 'borrowed'
    });

    await loan.save();
    res.status(201).json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const returnBook = async (req, res) => {
  try {
    const loanId = req.params.id;
    const loan = await Loan.findById(loanId).populate('book');
    if (!loan) return res.status(404).json({ msg: 'Préstamo no encontrado' });

    if (loan.status === 'returned') return res.status(400).json({ msg: 'Libro ya fue devuelto' });

    loan.returnedAt = new Date();
    loan.status = 'returned';
    await loan.save();

    const book = await Book.findById(loan.book._id);
    book.copiesAvailable = (book.copiesAvailable || 0) + 1;
    await book.save();

    res.json({ msg: 'Libro devuelto', loan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
