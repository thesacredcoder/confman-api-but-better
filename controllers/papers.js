const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const sendMail = require("../utils/mail");

const prisma = new PrismaClient();

const bucketName = process.env.AWS_S3_BUCKET;
const bucketRegion = process.env.AWS_S3_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

const uploadPaper = async (req, res) => {
  const { title, abstract, keywords, coAuthors } = req.body;
  console.log("the co-authors are", coAuthors);
  const paperFile = req.file;
  const fileParams = {
    Bucket: bucketName,
    Key: `papers/${Date.now()}-${paperFile.originalname}`,
    Body: paperFile.buffer,
    ContentType: paperFile.mimeType,
  };

  try {
    if (!title || !abstract || !keywords || keywords.length < 0) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }
    const putObjectCommand = new PutObjectCommand(fileParams);
    const fileLocation = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileParams.Key}`;
    await s3.send(putObjectCommand);
    const newPaper = await prisma.paper.create({
      data: {
        title,
        abstract,
        keywords,
        fileUrl: fileLocation,
        author: {
          connect: { id: req.userId },
        },
        coAuthors: {
          connect: [
            { id: req.userId },
            ...coAuthors.map((coAuthor) => ({ id: parseInt(coAuthor) })),
          ],
        },
      },
      include: {
        coAuthors: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    console.log("the coAuthors are", newPaper.coAuthors);

    const subject = "New Paper Submitted";
    const html = `<p>A new paper titled "${newPaper.title}" has been submitted by ${newPaper.author.name}. You have been listed as a co-author.</p>`;

    for (const coAuthor of newPaper.coAuthors) {
      await sendMail(coAuthor.email, subject, html);
    }

    res
      .status(201)
      .json({ message: "Paper uploaded successfully", result: newPaper });
  } catch (err) {
    res.status(500).json({ message: "Error uploading paper", err });
    console.log(err);
  }
};

module.exports = { uploadPaper };
