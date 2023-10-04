// Copyright 2023, University of Colorado Boulder

/**
 * Combo Box that keeps track of the Lab Modes and their proper string mapping.
 * Creates the ComboBoxItems with tandems and a11y view.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import LabMode from '../model/LabMode.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import ComboBox, { ComboBoxItem, ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

type SelfOptions = EmptySelfOptions;
type LabModeComboBoxOptions = SelfOptions &
  PickOptional<ComboBoxOptions, 'widthSizable' | 'layoutOptions' | 'phetioVisiblePropertyInstrumented'> &
  PickRequired<ComboBoxOptions, 'tandem'>;

export default class LabModeComboBox extends ComboBox<LabMode> {

  public constructor( labModeProperty: Property<LabMode>, listboxParent: Node, providedOptions: LabModeComboBoxOptions ) {

    const options = optionize<LabModeComboBoxOptions, SelfOptions, ComboBoxOptions>()( {

      // ComboBoxOptions
      buttonTouchAreaXDilation: 10,
      buttonTouchAreaYDilation: 10,

      // pdom
      accessibleName: MySolarSystemStrings.a11y.labScreen.modeSelectorStringProperty
    }, providedOptions );

    const items: ComboBoxItem<LabMode>[] = [
      createItem( LabMode.SUN_PLANET, MySolarSystemStrings.mode.sunAndPlanetStringProperty ),
      createItem( LabMode.SUN_PLANET_MOON, MySolarSystemStrings.mode.sunPlanetAndMoonStringProperty ),
      createItem( LabMode.SUN_PLANET_COMET, MySolarSystemStrings.mode.sunPlanetAndCometStringProperty ),
      createItem( LabMode.TROJAN_ASTEROIDS, MySolarSystemStrings.mode.trojanAsteroidsStringProperty ),
      createItem( LabMode.ELLIPSES, MySolarSystemStrings.mode.ellipsesStringProperty ),
      createItem( LabMode.HYPERBOLIC, MySolarSystemStrings.mode.hyperbolicStringProperty ),
      createItem( LabMode.SLINGSHOT, MySolarSystemStrings.mode.slingshotStringProperty ),
      createItem( LabMode.DOUBLE_SLINGSHOT, MySolarSystemStrings.mode.doubleSlingshotStringProperty ),
      createItem( LabMode.BINARY_STAR_PLANET, MySolarSystemStrings.mode.binaryStarPlanetStringProperty ),
      createItem( LabMode.FOUR_STAR_BALLET, MySolarSystemStrings.mode.fourStarBalletStringProperty ),
      createItem( LabMode.DOUBLE_DOUBLE, MySolarSystemStrings.mode.doubleDoubleStringProperty ),
      createItem( LabMode.CUSTOM, MySolarSystemStrings.mode.customStringProperty )
    ];

    super( labModeProperty, items, listboxParent, options );
  }
}

/**
 * Creates an item for the combo box.
 */
function createItem( mode: LabMode, nameProperty: TReadOnlyProperty<string> ): ComboBoxItem<LabMode> {
  return {
    value: mode,
    createNode: () => new Text( nameProperty, {
      font: SolarSystemCommonConstants.PANEL_FONT,
      maxWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH
    } ),
    a11yName: nameProperty
  };
}

mySolarSystem.register( 'LabModeComboBox', LabModeComboBox );