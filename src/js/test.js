let currentLat = ''
let currentLon = ''



async function getCity() {
    showLoading()

    if (currentCity && currentCity.trim() !== "" && currentCity.toLowerCase() !== "undefined") {
        console.log("User selected city:", currentCity);
        await getData(); // مستقیماً اطلاعات هواشناسی برای شهر انتخاب‌شده
        hideLoading();
        return;
    }

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async function (position) {
                currentLat = position.coords.latitude;
                currentLon = position.coords.longitude;

                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${currentLat}&lon=${currentLon}&format=json`);
                const data = await response.json();

                currentCity = data.address.city || data.address.town || data.address.village || data.address.county || 'tehran';
                console.log("City:", currentCity);
                await getData()
                hideLoading()
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
                currentCity = 'tehran'
                getData()
                hideLoading()

            });
    } else {
        console.log("Geolocation is not supported by this browser.");
        currentCity = 'tehran'
        getData()
        hideLoading()
    }
}
