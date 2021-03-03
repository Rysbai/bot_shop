import {DataTypes, Sequelize} from "sequelize";
import {OrderItemInstance} from "./types";
import {Order, Product} from "./index";


export default (sequelize: Sequelize) => {
    return sequelize.define<OrderItemInstance>('OrderItem', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        orderId: {
            type: DataTypes.INTEGER,
            references: {
                model: Order,
                key: 'id'
            }
        },
        productId: {
            type: DataTypes.INTEGER,
            references: {
                model: Product,
                key: 'id'
            }
        },
        count: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        }
    })
}
