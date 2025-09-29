const searchBox = document.querySelector('.search-box');
const cityEl = document.querySelector('.city');
const dateEl = document.querySelector('.date');
const tempEl = document.querySelector('.temp');
const weatherEl = document.querySelector('.weather');
const hiLowEl = document.querySelector('.hi-low');
const appWrap = document.querySelector('.app-wrap');
const sunEl = document.querySelector('.sun');
const moonEl = document.querySelector('.moon');
const cloudsSvg = document.querySelector('.clouds');
const raindropsEl = document.querySelector('.raindrops');
const snowflakesEl = document.querySelector('.snowflakes');
const historyEl = document.querySelector('.search-history');

const apiKey = 'fcc8de7015bbb202209bbf0261babf4c';
let searchHistory = [];

// Search input events
searchBox.addEventListener('keypress', e => {
    if (e.key === 'Enter') fetchWeather(searchBox.value);
});

searchBox.addEventListener('input', () => {
    const val = searchBox.value.toLowerCase();
    if (!val) { historyEl.style.display = 'none'; return; }
    historyEl.innerHTML = '';
    searchHistory.filter(city => city.toLowerCase().includes(val))
        .forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.onclick = () => fetchWeather(city);
            historyEl.appendChild(li);
        });
    historyEl.style.display = 'block';
});

// Fetch weather from API
function fetchWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            if (!searchHistory.includes(city)) searchHistory.push(city);
            historyEl.style.display = 'none';
            updateUI(data);
        })
        .catch(() => alert('City not found!'));
}

// Update UI elements
function updateUI(data) {
    const now = new Date();
    cityEl.textContent = `${data.name}, ${data.sys.country}`;
    dateEl.textContent = now.toDateString();

    animateTemp(Math.round(data.main.temp));

    weatherEl.textContent = data.weather[0].main;
    weatherEl.setAttribute('data-weather', data.weather[0].main);

    hiLowEl.textContent = `H: ${Math.round(data.main.temp_max)}°c / L: ${Math.round(data.main.temp_min)}°c`;

    updateBackground(data.weather[0].main);
    updateSunMoon();
    generateClouds();
    generateRaindrops(data.weather[0].main);
    generateSnowflakes(data.weather[0].main);
}

// Animate temperature count
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

// Update background gradient based on weather
function updateBackground(weather) {
    let bg = '';
    switch (weather.toLowerCase()) {
        case 'clear': bg = 'linear-gradient(to top,#fbc2eb,#a6c1ee)'; break;
        case 'clouds': bg = 'linear-gradient(to top,#bdc3c7,#2c3e50)'; break;
        case 'rain': case 'drizzle': bg = 'linear-gradient(to top,#4e54c8,#8f94fb)'; break;
        case 'snow': bg = 'linear-gradient(to top,#83a4d4,#b6fbff)'; break;
        case 'thunderstorm': bg = 'linear-gradient(to top,#0f2027,#203a43,#2c5364)'; break;
        default: bg = 'linear-gradient(to top,#74ebd5,#ACB6E5)';
    }
    appWrap.style.background = bg;
}

// Show sun during day and moon at night
function updateSunMoon() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
        sunEl.style.opacity = '1';
        moonEl.style.opacity = '0';
    } else {
        sunEl.style.opacity = '0';
        moonEl.style.opacity = '1';
    }
}

// Generate clouds animation
function generateClouds() {
    cloudsSvg.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const cloud = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        cloud.setAttribute("cx", Math.random() * 500);
        cloud.setAttribute("cy", 50 + Math.random() * 30);
        cloud.setAttribute("rx", 60 + Math.random() * 40);
        cloud.setAttribute("ry", 20 + Math.random() * 10);
        cloud.setAttribute("fill", "rgba(255,255,255,0.6)");
        cloud.style.animation = `cloudMove ${20 + Math.random() * 20}s linear infinite`;
        cloudsSvg.appendChild(cloud);
    }
}

// Generate raindrops
function generateRaindrops(weather) {
    raindropsEl.innerHTML = '';
    if (weather.toLowerCase() === 'rain' || weather.toLowerCase() === 'drizzle') {
        for (let i = 0; i < 50; i++) {
            const drop = document.createElement('div');
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
            drop.style.width = '2px';
            drop.style.height = '10px';
            drop.classList.add('raindrop');
            raindropsEl.appendChild(drop);
        }
    }
}

// Generate snowflakes
function generateSnowflakes(weather) {
    snowflakesEl.innerHTML = '';
    if (weather.toLowerCase() === 'snow') {
        for (let i = 0; i < 30; i++) {
            const flake = document.createElement('div');
            flake.style.left = `${Math.random() * 100}%`;
            flake.style.animationDuration = `${3 + Math.random() * 2}s`;
            flake.style.width = `${2 + Math.random() * 3}px`;
            flake.style.height = `${2 + Math.random() * 3}px`;
            flake.classList.add('snowflake');
            snowflakesEl.appendChild(flake);
        }
    }
}
