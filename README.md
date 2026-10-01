<div align="center">

# ⚡ SnapForge UI

**Zero-dependency precision UI layout designer, 4-way interactive edge resizing, magnetic snapping guides, floating HUD toolbar, and instant CSS/Tailwind exporter for modern web applications.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](#)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-yellow.svg)](#)
[![Pure CSS](https://img.shields.io/badge/Pure-CSS3-blueviolet.svg)](#)
[![GitHub stars](https://img.shields.io/github/stars/ivoovieira/SnapForge-UI?style=social)](https://github.com/ivoovieira/SnapForge-UI)

[Demonstração / Playground](#-live-playground--demo) • [Recursos](#-recursos-principais) • [Instalação Rápida](#-instalação-e-uso-rápido) • [Exportador](#-exportador-de-layout) • [Atalhos](#-atalhos-de-teclado) • [API](#-configurações-e-api)

---

</div>

## 📖 Visão Geral

O **SnapForge UI** foi projetado para desenvolvedores e designers que precisam prototipar, depurar e ajustar layouts web com precisão milimétrica sem depender de bibliotecas pesadas de terceiros (como jQuery UI ou frameworks complexos). 

Ele transforma qualquer página web estática ou dinâmica em um **ambiente interativo de ajuste de layout** com:
- Detecção instantânea de caixas e bordas (*Modo Designer*) que **não soma nenhum pixel** e não quebra grades flex/grid.
- Redimensionamento interativo com o mouse em qualquer um dos **4 lados** (Cima, Baixo, Esquerda e Direita) de cards e painéis.
- **Ímã Magnético (*Magnetic Snap*)** com guias ciano fluorescentes (`#00d4ff`) que atraem o cursor automaticamente para alinhar elementos vizinhos e bordas de página.
- **Floating HUD Toolbar**: uma barra discreta estilo *glassmorphism* com controles rápidos e minimizável.
- **Exportador de Layout**: com 1 clique, copie o CSS gerado, classes utilitárias do Tailwind ou snapshot JSON.
- **Desfazer (<kbd>Ctrl</kbd>+<kbd>Z</kbd>) e Refazer (<kbd>Ctrl</kbd>+<kbd>Y</kbd>)** ilimitado em memória e persistência no `localStorage`.

---

## 🎮 Live Playground & Demo

Quer ver em ação imediatamente?
Abra o arquivo [`examples/index.html`](examples/index.html) diretamente no seu navegador! Não requer servidores Node.js, compilações ou instalação de pacotes:

```bash
# Clone o repositório
git clone https://github.com/ivoovieira/SnapForge-UI.git

# Abra o playground no navegador (Windows)
start examples/index.html
```

---

## ✨ Recursos Principais

### 1. 📐 Modo Designer / Detecção de Bordas Não-Destrutiva
Ao pressionar <kbd>Alt</kbd> + <kbd>D</kbd> ou clicar no HUD:
- **Hierarquia Visual Instantânea**: Página em azul, grades em laranja, cartões em verde, inputs em vermelho.
- **Zero Quebra de Layout**: Utiliza `outline` com `outline-offset` negativo em vez de `border`, garantindo que **0 pixels** sejam adicionados ao box model.

### 2. 🖐️ Redimensionador Universal nos 4 Lados
Passe o mouse perto de qualquer uma das 4 extremidades de um cartão (`.panel-card`):
- **Cima (N)**: Manipula suavemente `marginTop` e compensa a altura (`height`).
- **Esquerda (W)**: Manipula `marginLeft` e compensa a largura (`width`).
- **Direita (E) e Baixo (S)**: Expande naturalmente a largura e altura.

### 3. 🧲 Ímã Magnético (*Magnetic Snapping*) com Guias Fluorescentes
- Ao aproximar a borda do cartão de outro cartão vizinho ou do limite útil da página (~14px de distância), o cursor é atraído instantaneamente.
- Linhas guia ciano de alto brilho surgem nos eixos vertical e horizontal indicando o alinhamento perfeito.

### 4. 🪟 Redimensionamento do Container da Página (Caixa Azul)
- Arraste a borda direita ou inferior do container principal (`.app-page.active`) para simular resoluções de tela e definir a largura ideal (`--page-width`).

### 5. 🎛️ Floating HUD Toolbar
Uma barra flutuante translúcida no rodapé da página com:
- Alternador de Contornos (Modo Designer)
- Alternador de Redimensionamento 4 Lados
- Alternador de Ímã Magnético
- Botões de Desfazer (<kbd>Ctrl</kbd>+<kbd>Z</kbd>) e Refazer (<kbd>Ctrl</kbd>+<kbd>Y</kbd>)
- Botão Exportar e Botão Resetar de Fábrica
- Clique no logo "SnapForge" para minimizar/expandir a barra.

---

## 🚀 Instalação e Uso Rápido

O **SnapForge UI** é 100% agnóstico a frameworks. Funciona com HTML puro, React, Next.js, Vue, Angular, Svelte, Flask, Django, etc.

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
      cardSelector: '.panel-card',       // Seletor dos cartões redimensionáveis
      pageSelector: '.app-page.active',  // Container delimitador da página
      storagePrefix: 'meu_app_ui',       // Chave para persistência no localStorage
      showToolbar: true,                 // Exibir Floating HUD Toolbar
      enableMagneticSnap: true,          // Habilitar atração magnética
      snapThreshold: 14                  // Sensibilidade do ímã em pixels
    });
  });
</script>
```

---

## 📋 Exportador de Layout

Quando terminar de posicionar e redimensionar seus cartões no navegador, clique no botão **📋 Exportar** no HUD flutuante ou execute no console:

```javascript
// Retorna as regras CSS prontas
SnapForge.exportLayout('css');

// Retorna as classes Tailwind CSS correspondentes
SnapForge.exportLayout('tailwind');

// Retorna o objeto Snapshot em formato JSON
SnapForge.exportLayout('json');
```

O modal embutido permite alternar entre as 3 abas e copiar o código com 1 clique para a área de transferência!

---

## ⌨️ Atalhos de Teclado

| Atalho | Descrição |
| :--- | :--- |
| <kbd>Alt</kbd> + <kbd>D</kbd> | Alterna o Modo Designer (Contornos milimétricos) |
| <kbd>Alt</kbd> + <kbd>R</kbd> | Alterna o Modo de Redimensionamento com Mouse |
| <kbd>Ctrl</kbd> + <kbd>Z</kbd> | Desfaz a última alteração de tamanho |
| <kbd>Ctrl</kbd> + <kbd>Y</kbd> | Refaz a alteração desfeita |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> | Alternativa para refazer |

---

## ⚙️ Configurações e API

### Opções do `SnapForge.init(options)`

```typescript
interface SnapForgeOptions {
  cardSelector?: string;           // Padrão: '.panel-card'
  pageSelector?: string;           // Padrão: '.app-page.active'
  storagePrefix?: string;          // Padrão: 'snapforge'
  showToolbar?: boolean;           // Padrão: true
  enableMagneticSnap?: boolean;    // Padrão: true
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
| `SnapForge.exportLayout(format)` | Gera o código formatado ('css', 'tailwind', 'json') |
| `SnapForge.openExportModal()` | Abre a janela visual de exportação |
| `SnapForge.closeExportModal()` | Fecha a janela de exportação |
| `SnapForge.resetAll(confirm?)` | Restaura todas as caixas ao tamanho padrão |
| `SnapForge.showToast(msg)` | Exibe notificação flutuante temporária |

---

## 📁 Estrutura do Repositório

```text
SnapForge-UI/
├── README.md                         # Este manual completo
├── LICENSE                           # Licença MIT
├── .gitignore                        # Regras do Git
├── SKILL.md                          # Definição e manual para Antigravity AI
├── examples/
│   └── index.html                    # Playground Interativo & Live Demo
└── resources/
    ├── ui-designer.css               # Estilos universais, HUD, modal e ímã
    ├── ui-designer.js                # Motor SnapForge UI
    └── settings-widget.html          # Widget estático de controle
```

---

## 🤝 Contribuições

Contribuições são super bem-vindas! Sinta-se à vontade para:
1. Fazer um Fork do projeto
2. Criar uma branch com a sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Fazer commit das suas alterações (`git commit -m 'feat: Adiciona suporte a snapping angular'`)
4. Fazer push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abrir um Pull Request

---

## 📄 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo [`LICENSE`](LICENSE) para mais detalhes.

Desenvolvido com ⚡ por [Ivo Vieira](https://github.com/ivoovieira).
