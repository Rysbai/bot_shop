import {sequelize} from "./models";
import {Telegraf} from "telegraf";
import configs from "./configs";
import {
	addToBasketHandlerFactory,
	basketListHandlerFactory,
	issueOrderHandlerFactory,
	initNewProductHandlerFactory,
	payOrderHandlerFactory,
	startHandlerFactory,
	newProductHandlerFactory,
	productListHandlerFactory
} from "./handlers/handlers";
import{AuthMiddlewareFactory} from "./middlewares/auth";
import {BotTgContext} from "./handlers/types";
import {TGHandler} from "./handlers/base";
import {ExceptionCatchMiddlewareFactory} from "./middlewares/exceptionCatch";


async function initDb() {
	try {
		await sequelize.authenticate();
		await sequelize.sync();
	} catch (error) {
		console.log('Unable to connect to the database:');
		console.log(error.message);
		process.exit(1);
	}
}

async function initBot() {
	const bot = new Telegraf<BotTgContext>(configs.BOT_TOKEN);
	bot.use(async (ctx: BotTgContext, next: (ctx: BotTgContext) => {}) =>
		AuthMiddlewareFactory.create().execute(ctx, next));
	bot.use(async (ctx: BotTgContext, next: (ctx: BotTgContext) => {}) =>
		ExceptionCatchMiddlewareFactory.create().execute(ctx, next));

	bot.command('start', TGHandler.asHandler(startHandlerFactory));
	bot.action(/initNewProduct/, TGHandler.asHandler(initNewProductHandlerFactory));
	bot.action(/catalog/, TGHandler.asHandler(productListHandlerFactory));
	bot.action(/addToBasket/, TGHandler.asHandler(addToBasketHandlerFactory));
	bot.action(/goToBasket/, TGHandler.asHandler(basketListHandlerFactory));
	bot.action(/issueOrder/, TGHandler.asHandler(issueOrderHandlerFactory));
	bot.action(/payOrder/, TGHandler.asHandler(payOrderHandlerFactory));
	bot.on('message', TGHandler.asHandler(newProductHandlerFactory));

	await bot.launch();
}

async function init() {
	await initDb()
	await initBot();
}

init();
