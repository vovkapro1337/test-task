import { useActions } from '../../hooks/useActions';
import styles from './CartItem.module.scss';
interface Props {
	image: string;
	id: number;
	quantity: number;
	title: string;
}
const CartItem = ({ title, id, quantity, image }: Props) => {
	const { increaseQuantity, decrementQuantity, removeItem } = useActions();
	return (
		<div className={styles.productItem}>
			<h4>{title}</h4>
			<img src={image} alt="Product" />
			<div className={styles.countContainer}>
				<button
					className={styles.countButton}
					onClick={() => {
						decrementQuantity(id);
					}}
				>
					-
				</button>
				<span className={styles.count}>{quantity}</span>
				<button
					className={styles.countButton}
					onClick={() => {
						increaseQuantity(id);
					}}
				>
					+
				</button>
			</div>
			<button onClick={() => removeItem(id)}>Delete item</button>
		</div>
	);
};

export default CartItem;
