import {BasketItem, Product,} from "../models";
import {BasketItemAttributes, BasketItemCreationAttributes} from "../models/types";


export class BasketItemManager {
    constructor(protected model: typeof BasketItem) {}

    async create(params: BasketItemCreationAttributes): Promise<BasketItemAttributes> {
        const instance = await this.model.create(params);
        // @ts-ignore
        return instance.toJSON();
    }

    async createOrIncrementCount(userId: number, productId: number): Promise<BasketItemAttributes>{
        const basketItem = await this.model.findOne({where: {userId, productId}});
        if (!basketItem){
            return await this.create({userId, productId, count: 1});
        }
        // @ts-ignore
        const basketItemData: BasketItemAttributes = basketItem.toJSON();
        basketItemData.count += 1
        await this.model.update({count: basketItemData.count}, {where: {id: basketItemData.id}});
        return basketItemData
    }

    async filterUserBasketItems(userId: number): Promise<Array<BasketItemAttributes>>{
        let queryset = await this.model.findAll({where: {userId: userId}, include: Product});
        // @ts-ignore
        return queryset.map((instance) => instance.toJSON());
    }

    async clearUserBasket(userId: number){
        await this.model.destroy({where: {userId}});
    }
}


export class BasketItemManagerFactory {
    public static create() {
        return new BasketItemManager(BasketItem);
    }
}
