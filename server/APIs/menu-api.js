const express = require("express");
const  menuApp = express.Router();

let menuCollection;

menuApp.use((req, res, next) => {
    menuCollection = req.app.get("menuCollection");
    next();
});

// GET all menu items
menuApp.get("/", async (req, res) => {
  try {
    const menus = await menuCollection.find({}).toArray();
    res.json(menus);
  } catch (err) {
    res.status(500).json({ 
      error: "Failed to fetch menu",
      details: err.message 
    });
  }
});

// PUT update a day's menu
menuApp.put("/:day", async (req, res) => {
    try {
      const { day } = req.params;
      const { breakfast, lunch, snacks, dinner } = req.body;
  
      if (!breakfast || !lunch || !snacks || !dinner) {
        return res.status(400).json({
          success: false,
          error: "All meal fields are required",
        });
      }
  
      const result = await menuCollection
        .findOneAndUpdate(
          { day: day },
          { $set: { breakfast, lunch, snacks, dinner } },
          { returnDocument: 'after' } // Using 'after' instead of 'false'
        );
  
      if (!result.value) {
        return res.status(404).json({
          success: false,
          error: `Menu not found for ${day}`,
        });
      }
  
      res.status(200).json({
        success: true,
        data: result.value, // This will now return the updated menu
      });
    } catch (err) {
      console.error("Error updating menu:", err);
      res.status(500).json({
        success: false,
        error: "Failed to update menu",
        details: err.message,
      });
    }
  });
  

module.exports = menuApp;