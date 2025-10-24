// ----------------nav bar and pages

const pages = document.querySelectorAll('#pages>section')
console.log(pages);


document.querySelectorAll('#nav-ul>li').forEach((item, index, arr) => {
    item.addEventListener('click', () => {
        arr.forEach((item) => {
            item.classList.remove('active-nav')
        })
        item.classList.add('active-nav')
        console.log(item.dataset.name);
        let id = item.dataset.name
        pages.forEach((page) => {
            page.classList.add('hidden')
            if (page.dataset.name == id) {
                page.classList.remove('hidden')
            }
        })

    })
})

// -----------------------------------get location and creat map
let currentLat = ''
let currentLon = ''
let currentCity = 'tehran'


async function getCity() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async function (position) {
                currentLat = position.coords.latitude;
                currentLon = position.coords.longitude;

                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${currentLat}&lon=${currentLon}&format=json`);
                const data = await response.json();

                currentCity = data.address?.city || data.address?.town || data.address?.village || data.address?.county || 'tehran';
                console.log("City:", currentCity);
                getData()

                // ایجاد نقشه و تنظیم موقعیت و زوم
                const map = L.map('map').setView([currentLat, currentLon], 10); // تهران


                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors'
                }).addTo(map);
                L.marker([currentLat, currentLon])
                    .addTo(map)
                    .bindPopup(currentCity)
                    .openPopup();

            },
            function (error) {
                console.error("Error getting location:", error);
            });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

getCity();

// -----------------------------------weather api
const API_KEY = 'ab1bcc592ad966be21f0817b800ba129'
let currentTemp = ''
let currentPressure = ''
let currentHumidity = ''
let currentVisibility = ''
let currentWind = ''
let currentDescription = ''
let currentMain = ''
let currentDt = ''
let currentDate = '';
let currentTime = '';

async function getData() {
    // const url = `https://api.openweathermap.org/data/2.5/weather?q=${City}&appid=${API_KEY}&units=metric`;
    // پیش‌بینی هوا رو برای ۵ روز آینده در بازه‌های ۳ ساعته می‌ده.
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${currentCity}&units=metric&appid=${API_KEY}`;

    const response = await fetch(url);

    const data = await response.json();

    // document.getElementById('result').textContent = JSON.stringify(data, null, 2);
    // console.log(JSON.stringify(data, null, 2));
    currentTemp = data.list[0].main.temp
    currentPressure = data.list[0].main.pressure
    currentHumidity = data.list[0].main.humidity
    currentVisibility = data.list[0].visibility
    currentWind = data.list[0].wind.speed
    currentDescription = data.list[0].weather[0].description
    currentMain = data.list[0].weather[0].main
    currentDt = data.list[0].dt_txt
    const [date, time] = currentDt.split(" ");
    currentDate = date
    currentTime = time
    console.log([currentTemp, currentPressure, currentHumidity, currentVisibility, currentWind, currentDescription , currentDt , date , time]);
    creat_current_weather()
}
// -----------------------------------creat current weather section
function creat_current_weather() {
    document.getElementById('current-weather').innerHTML = `

                                <h3 class="font-['400'] text-[20px] capitalize text-[white]">current weather</h3>
                                <div class="w-full flex items-center">
                                    <figure>
                                        <img src="src/asset/img/icon/${currentMain}.png" alt="" class="w-[100px]">
                                    </figure>
                                    <h3 class="font-['600'] text-[60px] ml-[30px]">
                                        ${currentTemp}
                                        <sup class="font-['400'] text-[40px]">
                                            °C
                                        </sup>
                                    </h3>
                                </div>
                                <div class="flex justify-between items-center">
                                    <h6 class="font-['400'] text-[14px] xl:text-[16px] capitalize text-[white]">${currentDescription}</h6>
                                    <figure class="flex items-center">
                                        <img src="src/asset/img/icon/icons8-location-96.png" alt=""
                                            class="w-[22px] xl:w-[25px]">
                                        <figcaption class="font-['400'] text-[14px] capitalize text-[white] ml-2">${currentCity}</figcaption>
                                    </figure>
                                    <figure class="flex items-center">
                                        <img src="src/asset/img/icon/time.png" alt="" class="w-[22px] xl:w-[25px]">
                                        <figcaption
                                            class="font-['400'] text-[14px] xl:text-[16px] capitalize text-[white] ml-2">
                                            ${currentTime}
                                        </figcaption>
                                    </figure>
                                    <figure class="flex items-center">
                                        <img src="src/asset/img/icon/icons8-timeline-week-96.png" alt=""
                                            class="w-[22px] xl:w-[25px]">
                                        <figcaption
                                            class="font-['400'] text-[14px] xl:text-[16px] capitalize text-[white] ml-2">
                                            ${currentDate}
                                        </figcaption>
                                    </figure>
                                </div>
                                <div class="flex justify-between items-center">
                                     <!-- --------------Humidity -->
                                    <figure title='Humidity'
                                        class="font-['400'] text-[16px] capitalize text-[white] flex flex-col items-center justify-center">
                                        <img src="src/asset/img/icon/Humidity.png" alt="" class="w-[25px]">
                                        <figcaption class="font-['400'] text-[16px] capitalize text-[white] mt-2.5">${currentHumidity}%</figcaption>
                                    </figure>
                                    <!-- --------------visibility -->
                                    <figure title='visibility'
                                        class="font-['400'] text-[16px] capitalize text-[white] flex flex-col items-center justify-center">
                                        <img src="src/asset/img/icon/visibility.png" alt="" class="w-[25px]">
                                        <figcaption class="font-['400'] text-[16px] capitalize text-[white] mt-2.5">${currentVisibility}</figcaption>
                                    </figure>
                                    <!-- --------------pressure -->
                                    <figure title='pressure'
                                        class="font-['400'] text-[16px] capitalize text-[white] flex flex-col items-center justify-center">
                                        <img src="src/asset/img/icon/pressure.png" alt="" class="w-[25px]">
                                        <figcaption class="font-['400'] text-[16px] capitalize text-[white] mt-2.5">${currentPressure}</figcaption>
                                    </figure>
                                    <!-- --------------wind -->
                                    <figure title='wind speed'
                                        class="font-['400'] text-[16px] capitalize text-[white] flex flex-col items-center justify-center">
                                        <img src="src/asset/img/icon/wind.png" alt="" class="w-[25px]">
                                        <figcaption class="font-['400'] text-[16px] capitalize text-[white] mt-2.5">${currentWind}m/s</figcaption>
                                    </figure>
                                </div>

`
}