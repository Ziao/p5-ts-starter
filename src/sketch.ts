import P5 from "p5";
import { Agent } from "./lib/agent.ts";

new P5((p: P5) => {
    window.addEventListener("resize", () => {
        // Resize canvas when window is resized
        // p.resizeCanvas(window.innerWidth, window.innerHeight);
        p.setup();
    });

    const agents: Agent[] = [];

    p.setup = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
        p.pixelDensity(1);
        p.frameRate(60);
        p.colorMode(p.HSB);
        // p.background("#00292A");

        // Create a bunch of agents
        agents.length = 0;
        for (let i = 0; i < window.innerWidth * window.innerHeight * 0.0001; i++) {
            agents.push(
                new Agent(
                    p.createVector(p.random(p.width), p.random(p.height)),
                    p.createVector(0, 2).rotate(p.random(p.TWO_PI)),
                ),
            );
        }
    };

    p.draw = () => {
        p.background(p.color(255, 255, 0, 0.04));

        // Draw the agents
        for (const agent of agents) {
            agent.draw(p, agents);
        }

        // p.filter(p.BLUR, 1);
    };
});
