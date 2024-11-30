const kanvas = document.getElementById('wheel');
const ctx = kanvas.getContext('2d');
const döndürBtn = document.getElementById('spin-btn');
const sonucDiv = document.getElementById('result');

const bölümler = [
    { metin: "Bukalemun: Renk Değiştirme", renk: "#FF6B6B" },
    { metin: "Örümcek: Güçlü Ağ Yapma", renk: "#4ECDC4" },
    { metin: "Yarasa: Ekolokasyon", renk: "#45B7D1" },
    { metin: "Ateşböceği: Enerjik Işık", renk: "#FFA07A" },
    { metin: "Penguen: Soğukta Dayanıklılık", renk: "#F9D5E5" },
    { metin: "Namibya Böceği: Su Toplama", renk: "#EEAF61" }
];

let mevcut_açı = 0;
const bölüm_açısı = (2 * Math.PI) / bölümler.length;
let dönüyor = false;

function çarkÇiz() {
    ctx.clearRect(0, 0, kanvas.width, kanvas.height);

    bölümler.forEach((bölüm, index) => {
        const başlangıç_açı = mevcut_açı + index * bölüm_açısı;
        const bitiş_açı = başlangıç_açı + bölüm_açısı;

        // Bölümleri gradyan ile çiz
        const gradyan = ctx.createRadialGradient(250, 250, 0, 250, 250, 250);
        gradyan.addColorStop(0, bölüm.renk);
        gradyan.addColorStop(1, renkKoyulaştır(bölüm.renk, 0.2));

        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, başlangıç_açı, bitiş_açı);
        ctx.fillStyle = gradyan;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        // Gölgeli metin çiz
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(başlangıç_açı + bölüm_açısı / 2);
        ctx.fillStyle = "white";
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 5;
        ctx.font = "bold 14px Montserrat";
        ctx.textAlign = "center";
        ctx.fillText(bölüm.metin, 140, 10);
        ctx.restore();
    });
}

function renkKoyulaştır(renk, miktar) {
    const { r, g, b } = hexToRgb(renk);
    return rgbToHex(
        Math.round(r * (1 - miktar)),
        Math.round(g * (1 - miktar)),
        Math.round(b * (1 - miktar))
    );
}

function hexToRgb(hex) {
    const büyükTamsayı = parseInt(hex.slice(1), 16);
    return {
        r: (büyükTamsayı >> 16) & 255,
        g: (büyükTamsayı >> 8) & 255,
        b: büyükTamsayı & 255
    };
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function döndür() {
    if (dönüyor) return;

    dönüyor = true;
    sonucDiv.textContent = "Dönüyor...";
    döndürBtn.disabled = true;
    const döndürme_süresi = 5000;
    const döndürme_açısı = Math.random() * 360 + 1080; // Daha fazla dönüş
    let başlangıç_zamanı = null;

    function döndür(zaman_damgası) {
        if (!başlangıç_zamanı) başlangıç_zamanı = zaman_damgası;
        const geçen_süre = zaman_damgası - başlangıç_zamanı;

        if (geçen_süre < döndürme_süresi) {
            const easeOut = Math.pow(1 - geçen_süre / döndürme_süresi, 3);
            mevcut_açı = (döndürme_açısı * (1 - easeOut)) % (2 * Math.PI);

            çarkÇiz();

            requestAnimationFrame(döndür);
        } else {
            dönüyor = false;
            döndürBtn.disabled = false;
            const seçilen_bölüm = Math.floor((360 - ((mevcut_açı * 180 / Math.PI) % 360)) / (360 / bölümler.length));
            sonucDiv.textContent = `Seçilen Yetenek: ${bölümler[seçilen_bölüm].metin}`;
        }
    }

    requestAnimationFrame(döndür);
}

çarkÇiz();
döndürBtn.addEventListener('click', döndür);

