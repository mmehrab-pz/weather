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
// -----------------------------------map
// ایجاد نقشه و تنظیم موقعیت و زوم
const map = L.map('map').setView([35.6892, 51.3890], 10); // تهران

// اضافه کردن کاشی‌های نقشه از OpenStreetMap (رایگان)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// اضافه کردن مارکر (نقطه روی نقشه)
L.marker([35.6892, 51.3890])
    .addTo(map)
    .bindPopup('Iran,Tehran')
    .openPopup();