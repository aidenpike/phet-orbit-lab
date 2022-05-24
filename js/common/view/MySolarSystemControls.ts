// Copyright 2022, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { FlowBox, FlowBoxOptions, Node, Text, VDivider } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IntroModel from '../../intro/model/IntroModel.js';
import mySolarSystem from '../../mySolarSystem.js';
import LabModes from '../model/LabModes.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import ArrowsCheckboxNode from './ArrowsCheckboxNode.js';
import OrbitalInformation from './OrbitalInformation.js';
import VisibilityInformation from './VisibilityInformation.js';

const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT
};

const VDIVIDER_OPTIONS = {
  lineWidth: 2,
  stroke: MySolarSystemConstants.CONTROL_PANEL_STROKE,
  layoutOptions: {
    yMargin: 5
  }
};

type SelfOptions = {
  tandem: Tandem;
};

type MySolarSystemControlsOptions = SelfOptions & FlowBoxOptions;

class MySolarSystemControls extends FlowBox {

  constructor(
    model: IntroModel,
    topLayer: Node,
    providedOptions?: MySolarSystemControlsOptions
    ) {
    super( {
      children: [
        ...( model.isLab ? [ new ComboBox( [
          new ComboBoxItem( new Text( 'Two Bodies', TEXT_OPTIONS ), LabModes.TWO_BODY_MODE ),
          new ComboBoxItem( new Text( 'Three Bodies', TEXT_OPTIONS ), LabModes.THREE_BODY_MODE ),
          new ComboBoxItem( new Text( 'Four Bodies', TEXT_OPTIONS ), LabModes.FOUR_BODY_MODE )
        ], model.labModeProperty, topLayer ) ] : [] ),
        new OrbitalInformation( model ),
        new VDivider( VDIVIDER_OPTIONS ),
        new ArrowsCheckboxNode( model ),
        new VDivider( VDIVIDER_OPTIONS ),
        new VisibilityInformation( model )
      ],
      spacing: 4,
      align: 'left',
      stretch: true,
      orientation: 'vertical'
    } );
  }

}

mySolarSystem.register( 'MySolarSystemControls', MySolarSystemControls );
export default MySolarSystemControls;