(function (Flowtime) {
  'use strict';

  Flowtime.enableNavigation(true, true, false, true);

  // Show Progress Bar
  Flowtime.showProgress(true);

  // Use Clicker
  Flowtime.clicker(true);

  Flowtime.setTransitionTime(350);

  Flowtime.start();

}(window.Flowtime));


if (window.CSS) {
  window.CSS.registerProperty({
    name: '--registered-color',
    syntax: '<color>',
    inherits: false,
    initialValue: 'rebeccapurple',
  });
}

if (window.paintWorklet) {
  window.paintWorklet.import('js/circle.js');
  window.paintWorklet.import('js/smile.js');
}

window.addEventListener('DOMContentLoaded', function() {
  var editable = document.querySelectorAll('[contenteditable]');
  var styles = [];

  Array.prototype.forEach.call(editable, function(elem, i) {
    elem.setAttribute('data-style-index', i);
    elem.addEventListener('input', updateStyles);
    elem.addEventListener('keypress', noArrows);
    elem.addEventListener('keyup', noArrows);
    elem.addEventListener('keydown', noArrows);

    styles[i] = document.createElement('style');
    styles[i].setAttribute('data-style-index', i);
    styles[i].textContent = elem.textContent;
    document.body.appendChild(styles[i]);
  });

  function noArrows(e) {
    e.stopPropagation();
  }

  function updateStyles(e) {
    var target = e.target
    var i = target.getAttribute('data-style-index');
    var style = document.querySelector('style[data-style-index="' + i + '"]');
    style.textContent = target.textContent;
  }
});
