/**
* Copyright (C) 2016-present The ISLE Authors
*
* The isle-dashboard program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// MODULES //

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Pagination from 'react-bootstrap/Pagination';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { Responsive, WidthProvider } from 'react-grid-layout';
import isArray from '@stdlib/assert/is-array';
import contains from '@stdlib/assert/contains';
import lowercase from '@stdlib/string/lowercase';
import pluck from '@stdlib/utils/pluck';
import min from '@stdlib/math/base/special/min';
import ceil from '@stdlib/math/base/special/ceil';
import floor from '@stdlib/math/base/special/floor';
import sortLessons from 'utils/sort_lessons.js';
import ImportModal from './import_modal.js';
import Lesson from './lesson.js';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'css/image.css';
import './gallery.css';


// FUNCTIONS //

function createLayout( nLessons ) {
	const elemH = 3.72;
	let layouts = [];
	for ( let i = 0; i < nLessons; i++ ) {
		layouts[ i ] = {
			lg: { i: `cell-${i}`, x: i*4 % 24, y: floor( i / 6 ) * elemH, w: 4, h: elemH },
			md: { i: `cell-${i}`, x: i*4 % 20, y: floor( i / 5 ) * elemH, w: 4, h: elemH },
			sm: { i: `cell-${i}`, x: i*4 % 16, y: floor( i / 4 ) * elemH, w: 4, h: elemH },
			xs: { i: `cell-${i}`, x: i*4 % 12, y: floor( i / 3 ) * elemH, w: 4, h: elemH },
			xxs: { i: `cell-${i}`, x: i*4 % 8, y: floor( i / 2 ) * elemH, w: 4, h: elemH },
			tiny: { i: `cell-${i}`, x: i*4 % 4, y: floor( i / 1 ) * elemH, w: 4, h: elemH }
		};
	}
	layouts = {
		lg: pluck( layouts, 'lg' ),
		md: pluck( layouts, 'md' ),
		sm: pluck( layouts, 'sm' ),
		xs: pluck( layouts, 'xs' ),
		xxs: pluck( layouts, 'xxs' ),
		tiny: pluck( layouts, 'tiny' )
	};
	return layouts;
}


// VARIABLES //

const ResponsiveReactGridLayout = WidthProvider( Responsive );
const NO_LESSONS_PER_PAGE = 100;
const FULL_LAYOUT = createLayout( NO_LESSONS_PER_PAGE );


// MAIN //

class Gallery extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			filteredLessons: [],
			showImportModal: false,
			namespace: null,
			title: null,
			page: 0
		};
		props.findPublicLessons();
	}

	componentDidUpdate( prevProps ) {
		if (
			this.props.gallery.lessons !== prevProps.gallery.lessons
		) {
			const lessons = this.props.gallery.lessons || [];
			let filteredLessons = this.searchLessons( lessons, prevProps.search.phrase );
			this.setState({
				filteredLessons
			});
		}
		if (
			this.props.search.phrase !== prevProps.search.phrase
		) {
			const lessons = prevProps.gallery.lessons || [];
			let filteredLessons = this.searchLessons( lessons, this.props.search.phrase );
			this.setState({
				filteredLessons
			});
		}
	}

	showImportModal = ({ title, namespace }) => {
		this.setState({
			showImportModal: true,
			namespace,
			title
		});
	};

	closeImportModal = () => {
		this.setState({
			showImportModal: false
		});
	};

	searchLessons( lessons, phrase ) {
		if ( !phrase ) {
			return lessons;
		}
		const filteredLessons = [];
		if ( isArray( lessons ) ) {
			for ( let i = 0; i < lessons.length; i++ ) {
				if (
					contains( lowercase( lessons[ i ].title ), phrase ) ||
					contains( lowercase( lessons[ i ].namespace ), phrase ) ||
					contains( lowercase( lessons[ i ].description ), phrase )
				) {
					filteredLessons.push( lessons[ i ] );
				}
			}
		}
		return filteredLessons;
	}

	selectPageLessons( lessons ) {
		let out = [];
		const maxid = min( ( this.state.page+1 ) * NO_LESSONS_PER_PAGE, lessons.length );
		for ( let i = this.state.page*NO_LESSONS_PER_PAGE; i < maxid; i++ ) {
			out.push( lessons[ i ] );
		}
		return out;
	}

	renderImportModal() {
		if ( !this.state.showImportModal ) {
			return null;
		}
		return ( <ImportModal
			namespace={this.state.namespace}
			title={this.state.title}
			show={this.state.showImportModal}
			close={this.closeImportModal}
			userNamespaces={this.props.user.ownedNamespaces}
			copyLesson={this.props.copyLesson}
			openedNamespace={this.props.openedNamespace}
			t={this.props.t}
		/> );
	}

	renderPagination() {
		const nPages = ceil( this.state.filteredLessons.length / NO_LESSONS_PER_PAGE );
		const pages = [];
		for ( let i = 0; i < nPages; i++ ) {
			pages.push(
				<Pagination.Item
					key={i}
					active={i === this.state.page}
					onClick={() => {
						this.setState({
							page: i
						});
					}}
				>
					{i+1}
				</Pagination.Item>
			);
		}
		return (
			<Pagination className="gallery-pagination" size="small" >
				{pages}
			</Pagination>
		);
	}

	render() {
		const { t } = this.props;
		let lessons = this.state.filteredLessons;
		if ( !isArray( lessons ) || lessons.length === 0 ) {
			return ( <Jumbotron className="gallery-jumbotron">
				<h1>{t('no-lessons-title')}</h1>
				<p>{t('no-lessons-description')}</p>
			</Jumbotron> );
		}
		lessons = this.selectPageLessons( lessons );
		const layouts = ( lessons.length === NO_LESSONS_PER_PAGE ) ?
			FULL_LAYOUT :
			createLayout( lessons.length );
		sortLessons( lessons, this.props.search );
		return (
			<Fragment>
				{this.renderPagination()}
				<div className="gallery">
					<ResponsiveReactGridLayout
						layouts={layouts}
						breakpoints={{ lg: 1800, md: 1550, sm: 1200, xs: 900, xxs: 400, tiny: 0 }}
						cols={{ lg: 24, md: 20, sm: 16, xs: 12, xxs: 8, tiny: 4 }}
						containerPadding={[10, 10]}
						isResizable={false}
						isDraggable={false}
						rowHeight={60}
					>
						{lessons.map( ( e, i ) => {
							return ( <div key={`cell-${i}`}>
								<Lesson
									{...lessons[ i ]}
									getIsleFile={this.props.getIsleFile}
									addNotification={this.props.addNotification}
									openedNamespace={this.props.openedNamespace}
									key={i}
									onImport={() => {
										this.showImportModal({
											title: lessons[ i ].title,
											namespace: lessons[ i ].namespace
										});
									}}
								/>
							</div> );
						})}
					</ResponsiveReactGridLayout>
					{this.renderImportModal()}
				</div>
			</Fragment>
		);
	}
}


// PROPERTIES //

Gallery.propTypes = {
	addNotification: PropTypes.func.isRequired,
	copyLesson: PropTypes.func.isRequired,
	findPublicLessons: PropTypes.func.isRequired,
	gallery: PropTypes.object.isRequired,
	getIsleFile: PropTypes.func.isRequired,
	openedNamespace: PropTypes.object.isRequired,
	search: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired
};


// EXPORTS //

export default withTranslation( [ 'gallery', 'common' ] )( Gallery );
