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

if (window.CSS) {
  window.CSS.registerProperty({
    name: '--registered-color',
    syntax: '<color>',
    inherits: false,
    initialValue: 'rebeccapurple',
  });
}

if (window.CSS.paintWorklet) {
  window.CSS.paintWorklet.addModule('js/circle.not.min.js');
  window.CSS.paintWorklet.addModule('js/face.not.min.js');
}
