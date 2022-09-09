// Returns a hex code of specified rgb values
export function packRGB(r, g, b) {
    let hr = parseInt(r, 16);
    let hg = parseInt(g, 16);
    let hb = parseInt(b, 16);

    return "#" + hr + hg + hb;
}

// Returns an object with channel values from given hex color
export function unpackRGB(color) {
    let hr = color[1] + color[2];
    let hg = color[3] + color[4];
    let hb = color[5] + color[6];

    let r = parseInt(hr, 10);
    let g = parseInt(hg, 10);
    let b = parseInt(hb, 10);

    return { r: r, g: g, b: b };
}

// Shorthand for looping over an image for each pixel
export function forEachPixel(img, fun) {
    for (let x = 0; x < img.width; x++) {
        for (let y = 0; y < img.height; y++) {
            fun(img, x, y);
        }
    }
}
