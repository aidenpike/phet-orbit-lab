// Copyright 2022, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { Node, Text, VBox, VBoxOptions, VDivider } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import LabModes from '../model/LabModes.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import ArrowsCheckboxNode from './ArrowsCheckboxNode.js';
import OrbitalInformation from './OrbitalInformation.js';
import VisibilityInformation from './VisibilityInformation.js';
import CommonModel from '../model/CommonModel.js';

const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT
};

/**
 * The possible pre-sets for the lab are:
    Sun and planet
    Sun, planet, moon
    Sun, planet, comet
    Trojan asteroid 
    Ellipses
    Hyperbolic
    Slingshot
    Double Slingshot
    Binary star, planet 
    Four-star ballet
    Double double
    Custom
 */

type SelfOptions = {
  tandem: Tandem;
};

type MySolarSystemControlsOptions = SelfOptions & VBoxOptions;

export default class MySolarSystemControls extends VBox {

  public constructor(
    model: CommonModel,
    topLayer: Node,
    providedOptions?: MySolarSystemControlsOptions
  ) {
    super( {
      children: [
        ...( model.isLab ? [ new ComboBox( model.labModeProperty, [
          { value: LabModes.SUN_PLANET, node: new Text( 'Sun and Planet', TEXT_OPTIONS ) },
          { value: LabModes.SUN_PLANET_MOON, node: new Text( 'Sun, Planet and Moon', TEXT_OPTIONS ) },
          { value: LabModes.SUN_PLANET_COMET, node: new Text( 'Sun, Planet and Comet', TEXT_OPTIONS ) },
          { value: LabModes.TROJAN_ASTEROIDS, node: new Text( 'Trojan Asteroids', TEXT_OPTIONS ) },
          { value: LabModes.ELLIPSES, node: new Text( 'Ellipses', TEXT_OPTIONS ) },
          { value: LabModes.HYPERBOLIC, node: new Text( 'Hyperbolic', TEXT_OPTIONS ) },
          { value: LabModes.SLINGSHOT, node: new Text( 'Slingshot', TEXT_OPTIONS ) },
          { value: LabModes.DOUBLE_SLINGSHOT, node: new Text( 'Double Slingshot', TEXT_OPTIONS ) },
          { value: LabModes.BINARY_STAR_PLANET, node: new Text( 'Binary Star, Planet', TEXT_OPTIONS ) },
          { value: LabModes.FOUR_STAR_BALLET, node: new Text( 'Four Star Ballet', TEXT_OPTIONS ) },
          { value: LabModes.DOUBLE_DOUBLE, node: new Text( 'Double Double', TEXT_OPTIONS ) },
          { value: LabModes.CUSTOM, node: new Text( 'Custom', TEXT_OPTIONS ) }
        ], topLayer ) ] : [] ),
        new OrbitalInformation( model ),
        new VDivider( MySolarSystemConstants.VDIVIDER_OPTIONS ),
        new ArrowsCheckboxNode( model ),
        new VDivider( MySolarSystemConstants.VDIVIDER_OPTIONS ),
        new VisibilityInformation( model )
      ],
      spacing: 4,
      align: 'left',
      stretch: true
    } );
  }

}

mySolarSystem.register( 'MySolarSystemControls', MySolarSystemControls );