const flagImage = document.querySelector(".flag-image");
const countryInfo = document.querySelector(".country-info");
const moonImage = document.querySelector(".moon >img");
const body = document.querySelector("body");
const anchor = document.querySelector("main a");
const headPara = document.querySelector(".head p");
const moonText = document.querySelector(".moon>span");
// const h5 = document.querySelectorAll(".country-info h5");
// console.log(moonImage);
// console.log(h5);

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const name = params.get('name');
// console.log(name);


// anchor.href = "index.html";

const fetchCountryData = async (countryName) => {
    return fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok ' + res.statusText);
            }
            return res.json();
        });
};

const updateCountryInfo = async (data) => {
    const countryData = `
        <div class="flag">
            <img class="flagimage" src="${data[0].flags.svg}" alt="flag of ${name}">
        </div>
        <div class="country-demography">
            <h1 class="country-name">${name}</h1>
            <h5>Native Name:<span>${Object.values(data[0].name.nativeName)[0].official}</span></h5>
            <h5>Population:<span>${data[0].population.toLocaleString('en-IN')}</span></h5>
            <h5>Region:<span>${data[0].region}</span></h5>
            <h5>Sub Region:<span>${data[0].subregion}</span></h5>
            <h5>Capital:<span>${data[0].capital ? data[0].capital[0] : 'N/A'}</span></h5>
        </div>
        <div class="TCL">
            <h5>Top Level Domain:<span>${data[0].tld.join(', ')}</span></h5>
            <h5>Currencies:<span>${data[0].currencies ? Object.values(data[0].currencies)[0].name : 'N/A'}</span></h5>
            <h5>Languages:<span>${data[0].languages ? Object.values(data[0].languages).join(', ') : 'N/A'}</span></h5>
        </div>
        <div class="border-countries">
            <h5>Border countries: ${
                data[0].borders ? 
                    (await Promise.all(data[0].borders.map(async (border) => {
                        const response = await fetch(`https://restcountries.com/v3.1/alpha/${border}`);
                        const countryData = await response.json();
                        return `<span><a href="country.html?name=${countryData[0].name.common}">${countryData[0].name.common}</a></span>`;
                    }))).join('')
                    : 'N/A'
            }</h5>
        </div>
    `;
    countryInfo.innerHTML = countryData;
};
// Function to update the colors based on the mode (dark/light)
const updateColors = () => {
    const h5Elements = document.querySelectorAll(".country-info h5, .TCL h5, .border-countries h5");
    const h3element = document.querySelector(".country-name");
    const backbutton = document.querySelector(".back-button span");
    
    const isDarkMode = moonImage.src.includes("white-moon.png");

    body.style.backgroundColor = isDarkMode ? "rgb(25,39,52)" : "white";
    headPara.style.color = isDarkMode ? "white" : "black";
    moonText.innerHTML = isDarkMode ? "Light Mode" : "Dark Mode";
    moonText.style.color = isDarkMode ? "white" : "black";

    h5Elements.forEach(h5 => {
        h5.style.color = isDarkMode ? "white" : "black";
    });

    if (h3element) {
        h3element.style.color = isDarkMode ? "white" : "black";
    }

    if (backbutton) {
        backbutton.style.color = isDarkMode ? "white" : "black";
    }
};

// Event listener for toggling dark/light mode
moonImage.addEventListener("click", () => {
    moonImage.src = moonImage.src.includes("images/white-moon.png") ? "images/moon-outline.svg" : "images/white-moon.png";
    updateColors();
});
const maxRetries = 3;
let attempts = 0;

const attemptFetch = () => {
    fetchCountryData(name)
        .then(updateCountryInfo)
        .catch(error => {
            console.error('Error:', error);
            attempts += 1;
            if (attempts < maxRetries) {
                attemptFetch();
            } else {
                console.error('Max retries reached. Unable to fetch country data.');
            }
        });
};

attemptFetch();
