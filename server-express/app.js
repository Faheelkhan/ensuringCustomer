'use strict'
const ServiceManager = require('./service_manager/requiredModules');
const port = process.env.PORT || 3000;
const config = require('./api/cron_job/index');
/** DATABASE CONNECTION */
ServiceManager.mongoose.connection.openUri('mongodb://administer:administer1@ds113442.mlab.com:13442/plantation');
ServiceManager.mongoose.connection.on('connected', () => {
    console.log('Connected Database ' + ServiceManager.config.database);
})

ServiceManager.mongoose.connection.on('error', (err) => {
        console.log('Error to databse --> ' + err)
    })
    /** DATABASE CONNECTION END */

ServiceManager.app.use(ServiceManager.cors(
    '/*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
      }
));
ServiceManager.app.use(ServiceManager.bodyParser.json());

ServiceManager.app.on('error', err => {
    log.error('server error', err)
});

ServiceManager.app.listen(port, () => {
    console.log('Server Started on port ' + port)
})


require('./routes')(ServiceManager.app);
