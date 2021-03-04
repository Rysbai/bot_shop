import {OrderItem} from "../models";
import {OrderItemAttributes, OrderItemCreationAttributes} from "../models/types";


export class OrderItemManager {
    constructor(protected model: typeof OrderItem) {}

    async create(params: OrderItemCreationAttributes): Promise<OrderItemAttributes>{
        const orderItem = await this.model.create(params);
        // @ts-ignore
        return orderItem.toJSON();
    }
    async filterByOrderId(orderId: number): Promise<Array<OrderItemAttributes>>{
        const queryset = await this.model.findAll({where: {orderId}});
        // @ts-ignore
        return queryset.map((item) => item.toJSON());
    }
}


export class OrderItemManagerFactory {
    public static create() {
        return new OrderItemManager(OrderItem);
    }

}
