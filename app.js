const propertyValueInput = document.querySelector("#propertyValue");
const ltvInputs = Array.from(document.querySelectorAll("input[name='ltv']"));
const requiredValuation = document.querySelector("#requiredValuation");
const resultContext = document.querySelector("#resultContext");
const estimatedLoan = document.querySelector("#estimatedLoan");
const consideredSignal = document.querySelector("#consideredSignal");
const signalValueInput = document.querySelector("#signalValue");
const signalModeInputs = Array.from(document.querySelectorAll("input[name='signalMode']"));
const signalSuffix = document.querySelector("#signalSuffix");
const resetButton = document.querySelector("#resetButton");
const calculatorForm = document.querySelector("#calculatorForm");
const propertyValueError = document.querySelector("#propertyValueError");
const signalValueError = document.querySelector("#signalValueError");

const formatter = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function formatMoney(value) {
  return formatter.format(Math.round(value)).replace(/\u00a0/g, " ");
}

function getSelectedLtv() {
  const selected = ltvInputs.find((input) => input.checked);
  return selected ? Number(selected.value) : 80;
}

function getSignalMode() {
  const selected = signalModeInputs.find((input) => input.checked);
  return selected ? selected.value : "percent";
}

function setValidation(input, errorElement, result, message) {
  input.setAttribute("aria-invalid", String(!result.valid));
  errorElement.textContent = result.valid ? "" : message;
}

function updateCalculator() {
  const propertyResult = Calculator.parsePortugueseNumber(propertyValueInput.value);
  const signalResult = Calculator.parsePortugueseNumber(signalValueInput.value);
  setValidation(propertyValueInput, propertyValueError, propertyResult, "Introduz um valor válido, por exemplo 250.000.");
  setValidation(signalValueInput, signalValueError, signalResult, "Introduz um valor válido, por exemplo 10 ou 25.000.");

  const propertyValue = propertyResult.valid ? propertyResult.value : 0;
  const signalValue = signalResult.valid ? signalResult.value : 0;
  const ltv = getSelectedLtv();
  const { signalAmount, loan, neededValuation } = Calculator.calculate(
    propertyValue,
    signalValue,
    getSignalMode(),
    ltv,
  );

  requiredValuation.textContent = formatMoney(neededValuation);
  resultContext.textContent =
    propertyValue > 0
      ? "Valor da avaliação bancária necessária."
      : "Introduza o valor do imóvel.";
  estimatedLoan.textContent = formatMoney(loan);
  consideredSignal.textContent = formatMoney(signalAmount);
}

function formatInputValue() {
  const result = Calculator.parsePortugueseNumber(propertyValueInput.value);
  const propertyValue = result.valid ? result.value : 0;

  if (propertyValue > 0) {
    propertyValueInput.value = new Intl.NumberFormat("pt-PT", {
      maximumFractionDigits: 0,
    }).format(Math.round(propertyValue));
  }
}

function resetCalculator() {
  propertyValueInput.value = "";
  signalValueInput.value = "";
  ltvInputs.forEach((input) => {
    input.checked = input.value === "80";
  });
  signalModeInputs.forEach((input) => {
    input.checked = input.value === "percent";
  });
  signalSuffix.textContent = "%";
  updateCalculator();
}

propertyValueInput.value = "";
propertyValueInput.addEventListener("input", updateCalculator);
propertyValueInput.addEventListener("blur", formatInputValue);
signalValueInput.value = "";
signalValueInput.addEventListener("input", updateCalculator);
resetButton.addEventListener("click", resetCalculator);
calculatorForm.addEventListener("submit", (event) => event.preventDefault());
ltvInputs.forEach((input) => input.addEventListener("change", updateCalculator));
signalModeInputs.forEach((input) =>
  input.addEventListener("change", () => {
    signalValueInput.value = "";
    signalSuffix.textContent = getSignalMode() === "percent" ? "%" : "€";
    updateCalculator();
  }),
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch((error) => {
      console.error("Não foi possível activar o funcionamento offline.", error);
    });
  });
}

updateCalculator();
