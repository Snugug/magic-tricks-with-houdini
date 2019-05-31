export default {
  circle: {
    name: 'Circle',
    features: ['Draw basic shapes and style them with custom properties'],
    worklet: `registerPaint('circle', class {
  static get inputProperties() { return ['--circle-color']; }
  paint(ctx, size, properties) {
    // Get fill color from property
    const color = properties.get('--circle-color');

    // Determine the center point and radius.
    const xCircle = size.width / 2;
    const yCircle = size.height / 2;
    const radiusCircle = Math.min(xCircle, yCircle) - 2.5;

    // Draw the circle \o/
    ctx.beginPath();
    ctx.arc(xCircle, yCircle, radiusCircle, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
});`,
    js: `CSS.registerProperty({
  name: '--circle-color',
  syntax: '<color>',
  inherits: true,
  initialValue: 'red',
});`,
    css: `.circle {
  --circle-color: green;
  background-image: paint(circle);
  height: 80vh;
  width: 100vw;
}`,
    html: `<div class="circle"></div>`
  },
  'generative art': {
    name: 'Generative Art',
    features: ['Apply generative art principles to make dynamic backgrounds'],
    worklet: `// Based on the amazing work by Tim Holman (@twholman)
// https://www.youtube.com/watch?v=4Se0_w0ISYk&list=PLZriQCloF6GDuXF8RRPd1mIl9W2QXF-sQ&index=11

registerPaint('art', class {
  static get inputProperties() {
    return [
      '--art-color',
      '--art-steps',
      '--art-alpha'
    ];
  }


  draw(ctx, x, y, width, height) {
    const leftToRight = Math.random() >= 0.5;

    if( leftToRight ) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y + height);
    } else {
      ctx.moveTo(x + width, y);
      ctx.lineTo(x, y + height);
    }

    ctx.stroke();
  }

  paint(ctx, size, props) {
    const color = props.get('--art-color');
    const step = props.get('--art-steps');
    const alpha = props.get('--art-alpha');

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;

    const xsteps = Math.ceil(size.width / step.value);
    const ysteps = Math.ceil(size.height / step.value);

    const length = xsteps * ysteps;

    let height = 0;

    for (let x = 0; x < length; x++) {
      let xc = x;
      let y = height;
      if (x >= xsteps) {
        xc = x % xsteps;

        if (xc === 0) {
          height++;
          y = height;
        }
      }

      xc *= step.value;
      y *= step.value;

      this.draw(ctx, xc, y, step.value, step.value);
    }
  }
});`,
    js: `CSS.registerProperty({
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
});`,
    css: `h1 {
  --art-alpha: .15;
  --art-color: rgba(255, 255, 255, .25);
  /* Setting --art-steps below 20 will slow this to a crawl */
  --art-steps: 50;
  background-image: paint(art), linear-gradient(to right, blue, black);

  align-items: flex-end;
  box-sizing: border-box;
  color: white;
  display: flex;
  flex-direction: row-reverse;
  font-family: sans-serif;
  font-size: 3em;
  height: 80vh;
  line-height: 1;
  margin: 0;
  padding: .25em .5em;
  text-align: right;
  text-shadow: 1px 1px black, -1px 1px black;
}`,
    html: `<h1><span>Hello World</span></h1>`
  },
  animation: {
    name: 'Ripple Effect',
    features: ['Update properties in JavaScript to trigger the paint again, creating an animation effect'],
    worklet: `/* Example from https://github.com/GoogleChromeLabs/houdini-samples/tree/master/paint-worklet/ripple */

registerPaint('ripple', class {
    static get inputProperties() {
      return [
        'background-color',
        '--ripple-color',
        '--animation-tick',
        '--ripple-x',
        '--ripple-y'
      ];
    }

    paint(ctx, geom, properties) {
      const bgColor = properties.get('background-color');
      const rippleColor = properties.get('--ripple-color');
      const x = properties.get('--ripple-x');
      const y = properties.get('--ripple-y');
      let tick = properties.get('--animation-tick');

      if (tick < 0) {
        tick = 0;
      } else if (tick > 1000) {
        tick = 1000;
      }

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, geom.width, geom.height);
      ctx.fillRect(0, 0, geom.width, geom.height);

      ctx.fillStyle = rippleColor;
      ctx.globalAlpha = 1 - tick/1000;
      ctx.arc(
        x, y, // center
        geom.width * tick/1000, // radius
        0, // startAngle
        2 * Math.PI //endAngle
      );
      ctx.fill();
    }
});

/*
Copyright 2016 Google, Inc. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/`,
    js: `CSS.registerProperty({
  name: '--ripple-color',
  syntax: '<color>',
  inherits: true,
  initialValue: 'purple',
});

CSS.registerProperty({
  name: '--ripple-y',
  syntax: '<number>',
  inherits: true,
  initialValue: 0,
});

CSS.registerProperty({
  name: '--ripple-x',
  syntax: '<number>',
  inherits: true,
  initialValue: 0,
});

CSS.registerProperty({
  name: '--animation-tick',
  syntax: '<number>',
  inherits: true,
  initialValue: 0,
});

const button = document.querySelector('#ripple');
button.addEventListener('click', evt => {
  const [x, y] = [evt.clientX, evt.clientY];
  button.style.cssText = \`--ripple-x: \${x}; --ripple-y: \${y}\`;
  button.classList.add('animating');
  const duration = evt.target.computedStyleMap().get('transition-duration');
  let time = duration.value;
  if (duration.unit === 's') {
    time *= 1000;
  }

  setTimeout(() => {
    button.classList.remove('animating');
  }, time);
})`,
    css: `#ripple {
  width: 300px;
  height: 300px;
  border-radius: 150px;
  font-size: 5em;
  background-color: rgb(255,64,129);
  border: 0;
  box-shadow: 0 1px 1.5px 0 rgba(0,0,0,.12),0 1px 1px 0 rgba(0,0,0,.24);
  color: white;
  --ripple-x: 0;
  --ripple-y: 0;
  --ripple-color: rgba(255,255,255,0.54);
  --animation-tick: 0;
  background-image: paint(ripple);
  
}
#ripple:focus {
  outline: none;
}
#ripple.animating {
  --animation-tick: 1000;
  transition: --animation-tick .5s ease-in;
}`,
    html: `<button id="ripple">
  Click me!
</button>`
  }
};
