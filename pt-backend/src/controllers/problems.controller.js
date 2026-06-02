import { eq } from "drizzle-orm"
import asyncHandler from "../utils/asyncHandler.js"
import { db } from "../db/db.js"
import { problems, users} from "../db/schema.js"

const createNewProblem = asyncHandler(async(req,res) => {
    const userId = req.user.id

    if(!userId) {
        res.status(400)
        throw new Error("User not found")
    }
    
    const {problemName, difficulty, status, pattern, notes, needsRevison, solvedAt, timeTaken} = req.body;

    if (
    !difficulty ||
    !problemName ||
    !status ||
    !pattern ||
    !notes ||
    needsRevison === undefined ||
    solvedAt === undefined ||
    timeTaken === undefined) 
    {
        res.status(400)
        throw new Error("Enter all fields");
    }
    const [problem] = await db.insert(problems).values({
        userId: userId,
        problemName: problemName,
        difficulty: difficulty,
        status: status,
        pattern: pattern,
        notes: notes,
        needsRevison: needsRevison,
        solvedAt: solvedAt,
        timeTaken: timeTaken
    }).returning()

    if(userProblems.length === 0){
        return res.status(200).json([]);
    }
    
    res.status(201).json({
        "success": true,
        "message": "Problem created",
        "data": problem.id
    })
    
})

const fetchProblems = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const userProblems = await db
    .select()
    .from(problems)
    .where(eq(problems.userId, userId));

  res.status(200).json({
    success: true,
    data: userProblems,
  });
});

export {createNewProblem, fetchProblems}