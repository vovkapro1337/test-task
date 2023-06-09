import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../../store/services/shopApi';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './ShopPage.module.scss';
const ShopPage = () => {
	const { id } = useParams();
	const { data, isLoading } = useGetProductsQuery(Number(id));
	return (
		<>
			<div className={styles.cardsWrapper}>
				{!isLoading ? (
					data &&
					data.map((product) => {
						return (
							<ProductCard
								id={product.id}
								key={product.id}
								shop={product.shop}
								image={product.image}
								title={product.title}
								price={product.price}
							/>
						);
					})
				) : (
					<h1>Loading...</h1>
				)}
			</div>
		</>
	);
};

export default ShopPage;
