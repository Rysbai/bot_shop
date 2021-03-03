import {DataTypes, ModelDefined, Sequelize} from "sequelize";
import {ProductAttributes, ProductCreationAttributes} from "./types";


export default (sequelize: Sequelize): ModelDefined<ProductAttributes, ProductCreationAttributes> => {
    return sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: ''
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        }
    })
}
