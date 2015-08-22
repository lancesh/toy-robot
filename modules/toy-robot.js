module.exports = function(debug) {

  this.debug = debug;

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

  var position = {
    x:null,
    y:null,
    direction: null
  };

  var stdin = process.openStdin();
  stdin.on('data', readline);

  function readline(data) {
    // TODO: Unit test command processing

    if(data == null || typeof data == 'undefined')
      return;

    processCommand(data);
  }

  function processCommand(data) {
    var command = data.toString().trim().split(' ');
    var verb = command[0];

    switch(verb) {
      case COMMANDS.PLACE:
        place(command);
        break;
      case COMMANDS.MOVE:
        //TODO: Check there are no args
        move();
        break;
      case COMMANDS.LEFT:
        rotate(false);
        break;
      case COMMANDS.RIGHT:
        rotate(true);
        break;
      case COMMANDS.REPORT:
        report();
        break;
      default:
        log('Command ' + verb + ' not supported');
        break;
    }

    log(position);
  }

  function place(command) {
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
    if(!validatePosition(x, y)) {
      log('Position out of valid range');
      return new Error('Position out of valid range');
    }

    // Check for valid direction
    if(!validateDirection(z)) {
      log('Invalid direction');
      return new Error('Invalid direction');
    }

    log('Placing at ', x, y, z);
    position.x = x;
    position.y = y;
    position.direction = z;
  }

  function report() {
    // TODO: Allow the caller to specify the stream
    console.log(position.x + ',' + position.y + ',' + position.direction);
  }

  function move() {
    log('Moving ' + position.direction);

    var newX = position.x;
    var newY = position.y;

    switch(position.direction){
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

    if(validatePosition(newX, newY)) {
      position.x = newX;
      position.y = newY;
      return;
    }

    log('New position is out of range')
    return new Error("New positon is out of range");
  }

  function rotate(clockwise) {
    log('Rotating ' + (clockwise ? 'RIGHT' : 'LEFT'));

    var currentIndex = DIRECTIONS_CLOCKWISE.indexOf(position.direction);

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

    position.direction = DIRECTIONS_CLOCKWISE[currentIndex];
  }

  function validatePosition(x, y) {
    return (isInRange(x, RANGE_X.MIN, RANGE_X.MAX)
      && isInRange(y, RANGE_Y.MIN, RANGE_X.MAX));
  }

  function validateDirection(direction) {
    return DIRECTIONS_CLOCKWISE.indexOf(direction) != -1;
  }

  function isInRange(actual, min, max) {
    return (actual >= min && actual <= max);
  }

  function log(arg1, arg2, arg3) {
    if(this.debug) {
      console.log(arg1, arg2, arg3);
    }
  }
}
