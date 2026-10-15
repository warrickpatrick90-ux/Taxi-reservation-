const bookingForm = document.querySelector("#booking-form");
const pickupAreaSelect = document.querySelector("#pickup-area");
const dropoffAreaSelect = document.querySelector("#dropoff-area");
const pickupOtherInput = document.querySelector("#pickup-other");
const dropoffOtherInput = document.querySelector("#dropoff-other");
const bookingResult = document.querySelector("#booking-result");

// Keep the neighborhood list in one place so both route menus stay in sync.
const doualaAreas = [
  {
    group: "Central Douala",
    neighborhoods: [
      "Akwa",
      "Bonanjo",
      "Bonapriso",
      "Bali",
      "Deido",
      "New Bell",
      "Nkololoun",
      "Mboppi",
      "Youpwe",
    ],
  },
  {
    group: "North Douala",
    neighborhoods: [
      "Bonamoussadi",
      "Makepe",
      "Kotto",
      "Logpom",
      "PK 11",
      "PK 12",
      "Cité des Palmiers",
      "Bépanda",
      "Ange Raphaël",
      "Carrefour Maetur",
    ],
  },
  {
    group: "East and South Douala",
    neighborhoods: [
      "Ndokoti",
      "Logbaba",
      "Bassa",
      "Ndogpassi",
      "Nyalla",
      "Yassa",
      "Japoma",
      "PK 14",
      "PK 17",
      "Village",
    ],
  },
  {
    group: "Bonabéri",
    neighborhoods: [
      "Bonabéri Centre",
      "Mambanda",
      "Mabanda",
      "Sodiko",
      "Grand Hangar",
      "Bojongo",
      "Ndobo",
      "Rails",
      "Mbonjo",
    ],
  },
];

function addAreaOptions(selectElement) {
  doualaAreas.forEach((areaGroup) => {
    const optionGroup = document.createElement("optgroup");
    optionGroup.label = areaGroup.group;

    areaGroup.neighborhoods.forEach((neighborhood) => {
      const option = document.createElement("option");
      option.value = neighborhood;
      option.textContent = neighborhood;
      optionGroup.append(option);
    });

    selectElement.append(optionGroup);
  });

  const otherOption = document.createElement("option");
  otherOption.value = "other";
  otherOption.textContent = "Another place in Douala";
  selectElement.append(otherOption);
}

function formatLocation(area, landmark) {
  if (landmark.trim() === "") {
    return area;
  }

  return `${area} - ${landmark.trim()}`;
}

function updateOtherAreaInput(areaSelect, otherAreaInput) {
  const needsCustomArea = areaSelect.value === "other";

  otherAreaInput.hidden = !needsCustomArea;
  otherAreaInput.required = needsCustomArea;

  if (!needsCustomArea) {
    otherAreaInput.value = "";
  }
}

function getSelectedArea(formData, areaFieldName, otherAreaFieldName) {
  const selectedArea = formData.get(areaFieldName);

  if (selectedArea === "other") {
    return formData.get(otherAreaFieldName).trim();
  }

  return selectedArea;
}

function formatPickupDate(dateValue, timeValue) {
  const pickupDate = new Date(`${dateValue}T${timeValue}`);
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(pickupDate);
}

function showBookingDetails(formData) {
  const pickup = formatLocation(
    getSelectedArea(formData, "pickupArea", "pickupOther"),
    formData.get("pickupLandmark"),
  );
  const dropoff = formatLocation(
    getSelectedArea(formData, "dropoffArea", "dropoffOther"),
    formData.get("dropoffLandmark"),
  );

  document.querySelector("#result-pickup").textContent = pickup;
  document.querySelector("#result-dropoff").textContent = dropoff;
  document.querySelector("#result-passenger").textContent = formData.get("passengerName");
  document.querySelector("#result-time").textContent = formatPickupDate(
    formData.get("date"),
    formData.get("time"),
  );

  bookingResult.hidden = false;
  bookingResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

addAreaOptions(pickupAreaSelect);
addAreaOptions(dropoffAreaSelect);
pickupAreaSelect.addEventListener("change", () => {
  updateOtherAreaInput(pickupAreaSelect, pickupOtherInput);
});
dropoffAreaSelect.addEventListener("change", () => {
  updateOtherAreaInput(dropoffAreaSelect, dropoffOtherInput);
});

const dateInput = bookingForm.elements.date;
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
  .toISOString()
  .slice(0, 10);
dateInput.min = localToday;

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(bookingForm);
  showBookingDetails(formData);
});