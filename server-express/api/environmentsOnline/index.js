'use strict'

const controller = require('./environmentOnline.controller');
const ServiceManager = require('../../service_manager/requiredModules');

const router = ServiceManager.express.Router();

router.get('/checkLogin', controller.checkLogin);
router.get('/getResponce', controller.getResponce);


module.exports = router;