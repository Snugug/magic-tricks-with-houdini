import Editor from './editor.js';

export default class {
  constructor(target, options, type) {
    this.target = target;
    this.parent = document.querySelector(target) ;
    this.options = options;
    this.type = type;
    this.optKeys = Object.keys(options);
    this.inputEvent = new Event(`input`, {
      bubbles: true,
      cancelable: true,
    });
    this.active = this.optKeys[0];
    this.repl = {};

    this.switcherOptions = ['worklet', 'js', 'css', 'html'];

    this.buildREPL();
  }

  buildREPL() {
    // Build Elements
    const menu = document.createElement('div');

    const replSwitcher = document.createElement('select');
    const replTitle = document.createElement('h4');
    const replFeatures = document.createElement('p');

    const workletEditor = document.createElement('div');
    const jsEditor = document.createElement('div');
    const cssEditor = document.createElement('div');
    const htmlEditor = document.createElement('div');

    menu.classList.add('repl--menu');
    replTitle.classList.add('repl--title');
    replFeatures.classList.add('repl--features');
    replSwitcher.classList.add('repl--switcher');
    workletEditor.classList.add('repl--editor');
    workletEditor.setAttribute('data-language', 'worklet');
    jsEditor.classList.add('repl--editor');
    jsEditor.setAttribute('data-language', 'js');
    cssEditor.classList.add('repl--editor');
    cssEditor.setAttribute('data-language', 'css');
    htmlEditor.classList.add('repl--editor');
    htmlEditor.setAttribute('data-language', 'markup');

    // Build Menu
    const menuItems = {};

    for (const key of this.optKeys) {
      menuItems[key] = document.createElement('button');
      menuItems[key].classList.add('repl--menu-item');
      menuItems[key].setAttribute('data-type', key);
      menuItems[key].textContent = key;
      menuItems[key].addEventListener('click', this.menuHandler());
      menu.appendChild(menuItems[key]);
    }

    // Props Edits
    if (this.type === 'props') {
      jsEditor.style.zIndex = 100;
      this.switcherOptions.shift();
    } else {
      workletEditor.style.zIndex = 100;
    }

    // Build Switcher
    for (const key of this.switcherOptions) {
      const so = document.createElement('option');
      so.value = key;
      so.text = key;
      replSwitcher.appendChild(so);
    }

    replSwitcher.addEventListener('input', this.swapEditors());

    // Add items to DOM
    this.parent.classList.add('repl');
    this.parent.appendChild(menu);
    this.parent.appendChild(replTitle);
    this.parent.appendChild(replFeatures);
    this.parent.appendChild(replSwitcher);
    if (this.type !== 'props') {
      this.parent.appendChild(workletEditor);
    }
    this.parent.appendChild(jsEditor);
    this.parent.appendChild(cssEditor);
    this.parent.appendChild(htmlEditor);

    // Set up Editors
    const editor = new Editor;
    editor.run(`${this.target} .repl--editor`, {
      live: false,
    });

    const editors = {
      worklet: workletEditor.querySelector('.editor--textarea'),
      js: jsEditor.querySelector('.editor--textarea'),
      css: cssEditor.querySelector('.editor--textarea'),
      html: htmlEditor.querySelector('.editor--textarea'),
    }

    if (this.type === 'props') {
      delete editors.worklet;
    }

    this.repl.editors = editors;
    this.repl.switcher = replSwitcher;
    this.repl.title = replTitle;
    this.repl.features = replFeatures;
    this.repl.menu = this.parent.querySelectorAll('.repl--menu-item');
    this.repl.previous = null;

    this.resetEditors(this.active);
  }

  resetEditors(base) {
    const selected = this.options[base];

    this.repl.title.innerText = selected.name;
    this.repl.features.innerText = selected.features.join(', ');

    // Set the active menu item
    for (const menuItem of this.repl.menu) {
      delete menuItem.dataset.active;
      if (menuItem.dataset.type === base) {
        menuItem.dataset.active = true;
        this.active = base;
      }
    }

    let activateKey = '';

    for (const key in selected) {
      if (this.repl.editors[key]) {
        this.repl.editors[key].value = selected[key];
        this.repl.editors[key].addEventListener('input', this.replPreview());
        this.repl.editors[key].dispatchEvent(this.inputEvent);
      }
    }
  }

  swapEditors() {
    const repl = this.repl;

    return function(e) {
      const val = e.target.value;

      for (const key in repl.editors) {
        if (key === val) {
          repl.editors[key].closest('.repl--editor').style.zIndex = 100;
        } else {
          repl.editors[key].closest('.repl--editor').style.zIndex = 0;
        }
      }
    }
  }

  menuHandler() {
    const self = this;

    return function(e) {
      console.log(self.repl);
      const target = e.target;
      const switchType = target.getAttribute('data-type');

      self.resetEditors(switchType);

      if (self.type !== 'props') {
        self.repl.switcher.value = 'worklet';
      } else {
        self.repl.switcher.value = 'js';
      }

      self.repl.switcher.dispatchEvent(self.inputEvent);
    }
  }

  replPreview() {
    const repl = this.repl;
    const parent = this.parent;
    const type = this.type;

    return function() {
      const vals = {};

      // Get Editor Values
      for (const editor in repl.editors) {
        vals[editor] = repl.editors[editor].value;
      }

      // Build HTML
      let html = `<head><style>${vals.css}</style>`;

      // Only include JS directly if we're doing Custom Properties
      if (type === 'props') {
        html += `<script type="text/javascript">${vals.js}</script></head>`;
      } else {
        html += `<script language="worklet">
            ${vals.worklet}
          </script>
          <script type="module">
          // In-page Worklet pattern from @DasSurma
          // https://glitch.com/edit/#!/aw-bug-hunt?path=delay.html:39:0
          function blobWorklet() {
            const src = document.querySelector('script[language="worklet"]').innerHTML;
            const blob = new Blob([src], {type: 'text/javascript'});
            return URL.createObjectURL(blob);
          }

          async function init() {
            await CSS.${type}Worklet.addModule(blobWorklet());

            ${vals.js}
          }

          init();

          </script>
        </head>`;
      }

      html += `<body>${vals.html}</body>`;

      // Load it in
      window.requestAnimationFrame(() => {
        if (repl.previous) {
          repl.previous.remove();
        }
        const preview = document.createElement('iframe');
        preview.classList.add('repl--preview');
        parent.appendChild(preview);
        preview.contentWindow.document.open();
        preview.contentWindow.document.write(html);
        preview.contentWindow.document.close();

        repl.previous = preview;
      });
    }
  }
}
