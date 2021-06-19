// MODULES //

import React, { Component, Fragment, useCallback, useState } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import LicenseBarrier from 'ev/containers/visible-barrier';
import ConfirmModal from 'components/confirm-modal';
import './branding.css';


// FUNCTIONS //

const Branding = ({ logoPath, name, updateSettings, t }) => {
	const [ showModal, setShowModal ] = useState( false );
	const deleteLogo = useCallback( () => {
		updateSettings( name, null );
	}, [ name, updateSettings ]);
	const toggleModal = useCallback( () => {
		setShowModal( !showModal );
	}, [ showModal ]);
	return (
		<div style={{ position: 'relative', width: 'fit-content' }}>
			<img src={logoPath} alt="Logo" style={{ height: '250px', width: 'auto' }} />
			<Button
				aria-label={t('common:delete')}
				style={{ position: 'absolute', top: 0, right: 0 }}
				onClick={toggleModal}
				variant="danger"
			>
				<i className="fas fa-trash" />
			</Button>
			{ showModal ? <ConfirmModal
				title={t('delete-logo')}
				message={<span>{t('delete-logo-confirm')}</span>}
				close={toggleModal}
				show={showModal}
				onConfirm={deleteLogo}
			/> : null }
		</div>
	);
};

const BrandingFileUpload = ({ name, t, uploadLogo, user }) => {
	const [ file, setFile ] = useState( null );
	const [ imgSrc, setImgSrc ] = useState( null );
	const handleFileSelection = useCallback( ( e ) => {
		const newFile = e.target.files[ 0 ];
		if ( newFile ) {
			const reader = new FileReader();
			reader.onload = function onLoad() {
				const dataURL = reader.result;
				setImgSrc( dataURL );
			};
			reader.readAsDataURL( newFile );
			setFile( newFile );
		}
	}, [] );
	const handleReset = useCallback( () => {
		setFile( null );
		setImgSrc( null );
	}, [] );
	const handleConfirm = useCallback( async () => {
		const formData = new FormData();
		formData.append( 'branding', file, file.name );
		formData.append( 'type', name );

		const res = await uploadLogo({
			formData,
			user: user
		});
		if ( res instanceof Error === false ) {
			setFile( null );
		}
	}, [ uploadLogo, name, file, user ] );
	return (
		<Fragment>
			<Form.Group style={{ marginBottom: 0 }}>
				<Form.Label htmlFor={`${name}Upload`} style={{ cursor: 'pointer' }}>
					<h3><Badge variant="success">{t('select-file')}</Badge></h3>
				</Form.Label>
				<Form.Control
					id={`${name}Upload`}
					key={imgSrc}
					style={{ display: 'none' }}
					type="file"
					onChange={handleFileSelection}
					accept="image/*"
				/>
				{ file ?
					<Fragment>
						<Button
							aria-label={t('common:confirm')}
							className="branding-confirm-btn"
							onClick={handleConfirm}
							variant="success" size="sm"
						>
							<i className="fas fa-check" />
						</Button>
						<Button
							aria-label={t('common:reset')}
							className="branding-reset-btn"
							onClick={handleReset}
							variant="warning" size="sm"
						>
							<i className="fas fa-times" />
						</Button>
					</Fragment> : null
				}
			</Form.Group>
			<br />
			{ imgSrc ? <img src={imgSrc} alt="Logo" style={{ height: '250px', width: 'auto' }} /> : null }
		</Fragment>
	);
};


// MAIN //

class AdminSettingsBranding extends Component {
	constructor( props ) {
		super( props );
	}

	render() {
		const { admin, uploadLogo, updateSettings, user, t } = this.props;
		const settings = admin.settings;
		return (
			<Fragment>
				<div className="admin-settings-outer-container" >
					<LicenseBarrier>
						<Container style={{ float: 'left' }}>
							<Row>
								<Col sm={2} >
									<h3>{t('logo')}</h3>
								</Col>
								<Col sm={10} >
									{settings.brandingLogo ?
										<Branding
											name="brandingLogo"
											logoPath={settings.brandingLogo}
											updateSettings={updateSettings}
											t={t}
										/> :
										<BrandingFileUpload
											name="brandingLogo"
											t={t} user={user} uploadLogo={uploadLogo}
										/>
									}
									<p>
										{t('logo-description')}
									</p>
								</Col>
							</Row>
							<hr />
							<Row>
								<Col sm={2} >
									<h3>{t('small-logo')}</h3>
								</Col>
								<Col sm={10} >
									{settings.brandingSmallLogo ?
										<Branding
											name="brandingSmallLogo"
											logoPath={settings.brandingSmallLogo}
											updateSettings={updateSettings}
											t={t}
										/> :
										<BrandingFileUpload
											name="brandingSmallLogo"
											t={t} user={user} uploadLogo={uploadLogo}
										/>
									}
									<p>
										A small version of the logo to be displayed in the header bar of the ISLE dashboard.
									</p>
								</Col>
							</Row>
						</Container>
					</LicenseBarrier>
				</div>
			</Fragment>
		);
	}
}


// PROPERTIES //

AdminSettingsBranding.propTypes = {
	admin: PropTypes.object.isRequired,
	updateSettings: PropTypes.func.isRequired,
	uploadLogo: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

AdminSettingsBranding.defaultProps = {
};


// EXPORTS //

export default withTranslation( 'admin_settings' )( AdminSettingsBranding );
