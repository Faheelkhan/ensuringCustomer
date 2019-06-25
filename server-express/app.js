'use strict'
const ServiceManager = require('./service_manager/requiredModules');
const port = process.env.PORT || 3000;
const config = require('./api/cron_job/index');

const path = require('path')
const fs = require('fs')

const dirpath = path.join(__dirname, '../results')

var filesList;
fs.readdir(dirpath, function(err, files){
  filesList = files.filter(function(e){
    return path.extname(e).toLowerCase() === '.json'
  });
  filesList = filesList;
  walkSync(dirpath,filesList)
});
let jsonSavedData = []

var walkSync = async function(dir, filelist) {
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
      if (fs.statSync(dir + '/' + file).isDirectory()) {
        filelist = walkSync(dir + '/' + file, filelist);
      }
      else {
        filelist.push(file);
      }
    });
    filelist.forEach( async (element) =>  {
        let rawdata = await fs.readFileSync(dirpath + '/' + element , {encoding: 'utf-8'});
        let clientResponces = JSON.parse(rawdata);
        jsonSavedData.push(clientResponces);
    });
  };

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


// ServiceManager.app.engine('ejs', require('ejs').renderFile);
// ServiceManager.app.set('views', './views/pages');
ServiceManager.app.set('view engine', 'ejs');

ServiceManager.app.get('/', function(req, res){ 
    res.render('index',{user: "Great Users", data:jsonSavedData});
});

// ServiceManager.app.get('/', function(req, res) {
//     res.render('index');
// });

ServiceManager.app.listen(port, () => {
    console.log('Server Started on port ' + port)
})

// ServiceManager.app.get('/', function(req, res) {
//     res.render('index');
// });


// about page 
// ServiceManager.app.get('/about', function(req, res) {
//     res.render('about');
// });

require('./routes')(ServiceManager.app);
