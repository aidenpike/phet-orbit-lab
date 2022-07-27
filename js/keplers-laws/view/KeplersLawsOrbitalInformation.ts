// Copyright 2022, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { Shape } from '../../../../kite/js/imports.js';
import { FlowBox, HBox, Text, VBoxOptions } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import mySolarSystem from '../../mySolarSystem.js';
import mySolarSystemStrings from '../../mySolarSystemStrings.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import LawMode from '../model/LawMode.js';

const orbitalInformationString = mySolarSystemStrings.orbital;
const axisString = mySolarSystemStrings.axis;
const apoapsisString = mySolarSystemStrings.apoapsis;
const periapsisString = mySolarSystemStrings.periapsis;


// constants
const CHECKBOX_OPTIONS = {
  boxWidth: 14,
  checkboxColor: MySolarSystemColors.foregroundProperty,
  checkboxColorBackground: MySolarSystemColors.backgroundProperty
};
const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

const TITLE_OPTIONS = {
  font: MySolarSystemConstants.TITLE_FONT,
  fill: MySolarSystemColors.foregroundProperty
};
 
 const SPACING = 10;
 
 type SelfOptions = EmptySelfOptions;
 
 type KeplersLawsOrbitalInformationOptions = SelfOptions & VBoxOptions;
 
 class KeplersLawsOrbitalInformation extends FlowBox {
 
   public constructor( model: KeplersLawsModel, providedOptions?: KeplersLawsOrbitalInformationOptions ) {

     //  const axisIconImageNode = new Image( ???, { scale: 0.25 } ); TODO

     const secondLawChildren = [
       new Checkbox( model.axisVisibleProperty, new FlowBox( {
         spacing: 10,
         children: [
           new Text( axisString, TEXT_OPTIONS )
           //  axisIconImageNode
         ]
       } ), CHECKBOX_OPTIONS ),
       new Checkbox( model.apoapsisVisibleProperty, new FlowBox( {
         spacing: 10,
         children: [
           new Text( apoapsisString, TEXT_OPTIONS ),
           new XNode( {
             fill: 'cyan',
             stroke: 'white',
             center: Vector2.ZERO,
             scale: 0.5
           } )
         ]
       } ), CHECKBOX_OPTIONS ),
       new Checkbox( model.periapsisVisibleProperty, new FlowBox( {
         spacing: 10,
         children: [
           new Text( periapsisString, TEXT_OPTIONS ),
           new XNode( {
             fill: 'gold',
             stroke: 'white',
             center: Vector2.ZERO,
             scale: 0.5
           } )
         ]
       } ), CHECKBOX_OPTIONS )
     ];

     const thirdLawChildren = [
       new Checkbox( model.semimajorAxisVisibleProperty, new FlowBox( {
         spacing: 10,
         children: [
           new Text( 'Semimajor Axis (a)', TEXT_OPTIONS )
           //  axisIconImageNode
         ]
       } ), CHECKBOX_OPTIONS ),
       new Checkbox( model.periodVisibleProperty, new FlowBox( {
         spacing: 10,
         children: [
           new Text( 'Period (T)', TEXT_OPTIONS )
           //  axisIconImageNode
         ]
       } ), CHECKBOX_OPTIONS )
     ];

     const orbitalInformationNode = new HBox( {
           spacing: 10,
           children: [
             new Text( orbitalInformationString, TITLE_OPTIONS ),
             new InfoButton( { scale: 0.5 } )
           ]
         } );

     const children = [
       orbitalInformationNode,
       ...( model.selectedLawProperty.value === LawMode.SECOND_LAW ? secondLawChildren : thirdLawChildren )
     ];
 
     // increase the touch area of the checkboxes
     const touchAreaHeight = 32;
     children.forEach( child => {
       const KeplersLawsOrbitalInformation = child;
       const bounds = KeplersLawsOrbitalInformation.parentToLocalBounds( KeplersLawsOrbitalInformation.bounds );
       KeplersLawsOrbitalInformation.touchArea = Shape.rectangle( -5, bounds.centerY - touchAreaHeight / 2, bounds.width + 10, touchAreaHeight );
     } );
 
     super( optionize<KeplersLawsOrbitalInformationOptions, SelfOptions, FlowBox>()( {
       children: children,
       spacing: SPACING,
       orientation: 'vertical',
       align: 'left',
       stretch: true
     }, providedOptions ) );

     model.selectedLawProperty.link( law => {
       this.children = [
         orbitalInformationNode,
         ...( law === LawMode.SECOND_LAW ? secondLawChildren : thirdLawChildren )
       ];
     } );
   }
 }
 
 mySolarSystem.register( 'KeplersLawsOrbitalInformation', KeplersLawsOrbitalInformation );
 export default KeplersLawsOrbitalInformation;