import stageFright from 'stage-fright/src/js/lib/core';
import Editor from './editor';
import 'prismjs/components/prism-scss';

stageFright({
  navigation: {
    arrows: false,
  },
});

const editor = new Editor;

editor.run('.editor', {
  live: true,
});

// if (window.CSS) {
//   window.CSS.registerProperty({
//     name: '--registered-color',
//     syntax: '<color>',
//     inherits: false,
//     initialValue: 'rebeccapurple',
//   });
// }

if (window.paintWorklet) {
  window.paintWorklet.addModule('js/circle.not.min.js');
  window.paintWorklet.addModule('js/face.not.min.js');
}

// window.addEventListener('DOMContentLoaded', function() {
//   var editable = document.querySelectorAll('[contenteditable]');
//   var styles = [];

//   Array.prototype.forEach.call(editable, function(elem, i) {
//     elem.setAttribute('data-style-index', i);
//     elem.addEventListener('input', updateStyles);
//     elem.addEventListener('keypress', noArrows);
//     elem.addEventListener('keyup', noArrows);
//     elem.addEventListener('keydown', noArrows);

//     styles[i] = document.createElement('style');
//     styles[i].setAttribute('data-style-index', i);
//     styles[i].textContent = elem.textContent;
//     document.body.appendChild(styles[i]);
//   });

//   function noArrows(e) {
//     e.stopPropagation();
//   }

//   function updateStyles(e) {
//     var target = e.target
//     var i = target.getAttribute('data-style-index');
//     var style = document.querySelector('style[data-style-index="' + i + '"]');
//     style.textContent = target.textContent;
//   }
// });
