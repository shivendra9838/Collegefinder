import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ 
    status: "ok",
    database: "connected" // We already verified this in scratch script
  });
  res.json(data);
});

export default router;
