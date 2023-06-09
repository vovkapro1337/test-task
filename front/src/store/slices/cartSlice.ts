import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface cartItem {
	id: number;
	title: string;
	price: number;
	quantity: number;
	type?: string;
	shop: number;
	image: string;
}

export interface cartItems {
	totalAmount: number;
	items: cartItem[];
}

const initialState: cartItems = {
	totalAmount: 0,
	items: [],
};

export const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addItem: (state, action: PayloadAction<cartItem>) => {
			if (state.items.length > 0 && state.items[0].shop !== action.payload.shop) {
				alert('Choose items from one shop only');
				return;
			}
			const findItem = state.items.find((item) => item.id === action.payload.id);
			if (findItem) {
				findItem.quantity += action.payload.quantity;
				state.totalAmount += action.payload.price * action.payload.quantity;
				return;
			} else {
				state.items.push(action.payload);
				state.totalAmount += action.payload.price * action.payload.quantity;
			}
		},
		removeItem: (state, action: PayloadAction<number>) => {
			const findItem = state.items.find((item) => item.id === action.payload);
			state.items = state.items.filter((item) => item.id !== action.payload);
			findItem ? (state.totalAmount -= findItem.price * findItem.quantity) : null;
		},
		increaseQuantity: (state, action: PayloadAction<number>) => {
			const findItem = state.items.find((item) => item.id === action.payload);
			if (findItem) {
				findItem.quantity++;
				state.totalAmount += findItem.price;
			}
		},
		decrementQuantity: (state, action: PayloadAction<number>) => {
			const findItem = state.items.find((item) => item.id === action.payload);
			if (findItem) {
				if (findItem.quantity === 1) return;
				findItem.quantity--;
				state.totalAmount -= findItem.price;
			}
		},
		clearCart: (state) => {
			state.items = [];
			state.totalAmount = 0;
		},
		setCart(state, action: PayloadAction<cartItems>) {
			state.items = action.payload.items;
			state.totalAmount = action.payload.totalAmount;
		},
	},
});

export const { actions } = cartSlice;

export default cartSlice.reducer;
