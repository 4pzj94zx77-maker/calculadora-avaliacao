# Calculadora LTV

Web app simples para calcular a avaliação bancária necessária na aquisição de um imóvel, com base no valor do imóvel e na percentagem de LTV.

## Utilização

Abra a aplicação no browser, introduza o valor do imóvel, indique o sinal entregue e escolha o LTV pretendido. O sinal pode ser inserido em percentagem ou em numerário. A app apresenta:

- avaliação bancária necessária;
- financiamento estimado;
- sinal considerado.

## Publicação

Esta app é estática e pode ser publicada diretamente com GitHub Pages.

O script `publish-to-github.sh` actualiza o repositório sem reescrever o histórico.

## Fórmula

O financiamento pretendido corresponde ao valor do imóvel menos o sinal. A avaliação
necessária é calculada dividindo esse financiamento pela percentagem de LTV.

## Testes

Com Node.js instalado, execute:

```sh
node --test calculator.test.js
```
