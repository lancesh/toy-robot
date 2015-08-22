var extend = require('extend');

// A few constants
// Note: I realise these are not truly constant, but unit testing
// should ensure they are not accidentially modified by the application

var COMMANDS = {
  PLACE: 'PLACE',
  MOVE: 'MOVE',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  REPORT: 'REPORT'
};

var DIRECTIONS = {
  NORTH: 'NORTH',
  SOUTH: 'SOUTH',
  EAST: 'EAST',
  WEST: 'WEST'
}

var DIRECTIONS_CLOCKWISE = [
  DIRECTIONS.NORTH,
  DIRECTIONS.EAST,
  DIRECTIONS.SOUTH,
  DIRECTIONS.WEST
];

var TURNS = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
}

var RANGE_X = {MIN:0,MAX:5};
var RANGE_Y = {MIN:0,MAX:5};

function ToyRobot(options) {

  var defaultOptions = {
    debug: false,
    log: null
  };

  this.options = extend({}, defaultOptions, options);

  this.position = {
    x:null,
    y:null,
    direction: null
  };

  // Expects a command in the format "PLACE X,Y,F"
  this.place = function (command) {

    if(command.length != 2)
      return;

    var args = command[1].split(',');
    if(args.length != 3) {
      this.log('Not enough arguments');
      return;
    }

    var x = parseInt(args[0]);
    var y = parseInt(args[1]);
    var z = args[2];

    // Check for NaN
    if(isNaN(x) || isNaN(y)) {
      this.log('Invalid input');
      return;
    }

    // Check for valid position
    if(!this.validatePosition(x, y)) {
      this.log('Position out of valid range');
      return;
    }

    // Check for valid direction
    if(!this.validateDirection(z)) {
      this.log('Invalid direction');
      return;
    }

    this.log('Placing at ', x, y, z);
    this.position.x = x;
    this.position.y = y;
    this.position.direction = z;
  }

  this.report = function() {
    return this.position.x + ',' + this.position.y + ',' + this.position.direction;
  }

  this.move = function() {
    this.log('Moving ' + this.position.direction);

    var newX = this.position.x;
    var newY = this.position.y;

    switch(this.position.direction){
      case DIRECTIONS.NORTH:
        newY += 1;
        break;
      case DIRECTIONS.SOUTH:
        newY -= 1;
        break;
      case DIRECTIONS.EAST:
        newX += 1;
        break;
      case DIRECTIONS.WEST:
        newX -= 1;
        break;
      default:
        this.log("Invalid Direction");
        return;
    }

    if(this.validatePosition(newX, newY)) {
      this.position.x = newX;
      this.position.y = newY;
      return;
    }

    this.log('New position is out of range')
    return;
  }

  this.rotate = function(clockwise) {
    this.log('Rotating ' + (clockwise ? 'RIGHT' : 'LEFT'));

    var currentIndex = DIRECTIONS_CLOCKWISE.indexOf(this.position.direction);

    if(currentIndex == -1) {
      this.log('Cannot rotate. Direction not set');
      return;
    }

    if(clockwise) {
      currentIndex = (currentIndex == DIRECTIONS_CLOCKWISE.length-1)
        ? 0
        : currentIndex+1;
    } else {
      currentIndex = (currentIndex == 0)
        ? DIRECTIONS_CLOCKWISE.length-1
        : currentIndex-1;
    }

    this.position.direction = DIRECTIONS_CLOCKWISE[currentIndex];
  }

  this.validatePosition = function(x, y) {
    return (this.isInRange(x, RANGE_X.MIN, RANGE_X.MAX)
      && this.isInRange(y, RANGE_Y.MIN, RANGE_X.MAX));
  }

  this.validateDirection = function(direction) {
    return DIRECTIONS_CLOCKWISE.indexOf(direction) != -1;
  }

  this.isInRange = function(actual, min, max) {
    return (actual >= min && actual <= max);
  }

  // Set up logging
  if(this.options.debug) {
    if(typeof this.options.log == 'function') {
      this.log = this.options.log;
    } else {
      this.log = console.log;
    }
  } else {
    this.log = function() {};
  }
}

// class methods
ToyRobot.prototype.processCommand = function(data) {

  if(data == null) {
    return;
  }
  // Being a little lenient with leading/trailing whitespace
  var command = data.toString().trim().split(' ');
  var verb = command[0];

  // PLACE is always allowed
  if(verb == COMMANDS.PLACE) {
    this.place(command);
  }

  // If position has not been set then no further commands can be received
  if(this.position.x == null)
    return;

  // The remaining commands must have no arguments
  if(command.length != 1)
    return;

  switch(verb) {
    case COMMANDS.MOVE:
      this.move();
      break;
    case COMMANDS.LEFT:
      this.rotate(false);
      break;
    case COMMANDS.RIGHT:
      this.rotate(true);
      break;
    case COMMANDS.REPORT:
      return this.report();
    default:
      this.log('Command ' + verb + ' not supported');
      break;
  }
  return;
}

module.exports = ToyRobot;
