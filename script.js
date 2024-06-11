const countriesContainer = document.querySelector(".countries-container");
const dropButton = document.querySelector(".dropbtn");
const dropdownContent = document.querySelector(".dropdown-content");
const dropdownspan = document.querySelectorAll(".dropdown-content span");
const moonImage = document.querySelector(".moon>img");
const moonText = document.querySelector(".moon>span");
const headPara = document.querySelector(".head>p");
const searchBar = document.querySelector(".search");
const body = document.querySelector("body");
const input = document.querySelector(".input");
const filterspan = document.querySelectorAll("#myDropdown span");
const searchinput = document.querySelectorAll(".input");
console.log(searchinput);

dropButton.addEventListener("click", () => {
    dropdownContent.classList.toggle("show");
});

moonImage.addEventListener("click", () => {
    if (moonImage.src.includes("white-moon.png")) {
        body.style.backgroundColor = "white";
        headPara.style.color = "black";
        input.style.backgroundColor = "white";
        dropButton.style.color = "rgb(25,39,52)";
        searchBar.style.backgroundColor = "white";
        dropdownContent.style.backgroundColor = "white";
        moonImage.src = "images/moon-outline.svg";
        moonText.innerHTML = "Dark Mode";
        moonText.classList.remove("span");
        moonImage.classList.add("white");
        dropdownspan.forEach((span) => {
            span.style.color = "black";
        });
        dropButton.style.backgroundColor = "white";
        const countryNames = document.querySelectorAll(".country-name");
        countryNames.forEach(name => {
            name.style.color = "black";
        });
        const h5Elements = document.querySelectorAll(".country-content h5");
        h5Elements.forEach(h5 => {
            h5.style.color = "black";
        });
        const countryList = document.querySelectorAll(".country");
        countryList.forEach(country => {
            country.style.backgroundColor = "white";
        });
    } else {
        body.style.backgroundColor = "rgb(25,39,52)";
        input.style.backgroundColor = "rgb(25,39,52)";
        dropdownContent.style.backgroundColor = "rgb(25,39,52)";
        headPara.style.color = "white";
        searchBar.style.backgroundColor = "rgb(25,39,52)";
        moonImage.src = "images/white-moon.png";
        dropButton.style.color = "white";
        dropdownspan.forEach((span) => {
            span.style.color = "white";
        });
        moonText.innerHTML = "Light Mode";
        moonText.classList.add("span");
        moonImage.classList.add("white-moon");
        dropButton.style.backgroundColor = "rgb(25,39,52)";
        const countryContents = document.querySelectorAll(".country");
        countryContents.forEach(countryContent => {
            countryContent.style.backgroundColor = "rgb(25,39,52)";
        });
        const countryNames = document.querySelectorAll(".country-name");
        countryNames.forEach(name => {
            name.style.color = "white";
        });
        const h5Elements = document.querySelectorAll(".country-content h5");
        h5Elements.forEach(h5 => {
            h5.style.color = "white";
        });
        const countryList = document.querySelectorAll(".country");
        countryList.forEach(country => {
            country.style.backgroundColor = "rgb(25,39,52)";
        });
    }
});

let allcountriesdata;
const fetchAllCountries = async () => {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        allcountriesdata = data;
        rendercountries(data);
        restoreScrollPosition();
    } catch (error) {
        console.error('Error fetching all countries:', error);
    }
};

fetchAllCountries();

function rendercountries(countrydata) {
    countriesContainer.innerHTML = ''; // Clear container before rendering
    countrydata.forEach((data) => {
        const countryCard = `
            <a href="country.html?name=${data.name.common}" class="country">
                <img src="${data.flags.svg}" alt="">
                <div class="country-content">
                    <h3 class="country-name">${data.name.common}</h3>
                    <h5>Population:<span>${data.population.toLocaleString('en-IN')}</span></h5>
                    <h5>Region:<span>${data.region}</span></h5>
                    <h5>Capital:<span>${data.capital?.[0]}</span></h5>
                </div>
            </a>`;
        countriesContainer.innerHTML += countryCard;
    });
    addCountryLinkListeners();
}

function addCountryLinkListeners() {
    const countryLinks = document.querySelectorAll('.country');
    countryLinks.forEach(countryLink => {
        countryLink.addEventListener('click', () => {
            localStorage.setItem('scrollPosition', window.scrollY);
        });
    });
}

function restoreScrollPosition() {
    if (localStorage.getItem('scrollPosition')) {
        window.scrollTo({
            top: parseInt(localStorage.getItem('scrollPosition')),
            behavior: 'smooth'
        });
        localStorage.removeItem('scrollPosition');
    }
}

filterspan.forEach((span) => {
    span.addEventListener("click", async () => {
        console.log(span.innerHTML);
        try {
            let data;
            if (span.innerHTML !== "All Countries") {
                const response = await fetch(`https://restcountries.com/v3.1/region/${span.innerHTML}`);
                if (!response.ok) throw new Error('Failed to fetch');
                data = await response.json();
            } else {
                const response = await fetch("https://restcountries.com/v3.1/all");
                if (!response.ok) throw new Error('Failed to fetch');
                data = await response.json();
            }
            countriesContainer.innerHTML = '';
            rendercountries(data);
        } catch (error) {
            console.error('Error fetching countries by region:', error);
        }
    });
});

searchinput.forEach((input) => {
    input.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredData = allcountriesdata.filter((country) =>
            country.name.common.toLowerCase().includes(searchTerm)
        );
        console.log(filteredData);
        countriesContainer.innerHTML = '';
        rendercountries(filteredData);
    });
});
