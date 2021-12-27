const lerp = (a, b, u) => (1 - u) * a + u * b;

const fade = (element, property, start, end, duration) => {
    var interval = 10;
    var steps = duration / interval;
    var step_u = 1.0 / steps;
    var u = 0.0;
    var theInterval = setInterval(function () {
        if (u >= 1.0) {
            clearInterval(theInterval);
        }
        var r = parseInt(lerp(start.r, end.r, u));
        var g = parseInt(lerp(start.g, end.g, u));
        var b = parseInt(lerp(start.b, end.b, u));
        var colorname = 'rgb(' + r + ',' + g + ',' + b + ')';
        element.style.setProperty(property, colorname);
        u += step_u;
    }, interval);
};

export default fade;

// in action
// const el = document.getElementById('box'); // your element
// const property = 'background-color'; // fading property
// const startColor = { r: 255, g: 0, b: 0 }; // red
// const endColor = { r: 0, g: 128, b: 128 }; // dark turquoise
// fade(el, property, startColor, endColor, 1000);
