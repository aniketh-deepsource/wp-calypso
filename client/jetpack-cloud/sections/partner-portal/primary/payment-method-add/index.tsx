import { Card } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import React, { ReactElement } from 'react';
import CardHeading from 'calypso/components/card-heading';
import DocumentHead from 'calypso/components/data/document-head';
import Main from 'calypso/components/main';
import SidebarNavigation from 'calypso/jetpack-cloud/sections/partner-portal/sidebar-navigation';

export default function PaymentMethodAdd(): ReactElement {
	const translate = useTranslate();

	return (
		<Main wideLayout className="payment-method-add">
			<DocumentHead title={ translate( 'Payment Method' ) } />
			<SidebarNavigation />

			<div className="payment-method-add__header">
				<CardHeading size={ 36 }>{ translate( 'Payment Method' ) }</CardHeading>
			</div>

			<Card className="payment-method-add__body">
				<div className="payment-method-add__body-left"></div>

				<div className="payment-method-add__body-right"></div>
			</Card>
		</Main>
	);
}
