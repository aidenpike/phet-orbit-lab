// Copyright 2023, University of Colorado Boulder

/**
 * MySolarSystemVisibleProperties contains visibleProperty instances for things in the view. These Properties are controlled
 * by checkboxes and toggle buttons.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import SolarSystemCommonVisibleProperties from '../../../../solar-system-common/js/view/SolarSystemCommonVisibleProperties.js';

export default class MySolarSystemVisibleProperties extends SolarSystemCommonVisibleProperties {

  // Indicates if the center of mass is visible.
  public readonly centerOfMassVisibleProperty: BooleanProperty;

  public constructor( tandem: Tandem ) {
    super( tandem );

    this.centerOfMassVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'centerOfMassVisibleProperty' )
    } );
  }

  public override reset(): void {
    super.reset();
    this.centerOfMassVisibleProperty.reset();
  }
}

mySolarSystem.register( 'MySolarSystemVisibleProperties', MySolarSystemVisibleProperties );