# Design QA

Source visual truth path: `/Users/nunoferreira/.codex/generated_images/019f560a-d239-74d2-8ecb-bb63d80df276/exec-3ead7df9-f34d-490a-9344-4c63ed5d0786.png`

Implementation screenshot path: `/Users/nunoferreira/Library/Mobile Documents/com~apple~CloudDocs/Nuno/Remax/programacao/calculadora_avaliacao/implementation-mobile-crop.png`

iPhone 16 Pro Max screenshot path: `/Users/nunoferreira/Library/Mobile Documents/com~apple~CloudDocs/Nuno/Remax/programacao/calculadora_avaliacao/iphone-16-pro-max.png`

White-background screenshot path: `/Users/nunoferreira/Library/Mobile Documents/com~apple~CloudDocs/Nuno/Remax/programacao/calculadora_avaliacao/iphone-16-pro-max-white-background.png`

Full comparison path: `/Users/nunoferreira/Library/Mobile Documents/com~apple~CloudDocs/Nuno/Remax/programacao/calculadora_avaliacao/qa-comparison.png`

Viewport: mobile app surface at 390 x 844, with a full-page capture for the complete calculator.

Additional responsive viewport: iPhone 16 Pro Max at 430 x 932 CSS pixels.

State: property value 250 000 EUR, signal 10%, LTV 80%, calculated valuation 281 250 EUR.

## Full-view comparison evidence

The implementation preserves the selected concept's compact single-column structure, brand hierarchy, segmented controls, prominent navy result block, red accent, two-column summary, and restrained legal note. The official blue logo remains on white because the supplied alternative asset contains a white canvas and is not usable on a navy surface without damaging the brand artwork.

## Focused region comparison evidence

The controls, result block, and summary are readable at full-view scale, so separate detail crops were not required. Field spacing, selected states, result typography, brand colours, border radii, and divider treatment were inspected in the combined comparison.

## Required fidelity surfaces

Fonts and typography: system sans-serif remains close to the source, with comparable weights, hierarchy, line height and wrapping. No clipping or truncation found.

Spacing and layout rhythm: compact vertical spacing and two-column summary match the intended density. The implementation uses a slightly wider content margin to preserve touch targets and validation messages.

Colours and visual tokens: navy, red, white and pale blue-grey match the RE/MAX direction. Solid brand colours replace the source image's unintended gradients.

Image quality and asset fidelity: the official high-resolution RE/MAX Grupo Vantagem logo is used without recolouring, distortion or replacement artwork.

Copy and content: all calculator labels, values, summary content and legal text are preserved. The result explanation was aligned with the selected concept.

## Findings

No actionable P0, P1 or P2 mismatches remain.

P3: The white logo header differs from the navy source header. This is an intentional brand-safety decision because no verified transparent white logo is currently available.

## Comparison history

Initial P2: the supplied white-logo candidate rendered as a white rectangle and hid the navy header. Fix: rejected that asset and restored the official logo on a white header. Post-fix evidence: the logo is sharp and fully readable in `qa-comparison.png`, with the red brand divider retained.

Responsive P2: at desktop-sized capture widths, the header used a 22px panel padding with a 30px negative margin and inherited top padding, causing white protrusions around the rounded header. Fix: removed top padding at that breakpoint, matched the header margin to 22px, and clipped the panel contents to its rounded boundary. Post-fix evidence: `iphone-16-pro-max.png` shows a continuous rounded header with no side protrusions.

Requested visual adjustment: the exterior page background was changed from a navy and pale-grey treatment to solid white. Post-change evidence: `iphone-16-pro-max-white-background.png` shows a uniform white page while retaining RE/MAX blue and red inside the calculator.

## Interaction checks

Property and signal inputs accepted values correctly. Percentage and euro signal modes switched correctly and cleared the previous value. LTV selection and the resulting valuation, loan and signal values remained correct. Browser console showed no errors or warnings.

## Follow-up polish

If an official transparent white RE/MAX Grupo Vantagem logo becomes available, the header can be changed to navy for exact source fidelity.

final result: passed
