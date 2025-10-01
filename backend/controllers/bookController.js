const Book = require('../models/Book');

exports.getAll = async (req, res) => {
  try {
    const q = req.query.q || '';
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '30');
    const filter = q ? { $or: [{ title: new RegExp(q, 'i') }, { author: new RegExp(q, 'i') }] } : {};

    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(filter);
    res.json({ data: books, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: 'Libro no encontrado' });
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, author, isbn, description, copiesTotal } = req.body;
    if (!title || !author) return res.status(400).json({ msg: 'Faltan campos' });

    const book = new Book({
      title,
      author,
      isbn: isbn || '',
      description: description || '',
      copiesTotal: parseInt(copiesTotal) || 1,
      copiesAvailable: parseInt(copiesTotal) || 1
    });

    if (req.file) {
      book.coverUrl = `/uploads/${req.file.filename}`;
    }

    await book.save();
    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, author, isbn, description, copiesTotal } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: 'Libro no encontrado' });

    // update numeric fields safely
    if (copiesTotal) {
      const newTotal = parseInt(copiesTotal);
      const diff = newTotal - book.copiesTotal;
      book.copiesTotal = newTotal;
      book.copiesAvailable = Math.max(0, book.copiesAvailable + diff);
    }

    if (title) book.title = title;
    if (author) book.author = author;
    if (isbn) book.isbn = isbn;
    if (description) book.description = description;
    if (req.file) book.coverUrl = `/uploads/${req.file.filename}`;

    await book.save();
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ msg: 'Libro no encontrado' });
    res.json({ msg: 'Libro eliminado', book });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
