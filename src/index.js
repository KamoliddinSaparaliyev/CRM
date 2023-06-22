const express = require("express");
const config = require("./shared/config");
const stuffRoutes = require("./routes/stuff");
const studentsRoutes = require("./routes/students");
const groupsRoutes = require("./routes/groups");
const directionsRoutes = require("./routes/directions");
const { errorMiddlewareFunc } = require("./shared/error");

const { sequelize } = require("../models");

const app = express();

app.use(express.json());

app.use(stuffRoutes);
app.use(studentsRoutes);
app.use(groupsRoutes);
app.use(directionsRoutes);

app.use(errorMiddlewareFunc);

(async () => {
  await sequelize.sync({ force: true, logging: false });
})();

app.listen(config.port, () => {
  console.log(`Server ${config.port}-portda ishlayapti`);
});
