export interface Product {
    _id?: string;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    image: string;
    discount?: number;
    color?: string;
}


export interface ProductFilter {
  search: string;
  category: string;
  discount: string;
  color: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
