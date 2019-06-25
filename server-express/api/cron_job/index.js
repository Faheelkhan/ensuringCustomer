const cron = require("node-cron");
const functioning = require('../environmentsOnline/environmentOnline.controller')
cron.schedule("* * * * *", async function() {
    await functioning.getResponce()
    console.log("running a task every minute");
  });