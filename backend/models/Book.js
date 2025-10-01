import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  year: { type: Number },
  genre: { type: String, trim: true },
  copiesTotal: { type: Number, default: 1 },
  copiesAvailable: { type: Number, default: 1 },
  coverUrl: { type: String, default: "" } // ruta relativa a /uploads/...
}, { timestamps: true });

const Book = mongoose.model("Book", BookSchema);

export default Book;
