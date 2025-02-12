import { localize } from 'i18n-calypso';
import React from 'react';
import conciergeImage from 'calypso/assets/images/illustrations/jetpack-concierge.svg';
import PurchaseDetail from 'calypso/components/purchase-detail';

const noop = () => {};

export default localize( ( { isWpcomPlan, translate, link, onClick = noop } ) => {
	return (
		<div className="product-purchase-features-list__item">
			<PurchaseDetail
				icon={ <img alt="" src={ conciergeImage } /> }
				title={ translate( 'Quick Start session' ) }
				description={
					isWpcomPlan
						? translate(
								'Schedule a one-on-one session with a WordPress.com expert ' +
									'to get your site up and running quickly.'
						  )
						: translate(
								'Schedule a one-on-one orientation session to set up your site ' +
									'and learn more about Jetpack.'
						  )
				}
				buttonText={ translate( 'Schedule a session' ) }
				href={ link }
				onClick={ onClick }
			/>
		</div>
	);
} );
