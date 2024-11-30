const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin-btn');
const resultDiv = document.getElementById('result');
const animatedTextDiv = document.getElementById('animated-text');

const sections = [
    { text: "Chameleon: Color Change", color: "#FF6B6B" },
    { text: "Spider: Web Weaving", color: "#4ECDC4" },
    { text: "Bat: Echolocation", color: "#45B7D1" },
    { text: "Firefly: Energy Light", color: "#FFA07A" },
    { text: "Penguin: Cold Resistance", color: "#F9D5E5" },
    { text: "Namibian Beetle: Water Collection", color: "#EEAF61" }
];

let currentAngle = 0;
const sectionAngle = (2 * Math.PI) / sections.length;
let isSpinning = false;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sections.forEach((section, index) => {
        const startAngle = currentAngle + index * sectionAngle;
        const endAngle = startAngle + sectionAngle;

        // Draw sections with gradient
        const gradient = ctx.createRadialGradient(250, 250, 0, 250, 250, 250);
        gradient.addColorStop(0, section.color);
        gradient.addColorStop(1, darkenColor(section.color, 0.2));

        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, startAngle, endAngle);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        // Draw shadowed text
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(startAngle + sectionAngle / 2);
        ctx.fillStyle = "white";
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 5;
        ctx.font = "bold 14px Montserrat";
        ctx.textAlign = "center";
        ctx.fillText(section.text, 140, 10);
        ctx.restore();
    });
}

function darkenColor(color, amount) {
    const { r, g, b } = hexToRgb(color);
    return rgbToHex(
        Math.round(r * (1 - amount)),
        Math.round(g * (1 - amount)),
        Math.round(b * (1 - amount))
    );
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    };
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

let animationInterval;

function animateText() {
    let index = 0;
    resultDiv.textContent = "Spinning...";
    
    animationInterval = setInterval(() => {
        animatedTextDiv.textContent = sections[index % sections.length].text;
        index++;
    }, 100);
}

function spin() {
    if (isSpinning) return;

    isSpinning = true;
    spinBtn.disabled = true;
    animateText();
    
    const spinDuration = 5000;
    const spinAngle = Math.random() * 360 + 1080; // More rotations
    let startTime = null;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        if (elapsed < spinDuration) {
            const easeOut = Math.pow(1 - elapsed / spinDuration, 3);
            currentAngle = (spinAngle * (1 - easeOut)) * Math.PI / 180;

            drawWheel();

            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            spinBtn.disabled = false;
            clearInterval(animationInterval);
            
            const selectedSection = Math.floor((360 - ((currentAngle * 180 / Math.PI) % 360)) / (360 / sections.length));
            resultDiv.textContent = `Selected Ability: ${sections[selectedSection].text}`;
            animatedTextDiv.textContent = sections[selectedSection].text;
        }
    }

    requestAnimationFrame(animate);
}

drawWheel();
spinBtn.addEventListener('click', spin);
