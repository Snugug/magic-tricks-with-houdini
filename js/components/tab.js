if ('CSS' in window) {
  if ('registerProperty' in CSS) {
    CSS.registerProperty({
      name: '--tab-multiplier',
      syntax: '<number>',
      inherits: true,
      initialValue: 1
    });

    CSS.registerProperty({
      name: '--tab-position',
      syntax: 'left|right|middle',
      inherits: false,
      initialValue: 'middle'
    });
  }

  if ('paintWorklet' in CSS) {
    function tabWorklet() {
      const src = `registerPaint("TabBottom",class{static get inputProperties(){return["background-color","border-image-outset","--tab-multiplier","--tab-position"]}paint(e,t,i){const o=i.get("background-color"),l=parseInt(i.get("border-image-outset").toString()),r=i.get("--tab-multiplier").value,a=i.get("--tab-position").value,n=10*r,g=5.6*r;if("right"===a||"middle"===a){const i=t.height-l-n,r=l-n;e.beginPath(),e.moveTo(0+r,n+i),e.lineTo(n+r,n+i),e.lineTo(n+r,0+i),e.bezierCurveTo(n+r,g+i,g+r,n+i,0+r,n+i),e.closePath(),e.fillStyle=o,e.fill()}if("left"===a||"middle"===a){const i=t.height-l-n,r=t.width-l;e.beginPath(),e.moveTo(n+r,n+i),e.lineTo(0+r,n+i),e.lineTo(0+r,0+i),e.bezierCurveTo(0+r,g+i,g+r,n+i,n+r,n+i),e.closePath(),e.fillStyle=o,e.fill()}}});`;
      const blob = new Blob([src], { type: 'text/javascript' });
      return URL.createObjectURL(blob);
    }

    CSS.paintWorklet.addModule(tabWorklet());

    const tabTemplate = `<style>.tab{--tab-border-radius:calc(5px * var(--tab-multiplier));--tab-border-offset:calc(30px * var(--tab-multiplier));background:red;border-image-outset:var(--tab-border-offset);border-image-slice:0 fill;border-image-source:paint(TabBottom);border-radius:var(--tab-border-radius) var(--tab-border-radius) 0 0;display:inline-block;font-size:1em;padding:.25em .5em;box-sizing:border-box}</style><div class=tab part=body><slot></slot></div>`;

    class RoundedTab extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' }).innerHTML = tabTemplate;
      }
    }

    customElements.define('rounded-tab', RoundedTab);
  }
}
