require('dotenv').config();
const exp = require('express');
const complaintApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
const axios = require('axios');
const cors = require('cors');
const multer = require('multer');
const { S3Client , PutObjectCommand , GetObjectCommand , DeleteObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner');
const { stat } = require('fs');
var ObjectId = require('mongodb').ObjectId;

let complaintsCollection;
complaintApp.use((req, res, next) => {
    complaintsCollection = req.app.get("complaintsCollection");
    next();
  });

const bucketName = process.env.BUCKET_NAME;
const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS;
const bucketRegion = process.env.BUCKET_REGION;

const s3 = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretAccessKey
    }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

complaintApp.post('/upload', upload.single('file'), expressAsyncHandler(async (req, res) => {
    try {
        const imageName = randomImageName();
        const params = {
            Bucket: bucketName,
            Key: imageName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        };
        const command = new PutObjectCommand(params);
        await s3.send(command);
        const post = await complaintsCollection.insertOne({imageName: imageName, title: req.body.title, description: req.body.description, location: req.body.location, category: req.body.category, urgency: req.body.urgency,status: "pending"});
        res.status(200).send({ message: 'File uploaded successfully' });
    } catch (error) {
        console.error('AWS Upload Error:', error);
        res.status(500).send({ error: 'Failed to upload file to S3' });
    }
}));

complaintApp.get('/files', expressAsyncHandler(async (req, res) => {
    const files = await complaintsCollection.find().toArray();
    for(const file of files){
        const getObjParams = {
            Bucket: bucketName,
            Key: file.imageName,
        };
        const command = new GetObjectCommand(getObjParams)
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
        file.imageUrl = url;
    }
    res.send(files);
}));

complaintApp.put('/update/:id', expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    const result = await complaintsCollection.updateOne({ _id: new ObjectId(id) }, { $set: {status:"approved"} });
    res.send({
        success: true,
        data: result
    });
}));

module.exports = complaintApp