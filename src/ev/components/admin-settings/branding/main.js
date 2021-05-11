// MODULES //

import React, { Component, Fragment, useCallback, useState } from 'react';
import { withTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import LicenseBarrier from 'ev/containers/visible-barrier';
import './branding.css';


// FUNCTIONS //

const BrandingFileUpload = ({ name, t, updateSettings }) => {
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
	const handleConfirm = useCallback( () => {
		updateSettings( name, file );
	}, [ updateSettings, name, file ] );
	return (
		<Fragment>
			<Form.Group style={{ marginBottom: 0 }}>
				<Form.Label htmlFor="logoUpload" style={{ cursor: 'pointer' }}>
					<h3><Badge variant="success">{t('select-file')}</Badge></h3>
				</Form.Label>
				<Form.Control
					id="logoUpload"
					style={{ display: 'none' }}
					type="file"
					onChange={handleFileSelection}
					accept="image/*"
				/>
				{ file ?
					<Fragment>
						<Button
							className="branding-confirm-btn"
							onClick={handleConfirm}
							variant="success" size="sm"
						>
							<i className="fas fa-check" />
						</Button>
						<Button
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
		const { t } = this.props;
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
									<BrandingFileUpload t={t} />
								</Col>
							</Row>
							<hr />
							<Row>
								<Col sm={2} >
									<h3>{t('small-logo')}</h3>
								</Col>
								<Col sm={10} >
									<BrandingFileUpload t={t} />
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
};

AdminSettingsBranding.defaultProps = {
};


// EXPORTS //

export default withTranslation( 'admin_settings' )( AdminSettingsBranding );
