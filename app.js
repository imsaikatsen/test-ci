const express = require("express");
const app = express();
const cors = require("cors");
const port = 3001;

const qualityDataRouter = require("./routes/qualityData");

app.use(express.json());
app.use(cors());

// Mount the quality data route
app.use("/", qualityDataRouter);

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
