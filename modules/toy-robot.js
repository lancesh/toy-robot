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

function ToyRobot(debug) {
  this.debug = debug;

  this.position = {
    x:null,
    y:null,
    direction: null
  };

  this.place = function (command) {
    // PLACE X,Y,F
    var args = command[1].split(',');
    var x = Number(args[0]);
    var y = Number(args[1]);
    var z = args[2];

    // Check for NaN
    if(isNaN(x) || isNaN(y)) {
      log('Invalid input');
      return new Error('Invalid Input');
    }

    // Check for valid position
    if(!this.validatePosition(x, y)) {
      this.log('Position out of valid range');
      return new Error('Position out of valid range');
    }

    // Check for valid direction
    if(!this.validateDirection(z)) {
      this.log('Invalid direction');
      return new Error('Invalid direction');
    }

    this.log('Placing at ', x, y, z);
    this.position.x = x;
    this.position.y = y;
    this.position.direction = z;
  }

  this.report = function() {
    // TODO: Allow the caller to specify the stream
    //console.log(position.x + ',' + position.y + ',' + position.direction);
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
        return new Error("Invalid Direction");
    }

    if(this.validatePosition(newX, newY)) {
      this.position.x = newX;
      this.position.y = newY;
      return;
    }

    this.log('New position is out of range')
    return new Error("New positon is out of range");
  }

  this.rotate = function(clockwise) {
    this.log('Rotating ' + (clockwise ? 'RIGHT' : 'LEFT'));

    var currentIndex = DIRECTIONS_CLOCKWISE.indexOf(this.position.direction);

    if(currentIndex == -1)     {
      // TODO: Use / display
      return new Error("Cannot rotate. Direction not set");
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

  this.log = function(arg1, arg2, arg3) {
    if(this.debug) {
      console.log(arg1, arg2, arg3);
    }
  }
}

// class methods
ToyRobot.prototype.processCommand = function(data) {

  var command = data.toString().trim().split(' ');
  var verb = command[0];

  switch(verb) {
    case COMMANDS.PLACE:
      this.place(command);
      break;
    case COMMANDS.MOVE:
      //TODO: Check there are no args
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
      break;
    default:
      this.log('Command ' + verb + ' not supported');
      break;
  }
  return;
}

module.exports = ToyRobot;
