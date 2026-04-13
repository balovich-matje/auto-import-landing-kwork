// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 50);
});

// ===== BURGER MENU =====
const burger = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu on link click
navMenu.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== MODAL =====
const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const heroCtaBtn = document.getElementById('heroCtaBtn');
const calcCtaBtn = document.getElementById('calcCtaBtn');

function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

heroCtaBtn.addEventListener('click', openModal);
calcCtaBtn.addEventListener('click', openModal);
modalOverlay.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ===== FORMS =====
function handleFormSubmit(form, formName) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.querySelector('input[type="text"]')?.value || '';
        const phone = form.querySelector('input[type="tel"]')?.value || '';

        if (!name.trim() || !phone.trim()) {
            alert('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        alert(`Спасибо, ${name}! Ваша заявка принята. Мы свяжемся с вами по номеру ${phone} в ближайшее время.`);
        form.reset();

        if (formName === 'modal') {
            closeModal();
        }
    });
}

handleFormSubmit(document.getElementById('contactForm'), 'contact');
handleFormSubmit(document.getElementById('modalForm'), 'modal');

// ===== CALCULATOR =====
const calcForm = document.getElementById('calcForm');
const calcResultPrice = document.getElementById('calcResultPrice');
const calcBreakdown = document.getElementById('calcBreakdown');

const exchangeRates = {
    china: 12.5,   // 1 CNY ≈ 12.5 RUB
    korea: 0.068,  // 1 KRW ≈ 0.068 RUB
    japan: 0.6     // 1 JPY ≈ 0.6 RUB
};

const deliveryCosts = {
    china: 150000,
    korea: 180000,
    japan: 120000
};

const countryNames = {
    china: 'Китай',
    korea: 'Корея',
    japan: 'Япония'
};

const currencyNames = {
    china: 'CNY',
    korea: 'KRW',
    japan: 'JPY'
};

function getCustomsDuty(priceRub, engineVolume, year) {
    const age = new Date().getFullYear() - parseInt(year);
    let rate = 0.2; // 20% base

    if (engineVolume >= 3.0) rate = 0.32;
    else if (engineVolume >= 2.0) rate = 0.25;

    if (age > 3) rate += 0.05;
    if (age > 5) rate += 0.05;

    return Math.round(priceRub * rate);
}

calcForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const country = document.getElementById('calcCountry').value;
    const price = parseFloat(document.getElementById('calcPrice').value);
    const engine = parseFloat(document.getElementById('calcEngine').value);
    const year = document.getElementById('calcYear').value;

    if (!country || !price || !engine || !year) {
        alert('Пожалуйста, заполните все поля.');
        return;
    }

    const rate = exchangeRates[country];
    const priceRub = Math.round(price * rate);
    const delivery = deliveryCosts[country];
    const customs = getCustomsDuty(priceRub, engine, year);
    const sbkts = 80000;
    const epts = 15000;
    const total = priceRub + delivery + customs + sbkts + epts;

    calcResultPrice.textContent = formatPrice(total) + ' \u20BD';

    calcBreakdown.innerHTML = `
        <p>Стоимость авто (${formatPrice(price)} ${currencyNames[country]})<span>${formatPrice(priceRub)} \u20BD</span></p>
        <p>Доставка (${countryNames[country]} → Владивосток)<span>${formatPrice(delivery)} \u20BD</span></p>
        <p>Таможенная пошлина<span>${formatPrice(customs)} \u20BD</span></p>
        <p>СБКТС<span>${formatPrice(sbkts)} \u20BD</span></p>
        <p>ЭПТС<span>${formatPrice(epts)} \u20BD</span></p>
    `;

    document.getElementById('calcCtaBtn').classList.add('visible');
});

function formatPrice(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// ===== SCROLL ANIMATIONS =====
const fadeElements = document.querySelectorAll('.fade-in');

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeElements.forEach(el => observer.observe(el));

// ===== PHONE MASK =====
document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length === 0) {
            e.target.value = '';
            return;
        }

        if (value[0] === '8') value = '7' + value.slice(1);
        if (value[0] !== '7') value = '7' + value;

        let formatted = '+7';
        if (value.length > 1) formatted += ' (' + value.slice(1, 4);
        if (value.length > 4) formatted += ') ' + value.slice(4, 7);
        if (value.length > 7) formatted += '-' + value.slice(7, 9);
        if (value.length > 9) formatted += '-' + value.slice(9, 11);

        e.target.value = formatted;
    });
});
