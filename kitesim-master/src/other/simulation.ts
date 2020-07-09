import * as THREE from 'three';
import { Vector3, ArrowHelper, Quaternion } from 'three';
import { Airplane, AirplaneOptions, KX40 } from  '../aero/airplane';
import { Tether, TetherOptions, tetherPropertiesKX40 } from './tether';
import { ForceMoment, Wind, WindStatic, WindTimeseries } from "./util";
import { ControllerOptions, FlightControlellerType, getFlightController, FlightModeControllerInterface } from "../flightControl/flight-mode-controller"
import { VTOL_TransitionAlgo } from '../flightControl/vtol';


export  interface SimConfig {
    airplane: AirplaneOptions,
    airplaneOrientation: Quaternion
    tether: TetherOptions,  
    controller: ControllerOptions,
    wind: {
        static?: Vector3
        timeSeries?: {
            dt: number
            wind: Vector3[]
        }
    }
}
// Added timeSeries test code *may need further testing*

export let defaultConfig40: SimConfig =  {
    airplane: KX40,  //SuperQuad,  //KX4, //airplaneOptionsFromJSON(airplaneJSON), // Aircraft,  //
    airplaneOrientation: new Quaternion(),
	tether: tetherPropertiesKX40,
	controller: { 
        velocitySp: 40,
        type: FlightControlellerType.Default,
        radius: 40,
        angle: 40,
    },
    // This function controls the static wind in the simulation ie when you expect a given wind condition to be essentially stable over a set flight you can simply set a static vector
    // to represent it.
    // Note that the meteorological wind direction is the direction where the wind comes while the vector points in the opposite direction 
    // ie. a south wind is blowing means its vector heads to the north direction
    // for a north wind the vector input should be (negative magnitude ,0,0)
    // for a south wind the vector input should be (positive magnitude ,0,0)
    // for a east wind the vector input should be (0, negative magnitude ,0)
    // for a west wind the vector input should be (0, positive magnitude ,0)
	wind:  {
        static: new Vector3(12, 0, 0 )
        
        //timeSeries: {
        // wind:[new Vector3(12,0,0)],
        // dt: 1
    // }
    }
    

}


export class Simulation {

    airplane: Airplane
    tether: Tether 
    tetherForceArrow = new ArrowHelper( new Vector3() )
    flightModeController: FlightModeControllerInterface
    wind: Wind
    windArrow = new ArrowHelper( new Vector3()) // this was added to attempt to visualize the wind value
    
    constructor(simConfig: SimConfig) {
        this.airplane = new Airplane( simConfig.airplane )
        let tp = simConfig.tether
        this.airplane.position.copy( tp.origin.clone().add(tp.direction.clone().multiplyScalar(tp.totalLength)) )
        this.airplane.applyQuaternion(simConfig.airplaneOrientation)
        this.tether = new Tether(simConfig.tether, this.airplane.getAttachmentPointsState())
        this.flightModeController = getFlightController(simConfig.controller, this.airplane, tp)
        this.airplane.external_mass = this.tether.getKiteTetherMass()
        
        if (simConfig.wind.static != undefined) {
            this.wind = new WindStatic(simConfig.wind.static)
        }

        if (simConfig.wind.timeSeries != undefined) {
            this.wind = new WindTimeseries(simConfig.wind.timeSeries.wind, simConfig.wind.timeSeries.dt)
        }

        this.tetherForceArrow.position.copy(tp.origin)
        this.tetherForceArrow.visible = false
       // Turns wind visualization on or off
        this.windArrow.visible = false
        this.windArrow.position.copy(tp.origin)
        
    }

    updateUI() {
        if (this.tether.FSpring[0] != undefined) {
            this.tetherForceArrow.setDirection(this.tether.FSpring[0].clone().normalize())
            this.tetherForceArrow.setLength(this.tether.FSpring[0].length())
        }

        // Set the position of the boxes showing the tether.
        this.tether.updateUI()
        this.flightModeController.updateUI() 
       
    }

    update(dt: number, time: number){
        dt = dt // can be used for adjusting the animation speed
        dt = Math.min(dt, 0.03) // max timestep of 0.03 seconds
       
        // increase the amount of numerical integrations for each frame. 
        // Especially increase the stability of the tether calculations
        var subFrameIterations = 32
        let dtSub = dt/subFrameIterations
    
        for (var k = 0; k < subFrameIterations; k++) {
            this.tether.updateStateBasedOnKitePosition(this.airplane.getAttachmentPointsState())
            this.tether.updateForcesAndPosition(dtSub, this.wind.getWind(time))
            // remove FCupdate to below
            let moment = this.flightModeController.getMoment(dtSub) 
            // let moment = new Vector3() //

             // This is an attempt at visualizing the wind vector.
            this.windArrow.setDirection(this.wind.getWind(time).clone().normalize())
            this.windArrow.setLength(this.wind.getWind.length)
            
            this.airplane.update(dtSub, this.wind.getWind(time), 
                this.airplane.getForceMomentAttachment(this.tether.kiteTetherForces_NED())
                .add(new ForceMoment( new Vector3(), moment))
            )
        }

        this.flightModeController.update(dt) // with sideeffects. 
        this.flightModeController.adjustThrust(dt)
        this.flightModeController.autoAdjustMode()


    }

    getUIObjects(): THREE.Object3D[] {
        return [(<THREE.Object3D>this.airplane), this.tetherForceArrow]
            .concat(this.tether.getUIObjects())
            .concat(this.flightModeController.getUIObjects())
    }
}



