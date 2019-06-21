'use strict'

const axios = require('axios')
var jsonPayload = require('./payload.json')
var fs = require('fs');
let globleAuthTokenForTargets = ''
exports.checkLogin = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let login_token = await axios.post('https://gateway-listener-local.avizia.com:1443/v1/auth', {"key":"aeb60f1d-56db-443a-8f3a-8019e30729c5","secret":"08612d36-d88e-4cb3-9d82-80b10cda77a9"})
            resolve(login_token.data)
        } catch (error) {
            reject(error)
        }
    });
};

exports.getResponce = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let listOfResults = []
            let listOfCustomers = await getCustomerList()
            listOfCustomers = listOfCustomers.filter(function( element ) {return element !== undefined;})
            for (let numberOfCustomers = 0; numberOfCustomers < listOfCustomers.length; numberOfCustomers++) {
                let isWorking = await axios.post('https://gateway-listener-local.avizia.com:3443/v1/endpoint/fhir', listOfCustomers[numberOfCustomers] ,{headers: getResponceHeader()})
                listOfResults.push(isWorking.data);
            }
            return resolve(listOfResults);
        } catch (error) {
            reject(error)
        }
    });
};

function getResponceHeader () {
    return {
        "Authorization": 'appId=1,timestamp=1560950046813,Signature=7ef1fa27ec8e269e3980244c71bec32b0468a96dfcaeb12114ff5988b9b86819',
        "verification-token": "2ywKpxNgpxVbkJRr",
        "Content-Type": "application/json"
    }
}

async function getCustomerList () {
    let listOfCustomersWithRedoxSource = []
    try {
        let listOfCustomers = await axios.get('https://gateway-admin-devgw03.avizia.com/v1/targets',{headers: {'Authorization': globleAuthTokenForTargets}});

        for (let redoxSource = 0; redoxSource < listOfCustomers.data.length; redoxSource++) {
            let gettingRedoxSource = await axios.get(`https://gateway-admin-devgw03.avizia.com/v1/customer/${listOfCustomers.data[redoxSource].id}`,{headers: {'Authorization': globleAuthTokenForTargets}});
            listOfCustomersWithRedoxSource.push(editCustomerIds(gettingRedoxSource.data));
        }
        console.log(listOfCustomers);
        return listOfCustomersWithRedoxSource
    } catch (error) {
        if (error.response.status === 401) {
            let userPayload = {"username":"aviziagateway","password":"Emergemd!12"}
            const token = await axios.post('https://gateway-admin-devgw03.avizia.com/v1/auth', userPayload)
            globleAuthTokenForTargets = token.data.Authorization
            return await getCustomerList()
        }
    }
}

function editCustomerIds (payload) {
    let editableJson = jsonPayload
    if (payload.redoxSource) {
        editableJson.Meta.Source.ID = payload.redoxSource && payload.redoxSource.redoxId
        return editableJson
    }
}
let counter = 0
exports.saviingToFile = (results) => {
    var dateFormation = new Date().getMonth() + '_' + new Date().getDate() +'_' + new Date().getMonth()

    fs.writeFile('./results/Date_' + dateFormation + counter+1 + '.txt', JSON.stringify(results, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        };
        console.log("File has been created");
    });
}