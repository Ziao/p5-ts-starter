import P5 from "p5";

new P5((p: P5) => {
    window.addEventListener("resize", () => {
        // Resize canvas when window is resized
        p.resizeCanvas(window.innerWidth, window.innerHeight);
    });

    p.setup = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
        p.pixelDensity(1);
        p.frameRate(60);
    };

    p.draw = () => {
        p.background(0);

        p.push();
        p.translate(p.mouseX, p.mouseY);
        p.fill(255);
        p.noStroke();

        // To keep your code readable, I would recommend that you make external functions that receive the P5 instance
        // as an argument and do the drawing there. Many examples have huge draw() calls that are hard to maintain.

        // Draw a bunch of dots circulating around the mouse
        for (let i = 0; i < 10; i++) {
            p.ellipse(p.sin(p.millis() * 0.01 - i * 0.3) * 50, p.cos(p.millis() * 0.01 - i * 0.3) * 50, 15 - i, 15 - i);
        }
        p.pop();
    };
});
