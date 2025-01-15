const jsonData = [];
const countries = [
	{
		id: "GB",
		caption: "Великобритания",
	}, {
		id: "DE",
		caption: "Германия",
	}, {
		id: "IT",
		caption: "Италия",
	}, {
		id: "LV",
		caption: "Латвия",
	}, {
		id: "LT",
		caption: "Литва",
	}, {
		id: "NL",
		caption: "Нидерланды",
	}, {
		id: "NO",
		caption: "Норвегия",
	}, {
		id: "PL",
		caption: "Польша",
	}, {
		id: "USSR",
		caption: "СССР",
	}, {
		id: "FI",
		caption: "Финляндия",
	}, {
		id: "FR",
		caption: "Франция",
	}, {
		id: "CZ",
		caption: "Чехия",
	}, {
		id: "EE",
		caption: "Эстония",
	}, {
		id: "UG",
		caption: "Югославия",
	},
];
const map = document.getElementById('map');
const mapSvg = document.getElementById('mapSvg');
const mapWrapper = document.getElementById('mapWrapper');
const main = document.getElementById('main');

let oldCoords = {x: 0, y: 0};

let openedModal = null;

const audio = new Audio();
let activeSound = null;

const topBarFilters = document.querySelectorAll('[top-bar-filter]');

audio.addEventListener('ended', () => {
	if (activeSound) activeSound.classList.remove('modal__audio--is-active');
});

const allFiltersButtons = document.querySelectorAll('[data-filter]');
const allSvgCamps = Array.from(mapSvg.querySelectorAll('.map__camp'));
const allSvgCountries = Array.from(mapSvg.querySelectorAll('[country]'));

const createJson = (inputJsonData) => {
	inputJsonData.forEach((element) => {
		jsonData.push(element);
	});
};

const data = fetch("./data/data.json")
	.then((response) => response.json())
	.then((data) => createJson(data))
	.then(() => createTooltipsData());

const pz = panzoom(map, {
	bounds: true,
	boundsPadding: 1,
	maxZoom: 3,
	minZoom: 1
});

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

const packingElements = (parentElement, childrenElements) => {
	childrenElements.forEach((child) => parentElement.appendChild(child));
}

const createModalElement = (tag, className, textContent, attributes) => {
	const tagEl = document.createElement(tag);
	if (className) tagEl.className = className;

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

const addAnimation = (parent, data) => {
	data.split('<splitTag>').forEach((paragraph, index) => {
		let paragraphFormatted = createModalElement('p', 'moving-up', paragraph);

		paragraphFormatted.style.animationDelay = `${index * 0.2}s`;

		parent.appendChild(paragraphFormatted);
	});
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
	const imgEl = createModalElement('img', 'modal-title__img', false, [{src: `./i/ico_camp_${key}_2x.png`}, {alt: key}, {loading: "lazy"}]);
		titleWrapperEl.appendChild(imgEl);
	};

	titleBlockEl.appendChild(titleWrapperEl);

	const playEl = createModalElement('button', 'modal__audio');
	const closeEl = createModalElement('button', 'modal__close');

	const imWrapper = createModalElement('div', 'modal-img', false, [{src: `./i/camps/camp_${data.id.toLowerCase()}.jpg`, alt: `Фото лагеря «${data.name}»`}]);
	const imgEl = createModalElement('img', 'modal-img__item', false, [{src: `./i/camps/camp_${data.id.toLowerCase()}.jpg`, alt: `Фото лагеря «${data.name}»`}, {loading: "lazy"}]);
	const imgCaption = createModalElement('span', 'modal-img__caption', `Фото: ${data.photoInfo}`);

	packingElements(imWrapper, [imgEl, imgCaption]);

	const textWrapperEl = createModalElement('div', 'modal__wrapper');

	addAnimation(textWrapperEl, data.content);

	const contentEl = createModalElement('div', 'modal__content');

	packingElements(contentEl, [textWrapperEl, imWrapper]);

	closeEl.addEventListener('click', () => {
        lockScrollPageToggle();
		audioToggler();
		modalEl.remove();
    });

	playEl.addEventListener('click', () => {
		audioToggler(data.id, playEl);
    });

	packingElements(headerEl, [titleBlockEl, playEl, closeEl]);
	packingElements(modalEl, [headerEl, contentEl]);

	main.appendChild(modalEl);
}

const createModal = (el, title, content, classModifier, audioId) => {
	const modalEl = createModalElement('div', 'modal');
	const headerEl = createModalElement('div', 'modal__header');
	const titleEl = createModalElement('h2', 'modal-title__caption', title);
	const playEl = createModalElement('button', 'modal__audio');
	const closeEl = createModalElement('button', 'modal__close');
	const contentEl = createModalElement('div', 'modal__content', content);

	if (classModifier) {
		typeof classModifier === 'string' ? modalEl.classList.add(`modal--${classModifier}`) : classModifier.forEach((className) => modalEl.classList.add(`modal--${className}`));
	}

	openedModal = modalEl;

	closeEl.addEventListener('click', () => {
        lockScrollPageToggle();
		modalEl.remove();
		el.classList.remove('top-bar__control--is-active');

		if (audioId) {
			audioToggler();
		}
    });

	if (audioId) {
		playEl.addEventListener('click', () => {
			audioToggler(audioId, playEl);
		});
	} else {
		playEl.classList.add('modal__audio--is-hidden')
	}

	packingElements(headerEl, [titleEl, playEl, closeEl]);
	packingElements(modalEl, [headerEl, contentEl]);

	main.appendChild(modalEl);
}

const createContentForModal = (contentArr, buttonCaptionKey, isShowCampByCountry) => {
	const modalContent = createModalElement('ol', 'modal__list');

	const addLocalAnimation = ((element, index, arrLength) => {
		if (arrLength > 28 && index > 26) {
			let j = index - 27;
			element.style.animationDelay = `${j * 0.1}s`;
		} else {
			element.style.animationDelay = `${index * 0.1}s`;
		}
	});

	contentArr.forEach((contentElement, index) => {
		const itemEl = createModalElement('li', 'modal__item moving-up');
		const counter = createModalElement('span', 'modal__counter', `${index + 1}.`);

		addLocalAnimation(itemEl, index, contentArr.length);

		const buttonEl = createModalElement('button', 'modal__button', contentElement[buttonCaptionKey]);
		buttonEl.addEventListener('click', () => {
			hideAllCamps();
			removeModal(openedModal);
			isShowCampByCountry ? showCampsInCountry(contentElement.id) : showCampByFilter(contentElement.id);
			campInCurrentFocus = contentElement.id;
			focusOnElement(contentElement.id);
		});
		
		buttonEl.appendChild(counter);
		itemEl.appendChild(buttonEl);
		modalContent.appendChild(itemEl);
	});

	return modalContent;
}

topBarFilters.forEach((button) => {
	button.addEventListener('click', () => {
		lockScrollPageToggle();
		button.classList.add('top-bar__control--is-active');

		switch (button.getAttribute('top-bar-filter')) {
			case 'countries':
				const countriesContent = createContentForModal(countries, 'caption', true);
				createModal(button, 'По странам', countriesContent, ['has-fixed-size', 'has-fixed-columns']);
				break;
			case 'alphabet':
				const alphabetContent = createContentForModal(jsonData, 'name');
				createModal(button, 'Список нацистских лагерей по алфавиту', alphabetContent, 'has-fixed-size');
				break;
			case 'about':
				const aboutTextContent = 'Система концлагерей в&nbsp;Германии возникла в&nbsp;1933&ndash;34&nbsp;гг с&nbsp;приходом к&nbsp;власти нацистов и&nbsp;достигла расцвета в&nbsp;период II&nbsp;Мировой войны: более 14&nbsp;000 таких мест было создано на&nbsp;территории рейха и&nbsp;оккупированных стран.<splitTag>Через них прошли, по&nbsp;современным оценкам, не&nbsp;менее 18&nbsp;миллионов человек, каждым пятым узником был ребенок. Приблизительное число жертв &laquo;фабрик смерти&raquo;&nbsp;&mdash; не&nbsp;менее 11&nbsp;миллионов.<splitTag>Нацисты использовали узников для принудительного труда, бесчеловечных &laquo;медицинских&raquo; экспериментов, их&nbsp;подвергали пыткам и&nbsp;издевательствам, не&nbsp;щадя ни&nbsp;женщин, ни&nbsp;детей, ни&nbsp;стариков. А&nbsp;тех, кого считали непригодным для этих целей&nbsp;&mdash; уничтожали.<splitTag>В&nbsp;нашем спецпроекте мы&nbsp;рассказываем истории 55&nbsp;нацистских концлагерей&nbsp;&mdash; для того, чтобы никогда забывать о&nbsp;чудовищной катастрофе, постигшей человечество. Пусть она никогда не&nbsp;повторится!';
				const aboutContentWrapper = createModalElement('div', false, false, [{style: 'margin-left:7rem;margin-right:3rem;'}]);
				addAnimation(aboutContentWrapper, aboutTextContent);
				createModal(button, 'О проекте', aboutContentWrapper, false, 'About');
				break;
			default:
				break;
		}
    });
});

const campClickHandler = (isTargetCamp, targetId) => {
	if (isTargetCamp && !main.classList.contains('main--is-locked')) {
		lockScrollPageToggle();

		jsonData.filter((element) => {
			if (element.id === targetId) {
				createCampModal(element);
			}
		});
	}
};

mapSvg.addEventListener('click', (event) => {
	campClickHandler(event.target.classList.contains('map__camp'), event.target.id);
})

mapSvg.addEventListener('touchstart', (event) => {
	campClickHandler(event.target.classList.contains('map__camp'), event.target.id);
})

// filters
const showCampsInCountry = (id) => {
	const country = mapSvg.getElementById(id);

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

const focusOnElement = (elementId)  => {
	const camp = mapSvg.getElementById(elementId);

	if (oldCoords.x || oldCoords.y) {
		pz.zoomTo(oldCoords.x, oldCoords.y, 0.25);
	}

	setTimeout(() => {
		const elementRect = camp.getBoundingClientRect();

		const elementCenterX = elementRect.x + elementRect.width / 2;
		const elementCenterY = camp.getBoundingClientRect().y;

		pz.smoothZoom(elementCenterX, elementCenterY + 40, 2.5);

		oldCoords = {x: elementCenterX, y: elementCenterY};
	}, 100);
}

const scaleButtons = document.querySelectorAll('[data-scale-button]');

scaleButtons.forEach(button => {
	button.addEventListener('click', () => {
		const isZoomIn = button.dataset.scaleButton === 'increase';
		const zoomBy = isZoomIn ? 2 : 0.5;
		
		if (oldCoords.x || oldCoords.y) pz.smoothZoom(oldCoords.x, oldCoords.y, zoomBy);
		else pz.smoothZoom(1300/2, 480/2, zoomBy);
	});
});
