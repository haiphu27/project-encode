const express = require("express");


function Router(...args) {
    let router = express.Router(...args);

    router.postS=function(filename,path,callback,validate=true) {
        console.log(filename,'........................')
    }


return router;
}

module.exports ={Router}