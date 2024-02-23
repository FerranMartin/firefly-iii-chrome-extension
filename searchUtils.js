window.onload = function () {
  addQuickSearches();
  addTotalRow();
};

/*------------------*/
/* Total Amount Row */
/*------------------*/

function addTotalRow() {
  awaitElement(".search_results table").then((table) => {
    const totalAmount = getTotalAmount({ table });
    insertTotalAmountRow({ table, totalAmount });
  });
}

function getTotalAmount({ table }) {
  const tbody = table.tBodies[0];

  const amounts = [];
  const columnIndexWithAmounts = 2;
  Array.from(tbody.rows).forEach((row) => {
    const stringAmount = row.children[
      columnIndexWithAmounts
    ].textContent.replace(",", ".");
    const amount = parseFloat(stringAmount);
    amounts.push(amount);
  });

  return amounts.reduce((acc, curr) => acc + curr, 0);
}

function insertTotalAmountRow({ table, totalAmount }) {
  const tbody = table.tBodies[0];

  // Get number of columns in tbody
  const numberOfColumns = tbody.rows[0].cells.length;

  // Insert a new row at the end with the same number of columns
  const newRow = tbody.insertRow(-1);
  for (let i = 0; i < numberOfColumns; i++) {
    newRow.insertCell(i);
  }
  newRow.style.fontWeight = "bold";
  newRow.style.backgroundColor = "lightgray";
  newRow.style.textAlign = "right";

  // At column 3, insert the totalAmount
  newRow.children[2].textContent = `Total: ${totalAmount.toFixed(2)} €`;
}

/*------------------*/
/*  Quick searches  */
/*------------------*/

const QUICK_SEARCHES = {
  restaurants_ultim_mes: {
    search: `category_is:restaurants date_after:"start of this month"`,
    label: "Restaurants últim mes",
  },
  restaurants_X_mes: {
    search: `category_is:restaurants date_is:"xxxx-MM-xx"`,
    label: "Restaurants X mes",
  },
};

function addQuickSearches() {
  const quickSearchesElement = createQuickSearchesSelect();
  quickSearchesElement.addEventListener("change", handleSelectQuickSearch);
}

function createQuickSearchesSelect() {
  // get search button
  const submitButton = document.querySelector(
    "div.box-body > form div > button"
  );
  const searchInput = getSearchInput();

  // insert select just before submitButton
  const select = document.createElement("select");
  ["btn", "btn-info"].forEach((className) => select.classList.add(className));
  select.style.marginRight = "10px";

  const options = {
    none: {
      search: undefined,
      label: "Quick searches",
    },
    ...QUICK_SEARCHES,
  };
  Object.keys(options).forEach((optionKey) => {
    const optionData = options[optionKey];
    const optionElement = new Option(optionData.label, optionData.search);

    if (searchInput.value === optionData.search) {
      optionElement.selected = true;
    }

    select.options.add(optionElement);
  });

  submitButton.before(select);

  return select;
}

function handleSelectQuickSearch(onChangeEvent) {
  const search = onChangeEvent.target.value;
  if (search) {
    const searchInput = getSearchInput();
    searchInput.value = search;
  }
}

/*------------------*/
/*      Helpers     */
/*------------------*/

function getSearchInput() {
  return document.querySelector("#query");
}

/**
 * Function to await a DOM node to be loaded
 * @param {String} selector - The selector to wait for
 */
function awaitElement(selector) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(interval);
        resolve(element);
      }
    }, 100);
  });
}
