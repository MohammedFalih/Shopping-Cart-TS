export interface Item {
    id: number;
    name: string;
    price: number;
    img: string;
    basket: { id: number, item: number }[];
}

class Product implements Item {
    id: number;
    name: string;
    price: number;
    img: string;
    basket: { id: number, item: number }[];

    constructor(id: number, name: string, price: number, img: string) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.img = img;
        this.basket = JSON.parse(localStorage.getItem("data") || '[]');
    }

    generateHTML(): string {
        return `
        <div id="product-id-${this.id}" class="item">
            <img width="220" src="${this.img}" alt="">
            <div class="details">
                <h3>${this.name}</h3>
                <div class="price-quantity">
                    <h3>Rs. ${this.price}</h3>
                    <div class="buttons">
                        <i data-action="decrement" data-id="${this.id}" class="bi bi-dash-lg"></i>
                        <div id="quantity-${this.id}" class="quantity">${this.getQuantity()}</div>
                        <i data-action="increment" data-id="${this.id}" class="bi bi-plus-lg"></i>
                    </div>
                </div>
            </div>
        </div>
    `;
    }

    getQuantity(): number {
        const item = this.basket.find(item => item.id === this.id);
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
        this.updateQuantityDisplay(id);
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
        this.updateQuantityDisplay(id);
    }

    static updateQuantityDisplay(id: number): void {
        const basket = JSON.parse(localStorage.getItem("data") || '[]');
        const totalQuantity = basket.reduce((acc: number, curr: any) => acc + curr.item, 0);
        const cartIcon = document.getElementById("cartAmount");
        if (cartIcon) {
            cartIcon.innerHTML = totalQuantity.toString();
        }

        const quantityElement = document.getElementById(`quantity-${id}`);
        if (quantityElement) {
            const item = basket.find((item: any) => item.id === id);
            quantityElement.innerHTML = item ? item.item.toString() : "0";
        }
    }
}

export default Product;