import {OrderAttributes, OrderCreationAttributes, OrderInstance} from "../models/types";
import {Order} from "../models";


export class OrderManager{
    constructor(protected model: typeof Order) {}

    async create(params: OrderCreationAttributes): Promise<OrderAttributes>{
        const order = await this.model.create(params);
        // @ts-ignore
        return order.toJSON();
    }

    async filterUserNotPaidOrders(userId: number): Promise<Array<OrderAttributes>>{
        const queryset = await this.model.findAll({where: {userId: userId, isPaid: false}});
        // @ts-ignore
        return queryset.map((instance) => instance.toJSON());
    }
}


export class OrderManagerFactory {
    public static create(){
        return new OrderManager(Order);
    }
}
