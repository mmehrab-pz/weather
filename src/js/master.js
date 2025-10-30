// https://api.openweathermap.org/data/2.5/forecast?q=tehran&units=metric&appid=ab1bcc592ad966be21f0817b800ba129

// const {
//     createElement
// } = require("react");


// -----------------------------------
window.addEventListener("load", () => {
    getData();
});
// ----------------nav bar and pages

const pages = document.querySelectorAll('#pages>section')

function check_nav_li() {
    document.querySelectorAll('.nav-ul>li').forEach((item, index, arr) => {
        item.addEventListener('click', () => {
            menuMobile.classList.remove('top-0')
            menuMobile.classList.add('top-full')
            arr.forEach((item) => {
                item.classList.remove('active-nav')
            })
            item.classList.add('active-nav')
            if (item.dataset.name == 'search') {
                document.getElementById('searchBtn').classList.add('active-nav')
            }
            let id = item.dataset.name
            pages.forEach((page) => {
                page.classList.add('hidden')
                if (page.dataset.name == id) {
                    page.classList.remove('hidden')
                }
            })

        })
    })
}
check_nav_li()
// ----------------open and close menu mobile
const menuMobile = document.getElementById('menu-mobile')

document.querySelectorAll('.open-menu').forEach((item) => {
    item.addEventListener('click', () => {
        menuMobile.classList.remove('top-full')
        menuMobile.classList.add('top-0')

    })
})

document.getElementById('close-menu').addEventListener('click', () => {
    menuMobile.classList.remove('top-0')
    menuMobile.classList.add('top-full')
})
// ----------------loading
const loaders = document.querySelectorAll('.loading')

function showLoading() {
    loaders.forEach((item) => {
        item.classList.remove('hidden')
    })
}

function hideLoading() {
    loaders.forEach((item) => {
        item.classList.add('hidden')
    })
}

// -----------------------------------get creat map
let map;

function createMap(currentLon, currentLat) {
    if (!map) {
        // 👇 فقط یک‌بار نقشه ساخته بشه
        map = L.map('map').setView([currentLat, currentLon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    } else {

        map.setView([currentLat, currentLon], 10);
    }

    if (map.currentMarker) {
        map.removeLayer(map.currentMarker);
    }

    map.currentMarker = L.marker([currentLat, currentLon])
        .addTo(map)
        .bindPopup(currentCity)
        .openPopup();
}
// -----------------------------------weather api
const API_KEY = 'ab1bcc592ad966be21f0817b800ba129'
let currentTemp = ''
let currentCity = 'tehran'
let currentPressure = ''
let currentHumidity = ''
let currentVisibility = ''
let currentWind = ''
let currentDescription = ''
let currentMain = ''
let currentDt = ''
let currentDate = ''
let currentTime = ''
let currentLat = ''
let currentLon = ''
let forecastDays = [];
let forecastNights = [];

async function getData() {
    showLoading()
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${currentCity}&units=metric&appid=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== "200") {
            throw new Error(data.message || "City not found");
        }

        currentTemp = data.list[0].main.temp;
        currentPressure = data.list[0].main.pressure;
        currentHumidity = data.list[0].main.humidity;
        currentVisibility = data.list[0].visibility;
        currentWind = data.list[0].wind.speed;
        currentDescription = data.list[0].weather[0].description;
        currentMain = data.list[0].weather[0].main;
        currentLat = data.city.coord.lat;
        currentLon = data.city.coord.lon;
        currentDt = data.list[0].dt_txt;


        switch (temperature) {
            case 'celsius':
                currentTemp = currentTemp + '°C'
                break;
            case 'fahrenheit':
                currentTemp = parseInt(((currentTemp * 9.5) + 32)) + '°F'
                break;
            case 'kelvin':
                currentTemp = parseInt((currentTemp + 273.15)) + 'K'
                break;
            default:
                currentTemp = currentTemp + '°C'
                break;
        }
        switch (windSpeed) {
            case 'm/s':
                currentWind = currentWind + ' m/s'
                break;
            case 'km/h':
                currentWind = currentWind * 3.6 + ' km/h'
                break;
            case 'mph':
                currentWind = currentWind * 2.237 + ' mph'
                break;
            default:
                currentWind = currentWind + ' m/s'
                break;
        }
        switch (pressure) {
            case 'hPa':
                currentPressure = currentPressure + ' hPa'
                break;
            case 'atm':
                currentPressure = currentPressure * 1013.25 + ' atm'
                break;
            case 'Pa':
                currentPressure = currentPressure * 100 + ' Pa'
                break;
            case 'mmHg':
                currentPressure = currentPressure * 0.75 + ' mmHg'
                break;
            default:
                currentPressure = currentPressure + ' hPa'
                break;
        }


        const [date, time] = currentDt.split(" ");
        currentDate = date;
        currentTime = time;

        // 🟢 استخراج پیش‌بینی ۵ روز آینده (ظهر هر روز و شب هر روز)
        forecastDays = [];
        forecastNights = [];
        let tempDay = ''
        let tempNight = ''

        data.list.forEach(item => {
            if (item.dt_txt.includes("12:00:00")) {
                const dateObj = new Date(item.dt_txt);
                const dayName = dateObj.toLocaleDateString("en-US", {
                    weekday: "short"
                });
                const dateStr = dateObj.toISOString().split("T")[0];
                let temp = item.main.temp;
                let dayWind = item.wind.speed
                let dayPressure = item.main.pressure
                const dayHumidity = item.main.humidity
                const dayVisibility = item.visibility
                const dayDes = item.weather[0].description
                switch (temperature) {
                    case 'celsius':
                        temp = temp + '°C'
                        break;
                    case 'fahrenheit':
                        temp = parseInt(((temp * 9.5) + 32)) + '°F'
                        break;
                    case 'kelvin':
                        temp = parseInt((temp + 273.15)) + 'K'
                        break;
                    default:
                        temp = temp + '°C'
                        break;
                }
                switch (windSpeed) {
                    case 'm/s':
                        dayWind = dayWind + ' m/s'
                        break;
                    case 'km/h':
                        dayWind = dayWind * 3.6 + ' km/h'
                        break;
                    case 'mph':
                        dayWind = dayWind * 2.237 + ' mph'
                        break;
                    default:
                        dayWind = dayWind + ' m/s'
                        break;
                }
                switch (pressure) {
                    case 'hPa':
                        dayPressure = dayPressure + ' hPa'
                        break;
                    case 'atm':
                        dayPressure = dayPressure * 1013.25 + ' atm'
                        break;
                    case 'Pa':
                        dayPressure = dayPressure * 100 + ' Pa'
                        break;
                    case 'mmHg':
                        dayPressure = dayPressure * 0.75 + ' mmHg'
                        break;
                    default:
                        dayPressure = dayPressure + ' hPa'
                        break;
                }
                forecastDays.push({
                    city: currentCity,
                    day: dayName,
                    date: dateStr,
                    time: '12:00:00',
                    description: dayDes,
                    temp: temp,
                    pressure: dayPressure,
                    humidity: dayHumidity,
                    visibility: dayVisibility,
                    wind: dayWind
                });
            }
            if (item.dt_txt.includes("03:00:00")) {
                const dateObj = new Date(item.dt_txt);
                const dayName = dateObj.toLocaleDateString("en-US", {
                    weekday: "short"
                });
                const dateStr = dateObj.toISOString().split("T")[0];
                let temp = item.main.temp;
                let dayWind = item.wind.speed
                let dayPressure = item.main.pressure
                const dayHumidity = item.main.humidity
                const dayVisibility = item.visibility
                const dayDes = item.weather[0].description
                switch (temperature) {
                    case 'celsius':
                        temp = temp + '°C'
                        break;
                    case 'fahrenheit':
                        temp = parseInt(((temp * 9.5) + 32)) + '°F'
                        break;
                    case 'kelvin':
                        temp = parseInt((temp + 273.15)) + 'K'
                        break;
                    default:
                        temp = temp + '°C'
                        break;
                }
                switch (windSpeed) {
                    case 'm/s':
                        dayWind = dayWind + ' m/s'
                        break;
                    case 'km/h':
                        dayWind = dayWind * 3.6 + ' km/h'
                        break;
                    case 'mph':
                        dayWind = dayWind * 2.237 + ' mph'
                        break;
                    default:
                        dayWind = dayWind + ' m/s'
                        break;
                }
                switch (pressure) {
                    case 'hPa':
                        dayPressure = dayPressure + ' hPa'
                        break;
                    case 'atm':
                        dayPressure = dayPressure * 1013.25 + ' atm'
                        break;
                    case 'Pa':
                        dayPressure = dayPressure * 100 + ' Pa'
                        break;
                    case 'mmHg':
                        dayPressure = dayPressure * 0.75 + ' mmHg'
                        break;
                    default:
                        dayPressure = dayPressure + ' hPa'
                        break;
                }
                forecastNights.push({
                    city: currentCity,
                    day: dayName,
                    date: dateStr,
                    time: '03:00:00',
                    description: dayDes,
                    temp: temp,
                    pressure: dayPressure,
                    humidity: dayHumidity,
                    visibility: dayVisibility,
                    wind: dayWind
                });
            }
        });

        console.log(forecastDays);
        console.log(forecastNights);


        console.log("✅ Weather data for:", currentCity);
        console.log([currentTemp, currentPressure, currentHumidity, currentWind, currentDescription, currentDt]);

        creat_current_weather();
        creat_forecast_section();
        createTemperatureChart();
        createWindChart();
        createHumidityChart();
        createPressureChart();
        createMap(currentLon, currentLat);
        create_city_box()
        check_nav_li()
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        city_not_found()
    } finally {
        hideLoading();
    }
}
// -----------------------------------creat current weather section
function creat_current_weather() {
    document.getElementById('current-weather').innerHTML = `
                                <div class="loading hidden">
                                    <div class="loader"></div>
                                </div>
                                <h3 class="font-['400'] text-[20px] capitalize text-[white]">current weather</h3>
                                <div class="w-full flex items-center">
                                    <figure>
                                        <img src="src/asset/img/icon/${currentMain}.png" alt="" class="w-[120px]">
                                    </figure>
                                    <h3 class="text-[40px] lg:text-[40px] xl:text-[50px] 2xl:text-[70px] font-['600'] ml-[30px]">
                                        ${currentTemp}
                                    </h3>
                                </div>
                                <div class="w-full flex flex-wrap items-center gap-2.5">
                                    <!-- ----------sky -->
                                    <figure title='sky' class="flex items-center px-2.5 py-1 rounded-[10px] bg-[#ffffff21] backdrop-blur-[35px]">
                                        <img src="src/asset/img/icon/sky.png" alt="" class="w-[22px] xl:w-[25px]">
                                        <figcaption
                                            class="font-['400'] text-[12px] xl:text-[14px] 2xl:text-[16px] capitalize text-[white] ml-1.5">
                                            ${currentDescription}
                                        </figcaption>
                                    </figure>
                                    <!-- ----------city -->
                                    <figure title='city' class="flex items-center px-2.5 py-1 rounded-[10px] bg-[#ffffff21] backdrop-blur-[35px]">
                                        <img src="src/asset/img/icon/city.png" alt="" class="w-[22px] xl:w-[25px]">
                                        <figcaption
                                            class="font-['400'] text-[12px] xl:text-[14px] 2xl:text-[16px] capitalize text-[white] ml-1.5">
                                            ${currentCity}
                                        </figcaption>
                                    </figure>
                                    <!-- ----------date -->
                                    <figure title='date' class="flex items-center px-2.5 py-1 rounded-[10px] bg-[#ffffff21] backdrop-blur-[35px]">
                                        <img src="src/asset/img/icon/date.png" alt="" class="w-[22px] xl:w-[25px]">
                                        <figcaption
                                            class="font-['400'] text-[12px] xl:text-[14px] 2xl:text-[16px] capitalize text-[white] ml-1.5">
                                            ${currentDate}
                                        </figcaption>
                                    </figure>
                                    <!-- ----------time -->
                                    <figure title='time' class="flex items-center px-2.5 py-1 rounded-[10px] bg-[#ffffff21] backdrop-blur-[35px]">
                                        <img src="src/asset/img/icon/time.png" alt="" class="w-[22px] xl:w-[25px]">
                                        <figcaption
                                            class="font-['400'] text-[12px] xl:text-[14px] 2xl:text-[16px] capitalize text-[white] ml-1.5">
                                            ${currentTime}
                                        </figcaption>
                                    </figure>
                                    <!-- ----------Humidity -->
                                    <figure title='Humidity' class="flex items-center px-2.5 py-1 rounded-[10px] bg-[#ffffff21] backdrop-blur-[35px]">
                                        <img src="src/asset/img/icon/Humidity.png" alt="" class="w-[22px] xl:w-[25px]">
                                        <figcaption
                                            class="font-['400'] text-[12px] xl:text-[14px] 2xl:text-[16px] text-[white] ml-1.5">
                                            ${currentHumidity}
                                        </figcaption>
                                    </figure>
                                    <!-- ----------visibility -->
                                    <figure title='visibility' class="flex items-center px-2.5 py-1 rounded-[10px] bg-[#ffffff21] backdrop-blur-[35px]">
                                        <img src="src/asset/img/icon/visibility.png" alt="" class="w-[22px] xl:w-[25px]">
                                        <figcaption
                                            class="font-['400'] text-[12px] xl:text-[14px] 2xl:text-[16px] text-[white] ml-1.5">
                                            ${currentVisibility}
                                        </figcaption>
                                    </figure>
                                    <!-- ----------pressure -->
                                    <figure title='pressure' class="flex items-center px-2.5 py-1 rounded-[10px] bg-[#ffffff21] backdrop-blur-[35px]">
                                        <img src="src/asset/img/icon/pressure.png" alt="" class="w-[22px] xl:w-[25px]">
                                        <figcaption
                                            class="font-['400'] text-[12px] xl:text-[14px] 2xl:text-[16px] text-[white] ml-1.5">
                                            ${currentPressure}
                                        </figcaption>
                                    </figure>
                                    <!-- ----------wind -->
                                    <figure title='wind speed' class="flex items-center px-2.5 py-1 rounded-[10px] bg-[#ffffff21] backdrop-blur-[35px]">
                                        <img src="src/asset/img/icon/wind.png" alt="" class="w-[22px] xl:w-[25px]">
                                        <figcaption
                                            class="font-['400'] text-[12px] xl:text-[14px] 2xl:text-[16px] text-[white] ml-1.5">
                                            ${currentWind}
                                        </figcaption>
                                    </figure>
                                </div>
`
}
// -----------------------------------creat forecast weather section
function creat_forecast_weather() {
    document.getElementById('current-weather').innerHTML = `
                                <div class="loading hidden">
                                    <div class="loader"></div>
                                </div>
                                <h3 class="font-['400'] text-[20px] capitalize text-[white]">current weather</h3>
                                <div class="w-full flex items-center">
                                    <figure>
                                        <img src="src/asset/img/icon/${forecastDays[forecastId].description}.png" alt="" class="w-[120px]">
                                    </figure>
                                    <h3 class="text-[40px] lg:text-[40px] xl:text-[50px] 2xl:text-[70px] font-['600'] ml-[30px]">
                                        ${forecastDays[forecastId].temp}°C
                                    </h3>
                                </div>
                                <div class="w-full flex flex-wrap items-center gap-2.5">
                                    <!-- ----------sky -->
                                    <figure title='sky' class="flex items-center px-2.5 py-1 rounded-[10px] bg-[#ffffff21] backdrop-blur-[35px]">
                                        <img src="src/asset/img/icon/sky.png" alt="" class="w-[22px] xl:w-[25px]">
                                        <figcaption
                                            class="font-['400'] text-[12px] xl:text-[14px] 2xl:text-[16px] capitalize text-[white] ml-1.5">
                                            ${forecastDays[forecastId].description}
                                        </figcaption>
                                    </figure>
                                    <!-- ----------city -->
                                    <figure title='city' class="flex items-center px-2.5 py-1 rounded-[10px] bg-[#ffffff21] backdrop-blur-[35px]">
                                        <img src="src/asset/img/icon/city.png" alt="" class="w-[22px] xl:w-[25px]">
                                        <figcaption
                                            class="font-['400'] text-[12px] xl:text-[14px] 2xl:text-[16px] capitalize text-[white] ml-1.5">
                                            ${forecastDays[forecastId].city}
                                        </figcaption>
                                    </figure>
                                    <!-- ----------date -->
                                    <figure title='date' class="flex items-center px-2.5 py-1 rounded-[10px] bg-[#ffffff21] backdrop-blur-[35px]">
                                        <img src="src/asset/img/icon/date.png" alt="" class="w-[22px] xl:w-[25px]">
                                        <figcaption
                                            class="font-['400'] text-[12px] xl:text-[14px] 2xl:text-[16px] capitalize text-[white] ml-1.5">
                                            ${forecastDays[forecastId].date}
                                        </figcaption>
                                    </figure>
                                    <!-- ----------time -->
                                    <figure title='time' class="flex items-center px-2.5 py-1 rounded-[10px] bg-[#ffffff21] backdrop-blur-[35px]">
                                        <img src="src/asset/img/icon/time.png" alt="" class="w-[22px] xl:w-[25px]">
                                        <figcaption
                                            class="font-['400'] text-[12px] xl:text-[14px] 2xl:text-[16px] capitalize text-[white] ml-1.5">
                                            ${forecastDays[forecastId].time}
                                        </figcaption>
                                    </figure>
                                    <!-- ----------Humidity -->
                                    <figure title='Humidity' class="flex items-center px-2.5 py-1 rounded-[10px] bg-[#ffffff21] backdrop-blur-[35px]">
                                        <img src="src/asset/img/icon/Humidity.png" alt="" class="w-[22px] xl:w-[25px]">
                                        <figcaption
                                            class="font-['400'] text-[12px] xl:text-[14px] 2xl:text-[16px] text-[white] ml-1.5">
                                            ${forecastDays[forecastId].humidity}
                                        </figcaption>
                                    </figure>
                                    <!-- ----------visibility -->
                                    <figure title='visibility' class="flex items-center px-2.5 py-1 rounded-[10px] bg-[#ffffff21] backdrop-blur-[35px]">
                                        <img src="src/asset/img/icon/visibility.png" alt="" class="w-[22px] xl:w-[25px]">
                                        <figcaption
                                            class="font-['400'] text-[12px] xl:text-[14px] 2xl:text-[16px] text-[white] ml-1.5">
                                            ${forecastDays[forecastId].visibility}
                                        </figcaption>
                                    </figure>
                                    <!-- ----------pressure -->
                                    <figure title='pressure' class="flex items-center px-2.5 py-1 rounded-[10px] bg-[#ffffff21] backdrop-blur-[35px]">
                                        <img src="src/asset/img/icon/pressure.png" alt="" class="w-[22px] xl:w-[25px]">
                                        <figcaption
                                            class="font-['400'] text-[12px] xl:text-[14px] 2xl:text-[16px] text-[white] ml-1.5">
                                            ${forecastDays[forecastId].pressure}
                                        </figcaption>
                                    </figure>
                                    <!-- ----------wind -->
                                    <figure title='wind speed' class="flex items-center px-2.5 py-1 rounded-[10px] bg-[#ffffff21] backdrop-blur-[35px]">
                                        <img src="src/asset/img/icon/wind.png" alt="" class="w-[22px] xl:w-[25px]">
                                        <figcaption
                                            class="font-['400'] text-[12px] xl:text-[14px] 2xl:text-[16px] text-[white] ml-1.5">
                                            ${forecastDays[forecastId].wind}
                                        </figcaption>
                                    </figure>
                                </div>
`
}

// -----------------------------------creat forecast section
function creat_forecast_section() {
    console.log(forecastDays);

    document.getElementById('forecast-weather').innerHTML = ``
    document.getElementById('forecast-weather').innerHTML = `
                                    <li data-id="0"
                                        class="w-full forecast flex justify-between items-center cursor-pointer py-2 px-2.5 rounded-2xl border-b border-b-dark-border hover:*:text-[#59deff] hover:**:text-[#59deff]">
                                        <figure class="flex items-center">
                                            <img src="src/asset/img/icon/${forecastDays[0].description}.png" class="w-[25px]">
                                            <figcaption class="font-['400'] text-[16px] capitalize text-[white] duration-100 ml-4">
                                                ${forecastDays[0].temp} /  ${forecastNights[0].temp}
                                            </figcaption>
                                        </figure>
                                        <h6 class="font-['400'] text-[14px] capitalize text-[white] duration-100">${forecastDays[0].date}/${forecastDays[0].day}</h6>
                                    </li>
                                    <li data-id="1"
                                        class="w-full forecast flex justify-between items-center cursor-pointer py-2 px-2.5 rounded-2xl border-b border-b-dark-border hover:*:text-[#59deff] hover:**:text-[#59deff]">
                                        <figure class="flex items-center">
                                            <img src="src/asset/img/icon/${forecastDays[1].description}.png" class="w-[25px]">
                                            <figcaption class="font-['400'] text-[16px] capitalize duration-100 text-[white] ml-4">
                                                ${forecastDays[1].temp} /  ${forecastNights[1].temp}
                                            </figcaption>
                                        </figure>
                                        <h6 class="font-['400'] text-[14px] capitalize text-[white] duration-100">${forecastDays[1].date}/${forecastDays[1].day}</h6>
                                    </li>
                                    <li data-id="2"
                                        class="w-full forecast flex justify-between items-center cursor-pointer py-2 px-2.5 rounded-2xl border-b border-b-dark-border hover:*:text-[#59deff] hover:**:text-[#59deff]">
                                        <figure class="flex items-center">
                                            <img src="src/asset/img/icon/${forecastDays[2].description}.png" class="w-[25px]">
                                            <figcaption class="font-['400'] text-[16px] capitalize duration-100 text-[white] ml-4">
                                                ${forecastDays[2].temp} /  ${forecastNights[2].temp}
                                            </figcaption>
                                        </figure>
                                        <h6 class="font-['400'] text-[14px] capitalize text-[white] duration-100">${forecastDays[2].date}/${forecastDays[2].day}</h6>
                                    </li>
                                    <li data-id="3"
                                        class="w-full forecast flex justify-between items-center cursor-pointer py-2 px-2.5 rounded-2xl border-b border-b-dark-border hover:*:text-[#59deff] hover:**:text-[#59deff]">
                                        <figure class="flex items-center">
                                            <img src="src/asset/img/icon/${forecastDays[3].description}.png" class="w-[25px]">
                                            <figcaption class="font-['400'] text-[16px] duration-100 capitalize text-[white] ml-4">
                                                ${forecastDays[3].temp} /  ${forecastNights[3].temp}
                                            </figcaption>
                                        </figure>
                                        <h6 class="font-['400'] text-[14px] capitalize text-[white] duration-100">${forecastDays[3].date}/${forecastDays[3].day}</h6>
                                    </li>
                                    <li data-id="4"
                                        class="w-full forecast flex justify-between items-center cursor-pointer py-2 px-2.5 rounded-2xl border-b border-b-dark-border hover:*:text-[#59deff] hover:**:text-[#59deff]">
                                        <figure class="flex items-center">
                                            <img src="src/asset/img/icon/${forecastDays[4].description}.png" class="w-[25px]">
                                            <figcaption class="font-['400'] text-[16px] duration-100 capitalize text-[white] ml-4">
                                                ${forecastDays[4].temp} /  ${forecastNights[4].temp}
                                            </figcaption>
                                        </figure>
                                        <h6 class="font-['400'] text-[14px] capitalize text-[white] duration-100">${forecastDays[4].date}/${forecastDays[4].day}</h6>
                                    </li>
    `
    forecastList()
}

// -----------------------------------popular cities
document.querySelectorAll('#popular-cities>li').forEach((item, i, arr) => {
    item.addEventListener('click', () => {
        document.getElementById('forecast-weather').innerHTML = ``
    })
    item.addEventListener('click', async () => {
        arr.forEach((item) => {
            item.classList.remove('active-nav2')

        })
        item.classList.add('active-nav2')
        const cityName = item.firstElementChild.lastElementChild.innerText.trim();
        document.getElementById('current-weather').innerHTML = `
             <div class="loading ">
                 <div class="loader"></div>
             </div>
`
        currentCity = cityName;
        await new Promise(r => setTimeout(r, 150));
        await getData();
        forecastList()

    });
});
// -----------------------------------forecast
let forecastId = ''

function forecastList() {
    document.querySelectorAll('.forecast').forEach((item, i, arr) => {
        item.addEventListener('click', () => {
            arr.forEach((item) => {
                item.classList.remove('active-nav2')
            })
            forecastId = item.dataset.id
            item.classList.add('active-nav2')
            console.log(forecastId);
            creat_forecast_weather()
        })
    });

}

// -----------------------------------setting option
let temperature = localStorage.getItem('savedTemperature')
let windSpeed = localStorage.getItem('savedWindSpeed')
let pressure = localStorage.getItem('savedPressure')
let precipitation = localStorage.getItem('savedPrecipitation')
let distance = localStorage.getItem('savedDistance')

document.querySelectorAll('.temperature>div').forEach((item, i, all) => {
    item.addEventListener('click', () => {
        settingOption(item, all)
        temperature = item.innerText
        localStorage.setItem('savedTemperature', item.innerText)
        getData()
    })
    if (item.innerText.trim() === temperature) {
        console.log(temperature);


        settingOption(item, all)
    }
})
document.querySelectorAll('.windSpeed>div').forEach((item, i, all) => {
    item.addEventListener('click', () => {
        settingOption(item, all)
        windSpeed = item.innerText
        localStorage.setItem('savedWindSpeed', item.innerText)
        getData()
    })
    if (item.innerText.trim() === windSpeed) {
        settingOption(item, all)
    }
})
document.querySelectorAll('.pressure>div').forEach((item, i, all) => {
    item.addEventListener('click', () => {
        settingOption(item, all)
        pressure = item.innerText
        localStorage.setItem('savedPressure', item.innerText)
        getData()
    })
    if (item.innerText.trim() === pressure) {
        settingOption(item, all)
    }
})
document.querySelectorAll('.precipitation>div').forEach((item, i, all) => {
    item.addEventListener('click', () => {
        settingOption(item, all)
        precipitation = item.innerText
        localStorage.setItem('savedPrecipitation', item.innerText)
    })
    if (item.innerText.trim() === precipitation) {
        settingOption(item, all)
    }
})
document.querySelectorAll('.distance>div').forEach((item, i, all) => {
    item.addEventListener('click', () => {
        settingOption(item, all)
        distance = item.innerText
        localStorage.setItem('savedDistance', item.innerText)
    })
    if (item.innerText.trim() === distance) {
        settingOption(item, all)
    }
})

function settingOption(item, all) {
    all.forEach(item => item.classList.remove('setting-active'))
    item.classList.add('setting-active')

    document.getElementById('loading2').classList.remove('hidden')

    setTimeout(() => {
        document.getElementById('loading2').classList.add('hidden')
    }, 1000);
}

// -----------------------------------alert
const alert = document.getElementById('alert')
const alert2 = document.getElementById('alert2')

document.querySelectorAll('.alert').forEach(item => {
    item.addEventListener('click', () => {
        alert.classList.remove('-bottom-[10%]')
        alert.classList.add('bottom-0')
        setTimeout(() => {
            alert.classList.remove('bottom-0')
            alert.classList.add('-bottom-[10%]')

        }, 2000);
    })
})

function city_not_found() {
    alert2.classList.remove('-bottom-[10%]')
    alert2.classList.add('bottom-0')
    setTimeout(() => {
        alert2.classList.remove('bottom-0')
        alert2.classList.add('-bottom-[10%]')

    }, 2000);
}
// ------------------------------------------------------------------------------------charts
let tempChart = null;
let windChart = null;
let humidityChart = null;
let pressureChart = null;

function createTemperatureChart() {

    if (tempChart) {
        tempChart.destroy();
    }

    const data = forecastDays.map(item => ({
        day: item.day,
        count: Number(item.temp.replace(/[^\d.-]/g, ''))
    }));
    const nightData = forecastNights.map(item => ({
        day: item.day,
        count: Number(item.temp.replace(/[^\d.-]/g, ''))
    }));


    tempChart = new Chart(
        document.getElementById('temperatureChart'), {
            type: 'line',
            data: {
                labels: data.map(row => row.day),
                datasets: [{
                        label: 'Day temperature',
                        data: data.map(row => row.count),
                        fill: false,
                        borderColor: '#ff8a00',
                        backgroundColor: '#000000',
                        pointBackgroundColor: 'white',
                        pointBorderColor: 'black',
                        tension: 0.3
                    },
                    {
                        label: 'night temperature',
                        data: nightData.map(row => row.count),
                        fill: false,
                        borderColor: '#59deff',
                        backgroundColor: '#000000',
                        pointBackgroundColor: 'white',
                        pointBorderColor: 'black',
                        tension: 0.2
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        grid: {
                            display: true,
                            color: '#ffffff33'
                        },
                        ticks: {
                            color: '#fff'
                        }

                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: '#ffffff33'
                        },
                        ticks: {
                            color: '#fff'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1e1e1e',
                        titleColor: '#59deff',
                        bodyColor: '#ffffff',
                        borderColor: '#59deff',
                        borderWidth: 1,
                        titleFont: {
                            size: 14,
                            weight: 'bold',
                            family: 'Arial'
                        },
                        bodyFont: {
                            size: 13,
                            family: 'Arial'
                        },
                        callbacks: {
                            label: function (context) {
                                return context.formattedValue;
                            }
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        }
    );
}

function createWindChart() {

    if (windChart) {
        windChart.destroy();
    }

    const data = forecastDays.map(item => ({
        day: item.day,
        count: Number(item.wind.replace(/[^\d.-]/g, ''))
    }));
    const nightData = forecastNights.map(item => ({
        day: item.day,
        count: Number(item.wind.replace(/[^\d.-]/g, ''))
    }));

    windChart = new Chart(
        document.getElementById('windChart'), {
            type: 'line',
            data: {
                labels: data.map(row => row.day),
                datasets: [{
                        label: 'Day speed wind',
                        data: data.map(row => row.count),
                        fill: false,
                        borderColor: '#ff8a00',
                        backgroundColor: '#000000',
                        pointBackgroundColor: 'white',
                        pointBorderColor: 'black',
                        tension: 0.3
                    },
                    {
                        label: 'night speed wind',
                        data: nightData.map(row => row.count),
                        fill: false,
                        borderColor: '#59deff',
                        backgroundColor: '#000000',
                        pointBackgroundColor: 'white',
                        pointBorderColor: 'black',
                        tension: 0.2
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        grid: {
                            display: true,
                            color: '#ffffff33'
                        },
                        ticks: {
                            color: '#fff'
                        }

                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: '#ffffff33'
                        },
                        ticks: {
                            color: '#fff'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1e1e1e',
                        titleColor: '#59deff',
                        bodyColor: '#ffffff',
                        borderColor: '#59deff',
                        borderWidth: 1,
                        titleFont: {
                            size: 14,
                            weight: 'bold',
                            family: 'Arial'
                        },
                        bodyFont: {
                            size: 13,
                            family: 'Arial'
                        },
                        callbacks: {
                            label: function (context) {
                                return context.formattedValue;
                            }
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        }
    );
}

function createPressureChart() {

    if (pressureChart) {
        pressureChart.destroy();
    }

    const data = forecastDays.map(item => ({
        day: item.day,
        count: Number(item.pressure.replace(/[^\d.-]/g, ''))
    }));
    const nightData = forecastNights.map(item => ({
        day: item.day,
        count: Number(item.pressure.replace(/[^\d.-]/g, ''))
    }));

    pressureChart = new Chart(
        document.getElementById('pressureChart'), {
            type: 'line',
            data: {
                labels: data.map(row => row.day),
                datasets: [{
                        label: 'Day pressure',
                        data: data.map(row => row.count),
                        fill: false,
                        borderColor: '#ff8a00',
                        backgroundColor: '#000000',
                        pointBackgroundColor: 'white',
                        pointBorderColor: 'black',
                        tension: 0.3
                    },
                    {
                        label: 'night pressure',
                        data: nightData.map(row => row.count),
                        fill: false,
                        borderColor: '#59deff',
                        backgroundColor: '#000000',
                        pointBackgroundColor: 'white',
                        pointBorderColor: 'black',
                        tension: 0.2
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        grid: {
                            display: true,
                            color: '#ffffff33'
                        },
                        ticks: {
                            color: '#fff'
                        }

                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: '#ffffff33'
                        },
                        ticks: {
                            color: '#fff'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1e1e1e',
                        titleColor: '#59deff',
                        bodyColor: '#ffffff',
                        borderColor: '#59deff',
                        borderWidth: 1,
                        titleFont: {
                            size: 14,
                            weight: 'bold',
                            family: 'Arial'
                        },
                        bodyFont: {
                            size: 13,
                            family: 'Arial'
                        },
                        callbacks: {
                            label: function (context) {
                                return context.formattedValue;
                            }
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        }
    );
}

function createHumidityChart() {
    if (humidityChart) {
        humidityChart.destroy();
    }

    const data = forecastDays.map(item => ({
        day: item.day,
        count: item.humidity
    }));
    const nightData = forecastNights.map(item => ({
        day: item.day,
        count: item.humidity
    }));

    humidityChart = new Chart(
        document.getElementById('humidityChart'), {
            type: 'line',
            data: {
                labels: data.map(row => row.day),
                datasets: [{
                        label: 'Day humidity',
                        data: data.map(row => row.count),
                        fill: false,
                        borderColor: '#ff8a00',
                        backgroundColor: '#000000',
                        pointBackgroundColor: 'white',
                        pointBorderColor: 'black',
                        tension: 0.3
                    },
                    {
                        label: 'night humidity',
                        data: nightData.map(row => row.count),
                        fill: false,
                        borderColor: '#59deff',
                        backgroundColor: '#000000',
                        pointBackgroundColor: 'white',
                        pointBorderColor: 'black',
                        tension: 0.2
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        grid: {
                            display: true,
                            color: '#ffffff33'
                        },
                        ticks: {
                            color: '#fff'
                        }

                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: '#ffffff33'
                        },
                        ticks: {
                            color: '#fff'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1e1e1e',
                        titleColor: '#59deff',
                        bodyColor: '#ffffff',
                        borderColor: '#59deff',
                        borderWidth: 1,
                        titleFont: {
                            size: 14,
                            weight: 'bold',
                            family: 'Arial'
                        },
                        bodyFont: {
                            size: 13,
                            family: 'Arial'
                        },
                        callbacks: {
                            label: function (context) {
                                return context.formattedValue;
                            }
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        }
    );
}
// ----------------------------------chart btn
const chartBtn = document.querySelectorAll('.chartBtn')
const chartBox = document.querySelectorAll('.chartBox')

chartBtn.forEach((item, i, arr) => {
    item.addEventListener('click', () => {
        arr.forEach(item => {
            item.classList.remove('active-btn')
        })
        item.classList.add('active-btn')
        let id = item.dataset.name
        chartBox.forEach(item => {
            if (item.dataset.name == id) {
                item.classList.remove('hidden')
            } else {
                item.classList.add('hidden')
            }
        })

    })
})
// -------------------------------search box
const searchBox = document.getElementById('search-box')
const searchBtn = document.getElementById('search-btn')

searchBtn.addEventListener('click', () => {

    const value = searchBox.value.trim().toLowerCase()
    const englishOnly = /^[A-Za-z]+$/;

    if (!value || !englishOnly.test(value)) {
        searchBox.parentElement.classList.add('check-input')

    } else {
        searchBox.parentElement.classList.remove('check-input')
        console.log(value);
        currentCity = value;
        getData()
    }
})

// -------------------------------- city box
function create_city_box() {
    const cityBoxContainer = document.getElementById('city-box');
    const cityName = currentCity.trim().toLowerCase();
    const existingBox = cityBoxContainer.querySelector(`li[data-city="${currentCity.trim().toLowerCase()}"]`);
    console.log(existingBox);

    if (existingBox) {
        return;
    }

    const box = document.createElement('li')
    box.dataset.name = 'first'
    box.dataset.city = currentCity.trim().toLowerCase()
    box.setAttribute('onclick', 'changeCity(this)')
    box.classList.add('box')
    box.innerHTML = `
        <div class="flex items-center">
            <figure class=" h-full">
                <img src="src/asset/img/icon/${currentMain}.png" alt="">
            </figure>
            <div class=" ml-5">
               <h3 class="text-[white] capitalize font-['400'] text-[35px]">${currentCity.toLowerCase()}</h3>
               <h4 class="text-[#ffffff7c] capitalize font-['400'] text-[25px]">${currentTemp}</h4>
            </div>
        </div>
        <div>
           <figure onclick='removeBox(this,event)' class="w-10 h-10 rounded-2xl bg-[#ff18187a] flex justify-center items-center cursor-pointer hover:scale-[1.1] duration-200">
               <img src="src/asset/img/icon/delete.png" alt="" class="w-[30px]">
           </figure>
        </div>
    
     `
    document.getElementById('city-box').appendChild(box)

    // ✅ ذخیره در localStorage
    const storedCities = JSON.parse(localStorage.getItem('cities')) || [];
    storedCities.push({
        name: cityName,
        temp: currentTemp,
        icon: currentMain
    });
    localStorage.setItem('cities', JSON.stringify(storedCities));
}

function removeBox(s, e) {
    e.stopPropagation();

    const box = s.closest('.box');
    const city = box.dataset.city;

    // حذف از DOM
    box.remove();

    // حذف از localStorage
    const storedCities = JSON.parse(localStorage.getItem('cities')) || [];
    const updated = storedCities.filter(c => c.name !== city);
    localStorage.setItem('cities', JSON.stringify(updated));
}

function changeCity(s) {
    currentCity = s.firstElementChild.lastElementChild.firstElementChild.innerText
    getData()
}

window.addEventListener('DOMContentLoaded', () => {
    const storedCities = JSON.parse(localStorage.getItem('cities')) || [];
    storedCities.forEach(city => {
        currentCity = city.name;
        currentTemp = city.temp;
        currentMain = city.icon;
        create_city_box();
    });
});