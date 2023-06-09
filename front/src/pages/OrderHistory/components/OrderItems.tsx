import { useGetOrdersQuery } from '../../../store/services/shopApi';
import { getOrders } from '../../../store/services/types';

interface Props {
	data: getOrders;
}
const OrderItems = ({ data }: Props) => {
	const { data: Orders } = useGetOrdersQuery(data);

	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				{Orders?.map((order) => {
					return order.items.map((item) => {
						return (
							<div
								key={item.id}
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									marginBottom: '20px',
								}}
							>
								<p style={{ marginTop: '10px', fontSize: '20px' }}>Order id {item.id}</p>
								<img
									src={item.image}
									alt={item.title}
									style={{ width: '100px', height: '100px' }}
								/>
								<h3 style={{ color: 'blue', fontSize: '18px' }}>{item.title}</h3>
								<p style={{ color: 'green' }}>Price: {item.price}</p>
								<p style={{ color: 'red' }}>Quantity: {item.quantity}</p>
							</div>
						);
					});
				})}
			</div>
		</>
	);
};

export default OrderItems;
