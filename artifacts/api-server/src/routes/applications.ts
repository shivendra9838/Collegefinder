import { Router, type IRouter } from "express";
import { Application, College } from "@workspace/db";
import { requireAuth, getUserId } from "../lib/auth";

const router: IRouter = Router();

router.get("/applications", requireAuth, async (req, res): Promise<void> => {
  const userId = getUserId(req);

  const apps = await Application.find({ userId: userId! })
    .populate("collegeId")
    .sort({ appliedAt: -1 })
    .lean();

  res.json({
    applications: apps
      .filter((a: any) => a.collegeId != null)
      .map((a: any) => ({
        ...a,
        id: a._id,
        appliedAt: a.appliedAt.toISOString(),
        college: { ...a.collegeId, id: a.collegeId._id },
      })),
  });
});

router.post("/applications", requireAuth, async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const { collegeId } = req.body;

  if (!collegeId) {
    res.status(400).json({ error: "collegeId is required" });
    return;
  }

  const existing = await Application.findOne({ userId: userId!, collegeId });

  if (existing) {
    res.status(409).json({ error: "Already applied to this college" });
    return;
  }

  const app = await Application.create({ 
    userId: userId!, 
    collegeId,
    status: "Pending"
  });
  
  const college = await College.findById(collegeId).lean();

  res.status(201).json({
    ...app.toObject(),
    id: app._id,
    appliedAt: app.appliedAt.toISOString(),
    college: { ...(college as any), id: (college as any)?._id },
  });
});

export default router;
