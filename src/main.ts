import Product, { Item } from "./models/Product";

document.addEventListener('DOMContentLoaded', () => {
    generateShop();
});

document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const action = target.dataset.action;
    const id = parseInt(target.dataset.id || '');

    if (action === 'increment') {
        Product.increment(id);
    } else if (action === 'decrement') {
        Product.decrement(id);
    }
});

let generateShop = async () => {
    try {
        const response = await fetch('/products.json');
        if (!response.ok) {
            throw new Error('Failed to fetch shop data');
        }
        
        const shopItemsData: Item[] = await response.json();
        
        let html = shopItemsData.map((item: Item) => {
            try {
                const product = new Product(item.id, item.name, item.price, item.img);
                return product.generateHTML();
            } catch (error) {
                console.error(`Error creating product instance for item with ID ${item.id}:`, error);
                return ''; // or handle the error gracefully by displaying a message for the user
            }
        }).join("");
        
        let shop = document.getElementById("shop") as HTMLElement;
        if (shop) {
            shop.innerHTML = html;
        } else {
            console.error('Shop container element not found');
        }
    } catch (error) {
        console.error('Error fetching shop data:', error);
    }
};