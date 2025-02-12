import { CompactCard } from '@automattic/components';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { getSelectedSiteSlug } from 'calypso/state/ui/selectors';
import { settingsPath } from '../../../app/util';

const ZoneItem = ( { siteSlug, zone } ) => {
	const { id, name, description } = zone;

	return (
		<CompactCard href={ `${ settingsPath }/zone/${ siteSlug }/${ id }` }>
			<div className="zones-dashboard__zone-label">{ name }</div>
			<div className="zones-dashboard__zone-description">
				<small className="zones-dashboard__zone-description-text">{ description }</small>
			</div>
		</CompactCard>
	);
};

ZoneItem.propTypes = {
	siteSlug: PropTypes.string,
	zone: PropTypes.object.isRequired,
};

ZoneItem.defaultProps = {
	siteSlug: '',
};

const connectComponent = connect( ( state ) => ( {
	siteSlug: getSelectedSiteSlug( state ),
} ) );

export default connectComponent( ZoneItem );
