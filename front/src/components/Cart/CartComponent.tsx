import styles from './CartComponent.module.scss';
import CartItem from '../CartItem/CartItem';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Map from '../Map/Map';
const CartComponent = () => {
	const cart = useSelector((state: RootState) => state.cart);
	return cart.items.length === 0 ? (
		<div
			style={{
				height: '80vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				rowGap: '20px',
			}}
		>
			<img
				style={{ width: '328px', height: 'unset' }}
				src={
					'https://static.vecteezy.com/system/resources/previews/004/964/514/original/young-man-shopping-push-empty-shopping-trolley-free-vector.jpg'
				}
			/>
			<h1 style={{ fontSize: '28px', fontWeight: '600' }}>Your cart is empty</h1>

			<p style={{ fontSize: '20px' }}>Add items to the cart for apply order.</p>
		</div>
	) : (
		<div className={styles.cartContainer}>
			<div className={styles.formContainer}>
				<h2>Checkout Information</h2>
				<Map />
			</div>
			<div className={styles.productList}>
				<h3>Cart Items</h3>
				<div className={styles.productsWrapper}>
					{cart.items.map((product) => (
						<CartItem
							image={product.image}
							key={product.id}
							title={product.title}
							id={product.id}
							quantity={product.quantity}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default CartComponent;
