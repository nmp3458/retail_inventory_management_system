export interface Product {
    id?: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    image: string;
}


export interface ProductFilter {
  search: string;
  category: string;
}