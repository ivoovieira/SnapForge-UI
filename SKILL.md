---
name: ui-layout-designer
description: >-
  SnapForge UI: Ferramenta universal de design e ajuste fino de interfaces web. Use esta skill para
  adicionar detecção de bordas milimétrica (Modo Designer / Outlines com Alt+D), redimensionamento
  interativo com mouse nos 4 lados de cards, divisores de colunas/linhas, container delimitador
  da página (caixa azul), efeito ímã magnético (magnetic snap), floating HUD toolbar, exportador
  de layout (CSS/Tailwind/JSON) e histórico completo com desfazer/refazer (Ctrl+Z / Ctrl+Y).
---

# SnapForge UI — Precision Layout Designer & Magnetic Snapping Engine

> **Repositório GitHub Oficial:** [https://github.com/ivoovieira/SnapForge-UI](https://github.com/ivoovieira/SnapForge-UI)

O **SnapForge UI** é uma biblioteca universal, modular e com **zero dependências externas** para adicionar um conjunto completo de ferramentas visuais de desenvolvimento, prototipação e ajuste milimétrico de UI a qualquer aplicação Web (HTML puro, React, Vue, Svelte, Flask, Django, etc.):

1. **Detecção de Bordas (Modo Designer / Outlines):**
   * Inspeção visual instantânea da hierarquia de caixas (viewports, páginas em azul, grades em laranja, cards em verde).
   * **Técnica não-destrutiva:** Utiliza `outline` com `outline-offset` negativo em vez de `border`, garantindo que **zero pixels** sejam somados às caixas e nenhum elemento quebre de linha.
   * Alternável via atalho global de teclado: <kbd>Alt</kbd> + <kbd>D</kbd> ou pelo Floating HUD.

2. **Linha Horizontal Contínua do Topo (Sidebar + Header):**
   * Sincronização milimétrica da linha divisória inferior da barra lateral (`.sidebar-header`) e do cabeçalho superior (`.top-header-clean`), compartilhando a mesma variável `--header-height: 64px;`.
   * Permite arrastar a linha divisória do topo em **qualquer ponto da tela** (de 0 a 100vw) com cursor `row-resize`.

3. **Redimensionamento do Container Delimitador da Página (Caixa Azul):**
   * Permite arrastar a **borda direita** e a **borda inferior** do container principal da página (`.app-page.active`) para definir visualmente os limites úteis da tela.
   * Suporte a restrição máxima (`--page-width`) e altura mínima (`min-height`).

4. **Redimensionador Universal nos 4 Lados de Cards & Painéis:**
   * Permite passar o mouse próximo a qualquer borda (**cima, baixo, esquerda ou direita**) de qualquer `.panel-card` para redimensionar dinamicamente com o mouse.
   * **Movimento real no Topo e Esquerda:** Manipula `marginTop` + `height` (cima) e `marginLeft` + `width` (esquerda) de forma suave sem quebrar o fluxo.

5. **Efeito Ímã Magnético (*Magnetic Snapping*):**
   * Atração magnética automática ao aproximar o cursor (~14px) das bordas da página (limite direito/inferior da caixa azul) ou de painéis vizinhos.
   * **Guias Ciano Fluorescentes (`#00d4ff`)**: Linhas guia horizontais e verticais surgem na tela indicando o momento exato do alinhamento milimétrico.

6. **Floating HUD Toolbar (Barra de Controle Flutuante):**
   * Barra flutuante elegante com efeito vidro (*glassmorphism*), minimizável, com botões para ativar/desativar bordas, redimensionamento, ímã magnético, desfazer/refazer, exportar e resetar.

7. **Exportador de Layout Integrado (CSS / Tailwind / JSON):**
   * Exporta instantaneamente as dimensões e margens personalizadas para:
     * Regras **CSS nativo** prontas para colar na folha de estilos.
     * Classes utilitárias do **Tailwind CSS**.
     * Estrutura **HTML limpa e atualizada** para salvar no arquivo do projeto.
     * Snapshot estruturado em **JSON** para salvar em backend ou localStorage.

8. **Arrastar e Soltar de uma Div para Outra (Drag & Drop Reparenting):**
   * Alça visual `⠿` nos cartões para mover elementos entre colunas e seções livremente com indicador luminoso de inserção e histórico `Ctrl+Z`.

9. **Histórico de Edição: Desfazer (<kbd>Ctrl</kbd> + <kbd>Z</kbd>) & Refazer (<kbd>Ctrl</kbd> + <kbd>Y</kbd>):**
   * Pilha de até 30 estados em memória com persistência opcional no `localStorage`.

---

## 📁 Estrutura de Arquivos

```text
skills/ui-layout-designer/
├── README.md                         # Documentação completa para GitHub
├── SKILL.md                          # Manual de uso e integração da Skill
├── LICENSE                           # Licença MIT
├── .gitignore                        # Arquivos ignorados pelo Git
├── examples/
│   └── index.html                    # Playground Interativo & Live Demo
└── resources/
    ├── ui-designer.css               # CSS universal (outlines, ímã, divisores e HUD)
    ├── ui-designer.js                # Motor JavaScript SnapForge UI
    └── settings-widget.html          # Widget estático opcional de configurações
```

---

## 🚀 Como Integrar em Qualquer Projeto

### Passo 1: Incluir o CSS Universal (`ui-designer.css`)
```html
<link rel="stylesheet" href="resources/ui-designer.css">
```

### Passo 2: Inicializar o Motor JavaScript SnapForge UI
```html
<script src="resources/ui-designer.js"></script>
<script>
  window.addEventListener('DOMContentLoaded', () => {
    SnapForge.init({
      cardSelector: '.panel-card',
      pageSelector: '.app-page.active',
      storagePrefix: 'meu_projeto_ui',
      showToolbar: true,
      enableMagneticSnap: true,
      snapThreshold: 14
    });
  });
</script>
```

---

## ⌨️ Atalhos de Teclado Globais

| Atalho | Ação |
| :--- | :--- |
| <kbd>Alt</kbd> + <kbd>D</kbd> | Alterna Modo Designer / Contornos Visuais Não-Destrutivos |
| <kbd>Alt</kbd> + <kbd>R</kbd> | Alterna Modo de Redimensionamento Interativo |
| <kbd>Ctrl</kbd> + <kbd>Z</kbd> | Desfaz a última ação de redimensionamento |
| <kbd>Ctrl</kbd> + <kbd>Y</kbd> / <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> | Refaz a ação desfeita |

---

## 💡 Dicas de Alinhamento e Ouro de UI

1. **Linha Contínua Entre Sidebar e Header:**
   Para garantir que a linha divisória do menu lateral e do cabeçalho superior fiquem no **mesmo pixel horizontal**, declare uma variável CSS única no `:root` e aplique em ambos:
   ```css
   :root { --header-height: 64px; }
   .sidebar-header { height: var(--header-height); box-sizing: border-box; border-bottom: 1px solid var(--border-color); }
   .top-header-clean { height: var(--header-height); box-sizing: border-box; border-bottom: 1px solid var(--border-color); }
   ```

2. **Encaixe Ímã nas Bordas da Caixa Azul:**
   Ao redimensionar cartões internos para a direita ou para baixo, o SnapForge inclui automaticamente `pageRect.right` e `pageRect.bottom` na lista de alvos magnéticos. O cartão "cola" com precisão milimétrica exatamente no limite útil da página.

3. **Prevenção de Estouro em Flexbox com Divisores:**
   Se um container com colunas possui divisor arrastável, defina `gap: 0;` no container pai e deixe a largura do divisor (ex: `10px`) atuar como o espaçamento real, calculando `calc(X% - 5px)` e `calc((100 - X)% - 5px)`.
