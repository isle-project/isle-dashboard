// MODULES //

import React, { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
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
import isUndefined from '@stdlib/assert/is-undefined';
import ConfirmModal from 'components/confirm-modal';
import LicenseBarrier from 'ev/containers/visible-barrier';
import SearchBar from 'components/searchbar';
import i18next from 'helpers/i18n';
import { LANGUAGES } from 'constants/languages';


// VARIABLES //

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
	'legal',
	'lessons_page',
	'login',
	'namespace_data',
	'namespace',
	'profile_page',
	'signup',
	'text_select',
	'ticket_modal',
	'server'
].concat([
	'accordion',
	'bibliography',
	'citation',
	'dashboard',
	'data-explorer',
	'data-sampler',
	'data-table',
	'feedback',
	'general',
	'hint-button',
	'iframe',
	'image',
	'input',
	'internal/alert-modal',
	'internal/chat-button',
	'internal/delete-modal',
	'internal/fullscreen-button',
	'internal/grade-feedback-renderer',
	'internal/interface-tour',
	'internal/language-switcher',
	'internal/lesson',
	'internal/login',
	'internal/response-visualizer',
	'internal/signup',
	'internal/statusbar',
	'internal/toolbar',
	'internal/voice-control',
	'joyride',
	'learn/causality-diagram',
	'learn/clt',
	'learn/conditional-probability',
	'learn/confidence-coverage',
	'learn/dice-throwing',
	'learn/distribution',
	'learn/hypothesis-testing',
	'learn/mean-vs-median',
	'learn/networks',
	'learn/sotu',
	'learn/standardize',
	'learn/statistical-models',
	'learn/venn-diagram',
	'lesson-submit',
	'likert-scale',
	'link',
	'models',
	'pages',
	'panel',
	'plotly',
	'questions/free-text',
	'questions/image',
	'questions/match-list',
	'questions/multiple-choice',
	'questions/number',
	'questions/order',
	'questions/question-form',
	'questions/quiz',
	'questions/range',
	'questions/select',
	'questions/select-matrix',
	'r',
	'range-picker',
	'recorder',
	'revealer',
	'sketchpad',
	'slider',
	'solution-button',
	'spectacle',
	'spreadsheet-upload',
	'sticky-note',
	'surveys',
	'tables',
	'tests',
	'text-editor',
	'victory',
	'video',
	'weather',
	'wikipedia',
	'world-cloud'
]);


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

const EditableItem = ({ elem, language, addCustomTranslation, removeCustomTranslation }) => {
	const [ editing, setEditing ] = useState( false );
	const [ value, setValue ] = useState( elem.text );
	const [ showResetModal, setShowResetModal ] = useState( false );
	const toggleEditing = useCallback( () => {
		setEditing( !editing );
	}, [ editing ] );
	const handleSaving = useCallback( async () => {
		const res = await addCustomTranslation({ language, ns: elem.ns, key: elem.key, value });
		if ( res instanceof Error === false ) {
			if ( !i18next.store.data[ language ][ elem.ns+'_ORIGINAL' ] ) {
				i18next.store.data[ language ][ elem.ns+'_ORIGINAL' ] = {};
			}
			i18next.store.data[ language ][ elem.ns+'_ORIGINAL' ][ elem.key ] = i18next.store.data[ language ][ elem.ns ][ elem.key ];
			i18next.store.data[ language ][ elem.ns ][ elem.key ] = value;
			i18next.changeLanguage( i18next.language );
			setEditing( false );
		}
	}, [ addCustomTranslation, elem, language, value ] );
	if ( editing ) {
		return (
			<ListGroup.Item>
				{elem.ns}:<b>{elem.key}</b>
				<br />
				<FormControl
					key={`${language}-${elem.key}`}
					type="text"
					value={value}
					style={{ width: '80%' }}
					onChange={( event ) => {
						setValue( event.target.value );
					}}
				/>
				<Button
					size="sm" variant="success" style={{ float: 'right', marginLeft: 8 }}
					onClick={handleSaving}
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
	const handleReset = () => {
		const res = removeCustomTranslation({
			language, ns: elem.ns, key: elem.key
		});
		if ( res instanceof Error === false ) {
			i18next.store.data[ language ][ elem.ns ][ elem.key ] = i18next.store.data[ language ][ elem.ns+'_ORIGINAL' ][ elem.key ];
			i18next.changeLanguage( i18next.language );
			setShowResetModal( false );
		}
	};
	const toggleResetModal = () => {
		setShowResetModal( !showResetModal );
	};
	return (
		<ListGroup.Item>
			{elem.ns}:<b>{elem.key}</b>
			<br />
			{elem.text}
			<Button
				size="sm" variant="secondary" style={{ float: 'right' }}
				onClick={toggleEditing}
			>
				{i18next.t('common:edit')}
			</Button>
			{elem.custom ? <Button
				size="sm" variant="warning" style={{ marginRight: 8, float: 'right' }}
				onClick={toggleResetModal}
			>
				{i18next.t('common:reset')}
			</Button> : null}
			{ showResetModal ? <ConfirmModal
				title={i18next.t('admin_settings:reset-translation')}
				message={<span>{i18next.t('admin_settings:reset-translation-confirm')}</span>}
				close={toggleResetModal}
				show={showResetModal}
				onConfirm={handleReset}
			/> : null }
		</ListGroup.Item>
	);
};


// MAIN //

const AdminSettingsTexts = ( props ) => {
	const { addCustomTranslation, removeCustomTranslation, translations, t } = props;
	const [ language, setLanguage ] = useState( i18next.language );
	const [ searchValue, setSearchValue ] = useState( '' );
	const [ onlyOverwritten, setOnlyOverwritten ] = useState( false );
	const data = i18next.store.data[ language ];
	const items = [];
	const customTranslations = translations[ language ] || {};
	if ( onlyOverwritten ) {
		for ( let i = 0; i < NAMESPACES.length; i++ ) {
			const ns = NAMESPACES[ i ];
			const customNS = customTranslations[ ns ];
			const keys = objectKeys( data[ ns ] );
			for ( let j = 0; j < keys.length; j++ ) {
				const key = keys[ j ];
				const text = data[ ns ][ key ];
				if ( !customNS || isUndefined( customNS[ key ] ) ) {
					continue;
				}
				if (
					!searchValue ||
					contains( uppercase( ns ), searchValue ) ||
					contains( uppercase( key ), searchValue ) ||
					contains( uppercase( text ), searchValue )
				) {
					items.push({ ns, key, text, custom: true });
				}
				if ( items.length >= 50 ) {
					break;
				}
			}
		}
	} else {
		for ( let i = 0; i < NAMESPACES.length; i++ ) {
			const ns = NAMESPACES[ i ];
			const keys = objectKeys( data[ ns ] );
			for ( let j = 0; j < keys.length; j++ ) {
				const key = keys[ j ];
				const text = data[ ns ][ key ];
				if (
					contains( uppercase( ns ), searchValue ) ||
					contains( uppercase( key ), searchValue ) ||
					contains( uppercase( text ), searchValue )
				) {
					const customNS = customTranslations[ ns ];
					items.push({ ns, key, text, custom: customNS && customNS[ key ] });
				}
				if ( items.length >= 80 ) {
					break;
				}
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
											elem={x}
											key={`${language}-${x.key}-${idx}`}
											addCustomTranslation={addCustomTranslation}
											language={language}
											removeCustomTranslation={removeCustomTranslation}
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
	addCustomTranslation: PropTypes.func.isRequired,
	removeCustomTranslation: PropTypes.func.isRequired,
	translations: PropTypes.object.isRequired
};

AdminSettingsTexts.defaultProps = {
};


// EXPORTS //

export default withTranslation( NAMESPACES )( AdminSettingsTexts );
