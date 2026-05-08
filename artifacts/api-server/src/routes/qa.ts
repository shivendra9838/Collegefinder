import { Router, type IRouter } from "express";
import { Question, Answer, College } from "@workspace/db";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.get("/questions", async (req, res): Promise<void> => {
  const collegeId = req.query.collegeId as string | undefined;
  const category = req.query.category as string | undefined;
  const page = parseInt((req.query.page as string) || "1", 10);
  const limit = parseInt((req.query.limit as string) || "15", 10);
  const skip = (page - 1) * limit;

  const query: any = {};
  if (collegeId) {
    query.collegeId = collegeId;
  }
  if (category) {
    query.category = category;
  }

  const [questions, total] = await Promise.all([
    Question.find(query)
      .populate("collegeId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Question.countDocuments(query),
  ]);

  const questionsWithCount = await Promise.all(
    questions.map(async (q: any) => {
      const answerCount = await Answer.countDocuments({ questionId: q._id });
      return {
        ...q,
        id: q._id,
        collegeName: q.collegeId?.name ?? "Unknown College",
        collegeId: q.collegeId?._id ?? q.collegeId,
        answerCount,
        createdAt: q.createdAt.toISOString(),
      };
    })
  );

  res.json({
    questions: questionsWithCount,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

router.post("/questions", async (req, res): Promise<void> => {
  const { collegeId, authorName, title, body, category } = req.body;

  if (!collegeId || !authorName || !title || !body) {
    res.status(400).json({ error: "collegeId, authorName, title, and body are required" });
    return;
  }

  const question = await Question.create({
    collegeId,
    authorName: authorName.trim(),
    title: title.trim(),
    body: body.trim(),
    category: category || "General",
  });

  const college = await College.findById(collegeId).select("name").lean();

  req.log.info({ questionId: question._id }, "Question created");

  res.status(201).json({
    ...question.toObject(),
    id: question._id,
    collegeName: (college as any)?.name ?? "Unknown College",
    answerCount: 0,
    createdAt: question.createdAt.toISOString(),
  });
});

router.get("/questions/:id", async (req, res): Promise<void> => {
  const id = req.params.id;

  const question = await Question.findById(id)
    .populate("collegeId", "name")
    .lean();

  if (!question) {
    res.status(404).json({ error: "Question not found" });
    return;
  }

  const [answers, answerCount] = await Promise.all([
    Answer.find({ questionId: id }).sort({ createdAt: 1 }).lean(),
    Answer.countDocuments({ questionId: id }),
  ]);

  res.json({
    ...question,
    id: question._id,
    collegeName: (question.collegeId as any)?.name ?? "Unknown College",
    collegeId: (question.collegeId as any)?._id ?? question.collegeId,
    answerCount,
    createdAt: (question.createdAt as Date).toISOString(),
    answers: answers.map((a: any) => ({
      ...a,
      id: a._id,
      createdAt: a.createdAt.toISOString(),
    })),
  });
});

router.post("/questions/:id/answers", async (req, res): Promise<void> => {
  const questionId = req.params.id;
  const { authorName, body } = req.body;

  if (!authorName || !body) {
    res.status(400).json({ error: "authorName and body are required" });
    return;
  }

  // Verify question exists
  const question = await Question.findById(questionId);

  if (!question) {
    res.status(404).json({ error: "Question not found" });
    return;
  }

  const answer = await Answer.create({
    questionId,
    authorName: authorName.trim(),
    body: body.trim(),
  });

  req.log.info({ answerId: answer._id, questionId }, "Answer created");

  res.status(201).json({
    ...answer.toObject(),
    id: answer._id,
    createdAt: answer.createdAt.toISOString(),
  });
});

export default router;

