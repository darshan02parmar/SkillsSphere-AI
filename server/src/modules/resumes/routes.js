import express from "express";
import { uploadResumeMiddleware } from "../../middleware/uploadResume.js";
import {
  uploadResume,
  analyzeResume,
  getResumeResult,
  getLatestResume
} from "./controller.js";


import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /api/resume/upload:
 *   post:
 *     summary: Upload a resume file
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Resume uploaded successfully
 */
router.post("/upload", protect, authorizeRoles("student"), uploadResumeMiddleware, uploadResume);

/**
 * @openapi
 * /api/resume/analyze:
 *   post:
 *     summary: Upload and analyze a resume
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               jobDescription:
 *                 type: string
 *                 description: Optional JD text for benchmarking
 *     responses:
 *       200:
 *         description: Analysis complete
 */
router.post("/analyze", protect, authorizeRoles("student"), uploadResumeMiddleware, analyzeResume);

/**
 * @openapi
 * /api/resume/me/latest:
 *   get:
 *     summary: Get the current user's latest resume analysis
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/me/latest", protect, getLatestResume);

/**
 * @openapi
 * /api/resume/result/{id}:
 *   get:
 *     summary: Get a specific resume analysis result by ID
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/result/:id", protect, getResumeResult);


export default router;
