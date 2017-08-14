'use strict';

const armadillo = require('gulp-armadillo/config');

armadillo.tasks.watch[0].push('copy:js:watch');
armadillo.tasks.copy[0].push('copy:js');

module.exports = armadillo;
