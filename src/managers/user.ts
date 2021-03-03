import {User} from "../models";
import {UserAttributes, UserCreationAttributes} from "../models/types";


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

    async getByTUserId(tUserId: number): Promise<UserAttributes | undefined> {
        const user = await this.model.findOne({where: {tUserId}});
        // @ts-ignore
        return user?.toJSON()
    }

    async getByTUserIdOrCreate(tUserId: number, defaults: UserCreationAttributes): Promise<UserAttributes>{
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
