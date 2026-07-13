(function (root, factory) {
  const calculator = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = calculator;
  } else {
    root.Calculator = calculator;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function parsePortugueseNumber(value) {
    const input = String(value ?? "").trim().replace(/\s/g, "");

    if (input === "") return { value: 0, valid: true };

    const cleaned = input.replace(/[€%]/g, "");
    const portugueseFormat = /^\d{1,3}(\.\d{3})*(,\d+)?$|^\d+(,\d+)?$/;

    if (!portugueseFormat.test(cleaned)) return { value: 0, valid: false };

    const amount = Number(cleaned.replace(/\./g, "").replace(",", "."));
    return { value: amount, valid: Number.isFinite(amount) && amount >= 0 };
  }

  function validateSignal(propertyValue, signalValue, signalMode) {
    if (!Number.isFinite(signalValue) || signalValue < 0) {
      return { valid: false, message: "O sinal não pode ser negativo." };
    }

    if (signalMode === "percent" && signalValue > 100) {
      return { valid: false, message: "O sinal não pode ser superior a 100%." };
    }

    if (signalMode === "amount" && signalValue > propertyValue) {
      return { valid: false, message: "O sinal não pode ser superior ao valor do imóvel." };
    }

    if (signalMode !== "percent" && signalMode !== "amount") {
      return { valid: false, message: "Seleciona um tipo de sinal válido." };
    }

    return { valid: true, message: "" };
  }

  function calculate(propertyValue, signalValue, signalMode, ltv, regime = "normal") {
    const ltvRate = ltv / 100;

    if (
      !Number.isFinite(propertyValue) ||
      propertyValue <= 0 ||
      !Number.isFinite(ltvRate) ||
      ltvRate <= 0 ||
      ltvRate > 1
    ) {
      throw new RangeError("Os valores do imóvel e do LTV têm de ser válidos.");
    }

    const signalValidation = validateSignal(propertyValue, signalValue, signalMode);
    if (!signalValidation.valid) {
      throw new RangeError(signalValidation.message);
    }

    if (regime !== "normal" && regime !== "youth") {
      throw new RangeError("Seleciona um regime de financiamento válido.");
    }

    if (regime === "youth" && ltv !== 100) {
      throw new RangeError("A garantia pública está configurada para financiamento a 100%.");
    }

    const signalAmount =
      signalMode === "percent"
        ? propertyValue * (signalValue / 100)
        : signalValue;

    if (regime === "youth") {
      return {
        signalAmount,
        loan: propertyValue,
        maxLoanFromPurchase: propertyValue,
        minimumSignal: 0,
        additionalEquityNeeded: 0,
        feasible: true,
        neededValuation: propertyValue,
        signalToRecover: signalAmount,
      };
    }

    const loan = propertyValue - signalAmount;
    const maxLoanFromPurchase = propertyValue * ltvRate;
    const additionalEquityNeeded = Math.max(loan - maxLoanFromPurchase, 0);
    const feasible = additionalEquityNeeded < 0.005;

    return {
      signalAmount,
      loan,
      maxLoanFromPurchase,
      minimumSignal: propertyValue - maxLoanFromPurchase,
      additionalEquityNeeded,
      feasible,
      neededValuation: feasible ? loan / ltvRate : null,
      signalToRecover: 0,
    };
  }

  return { parsePortugueseNumber, validateSignal, calculate };
});
