export default {
  'animated gradient': {
    name: 'Custom Properties - Animated Gradient',
    features: [
      'basic',
      'linear gradient',
      'transition',
    ],
    js: `CSS.registerProperty({
  name: '--registered',
  syntax: '<color>',
  inherits: true,
  initialValue: 'purple',
});`,
    css: `.registered {
--registered: #c0ffee;
  background: linear-gradient(white, var(--registered));
  transition: --registered 1s;
  height: 3em;
}

.registered:hover,
.registered:focus {
  --registered: #bada55;
}

.unregistered {
  --unregistered: #c0ffee;
  background: linear-gradient(white, var(--unregistered));
  transition: --unregistered 1s;
  height: 3em;
}

.unregistered:hover,
.unregistered:focus {
  --unregistered: #bada55;
}

button {
  width: 100%;
  cursor: pointer;
  font-size: 2em;
}

button + button {
  margin-top: 1em;
}`,
    html: `<button class="unregistered">
  Unregistered
</button>
<button class="registered">
  Registered
</buttom>`,
  }
};
