import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Orders, Product, addOrder, getOrders } from './types';

export const shopApi = createApi({
	reducerPath: 'shopApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'https://ecommerce-backend-vladimir2412.vercel.app/testTask',
	}),
	tagTypes: ['Product', 'Orders'],
	endpoints: (builder) => ({
		getProducts: builder.query<Product[], number>({
			query: (shopId) => `products2/${shopId}`,
			providesTags: () => ['Product'],
		}),
		addOrder: builder.mutation<string, addOrder>({
			query: (body) => ({
				method: 'POST',
				url: 'orders',
				body,
			}),
			invalidatesTags: ['Orders'],
		}),
		getOrders: builder.query<Orders, getOrders>({
			query: (body) => `orders/?email=${body.email}&phone=${body.phone}`,
			providesTags: () => ['Orders'],
		}),
	}),
});

export const { useGetProductsQuery, useAddOrderMutation, useGetOrdersQuery } = shopApi;
