import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import Header from './components/Header/Header';
import ShopPage from './pages/Shop/ShopPage';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { useActions } from './hooks/useActions';
import Cart from './pages/Cart/Cart';
import OrderHistory from './pages/OrderHistory/OrderHistory';
const AppLoader = () => {
	const cart = useSelector((state: RootState) => state.cart);
	const { setCart } = useActions();
	useEffect(() => {
		const cartData = localStorage.getItem('cart');
		if (cartData) {
			setCart(JSON.parse(cartData));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('cart', JSON.stringify(cart));
	}, [cart]);

	return (
		<>
			<Header />
			<Routes>
				<Route path={'/'} element={<HomePage />} />
				<Route path={'/cart'} element={<Cart />} />
				<Route path={'/shops/:id'} element={<ShopPage />} />
				<Route path={'/order-history'} element={<OrderHistory />} />
				<Route path={'*'} element={<h1>Page not found</h1>} />
			</Routes>
		</>
	);
};

export default AppLoader;
