import { useTranslate } from 'i18n-calypso';
import React from 'react';
import EmptyContent from 'calypso/components/empty-content';
import Main from 'calypso/components/main';
import SidebarNavigation from 'calypso/my-sites/sidebar-navigation';

const NotAuthorizedPage: React.FC = () => {
	const translate = useTranslate();

	return (
		<Main>
			<SidebarNavigation />
			<EmptyContent
				illustration="/calypso/images/illustrations/illustration-404.svg"
				title={ translate( 'You are not authorized to view this page' ) }
			/>
		</Main>
	);
};

export default NotAuthorizedPage;
