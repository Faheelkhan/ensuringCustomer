'use strict'
module.exports = (app) => {
    app.use('/api/v1/environmentsOnline', require('./api/environmentsOnline'));
}