const { Sequelize } = require('sequelize');
const path = require('path')
const fs = require('fs')
const config = require('../../config/setting');


class Database {

    static init(config) {

        this.sequelize = new Sequelize(
            config.database,
            config.username,
            config.password,
            config.options
        );
        
        //load all model
        this.loadModels()

        this.createModelsAssociations();

    }

    static loadModels() {
        this.model={}

        const modelFileNames = [
            ...this.getModelFiles('../db/models'),
            ...this.getModelFiles('../db')
        ]
        
        modelFileNames.forEach(filesName => {
           let model= this.sequelize.import(filesName)
        //    let modelName = model.modalNameAlias ? model.modalNameAlias : this.convertModelName(model.name);
        //    // logger.info(modelName);
        //    this.models[modelName] = model;
        //    sequelizePaginate.paginate(model);
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

    static createModelsAssociations() {
        Object
            .values(this.models)
            .filter(model => model.initialize || model.associate)
            .forEach(model => model.initialize ? model.initialize(this.models) : model.associate(this.models))
    }

}

Database.init(config.sequelize)

module.exports = Database;