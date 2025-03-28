const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const companyRouter = require("./routes/companyRoutes");
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use("/api/companies", companyRouter);
app.use("/api/users", userRouter);

const PORT = process.env.PORT || 8085;

app.listen(PORT, () => {
    console.log("Server Connected");
});
