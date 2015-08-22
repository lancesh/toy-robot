var assert = require("assert");
var ToyRobot = require('../modules/toy-robot');

describe('ToyRobot', function() {
  describe('#processCommand()', function () {
    it('should match test1', function () {
      var thisRobot = new ToyRobot();
      thisRobot.processCommand('PLACE 0,0,NORTH');
      thisRobot.processCommand('MOVE');
      var output = thisRobot.processCommand('REPORT');
      assert.equal(output, '0,1,NORTH')
    });
  });

  describe('#processCommand()', function () {
    it('should match test2', function () {
      var thisRobot = new ToyRobot();
      thisRobot.processCommand('PLACE 0,0,NORTH');
      thisRobot.processCommand('LEFT');
      var output = thisRobot.processCommand('REPORT');
      assert.equal(output, '0,0,WEST')
    });
  });

  describe('#processCommand()', function () {
    it('should match test3', function () {
      var thisRobot = new ToyRobot();
      thisRobot.processCommand('PLACE 1,2,EAST');
      thisRobot.processCommand('MOVE');
      thisRobot.processCommand('MOVE');
      thisRobot.processCommand('LEFT');
      thisRobot.processCommand('MOVE');
      var output = thisRobot.processCommand('REPORT');
      assert.equal(output, '3,3,NORTH')
    });
  });

  describe('#processCommand()', function () {
    it('should not allow invalid command', function () {
      var thisRobot = new ToyRobot();
      attemptInvalidCommand(thisRobot, null,null);
      attemptInvalidCommand(thisRobot, 'asd',null);
      attemptInvalidCommand(thisRobot, 'MOVE 123',null);
    });
  });

  describe('#processCommand()', function () {
    it('should not change position on invalid command', function () {
      var thisRobot = new ToyRobot();
      attemptInvalidCommand(thisRobot, 'asd',null);
      attemptInvalidCommand(thisRobot, 'MOVE 123',null);
      thisRobot.processCommand('PLACE 0,0,NORTH');
      attemptInvalidCommand(thisRobot, 'asd','0,0,NORTH');
      attemptInvalidCommand(thisRobot, 'MOVE 123','0,0,NORTH');
      thisRobot.processCommand('MOVE');
      attemptInvalidCommand(thisRobot, 'asd','0,1,NORTH');
      attemptInvalidCommand(thisRobot, 'MOVE 123','0,1,NORTH');
    });
  });

  describe('#processCommand()', function () {
    it('should not allow out of range NORTH', function () {
      attemptMoveOutOfRange('5,5,NORTH');
      attemptMoveOutOfRange('0,5,NORTH');
    });
  });

  describe('#processCommand()', function () {
    it('should not allow out of range SOUTH', function () {
      attemptMoveOutOfRange('0,0,SOUTH');
      attemptMoveOutOfRange('5,0,SOUTH');
    });
  });

  describe('#processCommand()', function () {
    it('should not allow out of range EAST', function () {
      attemptMoveOutOfRange('5,5,EAST');
      attemptMoveOutOfRange('5,0,EAST');
    });
  });

  describe('#processCommand()', function () {
    it('should not allow out of range WEST', function () {
      attemptMoveOutOfRange('0,0,WEST');
      attemptMoveOutOfRange('0,5,WEST');
    });
  });

  describe('#processCommand()', function () {
    it('should not allow any command before PLACE', function () {
      var thisRobot = new ToyRobot();
      thisRobot.processCommand('MOVE');
      var output = thisRobot.processCommand('REPORT');
      assert.equal(output, null)
    });
  });

  describe('#processCommand()', function () {
    it('should not allow invalid command', function () {
      var thisRobot = new ToyRobot();
      thisRobot.processCommand('PLACE 0,0,NORTH');
      thisRobot.processCommand('DUMMY');
      var output = thisRobot.processCommand('REPORT');
      assert.equal(output, '0,0,NORTH')
    });
  });

  describe('#processCommand()', function () {
    it('should not allow placing out of range', function () {
      var thisRobot = new ToyRobot();
      thisRobot.processCommand('PLACE 6,0,NORTH');
      assert.equal(thisRobot.processCommand('REPORT'), null)
      thisRobot.processCommand('PLACE -1,0,NORTH');
      assert.equal(thisRobot.processCommand('REPORT'), null)
      thisRobot.processCommand('PLACE 0,6,NORTH');
      assert.equal(thisRobot.processCommand('REPORT'), null)
      thisRobot.processCommand('PLACE 0,-1,NORTH');
      assert.equal(thisRobot.processCommand('REPORT'), null)
    });
  });

  describe('#processCommand()', function () {
    it('should not allow invalid values', function () {
      attemptInvalidPlace('x,0,NORTH',null);
      attemptInvalidPlace(',0,NORTH',null);
      attemptInvalidPlace('0,x,NORTH',null);
      attemptInvalidPlace('0,,NORTH',null);
      attemptInvalidPlace('',null);
      attemptInvalidPlace('0,0,XX',null);
    });
  });

  function attemptMoveOutOfRange(start) {
    var thisRobot = new ToyRobot();
    thisRobot.processCommand('PLACE ' + start);
    thisRobot.processCommand('MOVE');
    var output = thisRobot.processCommand('REPORT');
    assert.equal(output, start)
  }

  function attemptInvalidPlace(place, expected) {
    var thisRobot = new ToyRobot();
    thisRobot.processCommand('PLACE ' + place);
    var output = thisRobot.processCommand('REPORT');
    assert.equal(output, expected)
  }

  function attemptInvalidCommand(thisRobot, command, expected) {
    thisRobot.processCommand(command);
    var output = thisRobot.processCommand('REPORT');
    assert.equal(output, expected)
  }
});
