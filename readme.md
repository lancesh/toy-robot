Toy Robot
---------

A command line application for a Toy Robot.

**Commands**
- PLACE X,Y,F
- MOVE
- LEFT
- RIGHT
- REPORT

To install run:
```
npm install
```

To run unit tests:
```
mocha
```

To run program from the command line:
```
node program.js
```

To run program with debugging output:
```
node program.js true
```

Example:
```
node program.js
PLACE 0,0,NORTH
MOVE
REPORT
Output: 0,1,NORTH
```
