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

const formatter = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function parseMoney(value) {
  const normalized = value
    .replace(/\s/g, "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");

  const amount = Number.parseFloat(normalized);
  return Number.isFinite(amount) ? Math.max(amount, 0) : 0;
}

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

function getSignalAmount(propertyValue) {
  const rawSignal = parseMoney(signalValueInput.value);
  const signalMode = getSignalMode();

  if (signalMode === "percent") {
    const percentage = Math.min(rawSignal, 100);
    return propertyValue * (percentage / 100);
  }

  return Math.min(rawSignal, propertyValue);
}

function updateCalculator() {
  const propertyValue = parseMoney(propertyValueInput.value);
  const signalAmount = getSignalAmount(propertyValue);
  const ltv = getSelectedLtv();
  const ltvRate = ltv / 100;
  const loan = Math.max(propertyValue - signalAmount, 0);
  const neededValuation = ltvRate === 0 ? 0 : loan / ltvRate;

  requiredValuation.textContent = formatMoney(neededValuation);
  resultContext.textContent =
    propertyValue > 0
      ? `Para financiar ${formatMoney(loan)} com LTV de ${ltv}%.`
      : "Introduza o valor do imóvel.";
  estimatedLoan.textContent = formatMoney(loan);
  consideredSignal.textContent = formatMoney(signalAmount);
}

function formatInputValue() {
  const propertyValue = parseMoney(propertyValueInput.value);

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
ltvInputs.forEach((input) => input.addEventListener("change", updateCalculator));
signalModeInputs.forEach((input) =>
  input.addEventListener("change", () => {
    signalSuffix.textContent = getSignalMode() === "percent" ? "%" : "€";
    updateCalculator();
  }),
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

updateCalculator();
