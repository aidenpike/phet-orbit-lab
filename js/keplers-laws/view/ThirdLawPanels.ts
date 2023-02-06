// Copyright 2022-2023, University of Colorado Boulder

/**
 * Kepler's third law accordion box
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { GridBox, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ThirdLawGraph from './ThirdLawGraph.js';
import ThirdLawSliderPanel from './ThirdLawSliderPanel.js';
import MySolarSystemTextNumberDisplay from '../../common/view/MySolarSystemTextNumberDisplay.js';

export type PanelThirdLawOptions = PanelOptions;

export default class ThirdLawPanels extends VBox {
  public constructor( model: KeplersLawsModel ) {
    super( {
      margin: 5,
      stretch: true,
      children: [
        new ThirdLawMainPanel( model ),
        new ThirdLawSliderPanel( model )
      ],
      visibleProperty: model.isThirdLawProperty
    } );
  }
}

class ThirdLawMainPanel extends Panel {
  public constructor( model: KeplersLawsModel ) {
    const options = combineOptions<PanelThirdLawOptions>( {
      visibleProperty: model.isThirdLawProperty,
      fill: MySolarSystemColors.backgroundProperty,
      stroke: MySolarSystemColors.gridIconStrokeColorProperty
    }, MySolarSystemConstants.CONTROL_PANEL_OPTIONS );

    const semiMajorAxisValueRange = new RangeWithValue( 1, 10000, model.engine.a );
    const periodValueRange = new RangeWithValue( 1, 10000, model.engine.T );

    const semiMajorAxisStringPattern = new PatternStringProperty( MySolarSystemStrings.pattern.textValueUnitsStringProperty, {
      text: new DerivedProperty(
        [ MySolarSystemStrings.semiMajorAxisSymbolStringProperty, model.selectedAxisPowerProperty ],
        ( a, power ) => a + ( power === 1 ? '' : `<sup>${power}</sup>` ) + ' =' ),
      units: new DerivedProperty(
        [ MySolarSystemStrings.units.AUStringProperty, model.selectedAxisPowerProperty ],
        ( au, power ) => au + ( power === 1 ? '' : `<sup>${power}</sup>` )
      )
    } );

    const periodStringPattern = new PatternStringProperty( MySolarSystemStrings.pattern.textValueUnitsStringProperty, {
      text: new DerivedProperty(
        [ MySolarSystemStrings.periodSymbolStringProperty, model.selectedPeriodPowerProperty ],
        ( T, power ) => T + ( power === 1 ? '' : `<sup>${power}</sup>` ) + ' =' ),
      units: new DerivedProperty(
        [ MySolarSystemStrings.units.yearsStringProperty, model.selectedPeriodPowerProperty ],
        ( years, power ) => years + ( power === 1 ? '' : `<sup>${power}</sup>` )
      )
    } );


    super( new VBox( {
      spacing: 10,
      children: [
        new Text( MySolarSystemStrings.graph.titleStringProperty, MySolarSystemConstants.TITLE_OPTIONS ),
        new GridBox( {
          children: [
            // Period power buttons
            new RectangularRadioButtonGroup(
              model.selectedPeriodPowerProperty,
              [
                {
                  value: 1,
                  createNode: () => new RichText( MySolarSystemStrings.periodSymbolStringProperty, MySolarSystemConstants.TEXT_OPTIONS )
                },
                {
                  value: 2,
                  //REVIEW: And this should probably include string composition (e.g. combining the translated string for
                  //REVIEW: T with the superscript somehow?)
                  createNode: () => new RichText( 'T<sup>2</sup>', MySolarSystemConstants.TEXT_OPTIONS )
                },
                {
                  value: 3,
                  createNode: () => new RichText( 'T<sup>3</sup>', MySolarSystemConstants.TEXT_OPTIONS )
                }
              ],
              {
                layoutOptions: { column: 0, row: 0 }
              }
            ),
            // Semi-major axis power buttons
            new RectangularRadioButtonGroup(
              model.selectedAxisPowerProperty,
              [
                {
                  value: 1,
                  createNode: () => new RichText( MySolarSystemStrings.semiMajorAxisSymbolStringProperty, MySolarSystemConstants.TEXT_OPTIONS )
                },
                {
                  value: 2,
                  createNode: () => new RichText( 'a<sup>2</sup>', MySolarSystemConstants.TEXT_OPTIONS )
                },
                {
                  value: 3,
                  createNode: () => new RichText( 'a<sup>3</sup>', MySolarSystemConstants.TEXT_OPTIONS )
                }
              ],
              {
                layoutOptions: { column: 1, row: 1 },
                orientation: 'horizontal'
              }
            ),
            new ThirdLawGraph( model, model.engine, {
              layoutOptions: { column: 1, row: 0 },
              excludeInvisibleChildrenFromBounds: true
            } )
          ],
          spacing: 10
        } ),
        new MySolarSystemTextNumberDisplay(
          model.poweredSemiMajorAxisProperty,
          semiMajorAxisValueRange,
          {
            valuePattern: semiMajorAxisStringPattern,
            align: 'left'
          }
        ),
        new MySolarSystemTextNumberDisplay(
          model.poweredPeriodProperty,
          periodValueRange,
          {
            valuePattern: periodStringPattern,
            align: 'left'
          } )
      ]
    } ), options );
  }
}

mySolarSystem.register( 'ThirdLawPanels', ThirdLawPanels );