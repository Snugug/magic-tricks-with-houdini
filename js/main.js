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
  '<custom-ident>': {
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
  window.CSS.paintWorklet.addModule('js/circle.not.min.js');
  window.CSS.paintWorklet.addModule('js/face.not.min.js');
  window.CSS.paintWorklet.addModule('js/warning.not.min.js');
  window.CSS.paintWorklet.addModule('js/corner.not.min.js');
}
