import { FieldValues, useForm } from 'react-hook-form';
import { useState } from 'react';
import { Orders, getOrders } from '../../store/services/types';
import OrderItems from './components/OrderItems';

const OrderHistory = () => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();
	const [data, setData] = useState<null | getOrders>(null);
	const onSubmit = async (formData: FieldValues) => {
		try {
			setData(formData as getOrders);
		} catch (error) {
			console.error('Error retrieving order history', error);
		}
	};
	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<input type="text" placeholder="Email" {...register('email', { required: true })} />
				{errors.email && <span>Email is required</span>}
				<input type="text" placeholder="Phone" {...register('phone', { required: true })} />
				{errors.phone && <span>Phone is required</span>}
				<button type="submit">Get Order History</button>
				{data && <OrderItems data={data} />}
			</form>
		</div>
	);
};

export default OrderHistory;
