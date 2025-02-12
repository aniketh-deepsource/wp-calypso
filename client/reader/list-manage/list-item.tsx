import React from 'react';
import FeedItem from './feed-item';
import SiteItem from './site-item';
import TagItem from './tag-item';
import { Item, List } from './types';

export default function ListItem( props: {
	hideIfInList?: boolean;
	isFollowed?: boolean;
	item: Item;
	list: List;
	owner: string;
} ): React.ReactElement | null {
	if ( props.item.feed_ID ) {
		return <FeedItem { ...props } />;
	} else if ( props.item.site_ID ) {
		return <SiteItem { ...props } />;
	} else if ( props.item.tag_ID ) {
		return <TagItem { ...props } />;
	}
	return null;
}
