import { z } from "zod";

export const ListCollegesQueryParams = z.object({
  search: z.string().optional(),
  location: z.string().optional(),
  minFees: z.coerce.number().optional(),
  maxFees: z.coerce.number().optional(),
  course: z.string().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export const GetCollegeParams = z.object({
  id: z.string(),
});

export const GetCollegeCoursesListParams = z.object({
  id: z.string(),
});

export const GetCollegeReviewsParams = z.object({
  id: z.string(),
});

export const CompareCollegesBody = z.object({
  collegeIds: z.array(z.string()),
});

export const PredictCollegesBody = z.object({
  exam: z.string(),
  rank: z.coerce.number(),
  category: z.string().optional(),
});

export const HealthCheckResponse = z.object({
  status: z.string(),
  database: z.string(),
});

