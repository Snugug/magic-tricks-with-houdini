registerPaint('circle', class {
    static get inputProperties() { return ['--circle-color']; }
    paint(ctx, geom, properties) {
	// Change the fill color.
	const circle = properties.get('--circle-color').cssText;

	// Determine the center point and radius.
	const xCircle = geom.width / 2;
	const yCircle = geom.height / 2;
	const radiusCircle = Math.min(xCircle, yCircle) - 2.5;

	// Draw the circle \o/
	ctx.beginPath();
	ctx.arc(xCircle, yCircle, radiusCircle, 0, 2 * Math.PI);
	ctx.fillStyle = circle;
	ctx.fill();
    }
});
