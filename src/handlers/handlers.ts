import {Markup} from 'telegraf';
import {ProductManager, ProductManagerFactory} from "../managers/product";
import {BotTgContext, HandlerInterface} from "./types";
import {BasketItemManager, BasketItemManagerFactory} from "../managers/basketItem";
import {OrderManager, OrderManagerFactory} from "../managers/order";
import {OrderItemManager, OrderItemManagerFactory} from "../managers/orderItem";

export class Start implements HandlerInterface{
    async execute(ctx: BotTgContext){
        await ctx.reply('Hello World!');
        await productListFactory().execute(ctx);
    }
}


export class ProductsList implements HandlerInterface{
    constructor(protected productManager: ProductManager) {}

    async execute(ctx: BotTgContext){
        const products = await this.productManager.allWithLimit();
        for (const product of products) {
            const text = `<b>${product.name} - $${product.price}</b> \n\n ${product.description}`;
            const addToBasket = Markup.button.callback('Добавить в карзину',
                JSON.stringify({action: 'addToBasket', productId: product.id}));
            const goToBasket = Markup.button.callback('Перейти в карзину', `goToBasket`);
            const keyboard = Markup.inlineKeyboard([[addToBasket], [goToBasket]])
            await ctx.replyWithHTML(text, keyboard);
        }
    }
}


export class BasketList implements HandlerInterface {
    constructor(protected basketItemManager: BasketItemManager,
                protected productManager: ProductManager) {
    }

    async execute(ctx: BotTgContext){
        const userId: number = ctx.user.id;
        const basketItems = await this.basketItemManager.filterUserBasketItems(userId);
        if (basketItems.length === 0){
            await ctx.reply('Ваша карзина пуста');
            return
        }

        let text = '';
        await Promise.all(basketItems.map(async (basketItem) => {
            const product = await this.productManager.getById(basketItem.productId);
            text += `<b>${product.name} - ${product.price}</b>\n\n Количество: ${basketItem.count}`;
        }))

        const markup = Markup.inlineKeyboard([
            [Markup.button.callback('Оформить заказ', 'issueOrder')]
        ]);
        await ctx.replyWithHTML(text, markup);
    }
}

export class AddToBasket implements HandlerInterface {
    constructor(protected basketItemManager: BasketItemManager) {}

    async execute(ctx: BotTgContext) {
        const userId = ctx.user.id;
        // @ts-ignore
        const productId = JSON.parse(ctx.callbackQuery.data).productId;
        await this.basketItemManager.createOrIncrementCount(userId, productId);
        await ctx.reply('Товар успешно добавлен в карзину!')
    }
}

export class IssueOrder implements HandlerInterface {
    constructor(protected basketItemManager: BasketItemManager,
                protected orderManager: OrderManager,
                protected orderItemManager: OrderItemManager,
                protected productManager: ProductManager) {}

    async execute(ctx: BotTgContext){
        const userId = ctx.user.id;
        const basketItems = await this.basketItemManager.filterUserBasketItems(userId);
        const order = await this.orderManager.create({userId, isPaid: false});

        let text = `<b>Ваш заказ #${order.id}</b>\n\n`;
        await Promise.all(basketItems.map(async ({id, ...item}) => {
            const product = await this.productManager.getById(item.productId);
            text += (`${product.name} - $${product.price}\n\nКоличество: ${item.count}\nИтого: $${product.price * item.count}\n` + '-----------------------------------')
            await this.orderItemManager.create({orderId: order.id, ...item});
        }));

        await this.basketItemManager.clearUserBasket(userId);
        const markup = Markup.inlineKeyboard([
            [Markup.button.callback('Оплатить заказ', 'paidOrder')]
        ]);
        await ctx.replyWithHTML(text, markup)
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
    return new AddToBasket(basketItemManager,);
}

export function basketListFactory(): HandlerInterface {
    const basketItemManager = BasketItemManagerFactory.create();
    const productManager = ProductManagerFactory.create();
    return new BasketList(basketItemManager, productManager);
}

export function issueOrderFactory(): HandlerInterface {
    const basketItemManager = BasketItemManagerFactory.create();
    const orderManager = OrderManagerFactory.create();
    const orderItemManager = OrderItemManagerFactory.create();
    const productManager = ProductManagerFactory.create();
    return new IssueOrder(basketItemManager, orderManager, orderItemManager, productManager);
}
