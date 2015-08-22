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
});
