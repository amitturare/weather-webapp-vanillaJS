// Helper Function
const getElements = (selection) => {
    const element = document.querySelector(selection);

    if (element) {
        return element;
    } else {
        throw new Error(
            `Please check the selection ${selection} and try again`
        );
    }
};

// Import the icons function
import { setIcon } from "./icons.js";

// ==== Selections ==== //
const form = getElements("#form");
const search = getElements(".search");
const dataList = getElements("datalist");
const locationBtn = getElements(".location-btn");
const content = getElements(".content");

const wIconEl = getElements(".weather-icon");
const wtTextEl = getElements(".weather-text");
const wTempEl = getElements(".main .number");
const wLocationEl = getElements(".location-text");
const mapLocationIcon = getElements(".fa-map-location-dot");

// Extra Details
const feelsNum = getElements(".feels .number");
const humidityNum = getElements(".humidity .number");
const windNum = getElements(".wind-speed .number");
const precipitationNum = getElements(".precipitation .number");

let backBtnHidden = false;
let citiesArray = [];

// ==== API ==== //
const apiKey = "95b6fc9a2ecd4b5581b31840222502";
async function fetchData(URL) {
    const response = await fetch(URL);
    const data = await response.json();

    updateDOM(data);
}

// ==== Update the DOM ==== //
function updateDOM(data) {
    const temp = data.current.temp_c;
    const { name, country, localtime } = data.location;
    const { text, code } = data.current.condition;
    const { wind_kph, humidity, precip_mm, feelslike_c } = data.current;

    let nameCountry = `${name}, ${country}`;
    let hours = localtime.substr(localtime.length - 5, 2);

    if (nameCountry.length > 23) {
        mapLocationIcon.classList.add("long");
        content.style.padding = "3.10rem 1rem";
    } else {
        mapLocationIcon.classList.remove("long");
        content.style.padding = "5rem 1rem";
    }
    // SetIcon
    setIcon(code, hours, wIconEl);

    // Clear the search
    search.value = "";

    // Update DOM
    wTempEl.textContent = temp;
    wtTextEl.textContent = text;
    wLocationEl.textContent = nameCountry;
    feelsNum.textContent = feelslike_c;
    humidityNum.textContent = humidity;
    windNum.textContent = wind_kph;
    precipitationNum.textContent = precip_mm;

    console.log();
}

// ==== Access Cities JSON File ==== //
async function fetchCities() {
    const response = await fetch(
        "https://raw.githubusercontent.com/lutangar/cities.json/master/cities.json"
    );
    citiesArray = await response.json();

    updateSearch(citiesArray);
}
console.log(dataList);
// Update the search box
function updateSearch(arr) {
    const itemEl = arr
        .map((item) => {
            return `<option value="${item.name}">${item.name}</option>`;
        })
        .join("");

    dataList.innerHTML = itemEl;
}

// on Load
fetchCities();

// ==== Geolocation API ==== //
// onSuccess
function onSuccess(data) {
    const { latitude, longitude } = data.coords;

    // Fetch
    const URL = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`;
    fetchData(URL);
}

// onError
function onError(err) {
    alert(err.message);
}

// ==== Event Listeners ==== //
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const city = search.value;
    const URL = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${search.value}&aqi=no`;

    if (city) {
        fetchData(URL);
    }
});

search.addEventListener("change", (e) => {
    e.preventDefault();

    const city = search.value;
    const URL = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${search.value}&aqi=no`;

    if (city) {
        fetchData(URL);
    }
    search.value = "";
});

locationBtn.addEventListener("click", () => {
    // Check if the browser supports geolocation api or not
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser does not support Geolocation API.");
    }
});
