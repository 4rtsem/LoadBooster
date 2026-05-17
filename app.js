const stripeLinks = {
  usa: "https://buy.stripe.com/REPLACE_WITH_USA_PAYMENT_LINK",
  eu: "https://buy.stripe.com/REPLACE_WITH_EU_PAYMENT_LINK"
};

const shippingCountries = [
  { code: "US", name: "United States", region: "usa" },
  { code: "AT", name: "Austria", region: "eu" },
  { code: "BE", name: "Belgium", region: "eu" },
  { code: "BG", name: "Bulgaria", region: "eu" },
  { code: "HR", name: "Croatia", region: "eu" },
  { code: "CY", name: "Cyprus", region: "eu" },
  { code: "CZ", name: "Czech Republic", region: "eu" },
  { code: "DK", name: "Denmark", region: "eu" },
  { code: "EE", name: "Estonia", region: "eu" },
  { code: "FI", name: "Finland", region: "eu" },
  { code: "FR", name: "France", region: "eu" },
  { code: "DE", name: "Germany", region: "eu" },
  { code: "GR", name: "Greece", region: "eu" },
  { code: "HU", name: "Hungary", region: "eu" },
  { code: "IE", name: "Ireland", region: "eu" },
  { code: "IT", name: "Italy", region: "eu" },
  { code: "LV", name: "Latvia", region: "eu" },
  { code: "LT", name: "Lithuania", region: "eu" },
  { code: "LU", name: "Luxembourg", region: "eu" },
  { code: "MT", name: "Malta", region: "eu" },
  { code: "NL", name: "Netherlands", region: "eu" },
  { code: "PL", name: "Poland", region: "eu" },
  { code: "PT", name: "Portugal", region: "eu" },
  { code: "RO", name: "Romania", region: "eu" },
  { code: "SK", name: "Slovakia", region: "eu" },
  { code: "SI", name: "Slovenia", region: "eu" },
  { code: "ES", name: "Spain", region: "eu" },
  { code: "SE", name: "Sweden", region: "eu" }
];

const countrySelect = document.querySelector("#shipping-country");
const checkoutButton = document.querySelector("#checkout-button");
const checkoutRegion = document.querySelector("#checkout-region");

function isConfiguredStripeLink(link) {
  return link.startsWith("https://buy.stripe.com/") && !link.includes("REPLACE_WITH_");
}

function buildCountryOptions() {
  const groups = {
    usa: document.createElement("optgroup"),
    eu: document.createElement("optgroup")
  };

  groups.usa.label = "USA";
  groups.eu.label = "European Union";

  shippingCountries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.code;
    option.textContent = country.name;
    groups[country.region].append(option);
  });

  countrySelect.append(groups.usa, groups.eu);
}

function setButtonDisabled(message) {
  checkoutButton.href = "#";
  checkoutButton.classList.add("disabled");
  checkoutButton.setAttribute("aria-disabled", "true");
  checkoutButton.textContent = "Continue to Stripe";
  checkoutRegion.textContent = message;
}

function setCheckoutState(countryCode) {
  const country = shippingCountries.find((item) => item.code === countryCode);

  if (!country) {
    setButtonDisabled("Select a country to route to the right Stripe checkout.");
    return;
  }

  const regionLabel = country.region === "usa" ? "USA" : "EU";
  const stripeLink = stripeLinks[country.region];

  if (!isConfiguredStripeLink(stripeLink)) {
    setButtonDisabled(`Add the ${regionLabel} Stripe payment link in app.js to enable checkout.`);
    return;
  }

  checkoutButton.href = stripeLink;
  checkoutButton.classList.remove("disabled");
  checkoutButton.setAttribute("aria-disabled", "false");
  checkoutButton.textContent = `Continue to ${regionLabel} Stripe Checkout`;
  checkoutRegion.textContent = `${country.name} ships through the ${regionLabel} checkout.`;
}

countrySelect.addEventListener("change", (event) => {
  setCheckoutState(event.target.value);
});

checkoutButton.addEventListener("click", (event) => {
  if (checkoutButton.classList.contains("disabled")) {
    event.preventDefault();
  }
});

buildCountryOptions();
