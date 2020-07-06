import { Euler, Quaternion, Vector3 } from 'three'
import { Airplane } from '../aero/airplane'
import { PathFollow } from '../flightControl/path-follow'
import { Simulation } from './simulation';


export var Key = {
  _pressed: {},
  _listeners: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  A: 65,
  S: 83,
  X: 88,
  Z: 90,
  L: 76,
  P: 80,
  Q: 81,
  
  isDown: function(keyCode: number): boolean {
    return this._pressed[keyCode];
  },

  onKeydown: function(event: KeyboardEvent) {
    this._pressed[event.keyCode] = true;

    for (const key in this._listeners) {
      if (this._listeners.hasOwnProperty(key)) {
        if (event.keyCode.toString() == key) {
          this._listeners[key]()
        }
      }
    }
  },


  onKeyup: function(event: KeyboardEvent) {
    delete this._pressed[event.keyCode];
  },

  addListener: function(keyCode: number, func: () => void ) {
    this._listeners[keyCode] = func
  }

  
};



window.addEventListener('keydown', function(e) { Key.onKeydown(e) })
window.addEventListener('keyup', function(e) { Key.onKeyup(e) })

export class KeyAxis {
  upDown: number = 0
  leftRight: number = 0

  constructor(readonly speed: number) {}

  update(dt: number) {

    if (Key.isDown(Key.UP)) { this.upDown += this.speed * dt ; console.log("up called")}
    if (Key.isDown(Key.DOWN)) { this.upDown -= this.speed * dt ; console.log("down called") }
    if (Key.isDown(Key.LEFT)) { this.leftRight -= this.speed * dt ; console.log("left called")}
    if (Key.isDown(Key.RIGHT)) { this.leftRight += this.speed * dt ; console.log("right called")}
    //this.leftRight -= 0.3 * this.leftRight * dt
  }
}

export class Manual {
  on: boolean = false
  rudderLeftRight: number = 0
  elevatorUpDown: number = 0
  ;

  constructor(readonly increment:number) { this.setUpListener() }

  update() {

    if (Key.isDown(Key.UP)) { this.elevatorUpDown += this.increment ; console.log("elevator up called")}
    if (Key.isDown(Key.DOWN)) { this.elevatorUpDown -= this.increment; console.log("elevator down called")}
    if (Key.isDown(Key.LEFT)) { this.rudderLeftRight -= this.increment; console.log("ruddder left called")}
    if (Key.isDown(Key.RIGHT)) { this.rudderLeftRight += this.increment ; console.log("rudder right called")}
    console.log("rudder value: "+this.rudderLeftRight)
    console.log("elevator value: "+this.elevatorUpDown)
  }
  
  toggle() {
      this.on = !this.on
      console.log("manual called")
      //PathFollow.call(this.toggle)
  }

  setUpListener() {
      var self = this
      document.addEventListener('keydown', function (e) {
          var key = e.keyCode || e.which;
          if (key === 81) { // Toggle path follow on or off with Q
              self.toggle()
          }
      }, false);
  }
}

// // Returns a function, that, as long as it continues to be invoked, will not
// // be triggered. The function will be called after it stops being called for
// // N milliseconds. 
// export function debounce(func: Function, timeout?: number) {
//     let timer: number | undefined;
//     return (...args: any[]) => {
//         const next = () => func(...args);
//         if (timer) {
//             clearTimeout(timer);
//         }
//         timer = window.setTimeout(next, timeout > 0 ? timeout : 300);
//     };
// }

// // Pass in the callback that we want to throttle and the delay between throttled events
// export function throttle(callback: Function, delay:any) {
//   // Create a closure around these variables.
//   // They will be shared among all events handled by the throttle.
//   let throttleTimeout:any = null;
//   let storedEvent: any = null;

//   // This is the function that will handle events and throttle callbacks when the throttle is active.
//   const throttledEventHandler = (event: any) => {
//     // Update the stored event every iteration
//     storedEvent = event;

//     // We execute the callback with our event if our throttle is not active
//     const shouldHandleEvent = !throttleTimeout;

//     // If there isn't a throttle active, we execute the callback and create a new throttle.
//     if (shouldHandleEvent) {
//       // Handle our event
//       callback(storedEvent);

//       // Since we have used our stored event, we null it out.
//       storedEvent = null;

//       // Create a new throttle by setting a timeout to prevent handling events during the delay.
//       // Once the timeout finishes, we execute our throttle if we have a stored event.
//       throttleTimeout = window.setTimeout(() => {
//         // We immediately null out the throttleTimeout since the throttle time has expired.
//         throttleTimeout = null;

//         // If we have a stored event, recursively call this function.
//         // The recursion is what allows us to run continusously while events are present.
//         // If events stop coming in, our throttle will end. It will then execute immediately if a new event ever comes.
//         if (storedEvent) {
//           // Since our timeout finishes:
//           // 1. This recursive call will execute `callback` immediately since throttleTimeout is now null
//           // 2. It will restart the throttle timer, allowing us to repeat the throttle process
//           throttledEventHandler(storedEvent);
//         }
//       }, delay);
//     }
//   }

//   // Return our throttled event handler as a closure
//   return throttledEventHandler;
// }

// function throttle(func: Function, delay: number) {

//   let isThrottled = false,
//     savedArgs: any,
//     savedThis:boolean ;

//   function wrapper() {

//     if (isThrottled) { // (2)
//       savedArgs = arguments;
//       savedThis = this;
//       return;
//     }

//     func.apply(this, arguments); // (1)

//     isThrottled = true;

//     setTimeout(function() {
//       isThrottled = false; // (3)
//       if (savedArgs) {
//         wrapper.apply(savedThis, savedArgs);
//         savedArgs = savedThis = null;
//       }
//     }, delay);
//   }

//   return wrapper;
// }

export class Pause {
  on: boolean = false
  constructor() { this.setUpListener() }

  toggle() {
      this.on = !this.on
      console.log("pause called")
  }

  setUpListener() {
      var self = this
      document.addEventListener('keydown', function (e) {
          var key = e.keyCode || e.which;
          if (key === 80) { // Fixed error that resulted in pause not functioning when p is pressed
              self.toggle()
          }
      }, false);
  }
}

export function setUpListener(keyCode: number, action: () => void, caller: Object) {
  document.addEventListener('keydown', function (e) {
      var key = e.keyCode || e.which;
      if (key === keyCode) { // 81 q
          action.call(caller)
      }
  }, false);
}

export function updateDescriptionUI(airplane: Airplane, sim: Simulation, time: number) {
      let newDescription = ''
      newDescription += "apparent wind speed : " + sim.wind.getWind(time).clone().sub(airplane.velocity_NED).length().toFixed(1) + "<br />"
      newDescription += "velocity: " + airplane.velocity_NED.length().toFixed(1) + "<br />"

      newDescription += "alfa left wing: " + (airplane.aeroSurfaces["left"].alfa * 180 / Math.PI).toFixed(1) + "<br />"
      newDescription += "alfa verticalL wing : " + (airplane.aeroSurfaces["verticalL"].alfa * 180 / Math.PI).toFixed(1) + "<br />"
      newDescription += "thrust: " + airplane.thrust.toFixed(1) + "<br />"

      var euler = new Euler(0,0,0, 'ZYX')
      euler.setFromQuaternion(airplane.quaternion, 'ZYX')

      newDescription += "x: " + euler.x.toFixed(2) + "<br />"
      newDescription += "y: " + euler.y.toFixed(2) + "<br />"
      newDescription += "z: " + euler.z.toFixed(2) + "<br />"

      var px = airplane.position.x, pz = airplane.position.y
      var b = Math.atan2(airplane.position.z, px) * 180 / Math.PI
      var z = Math.atan2(airplane.position.y, Math.sqrt(px*px + pz+pz) ) * 180 / Math.PI

      newDescription += "<br />"
      newDescription += "b: " + b.toFixed(2) + "<br />"
      newDescription += "z: " + z.toFixed(2) + "<br />"

      newDescription += "<br />"
      newDescription += "rudder: " + (new Euler().setFromQuaternion(airplane.aeroSurfaces["rudder"].quaternion, 'XYZ').x * 180/Math.PI).toFixed(1) + "<br />" 
      newDescription += "elevator: " + (new Euler().setFromQuaternion(airplane.aeroSurfaces["elevator"].quaternion, 'XYZ').x * 180/Math.PI).toFixed(1) + "<br />"
      //newDescription += "angleError: " + pf.getAngleError().toFixed(1) + "<br />"
      // newDescription += "angleToPoint: " + Math.floor(pf.angleToPoint*180/Math.PI) + "<br />"
      // newDescription += "currentHeading: " + Math.floor(pf.currentHeading*180/Math.PI) + "<br />"
      newDescription += "<br />"
      newDescription += "time: "+time.toFixed(2) + "<br />"

      document.body.children.item(0).innerHTML = newDescription
}



export class PID {

  lastError: number = 0
  integrator: number = 0
  p: number
  i: number
  d: number
  ff: number = 0

  constructor(p: number, i: number, d: number, readonly iAbsMax: number){
    this.p = p
    this.i = i
    this.d = d
  }

  update(error: number, dt: number): number {
    
    this.integrator += error * dt
    this.integrator = Math.min( Math.max( this.integrator, -this.iAbsMax ), this.iAbsMax)

    let adjustment = this.p * error + 
      this.i * this.integrator +
      this.d * (error - this.lastError) / dt + this.ff

    this.lastError = error

    return adjustment
  }

  reset() {
    this.lastError = 0
    this.integrator = 0
  }
}