import express from "express";
import * as roadmapController from "./controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// All roadmap routes are protected (require login)
router.use(protect);

/**
 * @openapi
 * /api/roadmap/me:
 *   get:
 *     summary: Get current student's roadmap progress
 *     tags: [Roadmap]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Roadmap data
 */
router.get("/me", roadmapController.getMyProgress);

/**
 * @openapi
 * /api/roadmap/sync:
 *   post:
 *     summary: Sync roadmap with latest resume analysis
 *     tags: [Roadmap]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sync successful
 */
router.post("/sync", roadmapController.syncRoadmap);

/**
 * @openapi
 * /api/roadmap/update-topic:
 *   patch:
 *     summary: Update completion status of a roadmap topic
 *     tags: [Roadmap]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topicId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [not-started, in-progress, completed]
 *     responses:
 *       200:
 *         description: Topic updated
 */
router.patch("/update-topic", roadmapController.updateTopicStatus);

export default router;
