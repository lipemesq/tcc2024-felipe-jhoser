function HSVtoRGB(H: number, S: number, V: number) {
	let r, g, b;

	// Garantir que H, S e V estejam dentro dos limites
	H = H % 360; // H deve estar entre 0 e 360
	S = Math.max(0, Math.min(1, S)); // S deve estar entre 0 e 1
	V = Math.max(0, Math.min(1, V)); // V deve estar entre 0 e 1

	const C = V * S; // Chroma
	const X = C * (1 - Math.abs(((H / 60) % 2) - 1));
	const m = V - C;

	if (H >= 0 && H < 60) {
		r = C;
		g = X;
		b = 0;
	} else if (H >= 60 && H < 120) {
		r = X;
		g = C;
		b = 0;
	} else if (H >= 120 && H < 180) {
		r = 0;
		g = C;
		b = X;
	} else if (H >= 180 && H < 240) {
		r = 0;
		g = X;
		b = C;
	} else if (H >= 240 && H < 300) {
		r = X;
		g = 0;
		b = C;
	} else {
		r = C;
		g = 0;
		b = X;
	}

	// Ajustar os valores de r, g, b
	return {
		r: Math.round((r + m) * 255),
		g: Math.round((g + m) * 255),
		b: Math.round((b + m) * 255),
	};
}

export function randomColors(total: number): string[] {
	const colors: string[] = [];
	const hueStep = 360 / total; // Distribuir as cores uniformemente no espectro

	for (let i = 0; i < total; i++) {
		const hue = i * hueStep; // Matiz

		// Definir limites para saturação e valor
		const saturation = Math.random() * 0.75 + 0.35; // Saturação entre 0.35 e 0.75
		const value = Math.random() * 0.75 + 0.35; // Value entre 0.35 e 0.75

		const rgb = HSVtoRGB(hue, saturation, value);
		colors.push(
			"#" +
				rgb.r.toString(16).padStart(2, "0") +
				rgb.g.toString(16).padStart(2, "0") +
				rgb.b.toString(16).padStart(2, "0")
		);
	}

	return colors;
}

export function getColorFromTemp(a: number) {
	// Map the temperature to a 0-1 range
	// var a = (t + 30)/60;
	// a = (a < 0) ? 0 : ((a > 1) ? 1 : a);

	// Scrunch the green/cyan range in the middle
	var sign = a < 0.5 ? -1 : 1;
	a = (sign * Math.pow(2 * Math.abs(a - 0.5), 0.35)) / 2 + 0.5;

	// Linear interpolation between the cold and hot
	var h0 = 259;
	var h1 = 12;
	var h = h0 * (1 - a) + h1 * a;

	return HSVtoRGB(h, 75, 90);
}
