import { useActions } from '../../hooks/useActions';
import styles from './ProductCard.module.scss';
interface Props {
	id: number;
	image: string;
	title: string;
	shop: number;
	price: number;
}
const ProductCard = ({ image, title, price, shop, id }: Props) => {
	const { addItem } = useActions();
	const addToCart = () => {
		addItem({ id, shop, title, quantity: 1, price: Number(price), image });
		console.log('Product added to the cart', shop);
	};

	return (
		<div className={styles.productCard}>
			<img src={image} alt={title} />
			<h3>{title}</h3>
			<span>{price}</span>
			<button onClick={addToCart}>Add to Cart</button>
		</div>
	);
};

export default ProductCard;
