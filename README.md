# Calculadora LTV

Web app simples para analisar a avaliação bancária necessária na aquisição de um imóvel, com base no valor do imóvel, no sinal, no LTV e no regime de financiamento.

## Utilização

Abra a aplicação no browser, escolha o regime, introduza o valor do imóvel, indique o sinal entregue e escolha o LTV pretendido. O sinal pode ser inserido em percentagem ou em numerário. A app apresenta:

- avaliação bancária mínima, quando o cenário é compatível com o LTV;
- capital próprio adicional necessário, quando uma avaliação superior não resolve o cenário;
- financiamento estimado;
- sinal considerado.

O regime normal disponibiliza LTV de 80%, 85% e 90%. Para o fluxo operacional desta aplicação, a garantia pública para jovens está configurada exclusivamente com financiamento a 100%. O sinal já entregue não reduz o financiamento e é apresentado como montante a recuperar na escritura.

## Publicação

Esta app é estática e pode ser publicada diretamente com GitHub Pages.

O script `publish-to-github.sh` actualiza o repositório sem reescrever o histórico.

## Fórmula

O financiamento pretendido corresponde ao valor do imóvel menos o sinal. O LTV incide sobre o menor valor entre o preço de aquisição e a avaliação bancária.

Se o financiamento pretendido ultrapassar o preço de aquisição multiplicado pelo LTV, nenhuma avaliação superior ao preço resolve a insuficiência de capitais próprios. Nesse caso, a app apresenta o montante adicional necessário e o sinal mínimo. Caso contrário, a avaliação mínima é calculada dividindo o financiamento pelo LTV.

## Testes

Com Node.js instalado, execute:

```sh
node --test calculator.test.js
```
