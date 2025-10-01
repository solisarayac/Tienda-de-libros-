import express from "express";
import upload from "../middlewares/upload.js";
import auth from "../middlewares/auth.js";
import * as ctrl from "../controllers/bookController.js";

const router = express.Router();

// Public read
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getOne);

// Protected (create/update/delete)
router.post("/", auth, upload.single("cover"), ctrl.create);
router.put("/:id", auth, upload.single("cover"), ctrl.update);
router.delete("/:id", auth, ctrl.remove);

export default router;
