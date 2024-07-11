import Product from "./models/Product";
import ShoppingCart from "./models/ShoppingCart";

document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const action = target.dataset.action;
    const id = parseInt(target.dataset.id || '');

    if (action === 'increment') {
        ShoppingCart.increment(id);
    } else if (action === 'decrement') {
        ShoppingCart.decrement(id);
    } else if (action === 'removeItem') {
        ShoppingCart.removeItem(id);
    } else if (action === 'clear') {
        ShoppingCart.clearCart();
    }
});

const generateCart = async () => {

    try {

        const response = await fetch('/products.json');
        if (!response.ok) {
            throw new Error('Failed to fetch shop data');
        }
        
        const shopItemsData: Product[] = await response.json();

        ShoppingCart.initialize(shopItemsData);
        const html = ShoppingCart.generateCartItems();
        const shoppingCartDiv = document.getElementById('shopping-cart');
        if (shoppingCartDiv) {
            shoppingCartDiv.innerHTML = html
        } else {
            console.error('Shopping cart div not found.');
        }
        ShoppingCart.totalAmount()
    } catch (error) {
        console.error('Error fetching shop data:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    generateCart();
});
