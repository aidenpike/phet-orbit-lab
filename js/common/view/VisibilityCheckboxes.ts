// Copyright 2022, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { Shape } from '../../../../kite/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { FlowBox, Image, Text, VBoxOptions } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import pathIcon_png from '../../../images/pathIcon_png.js';
import mySolarSystem from '../../mySolarSystem.js';
import mySolarSystemStrings from '../../mySolarSystemStrings.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import optionize from '../../../../phet-core/js/optionize.js';
import IntroModel from '../../intro/model/IntroModel.js';
import MySolarSystemGridNode from './MySolarSystemGridNode.js';
import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import XNode from '../../../../scenery-phet/js/XNode.js';

const pathString = mySolarSystemStrings.path;
const gridString = mySolarSystemStrings.grid;
const massString = mySolarSystemStrings.mass;

// constants
const FONT = new PhetFont( 14 );
const CHECKBOX_OPTIONS = {
  boxWidth: 14,
  checkboxColor: MySolarSystemColors.foregroundProperty,
  checkboxColorBackground: MySolarSystemColors.backgroundProperty
};
const TEXT_OPTIONS = {
  font: FONT,
  fill: MySolarSystemColors.foregroundProperty
};

const SPACING = 10;

type SelfOptions = {};

type VisibilityCheckboxesOptions = SelfOptions & VBoxOptions;

class VisibilityCheckboxes extends FlowBox {

  constructor( model: IntroModel, providedOptions?: VisibilityCheckboxesOptions ) {

    const pathIconImageNode = new Image( pathIcon_png, { scale: 0.25 } );

    const children = [
      new Checkbox( new FlowBox( {
        spacing: 10,
        children: [
          new Text( pathString, TEXT_OPTIONS ),
          pathIconImageNode
        ]
      } ), model.pathVisibleProperty, CHECKBOX_OPTIONS ),
      new Checkbox( new FlowBox( {
        spacing: 10,
        children: [
          new Text( gridString, TEXT_OPTIONS ),
          new MySolarSystemGridNode( new Property( ModelViewTransform2.createIdentity() ), 10, new Vector2( 0, 0 ), 1, {
            stroke: MySolarSystemColors.gridIconStrokeColorProperty,
            lineWidth: 1.5
      } )
        ]
      } ), model.gridVisibleProperty, CHECKBOX_OPTIONS ),
      new Checkbox( new FlowBox( {
        spacing: 10,
        children: [
          new Text( massString, TEXT_OPTIONS ),
          new XNode( {
            fill: 'red',
            stroke: 'white',
            center: Vector2.ZERO,
            scale: 0.5
          } )
        ]
      } ), model.centerOfMass.visibleProperty, CHECKBOX_OPTIONS )
    ];

    // increase the touch area of the checkboxes
    const touchAreaHeight = 32;
    children.forEach( child => {
      const VisibilityCheckboxes = child;
      const bounds = VisibilityCheckboxes.parentToLocalBounds( VisibilityCheckboxes.bounds );
      VisibilityCheckboxes.touchArea = Shape.rectangle( -5, bounds.centerY - touchAreaHeight / 2, bounds.width + 10, touchAreaHeight );
    } );

    super( optionize<VisibilityCheckboxesOptions, SelfOptions, FlowBox>()( {
      children: children,
      spacing: SPACING,
      orientation: 'vertical',
      align: 'left',
      stretch: true
    }, providedOptions ) );
  }
}

mySolarSystem.register( 'VisibilityCheckboxes', VisibilityCheckboxes );
export default VisibilityCheckboxes;