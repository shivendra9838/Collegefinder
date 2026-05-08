import { Router, type IRouter } from "express";
import { SavedCollege, SavedComparison, College } from "@workspace/db";
import { requireAuth, getUserId } from "../lib/auth";

const router: IRouter = Router();

router.get("/saved/colleges", requireAuth, async (req, res): Promise<void> => {
  const userId = getUserId(req);

  const saved = await SavedCollege.find({ userId: userId! })
    .populate("collegeId")
    .lean();

  res.json({
    savedColleges: saved
      .filter((s: any) => s.collegeId != null)
      .map((s: any) => ({
        ...s,
        id: s._id,
        createdAt: s.createdAt.toISOString(),
        college: { ...s.collegeId, id: s.collegeId._id },
      })),
  });
});

router.post("/saved/colleges", requireAuth, async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const { collegeId } = req.body;

  if (!collegeId) {
    res.status(400).json({ error: "collegeId is required" });
    return;
  }

  const existing = await SavedCollege.findOne({ userId: userId!, collegeId });

  if (existing) {
    res.status(409).json({ error: "College already saved" });
    return;
  }

  const saved = await SavedCollege.create({ userId: userId!, collegeId });
  const college = await College.findById(collegeId).lean();

  res.status(201).json({
    ...saved.toObject(),
    id: saved._id,
    createdAt: saved.createdAt.toISOString(),
    college: { ...(college as any), id: (college as any)?._id },
  });
});

router.delete("/saved/colleges/:collegeId", requireAuth, async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const collegeId = req.params.collegeId;

  const result = await SavedCollege.findOneAndDelete({ userId: userId!, collegeId });

  if (!result) {
    res.status(404).json({ error: "Saved college not found" });
    return;
  }

  res.status(204).send();
});

router.get("/saved/comparisons", requireAuth, async (req, res): Promise<void> => {
  const userId = getUserId(req);

  const comparisons = await SavedComparison.find({ userId: userId! })
    .populate("collegeIds")
    .sort({ createdAt: 1 })
    .lean();

  res.json({
    savedComparisons: comparisons.map((c: any) => ({
      ...c,
      id: c._id,
      createdAt: c.createdAt.toISOString(),
      collegeIds: c.collegeIds.map((col: any) => ({ ...col, id: col._id })),
    })),
  });
});

router.post("/saved/comparisons", requireAuth, async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const { name, collegeIds } = req.body;

  if (!name || !Array.isArray(collegeIds) || collegeIds.length < 2) {
    res.status(400).json({ error: "name and at least 2 collegeIds are required" });
    return;
  }

  const comparison = await SavedComparison.create({
    userId: userId!,
    name: name.trim(),
    collegeIds,
  });

  res.status(201).json({
    ...comparison.toObject(),
    id: comparison._id,
    createdAt: comparison.createdAt.toISOString(),
  });
});

router.delete("/saved/comparisons/:id", requireAuth, async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const id = req.params.id;

  const result = await SavedComparison.findOneAndDelete({ userId: userId!, _id: id });

  if (!result) {
    res.status(404).json({ error: "Saved comparison not found" });
    return;
  }

  res.status(204).send();
});

export default router;

