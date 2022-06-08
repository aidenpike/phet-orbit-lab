// Copyright 2022, University of Colorado Boulder
/**
 * Universal slider for MySolarSystem
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import HSlider, { HSliderOptions } from '../../../../sun/js/HSlider.js';
import IProperty from '../../../../axon/js/IProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';

type SelfOptions = {};

export type MySolarSystemSliderOptions = SelfOptions & HSliderOptions;

export default class MySolarSystemSlider extends HSlider {
  constructor( valueProperty: IProperty<number>, range: Range, providedOptions?: MySolarSystemSliderOptions ) {
    const options = optionize<MySolarSystemSliderOptions, SelfOptions, HSliderOptions>()( {
      trackSize: new Dimension2( 200, 2 ),
      thumbCenterLineStroke: 'black',
      trackFillEnabled: 'black'
    }, providedOptions );
    super( valueProperty, range, options );
  }
}

mySolarSystem.register( 'MySolarSystemSlider', MySolarSystemSlider );