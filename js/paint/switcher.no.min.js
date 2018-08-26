registerPaint('replswitcher', class {
  static get inputProperties() {
    return [
      '--switcher-bkg',
      'color',
    ];
  }

  paint(ctx, size, props) {
    const bkg = props.get('--switcher-bkg');
    const color = props.get('color');

    const x = size.width / 75.8333;
    const y = size.height / 20;

    // Background
    ctx.beginPath();
    ctx.moveTo(72.9 * x, 0.0 * y);
    ctx.lineTo(8.7 * x, 0.0 * y);
    ctx.bezierCurveTo(7.1 * x, 0.0 * y, 5.8 * x, 1.3 * y, 5.8 * x, 2.9 * y);
    ctx.lineTo(5.8 * x, 14.2 * y);
    ctx.bezierCurveTo(5.8 * x, 17.4 * y, 3.2 * x, 20.0 * y, 0.0 * x, 20.0 * y);
    ctx.lineTo(5.8 * x, 20.0 * y);
    ctx.lineTo(75.8 * x, 20.0 * y);
    ctx.lineTo(75.8 * x, 2.9 * y);
    ctx.bezierCurveTo(75.8 * x, 1.3 * y, 74.5 * x, 0.0 * y, 72.9 * x, 0.0 * y);
    ctx.closePath();
    ctx.fillStyle = bkg;
    ctx.fill();


    // Arrow
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(64.1 * x, 6.5 * y);
    ctx.lineTo(67.6 * x, 13.5 * y);
    ctx.lineTo(71.1 * x, 6.5 * y);
    ctx.lineTo(64.1 * x, 6.5 * y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }
});
