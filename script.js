const modelsByCar = {
  Mercedes: ["S-class", "E-class", "Sprinter"],
  Volkswagen: ["Passat", "Tiguan", "Polo"],
  Audi: ["Q5", "A7", "Q7"],
};

const brandSelect = document.getElementById("brandcar");
const modelSelect = document.getElementById("model");

brandSelect.addEventListener("change", function () {
  const selected = this.value;
  const models = modelsByCar[selected] || [];

  modelSelect.innerHTML = "<option value=''>Оберіть модель</option>";

  models.forEach(function (model) {
    const option = document.createElement("option");
    option.text = model;
    option.value = model.toLowerCase().replace(/\s/g, "_");
    modelSelect.add(option);
  });
});

const cars = JSON.parse(localStorage.getItem("cars")) || [];
const form = document.getElementById("carform");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(form);
  const car = {};
  for (let [key, value] of formData.entries()) {
    car[key] = value;
  }
  cars.push(car);
  localStorage.setItem("cars", JSON.stringify(cars));
  form.reset();
});

document.getElementById("showResults").addEventListener("click", function () {
  const selectedBrand = document.getElementById("brandcar1").value;
  const cars = JSON.parse(localStorage.getItem("cars")) || [];
  const filteredCars = cars.filter((car) => car.brandcar === selectedBrand);
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  if (filteredCars.length > 0) {
    const Header = document.createElement("h2");
    Header.textContent = `Клієнти що замовили автомобіль марки ${selectedBrand}`;
    resultsDiv.appendChild(Header);
    const resultList = document.createElement("ul");
    filteredCars.forEach((car) => {
      const listItem = document.createElement("li");
      listItem.textContent = `Клієнт: ${car.name}, Електронна пошта: ${car.email}, Mobile phone: ${car.phone2numeric}, Модель: ${car.model}, Офіс: ${car.ofice}, Рік випуску:${car.year} `;
      resultList.appendChild(listItem);
    });
    resultsDiv.appendChild(resultList);
  } else {
    resultsDiv.textContent = "Немає результатів для цієї марки машини";
  }
});
