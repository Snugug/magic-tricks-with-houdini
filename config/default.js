'use strict';

const armadillo = require('gulp-armadillo/config');

armadillo.tasks.watch[0].push('copy:js:watch');
armadillo.tasks.copy[0].push('copy:js');
armadillo.tasks.build.push('clean:deploy:html');
armadillo.sw.browser.include = false;

module.exports = armadillo;
