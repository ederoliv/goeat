# Regras e Padrões de Projeto (Goeat)

Este documento contém as diretrizes e regras de padrões visuais e de design para serem utilizadas nas implementações de interface do projeto, garantindo consistência por toda a plataforma.

## Paleta de Cores

- **Cores de Fundo (Backgrounds)**: Sempre priorize o uso de `branco` (#FFFFFF) ou cores extremamente claras (como `#F7F7F8` ou `#F9FAFB`). O layout deve ser limpo.
- **Cor de Textos Principal**: Use `#4F4F4F` para a cor padrão de texto. Evite o preto totalmente escuro para criar um visual mais suave.
- **Cores da Plataforma (Cores Primárias e de Destaque)**:
  - **Verde Limão**: `#A1EE30` (Use para detalhes, destaques, botões específicos, ou acentos de elementos interativos que exijam mais visibilidade)
  - **Verde Escuro**: `#19766D` (Cor principal da marca, deve estar presente em Navbars, botões primários, ícones em destaque e elementos sólidos)

## Tipografia e Elementos

- Utilize o design de cantos arredondados (border-radius) para botões, cards e inputs para seguir a consistência de "App/Marketplace".
- Utilize elementos e ícones limpos, valendo-se preferencialmente da biblioteca `lucide-react`.

## Considerações para a IA Assistente

- Sempre que for criar novos componentes visuais, alinhe as cores aos hexadecimais acima. Se for usar classes do Tailwind, utilize classes arbitrárias ou estenda o Tailwind contextualmente (ex: `text-[#4F4F4F]`, `bg-[#19766D]`).
- Foque em responsividade mantendo classes como `max-w-7xl mx-auto`.
