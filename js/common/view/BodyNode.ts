// Copyright 2021-2022, University of Colorado Boulder

/**
 * Visible Body Node that draws a sphere with size dependent on the Body's mass.
 *
 * @author Agustín Vallejo
 */

import { DragListener, PressListenerEvent } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import Body from '../model/Body.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from '../../../../scenery-phet/js/ShadedSphereNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { AbstractProperty } from '../../../../axon/js/AbstractProperty.js';
import Multilink, { UnknownMultilink } from '../../../../axon/js/Multilink.js';

type BodyNodeOptions = ShadedSphereNodeOptions;

export default class BodyNode extends ShadedSphereNode {
  public body: Body;
  public initialMass: number;
  private somethingMultilink: UnknownMultilink;

  constructor( body: Body, modelViewTransformProperty: AbstractProperty<ModelViewTransform2>, providedOptions?: BodyNodeOptions ) {
    const options = optionize<BodyNodeOptions, {}, ShadedSphereNodeOptions>()( {
      cursor: 'pointer'
    }, providedOptions );

    super( 1, options );

    this.body = body;
    this.initialMass = 200; //body.massProperty.value;
    
    this.somethingMultilink = Multilink.multilink(
      [ body.positionProperty, body.massProperty, modelViewTransformProperty ],
      ( position, mass, modelViewTransform ) => {
        this.translation = modelViewTransform.modelToViewPosition( position );
        this.setScaleMagnitude( this.massToScale( mass, modelViewTransform.modelToViewDeltaX( 1 ) ) );
    } );

    let PointerDistanceFromCenter: Vector2 | null = null;

    const dragListener = new DragListener( {
      start: ( event: PressListenerEvent ) => {
        PointerDistanceFromCenter = modelViewTransformProperty.value.viewToModelPosition( this.globalToParentPoint( event.pointer.point ) ).minus( this.body.positionProperty.value );
      },
      drag: ( event: PressListenerEvent ) => {
        body.positionProperty.value = modelViewTransformProperty.value.viewToModelPosition( this.globalToParentPoint( event.pointer.point ) ).minus( PointerDistanceFromCenter! );
      }
    } );
    this.addInputListener( dragListener );
  }

  private massToScale( mass: number, scale: number ): number {
    return scale * 20 * mass / this.initialMass + 5;
  }

  override dispose(): void {
    this.somethingMultilink.dispose();
    super.dispose();
  }
}

mySolarSystem.register( 'BodyNode', BodyNode );