Effort of exposing low0-level primitaves of CSS in the browser


Most mature
  - CSS Paint API


Typed Object Model
  - CSS API is currently just strings
  - TOM gives types for these things
  - new CSS

`element.styleMap.set('opacity', new CSSNumberValue(0.5))`
`element.styleMap.set('height', new CSSSimpleLength(50, 'px')`

`.get().value //50`
`.get().type //px`

`CSSSimpleLength().subtract(new CSSNumberValue)`

```javascript
const h = new CSSSimpleLength(50, 'vh').subtract(new CSSSimpleValue(20, 'px'));

$('#element').styleMap.set('height', h) // h === calc(50vh - 20px)
```

Available in Chrome Canary. Animation using this can improve animation up to 80%. Enable experimental web platform flags

Color is so crazy, skipped in version 1 of spec

---

Composited Scrolling & Animation

Animation Worklet (new name)

- Animation dependent on scroll position
  - Can do by listening to scroll event and updating. Dispatched ASYNC, single thread, will all feel slugish/janky
- Can do complex animations with lots of inputs, including scroll
- `will-change: transform` - Gets own graphics card layer/buffer. Can move around efficiently
  - Allows you to easily maintain 60FPS by putting things that get animated on separate frame


 ```css
 :root {
  animator-root: parallax
 }

 .bg {
  animator: parallax
 }
 ```

 ```html
 <div class="bg" style="--parallax-ratio: .2"></div>
 <div class="bg" style="--parallax-ratio: .5"></div>
 ```

 - Runs in separate thread!
 - Animation worklette and compositor runs in separate threads but sync up

https://github.com/googlechrome/houdini-samples

---

CSS Paint API

- Can generate images dynamically
- Kinda like Canvas, but more rich and much lighter
- Write-only canvas and has dimensions of element
- Save number of DOM nodes (use a default image until image's loaded)

bit.ly/houdini-updates

http://ishoudinireadyyet.com/

Parser API is where custom at rules will likely come it


- Surma Surma Google
