const { Sequelize } = require('sequelize');
const path = require('path')
const fs = require('fs')
const config = require('../../config/setting')
const {logger} = require("../util/logger");


class Database {

    static async init(config) {

        this.sequelize = new Sequelize(
            config.database,
            config.username,
            config.password,
            config.options
        );

        this.converter = config.model_converter

        this.loadModels();

        this.createModelsAssociations();
    }

    static loadModels() {
        this.models={}

        const modelFileNames = [
            ...this.getModelFiles('../db/models'),
        ]
        modelFileNames.forEach(filesName => {
            let model = this.sequelize.import(filesName);

            let modelName =  model.modalNameAlias?model.modalNameAlias:this.convertModelName(model.name);

            this.models[modelName] = model;
           // sequelizePaginate.paginate(model);
        })
    }

    //trả về đường dẫn file model dạng mảng 
    static getModelFiles(folder) {
        folder = path.join(__dirname, folder);
        let fileNames = fs.readdirSync(folder)
            .filter(name => name.toLowerCase().endsWith('.js'))
            .map(name => path.join(folder, name));
        return fileNames
    }

    static convertModelName(name){
        let converter = this.converter;
        for(let [k,v] of Object.entries(converter.prefix)){
            if(name.startsWith(k)){
                name = `${v}${name.slice(k.length)}`;
            }
        }

        for(let [k,v] of Object.entries(converter.suffix)){
            if(name.endsWith(k))
                name = `${name.slice(0, -k.length)}${v}`;
        }
        return name;
    }

    static createModelsAssociations() {
        Object
            .values(this.models)
            .filter(model => model.initialize || model.associate)
            .forEach(model => model.initialize ? model.initialize(this.models) : model.associate(this.models))
    }

}

Database.init(config.sequelize)
module.exports =Database;