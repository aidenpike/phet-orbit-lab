// Copyright 2020-2022, University of Colorado Boulder

/**
 * @author Jonathan Olson
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import BodyNode from '../../common/view/BodyNode.js';

class MySolarSystemScreenView extends ScreenView {

  constructor( model: MySolarSystemModel, tandem: Tandem ) {
    assert && assert( model instanceof MySolarSystemModel, 'invalid model' );
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( {
      tandem: tandem
    } );

    model.bodies.forEach( body => {
      this.addChild( new BodyNode( body ) );
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - MySolarSystemConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - MySolarSystemConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Resets the view.
   */
  reset() {
    //TODO
  }

  override step( dt: number ) {
    //TODO
  }
}

mySolarSystem.register( 'MySolarSystemScreenView', MySolarSystemScreenView );
export default MySolarSystemScreenView;