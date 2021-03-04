import {OrderAttributes, OrderCreationAttributes, OrderInstance, UserCreationAttributes} from "../models/types";
import {Order} from "../models";


export class OrderManager{
    constructor(protected model: typeof Order) {}

    async findById(id: number): Promise<OrderAttributes>{
        const order = await this.model.findByPk(id);
        // @ts-ignore
        return order.toJSON();
    }

    async create(params: OrderCreationAttributes): Promise<OrderAttributes>{
        const order = await this.model.create(params);
        // @ts-ignore
        return order.toJSON();
    }

    async update(id: number, params: OrderAttributes){
        await this.model.update(params, {where: {id}});
    }
}


export class OrderManagerFactory {
    public static create(){
        return new OrderManager(Order);
    }
}
