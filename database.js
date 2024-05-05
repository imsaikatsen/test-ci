const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "db2",
  database: "NOWDEV",
  host: "10.4.4.111",
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
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

module.exports = sequelize;
