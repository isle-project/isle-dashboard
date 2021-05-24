// MODULES //

import React, { Fragment, useState } from 'react';
import { withTranslation } from 'react-i18next';
import SelectInput, { components } from 'react-select';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import objectKeys from '@stdlib/utils/keys';
import contains from '@stdlib/assert/contains';
import LicenseBarrier from 'ev/containers/visible-barrier';
import SearchBar from 'components/searchbar';
import i18next from 'helpers/i18n';


// VARIABLES //

const LANGUAGES = [
	{ value: 'en', label: 'english' },
	{ value: 'es', label: 'spanish' },
	{ value: 'de', label: 'german' },
	{ value: 'fr', label: 'french' },
	{ value: 'it', label: 'italian' },
	{ value: 'ja', label: 'japanese' },
	{ value: 'nl', label: 'dutch' },
	{ value: 'pt', label: 'portuguese' },
	{ value: 'pl', label: 'polish' },
	{ value: 'ru', label: 'russian' },
	{ value: 'zh', label: 'chinese' }
];
const NAMESPACES = [
	'admin_settings',
	'admin',
	'common',
	'enroll_page',
	'footer_bar',
	'forgot_password',
	'gallery',
	'header_bar',
	'lesson',
	'lessons_page',
	'login',
	'namespace_data',
	'namespace',
	'profile_page',
	'signup',
	'text_select',
	'ticket_modal',
	'translation'
];
const Option = props => {
	return ( <components.Option key={props.data.label} {...props} >
		<span style={{
			color: props.isSelected ? 'white' : 'black'
		}}>{i18next.t( 'admin_settings:'+props.data.label )}</span>
	</components.Option> );
};


// MAIN //

const AdminSettingsTexts = ( props ) => {
	const { t } = props;
	const [ language, setLanguage ] = useState( i18next.language );
	const [ searchValue, setSearchValue ] = useState( 'user' );
	const data = i18next.store.data[ language ];
	const items = [];
	for ( let i = 0; i < NAMESPACES.length; i++ ) {
		const keys = objectKeys( data[ NAMESPACES[ i ] ] );
		for ( let j = 0; j < keys.length; j++ ) {
			const txt = data[ NAMESPACES[ i ] ][ keys[ j ] ];
			if ( contains( txt, searchValue ) ) {
				items.push({
					key: keys[ j ],
					text: txt
				});
			}
			if ( items.length >= 25 ) {
				break;
			}
		}
	}
	console.log( items );
	return (
		<Fragment>
			<div className="admin-settings-outer-container" >
				<LicenseBarrier>
					<Container style={{ float: 'left' }}>
						<Row>
							<Col>
								<SelectInput
									defaultValue={LANGUAGES.filter( x => x.value === language )[ 0 ]}
									options={LANGUAGES}
									onChange={async ( elem ) => {
										const lng = i18next.language;
										await i18next.changeLanguage( elem.value );
										i18next.changeLanguage( lng );
										setLanguage( elem.value );
									}}
									components={{ Option }}
								/>
							</Col>
							<Col>
								<SearchBar
									placeholder={t('search-text-to-overwrite')}
									onChange={( event ) => {
										setSearchValue( event.target.value );
									}}
								/>
							</Col>
						</Row>
						<Row style={{ height: 'calc(100vh - 350px)', overflowY: 'auto' }} >
							<ListGroup variant="flush" style={{ width: '100%' }} >
								{items.map( ( x, idx ) => {
									return (
										<ListGroup.Item key={idx} >
											<b>{x.key}</b><br />
											{x.text}
											<Button size="sm" variant="secondary" style={{ float: 'right' }}>
												{t('common:edit')}
											</Button>
										</ListGroup.Item>
									);
								})}
							</ListGroup>
						</Row>
						<Row>
							{items.length >= 25 ?
								<b style={{ marginTop: 12 }} >{t('maximum-items-reached')}</b> :
								null
							}
						</Row>
					</Container>
				</LicenseBarrier>
			</div>
		</Fragment>
	);
};


// PROPERTIES //

AdminSettingsTexts.propTypes = {
};

AdminSettingsTexts.defaultProps = {
};


// EXPORTS //

export default withTranslation( NAMESPACES )( AdminSettingsTexts );
