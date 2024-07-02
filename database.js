const { Sequelize } = require("sequelize");

const database = new Sequelize({
  dialect: "db2",
  database: "NOWQA",
  host: "10.4.4.112",
  port: 25010,
  username: "db2admin",
  password: "Admin@123",
  logging: false, // Disable logging SQL queries (optional)
  define: {
    // schema: "DB2ADMIN", // Specify the schema name
    timestamps: false, // Disable timestamps if necessary
  },
});

// Test the database connection
database
  .authenticate()
  .then(() =>
    process.env.ENVIORNMENT === "PRODUCTION"
      ? console.log("PRODUCTION  --  DB2 FROM NOW  -- ")
      : console.log("DEVELOPMENT --  DB2 FROM NOW -- ")
  )
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

module.exports = database;
