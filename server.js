const express = require("express");
const app = express();
const cors = require("cors");
const port = 3001;
const ibmdb = require("ibm_db");

// Db2 configuration
const db2Config = {
  database: "NOWPRD",
  hostname: "10.4.4.9",
  port: 25010,
  uid: "db2user",
  pwd: "@dmin@50011",
};

// Database connection string
const connStr = `DATABASE=${db2Config.database};HOSTNAME=${db2Config.hostname};UID=${db2Config.uid};PWD=${db2Config.pwd};PORT=${db2Config.port};PROTOCOL=TCPIP`;

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors());

// Route to fetch filtered data from the QualityDetailTable based on a date range and customer name
app.post("/api/qualitydata", async (req, res) => {
  try {
    const { StartDate, EndDate, CustomerName } = req.body;

    // Construct the SQL query with parameters for filtering by date range and customer name
    const query = `
      SELECT CUSTOMERNAME, HEADERDATE, HEADERCODE, HEADERSUBGROUPCODE, CHARACTERISTICCODE, DEFECTQTY, SEARCHDESCRIPTION, ROLLLENGTH
      FROM db2admin.VIEWBXMQUALITYDETAIL
      WHERE CUSTOMERNAME = ? AND HEADERDATE BETWEEN ? AND ?
    `;

    // Prepare query parameters for the date range and customer name
    const params = [CustomerName, StartDate, EndDate];

    // console.log("SQL Query:", query);
    // console.log("Query Parameters:", params);

    // Open the database connection and execute the query
    ibmdb.open(connStr, (err, conn) => {
      if (err) {
        console.error("Error connecting to Db2:", err);
        res
          .status(500)
          .json({ success: false, error: "Database Connection Error" });
        return;
      }

      // Execute the query with prepared parameters
      conn.query(query, params, (err, result) => {
        if (err) {
          console.error("Error executing query:", err);
          res
            .status(500)
            .json({ success: false, error: "Database Query Error" });
          conn.close(() => {
            console.log("Db2 connection closed");
          });
          return;
        }

        // Initialize an object to hold aggregated data by CHARACTERISTICCODE
        const aggregatedData = {};

        // Iterate through the query result to calculate sums by CHARACTERISTICCODE
        result.forEach((entry) => {
          const { CHARACTERISTICCODE, DEFECTQTY, ROLLLENGTH } = entry;

          // Check if the CHARACTERISTICCODE exists in the aggregatedData object
          if (!aggregatedData[CHARACTERISTICCODE]) {
            // Initialize the entry for the CHARACTERISTICCODE
            aggregatedData[CHARACTERISTICCODE] = {
              totalDefectQty: 0,
              totalRollLength: 0,
            };
          }

          // Add DEFECTQTY and parse ROLLLENGTH to the corresponding totals
          aggregatedData[CHARACTERISTICCODE].totalDefectQty += DEFECTQTY;
          aggregatedData[CHARACTERISTICCODE].totalRollLength += parseInt(
            ROLLLENGTH.trim(),
            10
          );
        });

        // console.log("Aggregated Data:", aggregatedData);

        // Send the aggregated data as the response
        res.json({ success: true, data: aggregatedData });

        // Close the database connection after processing
        conn.close(() => {
          console.log("Db2 connection closed");
        });
      });
    });
  } catch (error) {
    console.error("Error fetching quality data:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
