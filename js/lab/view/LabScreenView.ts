// Copyright 2022-2023, University of Colorado Boulder

/**
 * Screen View for Lab Screen: Where you can play with all the presets and body configurations
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import LabModel from '../model/LabModel.js';
import MySolarSystemScreenView from '../../common/view/MySolarSystemScreenView.js';
import { Node } from '../../../../scenery/js/imports.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import LabModePanel from './LabModePanel.js';

export default class LabScreenView extends MySolarSystemScreenView {
  public constructor( model: LabModel, tandem: Tandem ) {

    super( model, {
      tandem: tandem,
      screenSummaryContent: new LabScreenViewSummaryContentNode()
    } );

    // Add a panel at the top left for selecting a system of bodies.
    // Put that panel at the beginning of the PDOM order for interfaceLayer.
    const labModePanel = new LabModePanel( model.labModeProperty, this.topLayer, tandem.createTandem( 'labModePanel' ) );
    this.topRightVBox.insertChild( 0, labModePanel );
    this.interfaceLayer.pdomOrder = [ labModePanel, ...this.interfaceLayer.pdomOrder! ];

    model.bodyAddedEmitter.addListener( () => {
      this.bodySoundManager.playBodyAddedSound( model.bodies.length - 1 );
    } );

    model.bodyRemovedEmitter.addListener( () => {
      this.bodySoundManager.playBodyRemovedSound( model.bodies.length - 1 );
    } );
  }
}

class LabScreenViewSummaryContentNode extends Node {
  public constructor() {

    const playAreaDescriptionNode = new Node( {
      tagName: 'p',
      innerContent: MySolarSystemStrings.a11y.labScreen.screenSummary.playAreaDescriptionStringProperty
    } );
    const controlAreaDescriptionNode = new Node( {
      tagName: 'p',
      innerContent: MySolarSystemStrings.a11y.labScreen.screenSummary.controlAreaDescriptionStringProperty
    } );

    super( {
      children: [ playAreaDescriptionNode, controlAreaDescriptionNode ]
    } );
  }
}

mySolarSystem.register( 'LabScreenView', LabScreenView );