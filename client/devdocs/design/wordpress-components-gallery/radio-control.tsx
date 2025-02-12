import { RadioControl } from '@wordpress/components';
import React, { useState } from 'react';

const options = [
	{ label: 'Public', value: 'public' },
	{ label: 'Private', value: 'private' },
	{ label: 'Password Protected', value: 'password' },
];

const RadioExample = () => {
	const [ option, setOption ] = useState( 'public' );

	return (
		<RadioControl
			label="Post visibility"
			help="Help text for this radio control"
			options={ options }
			selected={ option }
			onChange={ setOption }
		/>
	);
};

export default RadioExample;
