// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Agustín Vallejo
 */

 import mySolarSystem from '../../mySolarSystem.js';
 import Body from '../../common/model/Body.js';
 import Vector2 from '../../../../dot/js/Vector2.js';
 import Engine from '../../common/model/Engine.js';
 import MySolarSystemModel, { MySolarSystemModelOptions } from '../../common/model/MySolarSystemModel.js';
 import optionize from '../../../../phet-core/js/optionize.js';
 
 type LabModelOptions = Omit<MySolarSystemModelOptions, 'engineFactory'>;
 
 class LabModel extends MySolarSystemModel {
   constructor( providedOptions: LabModelOptions ) {
     const options = optionize<LabModelOptions, {}, MySolarSystemModelOptions>()( {
       engineFactory: bodies => new Engine( bodies )
     }, providedOptions );
     super( options );
   }
 
   repopulateBodies(): void {
     // Clear out the bodies array and create N new random bodies
     this.bodies.clear();
     this.bodies.push( new Body( 200, new Vector2( 0, 0 ), new Vector2( 0, -6 ) ) );
     this.bodies.push( new Body( 10, new Vector2( 150, 0 ), new Vector2( 0, 120 ) ) );
   }
 }
 
mySolarSystem.register( 'LabModel', LabModel );
export default LabModel;