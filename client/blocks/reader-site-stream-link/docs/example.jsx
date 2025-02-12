import { Card } from '@automattic/components';
import React from 'react';
import ReaderSiteStreamLink from 'calypso/blocks/reader-site-stream-link';

export default class ReaderSiteStreamLinkExample extends React.Component {
	static displayName = 'ReaderSiteStreamLinkExample';

	render() {
		const feedId = 40474296;
		const siteId = null;
		return (
			<Card>
				<ReaderSiteStreamLink feedId={ feedId } siteId={ siteId }>
					futonbleu
				</ReaderSiteStreamLink>
			</Card>
		);
	}
}
