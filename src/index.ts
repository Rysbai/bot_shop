import {sequelize} from "./models";
import {Telegraf} from "telegraf";
import configs from "./configs";
import {addToBasketFactory, productListFactory, startFactory} from "./handlers/handlers";
import{AuthMiddlewareFactory} from "./middlewares/auth";
import {BotTgContext} from "./handlers/types";
import {TGHandler} from "./handlers/base";

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
		AuthMiddlewareFactory.create().execute(ctx, next))
	bot.command('start', TGHandler.asHandler(startFactory));
	bot.action(/addToBasket/, TGHandler.asHandler(productListFactory));
	bot.action(/goToBasket/, TGHandler.asHandler(addToBasketFactory));
	await bot.launch();
}

async function init() {
	await initDb()
	await initBot();
}

init();
