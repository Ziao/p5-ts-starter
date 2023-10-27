import P5, { Vector } from "p5";

export class Agent {
    private position: Vector = new Vector(0, 0);
    private velocity: Vector = new Vector(1, 0);
    private hue = 0;

    constructor(position?: Vector, velocity?: Vector) {
        if (position) this.position = position;
        if (velocity) this.velocity = velocity;
    }

    private flock(agents: Agent[]) {
        // Find close agents
        const closeAgents = agents.filter(
            (agent) =>
                // Not this agent
                agent !== this &&
                // Only agents within x pixels
                agent.position.dist(this.position) < 100,
        );

        // Keep track of the average position of all close agents, the "local" center of the flock
        // We will later try to move towards this position, to stay with the flock

        closeAgents.forEach((agent) => {
            // Separation - Are we too close? Move away
            const faceAway = Vector.sub(this.position, agent.position);
            faceAway.setMag((1 / faceAway.mag()) * 2); // last number = separation strength
            this.velocity.add(faceAway);
            this.velocity.normalize();

            // Alignment - try to match the heading of nearby agents
            this.velocity.add(agent.velocity.copy().mult(0.05));
            this.velocity.normalize();

            // Cohesion - try to move towards the average position of nearby agents
            // Actually looks better without cohesion when using noise to
            // this.velocity.add(faceAway.normalize().mult(0.25));
            // this.velocity.add(agent.position.copy().sub(this.position).mult(0.0001));
            // this.velocity.normalize();
        });
    }

    private moveAwayFromMouse(p: P5) {
        // Todo: pass this in from the sketch, make vector only once
        const mouse = p.createVector(p.mouseX, p.mouseY);
        const distance = this.position.dist(mouse);
        if (distance < 200) {
            const faceAway = Vector.sub(this.position, mouse);
            faceAway.setMag((1 / faceAway.mag()) * 5); // last number = separation strength
            this.velocity.add(faceAway);
            this.velocity.normalize();
        }
    }

    private applyNoise(p: P5) {
        const noise = p.noise(this.position.x * 0.01, this.position.y * 0.01 + p.frameCount * 0.001) - 0.5;
        this.velocity.rotate(noise * p.PI * 0.01);

        // Alternative
        // const noise2 = p.noise(this.position.x * 0.01, this.position.y * 0.01 + 100 + p.frameCount) - 0.5;
        // this.velocity.add([noise, noise2].map((n) => n * 0.1));
        // this.velocity.normalize();
    }

    draw(p: P5, agents: Agent[]) {
        this.flock(agents);
        // this.moveAwayFromMouse(p);
        this.applyNoise(p);

        // Apply velocity to position
        this.position.add(this.velocity);
        // this.position.add(this.velocity);
        // this.position.add(this.velocity);

        // Wrap around the screen
        if (this.position.x > p.width) this.position.x = 0;
        if (this.position.x < 0) this.position.x = p.width;
        if (this.position.y > p.height) this.position.y = 0;
        if (this.position.y < 0) this.position.y = p.height;

        // let col = false;
        // Randomize position and velocity if we go off screen
        // if (this.position.x >= p.width || this.position.x <= 0 || this.position.y >= p.height || this.position.y <= 0) {
        //     col = true;
        //     this.position.x = 100;
        // }
        //     this.position = p.createVector(p.random(p.width), p.random(p.height));
        //     this.velocity = p.createVector(0, 2).rotate(p.random(p.TWO_PI));
        // }

        // Add some noise to the direction by rotating it a bit, keep things interesting
        // this.velocity.rotate(p.random(-0.1, 0.1));

        p.push();
        p.colorMode(p.HSB);
        p.noStroke();
        p.smooth();
        p.fill(
            ((this.hue +
                p.frameCount * 0.5 +
                p.noise(this.position.x * 0.001, this.position.y * 0.001, p.frameCount * 0.001) * 200) %
                255) *
                2,
            255,
            255,
        );

        // based on direction, its awful
        // p.fill((p.abs(this.velocity.heading()) / p.PI) * 360, 255, 255);
        p.translate(this.position.x, this.position.y);
        p.rotate(this.velocity.heading());
        // p.triangle(0, 0, -20, -10, -20, 10);
        p.rect(-5, -50, 10, 100);
        p.pop();
    }
}
