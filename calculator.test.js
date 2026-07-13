const test = require("node:test");
const assert = require("node:assert/strict");
const { parsePortugueseNumber, validateSignal, calculate } = require("./calculator.js");

test("interpreta valores no formato português", () => {
  assert.deepEqual(parsePortugueseNumber("250.000,50 €"), { value: 250000.5, valid: true });
  assert.equal(parsePortugueseNumber("1,234.56").valid, false);
  assert.equal(parsePortugueseNumber("texto").valid, false);
});

test("rejeita sinais percentuais superiores a 100%", () => {
  assert.equal(validateSignal(250000, 150, "percent").valid, false);
  assert.throws(() => calculate(250000, 150, "percent", 80), RangeError);
});

test("rejeita sinais em numerário superiores ao preço", () => {
  assert.equal(validateSignal(200000, 250000, "amount").valid, false);
  assert.throws(() => calculate(200000, 250000, "amount", 90), RangeError);
});

test("deteta quando uma avaliação superior não resolve a insuficiência do sinal", () => {
  assert.deepEqual(calculate(250000, 10, "percent", 80), {
    signalAmount: 25000,
    loan: 225000,
    maxLoanFromPurchase: 200000,
    minimumSignal: 50000,
    additionalEquityNeeded: 25000,
    feasible: false,
    neededValuation: null,
    signalToRecover: 0,
  });
});

test("calcula a avaliação mínima quando o sinal cumpre o LTV", () => {
  assert.deepEqual(calculate(250000, 25, "percent", 80), {
    signalAmount: 62500,
    loan: 187500,
    maxLoanFromPurchase: 200000,
    minimumSignal: 50000,
    additionalEquityNeeded: 0,
    feasible: true,
    neededValuation: 234375,
    signalToRecover: 0,
  });
});

test("aceita o limite exato de 90% sobre o preço", () => {
  const result = calculate(250000, 10, "percent", 90);
  assert.equal(result.feasible, true);
  assert.equal(result.loan, 225000);
  assert.equal(result.neededValuation, 250000);
});

test("calcula financiamento a 100% no regime da garantia pública", () => {
  const result = calculate(250000, 10, "percent", 100, "youth");
  assert.equal(result.feasible, true);
  assert.equal(result.loan, 250000);
  assert.equal(result.minimumSignal, 0);
  assert.equal(result.neededValuation, 250000);
  assert.equal(result.signalAmount, 25000);
  assert.equal(result.signalToRecover, 25000);
});

test("rejeita percentagens inferiores a 100% no modo de garantia pública", () => {
  assert.throws(() => calculate(250000, 10, "percent", 90, "youth"), RangeError);
});

test("rejeita valores de imóvel e LTV fora dos limites", () => {
  assert.throws(() => calculate(0, 0, "percent", 80), RangeError);
  assert.throws(() => calculate(250000, 0, "percent", 0), RangeError);
  assert.throws(() => calculate(250000, 0, "percent", 101), RangeError);
});
