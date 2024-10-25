
const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');

canvas.width = document.body.clientWidth - 4;
canvas.height = 730;

canvas.style.border = "2px solid red"
document.body.style.backgroundColor = "black"


// Exclusive
function randrange(min, max, floor=true) {
	if (floor) {
		return Math.floor(Math.random() * (max - min) + min);
	}
	else {
		return Math.random() * (max - min) + min;
	}
}

function randomChoice(arr) {
	return arr[randrange(0, arr.length)];
}

function range(n) {
	let list = [];

	for (let i = 0; i < n; i++) {
		list.push(i);
	}

	return list;
}

class Color {
	constructor(h, s, l) {
		this.h = h;
		this.s = s;
		this.l = l;
	}

	toString() {
		return `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
	}
}

class Particle {
	constructor(x, y, color) {
		this.x = x;
		this.y = y;
		this.settings = {fades: true, reverses: true, basic_direction: false}
		this.color = color;
		this.radius = 6;
		this.fadeSpeed = 0.1;
		this.speed = randrange(2, 5, false);

		if (this.settings.basic_direction) {
			this.direction = { x: randrange(-1, 2), y: randrange(-1, 2) }
		}
		else {
			this.direction = { x: randrange(-1, 1, false), y: randrange(-1, 1, false) }
		}
	}

	fadeToBlack() {
		this.color = new Color(this.color.h, this.color.s, this.color.l - this.fadeSpeed);
	}

	draw() {
		c.fillStyle = this.color.toString();
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		c.closePath();
		c.fill();
	}

	animate() {
		if (this.color.l > 0) {
			this.draw();

			this.x += this.direction.x * this.speed;
			this.y += this.direction.y * this.speed;

			if (this.settings.reverses) {
				this.speed -= 0.05
			}
			else {
				if (this.speed > 0) { this.speed -= 0.05 }
				else { this.speed = 0 }		
			}

			if (this.settings.fades) { this.fadeToBlack() }
		}
	}
}


class Firework {
	constructor(x, y, colorTheme) {
		this.initialX = x;
		this.x = x;
		this.y = y;
		this.explosion_height = randrange(100, 300);
		this.particles = [];
		this.colorTheme = colorTheme;

		this.explosion_count = 0;
	}

	getParticleColor() {
		let particleColor;

		if (this.colorTheme == "hot") {
			particleColor = new Color(randrange(0, 60), 100, 50);
		}
		else if (this.colorTheme == "cold") {
			particleColor = new Color(randrange(180, 240), 100, 50);
		}
		else if (this.colorTheme == "princess") {
			particleColor = new Color(randrange(260, 350), 100, 50);
		}		

		return particleColor;
	}

	initializeParticles(count) {
		for (let i in range(count)) {


			const particle = new Particle(this.initialX, this.explosion_height, this.getParticleColor());
			this.particles.push(particle);
		}
	}

	explode() {
		this.explosion_count++;

		if (this.explosion_count == 1) {
			this.initializeParticles(200);
		}

		for (let particle of this.particles) {
			particle.animate();
		}

	}

	draw() {
		if (this.y > this.explosion_height) {
			c.fillStyle = this.getParticleColor();
			c.fillRect(this.x, this.y, 5, 25);	

		}

	}

	animate() {
		this.draw();
		this.y -= 10;

		if (this.y < this.explosion_height) {
			this.explode();
		}

	}
}


let fireworks = []

document.body.addEventListener("keypress", (e) => {
	if (e.key == " ") {
		fireworks.push(new Firework(randrange(0, canvas.width), canvas.height, randomChoice(["hot", "cold", "princess"])));
	}
})

function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);

	c.fillStyle = "white";
	c.font = "20px sans-serif";
	c.fillText("Press SPACE To Shoot", 10, 30);

	for (let firework of fireworks) {
		firework.animate();
	}
}

animate();