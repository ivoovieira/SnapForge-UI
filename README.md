<div align="center">

# ⚡ SnapForge UI

**The Lightweight In-Browser Div & Layout Builder with Clean Code Export.**

*Zero-dependency visual UI precision designer, 4-way interactive edge resizing, drag-and-drop reparenting between divs, magnetic snapping guides, floating HUD toolbar, and instant CSS/Tailwind/HTML exporter for modern web applications.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](#)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-yellow.svg)](#)
[![Pure CSS](https://img.shields.io/badge/Pure-CSS3-blueviolet.svg)](#)
[![Style: Voitechrj](https://img.shields.io/badge/Style-Voitechrj-345a87.svg)](https://voitech-rj.github.io/)
[![GitHub stars](https://img.shields.io/github/stars/ivoovieira/SnapForge-UI?style=social)](https://github.com/ivoovieira/SnapForge-UI)

[Demonstração / Playground](#-live-playground--demo) • [SnapForge vs Builders](#-snapforge-vs-grandes-builders) • [Recursos](#-recursos-principais) • [Instalação Rápida](#-instalação-e-uso-rápido) • [Exportador](#-exportador-de-código-limpo) • [Atalhos](#-atalhos-de-teclado) • [API](#-configurações-e-api)

---

</div>

## 📖 Visão Geral

Editores visuais tradicionais como **Divi Builder**, **Webflow**, **Elementor** ou **GrapesJS** exigem plataformas pesadas, introduzem megabytes de scripts e geram um código HTML "poluído" com dezenas de `divs` e wrappers desnecessários.

O **SnapForge UI** nasceu de uma proposta diferente: **ser um construtor visual direto sobre o seu código limpo**, funcionando nativamente no navegador sobre o seu HTML e CSS reais.

Sem dependências externas, você inclui um CSS e um script JS minúsculo e ganha imediatamente:
- **Arrastar e Soltar de uma Div para Outra (Drag & Drop Reparenting)**: mova cards e seções entre colunas e linhas livremente.
- **Redimensionamento nos 4 Lados**: ajuste largura e altura passando o mouse nas bordas com cursor dinâmico.
- **Ímã Magnético (*Magnetic Snapping*)**: alinhamento com guias ciano fluorescentes (`#00d4ff`) em tempo real.
- **Modo Designer Não-Destrutivo**: contornos milimétricos com zero quebra de box model (<kbd>Alt</kbd>+<kbd>D</kbd>).
- **Floating HUD Toolbar**: barra flutuante translúcida com histórico completo (<kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Y</kbd>).
- **Exportador de Código Limpo**: gere CSS puro, classes utilitárias do Tailwind, snapshot JSON ou a estrutura HTML atualizada pronta para salvar.

---

## 🥊 SnapForge vs Grandes Builders

| Característica | SnapForge UI ⚡ | Divi / Elementor / Webflow 🐢 |
| :--- | :--- | :--- |
| **Peso / Dependências** | **0 dependências** (~18KB) | Centenas de KB a vários Megabytes |
| **Qualidade do Código** | **100% código limpo do desenvolvedor** | HTML poluído com múltiplos wrappers e divs |
| **Agnóstico a Framework** | **Sim** (HTML puro, React, Vue, Flask, Django) | Preso ao WordPress ou ecossistema proprietário |
| **Alinhamento Magnético** | **Guias ciano fluorescentes milimétricas** | Rígido ou ausente |
| **Controle de Dimensões** | **Mouse nos 4 lados + Caixa azul da página** | Menus laterais complexos e burocráticos |
| **Desfazer / Refazer** | **Nativo (<kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Y</kbd>)** | Pesado ou com histórico lento |

---

## 🎮 Live Playground & Demo

O projeto já inclui um Playground completo e funcional baseado no design system escuro profissional da **[Voitechrj](https://voitech-rj.github.io/)** (`#14161b`, `#345a87`, tipografia `Roboto` e `Roboto Mono`).

Abra o arquivo [`examples/index.html`](examples/index.html) diretamente no seu navegador:

```bash
# Clone o repositório
git clone https://github.com/ivoovieira/SnapForge-UI.git

# Abra o playground no navegador (Windows)
start examples/index.html
```

---

## ✨ Recursos Principais

### 1. 🔀 Arrastar e Soltar entre Divs (Drag & Drop Reparenting)
- Segure pelo ícone de alça **⠿** (`.drag-handle`) presente no cabeçalho do cartão.
- Arraste para qualquer container ou linha receptora (`.dashboard-row` ou `[data-dropzone="true"]`).
- Um indicador luminoso ciano pulsante mostra exatamente o ponto de inserção.
- Ao soltar, a hierarquia DOM é reorganizada instantaneamente com suporte a **<kbd>Ctrl</kbd> + <kbd>Z</kbd>**.

### 2. 📐 Modo Designer / Detecção de Bordas Não-Destrutiva
Ao pressionar <kbd>Alt</kbd> + <kbd>D</kbd> ou clicar no HUD:
- **Hierarquia Visual Instantânea**: Página em azul, grades em laranja, cartões em verde, inputs em vermelho.
- **Zero Quebra de Layout**: Utiliza `outline` com `outline-offset` negativo em vez de `border`, garantindo que **0 pixels** sejam adicionados ao box model.

### 3. 🖐️ Redimensionador Universal nos 4 Lados
Passe o mouse perto de qualquer uma das 4 extremidades de um cartão (`.panel-card`):
- **Cima (N)**: Manipula suavemente `marginTop` e compensa a altura (`height`).
- **Esquerda (W)**: Manipula `marginLeft` e compensa a largura (`width`).
- **Direita (E) e Baixo (S)**: Expande naturalmente a largura e altura.

### 4. 🧲 Ímã Magnético (*Magnetic Snapping*) com Guias Fluorescentes
- Ao aproximar a borda do cartão de outro cartão vizinho ou do limite útil da página (~14px de distância), o cursor é atraído instantaneamente.
- Linhas guia ciano de alto brilho surgem nos eixos vertical e horizontal indicando o alinhamento perfeito.

### 5. 🪟 Redimensionamento do Container da Página (Caixa Azul)
- Arraste a borda direita ou inferior do container principal (`.app-page.active`) para simular resoluções de tela e definir a largura ideal (`--page-width`).

### 6. 🎛️ Floating HUD Toolbar
Uma barra flutuante translúcida no rodapé da página com:
- Alternador de Contornos (Modo Designer)
- Alternador de Redimensionamento 4 Lados
- Alternador de Ímã Magnético
- Botões de Desfazer (<kbd>Ctrl</kbd>+<kbd>Z</kbd>) e Refazer (<kbd>Ctrl</kbd>+<kbd>Y</kbd>)
- Botão Exportar e Botão Resetar de Fábrica
- Clique no logo "SnapForge" para minimizar/expandir a barra.

---

## 🚀 Instalação e Uso Rápido

### 1. Adicione os arquivos ao seu projeto
Copie `resources/ui-designer.css` e `resources/ui-designer.js` para o seu diretório de assets.

### 2. Inclua o CSS no `<head>`
```html
<link rel="stylesheet" href="resources/ui-designer.css">
```

### 3. Inicialize o SnapForge no seu script
```html
<script src="resources/ui-designer.js"></script>
<script>
  window.addEventListener('DOMContentLoaded', () => {
    SnapForge.init({
      cardSelector: '.panel-card',           // Seletor dos cartões redimensionáveis
      pageSelector: '.app-page.active',      // Container delimitador da página
      dropzoneSelector: '.dashboard-row',    // Áreas receptoras de drag-and-drop
      storagePrefix: 'meu_app_ui',           // Chave para persistência no localStorage
      showToolbar: true,                     // Exibir Floating HUD Toolbar
      enableMagneticSnap: true,              // Habilitar atração magnética
      enableDragDrop: true,                  // Habilitar drag & drop entre divs
      snapThreshold: 14                      // Sensibilidade do ímã em pixels
    });
  });
</script>
```

---

## 📋 Exportador de Código Limpo

Quando terminar de posicionar, reorganizar e redimensionar seus cartões na tela, clique no botão **📋 Exportar** no HUD flutuante ou execute via JavaScript:

```javascript
// 1. Regras CSS limpas prontas para sua folha de estilos Desktop
SnapForge.exportLayout('css');

// 2. Bloco exclusivo de responsividade Mobile (@media) para colar no fim do CSS
SnapForge.exportLayout('mobile');

// 3. Classes utilitárias do Tailwind CSS
SnapForge.exportLayout('tailwind');

// 4. Estrutura HTML completa atualizada com as novas posições
SnapForge.exportLayout('html');

// 5. Snapshot estruturado em JSON para salvar em banco ou localStorage
SnapForge.exportLayout('json');
```

---

## ⌨️ Atalhos de Teclado

| Atalho | Descrição |
| :--- | :--- |
| <kbd>Alt</kbd> + <kbd>D</kbd> | Alterna o Modo Designer (Contornos milimétricos não-destrutivos) |
| <kbd>Alt</kbd> + <kbd>R</kbd> | Alterna o Modo de Redimensionamento Interativo |
| <kbd>Ctrl</kbd> + <kbd>Z</kbd> | Desfaz a última ação (redimensionamento ou movimento de div) |
| <kbd>Ctrl</kbd> + <kbd>Y</kbd> | Refaz a ação desfeita |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> | Alternativa para refazer |

---

## ⚙️ Configurações e API

### Opções do `SnapForge.init(options)`

```typescript
interface SnapForgeOptions {
  cardSelector?: string;           // Padrão: '.panel-card'
  pageSelector?: string;           // Padrão: '.app-page.active'
  dropzoneSelector?: string;       // Padrão: '.dashboard-row, [data-dropzone="true"]'
  storagePrefix?: string;          // Padrão: 'snapforge'
  showToolbar?: boolean;           // Padrão: true
  enableMagneticSnap?: boolean;    // Padrão: true
  enableDragDrop?: boolean;        // Padrão: true
  snapThreshold?: number;          // Padrão: 14 (pixels)
}
```

### Métodos Disponíveis

| Método | Descrição |
| :--- | :--- |
| `SnapForge.toggleEdges(force?)` | Liga ou desliga as bordas do Modo Designer |
| `SnapForge.toggleResizing(force?)` | Liga ou desliga o redimensionamento |
| `SnapForge.toggleMagnetic(force?)` | Liga ou desliga o ímã magnético |
| `SnapForge.undo()` | Desfaz a alteração mais recente |
| `SnapForge.redo()` | Refaz a ação do histórico |
| `SnapForge.exportLayout(format)` | Gera código ('css', 'tailwind', 'html', 'json') |
| `SnapForge.openExportModal()` | Abre o modal de exportação |
| `SnapForge.closeExportModal()` | Fecha o modal de exportação |
| `SnapForge.resetAll(confirm?)` | Restaura todas as caixas ao padrão |
| `SnapForge.showToast(msg)` | Exibe notificação temporária no topo |

---

## 📁 Estrutura do Repositório

```text
SnapForge-UI/
├── README.md                         # Documentação completa
├── LICENSE                           # Licença MIT
├── .gitignore                        # Regras do Git
├── SKILL.md                          # Definição e manual para Antigravity AI
├── examples/
│   ├── index.html                    # Playground Interativo & Live Demo (Tema Voitechrj)
│   └── assets/
│       └── voitechrj-logo.png        # Logo oficial Voitechrj
└── resources/
    ├── ui-designer.css               # Estilos universais, HUD, modal, ímã e drop indicator
    ├── ui-designer.js                # Motor SnapForge UI (Arraste 4 lados, Drag&Drop e Export)
    └── settings-widget.html          # Widget estático de controle
```

---

## 📄 Licença & Créditos

Distribuído sob a licença **MIT**. Consulte o arquivo [`LICENSE`](LICENSE) para mais detalhes.

Desenvolvido com ⚡ por [Ivo Vieira](https://github.com/ivoovieira) • Inspirado pelo ecossistema técnico **[Voitechrj](https://voitech-rj.github.io/)**.
