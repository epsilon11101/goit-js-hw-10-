import "../css/styles.css";
import { debounce, filter } from "lodash";
import fetchCountries from "./country";
import Notiflix from "notiflix";

const DEBOUNCE_DELAY = 300;

const ul = document.querySelector(".country-list");
const div = document.querySelector(".country-info");
const search = document.getElementById("search-box");

const restoreELements = () => {
  ul.innerHTML = "";
  div.innerHTML = "";
};

function createList(countries) {
  restoreELements();
  const country_list = countries
    .map((country) => {
      return `
            <li><img class="flag" alt="" src="${country.flag}"> ${country.name}</li>
        `;
    })
    .join("");
  ul.innerHTML = country_list;
}

const getLanguages = (languages) => languages.map((language) => language.name);

function createDiv(country) {
  restoreELements();
  div.innerHTML = `
      <p class="country"> <span ><img class="flag" alt="" src="${
        country.flag
      }" ></span> ${country.name}</p> 
      <p> <span>Capital:</span>  ${country.capital} </p>
      <p> <span>Population: </span> ${country.population} </p>
      <p> <span>Languages: </span> ${getLanguages(country.languages)} </p>
    `;
}
function filterCountry(countries) {
  const len = countries.length;

  if (len > 10) {
    restoreELements();
    Notiflix.Notify.info(
      `Too many matches found. Please enter a more specific name.`
    );
  } else if (len >= 2 && len <= 10) createList(countries);
  else {
    restoreELements();
    createDiv(countries[0]);
  }
}

search.addEventListener(
  "input",
  _.debounce((e) => {
    let url = `https://restcountries.com/v2/name/${e.target.value}`;

    if (e.target.value.length > 0) {
      fetchCountries(url)
        .then((countries) => {
          filterCountry(countries, e.target.value);
        })
        .catch((error) =>
          Notiflix.Notify.failure("Oops, there is no country with that name")
        );
    }
  }, DEBOUNCE_DELAY)
);
