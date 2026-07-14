# Design QA

source visual truth path: `/Users/nunoferreira/.codex/generated_images/019f5d6e-fe96-7770-a4f8-04bc33d2e9a9/exec-69f9daf7-ada5-4b30-9067-fd5cfaf2df97.png`

implementation screenshot path: `/Users/nunoferreira/.codex/visualizations/2026/07/13/019f5d6e-fe96-7770-a4f8-04bc33d2e9a9/calculadora-preview-v1/implementacao-final.png`

comparison path: `/Users/nunoferreira/.codex/visualizations/2026/07/13/019f5d6e-fe96-7770-a4f8-04bc33d2e9a9/calculadora-preview-v1/comparacao-final.png`

viewport: `390 x 844`

state: Garantia pública selecionada, imóvel de 250 000 €, sinal de 10%, financiamento de 250 000 € e sinal a recuperar de 25 000 €.

## Full view comparison evidence

A comparação lado a lado confirma a mesma hierarquia, ordem de conteúdo, seleção de regime, campos, controlo de unidade e cartão consolidado de resultados. A implementação preserva a identidade RE/MAX com o ativo de logótipo real e mantém o conteúdo essencial dentro da vista móvel.

Não foi necessário um recorte focado adicional porque tipografia, campos, controlos, logótipo e valores permanecem legíveis na comparação integral a 390 px.

## Required fidelity surfaces

Fonts and typography: escala, pesos, alinhamento e hierarquia correspondem à direção escolhida. A implementação usa a pilha tipográfica de sistema disponível no projeto.

Spacing and layout rhythm: cabeçalho compacto, regimes lado a lado, separador discreto, seletor de unidade integrado e resultados consolidados seguem a composição escolhida. Sem deslocamento horizontal a 390 px ou 320 px.

Colors and visual tokens: azul dominante, vermelho reservado ao divisor, unidade selecionada e sufixos. Contraste visual adequado nos estados verificados.

Image quality and asset fidelity: o logótipo RE/MAX existente é usado diretamente, sem substitutos desenhados em CSS ou SVG artesanal.

Copy and content: textos em português europeu, garantia pública a 100%, financiamento de 100% e sinal a recuperar na escritura.

## Comparison history

### Pass 1

P2: logótipo maior do que a referência, ausência do separador após o regime, texto contextual redundante no resultado da garantia pública e rótulos diferentes da direção escolhida.

Fixes: logótipo reduzido, separador acrescentado, contexto redundante ocultado no cenário a 100% e rótulos alinhados para “Avaliação necessária” e “Financiamento”.

### Pass 2

Post fix evidence: `comparacao-final.png`.

Não restam diferenças P0, P1 ou P2. A distância vertical exata e pequenas diferenças de renderização tipográfica são P3 aceitáveis por resultarem do uso do logótipo e da tipografia reais da aplicação.

## Functional verification

Testes automáticos: 9 de 9 aprovados.

Interações verificadas: mudança entre regimes, garantia pública exclusivamente a 100%, sinal em percentagem, cálculo do sinal a recuperar, LTV de 90% no regime normal e ação Limpar.

Responsive: sem overflow horizontal a 390 px e 320 px.

Browser console errors: nenhum.

final result: passed
