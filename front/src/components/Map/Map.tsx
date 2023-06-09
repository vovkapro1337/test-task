import { useEffect, useState } from 'react';
import AutoComplete from '../AutoComplete/AutoComplete';
import { getGeocode } from 'use-places-autocomplete';
import { useForm } from 'react-hook-form';
import {
	DirectionsRenderer,
	DirectionsService,
	GoogleMap,
	InfoWindow,
	LoadScript,
	Marker,
} from '@react-google-maps/api';
import styles from './../Cart/CartComponent.module.scss';
import { formValues } from '../../types/types';
import { useActions } from '../../hooks/useActions';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { useAddOrderMutation } from '../../store/services/shopApi';
const libraries = ['places'];
const mapOptions = {
	scrollwheel: false,
	clickableIcons: false,
	panControls: true,
	zoomControl: false,
	mapTypeControl: false,
	scaleControl: false,
	streetViewControl: false,
	rotateControl: false,
	clickableIcons: false,
	keyboardShortcuts: false,
	scrollwell: false,
	disableDoubleClickZoom: true,
};
const Map = () => {
	const { items } = useSelector((state: RootState) => state.cart);
	const { clearCart } = useActions();
	const [submitOrder] = useAddOrderMutation();
	const { register, handleSubmit, setValue } = useForm();
	const shopLocation = { lat: 50.462615896347494, lng: 30.35523240262413 };
	const [markerPosition, setMarkerPosition] = useState({
		lat: 50.462615896347494,
		lng: 30.35523240262413,
	});
	const [address, setAddress] = useState('');
	const [route, setRoute] = useState(null);
	const [travelTime, setTravelTime] = useState(null);
	const [showInfoWindow, setShowInfoWindow] = useState(false);

	const getAddress = (lat, lng) => {
		getGeocode({ latLng: { lat, lng } })
			.then((results) => {
				if (results && results.length > 0) {
					const address = results[0].formatted_address;
					setAddress(address);
					setValue('address', address);
				}
			})
			.catch((error) => {
				console.log('Error geocoding:', error);
			});
	};

	const onSubmit = (data: formValues) => {
		submitOrder({ ...data, items: JSON.stringify(items) });
		clearCart();
		alert('Your order has been submitted! You can see him in history order');
		// window.location.href = '/';
	};
	const handleDirectionsResponse = (response, status) => {
		if (status === 'OK') {
			setRoute(response);
			setTravelTime(response.routes[0].legs[0].duration.text);
			setShowInfoWindow(true);
		} else {
			console.error('Directions request failed. Status:', status);
		}
	};
	useEffect(() => {
		setRoute(null);
	}, [address]);

	return (
		<LoadScript libraries={libraries} googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<input {...register('name')} required={true} placeholder="Name" />
				<input {...register('email')} required={true} placeholder="Email" />
				<input {...register('phone')} required={true} placeholder="Phone" />
				<AutoComplete
					setAddress={setAddress}
					address={address}
					setValueReg={setValue}
					register={register}
					setPos={setMarkerPosition}
				/>
				<button type="submit">Submit</button>
				<div className={styles.mapContainer}>
					<GoogleMap
						mapContainerStyle={{ width: '100%', height: '400px' }}
						center={markerPosition}
						zoom={13}
						options={mapOptions}
						onClick={(e) => {
							const lat = e.latLng.lat();
							const lng = e.latLng.lng();
							setMarkerPosition({ lat, lng });
							getAddress(lat, lng);
						}}
					>
						<DirectionsService
							options={{
								destination: address,
								origin: shopLocation,
								travelMode: 'DRIVING',
							}}
							callback={handleDirectionsResponse}
						/>
						{route && <DirectionsRenderer directions={route} />}
						<Marker position={shopLocation}>
							{showInfoWindow && (
								<InfoWindow>
									<div>
										<p>Travel time: {travelTime} by the car</p>
									</div>
								</InfoWindow>
							)}
						</Marker>
					</GoogleMap>
				</div>
			</form>
		</LoadScript>
	);
};

export default Map;
