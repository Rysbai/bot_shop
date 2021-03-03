import {DataTypes, Sequelize} from "sequelize";
import {OrderInstance} from "./types";
import {User} from "./index";


export default (sequelize: Sequelize) => {
    return sequelize.define<OrderInstance>('Order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id'
            }
        },
        isPaid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    })
}