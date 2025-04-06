const exp = require("express");
const app = exp();
const { MongoClient } = require("mongodb");
const cron = require("node-cron");
const cors = require("cors");
require("dotenv").config();
const WebSocket = require("ws");
const http = require("http");

app.use(cors());
app.use(exp.json()); // Ensure JSON middleware is used
const server = http.createServer(app); // use HTTP server
const wss = new WebSocket.Server({ server });

const DB_URL = process.env.DB_URL;

// Connect to MongoDB
MongoClient.connect(DB_URL)
  .then(async (client) => {
    const dbObj = client.db("webathon3");
    const usersCollection = dbObj.collection("usersCollection");
    const paymentsCollections = dbObj.collection("paymentsCollection");
    const complaintsCollection = dbObj.collection("complaintsCollection");
    const outingsCollection = dbObj.collection("outingsCollection");
    const menuCollection = dbObj.collection("menu");
    const feedbackCollection = dbObj.collection("feedbacks");
    const locationsCollection = dbObj.collection("locationsCollection");
    locationsCollection.createIndex({ coordinates: "2dsphere" });
    app.set("locationsCollection", locationsCollection);
    app.set("usersCollection", usersCollection);
    app.set("complaintsCollection", complaintsCollection);
    app.set("paymentsCollection", paymentsCollections);
    app.set("outingsCollection", outingsCollection);
    app.set("menuCollection", menuCollection);
    app.set("feedbackCollection", feedbackCollection);
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
const paymentsApp = require("./APIs/payments-api");
const outingsApp = require("./APIs/outings-api");
const menuApp = require("./APIs/menu-api");
const feedbackApp = require("./APIs/feedback-api");
const locationsApp = require("./APIs/locations-api");

app.use("/feedback-api", feedbackApp);
app.use("/user-api", userApp);
app.use("/complaints-api", complaintApp);
app.use("/payments-api", paymentsApp);
app.use("/outings-api", outingsApp);
app.use("/menu-api", menuApp);
app.use("/locations-api", locationsApp);


// Error-handling middleware
app.use((err, req, res, next) => {
  res.status(500).send({ message: "error", payload: err.message });
});

// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("Client connected via WebSocket");

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);
      const { username, email, latitude, longitude } = data;

      if (!latitude || !longitude || !email) {
        return console.warn("Invalid location data received:", data);
      }

      const doc = {
        username,
        email,
        latitude,
        longitude,
        coordinates: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        timestamp: new Date(),
      };

      // Access the collection from the app
      const locationsCollection = app.get("locationsCollection");

      await locationsCollection.updateOne(
        { email },
        { $set: doc },
        { upsert: true }
      );

      console.log(`Updated location for ${email}`);
    } catch (err) {
      console.error("WebSocket message error:", err);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});


// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server with WebSocket listening on port ${PORT}`);
});
