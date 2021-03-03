import {Context} from "telegraf";
import {UserAttributes, UserCreationAttributes} from "../models/types";
import {Model} from "sequelize";

export interface BotTgContext extends Context{
    user: Model<UserAttributes, UserCreationAttributes>
}

export interface HandlerInterface{
    execute: (ctx: BotTgContext) => void
}


export interface HandlerFactoryInterface {
    create:  () => HandlerInterface
}