'use strict'
const environmentOnlineService = require('./environmentOnline.service');
const ServiceManager = require('../../service_manager/requiredModules');

exports.checkLogin = (req, res) => {
    environmentOnlineService.checkLogin()
        .then((resp) => {
            res.status(200).send(resp);
        })
        .catch((err) => {
            ServiceManager.errorHandler.serverError500(res, err);
        });
};

exports.getResponce = (req, res) => {
    environmentOnlineService.getResponce()
        .then((responce) => {
            if (responce) {
                if (res) {
                    res.status(200).json(responce);
                } else{
                    environmentOnlineService.saviingToFile(responce);
                }
            } else {
                ServiceManager.errorHandler.serverError404(res, err);
            }
        })
        .catch((err) => {
            ServiceManager.errorHandler.serverError500(res, err);
        })
};
