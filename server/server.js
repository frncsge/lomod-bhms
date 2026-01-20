import express from "express";
import landlordRoutes from "./routes/landlord.js";

const app = express();

//middlewares
app.use(express.json());

//sign up route
app.use("/auth", landlordRoutes);

//default route for checking
app.get("/", (req, res) =>
  res.send("Lomod Boarding House Management System WIP."),
);

//start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
