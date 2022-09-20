// Pages Name 
const page_home = 'index.html';
const page_viewAll = 'view-all.html';
const page_sku = 'sku.html';
const page_confirmation = 'confirmation.html';

// Site Data URL 
const APP_URL = './data.json';

// Global Variable 
let homePackages, allPackages, departurePlace, departurePlaceValue, data;

// Getting Page Name
let pageName = (() => {
    return window.location.pathname.split("/").pop();
})();


// All DOM Elements 
if (pageName === page_home) {
    departurePlace = document.getElementById('departure_place');
    departurePlaceValue = departurePlace.value;
    homePackages = document.getElementById('home-packages');
}
if (pageName === page_viewAll) {
    allPackages = document.getElementById('all-packages');
}

// Function for Getting JSON Data 
const getData = async function (url) {
    try {
        // 1. Get Data 
        const response = await fetch(url);
        data = await response.json();

        // 2. Store Data 
        localStorage.setItem('data', JSON.stringify(data));

        // 3. Render
        renderHome(data, departurePlaceValue);

        departurePlace.addEventListener('change', function (event) {
            event.preventDefault();
            renderHome(data, this.value);
        })



    } catch (err) {
        console.log(err)
    }

}

if (pageName === page_home) {
    window.addEventListener('DOMContentLoaded', function () {
        getData(APP_URL);
    })
}

// Script For hero slider and filter selection 
if (pageName === page_home || pageName === page_viewAll) {
    window.addEventListener('DOMContentLoaded', function () {
        let heroCarousel = new Splide('.hero-carousel', {
            perPage: 1,
            speed: 2000,
            rewind: 'loop'
        });
        heroCarousel.mount();
        NiceSelect.bind(document.getElementById("departure_place"), { searchable: true });
        NiceSelect.bind(document.getElementById("number_of_day"));
        NiceSelect.bind(document.getElementById("number_of_package"));
    })
}

// Function For Render Packages in Home page 
async function renderHome(data, query) {
    let html = '';
    await data.forEach((el, index) => {
        html += `<div class="pkg-rw">
        <h1 class="primary-title">Até ${data[index].discount}% OFF</h1>
        <div class="row packages-wrap">
        ${(() => {
                let innerHtml = '', dataFiltered;
                dataFiltered = el.travel_places.filter(item => {
                    return item.departure_place == query;
                })

                if (dataFiltered.length == 0) {
                    return 'There is no package under your query!!';

                }
                for (let i = 0; i < dataFiltered.length; i++) {
                    if (i === 4) break;
                    innerHtml += `<div class="col-xl-3 col-lg-4 col-6 mb-4"><a href="sku.html" id="${dataFiltered[i].id}" class="package-card d-block">
                    <div class="package-card-inner">
                        <div class="package-thumb position-relative">
                            <img src="${dataFiltered[i].package_thumb}" alt="" class="img-fluid w-100">
                            ${(() => {
                            if (dataFiltered[i].travel_type == 'National') {
                                return `<span class="badge bg-green position-absolute">${dataFiltered[i].travel_type}</span>`;
                            }

                            if (dataFiltered[i].travel_type == 'International') {
                                return `<span class="badge bg-indigo position-absolute">${dataFiltered[i].travel_type}</span>`;
                            }

                        })()
                        }
                        </div>
                        <div class="package-content">
                            <h4 class="place-name">${dataFiltered[i].place_name}</h4>
                            <h3 class="price-blk">
                                <span class="from d-block">A partir de</span>
                                R$ <span class="pkg-price d-inline-block">${dataFiltered[i].package_cost.three_day}</span>
                            </h3>
                            <ul class="facilites">
                                <li><img src="assets/img/airplane.svg" alt="">Voo (ida e volta)</li>
                                <li><img src="assets/img/accomodation.svg" alt="">Hospedagem</li>
                                <li><img src="assets/img/breakfast.svg" alt="">Café da manhã</li>
                            </ul>
                        </div>
                    </div>
                </a>
            </div>`;
                }
                return innerHtml;
            })()}
        </div>
    </div>`
    });
    homePackages.innerHTML = html;
    addEventToPackages();
}

// Function For Render Packages in view-all page 
function renderViewAll(data, query) {
    let html = '';
    data.forEach((el, index) => {
        html += `
        ${(() => {
                let innerHtml = '', dataFiltered;

                if (query) {
                    dataFiltered = data[index].travel_places.filter(item => {
                        return item.departure_place == query;
                    })

                } else {
                    dataFiltered = data[index].travel_places;
                }
                for (let i = 0; i < dataFiltered.length; i++) {
                    innerHtml += `<div class="col-xl-3 col-lg-4 col-6 mb-4"><a href="sku.html" class="package-card d-block">
                <div class="package-card-inner">
                    <div class="package-thumb position-relative">
                        <img src="${dataFiltered[i].package_thumb}" alt="" class="img-fluid w-100">
                        <span class="badge bg-green position-absolute">Nacional</span>
                    </div>
                    <div class="package-content">
                        <h4 class="place-name">${dataFiltered[i].place_name}</h4>
                        <h3 class="price-blk">
                            <span class="from d-block">A partir de</span>
                            R$ <span class="pkg-price d-inline-block">${dataFiltered[i].price}</span>
                        </h3>
    
                        <ul class="facilites">
                            <li><img src="assets/img/airplane.svg" alt="">Voo (ida e volta)</li>
                            <li><img src="assets/img/accomodation.svg" alt="">Hospedagem</li>
                            <li><img src="assets/img/breakfast.svg" alt="">Café da manhã</li>
                        </ul>
                    </div>
                </div>
            </a>
        </div>`;
                }
                return innerHtml;
            })()}
        `
    });
    allPackages.innerHTML = html;
}

if (pageName === page_viewAll) {

    // 1. Getting Data 
    let data = JSON.parse(localStorage.getItem('data'));
    // 2. Filter Data 
    // 3. Render Data
    renderViewAll(data)

    departurePlace = document.getElementById('departure_place');
    departurePlace.addEventListener('change', function (event) {
        event.preventDefault();
        renderViewAll(data, this.value);
    })

}


function addEventToPackages() {
    let totalPackage = document.querySelectorAll('.package-card');
    totalPackage.forEach(each => {
        each.addEventListener('click', function (event) {

            localStorage.setItem('sku-info', each.id)
        })
    })

}


// ============= sku page part ============
if (pageName === page_sku) {
    const origin = document.getElementById("origin");
    const month = document.getElementById("month");
    const departureDate = document.getElementById("departure_date");
    const numberOfStay = document.getElementById("number_of_day");
    const numberOfPackage = document.getElementById("number_of_package");
    const pkgPrice = document.getElementById('pkg-price');
    const hotelList = document.getElementById('hotel-list')

    function getDesiredSku() {
        const skuId = localStorage.getItem('sku-info');
        const data = JSON.parse(localStorage.getItem('data'));
        let skuArray = [];
        data.forEach((el) => {
            skuArray = [...skuArray, ...el.travel_places];
        })
        let desiredSku = skuArray.filter(each => {
            return each.id == skuId;
        })

        return desiredSku;
    }

    function renderSku(data) {
        let html = '', html2 = '';
        const thumbnailSlider = document.getElementById('thumbnail-slider');
        const thumbSlContent = thumbnailSlider.querySelector('.splide__list');
        const mainSlider = document.getElementById('main-slider');
        const mainSlContent = mainSlider.querySelector('.splide__list');
        const placeName = document.getElementById('place-name');
        data[0].package_details.relatedPlace_images.forEach(each => {
            html += `<li class="splide__slide">
            <div class="thumb-slide border_radius_4 overflow-hidden">
                <img class="img-fluid w-100" src="${each}" alt="">
            </div>
        </li>`
        })
        thumbSlContent.innerHTML = html;
        mainSlContent.innerHTML = html;
        placeName.innerHTML = data[0].place_name;
        pkgPrice.innerHTML = getPackagePrice(data);
        if (data[0].package_details.related_hotels) {
            data[0].package_details.related_hotels.forEach(each => {
                html2 += ` <li>
                <div class="hotel-thumb">
                    <img src="${each.hotel_thumb}" alt="" class="img-fluid w-100">
                </div>
                <div class="hotel-list-content">
                    <h4 class="text-center">${each.hotel_name}</h4>
                    <ul class="facilites">
                        <li><img src="assets/img/calendar.svg" alt="">3 a 7 diárias</li>
                        <li><img src="assets/img/breakfast.svg" alt="">Café da manhã</li>
                    </ul>
                </div>
            </li>`
            })

            hotelList.innerHTML = html2;
        } else {
            hotelList.innerHTML = 'There is No Hotels based on your Search! Please See in Another Place';
        }

    }

    // 1. get Desired Sku Data
    const skuData = getDesiredSku();

    // 2. Render Sku Data 
    renderSku(skuData)


    // 3. Calling slider activation 
    document.addEventListener('DOMContentLoaded', function () {
        var main = new Splide('#main-slider', {
            type: 'fade',
            heightRatio: 0.478,
            pagination: false,
            arrows: false,
            cover: true,
            breakpoints: {
                1200: {
                    heightRatio: 0.57,
                },
                991: {
                    heightRatio: 0.478,
                },
                767: {
                    heightRatio: 0.63,
                }
            }
        });

        var thumbnails = new Splide('#thumbnail-slider', {
            rewind: true,
            fixedWidth: 54,
            fixedHeight: 54,
            isNavigation: true,
            arrows: false,
            gap: 8,
            focus: 'center',
            direction: 'ttb',
            height: '300px',
            pagination: false,
            cover: true,
            dragMinThreshold: {
                mouse: 4,
                touch: 10,
            },
            breakpoints: {
                1400: {
                    height: '240px',
                },
                991: {
                    height: '240px'
                },
                991: {
                    height: '178px'
                }
            },
        });

        main.sync(thumbnails);
        main.mount();
        thumbnails.mount();

    });

    // 4. script for activation Select menu
    NiceSelect.bind(origin, { searchable: true });
    NiceSelect.bind(month, { searchable: true });
    NiceSelect.bind(departureDate, { searchable: true });
    NiceSelect.bind(numberOfStay);
    NiceSelect.bind(numberOfPackage);

    function getPackagePrice(skuData) {
        let cost;
        if (parseInt(numberOfStay.value) == 3) {
            cost = skuData[0].package_cost.three_day;
        }
        if (parseInt(numberOfStay.value) == 5) {
            cost = skuData[0].package_cost.five_day;
        }
        if (parseInt(numberOfStay.value) == 7) {
            cost = skuData[0].package_cost.seven_day;
        }

        return cost;
    }

    function getTotal() {
        return parseInt(numberOfPackage.value) * parseInt(getPackagePrice(skuData));
    }


    // 5. Getting all the user input values
    let userInputs = {
        origin: origin.value,
        month: month.value,
        departureDate: departureDate.value,
        numberOfStay: numberOfStay.value,
        numberOfPackage: numberOfPackage.value,
        placeName: skuData[0].place_name,
        placeImg: skuData[0].package_thumb,
        totalPrice: getTotal()

    }



    // 6. Adding event to every selection field 
    let allSelectField = [origin, month, departureDate, numberOfStay, numberOfPackage];
    allSelectField.forEach(each => {
        each.addEventListener('change', getUserInput);
    })

    function getUserInput(event) {
        userInputs = {
            origin: origin.value,
            month: month.value,
            departureDate: departureDate.value,
            numberOfStay: numberOfStay.value,
            numberOfPackage: numberOfPackage.value,
            placeName: skuData[0].place_name,
            placeImg: skuData[0].package_thumb,
            totalPrice: getTotal()

        }

        pkgPrice.innerHTML = getTotal();

        // 6. Put it in the LocalStorage
        localStorage.setItem('userInputs', JSON.stringify(userInputs));

    }

    // 7. Put it in the LocalStorage
    localStorage.setItem('userInputs', JSON.stringify(userInputs));

}



if (pageName === page_confirmation) {
    const confirmationPage = document.getElementById('confirmation');

    // 1. Get the userInput data 
    let userInputData = JSON.parse(localStorage.getItem('userInputs'));
    console.log(userInputData)

    // 2. Render the data 
    let html = `<div class="top-part">
    <div class="h-thumb"><img src="${userInputData.placeImg}" alt=""></div>
    <h5 class="hotel-name">${userInputData.placeName}</h5>
    <div class="included-facilites d-block d-md-flex flex-wrap align-items-center justify-content-center">
        <p>Está incluso:</p>
        <ul class="facilites d-block d-md-flex flex-wrap align-items-center">
            <li><img src="assets/img/airplane.svg" alt="">Voo (ida e volta)</li>
            <li><img src="assets/img/accomodation.svg" alt="">Hospedagem</li>
            <li><img src="assets/img/breakfast.svg" alt="">Café da manhã</li>
        </ul>
    </div>
    <div class="reservation-details d-flex justify-content-center flex-wrap">
        <p>Origem:<strong>${userInputData.origin}</strong></p>
        <p>Mês da viagem:<strong>${userInputData.month}/${new Date().getFullYear()}</strong></p>
        <p>Data de partida:<strong>${userInputData.departureDate}</strong></p>
        <p>Diárias:<strong>${userInputData.numberOfStay}</strong></p>
        <p>Pacotes:<strong>${userInputData.numberOfPackage}</strong></p>
    </div>
    <h3 class="price-blk type-2 final text-center">
        R$ <span class="pkg-price d-inline-block">${userInputData.totalPrice}</span>
    </h3>
    <p class="payment-terms-text type-2 text-center">em <span>12x R$ 105 sem juros</span></p>
</div>`
    confirmationPage.innerHTML = html;

    // 3. Available Data for next Move 

}



















