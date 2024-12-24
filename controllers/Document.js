const Student = require("../models/student");
const Document = require("../models/docModel"); // Assuming this is the correct model
const { default: mongoose } = require("mongoose");

const createDocument = async (req, res) => {
  const { title, email } = req.body;

  // Validate the request body
  if (!title || !email || email.length === 0) {
    return res
      .status(400)
      .json({ message: "Title and at least one email are required" });
  }

  try {
    // Check if all emails exist in the database and have the 'student' role
    const students = await Student.find({
      email: { $in: email }, // Ensure emails are in the database
      role: { $in: ["Editor", "approver", "Viewer"] }, // Ensure role matches one of the allowed roles
    });
    console.log("students.length !== email.length", students, email);
    if (students.length !== email.length) {
      return res
        .status(400)
        .json({ message: "Some provided emails are invalid or not user" });
    }

    // Create a new document
    const newDocument = new Document({
      title,
      assignedManagers: email, // Assuming "assignedManagers" refers to the emails of students
    });

    // Save the document to the database
    await newDocument.save();

    // Send success response
    res.status(201).json({
      message: "Document created and Users are assigned successfully",
      document: newDocument,
    });
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).json({ message: "Error creating document", error });
  }
};

const particularUserDocsList = async (req, res) => {
  const { email } = req.params;
  try {
    // Find all documents
    const documents = await Document.find();

    // Filter documents to only include those where email exists in assignedManagers (nested arrays)
    const filteredDocuments = documents.filter((doc) =>
      doc.assignedManagers.some((managerArray) => managerArray?.includes(email))
    );
    // Check if we found any documents
    if (filteredDocuments.length === 0) {
      return res
        .status(404)
        .json({ message: "No documents found for this user." });
    }

    res.status(200).json({
      message: "Documents retrieved successfully",
      documents: filteredDocuments,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ message: "Error fetching documents", error });
  }
};

const getAllDoc = async (req, res) => {
  try {
    // Find all documents
    const documents = await Document.find();
    res.status(200).json({
      message: "Documents retrieved successfully",
      documents: documents,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ message: "Error fetching documents", error });
  }
};

const approveDocument = async (req, res) => {
  try {
    const { document_id } = req.body;

    const document = await Document.findOne({
      _id: new mongoose.Types.ObjectId(document_id),
    });
    if (!document)
      return res.status(200).json({ message: "Document not found!" });

    if (document?.status === "approve")
      return res.status(200).json({ message: "Document is already approved!" });

    const result = await Document.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(document_id) },
      { status: "approve" },
      { new: true }
    );
    res.status(200).json({
      message: "Document Approved!",
      documents: result,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching documents", error });
  }
};

module.exports = {
  createDocument,
  particularUserDocsList,
  getAllDoc,
  approveDocument,
};
