export function getColorFromValue(
  value: number,
  minValue: number,
  maxValue: number,
  palette: string[]
) {
  // Normalize the value to the range 0 to 1
  let normalizedValue = (value - minValue) / (maxValue - minValue);
  if (normalizedValue < 0) {
    normalizedValue = 0;
  } else if (normalizedValue > 1) {
    normalizedValue = 1;
  }

  // Linearly interpolate between the colors in the palette
  const color1Index = Math.floor(normalizedValue * (palette.length - 1));
  const color2Index = Math.ceil(normalizedValue * (palette.length - 1));
  const t = normalizedValue * (palette.length - 1) - color1Index;
  return lerpColor(palette[color1Index], palette[color2Index], t);
}

function lerpColor(color1: string, color2: string, t: number) {
  // Parse the colors and extract the red, green, and blue components
  const color1R = parseInt(color1.substring(1, 3), 16);
  const color1G = parseInt(color1.substring(3, 5), 16);
  const color1B = parseInt(color1.substring(5, 7), 16);
  const color2R = parseInt(color2.substring(1, 3), 16);
  const color2G = parseInt(color2.substring(3, 5), 16);
  const color2B = parseInt(color2.substring(5, 7), 16);

  // Linearly interpolate between the red, green, and blue components
  const r = Math.round(lerp(color1R, color2R, t));
  const g = Math.round(lerp(color1G, color2G, t));
  const b = Math.round(lerp(color1B, color2B, t));

  // Return the interpolated color as a hex string
  return (
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0")
  );
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
