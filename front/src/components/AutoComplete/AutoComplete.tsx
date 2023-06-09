import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { useEffect } from 'react';
const AutoComplete = ({ setPos, register, setValueReg, address, setAddress }) => {
	const {
		ready,
		value,
		suggestions: { status, data },
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete({
		requestOptions: {
			/* Define search scope here */
		},
		debounce: 300,
	});

	const handleInput = (e) => {
		// Update the keyword of the input element
		setValue(e.target.value);
	};

	const handleSelect =
		({ description }) =>
		() => {
			// When user selects a place, we can replace the keyword without request data from API
			// by setting the second parameter to "false"
			setValue(description, false);
			setAddress(description);
			setValueReg('address', description);
			clearSuggestions();

			// Get latitude and longitude via utility functions
			getGeocode({ address: description }).then((results) => {
				const { lat, lng } = getLatLng(results[0]);
				setPos({ lat, lng });
			});
		};

	const renderSuggestions = () =>
		data.map((suggestion) => {
			const {
				place_id,
				structured_formatting: { main_text, secondary_text },
			} = suggestion;

			return (
				<li key={place_id} onClick={handleSelect(suggestion)}>
					<strong>{main_text}</strong> <small>{secondary_text}</small>
				</li>
			);
		});
	useEffect(() => {
		setValue(address, false);
	}, [address]);
	return (
		<>
			<input
				{...register('address')}
				value={value}
				required={true}
				onChange={handleInput}
				disabled={!ready}
				placeholder="Address"
			/>
			{status === 'OK' && <ul>{renderSuggestions()}</ul>}
		</>
	);
};
export default AutoComplete;
