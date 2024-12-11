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
const mapWrapper = document.getElementById('mapWrapper');
const main = document.getElementById('main');

let openedModal = null;

let playStatus = false;
const audio = new Audio();
const topBarFilters = document.querySelectorAll('[top-bar-filter]');


const allFiltersButtons = document.querySelectorAll('[data-filter]');
const allSvgCamps = Array.from(map.querySelectorAll('.map__camp'));
const allSvgCountries = Array.from(map.querySelectorAll('[country]'));

const createJson = (inputJsonData) => {
	inputJsonData.forEach((element) => {
		jsonData.push(element);
	});
};

const data = fetch("./data/data.json")
	.then((response) => response.json())
	.then((data) => createJson(data))
	.then(() => createTooltipsData());


document.getElementById('close-start-page').addEventListener('click', () => {
	document.getElementById('start-page').classList.add('page-start--is-hidden');
	document.getElementById('main-content').classList.remove('main__wrapper--is-hidden');
});

// Для отладки!!!!!
// document.getElementById('start-page').classList.add('page-start--is-hidden');
// document.getElementById('main-content').classList.remove('main__wrapper--is-hidden');

const lockScrollPageToggle = () => {
	main.classList.toggle('main--is-locked');
}

const removeModal = (modal) => {
	modal.remove();

	openedModal = null;

	lockScrollPageToggle();
};

const createModalElement = (tag, className, textContent) => {
	const tagEl = document.createElement(tag);
	tagEl.className = className;

	if (textContent) {
		if (typeof textContent === 'object') tagEl.appendChild(textContent);
		else tagEl.innerHTML = textContent;
	}

	return tagEl;
}

const createCampModal = (data) => {
	const modalEl = createModalElement('div', 'modal');
	const headerEl = createModalElement('div', 'modal__header');
	const titleEl = createModalElement('h2', 'modal__title', data.name);
	const playEl = createModalElement('button', 'modal__close', 'play');
	const closeEl = createModalElement('button', 'modal__close');
	const contentEl = createModalElement('div', 'modal__content', data.content);

	closeEl.addEventListener('click', () => {
        lockScrollPageToggle();
		audio.pause();
		playStatus = false;
		modalEl.remove();
    });

	playEl.addEventListener('click', () => {
		if(!playStatus) {
			console.log('play');
			audio.src = `./sound/${data.audio}.mp3`;
			audio.play();
			playStatus = true;
			playEl.textContent = "Stop";
		} else {
			audio.pause();
			playStatus = false;

			playEl.textContent = "Play";
		}
    });

	headerEl.appendChild(titleEl);
	headerEl.appendChild(playEl);
	headerEl.appendChild(closeEl);
	modalEl.appendChild(headerEl);
	modalEl.appendChild(contentEl);

	main.appendChild(modalEl);
}


createModal = (title, content) => {
	const modalEl = createModalElement('div', 'modal');
	const headerEl = createModalElement('div', 'modal__header');
	const titleEl = createModalElement('h2', 'modal__title', title);
	const closeEl = createModalElement('button', 'modal__close');
	const contentEl = createModalElement('div', 'modal__content', content);

	openedModal = modalEl;

	closeEl.addEventListener('click', () => {
		removeModal(modalEl);
    });

	headerEl.appendChild(titleEl);
	headerEl.appendChild(closeEl);
	modalEl.appendChild(headerEl);
	modalEl.appendChild(contentEl);

	main.appendChild(modalEl);
}

topBarFilters.forEach((button) => {
	button.addEventListener('click', () => {
		lockScrollPageToggle();

		switch (button.getAttribute('top-bar-filter')) {
			case 'countries':
				const listEl = createModalElement('ol', 'modal__list');
				
				countries.forEach((country) => {
                    const itemEl = createModalElement('li', 'modal__item');
                    const buttonEl = createModalElement('button', 'modal__button', country.caption);
					buttonEl.addEventListener('click', () => {
						hideAllCamps();
						removeModal(openedModal);
						showCampsInCountry(country.id);
					});
					itemEl.appendChild(buttonEl);

                    listEl.appendChild(itemEl);
                });

				createModal('По странам', listEl);

				break;
			case 'alphabet':
				const contentEl = createModalElement('ol', 'modal__list');
				
				jsonData.forEach((camp) => {
                    const itemEl = createModalElement('li', 'modal__item');
                    const buttonEl = createModalElement('button', 'modal__button', camp.name);
					buttonEl.addEventListener('click', () => {
						hideAllCamps();
						removeModal(openedModal);
						showCampByFilter(camp.id);
					});
					itemEl.appendChild(buttonEl);
                    contentEl.appendChild(itemEl);
                });

				createModal('По алфавиту', contentEl);

				break;
			case 'about':
				console.log('about open');
				const content = `<div style="max-width:41rem;margin-left:7rem;margin-right:3rem;margin-bottom:2rem;"><p>По&nbsp;некоторым данным не&nbsp;менее 18&nbsp;миллионов человек прошли через концентрационные лагеря нацистской германии с&nbsp;1936 по&nbsp;1945&nbsp;г.&nbsp;г. Из&nbsp;них могло быть уничтожено не&nbsp;менее 11&nbsp;миллионов.</p><p>Нацисты использовали лагеря для бесчеловечных медицинских опытов, для рабского труда и&nbsp;издевательств. Помимо этого они просто уничтожали узников в&nbsp;газовых камерах.</p><p>В&nbsp;нашем спецпроекте мы&nbsp;собрали информацию обо всех этих лагерях, где они находились, какие ужасы в&nbsp;них творились, а&nbsp;также о&nbsp;том, кто и&nbsp;когда освободил выживших узников концлагерей.</p><p>Наш проект мы&nbsp;посвящаем памяти всех погибших!<br>Чтобы никто и&nbsp;никогда не&nbsp;забыл о&nbsp;чудовищных преступлениях нацистов!</p><div>`
				createModal('О проекте', content);
				break;
			default:
				break;
		}
    });
});


map.addEventListener('click', (event) => {
	if (event.target.classList.contains('map__camp') && !main.classList.contains('main--is-locked')) {
		console.log(`Ищем инфу для лагеря: ${event.target.id}`);
		// Блокируем скролл для модалки 
		lockScrollPageToggle();

		jsonData.filter((element) => {
			if (element.id === event.target.id) {
				console.log(element);
				
				createCampModal(element);
			}
		});
	}
})

// filters
const showCampsInCountry = (id) => {
	const country = map.getElementById(id);

	if (!country) {console.error(`Country "${id}" not found`); return}

	country.classList.add('map__country--is-active');
};

const hideAllCamps = (isReverse) => {
	allSvgCountries.map((country) => {
		if (country.classList.contains('map__country--is-active')) {
			country.classList.remove('map__country--is-active');
		};
	});

	if (isReverse) {
		allSvgCamps.forEach((camp) => {
			camp.classList.remove('map__camp--is-hidden');
		});
	} else {
		allSvgCamps.forEach((camp) => {
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
	allSvgCamps.filter((camp) => {
		if (camp.id === id) {
			camp.classList.remove('map__camp--is-hidden');
		}
	});
};

allFiltersButtons.forEach((el) => {
	el.addEventListener("click", () => {
		showCampsByFilter(el.getAttribute('data-filter'))
	});
});
// filters







// tooltips
let tooltipElem;

const createTooltipsData = () => {
	allSvgCamps.forEach((el) => {
		let camp = jsonData.find((camp) => {return camp.id === el.getAttribute('id')});
	
		el.setAttribute('data-tooltip', camp.name);
	});
}


allSvgCamps.forEach((el) => {
	el.addEventListener("mouseover", (event) => {
		let tooltipHtml = el.dataset.tooltip;
		if (!tooltipHtml) return;
	
		tooltipElem = createModalElement('div', 'tooltip', tooltipHtml);
		mapWrapper.appendChild(tooltipElem);
	
		let left = event.layerX + 15;
		let top = event.layerY;
	
		tooltipElem.style.left = left + 'px';
		tooltipElem.style.top = top + 'px';
	});

	el.addEventListener("mouseout", () => {
		if (tooltipElem) {
			tooltipElem.remove();
			tooltipElem = null;
		}
	});
});








