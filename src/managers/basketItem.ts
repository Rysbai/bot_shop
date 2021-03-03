import {BasketItem, Product} from "../models";
import {BasketItemAttributes, BasketItemCreationAttributes, BasketItemInstance} from "../models/types";
import {Model} from "sequelize";


export class BasketItemManager {
    constructor(protected model: typeof BasketItem) {}

    async create(params: BasketItemCreationAttributes): Promise<Model<BasketItemAttributes, BasketItemCreationAttributes>>{
        return await this.model.create(params);
    }

    async filterUserBasketItems(userId: number): Promise<Array<Model<BasketItemAttributes, BasketItemCreationAttributes>>>{
        return await this.model.findAll({where: {userId: userId}, include: Product});
    }
}


export class BasketItemManagerFactory {
    public static create() {
        return new BasketItemManager(BasketItem);
    }
}
