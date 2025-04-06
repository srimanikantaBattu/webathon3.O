    const express = require('express');
    const locationsApp = express.Router();

    let locationsCollection;

    locationsApp.use((req, res, next) => {
    locationsCollection = req.app.get("locationsCollection");
    next();
    });

    locationsApp.post('/location', async (req, res) => {
    const { latitude, longitude, timestamp, username } = req.body;

    if (latitude == null || longitude == null) {
        return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    try {
        const location = {
        username,
        latitude,
        longitude,
        timestamp: new Date(),
        coordinates: {
            type: "Point",
            coordinates: [longitude, latitude], // IMPORTANT: [lng, lat]
        }
        };

        await locationsCollection.insertOne(location);
        res.status(201).json({ message: 'Location saved successfully' });
    } catch (error) {
        console.error("Error saving location:", error);
        res.status(500).json({ message: 'Error saving location', error: error.message });
    }
    });


    locationsApp.get('/nearby-users', async (req, res) => {
        const referencePoint = {
          type: "Point",
          coordinates: [78.393421, 17.538830], // [longitude, latitude]
        };
      
        try {
          const allUsers = await locationsCollection.find({
            coordinates: {
              $near: {
                $geometry: referencePoint
                // NO $maxDistance here
              },
            },
          })
            .project({ username: 1, coordinates: 1, _id: 0 })
            .toArray();
      
          // Haversine formula
          const getDistanceInMeters = (coord1, coord2) => {
            const toRad = deg => deg * Math.PI / 180;
            const R = 6371e3;
            const [lon1, lat1] = coord1;
            const [lon2, lat2] = coord2;
      
            const φ1 = toRad(lat1);
            const φ2 = toRad(lat2);
            const Δφ = toRad(lat2 - lat1);
            const Δλ = toRad(lon2 - lon1);
      
            const a = Math.sin(Δφ / 2) ** 2 +
                      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      
            return R * c;
          };
      
          // Filter users who are >500 meters
          const outside500m = allUsers.filter(user => {
            const distance = getDistanceInMeters(referencePoint.coordinates, user.coordinates.coordinates);
            return distance > 500;
          });
      
          res.json({ nearbyUsers: outside500m });
        } catch (error) {
          console.error("Error finding nearby users:", error);
          res.status(500).json({
            message: 'Error finding nearby users',
            error: error.message,
          });
        }
      });
      

    locationsApp.get("/location/:username", async (req, res) => {
    const username = req.params.username;
    
    try {
        const userLocation = await locationsCollection.findOne(
        { username: { $regex: new RegExp(`^${username}$`, "i") } },
        { sort: { timestamp: -1 } }
        );

        if (!userLocation) {
        return res.status(404).json({ message: `No location data found for user: ${username}` });
        }

        const { coordinates } = userLocation;
        
        if (!coordinates || coordinates.coordinates.length !== 2) {
        return res.status(400).json({ message: "Incomplete coordinates data for user" });
        }

        res.status(200).json({
        username: userLocation.username,
        latitude: coordinates.coordinates[1], // latitude is the second element
        longitude: coordinates.coordinates[0], // longitude is the first element
        timestamp: userLocation.timestamp,
        });
    } catch (err) {
        console.error("Error fetching user location:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
    });




    module.exports = locationsApp;
