interface Props {
	name: string;
	imgUrl: string;
	type: string;
	shop: number;
}
import { Link } from 'react-router-dom';
import styles from './ShopCard.module.scss';
const ShopCard = ({ name, imgUrl, type, shop }: Props) => {
	return (
		<Link to={`/shops/${shop}`} className={styles.wrapper}>
			<img src={imgUrl} alt={name} />
			<h3>{name}</h3>
			<p>{type}</p>
		</Link>
	);
};

export default ShopCard;
