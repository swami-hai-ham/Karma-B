import express from "express";
import cors from "cors";
import rootRouter from "./routes/index";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
