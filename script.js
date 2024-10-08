const cityInput = document.querySelector('.searchbar')
const searchBtn = document.querySelector('.search-btn')
const apiKey = '59845c3925f5519d48487c098c2ea7f6'

const locationTxt = document.querySelector('.location')
const tempTxt = document.querySelector('.weather-temp')
const conditionTxt = document.querySelector('.weather-desc')
const humidityValueTxt = document.getElementById('humidity')
const feelsLikeValueTxt = document.getElementById('feels-like')
const windValueTxt = document.getElementById('wind')
const weatherIcon = document.querySelector('.weather-icon')
const dateTxt = document.querySelector('.date-date')
const dayTxt = document.querySelector('.date-day')

const forecastItemsContainer = document.querySelector('.forecast-item-container')

searchBtn.addEventListener('click', ()=>{
    if (cityInput.value.trim() !='') {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})
cityInput.addEventListener('keydown', (event) =>{
    if(event.key == 'Enter' &&
        cityInput.value.trim() != ''
    ) {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    const response = await fetch(apiUrl)
    return response.json()
}

function getWeatherIcon(id) {
    //console.log(id);
    if (id <= 232) return "thunderstorm"
    if (id <= 321) return "rainy_light"
    if (id <= 531) return "rainy"
    if (id <= 622) return "weather_snowy"
    if (id <= 781) return "mist"
    if (id <= 800) return "clear_day"
    else return "cloud"
}

function getCurrentDate() {
    const currentDate = new Date()
    const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }
    return currentDate.toLocaleDateString('en-GB', options)
}

function getCurrentDay() {
    const currentDate = new Date()
    const options = {
        weekday: 'long'
    }
    return currentDate.toLocaleDateString('en-GB', options)
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city)

    if (weatherData.cod != 200) {
        alert("City not found")
        return
    }

    const  {
        name: cityname,
        main: { temp, humidity, feels_like },
        weather: [{ id, main}],
        wind: { speed },
        sys: { country }
    } = weatherData

    locationTxt.textContent = cityname + ', ' + country
    tempTxt.textContent = Math.round(temp) + ' °C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + ' %'
    feelsLikeValueTxt.textContent = feels_like + ' °C'
    windValueTxt.textContent = speed + ' m/s'
    dateTxt.textContent

    dateTxt.textContent = getCurrentDate()
    dayTxt.textContent = getCurrentDay()
    // console.log(weatherData)
    // getWeatherIcon(id)
    document.getElementById("weather-icon").innerHTML = getWeatherIcon(id)
    await updateForecastsInfo(city)
}

async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData('forecast', city)
    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forecastItemsContainer.innerHTML = ''
    forecastsData.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTaken) &&
            !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastItems(forecastWeather)
        }
    })
}

function updateForecastItems(weatherData) {
    //   console.log(weatherData)
    const {
        dt_txt: date, 
        weather: [{ id }],
        main: { temp }
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)
    //console.log(getWeatherIcon(id))
    const forecastItem = `
        <div class="forecast-item">
            <span ID="weather-icon" class="week-forecast-icon">${getWeatherIcon(id)}</span>
            <h5 class="forecast-item-date">${dateResult}</h5>
            <h5 class="forecast-item-temp">${Math.round(temp) + ' °C'}</h5>
        </div>
    `
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}