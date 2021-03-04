import {ProductManager} from "../managers/product";

interface ItemInterface {
    id: number,
    productId: number,
    count: number
}

export async function generateOrderInfo(text: string, items: Array<ItemInterface>, productManager: ProductManager): Promise<string> {
    let total = 0;
    await Promise.all(items.map(async ({id, ...item}, index) => {
        const product = await productManager.getById(item.productId);
        text += (`${index + 1}) ${product.name} - $${product.price}\n\nКоличество: ${item.count}\nСумма: $${product.price * item.count}\n` + '-----------------------------------\n')
        total += product.price;
    }));
    text += `Итого: $${total}`;
    return text;
}