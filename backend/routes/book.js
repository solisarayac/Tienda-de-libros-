import express from "express";
import upload from "../middlewares/upload.js";
import auth from "../middlewares/auth.js";
import isAdmin from "../middlewares/admin.js";
import * as ctrl from "../controllers/bookController.js";

const router = express.Router();

// Public read
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getOne);

// Protected
router.post("/", auth, upload.single("cover"), ctrl.create); // todos pueden agregar
router.put("/:id", auth, isAdmin, upload.single("cover"), ctrl.update); // solo admin
router.delete("/:id", auth, isAdmin, ctrl.remove); // solo admin

export default router;

