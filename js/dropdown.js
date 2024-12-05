const jsonData = [];
const countries = [
  {
    id: "",
    caption: "СССР (совр. Беларусь)",
  },
  {
    id: "",
    caption: "СССР (совр. Латвия)",
  },
  {
    id: "",
    caption: "СССР (совр. Литва)",
  },
  {
    id: "",
    caption: "СССР (совр. Россия)",
  },
  {
    id: "",
    caption: "СССР (совр. Украина)",
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
    id: "",
    caption: "Верхняя Силезия (совр. Польша)",
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

const createJson = (inputJsonData) => {
  inputJsonData.forEach((element) => {
    jsonData.push(element);
  });
};

const data = fetch("./data/data.json")
  .then((response) => response.json())
  .then((data) => createJson(data));

// dropdown
const createDropdownLiEl = (content) => {
  const liEl = document.createElement("li");
  liEl.className = "dropdown__element";
  // liEl.id = this.idCount;

  // liEl.setAttribute('messageType', 'regular');

  liEl.innerHTML = `<a class="name">${content}</a>`;

  return liEl;
};

const createDropdownContent = (dropdown) => {
  const id = dropdown.getAttribute("id");
  const filter = dropdown.getAttribute("filter");
  const contentBlock = dropdown.querySelector(".dropdown__content");

  // Выводим все лагеря, соответствующие фильтру
  if (id === "camp-countries") {
    countries.map((data) => {
      contentBlock.appendChild(createDropdownLiEl(data.caption));
    });
  } else {
    jsonData.map((data) => {
      if (data.purpose[filter] === true) {
        contentBlock.appendChild(createDropdownLiEl(data.name));
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
