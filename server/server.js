const exp = require("express");
const app = exp();
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(exp.json()); // Ensure JSON middleware is used

const DB_URL = process.env.DB_URL;

// Connect to MongoDB
MongoClient.connect(DB_URL)
  .then((client) => {
    const dbObj = client.db("webathon3");
    const usersCollection = dbObj.collection("usersCollection");
    const complaintsCollection = dbObj.collection("complaintsCollection");
    app.set("usersCollection", usersCollection);
    app.set("complaintsCollection", complaintsCollection);
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
  
app.get("/", (req, res) => {
    res.send("Hello from the WebSigmas server!");
});

// Import routes
const userApp = require("./APIs/user-api");
const complaintApp = require("./APIs/complaints-api");
app.use("/user-api", userApp);
app.use("/complaints-api", complaintApp);


// Error-handling middleware
app.use((err, req, res, next) => {
  res.status(500).send({ message: "error", payload: err.message });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
