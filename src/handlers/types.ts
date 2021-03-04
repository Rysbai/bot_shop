import {Context} from "telegraf";
import {UserAttributes} from "../models/types";

export interface BotTgContext extends Context{
    user: UserAttributes
}

export interface HandlerInterface{
    execute: (ctx: BotTgContext) => void
}
