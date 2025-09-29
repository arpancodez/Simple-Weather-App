const searchBox = document.querySelector('.search-box');
const cityEl = document.querySelector('.city');
const dateEl = document.querySelector('.date');
const tempEl = document.querySelector('.temp');
const weatherEl = document.querySelector('.weather');
const hiLowEl = document.querySelector('.hi-low');
const appWrap = document.querySelector('.app-wrap');
const effectsEl = document.querySelector('.effects');

const apiKey = 'fcc8de7015bbb202209bbf0261babf4c'; // Replace with your API key

searchBox.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        fetchWeather(searchBox.value);
    }
});

function fetchWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            updateUI(data);
        })
        .catch(() => alert('City not found!'));
}

function updateUI(data) {
    const now = new Date();
    cityEl.textContent = `${data.name}, ${data.sys.country}`;
    dateEl.textContent = now.toDateString();

    animateTemp(Math.round(data.main.temp));

    weatherEl.textContent = data.weather[0].main;
    weatherEl.setAttribute('data-weather', data.weather[0].main);

    hiLowEl.textContent = `H: ${Math.round(data.main.temp_max)}°c / L: ${Math.round(data.main.temp_min)}°c`;

    updateBackground(data.weather[0].main);
    generateEffects(data.weather[0].main);
}

function animateTemp(target) {
    let current = 0;
    tempEl.innerHTML = `0<span>°c</span>`;
    const interval = setInterval(() => {
        if (current >= target) clearInterval(interval);
        else {
            current++;
            tempEl.innerHTML = `${current}<span>°c</span>`;
        }
    }, 20);
}

function updateBackground(weather) {
    let bg = '';
    switch (weather.toLowerCase()) {
        case 'clear':
            bg = 'linear-gradient(to top, #fbc2eb, #a6c1ee)';
            break;
        case 'clouds':
            bg = 'linear-gradient(to top, #bdc3c7, #2c3e50)';
            break;
        case 'rain':
        case 'drizzle':
            bg = 'linear-gradient(to top, #4e54c8, #8f94fb)';
            break;
        case 'snow':
            bg = 'linear-gradient(to top, #83a4d4, #b6fbff)';
            break;
        case 'thunderstorm':
            bg = 'linear-gradient(to top, #0f2027, #203a43, #2c5364)';
            break;
        default:
            bg = 'linear-gradient(to top, #74ebd5, #ACB6E5)';
    }
    appWrap.style.background = bg;
}

// Generate animated effects like rain or snow
function generateEffects(weather) {
    effectsEl.innerHTML = '';
    let count = 0;
    if (weather.toLowerCase() === 'rain' || weather.toLowerCase() === 'drizzle') count = 50;
    else if (weather.toLowerCase() === 'snow') count = 30;
    else if (weather.toLowerCase() === 'clouds') count = 10;

    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.classList.add('effect-item');
        el.style.left = `${Math.random() * 100}%`;
        el.style.animationDuration = `${2 + Math.random() * 3}s`;
        el.style.width = `${2 + Math.random() * 4}px`;
        el.style.height = `${2 + Math.random() * 4}px`;
        effectsEl.appendChild(el);
    }
}
