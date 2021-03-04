import {Sequelize, DataTypes, ModelDefined} from "sequelize";
import {UserAttributes, UserCreationAttributes, UserInstance} from "./types";


export default (sequelize: Sequelize): ModelDefined<UserAttributes, UserCreationAttributes> => {
    return sequelize.define<UserInstance>('User', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        tChatId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        tUsername: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    })
}
