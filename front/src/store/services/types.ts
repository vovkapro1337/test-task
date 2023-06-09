import { cartItem } from '../slices/cartSlice';

export interface Product {
	id: number;
	image: string;
	price: number;
	shop: number;
	type: string;
	title: string;
}
export interface addOrder {
	name: string;
	email: string;
	phone: string;
	address: string;
	items: string;
}
export interface getOrders {
	email: string;
	phone: string;
}

export interface Orders extends Omit<addOrder, 'items'> {
	items: cartItem[];
	id: number;
	name: string;
	phone: string;
	address: string;
}
