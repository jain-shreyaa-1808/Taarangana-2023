var w = window.innerWidth, h = window.innerHeight;
window.onresize = function(){
  var w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize( w, h );
}

cameraSpeed = .00015;
lightSpeed = .001;
tubularSegments = 1000;
radialSegments = 3;
tubeRadius = 2;
ambientLight = 0x222222;
lightColor = 0xffffff;
lightIntensity = 1;
lightDistance = 20;
hs = 0; // Hue-Start
he = 360; // Hue-End

var renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas"),
  antialias: true,
});
renderer.setSize(w, h);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, w / h, .001, 1000);

var starsGeometry = new THREE.Geometry();
for(i=0; i<3000; i++){
	var star = new THREE.Vector3();
	star.x = THREE.Math.randFloatSpread(1500);
	star.y = THREE.Math.randFloatSpread(1500);
	star.z = THREE.Math.randFloatSpread(1500);
	starsGeometry.vertices.push(star);
}
var starsMaterial = new THREE.PointsMaterial({color: 0xffffff});
var starField = new THREE.Points(starsGeometry,starsMaterial);
scene.add(starField);

for (i=0; i<p.length; i++) {
  var x = p[i][0];
  var y = p[i][2];
  var z = p[i][1];
  p[i] = new THREE.Vector3(x,y,z);
}
var path = new THREE.CatmullRomCurve3(p);
var geometry = new THREE.TubeGeometry(path,tubularSegments,tubeRadius,radialSegments,true);

hue = hs;
hup = true;
for(i=0; i<geometry.faces.length; i++){
  hup==1?hue++:hue--;
  hue==he?hup=false:(hue==hs)?hup=true:0;
  geometry.faces[i].color = new THREE.Color("hsl("+hue+",100%,50%)");
}

var material = new THREE.MeshLambertMaterial({
  side: THREE.BackSide,
  vertexColors: THREE.FaceColors,
  wireframe: true
});

var tube = new THREE.Mesh(geometry, material);
scene.add(tube);

var light = new THREE.PointLight(0xffffff, 1, 50);
scene.add(light);
var light2 = new THREE.AmbientLight(ambientLight);
scene.add(light2);

var l1 = new THREE.PointLight(lightColor, lightIntensity, lightDistance);
scene.add(l1);
var l2 = new THREE.PointLight(lightColor, lightIntensity, lightDistance);
scene.add(l2);
var l3 = new THREE.PointLight(lightColor, lightIntensity, lightDistance);
scene.add(l3);
var l4 = new THREE.PointLight(lightColor, lightIntensity, lightDistance);
scene.add(l4);
var l5 = new THREE.PointLight(lightColor, lightIntensity, lightDistance);
scene.add(l5);

var pct = 0;
var pct2 = 0;
function render(){
  pct += cameraSpeed
  pct2 += lightSpeed;
  var pt1 = path.getPointAt(pct%1);
  var pt2 = path.getPointAt((pct + .01)%1);
  camera.position.set(pt1.x,pt1.y,pt1.z);
  camera.lookAt(pt2);
  light.position.set(pt2.x, pt2.y, pt2.z);
  
  l1.position.set(path.getPointAt((pct2+.0)%1).x, path.getPointAt((pct2+.0)%1).y, path.getPointAt((pct2+.0)%1).z);
  l2.position.set(path.getPointAt((pct2+.2)%1).x, path.getPointAt((pct2+.2)%1).y, path.getPointAt((pct2+.2)%1).z);
  l3.position.set(path.getPointAt((pct2+.4)%1).x, path.getPointAt((pct2+.4)%1).y, path.getPointAt((pct2+.4)%1).z);
  l4.position.set(path.getPointAt((pct2+.6)%1).x, path.getPointAt((pct2+.6)%1).y, path.getPointAt((pct2+.6)%1).z);
  l5.position.set(path.getPointAt((pct2+.8)%1).x, path.getPointAt((pct2+.8)%1).y, path.getPointAt((pct2+.8)%1).z);
  
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
window.onclick = function(event) {
 window.open("homepage.html");
}















const util = {
	math: {
		degToRad: alpha => alpha * Math.PI / 180,

		polarToDecart: (alpha, r) => {
			alpha = this.degToRad(alpha);
			return {x: r * Math.cos(alpha), y: r * Math.sin(alpha)};
		}
	},

	color: {
		random: (opts = {}) => {
			let h, s, l;

			h = opts.hue || Math.floor(Math.random() * 360);
			s = opts.saturation || Math.floor(Math.random() * 101);
			l = opts.lightness || Math.floor(Math.random() * 101);

			return `hsl(${h}, ${s}%, ${l}%)`;
		}
	}
};




/**
 * Make a contenteditable element more controllable
 */
class FunkyLetters {
	/**
	 * Constructor
	 * @param  {Element} el  document element with contenteditable=true or selector
	 * @param  {Object} [opts] options
	 */
	constructor(el, opts = {}) {
		if(typeof el == 'string') {
			el = document.querySelector(el);
		}
		this.container = el;
		this.options = opts;
		this._splitLetters();
		this._listenToInput();
	}


	/**
	 * Split container's text into one letter spans optionally colored
	 */
	_splitLetters() {
		this.container.innerHTML = FunkyLetters.splitTextLetters(this.container.textContent, this.options);
	}


	/**
	 * Split the text into one letter spans
	 * @param  {string} text input text
	 * @param  {Object} [opts] options
	 * @return {string}      html with text split into letters
	 */
	static splitTextLetters(text, opts = {}) {
		let letters;

		text = text.replace(/\s+/, ' ');
		letters = text.split(/(?=.)/);

		return letters.reduce((a, b) => a + FunkyLetters.makeLetterHtml(b, opts), '');
	}


	/**
	 * Generate html string for a letter
	 * @param  {string} letter single letter
	 * @param  {Object} [opts]   options
	 * @return {string}        html string
	 */
	static makeLetterHtml(letter, opts = {}) {
		let style = '',
			className = 'char';

		if(/\s/.test(letter)) {
			letter = '&nbsp;';
			className += ' space';
		} else {
			className += ' letter';
		}
		if(opts.colorize) {
			style += 'color:' + util.color.random({saturation: 100, lightness: 50}) + ';';
		}

		return `<span class="${className}" ${style && 'style="' + style + '"'}><span class="letter-inner">${letter}</span></span>`;
	}


	/**
	 * Watch input
	 */
	_listenToInput() {
		let me = this;
		// this.container.dataset.text = this.container.textContent;

		this.container.addEventListener('keydown', function(e) {
			let letterEl = me.getFocusLetter();

			if(e.key.length === 1 && !e.altKey && !e.ctrlKey) {
				e.preventDefault();
				me.insertText(e.key);
				return;
			}

			// If the container is empty
			if(!letterEl) return;

			switch(e.key) {
				// Firefox focuses in two steps on inline-block elements
				case 'ArrowRight':
					if(navigator.userAgent.indexOf('AppleWebKit') !== -1) break;
					if(!letterEl.nextElementSibling) break;
					e.preventDefault();
					me.setFocus(letterEl.nextElementSibling, 1);
					break;

				case 'ArrowLeft':
					if(navigator.userAgent.indexOf('AppleWebKit') !== -1) break;
					e.preventDefault();
					if(!letterEl.previousElementSibling) {
						me.setFocus(letterEl, 0);
					} else {
						me.setFocus(letterEl.previousElementSibling, 1);
					}
					break;

				case 'ArrowUp':
				case 'ArrowDown':
					e.preventDefault();
					break;

				case 'Home':
				case 'PageUp':
					e.preventDefault();
					me.setFocus(this.firstElementChild, 0);
					break;

				case 'End':
				case 'PageDown':
					e.preventDefault();
					me.setFocus(this.lastElementChild, 1);
					break;
			}
		});

		this.container.addEventListener('input', function(e) {
			// Firefox leaves empty containers when text is deleted. Make sure those are deleted too.
			me._cleanEmpty();
		});

		this.container.addEventListener('paste', function(e) {
			if(e.clipboardData.types.indexOf('text/plain') != -1) {
				e.preventDefault();
				me.insertText(e.clipboardData.getData('text/plain'));
			}
		});
	}

	/**
	 * Format text and insert it into the container at the caret position
	 * @param  {string} text the text to insert
	 */
	insertText(text) {
		let sel = document.getSelection(),
			range = document.createRange(),
			node = this.getFocusLetter(),
			isBeforeNode = sel.focusOffset === 0;

		sel.deleteFromDocument();
		if(!node) {
			this.container.insertAdjacentHTML('afterbegin', FunkyLetters.splitTextLetters(text, this.options));
			this.setFocus(Array.from(this.container.querySelectorAll('.char')).pop(), 1);
		} else if(isBeforeNode) {
			node.insertAdjacentHTML('beforebegin', FunkyLetters.splitTextLetters(text, this.options));
			this.setFocus(node.previousElementSibling, 1);
		} else {
			node.insertAdjacentHTML('afterend', FunkyLetters.splitTextLetters(text, this.options));
			for(let i = text.length; i > 0 && node.nextElementSibling; i--) {
				node = node.nextElementSibling;
			}
			this.setFocus(node, node.textContent.length);
		}
		
		this.container.dataset.changed = true;
		this._cleanEmpty();
	}

	/**
	 * Get the character in focus (at caret position)
	 * @return {Element} the element node in focus
	 */
	getFocusLetter() {
		const sel = document.getSelection();
		return sel.anchorNode.closest ? sel.anchorNode.closest('.char') : sel.anchorNode.parentElement.closest('.char');
	}

	/**
	 * Set cursor position
	 * @param {Element} node   letter element to focus on
	 * @param {Integer} offset offset. In our case, either 0 or 1
	 */
	setFocus(node, offset) {
		const sel = document.getSelection(),
			range = document.createRange();

		range.setStart(node, offset);
		sel.removeAllRanges();
		sel.addRange(range);
	}

	/**
	 * Delete elements other than .char the browser could have generated
	 */
	_cleanEmpty() {
		const focusLetter = this.getFocusLetter();
		Array.from(this.container.children).forEach(el => {
			if(el.classList.contains('char') && el.textContent) return;
			if(el === focusLetter) {
				if(el.previousElementSibling) {
					this.setFocus(el, 1);
				} else if (el.nextElementSibling) {
					this.setFocus(el.nextElementSibling, 1);
				}
			}
			el.remove();
		});
	}
}





/**
 * Control animations of an element's children
 */
class Animator {
	/**
	 * Constructor
	 * @param  {Element|string} el the container element whose children are being animated
	 */
	constructor(el) {
		this.container = el;
		this._removeClassTimer = null;

		// this.container.addEventListener('animationend', () => {
		// 	clearTimeout(this._removeClassTimer);
		// 	this._removeClassTimer = setTimeout(() => {
		// 		this.container.classList.remove('anim');
		// 	}, 900);
		// });
	}


	/**
	 * Run animation using the effect
	 * @param  {string} effect effect name
	 */
	animate(effect) {
		const cont = this.container;
		if(cont.classList.contains('anim')) {
			cont.classList.remove('anim');
			setTimeout(() => {
				this.animate(effect);
			}, 50);
			return;
		}
		clearTimeout(this._removeClassTimer);
		cont.classList.add('anim');
		if(cont.dataset.effect === effect && !('changed' in cont.dataset)) return;
		cont.dataset.effect = effect;
		delete cont.dataset.changed;
		// if(effect !== 'converge'/* && effect !== 'spiral'*/ && effect !== 'meteorite') {
		// 	Array.prototype.forEach.call(cont.children, function(el) {
		// 		el.style.transform = '';
		// 	});
		// }
		if(!Animator.effects[effect]) {
			throw new Error(`Animator: effect ${effect} is not defined`);
		}
		if(Animator.effects[effect].delays) {
			this.distributeDelays(Animator.effects[effect].delays);
		} else {
			this.distributeDelays({shift: false});
		}
	}


	/**
	 * Distribute animation delays
	 * @param  {Object} opts           options
	 * @param  {Object} opts.shift     shift each next item this much milliseconds
	 * @param  {Object} [opts.random]  distribute delays randomly: without regard to document order
	 * @param  {Object} [opts.reverse] distribute delays in reverse document order starting with the last element
	 */
	distributeDelays(opts) {
		let shift = opts.shift != null ? opts.shift : 100,
			curShift = 0,
			els = Array.from(this.container.children);

		if(opts.random) {
			let newEls = [];
			for(let j = 0, l = els.length; j < l; j++) {
				let i = Math.floor(Math.random() * els.length);
				newEls.push(els.splice(i, 1)[0]);
			}
			els = newEls;
		}
		if(opts.reverse) {
			els = els.reverse();
		}

		els.forEach(el => {
			curShift += typeof shift == 'object' ? Math.round(Math.random() * (shift.max - shift.min) + shift.min) : shift;
			el.style.animationDelay = el.querySelector('.letter-inner').style.animationDelay = '';
			if(shift === false) return;
			el.style.animationDelay = (parseFloat(getComputedStyle(el, null).animationDelay) + curShift/1000) + 's';
			el.querySelector('.letter-inner').style.animationDelay = (parseFloat(getComputedStyle(el.querySelector('.letter-inner'), null).animationDelay) + curShift/1000) + 's';
		});
	}


	/**
	 * Distribute children's offset positions
	 * We are currently doing this in Sass
	 * @param  {Object} opts options
	 */
	distributeOffsets(opts) {
		let coords,
			alpha = opts.minAngle || 0,
			x = 100,
			y = 100,
			els = this.container.children;

		for(let i = 0; i < els.length; i++) {
			if(opts.dx || opts.dy) {
				x -= opts.dx || 0;
				y -= opts.dy || 0;
			} else {
				if(opts.random) {
					alpha = Math.random * (opts.maxAngle || 360 - opts.minAngle || 0) + opts.minAngle || 0;
					coords = util.math.polarToDecart(alpha, 100);
				} else {
					coords = util.math.polarToDecart(alpha, 100);
					alpha += opts.dAlpha;
				}
				x = coords.x;
				y = coords.y;
			}
			els[i].style.transform = 'translate(' + x.toFixed(3) + 'vmax,' + y.toFixed(3) +'vmax)';
		}
	}
}
/**
 * The available animation effects and their settings
 * @type {Object}
 */
Animator.effects = {
	roll: {
		delays: {shift: 100}
	},
	slide: {
		delays: {shift: 100}
	},
	swivel: {
		delays: {shift: 100, random: true}
	},
	peel: {
		delays: {shift: 70}
	},
	wave: {
		delays: {shift: 30}
	},
	wave2: {
		delays: {shift: 120}
	},
	hop: {
		delays: {shift: 140}
	},
	converge: {
		delays: {shift: false}
	},
	fade: {
		delays: {shift: 80, random: true}
	},
	snow: {
		delays: {shift: 600, random: true}
	},
	spiral: {
		delays: {shift: 100}
	},
	meteorite: {
		delays: {shift: 50, random: true}
	},
	bounce: {
		delays: {shift: 200, random: true}
	},
	float: {
		delays: {shift: 400, random: true}
	},
	bubble: {
		delays: {shift: {min: 200, max: 500}, random: true}
	},
};





const animationContainer = document.querySelector('.anim-text');

let config = localStorage['funkyLetters:config'];
try {
	config = JSON.parse(config);
} catch(e) {
	config = {
		completed: {}
	};
}

// Tips
if(config.completed.changeEffect) {
	document.querySelector('.tip-effect').classList.add('hide');
} else {
	document.querySelector('#selectEffect').addEventListener('change', () => {
		document.querySelector('.tip-effect').classList.add('hide');
		config.completed.changeEffect = true;
		localStorage['funkyLetters:config'] = JSON.stringify(config);
	}, {once: true});
}

if(config.completed.type) {
	document.querySelector('.tip-type').classList.add('hide');
} else {
	animationContainer.addEventListener('keydown', () => {
		document.querySelector('.tip-type').classList.add('hide');
		config.completed.type = true;
		localStorage['funkyLetters:config'] = JSON.stringify(config);
	}, {once: true});
}

if(config.completed.comeBack) {
	document.querySelector('.alert-come-back').classList.add('hide');
}


new FunkyLetters(animationContainer, {colorize: true});

const animator = new Animator(animationContainer);
animator.animate(document.querySelector('#selectEffect').value);


// Listen to controls
document.querySelector('#selectEffect').addEventListener('change', function(e) {
	animator.animate(this.value);
});
document.querySelector('.animate').addEventListener('click', function(e) {
	animator.animate(document.querySelector('#selectEffect').value);
});


// Animate on enter key
animationContainer.addEventListener('keydown', function(e) {
	switch(e.keyCode) {
		case 13:
			e.preventDefault();
			document.querySelector('.animate').focus();
			document.querySelector('.animate').click();
			break;
	}
});




// Other
document.querySelector('.dismiss').addEventListener('click', function(e) {
	this.closest('.alert').classList.add('close');
	config.completed.comeBack = true;
	localStorage['funkyLetters:config'] = JSON.stringify(config);
});
