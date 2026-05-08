import { Router, type IRouter } from "express";
import { College, Course, Review } from "@workspace/db";
import {
  ListCollegesQueryParams,
  GetCollegeParams,
  GetCollegeCoursesListParams,
  GetCollegeReviewsParams,
  CompareCollegesBody,
  PredictCollegesBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/colleges", async (req, res): Promise<void> => {
  const parsed = ListCollegesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { search, location, minFees, maxFees, course, page, limit } = parsed.data;
  const skip = ((page ?? 1) - 1) * (limit ?? 12);
  const take = limit ?? 12;

  const query: any = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  if (location) {
    query.state = { $regex: location, $options: "i" };
  }
  if (minFees != null || maxFees != null) {
    query.totalFees = {};
    if (minFees != null) query.totalFees.$gte = minFees;
    if (maxFees != null) query.totalFees.$lte = maxFees;
  }
  if (course) {
    query.topCourses = course;
  }

  const [colleges, total] = await Promise.all([
    College.find(query).skip(skip).limit(take).lean(),
    College.countDocuments(query),
  ]);

  res.json({
    colleges: colleges.map((c: any) => ({ ...c, id: c._id })),
    total,
    page: page ?? 1,
    limit: take,
    totalPages: Math.ceil(total / take),
  });
});

router.get("/colleges/locations", async (_req, res): Promise<void> => {
  const locations = await College.distinct("state");
  res.json({ locations: locations.sort() });
});

router.get("/colleges/courses", async (_req, res): Promise<void> => {
  const courses = await College.distinct("topCourses");
  res.json({ courses: courses.sort() });
});

router.get("/colleges/stats", async (_req, res): Promise<void> => {
  const statsResult = await College.aggregate([
    {
      $group: {
        _id: null,
        totalColleges: { $sum: 1 },
        avgRating: { $avg: "$rating" },
        avgPlacement: { $avg: "$placementPercentage" },
      },
    },
  ]);

  const topLocations = await College.aggregate([
    { $group: { _id: "$state", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  const stats = statsResult[0] || { totalColleges: 0, avgRating: 0, avgPlacement: 0 };
  res.json({
    totalColleges: stats.totalColleges,
    avgRating: parseFloat((stats.avgRating || 0).toFixed(1)),
    avgPlacement: parseFloat((stats.avgPlacement || 0).toFixed(1)),
    topLocations: topLocations.map((r) => ({
      location: r._id,
      count: r.count,
    })),
  });
});

router.get("/colleges/:id", async (req, res): Promise<void> => {
  const params = GetCollegeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const college = await College.findById(params.data.id).lean();

  if (!college) {
    res.status(404).json({ error: "College not found" });
    return;
  }

  res.json({ ...college, id: college._id });
});

router.get("/colleges/:id/courses", async (req, res): Promise<void> => {
  const params = GetCollegeCoursesListParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const courses = await Course.find({ collegeId: params.data.id }).lean();
  res.json({ courses: courses.map((c: any) => ({ ...c, id: c._id })) });
});

router.get("/colleges/:id/reviews", async (req, res): Promise<void> => {
  const params = GetCollegeReviewsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const reviews = await Review.find({ collegeId: params.data.id })
    .sort({ createdAt: 1 })
    .lean();

  res.json({
    reviews: reviews.map((r: any) => ({
      ...r,
      id: r._id,
      createdAt: r.createdAt.toISOString(),
    })),
  });
});

router.post("/colleges/compare", async (req, res): Promise<void> => {
  const parsed = CompareCollegesBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const colleges = await College.find({
    _id: { $in: parsed.data.collegeIds },
  }).lean();

  res.json({ colleges: colleges.map((c: any) => ({ ...c, id: c._id })) });
});

router.post("/colleges/predict", async (req, res): Promise<void> => {
  const body = req.body.data || req.body;
  const parsed = PredictCollegesBody.safeParse(body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { exam, rank, category = "General" } = parsed.data;

  const colleges = await College.find({
    examAccepted: exam,
  }).lean();

  const results = colleges
    .map((college: any) => {
      const baseCutoff = Math.round(
        (10 - college.rating) * 5000 + (college.nirf ?? 50) * 200
      );
      let multiplier = 1;
      if (category === "OBC") multiplier = 1.3;
      else if (category === "SC" || category === "ST") multiplier = 2.0;
      else if (category === "EWS") multiplier = 1.15;

      const cutoffRank = Math.round(baseCutoff * multiplier);

      let admissionChance: "High" | "Medium" | "Low";
      if (rank <= cutoffRank * 0.7) admissionChance = "High";
      else if (rank <= cutoffRank) admissionChance = "Medium";
      else admissionChance = "Low";

      return { ...college, id: college._id, cutoffRank, admissionChance };
    })
    .filter((c) => c.admissionChance !== "Low" || rank <= c.cutoffRank * 1.4)
    .sort((a, b) => a.cutoffRank - b.cutoffRank)
    .slice(0, 20);

  res.json({ exam, rank, category, colleges: results });
});

export default router;

