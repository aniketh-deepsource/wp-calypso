import { useTranslate } from 'i18n-calypso';
import React from 'react';
import migrationIllustration from 'calypso/assets/images/customer-home/illustration--import-complete.svg';
import { NOTICE_CELEBRATE_SITE_MIGRATION } from 'calypso/my-sites/customer-home/cards/constants';
import CelebrateNotice from 'calypso/my-sites/customer-home/cards/notices/celebrate-notice';

const CelebrateSiteMigration = () => {
	const translate = useTranslate();
	return (
		<CelebrateNotice
			actionText={ translate( "Show me what's next" ) }
			description={ translate(
				"You finished importing your site. We'll guide you on the next steps to start growing your site."
			) }
			noticeId={ NOTICE_CELEBRATE_SITE_MIGRATION }
			title={ translate( 'Your site has been imported!' ) }
			illustration={ migrationIllustration }
			showSkip={ true }
			skipText={ translate( 'Dismiss' ) }
		/>
	);
};

export default CelebrateSiteMigration;
