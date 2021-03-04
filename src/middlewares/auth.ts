import {UserManager, UserManagerFactory} from "../managers/user";
import {BotTgContext} from "../handlers/types";


export class AuthMiddleware {
    constructor(protected userManager: UserManager) {}

    async execute(ctx: BotTgContext, next: (ctx: BotTgContext) => {}): Promise<void> {
        const tChatId = ctx.chat?.id;
        const tUsername = ctx.message?.from.username;
        if (!tChatId) {
            next(ctx);
            return
        }
        ctx.user = await this.userManager.getByChatIdOrCreate(tChatId, {tChatId, tUsername});
        await next(ctx)
    }
}


export class AuthMiddlewareFactory{
    public static create() {
        return new AuthMiddleware(UserManagerFactory.create())
    }
}
