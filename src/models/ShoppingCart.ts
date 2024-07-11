import Product from "./Product";

export default class ShoppingCart {
    static basket: { id: number, item: number }[] = [];
    static shopItemsData: Product[] = [];

    static initialize(shopItemsData: Product[]): void {
        ShoppingCart.basket = JSON.parse(localStorage.getItem("data") || '[]');
        ShoppingCart.shopItemsData = shopItemsData;
    }

    static generateCartItems(): string { 
        if (ShoppingCart.basket.length !== 0) {
            return ShoppingCart.basket
                .map(({ id, item }) => {
                    const product = ShoppingCart.shopItemsData.find(shopItem => shopItem.id === id);
                    if (!product) return ''; // If product not found, return an empty string
                    return ShoppingCart.generateCartItemHTML(product, id, item);
                })
                .join("");
        } else {
            return `
                <div class="home" id="home">
                    <h2>Cart is Empty.Let's add some items.</h2>
                    <a href="index.html">
                        <button class="HomeBtn">Back to home</button>
                    </a>
                </div>
            `;
        }
    }

    private static generateCartItemHTML(product: Product, id: number, item: number): string {
        const totalPrice = item * product.price;
        return `
            <div class="cart-item">
                <img width="100" src="${product.img}" alt="" />
                <div class="details">
                    <div class="title-price-x">
                        <h4 class="title-price">
                            <p>${product.name}</p>
                            <p class="cart-item-price">Rs. ${product.price}</p>
                        </h4>
                        <i data-action="removeItem" data-id="${id}" class="bi bi-x-lg"></i>                   
                    </div>
                    <div class="buttons">
                        <i data-action="decrement" data-id="${id}" class="bi bi-dash-lg"></i>
                        <div id="quantity-${id}" class="quantity">${ShoppingCart.getQuantity(id)}</div>
                        <i data-action="increment" data-id="${id}" class="bi bi-plus-lg"></i>
                    </div>
                    <div class="cart-item-total">
                    <h3 id="total-price-${id}">Rs. ${totalPrice}</h3>
                    </div>
                </div>
            </div>
        `;
    }

    static getQuantity(itemId: number): number {
        const item = ShoppingCart.basket.find(item => item.id === itemId);
        return item ? item.item : 0;
    }

    static increment(id: number): void {
        let basket = JSON.parse(localStorage.getItem("data") || '[]');
        let itemIndex = basket.findIndex((item: any) => item.id === id);
        if (itemIndex === -1) {
            basket.push({ id: id, item: 1 });
        } else {
            basket[itemIndex].item++;
        }

        localStorage.setItem("data", JSON.stringify(basket));
        ShoppingCart.updateQuantityDisplay(id);   
    }

    static decrement(id: number): void {
        let basket = JSON.parse(localStorage.getItem("data") || '[]');
        let itemIndex = basket.findIndex((item: any) => item.id === id);

        if (itemIndex === -1 || basket[itemIndex].item === 0) {
            return;
        }

        basket[itemIndex].item--;

        if (basket[itemIndex].item === 0) {
            basket.splice(itemIndex, 1);     
        }

        localStorage.setItem("data", JSON.stringify(basket));      
        ShoppingCart.updateQuantityDisplay(id);
    }

    static removeItem(id?: number): void {
        let basket = JSON.parse(localStorage.getItem("data") || '[]');
        let itemIndex = basket.findIndex((item: any) => item.id === id);
        
        if (itemIndex !== -1) {
            basket.splice(itemIndex, 1);
        }
        localStorage.setItem("data", JSON.stringify(basket));
        ShoppingCart.totalAmount();
        ShoppingCart.updateQuantityDisplay(id);
    }

    static clearCart(): void {
        ShoppingCart.basket = [];
        localStorage.setItem("data", JSON.stringify(ShoppingCart.basket));  
        ShoppingCart.totalAmount()
        ShoppingCart.updateQuantityDisplay();   
    }

    static totalAmount(): any {
        const label = document.querySelector('.text-center');
            if (label) {
                label.innerHTML = `
                <div class="cart-amount">
                <h2>Total Amount</h2><h2 id="total-bill">Rs. ${this.calculateTotalAmount()}</h2>
                </div>
                <button class="checkout">Checkout</button>
                <button data-action="clear" class="removeAll">Clear Cart</button>
            `;
        }
    }
    
    static calculateTotalAmount(): number {
        return ShoppingCart.basket
            .map(({ item, id }) => {
                const product = ShoppingCart.shopItemsData.find(y => y.id === id);
                return product ? item * product.price : 0;
            })
            .reduce((x, y) => x + y, 0);
    } 

    static updateQuantityDisplay(id?: number): void {
        const basket = JSON.parse(localStorage.getItem("data") || '[]');
        const cartAmount = document.getElementById("cartAmount");
        if (cartAmount) {
            const totalQuantity = basket.reduce((acc: number, curr: any) => acc + curr.item, );
            cartAmount.innerHTML = totalQuantity.toString();
        }
    
        const quantityElement = document.getElementById(`quantity-${id}`);
        if (quantityElement) {
            const item = basket.find((item: any) => item.id === id);
            quantityElement.innerHTML = item ? item.item.toString() : "0";
        } 
    
        const totalPriceElement = document.getElementById(`total-price-${id}`);
        if (totalPriceElement) {
            const item = basket.find((item: any) => item.id === id);
            const product = ShoppingCart.shopItemsData.find((shopItem: Product) => shopItem.id === id);
            if (item && product) {
                const totalPrice = item.item * product.price;
                totalPriceElement.textContent = `Rs. ${totalPrice}`;
            }
        }

        const totalBillElement = document.getElementById('total-bill') as HTMLElement;
        if(totalBillElement) {
            console.log('this is update');
            const amount = this.calculateTotalAmount()
            totalBillElement.textContent = `Rs. ${amount}`
        } 

        const cartItem = document.querySelector(`.cart-item[data-id="${id}"]`)
        cartItem?.remove()       
    }
}