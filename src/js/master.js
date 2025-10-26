// https://api.openweathermap.org/data/2.5/forecast?q=tehran&units=metric&appid=ab1bcc592ad966be21f0817b800ba129
// ----------------nav bar and pages

const pages = document.querySelectorAll('#pages>section')

document.querySelectorAll('.nav-ul>li').forEach((item, index, arr) => {
    item.addEventListener('click', () => {
        menuMobile.classList.remove('top-0')
        menuMobile.classList.add('top-full')
        arr.forEach((item) => {
            item.classList.remove('active-nav')
        })
        item.classList.add('active-nav')
        let id = item.dataset.name
        pages.forEach((page) => {
            page.classList.add('hidden')
            if (page.dataset.name == id) {
                page.classList.remove('hidden')
            }
        })

    })
})
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
        console.log(temperature);


        switch (temperature) {
            case 'Celsius':
                currentTemp = currentTemp + '°C'
                break;
            case 'Fahrenheit':
                currentTemp = parseInt(((currentTemp * 9.5) + 32)) + '°F'
                break;
            case 'Kelvin':
                currentTemp = parseInt((currentTemp + 273.15)) + 'K'
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
        }


        const [date, time] = currentDt.split(" ");
        currentDate = date;
        currentTime = time;

        console.log("✅ Weather data for:", currentCity);
        console.log([currentTemp, currentPressure, currentHumidity, currentWind, currentDescription, currentDt]);

        creat_current_weather();
        createMap(currentLon, currentLat);
    } catch (error) {
        console.error("❌ Error fetching data:", error);
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
// -----------------------------------popular cities
document.querySelectorAll('#popular-cities>li').forEach((item, i, arr) => {
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
    });
});
// -----------------------------------
window.addEventListener("load", () => {
    getData();
});

// -----------------------------------setting option
let temperature = 'Celsius'
let windSpeed = 'm/s'
let pressure = 'hPa'

document.querySelectorAll('.temperature>div').forEach((item, i, all) => {
    item.addEventListener('click', () => {
        settingOption(item, all)
        temperature = item.innerText
        getData()
    })
})
document.querySelectorAll('.windSpeed>div').forEach((item, i, all) => {
    item.addEventListener('click', () => {
        settingOption(item, all)
        windSpeed = item.innerText
        getData()
    })

})
document.querySelectorAll('.pressure>div').forEach((item, i, all) => {
    item.addEventListener('click', () => {
        settingOption(item, all)
        pressure = item.innerText
        getData()
    })
})
document.querySelectorAll('.precipitation>div').forEach((item, i, all) => {
    item.addEventListener('click', () => settingOption(item, all))
})
document.querySelectorAll('.distance>div').forEach((item, i, all) => {
    item.addEventListener('click', () => settingOption(item, all))
})

function settingOption(item, all) {
    all.forEach(item => item.classList.remove('setting-active'))
    item.classList.add('setting-active')

    document.getElementById('loading2').classList.remove('hidden')

    setTimeout(() => {
        document.getElementById('loading2').classList.add('hidden')
    }, 1000);
}