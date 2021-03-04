import {BotTgContext} from "../handlers/types";


class ExceptionCatchMiddleware {
    async execute(ctx: BotTgContext, next: (ctx: BotTgContext) => {}): Promise<void>{
        try {
            await next(ctx);
        } catch (e){
            console.log(e);
        }
    }
}


export class ExceptionCatchMiddlewareFactory {
    public static create() {
        return new ExceptionCatchMiddleware();
    }
}