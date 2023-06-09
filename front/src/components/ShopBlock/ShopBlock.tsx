const shops = [
	{
		id: 0,
		name: 'McDonald`s',
		imgUrl:
			'https://res.cloudinary.com/glovoapp/q_30,f_auto,c_fill,h_250,w_450/Stores/utgagezitscehaksdjb4',
		type: 'American',
	},
	{
		id: 1,
		name: 'KFC',
		imgUrl:
			'https://res.cloudinary.com/glovoapp/q_30,f_auto,c_fill,h_250,w_450/Stores/szzdemcat83pqf3hyyrd',
		type: 'American',
	},
	{
		id: 2,
		name: 'PIZZA DAY',
		imgUrl:
			'https://res.cloudinary.com/glovoapp/q_30,f_auto,c_fill,h_250,w_450/Stores/rrb7a6egofhkcate1j3v',
		type: 'Italian',
	},
];
const h2Style: React.CSSProperties = {
	marginTop: '20px',
	fontSize: '32px',
	lineHeight: '1.25',
	textAlign: 'center',
	fontWeight: '600',
};
import ShopCard from '../ShopCard/ShopCard';
import styles from './ShopBlock.module.scss';
const ShopBlock = () => {
	return (
		<>
			<h2 style={h2Style}>Choose shop</h2>
			<div className={styles.shopsWrapper}>
				{shops.map((shop) => {
					return <ShopCard shop={shop.id} name={shop.name} imgUrl={shop.imgUrl} type={shop.type} />;
				})}
			</div>
		</>
	);
};

export default ShopBlock;
