import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

const isClerkConfigured = process.env.CLERK_PUBLISHABLE_KEY && 
                          !process.env.CLERK_PUBLISHABLE_KEY.includes('...');

if (isClerkConfigured) {
  app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());
}

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (isClerkConfigured) {
  app.use(
    clerkMiddleware((req) => ({
      publishableKey: publishableKeyFromHost(
        getClerkProxyHost(req) ?? "",
        process.env.CLERK_PUBLISHABLE_KEY,
      ),
    })),
  );
} else {
  logger.warn("Clerk keys are not configured or are placeholders. Auth middleware disabled.");
  app.use((req, res, next) => {
    // Mock clerk auth object if needed by routes
    (req as any).auth = { userId: null };
    next();
  });
}

app.get("/", (_req, res) => {
  res.json({
    message: "EduDiscover API Server is running",
    status: "ok",
    docs: "/api/healthz"
  });
});

app.use("/api", router);

export default app;
