const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function createElement() {
  return {
    value: "",
    textContent: "",
    hidden: false,
    disabled: false,
    files: [],
    attributes: {},
    children: [],
    dataset: {},
    classList: {
      values: new Set(),
      toggle(name, force) {
        if (force) this.values.add(name);
        else this.values.delete(name);
      },
    },
    addEventListener() {},
    append(...children) {
      this.children.push(...children);
    },
    replaceChildren(...children) {
      this.children = children;
    },
    querySelectorAll() {
      return this.children
        .flatMap((child) => child.children || [])
        .filter((child) => child.type === "checkbox" && child.checked);
    },
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
    focus() {
      this.focused = true;
    },
  };
}

function loadApplication() {
  const elements = new Map();
  const document = {
    querySelector(selector) {
      if (!elements.has(selector)) elements.set(selector, createElement());
      return elements.get(selector);
    },
    createElement() {
      return createElement();
    },
    createTextNode(text) {
      return { textContent: text };
    },
  };
  const context = {
    console,
    document,
    Intl,
    Number,
    RegExp,
    TextDecoder,
    setTimeout,
    window: {
      location: { protocol: "http:" },
      setTimeout,
      print() {},
    },
  };
  vm.createContext(context);
  const source = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  vm.runInContext(source, context);
  return { context, element: (selector) => elements.get(selector) };
}

function fillRequiredFields(app) {
  app.element("#clientName").value = "Ana Silva";
  app.element("#street").value = "Rua das Flores, 10";
  app.element("#locality").value = "Lisboa";
  app.element("#propertyType").value = "house";
  app.element("#privateArea").value = "100";
  app.element("#pricePerSqmLow").value = "1000";
  app.element("#pricePerSqmHigh").value = "1000";
}

test("uma moradia conserva e inclui o terreno no cálculo", () => {
  const app = loadApplication();
  fillRequiredFields(app);
  app.element("#landType").value = "urban";
  app.element("#landArea").value = "100";
  app.element("#landReference").value = "rural_low";

  app.context.render();
  const valuation = app.context.getValuation();

  assert.equal(app.element("#landType").disabled, false);
  assert.equal(app.element("#landType").value, "urban");
  assert.equal(valuation.landLowValue, 1500);
  assert.equal(valuation.landHighValue, 4000);
});

test("um apartamento ignora o terreno sem apagar os dados", () => {
  const app = loadApplication();
  fillRequiredFields(app);
  app.element("#propertyType").value = "apartment";
  app.element("#landType").value = "urban";
  app.element("#landArea").value = "100";
  app.element("#landReference").value = "rural_low";

  app.context.render();
  const valuation = app.context.getValuation();

  assert.equal(app.element("#landType").disabled, true);
  assert.equal(app.element("#landType").value, "urban");
  assert.equal(valuation.landLowValue, 0);
  assert.equal(valuation.landHighValue, 0);
});

test("a exportação só é válida com os campos essenciais", () => {
  const app = loadApplication();
  assert.equal(app.context.validateValuation(), false);
  assert.equal(app.element("#validationSummary").hidden, false);

  fillRequiredFields(app);
  assert.equal(app.context.validateValuation(), true);
  assert.equal(app.element("#validationSummary").hidden, true);
});

test("rejeita um PDF com mais de 10 MB antes de o carregar", async () => {
  const app = loadApplication();
  const file = { size: 10 * 1024 * 1024 + 1 };
  await assert.rejects(app.context.readPdfText(file), /PDF_TOO_LARGE/);
});

test("reconstrói linhas pelas coordenadas e não pela ordem interna do PDF", () => {
  const app = loadApplication();
  const lines = app.context.reconstructPdfLines([
    { str: "125,40 m²", transform: [1, 0, 0, 1, 180, 700], width: 55 },
    { str: "Área bruta privativa:", transform: [1, 0, 0, 1, 20, 700], width: 130 },
    { str: "Lisboa", transform: [1, 0, 0, 1, 180, 680], width: 40 },
    { str: "Concelho:", transform: [1, 0, 0, 1, 20, 680], width: 65 },
  ]);

  assert.deepEqual(Array.from(lines), ["Área bruta privativa: 125,40 m²", "Concelho: Lisboa"]);
});

test("extrai áreas e localidade do texto reconstruído", () => {
  const app = loadApplication();
  const data = app.context.parseCadernetaText([
    "Concelho: Lisboa",
    "Área bruta privativa: 125,40 m²",
    "Área bruta dependente: 18,20 m²",
    "Fração autónoma destinada a habitação",
  ].join("\n"));

  assert.equal(data.locality, "Lisboa");
  assert.equal(data.privateArea, 125.4);
  assert.equal(data.dependentArea, 18.2);
  assert.equal(data.propertyType, "apartment");
});

test("extrai os campos do formato OCR da caderneta fornecida", () => {
  const app = loadApplication();
  const data = app.context.parseCadernetaText([
    "DISTRITO: 14 - SANTAREM CONCELHO: 16 - SANTAREM FREGUESIA: 33 - UNIÃO DE FREGUESIAS",
    "LOCALIZAÇÃO DA FRACÇÃO",
    "Av./Rua/Praça: Praceta João Caetano Brás, nº 1, 2, 3, 4, 5, 6 Nº: 3 Lugar: Santarém Código Postal: 2005-161",
    "FRACÇÃO AUTÓNOMA: AG",
    "Área bruta privativa: 184,3600 m² Área bruta dependente: 3,1000 m²",
    "TITULARES",
    "Identificação fiscal: 000000000 Nome: ANA SILVA",
  ].join("\n"));

  assert.equal(data.locality, "Santarem");
  assert.match(data.street, /Praceta João Caetano Brás/i);
  assert.equal(data.privateArea, 184.36);
  assert.equal(data.dependentArea, 3.1);
  assert.equal(data.propertyType, "apartment");
  assert.equal(data.clientName, "Ana Silva");
});
