import {Sequelize} from "sequelize";
import configs from "../configs";
import UserDefiner from "./user"
import ProductDefiner from "./product"
import BasketItemDefiner from './basketItem'
import OrderDefiner from './order';
import OrderItemDefiner from './orderItem';


export const sequelize = new Sequelize(configs.DB_URL);


export const User = UserDefiner(sequelize);
export const Product = ProductDefiner(sequelize);
export const BasketItem = BasketItemDefiner(sequelize);
export const Order = OrderDefiner(sequelize);
export const OrderItem = OrderItemDefiner(sequelize);
