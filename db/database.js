const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Establishing connection to MongoDB
    const conn = await mongoose.connect('mongodb+srv://sakthisampth:MZXZexpCJSU5tewa@cluster0.ms27x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`); // Logging the host for clarity
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit the process if the connection fails
  }
};

module.exports = connectDB;
