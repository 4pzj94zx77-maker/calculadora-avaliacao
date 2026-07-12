const test = require("node:test");
const assert = require("node:assert/strict");
const { parsePortugueseNumber, calculate } = require("./calculator.js");

test("interpreta valores no formato português", () => {
  assert.deepEqual(parsePortugueseNumber("250.000,50 €"), { value: 250000.5, valid: true });
  assert.equal(parsePortugueseNumber("1,234.56").valid, false);
  assert.equal(parsePortugueseNumber("texto").valid, false);
});

test("calcula sinal percentual e avaliação para LTV de 80%", () => {
  assert.deepEqual(calculate(250000, 10, "percent", 80), {
    signalAmount: 25000,
    loan: 225000,
    neededValuation: 281250,
  });
});

test("limita o sinal ao valor do imóvel", () => {
  assert.deepEqual(calculate(200000, 250000, "amount", 90), {
    signalAmount: 200000,
    loan: 0,
    neededValuation: 0,
  });
});

test("limita percentagens superiores a 100", () => {
  assert.equal(calculate(200000, 150, "percent", 80).loan, 0);
});
