import { Router, type IRouter } from "express";
import healthRouter from "./health";
import collegesRouter from "./colleges";
import qaRouter from "./qa";
import savedRouter from "./saved";
import applicationsRouter from "./applications";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(collegesRouter);
router.use(qaRouter);
router.use(savedRouter);
router.use(applicationsRouter);
router.use(authRouter);

export default router;
