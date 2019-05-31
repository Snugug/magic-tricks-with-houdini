export default {
  'centered blocks': {
    name: 'Centered Blocks',
    features: ['A simple stacking of elements centered in their parent'],
    worklet: `registerLayout('block-like', class {
  static get inputProperties() {
    return ['--gap'];
  }

  *intrinsicSizes(children, edges, styleMap) {
    const childrenSizes = yield children.map((child) => {
      return child.intrinsicSizes();
    });

    const maxContentSize = childrenSizes.reduce((max, childSizes) => {
      return Math.max(max, childSizes.maxContentSize);
    }, 0);

    const minContentSize = childrenSizes.reduce((max, childSizes) => {
      return Math.max(max, childSizes.minContentSize);
    }, 0);

    return {maxContentSize, minContentSize};
  }

  *layout(children, edges, constraints, styleMap) {
    const availableInlineSize = constraints.fixedInlineSize;
    const availableBlockSize = constraints.fixedBlockSize;

    const childConstraints = { availableInlineSize, availableBlockSize };

    const childFragments = yield children.map((child) => {
      return child.layoutNextFragment(childConstraints);
    });

    let blockOffset = 0;
    for (let fragment of childFragments) {
      // Position the fragment in a block like manner, centering it in the
      // inline direction
      fragment.blockOffset = blockOffset;
      fragment.inlineOffset = (availableInlineSize - fragment.inlineSize) / 2;

      blockOffset += fragment.blockSize + styleMap.get('--gap').value;
    }

    const autoBlockSize = blockOffset;

    return {
      autoBlockSize,
      childFragments,
    };
  }
});`,
    js: `CSS.registerProperty({
  name: '--gap',
  syntax: '<number>',
  inherits: false,
  initialValue: 5,
});`,
    css: `.parent {
  display: layout(block-like);
  --gap: 10;
}

.one {
  border: 2px solid red;
}

.two {
  border: 2px dashed orange;
}

.three {
  border: 2px solid yellow;
}

.four {
  border: 2px dashed green;
}

.five {
  border: 2px solid blue;
}

.block {
  height: 25vh;
  display: flex;
  justify-items: vertical;
  align-items: center;
}
`,
    html: `<div class="parent">
  <div class="block one">Hello</div>
  <div class="block two">World</div>
  <div class="block three">How</div>
  <div class="block four">Are</div>
  <div class="block five">You?</div>
</div>`
  },
  circle: {
    name: 'Circular Layout',
    features: ['Arrange any number of items in a circle'],
    worklet: `registerLayout(
  'circle',
  class {
    static get inputProperties() {
      return ['--item-size', '--padding', '--angle'];
    }

    *intrinsicSizes() {}
    *layout(children, edges, constraints, styleMap) {
      const childFragments = yield children.map(child => {
        return child.layoutNextFragment({
          fixedInlineSize: styleMap.get('--item-size')
        });
      });

      const items = childFragments.length;
      const angle = 360 / items;
      const offset = ((90 - styleMap.get('--angle').value) * Math.PI) / 180;

      const θ = (angle * Math.PI) / 180;
      const p = styleMap.get('--padding').value;
      const r = styleMap.get('--item-size').value + p;

      let autoBlockSize = 0;
      const blockStack = [0];
      for (const [i, childFragment] of childFragments.entries()) {
        const x = r * Math.cos(θ * i - offset);
        const y = r * Math.sin(θ * i - offset);

        childFragment.inlineOffset = x + constraints.fixedInlineSize / 2 - childFragment.inlineSize / 2;
        childFragment.blockOffset = y + r;

        if (y >= blockStack[blockStack.length - 1]) {
          autoBlockSize = y + r;
          blockStack.push(y);
        }
      }

      return { autoBlockSize, childFragments };
    }
  }
);

/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */`,
    js: `CSS.registerProperty({
  name: '--item-size',
  syntax: '<number>',
  inherits: true,
  initialValue: 32
});

CSS.registerProperty({
  name: '--angle',
  syntax: '<number>',
  inherits: true,
  initialValue: 0
});

CSS.registerProperty({
  name: '--padding',
  syntax: '<number>',
  inherits: true,
  initialValue: 5
});`,
    css: `.circle-layout {
  --item-size: 32;
  --padding: 32;
  --angle: 0;
  display: layout(circle);
}`,
    html: `<div class="circle-layout">
  <p>1</p>
  <p>2</p>
  <p>3</p>
  <p>4</p>
  <p>5</p>
  <p>6</p>
</div>`
  },
  masonry: {
    name: 'Masonry',
    features: ["C'mon! Masonry with adjustable columns and padding"],
    worklet: `// From https://github.com/GoogleChromeLabs/houdini-samples

registerLayout('masonry', class {
  static get inputProperties() {
    return [ '--padding', '--columns' ];
  }

  *intrinsicSizes() { /* TODO implement :) */ }
  *layout(children, edges, constraints, styleMap) {
    const inlineSize = constraints.fixedInlineSize;

    const padding = parseInt(styleMap.get('--padding'));
    const columnValue = styleMap.get('--columns');

    // We also accept 'auto', which will select the BEST number of columns.
    let columns = parseInt(columnValue);
    if (columnValue == 'auto' || !columns) {
      columns = Math.ceil(inlineSize / 350); // MAGIC NUMBER \o/.
    }

    // Layout all children with simply their column size.
    const childInlineSize = (inlineSize - ((columns + 1) * padding)) / columns;
    const childFragments = yield children.map((child) => {
      return child.layoutNextFragment({fixedInlineSize: childInlineSize});
    });

    let autoBlockSize = 0;
    const columnOffsets = Array(columns).fill(0);
    for (let childFragment of childFragments) {
      // Select the column with the least amount of stuff in it.
      const min = columnOffsets.reduce((acc, val, idx) => {
        if (!acc || val < acc.val) {
          return {idx, val};
        }

        return acc;
      }, {val: +Infinity, idx: -1});

      childFragment.inlineOffset = padding + (childInlineSize + padding) * min.idx;
      childFragment.blockOffset = padding + min.val;

      columnOffsets[min.idx] = childFragment.blockOffset + childFragment.blockSize;
      autoBlockSize = Math.max(autoBlockSize, columnOffsets[min.idx] + padding);
    }

    return {autoBlockSize, childFragments};
  }
});

/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */`,
    js: `CSS.registerProperty({
  name: '--padding',
  syntax: '<number>',
  inherits: false,
  initialValue: 0,
});

CSS.registerProperty({
  name: '--columns',
  syntax: '<number> | auto',
  inherits: false,
  initialValue: 'auto',
});`,
    css: `body {
  display: layout(masonry);
  --padding: 10;
  --columns: 3;
  counter-reset: images;
}

img {
  width: 100%;
  height: auto;
}

.counter {
  position: relative;
}

.counter:before {
  counter-increment: images;
  content: counter(images);
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 50%;
  background-color: black;
  color: white;
  position: absolute;
  top: -.5rem;
  left: -.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: .9em;
}

`,
    html: `
<div class="counter">
  <img src="https://picsum.photos/200/100" alt="Placeholder Images" />
</div>
<div class="counter">
  <img src="https://picsum.photos/200/200" alt="Placeholder Images" />
</div>
<div class="counter">
  <img src="https://picsum.photos/200/250" alt="Placeholder Images" />
</div>
<div class="counter">
  <img src="https://picsum.photos/200/300" alt="Placeholder Images" />
</div>
<div class="counter">
  <img src="https://picsum.photos/200/400" alt="Placeholder Images" />
</div>
<div class="counter">
  <img src="https://picsum.photos/200/175" alt="Placeholder Images" />
</div>
<div class="counter">
  <img src="https://picsum.photos/200/120" alt="Placeholder Images" />
</div>
<div class="counter">
  <img src="https://picsum.photos/200/210" alt="Placeholder Images" />
</div>
<div class="counter">
  <img src="https://picsum.photos/200/325" alt="Placeholder Images" />
</div>
<div class="counter">
  <img src="https://picsum.photos/200/275" alt="Placeholder Images" />
</div>

<div class="counter">
  <img src="https://picsum.photos/200/135" alt="Placeholder Images" />
</div>
<div class="counter">
  <img src="https://picsum.photos/200/230" alt="Placeholder Images" />
</div>
<div class="counter">
  <img src="https://picsum.photos/200/280" alt="Placeholder Images" />
</div>
<div class="counter">
  <img src="https://picsum.photos/200/310" alt="Placeholder Images" />
</div>
<div class="counter">
  <img src="https://picsum.photos/200/450" alt="Placeholder Images" />
</div>
<div class="counter">
  <img src="https://picsum.photos/200/190" alt="Placeholder Images" />
</div>
<div class="counter">
  <img src="https://picsum.photos/200/115" alt="Placeholder Images" />
</div>
<div class="counter">
  <img src="https://picsum.photos/200/240" alt="Placeholder Images" />
</div>
<div class="counter">
  <img src="https://picsum.photos/200/355" alt="Placeholder Images" />
</div>
<div class="counter">
  <img src="https://picsum.photos/200/260" alt="Placeholder Images" />
</div>
`
  }
};
