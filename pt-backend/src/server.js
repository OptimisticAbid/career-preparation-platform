import app from './app.js'
import { connectDb } from './db/db.js';

const PORT = process.env.PORT || 8000

console.log("Starting server...")


async function startServer() {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`);
    })
  } catch (error) {
    console.error("Server error:", error.message);
    process.exit(1)
  }
}
startServer()



