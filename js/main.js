import StageFright from 'stage-fright';
import Editor from './repl/editor';
import './components/tab.js';

const stage = new StageFright('._stage');

new Editor().run('.editor', {
  live: true
});

//////////////////////////////
// Register Houdini Awesomeness to be used in actual presentation!
//////////////////////////////
if (window.CSS && CSS.registerProperty) {
  CSS.registerProperty({
    name: '--brush-color',
    syntax: '<color>',
    inherits: true,
    initialValue: '#784ca5'
  });

  CSS.registerProperty({
    name: '--offset',
    syntax: '<number>',
    inherits: true,
    initialValue: 0.25
  });

  CSS.registerProperty({
    name: '--padding',
    syntax: '<number>',
    inherits: true,
    initialValue: 5
  });

  CSS.registerProperty({
    name: '--art-color',
    syntax: '<color>',
    inherits: false,
    initialValue: 'white'
  });

  CSS.registerProperty({
    name: '--art-steps',
    syntax: '<number>',
    inherits: false,
    initialValue: 40
  });

  CSS.registerProperty({
    name: '--art-alpha',
    syntax: '<number>',
    inherits: false,
    initialValue: 1
  });

  CSS.registerProperty({
    name: '--prime-color',
    syntax: '<color>',
    inherits: true,
    initialValue: 'rebeccapurple'
  });

  CSS.registerProperty({
    name: '--theme-color',
    syntax: 'blue|green|red|yellow|grey',
    inherits: true,
    initialValue: 'blue'
  });

  CSS.registerProperty({
    name: '--theme-background-type',
    syntax: 'footer|divider',
    inherits: false,
    initialValue: 'divider'
  });
}

function tabClick(e) {
  const active = document.querySelectorAll('rounded-tab[data-active]');
  for (const a of active) {
    delete a.dataset.active;
  }

  e.target.dataset.active = true;
}

const previewTabs = document.querySelectorAll('rounded-tab');
for (const tab of previewTabs) {
  tab.addEventListener('click', tabClick);
}

window.addEventListener('load', () => {
  if (CSS.paintWorklet) {
    CSS.paintWorklet.addModule('js/paint/brushstroke.not.min.js');
    CSS.paintWorklet.addModule('js/paint/holman.not.min.js');
    CSS.paintWorklet.addModule('js/paint/switcher.not.min.js');
    CSS.paintWorklet.addModule('js/paint/theme.not.min.js');
  }

  if (CSS.layoutWorklet) {
    CSS.layoutWorklet.addModule('js/layout/blueprint.not.min.js');
  }

  const replGoodness = [import('./settings/props'), import('./settings/paint'), import('./settings/animation'), import('./settings/layout'), import('./repl')];

  const repls = [
    {
      id: '#props-repl',
      type: 'props'
    },
    {
      id: '#paint-repl',
      type: 'paint'
    },
    {
      id: '#animation-repl',
      type: 'animation'
    },
    {
      id: '#layout-repl',
      type: 'layout'
    }
  ];

  Promise.all(replGoodness).then(items => {
    const REPL = items.pop().default;
    repls.forEach((example, i) => {
      new REPL(example.id, items[i].default, example.type);
    });
  });
});
