// Copyright 2022, University of Colorado Boulder
/**
 * Visual Node for the Elliptical Orbit based on the Orbital Parameters
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { Shape } from '../../../../kite/js/imports.js';
import EllipticalOrbit from '../model/EllipticalOrbit.js';
import { Path } from '../../../../scenery/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { ReadOnlyProperty } from '../../../../axon/js/ReadOnlyProperty.js';
import Multilink, { UnknownMultilink } from '../../../../axon/js/Multilink.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

export default class EllipticalOrbitNode extends Path {
  private orbit: EllipticalOrbit;
  private shapeMultilink: UnknownMultilink;

  constructor( model: KeplersLawsModel, modelViewTransformProperty: ReadOnlyProperty<ModelViewTransform2> ) {
    super( new Shape(), {
      lineWidth: 3,
      stroke: 'fuchsia'
    } );

    const body = model.bodies[ 1 ];
    this.orbit = new EllipticalOrbit( body );
    const periapsis = new XNode( {
      fill: 'gold',
      stroke: 'white',
      center: Vector2.ZERO,
      visibleProperty: new DerivedProperty(
        [ model.periapsisVisibleProperty ], visible => {
        return visible && ( this.orbit.e > 0 );
      } )
    } );
    const apoapsis = new XNode( {
      fill: 'cyan',
      stroke: 'white',
      center: Vector2.ZERO,
      visibleProperty: new DerivedProperty(
        [ model.apoapsisVisibleProperty ], visible => {
        return visible && ( this.orbit.e > 0 );
      } )
    } );

    this.addChild( periapsis );
    this.addChild( apoapsis );

    this.shapeMultilink = Multilink.multilink(
      [ body.positionProperty, body.velocityProperty, modelViewTransformProperty ],
      ( position, velocity, modelViewTransform ) => {
        this.orbit.update();
        this.lineDash = this.orbit.allowedOrbit ? [ 0 ] : [ 5 ];

        const scale = modelViewTransform.modelToViewDeltaX( 1 );
        const a = this.orbit.a;
        const e = this.orbit.e;
        const c = e * a;
        const center = new Vector2( -c, 0 );
        const radiusX = scale * a;
        const radiusY = scale * Math.sqrt( a * a - c * c );

        this.translation = modelViewTransform.modelToViewPosition( center );
        this.rotation = 0;
        this.rotateAround( this.translation.add( center.times( -scale ) ), -this.orbit.w );
        this.shape = new Shape().ellipse( 0, 0, radiusX, radiusY, 0 );

        periapsis.center = new Vector2( scale * ( a * ( 1 - e ) + c ), 0 );
        apoapsis.center = new Vector2( -scale * ( a * ( 1 + e ) - c ), 0 );
    } );
  }
}

mySolarSystem.register( 'EllipticalOrbitNode', EllipticalOrbitNode );