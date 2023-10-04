// Copyright 2022-2023, University of Colorado Boulder

/**
 * InteractiveNumberDisplay is a NumberDisplay that allows the user to enter a value using a kepad. Clicking
 * on the NumberDisplay pops up the keypad. It is used in this sim to set Mass, Position and Velocity.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import TProperty from '../../../../axon/js/TProperty.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import KeypadDialog from '../../../../scenery-phet/js/keypad/KeypadDialog.js';
import { Color, FireListener, InteractiveHighlighting, PressListener } from '../../../../scenery/js/imports.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = {
  useExponential?: boolean; //TODO https://github.com/phetsims/my-solar-system/issues/213 document
  hideSmallValues?: boolean; //TODO https://github.com/phetsims/my-solar-system/issues/213 document
  onEditCallback?: () => void;
};

type InteractiveNumberDisplayOptions = SelfOptions; // no NumberDisplayOptions are currently needed

export default class InteractiveNumberDisplay extends InteractiveHighlighting( NumberDisplay ) {

  //TODO https://github.com/phetsims/my-solar-system/issues/213 document
  public readonly isKeypadActiveProperty: TProperty<boolean>;

  public constructor(
    property: TProperty<number>,
    range: RangeWithValue,
    units: TReadOnlyProperty<string>,
    userControlledProperty: TProperty<boolean>,
    bodyColorProperty: TReadOnlyProperty<Color>,
    isPlayingProperty: TProperty<boolean>,
    decimalPlaces: number,
    providedOptions?: InteractiveNumberDisplayOptions
  ) {

    const isKeypadActiveProperty = new BooleanProperty( false );

    // Keypad dialog
    const keypadDialog = new KeypadDialog( {
      useRichTextRange: true,
      keypadOptions: {
        accumulatorOptions: {

          // Max is 300, but we need 4 digits to support numbers like 123.4
          maxDigits: 5,
          maxDigitsRightOfMantissa: 2
        }
      }
    } );

    const hoverListener = new PressListener( {
      tandem: Tandem.OPT_OUT,
      attach: false // Don't be greedy with the pointer, it would prevent the fire listener from activating
    } );

    const options = optionize<InteractiveNumberDisplayOptions, SelfOptions, NumberDisplayOptions>()( {

      // SelfOptions
      useExponential: false,
      hideSmallValues: false,
      onEditCallback: _.noop,

      // NumberDisplayOptions
      cursor: 'pointer',
      numberFormatter: ( n: number ) => {
        if ( providedOptions?.hideSmallValues && Math.abs( n ) <= 0.1 ) {
          return `${MathSymbols.LESS_THAN_OR_EQUAL} 0.1`;
        }
        else {
          return Utils.toFixed( n, decimalPlaces );
        }
      },
      textOptions: {
        font: SolarSystemCommonConstants.PANEL_FONT
      },
      backgroundFill: new DerivedProperty( [
        userControlledProperty,
        isKeypadActiveProperty,
        hoverListener.looksOverProperty,
        bodyColorProperty
      ], ( isUserControlled, isKeypadActive, looksOver, backgroundColor ) => {
        return isUserControlled || isKeypadActive || looksOver ? backgroundColor.colorUtilsBrighter( 0.7 ) : Color.WHITE;
      } ),
      backgroundStroke: Color.BLACK,

      // a11y
      // innerContent to support dynamic changes
      innerContent: new DerivedProperty( [ property, units ], ( value, units ) => {
        return `${Utils.toFixed( value, 2 )} ${units}`;
      } ),
      tagName: 'button',
      containerTagName: 'div'
    }, providedOptions );

    super( property, range, options );

    this.localBoundsProperty.link( localBounds => {
      this.touchArea = localBounds.dilatedXY( 5, 3.5 );
    } );

    this.isKeypadActiveProperty = isKeypadActiveProperty;

    this.addInputListener( hoverListener );

    this.addInputListener( new FireListener( {
      fire: () => {
        if ( !userControlledProperty.value ) {
          isKeypadActiveProperty.value = true;

          const wasPlaying = isPlayingProperty.value;
          isPlayingProperty.value = false;

          let changed = false;
          const editValue = ( value: number ) => {
            changed = true;
            property.value = value;
            userControlledProperty.value = true;
            options.onEditCallback();
          };
          const endEdit = () => {
            isKeypadActiveProperty.value = false;
            userControlledProperty.value = false;
            if ( !changed ) {
              isPlayingProperty.value = wasPlaying;
            }
          };

          keypadDialog.beginEdit( editValue, range, MySolarSystemStrings.pattern.rangeStringProperty, endEdit );
        }
      },
      fireOnDown: true
    } ) );
  }
}

mySolarSystem.register( 'InteractiveNumberDisplay', InteractiveNumberDisplay );