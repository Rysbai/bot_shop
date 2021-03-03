import {Context} from "telegraf";
import {UserManager, UserManagerFactory} from "../managers/user";
import {BotTgContext} from "../handlers/types";


export class AuthMiddleware {
    constructor(protected userManager: UserManager) {}

    async execute(ctx: BotTgContext, next: (ctx: BotTgContext) => {}): Promise<void> {
        const tUserId = ctx.chat?.id;
        const tUsername = ctx.message?.from.username;
        if (!tUserId) {
            next(ctx);
            return
        }
        ctx.user = await this.userManager.getByTUserIdOrCreate(tUserId, {tUserId, tUsername});
        await next(ctx)
    }
}


export class AuthMiddlewareFactory{
    public static create() {
        return new AuthMiddleware(UserManagerFactory.create())
    }
}
