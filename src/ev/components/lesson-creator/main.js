// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import pluck from '@stdlib/utils/pluck';
import floor from '@stdlib/math/base/special/floor';
import LicenseBarrier from 'ev/containers/visible-barrier';
import background from 'components/lessons-page/architecture.jpeg';
import ConfirmModal from './confirm_modal.js';


// VARIABLES //

const ResponsiveReactGridLayout = WidthProvider( Responsive );
const BREAK_POINTS = { lg: 1200, md: 1000, sm: 700, xs: 500 };
const COLS = { lg: 16, md: 12, sm: 8, xs: 4 };
const MARGIN = [ 20, 20 ];
const PADDING = [ 10, 10 ];


// MAIN //

class LessonCreator extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			confirmModal: null
		};
	}

	createLayout( lessons ) {
		const elemH = 6;
		let layouts = lessons.map( ( e, i ) => {
			return {
				lg: { i: `cell-${i}`, x: i*4 % 16, y: floor( i / 4 ) * elemH, w: 4, h: elemH },
				md: { i: `cell-${i}`, x: i*4 % 12, y: floor( i / 3 ) * elemH, w: 4, h: elemH },
				sm: { i: `cell-${i}`, x: i*4 % 8, y: floor( i / 2 ) * elemH, w: 4, h: elemH },
				xs: { i: `cell-${i}`, x: i*4 % 4, y: floor( i / 1 ) * elemH, w: 4, h: elemH }
			};
		});
		layouts = {
			lg: pluck( layouts, 'lg' ),
			md: pluck( layouts, 'md' ),
			sm: pluck( layouts, 'sm' ),
			xs: pluck( layouts, 'xs' )
		};
		return layouts;
	}

	handleCreateFactory = ( idx ) => {
		return () => {
			this.setState({
				confirmModal: this.props.user.templateLessons[ idx ]
			});
		};
	}

	closeCreateModal = () => {
		this.setState({
			confirmModal: null
		});
	}

	renderTemplates() {
		const out = [];
		const templateLessons = this.props.user.templateLessons;
		if ( templateLessons ) {
			for ( let i = 0; i < templateLessons.length; i++ ) {
				const lesson = templateLessons[ i ];
				out.push(
					<div key={`cell-${i}`}>
						<Card style={{ width: '18rem', boxShadow: '0 0 3px darkslategray' }} >
							<Card.Img variant="top" src={background} />
							<Card.Body>
								<Card.Title>{lesson.title}</Card.Title>
								<Card.Text>
									{lesson.description}
								</Card.Text>
								<Button variant="primary" onClick={this.handleCreateFactory( i )}>
									Create
								</Button>
							</Card.Body>
						</Card>
					</div>
				);
			}
		}
		return out;
	}

	render() {
		const { user, t } = this.props;
		let content;
		if ( !user.templateLessons || user.templateLessons.length === 0 ) {
			content = <Fragment>
				<Modal.Header closeButton >
					<h1>{t('create-from-template')}</h1>
				</Modal.Header>
				<Modal.Body>
					<Jumbotron>
						<h1 style={{ textAlign: 'center', marginTop: '12%' }}>
							{t('no-templates-created-yet')}
						</h1>
					</Jumbotron>
				</Modal.Body>
			</Fragment>;
		} else {
			const layouts = this.createLayout( user.templateLessons );
			content = <LicenseBarrier>
				<Modal.Header closeButton >
					<h1>{t('create-from-template')}</h1>
				</Modal.Header>
				<Modal.Body>
				<ResponsiveReactGridLayout
					margin={MARGIN}
					containerPadding={PADDING}
					layouts={layouts}
					breakpoints={BREAK_POINTS}
					cols={COLS}
					isResizable={false}
					isDraggable={false}
					rowHeight={60}
				>
						{this.renderTemplates()}
					</ResponsiveReactGridLayout>
				</Modal.Body>
			</LicenseBarrier>;
		}
		return (
			<Fragment>
				<Modal show={this.state.confirmModal === null} onHide={this.props.onHide} dialogClassName="modal-75w" >
					{content}
				</Modal>
				{ this.state.confirmModal !== null ? <ConfirmModal
					show={true}
					close={this.closeCreateModal}
					t={t}
					targetNamespace={this.props.namespace.title}
					lesson={this.state.confirmModal}
					copyLesson={this.props.copyLesson}
					onCreate={this.props.onCreate}
				/> : null }
			</Fragment>
		);
	}
}


// PROPERTIES //

LessonCreator.propTypes = {
	copyLesson: PropTypes.func.isRequired,
	namespace: PropTypes.object.isRequired,
	onCreate: PropTypes.func.isRequired,
	onHide: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default withTranslation( 'lessons_page' )( LessonCreator );
