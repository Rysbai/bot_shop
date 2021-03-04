import {Markup} from 'telegraf';
import {ProductManager, ProductManagerFactory} from "../managers/product";
import {BotTgContext, HandlerInterface} from "./types";
import {BasketItemManager, BasketItemManagerFactory} from "../managers/basketItem";
import {OrderManager, OrderManagerFactory} from "../managers/order";
import {OrderItemManager, OrderItemManagerFactory} from "../managers/orderItem";
import {UserManager, UserManagerFactory} from "../managers/user";
import configs from "../configs";
import {generateOrderInfo} from "./helpers";


class StartHandler implements HandlerInterface{
    constructor(protected productListHandler: HandlerInterface) {}
    async execute(ctx: BotTgContext){
        const buttons = [
            [Markup.button.callback('📒 Каталог', 'catalog')],
            [Markup.button.callback('🛒 Карзина', 'goToBasket')],
        ]
        if (ctx.user.tUsername === configs.ADMIN_USERNAME){
            buttons.push([Markup.button.callback('🆕 Добавить новый товар', 'initNewProduct')]);
        }
        await ctx.reply('🏠 Главное меню', Markup.inlineKeyboard(buttons));
    }
}


class ShowProductListHandler implements HandlerInterface{
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


class ShowBasketListHandler implements HandlerInterface {
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
        let text = `<b>Ваша карзина</b>\n\n`;
        text = await generateOrderInfo(text, basketItems, this.productManager);
        const markup = Markup.inlineKeyboard([
            [Markup.button.callback('Оформить заказ', 'issueOrder')]
        ]);
        await ctx.replyWithHTML(text, markup);
    }
}

class AddToBasketHandler implements HandlerInterface {
    constructor(protected basketItemManager: BasketItemManager) {}

    async execute(ctx: BotTgContext) {
        const userId = ctx.user.id;
        // @ts-ignore
        const productId = JSON.parse(ctx.callbackQuery.data).productId;
        await this.basketItemManager.createOrIncrementCount(userId, productId);
        await ctx.reply('Товар успешно добавлен в карзину!')
    }
}

class IssueOrderHandler implements HandlerInterface {
    constructor(protected basketItemManager: BasketItemManager,
                protected orderManager: OrderManager,
                protected orderItemManager: OrderItemManager,
                protected productManager: ProductManager) {}

    async execute(ctx: BotTgContext){
        const userId = ctx.user.id;
        const basketItems = await this.basketItemManager.filterUserBasketItems(userId);
        const order = await this.orderManager.create({userId, isPaid: false});

        let text = `<b>Ваш заказ #${order.id}</b>\n\n`;
        text = await generateOrderInfo(text, basketItems, this.productManager);
        await Promise.all(basketItems.map(async (item) => {
            await this.orderItemManager.create({orderId: order.id, ...item});
        }))

        await this.basketItemManager.clearUserBasket(userId);
        const markup = Markup.inlineKeyboard([
            [Markup.button.callback('Оплатить заказ',
                JSON.stringify({action: 'payOrder', orderId: order.id}))]
        ]);
        await ctx.replyWithHTML(text, markup);
    }
}

class PayOrderHandler implements HandlerInterface {
    constructor(protected orderManager: OrderManager,
                protected userManager: UserManager,
                protected productManager: ProductManager,
                protected orderItemManager: OrderItemManager) {}

    async execute(ctx: BotTgContext) {
        // @ts-ignore
        const orderId = JSON.parse(ctx.callbackQuery.data).orderId;
        const order = await this.orderManager.findById(orderId);
        await this.orderManager.update(orderId, {...order, isPaid: true});
        await ctx.reply('Ваш заказ успешно оплачен!');

        const admin = await this.userManager.getAdmin();
        let orderInfo = `Оплачен новый заказ #${order.id} от пользователя @${ctx.user.tUsername}\n\n`;
        const orderItems = await this.orderItemManager.filterByOrderId(orderId);
        orderInfo = await generateOrderInfo(orderInfo, orderItems, this.productManager);
        await ctx.tg.sendMessage(admin.tChatId, orderInfo);
    }
}


class NewProductInitHandler implements HandlerInterface {
    constructor() {}

    async execute(ctx: BotTgContext){
        if (ctx.user.tUsername === configs.ADMIN_USERNAME){
            await ctx.reply('Опишите товар в формате:\n\n<Название>\n\n<Описание>\n\n<Цена>');
        }
    }
}


class NewProductHandler implements HandlerInterface {
    constructor(protected productManager: ProductManager) {}
    async execute(ctx: BotTgContext){
        if (ctx.user.tUsername !== configs.ADMIN_USERNAME){
            return
        }
        // @ts-ignore
        const params = ctx.message.text.split('\n\n');
        if (params.length !== 3){
            await ctx.reply('Не правильный формат данных! Опишите продукт в формате:\n\n<Название>\n\n<Описание>\n\n<Цена>');
            return
        }
        let [name, description, price] = params;
        price = Number(price);
        await this.productManager.create({name, description, price});
        await ctx.reply('Товар успешно создан!')
    }
}


export function startHandlerFactory(): HandlerInterface {
    const productListHandler = productListHandlerFactory();
    return new StartHandler(productListHandler);
}


export function productListHandlerFactory(): HandlerInterface {
    const projectManager = ProductManagerFactory.create();
    return new ShowProductListHandler(projectManager);
}

export function addToBasketHandlerFactory(): HandlerInterface {
    const basketItemManager = BasketItemManagerFactory.create();
    return new AddToBasketHandler(basketItemManager,);
}

export function basketListHandlerFactory(): HandlerInterface {
    const basketItemManager = BasketItemManagerFactory.create();
    const productManager = ProductManagerFactory.create();
    return new ShowBasketListHandler(basketItemManager, productManager);
}

export function issueOrderHandlerFactory(): HandlerInterface {
    const basketItemManager = BasketItemManagerFactory.create();
    const orderManager = OrderManagerFactory.create();
    const orderItemManager = OrderItemManagerFactory.create();
    const productManager = ProductManagerFactory.create();
    return new IssueOrderHandler(basketItemManager, orderManager, orderItemManager, productManager);
}


export function payOrderHandlerFactory(): HandlerInterface {
    const orderManager = OrderManagerFactory.create();
    const userManager = UserManagerFactory.create();
    const productManager = ProductManagerFactory.create();
    const orderItemManager = OrderItemManagerFactory.create();
    return new PayOrderHandler(orderManager, userManager, productManager, orderItemManager);
}


export function initNewProductHandlerFactory(): HandlerInterface {
    return new NewProductInitHandler();
}


export function newProductHandlerFactory(): HandlerInterface {
    const productManager =  ProductManagerFactory.create();
    return new NewProductHandler(productManager);
}
