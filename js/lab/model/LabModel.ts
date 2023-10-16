// Copyright 2022-2023, University of Colorado Boulder

/**
 * Model that controls the logic for the Lab Screen.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import OrbitalSystem from './OrbitalSystem.js';
import MySolarSystemModel from '../../common/model/MySolarSystemModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import BodyInfo from '../../../../solar-system-common/js/model/BodyInfo.js';

export default class LabModel extends MySolarSystemModel {

  // The OrbitalSystem that is currently selected
  public readonly orbitalSystemProperty: EnumerationProperty<OrbitalSystem>;

  // Maps an OrbitalSystem to the BodyInfo[] that describes the configuration of Bodies in that system
  private readonly orbitalSystemMap: Map<OrbitalSystem, BodyInfo[]>;

  public constructor( tandem: Tandem ) {
    super( {
      // MySolarSystemModelOptions
      defaultBodyInfo: [
        new BodyInfo( { isActive: true, mass: 250, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -11.1 ) } ),
        new BodyInfo( { isActive: true, mass: 25, position: new Vector2( 200, 0 ), velocity: new Vector2( 0, 111 ) } ),
        new BodyInfo( { isActive: false, mass: 0.1, position: new Vector2( 100, 0 ), velocity: new Vector2( 0, 150 ) } ),
        new BodyInfo( { isActive: false, mass: 0.1, position: new Vector2( -100, -100 ), velocity: new Vector2( 120, 0 ) } )
      ],
      isLab: true,
      tandem: tandem
    } );

    this.orbitalSystemProperty = new EnumerationProperty( OrbitalSystem.SUN_PLANET, {
      tandem: tandem.createTandem( 'orbitalSystemProperty' )
    } );

    this.orbitalSystemProperty.lazyLink( mode => {
      if ( mode !== OrbitalSystem.CUSTOM ) {
        this.userControlledProperty.value = true;
        this.clearPaths();
      }
    } );

    this.userInteractingEmitter.addListener( () => {
      this.orbitalSystemProperty.value = OrbitalSystem.CUSTOM;
    } );

    this.orbitalSystemMap = new Map<OrbitalSystem, BodyInfo[]>();
    this.initializeModeMap();

    this.orbitalSystemProperty.link( mode => {
      if ( mode !== OrbitalSystem.CUSTOM ) {
        this.isPlayingProperty.value = false;
        this.hasPlayedProperty.value = false;
        this.userControlledProperty.value = false;
        this.isAnyBodyCollidedProperty.reset();
        this.timeProperty.reset();
        const modeInfo = this.orbitalSystemMap.get( mode );
        this.loadBodyInfo( modeInfo! );
        this.numberOfActiveBodiesProperty.value = this.activeBodies.length;
        this.followCenterOfMass();
        this.saveStartingBodyInfo();
        this.forceScaleProperty.reset();

        if ( mode === OrbitalSystem.FOUR_STAR_BALLET ) {
          this.forceScaleProperty.value = -1.1;
        }
      }
    } );

    this.numberOfActiveBodiesProperty.link( numberOfActiveBodies => {
      if ( numberOfActiveBodies !== this.activeBodies.length ) {
        this.isPlayingProperty.value = false;
        this.orbitalSystemProperty.value = OrbitalSystem.CUSTOM;
        if ( numberOfActiveBodies > this.activeBodies.length ) {
          this.addNextBody();
        }
        else {
          this.removeLastBody();
        }
      }
    } );
  }

  public override reset(): void {
    super.reset();

    // Change the Lab Mode briefly to custom so the reset actually triggers the listeners.
    // If this is not done, orbitalSystemProperty listeners (including the one added in the constructor above) won't be called.
    this.orbitalSystemProperty.value = OrbitalSystem.CUSTOM;
    this.orbitalSystemProperty.reset();

    this.userControlledProperty.reset();
    super.restart();
  }

  /**
   * Initializes the keys and values for this.orbitalSystemMap.
   */
  private initializeModeMap(): void {
    this.orbitalSystemMap.set( OrbitalSystem.SUN_PLANET, [
      new BodyInfo( { isActive: true, mass: 250, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -11.1 ) } ),
      new BodyInfo( { isActive: true, mass: 25, position: new Vector2( 200, 0 ), velocity: new Vector2( 0, 111 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.SUN_PLANET_MOON, [
      new BodyInfo( { isActive: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) } ),
      new BodyInfo( { isActive: true, mass: 10, position: new Vector2( 160, 0 ), velocity: new Vector2( 0, 120 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( 140, 0 ), velocity: new Vector2( 0, 53 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.SUN_PLANET_COMET, [
      new BodyInfo( { isActive: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) } ),
      new BodyInfo( { isActive: true, mass: 1, position: new Vector2( 150, 0 ), velocity: new Vector2( 0, 120 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( -220, 130 ), velocity: new Vector2( -20, -35 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.TROJAN_ASTEROIDS, [
      new BodyInfo( { isActive: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) } ),
      new BodyInfo( { isActive: true, mass: 5, position: new Vector2( 150, 0 ), velocity: new Vector2( 0, 119 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( 75, -130 ), velocity: new Vector2( 103, 60 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( 75, 130 ), velocity: new Vector2( -103, 60 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.ELLIPSES, [
      new BodyInfo( { isActive: true, mass: 250, position: new Vector2( -200, 0 ), velocity: new Vector2( 0, 0 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( -115, 0 ), velocity: new Vector2( 0, 151 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( 50, 0 ), velocity: new Vector2( 0, 60 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( 220, 0 ), velocity: new Vector2( 0, 37 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.HYPERBOLIC, [
      new BodyInfo( { isActive: true, mass: 250, position: new Vector2( 0, 25 ), velocity: new Vector2( 0, 0 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( -250, -70 ), velocity: new Vector2( 120, 0 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( -250, -140 ), velocity: new Vector2( 120, 0 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( -250, -210 ), velocity: new Vector2( 120, 0 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.SLINGSHOT, [
      new BodyInfo( { isActive: true, mass: 200, position: new Vector2( 1, 0 ), velocity: new Vector2( 0, -1 ) } ),
      new BodyInfo( { isActive: true, mass: 10, position: new Vector2( 131, 55 ), velocity: new Vector2( -55, 115 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( -6, -128 ), velocity: new Vector2( 83, 0 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.DOUBLE_SLINGSHOT, [
      new BodyInfo( { isActive: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -1 ) } ),
      new BodyInfo( { isActive: true, mass: 5, position: new Vector2( 0, -112 ), velocity: new Vector2( 134, 0 ) } ),
      new BodyInfo( { isActive: true, mass: 5, position: new Vector2( 186, -5 ), velocity: new Vector2( 1, 111 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( 70, 72 ), velocity: new Vector2( -47, 63 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.BINARY_STAR_PLANET, [
      new BodyInfo( { isActive: true, mass: 150, position: new Vector2( -100, 0 ), velocity: new Vector2( 0, -60 ) } ),
      new BodyInfo( { isActive: true, mass: 120, position: new Vector2( 100, 0 ), velocity: new Vector2( 0, 50 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( -50, 0 ), velocity: new Vector2( 0, 120 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.FOUR_STAR_BALLET, [
      new BodyInfo( { isActive: true, mass: 120, position: new Vector2( -100, 100 ), velocity: new Vector2( -50, -50 ) } ),
      new BodyInfo( { isActive: true, mass: 120, position: new Vector2( 100, 100 ), velocity: new Vector2( -50, 50 ) } ),
      new BodyInfo( { isActive: true, mass: 120, position: new Vector2( 100, -100 ), velocity: new Vector2( 50, 50 ) } ),
      new BodyInfo( { isActive: true, mass: 120, position: new Vector2( -100, -100 ), velocity: new Vector2( 50, -50 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.DOUBLE_DOUBLE, [
      new BodyInfo( { isActive: true, mass: 60, position: new Vector2( -115, -3 ), velocity: new Vector2( 0, -154 ) } ),
      new BodyInfo( { isActive: true, mass: 70, position: new Vector2( 102, 0 ), velocity: new Vector2( 1, 150 ) } ),
      new BodyInfo( { isActive: true, mass: 55, position: new Vector2( -77, -2 ), velocity: new Vector2( -1, 42 ) } ),
      new BodyInfo( { isActive: true, mass: 62, position: new Vector2( 135, 0 ), velocity: new Vector2( -1, -52 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.CUSTOM, [
      new BodyInfo( { isActive: true, mass: 120, position: new Vector2( -100, 100 ), velocity: new Vector2( -50, -50 ) } ),
      new BodyInfo( { isActive: true, mass: 120, position: new Vector2( 100, 100 ), velocity: new Vector2( -50, 50 ) } ),
      new BodyInfo( { isActive: true, mass: 120, position: new Vector2( 100, -100 ), velocity: new Vector2( 50, 50 ) } ),
      new BodyInfo( { isActive: true, mass: 120, position: new Vector2( -100, -100 ), velocity: new Vector2( 50, -50 ) } )
    ] );
  }
}

mySolarSystem.register( 'LabModel', LabModel );