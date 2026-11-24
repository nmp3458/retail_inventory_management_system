export interface Product {
    _id?: string;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    image: string;
}


export interface ProductFilter {
  search: string;
  category: string;
}