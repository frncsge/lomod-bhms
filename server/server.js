import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";

const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());

//sign up route
app.use("/api", authRoutes);

//posting routes
app.use("/api", postRoutes);

//default route for checking
app.get("/", (req, res) =>
  res.send("Lomod Boarding House Management System WIP."),
);

//start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
