const express = require("express");
const connectDB = require("./config/db");
const app = express();
const cors = require("cors");
const path = require("path");

// connect database
connectDB();
app.get("/", (req, res) => res.send("API running"));

// init middleware

app.use(
  express.json({
    extended: false
  })
);

app.use(
  cors({
    allowedHeaders: ["x-auth-token"]
  })
);

//routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

app.use(express.static(path.join(__dirname, "./client/build")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started on ${PORT}`));
