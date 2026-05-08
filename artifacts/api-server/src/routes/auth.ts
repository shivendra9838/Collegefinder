import { Router, type IRouter } from "express";
import { User } from "@workspace/db";
import { getAuth } from "@clerk/express";

const router: IRouter = Router();

// This endpoint handles both real Clerk sync and mock auth sync
router.post("/auth/sync", async (req, res): Promise<void> => {
  let clerkId: string | undefined;
  let email: string | undefined;
  let firstName: string | undefined;
  let lastName: string | undefined;
  let imageUrl: string | undefined;

  try {
    // Check if called with real Clerk auth
    const auth = getAuth(req);
    if (auth.userId) {
      clerkId = auth.userId;
      // In a real scenario, you'd fetch user details from Clerk API here
    }
  } catch (e) {}

  // Fallback to body for mock auth
  if (!clerkId) {
    clerkId = req.body.clerkId || `mock_${req.body.email?.replace(/[^a-zA-Z0-9]/g, '_')}`;
    email = req.body.email;
    firstName = req.body.firstName;
    lastName = req.body.lastName;
    imageUrl = req.body.imageUrl;
  }

  if (!clerkId || !email) {
    res.status(400).json({ error: "clerkId and email are required" });
    return;
  }

  // Update or create user in MongoDB
  const user = await User.findOneAndUpdate(
    { clerkId },
    { 
      email, 
      firstName, 
      lastName, 
      imageUrl,
      updatedAt: new Date() 
    },
    { upsert: true, new: true }
  );

  res.json(user);
});

export default router;
