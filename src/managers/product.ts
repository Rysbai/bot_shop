import {Product} from "../models";
import {ProductAttributes, ProductCreationAttributes} from "../models/types";
import {resourceLimits} from "worker_threads";


export class ProductManager{
    model: typeof Product

    constructor(modal: typeof Product) {
        this.model = modal
    }

    async create(attributes: ProductCreationAttributes): Promise<ProductAttributes>{
        const product = await this.model.create(attributes);
        // @ts-ignore
        return product.toJSON();
    }

    async getById(id: number): Promise<ProductAttributes>{
        const product = await this.model.findByPk(id);
        // @ts-ignore
        return product.toJSON();
    }

    async allWithLimit(limit: number = 10, offset: number = 0): Promise<Array<ProductAttributes>>{
        const queryset = await this.model.findAll({limit: limit});
        // @ts-ignore
        return queryset.map((instance) => instance.toJSON());
    }
}


export class ProductManagerFactory{
    public static create(): ProductManager {
        return new ProductManager(Product);
    }
}
