import config from '@automattic/calypso-config';
import { getUrlParts } from '@automattic/calypso-url';
import { translate } from 'i18n-calypso';
import { trim } from 'lodash';
import { decodeEntities } from 'calypso/lib/formatting';
import { isSiteDescriptionBlocked } from 'calypso/reader/lib/site-description-blocklist';
import { isAutomatticTeamMember } from 'calypso/reader/lib/teams';

/**
 * Given a feed, site, or post: return the site url. return false if one could not be found.
 *
 * @param {*} options - an object containing a feed, site, and post. all optional.
 * @returns {string} the site url
 */
export const getSiteUrl = ( { feed, site, post } = {} ) => {
	const siteUrl = !! site && ( site.URL || site.domain );
	const feedUrl = !! feed && ( feed.URL || feed.feed_URL );
	const postUrl = !! post && post.site_URL;

	if ( ! siteUrl && ! feedUrl && ! postUrl ) {
		return undefined;
	}

	return siteUrl || feedUrl || postUrl;
};

/**
 * Given a feed, site, or post: return the feed url. return false if one could not be found.
 * The feed url is different from the site url in that it is unique per feed. A single siteUrl may
 * be home to many feeds
 *
 * @param {*} options - an object containing a feed, site, and post. all optional.
 * @returns {string} the site url
 */
export const getFeedUrl = ( { feed, site, post } = {} ) => {
	const siteUrl = !! site && site.feed_URL;
	const feedUrl = !! feed && ( feed.feed_URL || feed.URL );
	const postUrl = !! post && post.feed_URL;

	return siteUrl || feedUrl || postUrl;
};

/**
 * Given a feed, site, or post: output the best title to use for the owning site.
 *
 * @param {*} options - an object containing a feed, site, and post. all optional
 * @returns {string} the site title
 */
export const getSiteName = ( { feed, site, post } = {} ) => {
	let siteName = null;
	const isDefaultSiteTitle =
		( site && site.name === translate( 'Site Title' ) ) ||
		( feed && feed.name === translate( 'Site Title' ) );

	if ( ! isDefaultSiteTitle && site && site.title ) {
		siteName = site.title;
	} else if ( ! isDefaultSiteTitle && feed && ( feed.name || feed.title ) ) {
		siteName = feed.name || feed.title;
	} else if ( ! isDefaultSiteTitle && post && post.site_name ) {
		siteName = post.site_name;
	} else if ( site && site.is_error && feed && feed.is_error && ! post ) {
		siteName = translate( 'Error fetching feed' );
	} else if ( site && site.domain ) {
		siteName = site.domain;
	} else {
		const siteUrl = getSiteUrl( { feed, site, post } );
		siteName = siteUrl ? getUrlParts( siteUrl ).hostname : null;
	}

	return decodeEntities( siteName );
};

export const getSiteDescription = ( { site, feed } ) => {
	const description = ( site && site.description ) || ( feed && feed.description );
	if ( isSiteDescriptionBlocked( description ) ) {
		return null;
	}
	return description;
};

export const getSiteAuthorName = ( site ) => {
	const siteAuthor = site && site.owner;
	const authorFullName =
		siteAuthor &&
		( siteAuthor.name ||
			trim( `${ siteAuthor.first_name || '' } ${ siteAuthor.last_name || '' }` ) );

	return decodeEntities( authorFullName );
};

/**
 * Get list of routes that should not have unseen functionality.
 *
 * @returns {[string, string, string]} list of routes.
 */
export const getRoutesWithoutSeenSupport = () => {
	return [ '/read/conversations', '/read/conversations/a8c', '/activities/likes' ];
};

/**
 * Get default seen value given a route. FALSE if the route does not support seen functionality, TRUE otherwise.
 *
 * @param {string} currentRoute given route
 *
 * @returns {boolean} default seen value for given route
 */
export const getDefaultSeenValue = ( currentRoute ) => {
	const routesWithoutSeen = getRoutesWithoutSeenSupport();
	return routesWithoutSeen.includes( currentRoute ) ? false : true;
};

/**
 * Check if user is eligible to use seen posts feature (unseen counts and mark as seen)
 *
 * @param {object} flags eligibility data
 * @param {Array} flags.teams list of reader teams
 * @param {boolean} flags.isWPForTeamsItem id if exists
 *
 * @returns {boolean} whether or not the user can use the feature for the given site
 */
export const isEligibleForUnseen = ( { teams, isWPForTeamsItem = false } ) => {
	if ( ! config.isEnabled( 'reader/seen-posts' ) ) {
		return false;
	}

	if ( isAutomatticTeamMember( teams ) ) {
		return true;
	}

	return isWPForTeamsItem;
};

/**
 * Check if the post/posts can be marked as seen based on the existence of `is_seen` flag and the current route.
 *
 * @param {Object} params method params
 * @param {Object} params.post object
 * @param {Array} params.posts list
 * @param {string} params.currentRoute given route
 *
 * @returns {boolean} whether or not the post can be marked as seen
 */
export const canBeMarkedAsSeen = ( { post = null, posts = [], currentRoute = '' } ) => {
	const routesWithoutSeen = getRoutesWithoutSeenSupport();
	if ( currentRoute && routesWithoutSeen.includes( currentRoute ) ) {
		return false;
	}

	if ( post !== null ) {
		return post.hasOwnProperty( 'is_seen' );
	}

	if ( posts.length ) {
		for ( const thePost in posts ) {
			if ( thePost.hasOwnProperty( 'is_seen' ) ) {
				return true;
			}
		}
	}

	return false;
};

/**
 * Return Featured image alt text.
 *
 * @param {Object} post object containing post information
 *
 * @returns {string} Featured image alt text
 */
export const getFeaturedImageAlt = ( post ) => {
	// Each post can have multiple images attached. To make sure we are selecting
	// the alt text of the correct image attachment, we get the ID of the post thumbnail first
	// and then use it to get the alt text of the Featured image.
	const postThumbnailId = post?.post_thumbnail?.ID;
	const featuredImageAlt = post?.attachments?.[ postThumbnailId ]?.alt;
	const postTitle = post.title;

	// If there is no Featured image alt text available, return post title instead.
	// This will make sure that the featured image has at least some relevant alt text.
	if ( ! featuredImageAlt ) {
		// translators: Adds explanation to the Featured image alt text in Reader
		return translate( '%(postTitle)s - featured image', { args: { postTitle } } );
	}

	return featuredImageAlt;
};
