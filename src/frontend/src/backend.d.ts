import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CartItem {
    productId: bigint;
    quantity: bigint;
}
export interface CustomerInfo {
    name: string;
    email: string;
    address: string;
}
export interface Product {
    id: bigint;
    stockQuantity: bigint;
    name: string;
    description: string;
    imageUrl: string;
    price: bigint;
}
export interface backendInterface {
    addProduct(name: string, description: string, price: bigint, imageUrl: string, stockQuantity: bigint): Promise<bigint>;
    addToCart(productId: bigint, quantity: bigint): Promise<void>;
    checkout(customerInfo: CustomerInfo): Promise<bigint>;
    deleteProduct(id: bigint): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getCart(): Promise<Array<CartItem>>;
    getProduct(id: bigint): Promise<Product>;
    removeCartItem(productId: bigint): Promise<void>;
    updateCartItem(productId: bigint, quantity: bigint): Promise<void>;
    updateProduct(id: bigint, name: string, description: string, price: bigint, imageUrl: string, stockQuantity: bigint): Promise<void>;
}
