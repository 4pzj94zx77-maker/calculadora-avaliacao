const propertyValueInput = document.querySelector("#propertyValue");
const ltvInputs = Array.from(document.querySelectorAll("input[name='ltv']"));
const ltvField = document.querySelector(".ltv-field");
const ltvLegend = document.querySelector("#ltvLegend");
const regimeInputs = Array.from(document.querySelectorAll("input[name='regime']"));
const requiredValuation = document.querySelector("#requiredValuation");
const resultLabel = document.querySelector("#resultLabel");
const resultContext = document.querySelector("#resultContext");
const estimatedLoan = document.querySelector("#estimatedLoan");
const consideredSignal = document.querySelector("#consideredSignal");
const signalSummaryLabel = document.querySelector("#signalSummaryLabel");
const signalValueInput = document.querySelector("#signalValue");
const signalModeInputs = Array.from(document.querySelectorAll("input[name='signalMode']"));
const signalSuffix = document.querySelector("#signalSuffix");
const resetButton = document.querySelector("#resetButton");
const calculatorForm = document.querySelector("#calculatorForm");
const propertyValueError = document.querySelector("#propertyValueError");
const signalValueError = document.querySelector("#signalValueError");
const regimeNote = document.querySelector("#regimeNote");

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

function getRegime() {
  const selected = regimeInputs.find((input) => input.checked);
  return selected ? selected.value : "normal";
}

function setValidation(input, errorElement, result, message) {
  input.setAttribute("aria-invalid", String(!result.valid));
  errorElement.textContent = result.valid ? "" : message;
}

function updateCalculator() {
  const propertyResult = Calculator.parsePortugueseNumber(propertyValueInput.value);
  const signalResult = Calculator.parsePortugueseNumber(signalValueInput.value);
  const propertyValidation = {
    valid: propertyResult.valid && (propertyValueInput.value.trim() === "" || propertyResult.value > 0),
  };
  const signalValidation = signalResult.valid
    ? Calculator.validateSignal(propertyResult.value, signalResult.value, getSignalMode())
    : signalResult;
  setValidation(
    propertyValueInput,
    propertyValueError,
    propertyValidation,
    "Introduz um valor superior a zero, por exemplo 250.000.",
  );
  setValidation(
    signalValueInput,
    signalValueError,
    signalValidation,
    signalValidation.message || "Introduz um valor válido, por exemplo 10 ou 25.000.",
  );

  const hasProperty = propertyValueInput.value.trim() !== "";
  if (!hasProperty) {
    resultLabel.textContent = "Avaliação necessária";
    requiredValuation.textContent = "0 €";
    resultContext.textContent = "Introduza o valor do imóvel.";
    estimatedLoan.textContent = "0 €";
    consideredSignal.textContent = "0 €";
    signalSummaryLabel.textContent = getRegime() === "youth" ? "Sinal a recuperar" : "Sinal considerado";
    requiredValuation.closest(".result-panel").classList.remove("is-warning");
    resultContext.classList.remove("is-hidden");
    return;
  }

  if (!propertyValidation.valid || !signalValidation.valid) {
    resultLabel.textContent = "Resultado indisponível";
    requiredValuation.textContent = "—";
    resultContext.textContent = "Corrige os campos assinalados para calcular o cenário.";
    estimatedLoan.textContent = "—";
    consideredSignal.textContent = "—";
    signalSummaryLabel.textContent = getRegime() === "youth" ? "Sinal a recuperar" : "Sinal considerado";
    requiredValuation.closest(".result-panel").classList.add("is-warning");
    resultContext.classList.remove("is-hidden");
    return;
  }

  const propertyValue = propertyResult.value;
  const signalValue = signalResult.value;
  const ltv = getSelectedLtv();
  const result = Calculator.calculate(
    propertyValue,
    signalValue,
    getSignalMode(),
    ltv,
    getRegime(),
  );

  const resultPanel = requiredValuation.closest(".result-panel");
  estimatedLoan.textContent = formatMoney(result.loan);
  signalSummaryLabel.textContent =
    getRegime() === "youth" ? "Sinal a recuperar" : "Sinal considerado";
  consideredSignal.textContent = formatMoney(
    getRegime() === "youth" ? result.signalToRecover : result.signalAmount,
  );

  if (!result.feasible) {
    resultPanel.classList.add("is-warning");
    resultLabel.textContent = "Capital próprio adicional necessário";
    requiredValuation.textContent = formatMoney(result.additionalEquityNeeded);
    resultContext.textContent = `Uma avaliação superior ao preço não resolve este cenário. Com LTV de ${ltv}%, o sinal mínimo é ${formatMoney(result.minimumSignal)}.`;
    resultContext.classList.remove("is-hidden");
    return;
  }

  resultPanel.classList.remove("is-warning");
  resultLabel.textContent = "Avaliação necessária";
  requiredValuation.textContent = formatMoney(result.neededValuation);
  resultContext.textContent =
    getRegime() === "youth"
      ? `Financiamento a 100% do valor de transação. O sinal de ${formatMoney(result.signalToRecover)} é considerado a recuperar no acerto da escritura.`
      : "O banco considera o menor valor entre o preço de compra e a avaliação.";
  resultContext.classList.toggle("is-hidden", getRegime() === "youth");
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
  regimeInputs.forEach((input) => {
    input.checked = input.value === "normal";
  });
  updateRegime();
  signalSuffix.textContent = "%";
  updateCalculator();
}

function updateRegime() {
  const youthRegime = getRegime() === "youth";

  ltvInputs.forEach((input) => {
    const available = input.dataset.regime === (youthRegime ? "youth" : "normal");
    input.disabled = !available;
    input.closest("label").classList.toggle("is-hidden", !available);
    if (!available) input.checked = false;
  });
  ltvField.classList.toggle("is-hidden", youthRegime);
  ltvField.setAttribute("aria-hidden", String(youthRegime));

  const preferredLtv = youthRegime ? "100" : "80";
  const preferredInput = ltvInputs.find((input) => input.value === preferredLtv);
  if (preferredInput) preferredInput.checked = true;
  ltvLegend.textContent = "LTV";

  regimeNote.textContent = youthRegime
    ? "Financiamento: 100% · Sinal recuperado na escritura."
    : "Financiamento: até 90% · Incide sobre o menor valor.";
}

propertyValueInput.value = "";
propertyValueInput.addEventListener("input", updateCalculator);
propertyValueInput.addEventListener("blur", formatInputValue);
signalValueInput.value = "";
signalValueInput.addEventListener("input", updateCalculator);
resetButton.addEventListener("click", resetCalculator);
calculatorForm.addEventListener("submit", (event) => event.preventDefault());
ltvInputs.forEach((input) => input.addEventListener("change", updateCalculator));
regimeInputs.forEach((input) =>
  input.addEventListener("change", () => {
    updateRegime();
    updateCalculator();
  }),
);
signalModeInputs.forEach((input) =>
  input.addEventListener("change", () => {
    signalValueInput.value = "";
    signalSuffix.textContent = getSignalMode() === "percent" ? "%" : "€";
    updateCalculator();
  }),
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js?v=20260714-2").catch((error) => {
      console.error("Não foi possível activar o funcionamento offline.", error);
    });
  });
}

updateRegime();
updateCalculator();
