const apiUrl = "https://restcountries.com/v3.1/all";

const themeToggleButton = document.getElementById("theme-toggle");
const searchInput = document.getElementById("search");
const regionFilter = document.getElementById("region-filter");
const countryContainer = document.getElementById("country-container");
const detailsContainer = document.getElementById("country-details");

async function fetchCountries() {
	const response = await fetch(apiUrl);
	const data = await response.json();
	return data;
}

async function fetchCountryDetails(code) {
	const response = await fetch(
		`https://restcountries.com/v3.1/alpha/${code}`
	);
	const data = await response.json();
	return data[0];
}

// Render country cards
function renderCountries(countries) {
	countryContainer.innerHTML = "";
	countries.forEach((country) => {
		const card = document.createElement("div");
		card.className = "country-card";
		card.innerHTML = `
      <img src="${country.flags.svg}" alt="${country.name.common}">
      <h2>${country.name.common}</h2>
      <p>Population: ${country.population.toLocaleString()}</p>
      <p>Region: ${country.region}</p>
      <p>Capital: ${country.capital}</p>
      <a href="details.html?code=${country.cca3}">More Details</a>
    `;
		countryContainer.appendChild(card);
	});
}

function renderCountryDetails(country) {
	detailsContainer.innerHTML = `
    <button id="back">Back</button>
    <h1>${country.name.common}</h1>
    <img src="${country.flags.svg}" alt="${country.name.common}">
    <p>Population: ${country.population.toLocaleString()}</p>
    <p>Region: ${country.region}</p>
    <p>Subregion: ${country.subregion}</p>
    <p>Capital: ${country.capital}</p>
    <p>Languages: ${Object.values(country.languages).join(", ")}</p>
    <p>Currencies: ${Object.values(country.currencies)
		.map((curr) => curr.name)
		.join(", ")}</p>
    <p>Border Countries: ${
		country.borders ? country.borders.join(", ") : "None"
	}</p>
  `;

	// Back button functionality
	document.getElementById("back").addEventListener("click", () => {
		window.history.back();
	});
}

//  search input
searchInput?.addEventListener("input", async () => {
	const query = searchInput.value.toLowerCase();
	const countries = await fetchCountries();
	const filteredCountries = countries.filter((country) =>
		country.name.common.toLowerCase().includes(query)
	);
	renderCountries(filteredCountries);
});

//  region filter
regionFilter?.addEventListener("change", async () => {
	const region = regionFilter.value;
	const countries = await fetchCountries();
	const filteredCountries = countries.filter((country) =>
		region ? country.region === region : true
	);
	renderCountries(filteredCountries);
});

themeToggleButton?.addEventListener("click", () => {
	document.body.classList.toggle("dark-mode");
});

if (countryContainer) {
	fetchCountries().then((countries) => renderCountries(countries));
}

if (detailsContainer) {
	const params = new URLSearchParams(window.location.search);
	const code = params.get("code");

	fetchCountryDetails(code).then((country) => renderCountryDetails(country));
}
