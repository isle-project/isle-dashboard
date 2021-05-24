// MODULES //

import React, { Fragment, useCallback, useState } from 'react';
import { withTranslation } from 'react-i18next';
import SelectInput, { components } from 'react-select';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import uppercase from '@stdlib/string/uppercase';
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


// FUNCTIONS //

const Option = props => {
	return ( <components.Option key={props.data.label} {...props} >
		<span style={{
			color: props.isSelected ? 'white' : 'black'
		}}>{i18next.t( 'admin_settings:'+props.data.label )}</span>
	</components.Option> );
};

const SingleValue = props => {
	return ( <components.SingleValue key={props.data.label} {...props} >
		<span>{i18next.t( 'admin_settings:'+props.data.label )}</span>
	</components.SingleValue> );
};

const EditableItem = ({ elem }) => {
	const [ editing, setEditing ] = useState( false );
	const toggleEditing = useCallback( () => {
		setEditing( !editing );
	}, [ editing ] );
	if ( editing ) {
		return (
			<ListGroup.Item>
				<b>{elem.key}</b><br />
				<FormControl
					type="text" defaultValue={elem.text}
					style={{ width: '80%' }}
				/>
				<Button
					size="sm" variant="success" style={{ float: 'right', marginLeft: 8 }}
					onClick={toggleEditing}
				>
					{i18next.t('common:save')}
				</Button>
				<Button
					size="sm" variant="secondary" style={{ float: 'right' }}
					onClick={toggleEditing}
				>
					{i18next.t('common:cancel')}
				</Button>
			</ListGroup.Item>
		);
	}
	return (
		<ListGroup.Item>
			<b>{elem.key}</b><br />
			{elem.text}
			<Button
				size="sm" variant="secondary" style={{ float: 'right' }}
				onClick={toggleEditing}
			>
				{i18next.t('common:edit')}
			</Button>
		</ListGroup.Item>
	);
};


// MAIN //

const AdminSettingsTexts = ( props ) => {
	const { t } = props;
	const [ language, setLanguage ] = useState( i18next.language );
	const [ searchValue, setSearchValue ] = useState( 'user' );
	const [ onlyOverwritten, setOnlyOverwritten ] = useState( false );
	const data = i18next.store.data[ language ];
	const items = [];
	for ( let i = 0; i < NAMESPACES.length; i++ ) {
		const keys = objectKeys( data[ NAMESPACES[ i ] ] );
		for ( let j = 0; j < keys.length; j++ ) {
			const txt = data[ NAMESPACES[ i ] ][ keys[ j ] ];
			if ( contains( uppercase( txt ), searchValue ) ) {
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
	return (
		<Fragment>
			<div className="admin-settings-outer-container" >
				<LicenseBarrier>
					<Container style={{ float: 'left' }}>
						<Row>
							<Col>
								<FormGroup
									controlId="form-language"
								>
									<FormLabel>{t('common:language')}:</FormLabel>
									<SelectInput
										defaultValue={LANGUAGES.filter( x => x.value === language )[ 0 ]}
										options={LANGUAGES}
										onChange={async ( elem ) => {
											const lng = i18next.language;
											await i18next.changeLanguage( elem.value );
											i18next.changeLanguage( lng );
											setLanguage( elem.value );
										}}
										components={{ Option, SingleValue }}
									/>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup
									controlId="form-search"
								>
									<FormLabel>{t('common:search')}:</FormLabel>
									<SearchBar
										placeholder={t('search-text-to-overwrite')}
										onChange={( event ) => {
											setSearchValue( uppercase( event.target.value ) );
										}}
										style={{ width: '100%' }}
									/>
								</FormGroup>
							</Col>
						</Row>
						<Row style={{ width: '100%', position: 'relative', height: 32 }} >
							<FormGroup
								controlId="form-show-only-overwritten"
								style={{ position: 'absolute', right: 0, top: 0 }}
							>
								<FormCheck
									type="checkbox"
									label={t('show-only-overwritten-texts')}
									value={onlyOverwritten}
									onChange={() => {
										setOnlyOverwritten( !onlyOverwritten );
									}}
								/>
							</FormGroup>
						</Row>
						<Row style={{ height: 'calc(100vh - 400px)', overflowY: 'auto' }} >
							<ListGroup variant="flush" style={{ width: '100%' }} >
								{items.map( ( x, idx ) => {
									return (
										<EditableItem
											elem={x} key={idx}
										/>
									);
								})}
							</ListGroup>
						</Row>
						{items.length >= 25 ?
							<Row>
								<b style={{ float: 'right' }} >
									{t('maximum-items-reached')}
								</b>
							</Row> :
							null
						}
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
