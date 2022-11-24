
const fireworkCount = 7;
const particleCount = 100;
let iter = 0;

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = 1367;
canvas.height = 765;


function randRange(min, max, floor=false) {
	let rand = (Math.random() * (max - min)) + min;
	return floor ? Math.floor(rand) : rand;
}

function randColor(type, lightness) {
	let n;

	switch(type) {
		case 1: n = randRange(0, 60, true); break;
		case 2: n = randRange(190, 230, true); break;
		case 3: n = randRange(80, 160, true); break;
		case 4: n = randRange(250, 290, true); break;
		case 5: n = randRange(0, 27, true); break;
		case 6: n = randRange(55, 65, true); break;

	}

	return `hsl(${n}, 100%, ${lightness}%)`
}

function range(n) {
	let arr = [];

	for (let i = 0; i < n; i++) {
		arr.push(i);
	}

	return arr;
}

const ColorEnum = {
	hot: 1,
	blue: 2,
	green: 3,
	purple: 4,
	red: 5,
	yellow: 6
}


class Firework {
	constructor(x, y, particleCount) {
		this.x = x;
		this.y = y;
		this.color = "orange";
		this.speed = randRange(20, 30);
		this.limit = randRange(50, 350);
		this.particleType = [1, 5, 6][randRange(0, 3, true)]; // randRange(0, 7, true); 
		this.particles = explosion(this, particleCount, this.particleType);
	}

	draw() {
		c.fillStyle = this.color;
		c.fillRect(this.x, this.y, 5, 30);
	}

	update() {
		if (this.y > this.limit) {
			this.draw();
			this.y -= this.speed;
		}
	}
}


class Particle {
	constructor(x, y, particleType) {
		this.x = x;
		this.y = y;
		this.color = "orange";
		this.speed = { x: randRange(-3, 3), y: randRange(-3, 3) };
		this.frame = 0;
		this.lightness = 70;
		this.friction = 0.02;
		this.fade = randRange(0.2, 1);
		this.particleType = particleType;
	}

	draw() {
		const newRandColor = randColor(this.particleType, this.lightness);

		c.fillStyle = newRandColor;
		c.strokeStyle = newRandColor;

		c.beginPath();
		c.arc(this.x, this.y, 5, 0, Math.PI*2);
		c.stroke();
		c.fill();
		c.closePath();
	}

	update() {
		this.frame++;

		this.lightness -= this.fade;

		this.draw();

		if (this.speed.x > 0) {
			let changeX = this.speed.x - this.frame * this.friction;

			if (changeX > 0) {
				this.x += changeX;
			}
		}

		else {
			let changeX = this.speed.x + this.frame * this.friction;

			if (changeX < 0) {
				this.x += changeX;
			}
		}


		if (this.speed.y > 0) {
			let changeY = this.speed.y - this.frame * this.friction;

			if (changeY > 0) {
				this.y += changeY;
			}
		}

		else {
			let changeY = this.speed.y + this.frame * this.friction;

			if (changeY < 0) {
				this.y += changeY;
			}
		}
	}
}



function explosion(firework, amount) {
	let particles = [];

	for (let i of range(amount)) {
		const newParticle = new Particle(firework.x, firework.limit, firework.particleType);
		particles.push(newParticle);
	}

	return particles;
}


function spawnFirework(x, y) {
	let firework = new Firework(x, y, particleCount);

	fireworks.push(firework);
	fireworks.splice(0, 1);

}


function isMultipleOf(factor, n) {
	// Returns if 'n' is a multiple of 'factor'

	let quotient = n / factor;

	if (quotient - Math.floor(quotient) == 0) {
		return true;
	}

	else return false;
}


document.addEventListener("click", event => {
	spawnFirework(event.clientX, event.clientY);
})


let fireworks = [];

for (let i of range(fireworkCount)) {
	let newFirework = new Firework(randRange(0, canvas.width), canvas.height - randRange(0, 100), particleCount);
	fireworks.push(newFirework);
}



function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);
	iter++;

	if (isMultipleOf(randRange(30, 60, true), iter)) {
		spawnFirework(randRange(0, canvas.width), 700);
	}


	// Background
	c.fillStyle = "black";
	c.fillRect(0, 0, canvas.width, canvas.height);

	

	for (firework of fireworks) {
		if (firework) {
			firework.update();

			if (firework.y <= firework.limit) {
				for (let particle of firework.particles) {
					particle.update();
				}
			}
		}
	}
}

animate();

