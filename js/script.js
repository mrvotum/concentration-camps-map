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

const audio = new Audio();
let activeSound = null;

const topBarFilters = document.querySelectorAll('[top-bar-filter]');

audio.addEventListener('ended', () => {
	if (activeSound) activeSound.classList.remove('modal__audio--is-active');
});

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


const lockScrollPageToggle = () => {
	main.classList.toggle('main--is-locked');
}

const removeModal = (modal) => {
	modal.remove();

	openedModal = null;

	lockScrollPageToggle();
};

const packingElements = (parentElement, childrenElements) => {
	childrenElements.forEach((child) => parentElement.appendChild(child));
}

const createModalElement = (tag, className, textContent, attributes) => {
	const tagEl = document.createElement(tag);
	tagEl.className = className;

	if (textContent) {
		if (typeof textContent === 'object') tagEl.appendChild(textContent);
		else tagEl.innerHTML = textContent;
	}

	if (attributes) {
		attributes.forEach((attribute) => {
			for (key in attribute) {
				tagEl.setAttribute(key, attribute[key]);
			}
		});
	}

	return tagEl;
}

const audioToggler = (audioSrc, playButton) => {
	if (activeSound) {
		audio.pause();
		activeSound = null;
	} else {
		audio.src = `./sound/${audioSrc}.mp3`;
		audio.play();
		activeSound = playButton;
	}

	if (playButton)	playButton.classList.toggle("modal__audio--is-active");
}

const createCampModal = (data) => {
	const modalClassModifier = Object.keys(data.purpose)[0];

	const modalEl = createModalElement('div', `modal modal--is-${modalClassModifier}`);
	const headerEl = createModalElement('div', 'modal__header');
	const titleBlockEl = createModalElement('div', 'modal-title');
	const titleEl = createModalElement('h2', 'modal-title__caption', `«${data.name}»`);
	const titleWrapperEl = createModalElement('div', 'modal-title__wrapper');
	const countryEl = createModalElement('h3', 'modal-title__caption', data.country.caption);

	titleBlockEl.appendChild(titleEl);
	titleWrapperEl.appendChild(countryEl);

	for (key in data.purpose) {
		const imgEl = createModalElement('img', 'modal-title__img', false, [{src: `./i/ico_camp_${key}_2x.png`}, {alt: key}]);
		titleWrapperEl.appendChild(imgEl);
	};

	titleBlockEl.appendChild(titleWrapperEl);	

	const playEl = createModalElement('button', 'modal__audio');
	const closeEl = createModalElement('button', 'modal__close');
	const imgEl = createModalElement('img', 'modal__img', false, [{src: `./i/camp_${data.id.toLowerCase()}.png`, alt: `Фото лагеря «${data.name}»`}]);
	const textWrapperEl = createModalElement('div', 'modal__wrapper', data.content);
	const contentEl = createModalElement('div', 'modal__content');

	packingElements(contentEl, [textWrapperEl, imgEl]);

	closeEl.addEventListener('click', () => {
        lockScrollPageToggle();
		audioToggler();
		modalEl.remove();
    });

	playEl.addEventListener('click', () => {
		audioToggler(data.audio, playEl);
    });

	packingElements(headerEl, [titleBlockEl, playEl, closeEl]);
	packingElements(modalEl, [headerEl, contentEl]);

	main.appendChild(modalEl);
}

const createModal = (title, content, classModifier) => {
	const modalEl = createModalElement('div', 'modal');
	const headerEl = createModalElement('div', 'modal__header');
	const titleEl = createModalElement('h2', 'modal-title__caption', title);
	const closeEl = createModalElement('button', 'modal__close');
	const contentEl = createModalElement('div', 'modal__content', content);

	if (classModifier) {
		typeof classModifier === 'string' ? modalEl.classList.add(`modal--${classModifier}`) : classModifier.forEach((className) => modalEl.classList.add(`modal--${className}`));
	}

	openedModal = modalEl;

	closeEl.addEventListener('click', () => {
		removeModal(modalEl);
    });

	packingElements(headerEl, [titleEl, closeEl]);
	packingElements(modalEl, [headerEl, contentEl]);

	main.appendChild(modalEl);
}

const createContentForModal = (contentArr, buttonCaptionKey, isShowCampByCountry) => {
	const modalContent = createModalElement('ol', 'modal__list');

	contentArr.forEach((contentElement) => {
		const itemEl = createModalElement('li', 'modal__item');
		const buttonEl = createModalElement('button', 'modal__button', contentElement[buttonCaptionKey]);
		buttonEl.addEventListener('click', () => {
			hideAllCamps();
			removeModal(openedModal);
			isShowCampByCountry ? showCampsInCountry(contentElement.id) : showCampByFilter(contentElement.id);;
		});
		itemEl.appendChild(buttonEl);
		modalContent.appendChild(itemEl);
	});

	return modalContent;
}

topBarFilters.forEach((button) => {
	button.addEventListener('click', () => {
		lockScrollPageToggle();

		switch (button.getAttribute('top-bar-filter')) {
			case 'countries':
				const countriesContent = createContentForModal(countries, 'caption', true);
				createModal('По странам', countriesContent, ['has-fixed-size', 'has-fixed-columns']);
				break;
			case 'alphabet':
				const alphabetContent = createContentForModal(jsonData, 'name');
				createModal('По алфавиту', alphabetContent, 'has-fixed-size');
				break;
			case 'about':
				const aboutContent = `<div style="margin-left:7rem;margin-right:3rem;"><p>По&nbsp;некоторым данным не&nbsp;менее 18&nbsp;миллионов человек прошли через концентрационные лагеря нацистской германии с&nbsp;1936 по&nbsp;1945&nbsp;г.&nbsp;г.<br>Из&nbsp;них могло быть уничтожено не&nbsp;менее 11&nbsp;миллионов.</p><p>Нацисты использовали лагеря для бесчеловечных медицинских опытов, для рабского труда и&nbsp;издевательств. Помимо этого они просто уничтожали узников в&nbsp;газовых камерах.</p><p>В&nbsp;нашем спецпроекте мы&nbsp;собрали информацию обо всех этих лагерях, где они находились, какие ужасы в&nbsp;них творились, а&nbsp;также о&nbsp;том, кто и&nbsp;когда освободил выживших узников концлагерей.</p><p>Наш проект мы&nbsp;посвящаем памяти всех погибших!<br>Чтобы никто и&nbsp;никогда не&nbsp;забыл о&nbsp;чудовищных преступлениях нацистов!</p><div>`
				createModal('О проекте', aboutContent);
				break;
			default:
				break;
		}
    });
});

map.addEventListener('click', (event) => {
	if (event.target.classList.contains('map__camp') && !main.classList.contains('main--is-locked')) {
		lockScrollPageToggle();

		jsonData.filter((element) => {
			if (element.id === event.target.id) {
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
	if (filter !== 'all') {
		hideAllCamps();
	} else {
		hideAllCamps(true);
		return;
	};

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
