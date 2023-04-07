// Copyright 2022-2023, University of Colorado Boulder

/**
 * Screen view for the My Solar System Screen
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import { AlignBox, HBox, Node, Path, RichText, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import MySolarSystemControls from './MySolarSystemControls.js';
import mySolarSystem from '../../mySolarSystem.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import SolarSystemCommonScreenView from '../../../../solar-system-common/js/view/SolarSystemCommonScreenView.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import SolarSystemCommonCheckbox from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';
import FullDataPanel from './FullDataPanel.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import NumberSpinner, { NumberSpinnerOptions } from '../../../../sun/js/NumberSpinner.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';
import Range from '../../../../dot/js/Range.js';
import ViewSynchronizer from '../../../../scenery-phet/js/ViewSynchronizer.js';
import Body from '../../../../solar-system-common/js/model/Body.js';
import BodyNode from '../../../../solar-system-common/js/view/BodyNode.js';
import VectorNode from '../../../../solar-system-common/js/view/VectorNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Dialog from '../../../../sun/js/Dialog.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import PathsCanvasNode from './PathsCanvasNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import CenterOfMassNode from './CenterOfMassNode.js';
import LabModeComboBox from './LabModeComboBox.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';
import { Shape } from '../../../../kite/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

type SelfOptions = EmptySelfOptions;

export type IntroLabScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class MySolarSystemScreenView extends SolarSystemCommonScreenView {

  private readonly bodyNodeSynchronizer: ViewSynchronizer<Body, BodyNode>;

  public constructor( model: MySolarSystemModel, providedOptions: IntroLabScreenViewOptions ) {
    super( model, providedOptions );

    // Body and Arrows Creation =================================================================================================
    // Setting the Factory functions that will create the necessary Nodes

    const dragDebugPath = new Path( null, {
      stroke: 'red',
      fill: 'rgba(255,0,0,0.2)'
    } );
    if ( phet.chipper.queryParameters.dev ) {
      this.addChild( dragDebugPath );
    }

    let mapPosition = ( point: Vector2, radius: number ) => point;

    this.bodyNodeSynchronizer = new ViewSynchronizer( this.bodiesLayer, ( body: Body ) => {
      const bodyNode = new BodyNode( body, this.modelViewTransformProperty, {
        valuesVisibleProperty: model.valuesVisibleProperty,
        mapPosition: ( point, radius ) => {
          return mapPosition( point, radius );
        },
        soundViewNode: this
      } );

      return bodyNode;
    } );

    const velocityVectorSynchronizer = new ViewSynchronizer( this.componentsLayer, this.createDraggableVectorNode );

    const forceVectorSynchronizer = new ViewSynchronizer( this.componentsLayer, ( body: Body ) =>
      new VectorNode( body, this.modelViewTransformProperty, model.gravityVisibleProperty, body.forceProperty, model.forceScaleProperty, {
        fill: PhetColorScheme.GRAVITATIONAL_FORCE,
        constrainSize: true
      } )
    );

    // The ViewSynchronizers handle the creation and disposal of Model-View pairs
    const trackers = [
      this.bodyNodeSynchronizer, velocityVectorSynchronizer, forceVectorSynchronizer
    ];

    // Create bodyNodes and arrows for every body
    model.bodies.forEach( body => trackers.forEach( tracker => tracker.add( body ) ) );

    // Set up listeners for object creation and disposal
    model.bodies.elementAddedEmitter.addListener( body => {
      trackers.forEach( tracker => tracker.add( body ) );
    } );
    model.bodies.elementRemovedEmitter.addListener( body => {
      trackers.forEach( tracker => tracker.remove( body ) );
    } );

    // Center of Mass Node
    const centerOfMassNode = new CenterOfMassNode( model.centerOfMass, this.modelViewTransformProperty );
    this.componentsLayer.addChild( centerOfMassNode );


    // UI Elements ===================================================================================================

    // Zoom Buttons ---------------------------------------------------------------------------
    const zoomButtons = new MagnifyingGlassZoomButtonGroup(
      model.zoomLevelProperty,
      {
        spacing: 8,
        magnifyingGlassNodeOptions: {
          glassRadius: 8
        },
        touchAreaXDilation: 5,
        touchAreaYDilation: 5
      } );

    const labModeComboBox = new LabModeComboBox( model, this.topLayer, {
      widthSizable: false,
      layoutOptions: {
        align: 'center'
      }
    } );

    const checkboxesControlPanel = new MySolarSystemControls( model, this.topLayer, {
      tandem: providedOptions.tandem.createTandem( 'controlPanel' )
    } );

    const topRightControlBox = new VBox( {
      spacing: 10,
      stretch: true,
      children: [
        new Panel( new Node( { children: [ labModeComboBox ], visible: model.isLab } ), SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS ),
        this.timeBox,
        new Panel( checkboxesControlPanel, SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS )
      ]
    } );

    // Full Data Panel --------------------------------------------------------------------------------------------
    const fullDataPanel = new FullDataPanel( model );

    const followCenterOfMassButton = new TextPushButton( MySolarSystemStrings.followCenterOfMassStringProperty, {
      visibleProperty: model.userControlledProperty,
      listener: () => {
        model.systemCenteredProperty.value = true;
        model.userControlledProperty.value = false;
      },
      touchAreaXDilation: 5,
      touchAreaYDilation: SolarSystemCommonConstants.CHECKBOX_SPACING / 2,
      font: SolarSystemCommonConstants.PANEL_FONT,
      maxTextWidth: 200,
      baseColor: 'orange'
    } );

    const numberSpinnerTandem = model.isLab ? providedOptions.tandem.createTandem( 'numberSpinner' ) : Tandem.OPT_OUT;

    const numberSpinnerBox = new VBox( {
      children: [
        new Text( MySolarSystemStrings.dataPanel.bodiesStringProperty, combineOptions<TextOptions>( {
          maxWidth: 70
        }, SolarSystemCommonConstants.TEXT_OPTIONS ) ),
        new NumberSpinner( model.numberOfActiveBodiesProperty, new TinyProperty( new Range( 1, SolarSystemCommonConstants.NUM_BODIES ) ),
          combineOptions<NumberSpinnerOptions>( {}, {
            deltaValue: 1,
            touchAreaXDilation: 20,
            touchAreaYDilation: 10,
            mouseAreaXDilation: 10,
            mouseAreaYDilation: 5,
            numberDisplayOptions: {
              decimalPlaces: 0,
              align: 'center',
              xMargin: 10,
              yMargin: 3,
              textOptions: {
                font: new PhetFont( 28 )
              }
            }
          }, {
            arrowsPosition: 'bothRight',
            numberDisplayOptions: {
              yMargin: 10,
              align: 'right',
              scale: 0.8
            },
            accessibleName: MySolarSystemStrings.a11y.numberOfBodiesStringProperty
          } ) )
      ],
      visible: model.isLab,
      spacing: 5,
      tandem: numberSpinnerTandem
    } );

    const infoButtonTandem = model.isLab ? providedOptions.tandem.createTandem( 'unitsInfoButton' ) : Tandem.OPT_OUT;
    const moreDataCheckboxTandem = model.isLab ? providedOptions.tandem.createTandem( 'moreDataCheckbox' ) : Tandem.OPT_OUT;

    const dataPanelTopRow = new HBox( {
      stretch: true,
      visible: model.isLab,
      children: [
        new SolarSystemCommonCheckbox(
          model.moreDataProperty,
          new Text( MySolarSystemStrings.dataPanel.moreDataStringProperty, combineOptions<TextOptions>( {
            maxWidth: 300
          }, SolarSystemCommonConstants.TEXT_OPTIONS ) ),
          combineOptions<CheckboxOptions>( {
            accessibleName: MySolarSystemStrings.a11y.moreDataStringProperty,
            touchAreaXDilation: 10,
            touchAreaYDilation: 10,
            tandem: moreDataCheckboxTandem
          }, SolarSystemCommonConstants.CHECKBOX_OPTIONS )
        ),
        new InfoButton( {
          accessibleName: MySolarSystemStrings.a11y.infoStringProperty,
          scale: 0.5,
          iconFill: 'rgb( 41, 106, 163 )',
          touchAreaDilation: 20,
          listener: () => unitsDialog.show(),
          tandem: infoButtonTandem
        } )
      ]
    } );

    const notesStringProperty = new DerivedProperty( [
        MySolarSystemStrings.unitsInfo.contentStringProperty,
        MySolarSystemStrings.unitsInfo.content2StringProperty,
        MySolarSystemStrings.unitsInfo.content3StringProperty
      ],
      ( content, content2, content3 ) => {
        return content + '<br><br>' + content2 + '<br><br>' + content3;
      } );

    const unitsDialog = new Dialog( new RichText( notesStringProperty, { lineWrap: 600 } ), {
      titleAlign: 'center',
      title: new Text( MySolarSystemStrings.unitsInfo.titleStringProperty, { font: new PhetFont( 32 ) } ),
      tandem: providedOptions.tandem.createTandem( 'unitsDialog' )
    } );

    // Masses Panel --------------------------------------------------------------------------------------------
    const dataGridbox = new HBox( {
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: 'Data Panel',
      align: 'bottom',
      spacing: 10,
      children: [
        new VBox( {
          spacing: 3,
          stretch: true,
          children: [
            dataPanelTopRow,
            fullDataPanel
          ]
        } ),
        new HBox( {
          align: 'bottom',
          spacing: 10,
          children: [
            numberSpinnerBox,
            followCenterOfMassButton
          ]
        } )
      ]
    } );

    const controlsAlignBox = new AlignBox( dataGridbox, {
      alignBoundsProperty: this.availableBoundsProperty,
      margin: SolarSystemCommonConstants.MARGIN,
      xAlign: 'left',
      yAlign: 'bottom'
    } );

    const resetAlignBox = new AlignBox( this.resetAllButton, {
      alignBoundsProperty: this.availableBoundsProperty,
      margin: SolarSystemCommonConstants.MARGIN,
      xAlign: 'right',
      yAlign: 'bottom'
    } );

    const zoomButtonsBox = new AlignBox( zoomButtons, {
      alignBoundsProperty: this.availableBoundsProperty,
      margin: SolarSystemCommonConstants.MARGIN,
      xAlign: 'left',
      yAlign: 'top'
    } );

    const offScaleMessage = new Text( SolarSystemCommonStrings.offscaleMessageStringProperty,
      combineOptions<TextOptions>( {
          visibleProperty: DerivedProperty.and( [ model.gravityVisibleProperty, model.isAnyForceOffscaleProperty ] ),
          maxWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH * 2
        },
        SolarSystemCommonConstants.TEXT_OPTIONS )
    );
    const returnBodiesButton = new TextPushButton( MySolarSystemStrings.returnBodiesStringProperty, {
      visibleProperty: model.isAnyBodyEscapedProperty,
      listener: () => {
        model.returnEscapedBodies();
      },
      touchAreaXDilation: 5,
      touchAreaYDilation: 5,
      font: SolarSystemCommonConstants.PANEL_FONT,
      maxTextWidth: 190,
      containerTagName: 'div'
    } );

    const topCenterButtonBox = new AlignBox( new HBox( {
      spacing: 20,
      heightSizable: false,
      preferredHeight: returnBodiesButton.height,
      children: [ returnBodiesButton, offScaleMessage ]
    } ), {
      alignBoundsProperty: this.availableBoundsProperty,
      margin: SolarSystemCommonConstants.MARGIN,
      centerX: -checkboxesControlPanel.width / 2,
      xAlign: 'center',
      yAlign: 'top'
    } );

    this.interfaceLayer.addChild( topCenterButtonBox );
    this.interfaceLayer.addChild( resetAlignBox );
    this.interfaceLayer.addChild( controlsAlignBox );
    this.interfaceLayer.addChild( new AlignBox(
      topRightControlBox, {
        alignBoundsProperty: this.availableBoundsProperty,
        margin: SolarSystemCommonConstants.MARGIN,
        xAlign: 'right',
        yAlign: 'top'
      } ) );
    this.interfaceLayer.addChild( zoomButtonsBox );

    // ZoomBox should be first in the PDOM Order
    this.interfaceLayer.pdomOrder = [
      labModeComboBox,
      this.timeBox,
      topCenterButtonBox,
      dataGridbox,
      checkboxesControlPanel,
      zoomButtons,
      this.resetAllButton
    ];


    this.bottomLayer.addChild( new PathsCanvasNode( model.bodies, this.modelViewTransformProperty, this.visibleBoundsProperty, {
      visibleProperty: model.pathVisibleProperty
    } ) );

    mapPosition = ( point: Vector2, radius: number ) => {
      const mvt = this.modelViewTransformProperty.value;

      const expandToTop = ( bounds: Bounds2 ) => bounds.withMinY( this.layoutBounds.minY );
      const expandToBottom = ( bounds: Bounds2 ) => bounds.withMaxY( this.layoutBounds.maxY );
      const expandToLeft = ( bounds: Bounds2 ) => bounds.withMinX( this.visibleBoundsProperty.value.minX );
      const expandToRight = ( bounds: Bounds2 ) => bounds.withMaxX( this.visibleBoundsProperty.value.maxX );

      // Use visible bounds (horizontally) and layout bounds (vertically) to create the main shape
      const shape = Shape.bounds( mvt.viewToModelBounds( expandToLeft( expandToRight( this.layoutBounds ) ) ).eroded( radius ) )
        // Top-right controls
        .shapeDifference( Shape.bounds( mvt.viewToModelBounds( expandToTop( expandToRight( topRightControlBox.bounds ) ) ).dilated( radius ) ) )
        // Zoom buttons
        .shapeDifference( Shape.bounds( mvt.viewToModelBounds( expandToTop( expandToLeft( zoomButtons.bounds ) ) ).dilated( radius ) ) )
        // Reset all button
        .shapeDifference( Shape.bounds( mvt.viewToModelBounds( expandToBottom( expandToRight( this.resetAllButton.bounds ) ) ).dilated( radius ) ) )
        // Bottom-left controls, all with individual scopes (all expanded bottom-left)
        .shapeDifference( Shape.union( [
            dataPanelTopRow,
            fullDataPanel,
            numberSpinnerBox,
            followCenterOfMassButton
          ].map( item => {
            const viewBounds = expandToLeft( expandToBottom( this.boundsOf( item ) ) );
            const modelBounds = mvt.viewToModelBounds( viewBounds ).dilated( radius );
            return Shape.bounds( modelBounds );
          } ) ) );

      // Only show drag debug path if ?dev is specified, temporarily for https://github.com/phetsims/my-solar-system/issues/129
      if ( phet.chipper.queryParameters.dev ) {
        dragDebugPath.shape = mvt.modelToViewShape( shape );
      }

      if ( shape.containsPoint( point ) ) {
        return point;
      }
      else {
        return shape.getClosestPoint( point );
      }
    };
  }

  public override step( dt: number ): void {
    super.step( dt );

    this.bodyNodeSynchronizer.getViews().forEach( bodyNode => {
      if ( this.model.isPlayingProperty.value ) {
        bodyNode.playSound();
      }
      else {
        bodyNode.stopSound();
      }
    } );
  }
}

mySolarSystem.register( 'MySolarSystemScreenView', MySolarSystemScreenView );