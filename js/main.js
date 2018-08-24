import stageFright from 'stage-fright/src/js/lib/core';
import Editor from './editor';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-javascript';

stageFright({
  navigation: {
    arrows: false,
    spacebar: 'alt',
  },
  notes: 'alt',
});

const editor = new Editor;

editor.run('.editor', {
  live: true,
});

const borderColors = {
  '<color>+': {
    initial: 'currentcolor',
    items: [
      '--border-top-color',
      '--border-right-color',
      '--border-bottom-color',
      '--border-left-color',
    ],
  },
  '<number>': {
    initial: '0',
    items: [
      '--border-top-width',
      '--border-right-width',
      '--border-bottom-width',
      '--border-left-width',
    ],
  },
  '<length>': {
    initial: '20px',
    items: [
      '--corner-radius',
    ],
  },
  'bevel | scoop | round | notch | iphonex': {
    initial: 'scoop',
    items: [
      '--corner-shape',
    ],
  },
};

if (window.CSS) {
  window.CSS.registerProperty({
    name: '--registered-color',
    syntax: '<color>',
    inherits: false,
    initialValue: 'rebeccapurple',
  });

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

  for (const type in borderColors) {
    const item = borderColors[type];
    item.items.forEach(prop => {
      window.CSS.registerProperty({
        name: prop,
        syntax: type,
        inherits: false,
        initialValue: item.initial,
      });
    });
  }
}

if (window.CSS.paintWorklet) {
  CSS.paintWorklet.addModule('js/circle.not.min.js');
  CSS.paintWorklet.addModule('js/face.not.min.js');
  CSS.paintWorklet.addModule('js/warning.not.min.js');
  CSS.paintWorklet.addModule('js/corner.not.min.js');
  CSS.paintWorklet.addModule('js/brushstroke.not.min.js');
  CSS.paintWorklet.addModule('js/holman.not.min.js');
}

if (window.CSS.layoutWorklet) {
  CSS.layoutWorklet.addModule('js/blueprint.not.min.js');
}
