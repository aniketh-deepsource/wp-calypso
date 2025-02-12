import { localize } from 'i18n-calypso';
import { map, sortBy } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import EllipsisMenu from 'calypso/components/ellipsis-menu';
import SortableList from 'calypso/components/forms/sortable-list';
import PopoverMenuItem from 'calypso/components/popover/menu-item';
import EditorMediaModalGalleryEditItem from './edit-item';

const noop = () => {};

class EditorMediaModalGalleryEdit extends React.Component {
	static propTypes = {
		site: PropTypes.object,
		settings: PropTypes.object,
		onUpdateSetting: PropTypes.func,
	};

	static defaultProps = {
		settings: Object.freeze( {} ),
		onUpdateSetting: noop,
	};

	onOrderChanged = ( order ) => {
		const items = [];

		this.props.settings.items.forEach( ( item, i ) => {
			items[ order[ i ] ] = item;
		} );

		this.props.onUpdateSetting( {
			items: items,
			orderBy: null,
		} );
	};

	render() {
		const { onUpdateSetting, site, settings, translate } = this.props;

		if ( ! site || ! settings.items ) {
			return null;
		}

		const orders = {
			[ translate( 'Reverse order' ) ]: [ ...settings.items ].reverse(),
			[ translate( 'Order alphabetically' ) ]: sortBy( settings.items, 'title' ),
			[ translate( 'Order chronologically' ) ]: sortBy( settings.items, 'date' ),
		};

		return (
			<div>
				<EllipsisMenu popoverClassName="gallery__order-popover" position="bottom right">
					{ map( orders, ( orderedItems, name ) => {
						const boundAction = () => onUpdateSetting( { items: orderedItems } );
						return (
							<PopoverMenuItem key={ name } onClick={ boundAction }>
								{ name }
							</PopoverMenuItem>
						);
					} ) }
				</EllipsisMenu>
				<SortableList onChange={ this.onOrderChanged }>
					{ settings.items.map( ( item ) => {
						return (
							<EditorMediaModalGalleryEditItem
								key={ item.ID }
								site={ site }
								item={ item }
								showRemoveButton={ settings.items.length > 1 }
							/>
						);
					} ) }
				</SortableList>
			</div>
		);
	}
}

export default localize( EditorMediaModalGalleryEdit );
