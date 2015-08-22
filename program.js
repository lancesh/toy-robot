var ToyRobot = require('./modules/toy-robot');

var debug = process.argv[2] === 'true';

var myrobot = new ToyRobot(
{
  debug: debug,
  log: console.log
});

var stdin = process.openStdin();
stdin.on('data', readline);

function readline(data) {
  if(data == null || typeof data == 'undefined')
    return;

  var output = myrobot.processCommand(data);
  if(output != null)
    console.log(output);
}
