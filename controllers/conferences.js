const { PrismaClient } = require("@prisma/client");
const sendMail = require("../utils/mail");

const prisma = new PrismaClient();

const createConference = async (req, res) => {
  const {
    title,
    description,
    startDate,
    endDate,
    status,
    topics,
    organization,
  } = req.body;

  try {
    const newConference = await prisma.conference.create({
      data: {
        title,
        description,
        startDate,
        endDate,
        status,
        topics,
        organization,
        manager: {
          connect: {
            id: req.userId,
          },
        },
      },
    });

    res.status(201).json({
      message: "Conference created successfully",
      result: newConference,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating conference", err });
    console.log(err);
  }
};

const getMyConferences = async (req, res) => {
  try {
    const myConferences = await prisma.conference.findMany({
      where: {
        managerId: req.userId,
      },
    });

    res.status(200).json({ result: myConferences });
  } catch (err) {
    res.status(500).json({ message: "Error fetching conferences", err });
  }
};

const getAllConferences = async (req, res) => {
  try {
    const allConferences = await prisma.conference.findMany();

    res
      .status(200)
      .json({ message: "Found all conferences", result: allConferences });
  } catch (err) {
    res.status(500).json({ message: "Error fetching all conferences", err });
    console.log(err);
  }
};

const updateConferenceDetails = async (req, res) => {
  const { id } = req.params;
  const { title, description, startDate, endDate, status, topics } = req.body;

  try {
    const updateConference = await prisma.conference.update({
      where: { id: parseInt(id) },
      data: {
        ...(status && { status }),
        ...(title && { title }),
        ...(description && { description }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(topics && { topics }),
      },
      include: {
        authors: true,
        reviewers: true,
      },
    });

    const emailSubject = "Conference Details Updated";
    const emailText = `Hello,

The details of the conference "${updateConference.title}" have been updated. Please check the conference website for the latest information.

Sincerely,
Conference Manager`;

    for (const author of updateConference.authors) {
      await sendMail(author.email, emailSubject, emailText);
    }

    for (const reviewer of updateConference.reviewers) {
      await sendMail(reviewer.email, emailSubject, emailText);
    }

    res.status(200).json({
      message: "Updated the conference details successfully",
      result: updateConference,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating the conference", err });
    console.log(err);
  }
};

const joinConference = async (req, res) => {
  const { conferenceId } = req.params;

  try {
    const conference = await prisma.conference.findUnique({
      where: { id: parseInt(conferenceId) },
    });

    if (!conference) {
      return res.status(404).json({ message: "Conference not found" });
    }

    if (conference.status !== "ONGOING") {
      return res.status(400).json({ message: "Conference is not going" });
    }

    const updatedConference = await prisma.conference.update({
      where: { id: parseInt(conferenceId) },
      data: {
        authors: {
          connect: { id: req.userId },
        },
      },
    });

    res.status(200).json({
      result: updatedConference,
      message: "Successfully joined the conference",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error joining the conference" });
  }
};

module.exports = {
  createConference,
  getMyConferences,
  getAllConferences,
  updateConferenceDetails,
  joinConference,
};
