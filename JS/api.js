// --- INÍCIO DO CÓDIGO JAVASCRIPT COM CORES REFINADAS ---

const weatherToggle = document.querySelector("#weather-toggle");

/**
 * FUNÇÃO ATUALIZADA com uma paleta de cores profissional e gradientes suaves.
 */
function getTempBackground(code, isDay) {
    // --- NOVA PALETA DE CORES PROFISSIONAL ---
    // Gradientes sutis com cores mais ricas e harmoniosas.
    const colors = {
        dayClear:   'linear-gradient(170deg, #3786dd, #63a4ff)',      // Céu azul vibrante e suave
        nightClear: 'linear-gradient(170deg, #1c2541, #3a506b)',      // Azul noite profundo
        cloudy:     'linear-gradient(170deg, #8a9aab, #b8c2cc)',      // Cinza-azulado de nuvens
        rain:       'linear-gradient(170deg, #4b6584, #778ca3)',      // Azul sombrio de chuva
        storm:      'linear-gradient(170deg, #2f3640, #485460)',      // Cinza tempestade escuro
        snowAndFog: 'linear-gradient(170deg, #d2dae2, #eef2f3)',      // Branco-acinzentado para neve/nevoeiro
    };

    switch (true) {
        case (code <= 1): // Céu Limpo ou Quase Limpo
            return isDay ? colors.dayClear : colors.nightClear;
        case (code >= 2 && code <= 3): // Nublado
            return colors.cloudy;
        case (code === 45 || code === 48): // Nevoeiro
            return colors.snowAndFog;
        case (code >= 51 && code <= 67 || (code >= 80 && code <= 82)): // Chuva, Garoa ou Pancadas
            return colors.rain;
        case (code >= 71 && code <= 77): // Neve
            return colors.snowAndFog;
        case (code >= 95 && code <= 99): // Trovoada
            return colors.storm;
        default:
            return colors.cloudy; // Padrão seguro
    }
}


function getWeatherDescription(code) {
    const descriptions = {
        0: 'Céu limpo', 1: 'Quase limpo', 2: 'Parcialmente nublado', 3: 'Nublado',
        45: 'Nevoeiro', 48: 'Nevoeiro com gelo', 51: 'Garoa leve',
        53: 'Garoa moderada', 55: 'Garoa intensa', 56: 'Garoa com gelo (leve)',
        57: 'Garoa com gelo (intensa)', 61: 'Chuva leve', 63: 'Chuva moderada',
        65: 'Chuva forte', 66: 'Chuva com gelo (leve)', 67: 'Chuva com gelo (forte)',
        71: 'Neve leve', 73: 'Neve moderada', 75: 'Neve forte', 77: 'Grãos de neve',
        80: 'Pancadas de chuva (leve)', 81: 'Pancadas de chuva (moderada)', 82: 'Pancadas de chuva (violenta)',
        85: 'Pancadas de neve (leve)', 86: 'Pancadas de neve (forte)',
        95: 'Trovoada', 96: 'Trovoada com granizo (leve)', 99: 'Trovoada com granizo (forte)',
    };
    return descriptions[code] || 'Condição desconhecida';
}

function getWeatherIconFaClass(code, isDay) {
    switch (true) {
        case (code === 0): return isDay ? 'fa-sun' : 'fa-moon';
        case (code === 1 || code === 2): return isDay ? 'fa-cloud-sun' : 'fa-cloud-moon';
        case (code === 3): return 'fa-cloud';
        case (code === 45 || code === 48): return 'fa-smog';
        case (code >= 51 && code <= 57): return 'fa-cloud-drizzle';
        case (code >= 61 && code <= 67): return 'fa-cloud-rain';
        case (code >= 71 && code <= 77): return 'fa-snowflake';
        case (code >= 80 && code <= 82): return 'fa-cloud-showers-heavy';
        case (code >= 95 && code <= 99): return 'fa-cloud-bolt';
        default: return 'fa-temperature-half';
    }
}

function showAlert(msg) {
    const alertBox = document.querySelector("#alert");
    alertBox.textContent = msg;
    if (msg) {
        alertBox.style.display = 'block';
        setTimeout(() => { alertBox.style.display = 'none'; }, 5000);
    } else {
        alertBox.style.display = 'none';
    }
}

function showInfo(weatherData) {
    if (!weatherData) {
        showAlert("Não foi possível obter os dados do clima.");
        return;
    }
    showAlert("");
    document.querySelector("#weather").classList.add("show");

    const description = getWeatherDescription(weatherData.weathercode);
    const faClass = getWeatherIconFaClass(weatherData.weathercode, weatherData.isDay);
    const backgroundStyle = getTempBackground(weatherData.weathercode, weatherData.isDay);

    document.querySelector("#title").textContent = `${weatherData.city}, ${weatherData.country}`;
    document.querySelector("#temp_value").innerHTML = `${weatherData.temp.toFixed(1).replace(".", ",")} <sup>C°</sup>`;
    document.querySelector("#temp_description").textContent = description;

    weatherToggle.querySelector("i").className = "fa-solid " + faClass;
    document.querySelector("#temp_icon").className = "fa-solid " + faClass;

    document.querySelector("#temp").style.background = backgroundStyle;

    document.querySelector("#temp_max").innerHTML = `${weatherData.tempMax.toFixed(1).replace(".", ",")} <sup>C°</sup>`;
    document.querySelector("#temp_min").innerHTML = `${weatherData.tempMin.toFixed(1).replace(".", ",")} <sup>C°</sup>`;
    document.querySelector("#humidity").textContent = `${weatherData.humidity}%`;
    document.querySelector("#wind").textContent = `${weatherData.windSpeed.toFixed(1)} km/h`;
    weatherToggle.querySelector("span").textContent = `${weatherData.temp.toFixed(1).replace(".", ",")}°C`;
}

async function fetchWeather(lat, lon) {
    const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,wind_speed_10m,relative_humidity_2m,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
    const response = await fetch(meteoUrl);
    const data = await response.json();

    if (!data.current || !data.daily) {
        throw new Error("Dados climáticos da API incompletos.");
    }

    return {
        temp: data.current.temperature_2m,
        tempMax: data.daily.temperature_2m_max[0],
        tempMin: data.daily.temperature_2m_min[0],
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        weathercode: data.current.weathercode,
        isDay: data.current.is_day
    };
}

// O restante do código permanece o mesmo...
async function fetchInitialLocation() {
    if (!("geolocation" in navigator)) {
        showAlert("Seu navegador não suporta geolocalização.");
        return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
        try {
            const { latitude, longitude } = position.coords;
            const geoRes = await fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`);
            const geoData = await geoRes.json();
            const cidade = geoData.address?.city || geoData.address?.town || geoData.address?.village || "Sua Localização";
            const pais = geoData.address?.country_code?.toUpperCase() || "";
            const weatherData = await fetchWeather(latitude, longitude);
            showInfo({ ...weatherData, city: cidade, country: pais });
        } catch (err) {
            console.error("Erro ao buscar clima inicial:", err);
            showAlert("Não foi possível carregar o clima da sua localização.");
        }
    }, () => {
        showAlert("Permita o acesso à localização para ver o clima local.");
    });
}

document.querySelector("#search").addEventListener("submit", async (e) => {
    e.preventDefault();
    showAlert("");
    const city = document.querySelector("#city_name").value.trim();
    if (!city) return;

    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();
        if (!geoData.results || geoData.results.length === 0) {
            showAlert(`Não foi possível encontrar a cidade "${city}". Tente novamente.`);
            document.querySelector("#title").textContent = "Cidade não encontrada";
            return;
        }
        const location = geoData.results[0];
        const { latitude, longitude, name, country_code } = location;
        const weatherData = await fetchWeather(latitude, longitude);
        showInfo({ ...weatherData, city: name, country: country_code });
    } catch (err) {
        console.error("Erro ao buscar a cidade:", err);
        showAlert("Ocorreu um erro ao buscar. Verifique sua conexão.");
    }
});

const container = document.querySelector("#container");
const closePopup = document.querySelector("#close-popup");
const weatherToggleBtn = document.querySelector("#weather-toggle");
let openedByClick = false;
weatherToggleBtn.addEventListener("mouseenter", () => !openedByClick && container.classList.add("show"));
weatherToggleBtn.addEventListener("mouseleave", () => setTimeout(() => !container.matches(":hover") && !openedByClick && container.classList.remove("show"), 200));
weatherToggleBtn.addEventListener("click", () => { container.classList.add("show"); openedByClick = true; });
closePopup.addEventListener("click", () => { container.classList.remove("show"); openedByClick = false; });
document.addEventListener("click", (e) => { if (!container.contains(e.target) && !weatherToggleBtn.contains(e.target) && openedByClick) { container.classList.remove("show"); openedByClick = false; }});
container.addEventListener("mouseleave", () => !openedByClick && container.classList.remove("show"));

fetchInitialLocation();

// --- FIM DO CÓDIGO JAVASCRIPT ---



// Lógica do Dólar (sem alterações)
let ultimoValorDolar = null;
async function atualizarDolar() {
  try {
    const res = await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL");
    const dados = await res.json();
    const valorAtual = parseFloat(dados.USDBRL.ask);
    let icone = '<i class="fa-solid fa-arrow-right" style="color: #999;"></i>';
    if (ultimoValorDolar !== null) {
      if (valorAtual > ultimoValorDolar) icone = '<i class="fa-solid fa-arrow-up" style="color: #00ad1d;"></i>';
      else if (valorAtual < ultimoValorDolar) icone = '<i class="fa-solid fa-arrow-down" style="color: #e00000;"></i>';
    }
    ultimoValorDolar = valorAtual;
    document.querySelector('.dolar').innerHTML = `${icone} <span>U$ ${valorAtual.toFixed(2)}</span>`;
  } catch (erro) {
    console.error("Erro ao buscar o valor do dólar:", erro);
    document.querySelector('.dolar').textContent = "Erro ao carregar dólar";
  }
}

// Inicia as funções ao carregar a página
window.addEventListener("load", () => {
    fetchInitialLocation();
    atualizarDolar();
    setInterval(atualizarDolar, 60000);
});

 