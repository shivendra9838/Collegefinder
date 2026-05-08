import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { customFetch } from "../custom-fetch";

export const useListColleges = (params?: any, options?: { query?: UseQueryOptions<any, any> }) => {
  return useQuery({
    queryKey: ["colleges", params],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) searchParams.append(key, String(value));
        });
      }
      return customFetch(`/api/colleges?${searchParams.toString()}`);
    },
    ...options?.query,
  });
};

export const useGetCollegeLocations = (options?: { query?: UseQueryOptions<any, any> }) => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: () => customFetch("/api/colleges/locations"),
    ...options?.query,
  });
};

export const useGetCollegeCourses = (options?: { query?: UseQueryOptions<any, any> }) => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => customFetch("/api/colleges/courses"),
    ...options?.query,
  });
};

export const useGetCollege = (id: string, options?: { query?: UseQueryOptions<any, any> }) => {
  return useQuery({
    queryKey: ["college", id],
    queryFn: () => customFetch(`/api/colleges/${id}`),
    ...options?.query,
    enabled: !!id && options?.query?.enabled !== false,
  });
};

export const useGetCollegeReviews = (id: string, options?: { query?: UseQueryOptions<any, any> }) => {
  return useQuery({
    queryKey: ["reviews", id],
    queryFn: () => customFetch(`/api/colleges/${id}/reviews`),
    ...options?.query,
    enabled: !!id && options?.query?.enabled !== false,
  });
};

export const useGetCollegeCoursesList = (id: string, options?: { query?: UseQueryOptions<any, any> }) => {
  return useQuery({
    queryKey: ["college-courses", id],
    queryFn: () => customFetch(`/api/colleges/${id}/courses`),
    ...options?.query,
    enabled: !!id && options?.query?.enabled !== false,
  });
};

export const useCompareColleges = (options?: { mutation?: UseMutationOptions<any, any, any> }) => {
  return useMutation({
    mutationFn: (body: any) => customFetch("/api/colleges/compare", {
      method: "POST",
      body: JSON.stringify(body),
    }),
    ...options?.mutation,
  });
};

export const usePredictColleges = (options?: { mutation?: UseMutationOptions<any, any, any> }) => {
  return useMutation({
    mutationFn: (body: any) => customFetch("/api/colleges/predict", {
      method: "POST",
      body: JSON.stringify(body),
    }),
    ...options?.mutation,
  });
};

// Saved Items
export const useGetSavedColleges = (options?: { query?: UseQueryOptions<any, any> }) => {
  return useQuery({
    queryKey: ["saved-colleges"],
    queryFn: () => customFetch("/api/saved/colleges"),
    ...options?.query,
  });
};

export const useSaveCollege = (options?: { mutation?: UseMutationOptions<any, any, any> }) => {
  return useMutation({
    mutationFn: (body: any) => customFetch("/api/saved/colleges", {
      method: "POST",
      body: JSON.stringify(body),
    }),
    ...options?.mutation,
  });
};

export const useUnsaveCollege = (id: string, options?: { mutation?: UseMutationOptions<any, any, any> }) => {
  return useMutation({
    mutationFn: () => customFetch(`/api/saved/colleges/${id}`, {
      method: "DELETE",
    }),
    ...options?.mutation,
  });
};

export const useGetSavedComparisons = (options?: { query?: UseQueryOptions<any, any> }) => {
  return useQuery({
    queryKey: ["saved-comparisons"],
    queryFn: () => customFetch("/api/saved/comparisons"),
    ...options?.query,
  });
};

export const getGetSavedCollegesQueryKey = () => ["saved-colleges"];
export const getGetSavedComparisonsQueryKey = () => ["saved-comparisons"];
export const getListCollegesQueryKey = () => ["colleges"];
export const getGetCollegeQueryKey = (id: string) => ["college", id];
export const getGetCollegeReviewsQueryKey = (id: string) => ["reviews", id];
export const getListQuestionsQueryKey = () => ["questions"];
export const getGetQuestionQueryKey = (id: string | number) => ["question", id];


export const useGetQuestion = (id: string, options?: { query?: UseQueryOptions<any, any> }) => {
  return useQuery({
    queryKey: ["question", id],
    queryFn: () => customFetch(`/api/questions/${id}`),
    ...options?.query,
    enabled: !!id && options?.query?.enabled !== false,
  });
};

export const useCreateQuestion = (options?: { mutation?: UseMutationOptions<any, any, any> }) => {
  return useMutation({
    mutationFn: (body: any) => customFetch("/api/questions", {
      method: "POST",
      body: JSON.stringify(body),
    }),
    ...options?.mutation,
  });
};

export const useCreateAnswer = (options?: { mutation?: UseMutationOptions<any, any, any> }) => {
  return useMutation({
    mutationFn: ({ questionId, ...body }: { questionId: string; authorName: string; body: string }) =>
      customFetch(`/api/questions/${questionId}/answers`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    ...options?.mutation,
  });
};

export const useListQuestions = (params?: any, options?: { query?: UseQueryOptions<any, any> }) => {
  return useQuery({
    queryKey: ["questions", params],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) searchParams.append(key, String(value));
        });
      }
      return customFetch(`/api/questions?${searchParams.toString()}`);
    },
    ...options?.query,
  });
};

export const useGetCollegeStats = (options?: { query?: UseQueryOptions<any, any> }) => {
  return useQuery({
    queryKey: ["college-stats"],
    queryFn: () => customFetch("/api/colleges/stats"),
    ...options?.query,
  });
};

export const useListApplications = (options?: { query?: UseQueryOptions<any, any> }) => {
  return useQuery({
    queryKey: ["applications"],
    queryFn: () => customFetch("/api/applications"),
    ...options?.query,
  });
};

export const useCreateApplication = (options?: { mutation?: UseMutationOptions<any, any, any> }) => {
  return useMutation({
    mutationFn: (body: any) => customFetch("/api/applications", {
      method: "POST",
      body: JSON.stringify(body),
    }),
    ...options?.mutation,
  });
};

export const getListApplicationsQueryKey = () => ["applications"];

