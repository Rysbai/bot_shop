import {Model, Optional} from "sequelize";

export interface UserAttributes {
    id: number
    tUserId: number
    tUsername?: string
}
export interface UserCreationAttributes extends Optional<UserAttributes, 'id'>{}
export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}


export interface ProductAttributes {
    id: number
    name: string
    description: string | null
    price: number
}
export interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'>{}


export interface BasketItemAttributes {
    id: number,
    userId: number,
    productId: number,
    count: number
}
export interface BasketItemCreationAttributes extends Optional<BasketItemAttributes, 'id'>{}
export interface BasketItemInstance extends Model<BasketItemAttributes, BasketItemCreationAttributes>, BasketItemAttributes{}


export interface OrderAttributes {
    id: number,
    userId: number,
    isPaid: boolean
}
export interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'>{}
export interface OrderInstance extends Model<OrderAttributes, OrderCreationAttributes>, OrderAttributes{}


export interface OrderItemAttributes {
    id: number,
    orderId: number,
    productId: number,
    count: number
}
export interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, 'id'>{}
export interface OrderItemInstance extends Model<OrderItemAttributes, OrderItemCreationAttributes>, OrderAttributes{}
