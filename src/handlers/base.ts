import {BotTgContext, HandlerInterface} from "./types";


type handlerFactory = () => HandlerInterface;


export class TGHandler{
    public static asHandler(handlerFactory: handlerFactory) {
        return async (ctx: BotTgContext) => await handlerFactory().execute(ctx);
    }
}
