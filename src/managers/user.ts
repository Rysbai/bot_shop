import {User} from "../models";
import {UserAttributes, UserCreationAttributes} from "../models/types";
import {Model} from "sequelize";


export class UserManager{
    protected model: typeof User;

    constructor(model: typeof User) {
        this.model = model
    }

    async create(attributes: UserCreationAttributes): Promise<Model<UserAttributes, UserCreationAttributes>>{
        return await this.model.create(attributes);
    }

    async getByTUserId(tUserId: number): Promise<Model<UserAttributes, UserCreationAttributes> | null> {
        return await this.model.findOne({where: {tUserId}});
    }

    async getByTUserIdOrCreate(tUserId: number, defaults: UserCreationAttributes): Promise<Model<UserAttributes, UserCreationAttributes>>{
        const user = await this.getByTUserId(tUserId);
        if (!user){
            return await this.create(defaults);
        }
        return user;
    }
}


export class UserManagerFactory {
    public static create(): UserManager {
        return new UserManager(User);
    }
}
