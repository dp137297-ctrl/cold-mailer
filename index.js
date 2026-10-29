import express from "express";
import connectDB from "./configf/db.js";
import authRoutes from "./routes/auth.route.js";
import fileRoutes from "./routes/file.route.js";
import mailRoutes from "./routes/mail.route.js";

const app = express();
const PORT = 5000;
app.use(express.json())

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/mails", mailRoutes);

app.get("/", (req, res) => {
  res.send("Coldmailer API is running");
});

await connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});