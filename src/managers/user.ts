import {User} from "../models";
import {UserAttributes, UserCreationAttributes} from "../models/types";
import configs from "../configs";


export class UserManager{
    protected model: typeof User;

    constructor(model: typeof User) {
        this.model = model
    }

    async create(attributes: UserCreationAttributes): Promise<UserAttributes>{
        const user = await this.model.create(attributes);
        // @ts-ignore
        return user.toJSON();
    }

    async getByChatId(tChatId: number): Promise<UserAttributes | undefined> {
        const user = await this.model.findOne({where: {tChatId}});
        // @ts-ignore
        return user?.toJSON()
    }

    async getByChatIdOrCreate(tUserId: number, defaults: UserCreationAttributes): Promise<UserAttributes>{
        const user = await this.getByChatId(tUserId);
        if (!user){
            return await this.create(defaults);
        }
        return user;
    }

    async getAdmin(): Promise<UserAttributes>{
        const user = await this.model.findOne({where: {tUsername: configs.ADMIN_USERNAME}});
        if (!user) throw 'AdminIsNotRegistered';
        // @ts-ignore
        return user.toJSON();
    }
}


export class UserManagerFactory {
    public static create(): UserManager {
        return new UserManager(User);
    }
}
