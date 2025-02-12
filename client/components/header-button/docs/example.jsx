import React from 'react';
import HeaderButton from 'calypso/components/header-button';

const HeaderButtonExample = () => {
	const onClick = () => alert( 'clicked me!' );
	return (
		<div>
			<HeaderButton icon="plus-small" label="Add Plugin" onClick={ onClick } />
		</div>
	);
};

HeaderButtonExample.displayName = 'HeaderButton';

export default HeaderButtonExample;
