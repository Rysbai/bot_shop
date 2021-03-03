import {DataTypes, ModelDefined, Sequelize} from "sequelize";
import {BasketItemAttributes, BasketItemCreationAttributes, BasketItemInstance,} from "./types";
import {Product, User} from "./index";


export default (sequelize: Sequelize): ModelDefined<BasketItemAttributes, BasketItemCreationAttributes> => {

    const BasketItem = sequelize.define<BasketItemInstance>('BasketItem', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Product,
                key: 'id'
            }
        },
        count: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        }
    });

    BasketItem.belongsTo(Product, {foreignKey: 'productId'});
    BasketItem.belongsTo(User, {foreignKey: 'userId'});

    return BasketItem;
}
