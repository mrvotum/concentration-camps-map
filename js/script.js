const jsonData = [];
const countries = [
	{
		id: "LV",
		caption: "СССР (совр. Латвия)",
	  },
	  {
		id: "LT",
		caption: "СССР (совр. Литва)",
	  },
	  {
		id: "RU",
		caption: "СССР (совр. Россия)",
	  },
	  {
		id: "BY",
		caption: "Беларусь",
	  },
	  {
		id: "GB",
		caption: "Великобритания",
	  },
	  {
		id: "DE",
		caption: "Германия",
	  },
	  {
		id: "IT",
		caption: "Италия",
	  },
	  {
		id: "NL",
		caption: "Нидерланды",
	  },
	  {
		id: "NO",
		caption: "Норвегия",
	  },
	  {
		id: "PL",
		caption: "Польша",
	  },
	  {
		id: "UA",
		caption: "Украина",
	  },
	  {
		id: "FI",
		caption: "Финляндия",
	  },
	  {
		id: "FR",
		caption: "Франция",
	  },
	  {
		id: "CZ",
		caption: "Чехия",
	  },
	  {
		id: "UG",
		caption: "Югославия (совр. Сербия)",
	  },
	  {
		id: "EE",
		caption: "Эстония",
	  },
];
const map = document.getElementById('map');

const createJson = (inputJsonData) => {
	inputJsonData.forEach((element) => {
		jsonData.push(element);
	});
};

const data = fetch("./data/data.json")
	.then((response) => response.json())
	.then((data) => createJson(data));

// dropdown
const showCampsInCountry = (id) => {
	const country = map.getElementById(id);

	if (!country) {console.error("Country not found"); return}

	country.classList.add('map__country--is-active');
};

const showCampsByFilter = (id, filter) => {
	console.log(id);
	console.log(filter);
};

const createDropdownLiEl = (id, content, filter) => {
	const buttonEl = document.createElement("button");
	buttonEl.id = id;
	buttonEl.className = "dropdown__element";
	buttonEl.type = "button";
	buttonEl.textContent = content;
	buttonEl.addEventListener("click", () => {
		if (filter) {
			showCampsByFilter(id, filter);
		} else {
			showCampsInCountry(id);
		}
	});

	const liEl = document.createElement("li");
	// liEl.id = this.idCount;

	// liEl.setAttribute('messageType', 'regular');

	// liEl.innerHTML = `<button type="button" class="name">${content}</button>`;

	liEl.appendChild(buttonEl);

	return liEl;
};

const createDropdownContent = (dropdown) => {
	const id = dropdown.getAttribute("id");
	const filter = dropdown.getAttribute("filter");
	const contentBlock = dropdown.querySelector(".dropdown__content");

	// Выводим все лагеря, соответствующие фильтру
	if (id === "camp-countries") {
		countries.map((data) => {
			contentBlock.appendChild(createDropdownLiEl(data.id, data.caption));
		});
	} else {
		jsonData.map((data) => {
			if (data.purpose[filter]) {
				contentBlock.appendChild(createDropdownLiEl(data.id, data.name, filter));
			}
		});
	}

	dropdown.setAttribute("hasContent", true);
};

function dropdownToggler(dropdown) {
	closeAllDropdowns(dropdown);
	dropdown.classList.toggle("dropdown--is-open");

	if (!dropdown.getAttribute("hasContent")) {
		createDropdownContent(dropdown);
	}
}

const allDropdowns = document.querySelectorAll(".dropdown");

const closeAllDropdowns = (exception) => {
	allDropdowns.forEach((el) => {
		if (el !== exception) {
			el.classList.remove("dropdown--is-open");
		}
	});
};

allDropdowns.forEach((el) => {
	el.addEventListener("click", () => {
		dropdownToggler(el);
	});
});

document.addEventListener("click", (event) => {
	if (
		event.target !== "a" &&
		!event.target.classList.contains("dropdown__toggle")
	) {
		closeAllDropdowns();
	}
});
// dropdown
