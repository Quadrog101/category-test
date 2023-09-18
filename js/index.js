const cards = document.querySelectorAll(".card");
const svgs = document.querySelectorAll(".card svg");
let activeCard = null;
let requestID = null;

const generateParticleObj = () => {
    let d = Math.random() * (Math.PI * 2);
    return {
        dir: d,
        targetDir: d,
        speed: 0.1 + Math.random(),
        size: (Math.random() * (0.6 - 0.3) + 0.3) *  300 - 50,
        x: Math.random() * 560 - 280,
        y: Math.random() * 170 - 85
    };
}

let bubbles = Array(3).fill(0).map(() => generateParticleObj());

const circlesArr = bubbles.map(() => `<circle fill="white"></circle>`).join('');

document.addEventListener("click", setActive, true);

let bg = document.querySelectorAll('.mouse-parallax-bg');
for (let i = 0; i < bg.length; i++){
    window.addEventListener('mousemove', function(e) { 
        let x = e.clientX / window.innerWidth;
        let y = e.clientY / window.innerHeight;     
        bg[i].style.transform = 'translate(' + `${((i == 1) ? (-1 * x * 50) : (x * 50 - 18))}` + 'px, ' + `${((i == 1) ? (y * 50) : (-1*y * 50))}` + 'px)';
        // у коричневого листа движение по x обратно мыши, а у зеленого по y
    });    
}

cards.forEach(card => {
  card.addEventListener("click", setActive);
  card.children[0].innerHTML = circlesArr;
});

function setActive(e) { 
    if (e.target.closest('.active')) {// отменяет создание новой анимации
        return;
    }
    activeCard?.classList?.remove("active");
    cancelAnimationFrame(requestID);
    
    if (!this.classList?.contains("card")) {
        activeCard = null;
        return;
    }
    
    this.classList?.add("active");      
    activeCard = this;
    createFrame();
}

function createFrame() {
    bubbles = bubbles.map(() => generateParticleObj())
    requestID = requestAnimationFrame(renderCircle);
}

function renderCircle(time) {  // прорисовка кадра, тут t - время с начала анимации  
    let circles = document.querySelector('.active svg')?.childNodes;
    circles.forEach((circle, i) => {
       let bubble = bubbles[i % 3];
       calculateDirection(bubble, time)
       bubble.x += Math.cos(bubble.dir) * bubble.speed;
       bubble.y += Math.sin(bubble.dir) * bubble.speed;
       
       if (Math.abs(bubble.x) > 350) bubble.x *= -1;
       if (Math.abs(bubble.y) > 250) bubble.y *= -1;
       
       circle.setAttribute('r', Math.max(0.3, bubble.size + 10 * Math.sin(time / (444 + i * 77))));
       circle.setAttribute('cx', bubble.x);
       circle.setAttribute('cy', bubble.y);
       circle.setAttribute('fill-opacity', 0.5);
    })
    requestID = requestAnimationFrame(renderCircle);
}

function calculateDirection(bubble, time) {
    if (Math.random() > 0.995)
        bubble.targetDir = Math.random() * (Math.PI * 2);
    let newDirection = (bubble.targetDir - bubble.dir) % (Math.PI * 2);
    bubble.dir += (2 * newDirection % (Math.PI * 2) - newDirection) * 0.1 + Math.sin(time/100) * 0.05;
}