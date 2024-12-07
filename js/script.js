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
const main = document.getElementById('main');

const lockScrollPageToggle = () => {
	main.classList.toggle('main--is-locked');
}

const createModalElement = (tag, className, textContent) => {
	const tagEl = document.createElement(tag);
	tagEl.className = className;

	if (textContent) tagEl.textContent = textContent;

	return tagEl;
}

const createModal = (data) => {
	const modalEl = createModalElement('div', 'modal');
	const headerEl = createModalElement('div', 'modal__header');
	const titleEl = createModalElement('h2', 'modal__title', data.name);
	const closeEl = createModalElement('button', 'modal__close', '×');
	const contentEl = createModalElement('div', 'modal__content', data.content);

	closeEl.addEventListener('click', () => {
        lockScrollPageToggle();
		modalEl.remove();
    });

	headerEl.appendChild(titleEl);
	headerEl.appendChild(closeEl);
	modalEl.appendChild(headerEl);
	modalEl.appendChild(contentEl);

	main.appendChild(modalEl);
}

map.addEventListener('click', (event) => {
	if (event.target.classList.contains('map__camp')) {
		console.log(`Ищем инфу для лагеря: ${event.target.id}`);
		// Блокируем скролл для модалки 
		lockScrollPageToggle();

		jsonData.filter((element) => {
			if (element.id === event.target.id) {
				console.log(element);
				
				createModal(element);
			}
		});
	}
})

const createJson = (inputJsonData) => {
	inputJsonData.forEach((element) => {
		jsonData.push(element);
	});
};

const data = fetch("./data/data.json")
	.then((response) => response.json())
	.then((data) => createJson(data));

// filters
const showCampsInCountry = (id) => {
	const country = map.getElementById(id);

	if (!country) {console.error("Country not found"); return}

	country.classList.add('map__country--is-active');
};

const hideAllCamps = (isReverse) => {
	if (isReverse) {
		allCamps.forEach((camp) => {
			camp.classList.remove('map__camp--is-hidden');
		});
	} else {
		allCamps.forEach((camp) => {
			camp.classList.add('map__camp--is-hidden');
		});
	};
}

const showCampsByFilter = (filter) => {
	console.log(`Активный фильтр: "${filter}"`);

	if (filter !== 'all') {
		hideAllCamps();
	} else {
		hideAllCamps(true);
		return;
	};

	console.log('Показываем по фильтру');
	jsonData.filter((camp) => {
		if (camp.purpose[filter]) {
			showCampByFilter(camp.id);
		}
	});
};

const showCampByFilter = (id) => {
	allCamps.filter((camp) => {
		if (camp.id === id) {
			camp.classList.remove('map__camp--is-hidden');
		}
	});
};

const allFiltersButtons = document.querySelectorAll('[filter]');
const allCamps = Array.from(map.querySelectorAll('.map__camp'));

allFiltersButtons.forEach((el) => {
	el.addEventListener("click", () => {
		showCampsByFilter(el.getAttribute('filter'))
	});
});
// filters
