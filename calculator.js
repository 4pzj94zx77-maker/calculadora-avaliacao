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

  function calculate(propertyValue, signalValue, signalMode, ltv) {
    const signalAmount =
      signalMode === "percent"
        ? propertyValue * (Math.min(signalValue, 100) / 100)
        : Math.min(signalValue, propertyValue);
    const loan = Math.max(propertyValue - signalAmount, 0);
    const ltvRate = ltv / 100;

    return {
      signalAmount,
      loan,
      neededValuation: ltvRate > 0 ? loan / ltvRate : 0,
    };
  }

  return { parsePortugueseNumber, calculate };
});
