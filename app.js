// Clear local storage after document loading
localStorage.clear();

console.log("Local storage cleared.");
let selectedDate = 0;
const forms = document.getElementById("search-form");
const dateInput = document.getElementById("earch-input");
const displayContainer = document.getElementById("current-image-container");
const historyCont = document.getElementById("search-history");

// display container elements
const imgHeading = document.querySelector(".nasa-img-heading");
const imgElement = document.querySelector(".nasa-img");
const paraHeading = document.querySelector(".para-heading");
const imgPara = document.querySelector(".img-para");

// getting current date and converted to YYYY-MM-DD format
const currentDate = new Date().toISOString().split("T")[0];
getCurrentImageOfTheDay(currentDate);
console.log(currentDate);

// furm submission event handling
forms.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputs = e.currentTarget;
  const getDates = inputs.date.value;
  console.log(getDates);
  getImageOfTheDay(getDates);
  saveSearch({ date: getDates });
  addSearchToHistory(getDates);
  inputs.reset();
});

// set today image data on display container
async function getCurrentImageOfTheDay(dateStr) {
  getImageOfTheDay(dateStr).then(
    () => (imgHeading.innerText = "NASA Picture of the Day")
  );
}

// Data fetching async function
async function getImageOfTheDay(dateStr) {
  try {
    if (!dateStr) return;
    console.log("date for url", dateStr);
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?date=${dateStr}&api_key=LCc8yC3V8qH2zpKDNlqx2G9jEKIw2kwPOhuNCX2a`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const dataObj = await response.json();
    console.log(dataObj);
    imgHeading.innerText = `Picture On ${dateStr}`;
    console.log(dataObj.url);
    imgElement.src = `${dataObj.url}`;
    paraHeading.innerText = `${dataObj.title}`;
    imgPara.innerText = `${dataObj.explanation}`;

    // get date in array form
  } catch (err) {
    console.log("Error handled: ", err);
    alert("Failed to fetch data!");
  }
}
// save date in array formate
function saveSearch(data) {
  if (typeof Storage !== "undefined") {
    // Retrieve existing dates array from local storage or create a new one if it doesn't exist
    let datesArray = JSON.parse(localStorage.getItem("searches")) || [];

    // Add the new date to the dates array
    datesArray.push(data);

    // Store the updated dates array back to local storage
    localStorage.setItem("searches", JSON.stringify(datesArray));

    console.log("Date saved to local storage:", data);
  } else {
    console.log("Local storage is not supported.");
  }
}

// adding histories in a ul list
function addSearchToHistory() {
  const historyLink = document.createElement("a");
  const historyList = document.createElement("li");
  const datesArray = JSON.parse(localStorage.getItem("searches")) || [];
  console.log("history ", datesArray);
  let index = selectedDate++;
  console.log("history2 ", datesArray[index].date);
  const selDate = datesArray[index].date;
  historyLink.href = `#`;
  historyLink.onclick = () => {
    getImageOfTheDay(selDate);
    return false;
  };
  historyLink.innerText = datesArray[index].date;
  historyList.id = `list${index}`;

  historyList.appendChild(historyLink);
  historyCont.appendChild(historyList);
}
