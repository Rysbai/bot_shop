import {Markup} from 'telegraf';
import {ProductManager, ProductManagerFactory} from "../managers/product";
import {BotTgContext, HandlerInterface} from "./types";
import {BasketItemAttributes, ProductAttributes} from "../models/types";
import {BasketItemManager, BasketItemManagerFactory} from "../managers/basketItem";

export class Start implements HandlerInterface{
    async execute(ctx: BotTgContext){
        await ctx.reply('Hello World!');
        await productListFactory().execute(ctx);
    }
}


export class ProductsList implements HandlerInterface{
    constructor(protected productManager: ProductManager) {}

    async execute(ctx: BotTgContext){
        const products = await this.productManager.all();
        await Promise.all(products.map(async (product) => {
            // @ts-ignore
            const data: ProductAttributes = product.toJSON();
            const text = `<b>${data.name} - $${data.price}</b> \n\n ${data.description}`;
            const addToBasket = Markup.button.callback('Добавить в карзину',
                `addToBasket?productId=${data.id}`);
            const goToBasket = Markup.button.callback('Перейти в карзину', `goToBasket`);
            const keyboard = Markup.inlineKeyboard([[addToBasket], [goToBasket]])
            await ctx.replyWithHTML(text, keyboard);
        }));
    }
}


export class AddToBasket implements HandlerInterface {
    constructor(protected basketItemManager: BasketItemManager,
                protected productManager: ProductManager) {
    }
    async execute(ctx: BotTgContext) {
        // @ts-ignore
        const userId: number = ctx.user.toJSON().id;
        const basketItems = await this.basketItemManager.filterUserBasketItems(userId);
        if (basketItems.length === 0){
            await ctx.reply('Ваша карзина пуста');
            return
        }

        let text = '';
        await Promise.all(basketItems.map(async (_basketItem) => {
            // @ts-ignore
            const basketItem: BasketItemAttributes = _basketItem.toJSON();
            const _product = await this.productManager.getById(basketItem.productId);
            // @ts-ignore
            const product: ProductAttributes = _product.toJSON();
            text += `<b>${product.name} - ${product.price}</b>\n\n Количество: ${basketItem.count}`;
        }))

        await ctx.replyWithHTML(text)
    }
}

export function startFactory(): HandlerInterface {
    return new Start();
}

export function productListFactory(): HandlerInterface {
    const projectManager = ProductManagerFactory.create()
    return new ProductsList(projectManager);
}


export function addToBasketFactory(): HandlerInterface {
    const basketItemManager = BasketItemManagerFactory.create();
    const productManager = ProductManagerFactory.create();
    return new AddToBasket(basketItemManager, productManager);
}
