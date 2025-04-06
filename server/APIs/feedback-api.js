const express = require("express")
const feedbackApp = express.Router()

let feedbackCollection;

feedbackApp.use((req, res, next) => {
    feedbackCollection = req.app.get("feedbackCollection");
    next();
});

feedbackApp.post("/upload", async (req, res) => {
  try {
    const feedbackWithTimestamp = {
      ...req.body,
      createdAt: new Date(),
    }

    await feedbackCollection.insertOne(feedbackWithTimestamp)
    res.status(201).json({ message: "Feedback saved" })
  } catch (err) {
    console.error("Insert Error:", err)
    res.status(500).json({ error: "Error saving feedback" })
  }
})

// Retrieve all feedbacks
feedbackApp.get("/retrieve", async (req, res) => {
  try {
    const feedbacks = await feedbackCollection.find({}).toArray()
    res.json(feedbacks)
  } catch (err) {
    console.error("Fetch Error:", err)
    res.status(500).json({ error: "Error fetching feedbacks" })
  }
})

module.exports = feedbackApp
