import StageFright from 'stage-fright/src/js/lib/init';
import REPL from './repl';

import propsSettings from './settings/props';
import paintSettings from './settings/paint';
import animationSettings from './settings/animation';
import layoutSettings from './settings/layout';

const stage = new StageFright('._stage');

const propsRepl = new REPL('#props-repl', propsSettings, 'props');
const paintRepl = new REPL('#paint-repl', paintSettings, 'paint');
const animationRepl = new REPL('#animation-repl', animationSettings, 'animation');
const layoutRepl = new REPL('#layout-repl', layoutSettings, 'layout');

//////////////////////////////
// Register Houdini Awesomeness to be used in actual presentation!
//////////////////////////////
if (window.CSS && CSS.registerProperty) {
  CSS.registerProperty({
    name: '--brush-color',
    syntax: '<color>',
    inherits: true,
    initialValue: '#784ca5',
  });

  CSS.registerProperty({
    name: '--offset',
    syntax: '<number>',
    inherits: true,
    initialValue: .25,
  });

  CSS.registerProperty({
    name: '--padding',
    syntax: '<number>',
    inherits: true,
    initialValue: 5,
  });

  CSS.registerProperty({
    name: '--art-color',
    syntax: '<color>',
    inherits: false,
    initialValue: 'white',
  });

  CSS.registerProperty({
    name: '--art-steps',
    syntax: '<number>',
    inherits: false,
    initialValue: 40,
  });

  CSS.registerProperty({
    name: '--art-alpha',
    syntax: '<number>',
    inherits: false,
    initialValue: 1,
  });

  CSS.registerProperty({
    name: '--prime-color',
    syntax: '<color>',
    inherits: true,
    initialValue: 'rebeccapurple',
  });
}

if (CSS.paintWorklet) {
  CSS.paintWorklet.addModule('js/paint/brushstroke.not.min.js');
  CSS.paintWorklet.addModule('js/paint/holman.not.min.js');
  CSS.paintWorklet.addModule('js/paint/switcher.not.min.js');
}

if (CSS.layoutWorklet) {
  CSS.layoutWorklet.addModule('js/layout/blueprint.not.min.js');
}
