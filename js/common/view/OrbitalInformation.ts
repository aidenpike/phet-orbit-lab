// Copyright 2022, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { HBox, Image, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import pathIcon_png from '../../../images/pathIcon_png.js';
import mySolarSystem from '../../mySolarSystem.js';
import mySolarSystemStrings from '../../mySolarSystemStrings.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import optionize from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import CommonModel from '../model/CommonModel.js';
import MySolarSystemCheckbox from './MySolarSystemCheckbox.js';

const pathString = mySolarSystemStrings.path;
const massString = mySolarSystemStrings.mass;

// constants
const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

const SPACING = 10;

type SelfOptions = EmptyObjectType;

type OrbitalInformationOptions = SelfOptions & VBoxOptions;

class OrbitalInformation extends VBox {

  constructor( model: CommonModel, providedOptions?: OrbitalInformationOptions ) {

    const pathIconImageNode = new Image( pathIcon_png, { scale: 0.25 } );

    const children = [
      new MySolarSystemCheckbox( model.pathVisibleProperty, new HBox( {
        spacing: 10,
        children: [
          new Text( pathString, TEXT_OPTIONS ),
          pathIconImageNode
        ]
      } ), MySolarSystemConstants.CHECKBOX_OPTIONS ),
      new MySolarSystemCheckbox( model.centerOfMass.visibleProperty, new HBox( {
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
      } ), MySolarSystemConstants.CHECKBOX_OPTIONS )
    ];

    super( optionize<OrbitalInformationOptions, SelfOptions, VBox>()( {
      children: children,
      spacing: SPACING,
      align: 'left',
      stretch: true
    }, providedOptions ) );
  }
}

mySolarSystem.register( 'OrbitalInformation', OrbitalInformation );
export default OrbitalInformation;