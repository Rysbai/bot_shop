import {Product} from "../models";
import {ProductCreationAttributes} from "../models/types";


export class ProductManager{
    model: typeof Product

    constructor(modal: typeof Product) {
        this.model = modal
    }

    async create(attributes: ProductCreationAttributes){
        return await this.model.create(attributes);
    }

    async getById(id: number){
        const product = await this.model.findByPk(id);
        if (!product){
            throw 'ProgrammingError'
        }
        return product
    }

    async all(){
        return await this.model.findAll();
    }
}


export class ProductManagerFactory{
    public static create(): ProductManager {
        return new ProductManager(Product);
    }
}
