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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import isUndefinedOrNull from '@stdlib/assert/is-undefined-or-null';
import { isPrimitive as isPositiveNumber } from '@stdlib/assert/is-positive-number';
import roundn from '@stdlib/math/base/special/roundn';
import objectValues from '@stdlib/utils/values';
import StandardTable from 'components/standard-table';


// DATA //

const MISSING_SCORE = -999;  // ATTN:TODO load missing value constant for this
const DEFAULT_TAG = '_default_tag';


// HELPERS //

/**
 * Returns a date-time string that is as simple as possible relative to now.
 *
 * @param {number} unixTime - A date-time in milliseconds since the Unix epoch.
 * @returns {string} a simple representation of the given datetime.
 */
const relativeDate = unixTime => {
	const now = new Date();
	const udate = new Date( unixTime );
	const deltaHours = (now.getTime() - unixTime) / (60 * 60 * 1000);

	if ( isUndefinedOrNull( unixTime )) {
		return '';
	} else if ( deltaHours < 1 ) {
		// Within the hour
		return `${Math.round(deltaHours * 60)} minutes ago`;
	} else if ( deltaHours < 24 ) {
		// Within a day
		return `${Math.round(deltaHours)} hours ago`;
	} else if ( deltaHours < 7 * 24 ) {
		// Within a week
		return udate.toLocaleDateString( void 0, { weekday: 'long' } );
	} else if ( unixTime > new Date(now.getFullYear(), 0, 0).getTime() ) {
		// Within the year
		return udate.toLocaleString( void 0, { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' } );
	}
	return udate.toLocaleString( void 0, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' } );
};

/**
 * Returns a zipper for the provenance tree rooted at a given instance.
 *
 * @param {Object} instance - an instance node in a provenance tree
 * @param {Object} metric - a metric in a provenance tree
 * @returns {Object}
 */
const makeProvenanceZipper = ( instance, metric ) => {
	return {
		node: instance,
		metric,
		parentPath: []
	};
};

/**
 * Is the zipper at the root node?
 *
 * @param {Object} loc - a provenance zipper
 * @returns {boolean}
 */
const isZipperAtRoot = loc => loc.parentPath.length === 0;

/**
 * Returns a zipper moved to the parent node
 *
 * @param {Object} loc - a provenance tree zipper
 * @returns {Object} an updated provenance tree zipper
 */
const zipperUp = ( loc ) => {
	if ( loc.parentPath.length > 0 ) {
		return loc.parentPath[ 0 ];
	}
	throw new Error( 'Cannot move up from root in provenance zipper' );
};

/**
 * Returns a zipper moved to a given child node
 *
 * @param {Object} loc - a provenance tree zipper
 * @param {Object} [id] - an entity id of a child to move to;
 *     if missing, the first child is used.
 * @param {Object} [metric] - a metric object to use for the child node
 * @returns {Object} an updated provenance tree zipper
 */
const zipperDown = ( loc, id, metric ) => {
	const len = loc.node.provenance ? loc.node.provenance.length : 0;
	if ( len > 0 ) {
		const instance = ( id !== void 0 ) ?
			loc.node.provenance.find( x => x.entity === id ) :
			loc.node.provenance[ 0 ];
		if ( !instance ) {
			throw new Error( `zipperDown: Cannot find entity ${id} in provenance tree.` );
		}
		return {
			node: instance,
			metric,
			parentPath: [loc, ...loc.parentPath]
		};
	}
	throw new Error( 'Cannot move down without children in provenance zipper' );
};

/**
 * Is the instance a leaf node?
 *
 * @param {Object} instance - an assessment instance
 * @returns {boolean} true if instance has no children
 */
const isLeaf = instance => isUndefinedOrNull( instance.provenance ) || instance.provenance.length === 0;

/**
 * Returns tag weights if they are non-trivial, else null.
 *
 * @param {Object} weights - a map of tags to their weights
 * @returns {Object|null}
 */
const effectiveTagWeights = weights => {
	const weightValues = objectValues( weights );
	const haveWeights = weights && weightValues.some( isPositiveNumber );
	const defaultOnly = haveWeights && weightValues.length === 1 && weights[ DEFAULT_TAG ];

	if ( !haveWeights || defaultOnly ) {
		return null;
	}
	return weights;
};

/**
 * Returns a string displaying a tag's weight, or empty string if no trivial weight exists.
 *
 * @param {string} tag - a tag string, possibly DEFAULT_TAG
 * @param {Object|null} effWeights - if non-trivial custom tag weights, a tag weights object
 *     else null
 * @returns {string}
 */
const tagWeightLabel = ( tag, effWeights ) => {
	if ( effWeights ) {
		return `(${effWeights[ tag || DEFAULT_TAG ] ?? effWeights[ DEFAULT_TAG ] ?? 0})`;
	}
	return '';
};

/**
 * Returns a label for a custom tag, or an empty string.
 *
 * @param {string} prefix - a string to precede the tag name
 * @param {string|undefined|null} tag - a tag string
 * @returns {string}
 */
const tagLabel = (prefix, tag) => (tag && tag !== DEFAULT_TAG ? (prefix + tag) : (prefix + 'default'));

/**
 * Returns a label for a score, with an empty string for missing values.
 *
 * @param {number} score - a score from 0 to 100 or MISSING_SCORE for a missing value
 * @returns {string}
 */
const scoreLabel = score => (score === MISSING_SCORE || isUndefinedOrNull( score )) ? '' : roundn( score, -1 ).toFixed( 1 );


// COLUMN SPEC //

/**
 * Creates a table column structure for one level in a provenance tree.
 *
 * @param {Function} drillDown - a function moving to an entity at the next level down
 * @param {('program'|'namespace'|'lesson'|'component')} level - the level of the current node
 * @param {Object} metric - metric object
 * @param {Function} names - a fn mapping entity ids to entity titles/names
 * @param {Function} [t=identity] - a translation function, mapping strings to strings.
 *
 * @returns {Array<Object>} an array of StandardTable column specifications.
 */
const makeColumns = (drillDown, level, metric, names, t = s => s) => [
	{
		accessorFn: row => names(row.entity),
		header: t('common:'+level)
	},
	{
		accessorFn: row => scoreLabel(row.score),
		header: t('score')
	},
	{
		accessorFn: row => relativeDate(row.time),
		header: t('time-calculated')
	},
	{
		accessorKey: 'tag',
		header: t('tag-and-weight'),
		cell: cell => {
			const tag = cell.getValue();
			return (
				<span>
					{tagLabel( '', tag )}
					{'  '}
					{tagWeightLabel( tag, effectiveTagWeights( metric.tagWeights ))}
				</span>
			);
		}
	},
	{
		header: t('drill-down'),
		id: 'drill-down',
		cell: cell => {
			const inst = cell.row.original;
			if ( isLeaf( inst ) ) {
				return null;
			}
			const handleDrillDown = () => drillDown( inst.entity );
			return (
				<span tabIndex="-1" role="button" onKeyDown={handleDrillDown} onClick={handleDrillDown}>
					<i className="fa fa-arrow-down" />
				</span>
			);
		}
	}
];


// MAIN //

/**
 * A modal component for dynamically navigating a provenance tree.
 *
 * @param {Object} instance - an instance acting as root of the provenance tree
 * @param {Object} metric - metric object
 * @param {Object} entities - a map from entity id to entity title/name
 * @param {Function} onHide - a nullary callback to call when the modal is closed
 * @param {boolean} [show=true] - whether to show the modal.
 *
 * @returns {Object} a React component
 */
const ProvenanceNavigator = ({ instance, metric, entities, lastUpdated, onHide, show = true }) => {
	const { t } = useTranslation( [ 'namespace_data', 'common' ] );
	const [zipper, setZipper] = useState( makeProvenanceZipper( instance, metric ) );
	const nameOf = id => entities?.[id]?.title ?? id;
	const moveDown = id => setZipper(z => {
		const entity = entities[ id ];
		let submetric = null;
		if ( entity ) {
			submetric = entity.assessments.find( x => x.name === z.metric.submetric );
		}
		return zipperDown( z, id, submetric );
	});
	const moveUp = () => setZipper( zipperUp );
	const columns = makeColumns(moveDown, zipper.node.level, zipper.metric, nameOf, t );
	const data = zipper.node.provenance || [];
	const timeMsg = zipper.node.time ? ` from ${relativeDate(zipper.node.time)}` : '';
	return (
		<Modal size="lg" show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title as="h3">
					{`${t('score-provenance-for')} ${t('common:'+zipper.node.level)} ${nameOf(zipper.node.entity)}`}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<h4>
					{`Score ${scoreLabel(zipper.node.score)}${timeMsg}${tagLabel(' with tag ', zipper.node.tag)}`}
					<Button
						onClick={moveUp} style={{ float: 'right' }}
						disabled={isZipperAtRoot(zipper)}
						variant="outline-dark"
						className="mb-2"
					>
						{t('move-up')}
					</Button>
				</h4>
				{zipper.metric && <h5>
					{t('calculated-with-metric', {
						metricName: zipper.metric.name,
						ruleName: zipper.metric.rule[ 0 ],
						ruleParams: zipper.metric.rule.slice( 1 ).join( ', ' )
					})}
				</h5>}
				{new Date( zipper.metric.lastUpdated ).getTime() > lastUpdated && <h5 className="assessments-warning" >
					{t('metric-has-changed-since-score-was-calculated')}
				</h5>}
				<StandardTable
					columns={columns}
					data={data}
				/>
			</Modal.Body>
		</Modal>
	);
};


// PROPERTIES //

ProvenanceNavigator.propTypes = {
	entities: PropTypes.object.isRequired,
	instance: PropTypes.object.isRequired,
	lastUpdated: PropTypes.number.isRequired,
	metric: PropTypes.object.isRequired,
	onHide: PropTypes.func.isRequired,
	show: PropTypes.bool
};

ProvenanceNavigator.defaultProps = {
	show: true
};


// EXPORTS //

export { relativeDate };  // ATTN:TODO should probably be moved elsewhere

export default ProvenanceNavigator;
