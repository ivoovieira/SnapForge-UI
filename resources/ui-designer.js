/**
 * SnapForge UI - Universal Precision Layout Designer & Magnetic Snapping Engine
 * Zero-dependency universal library for visual edge inspection, 4-way interactive resizing,
 * magnetic snap alignment guides, page container bounds, layout exporter (CSS/Tailwind/JSON),
 * undo/redo history, and floating designer HUD.
 *
 * @author Ivo Vieira <voitechrj@gmail.com>
 * @license MIT
 * @repository https://github.com/ivoovieira/SnapForge-UI
 */

(function (window, document) {
  'use strict';

  const SnapForge = {
    version: '1.1.0',
    historyStack: [],
    redoStack: [],
    maxHistory: 30,
    storagePrefix: 'snapforge',
    options: {
      cardSelector: '.panel-card',
      pageSelector: '.app-page.active',
      storagePrefix: 'snapforge',
      showToolbar: true,
      enableMagneticSnap: true,
      snapThreshold: 14
    },

    // DOM Elements
    guideV: null,
    guideH: null,
    hud: null,
    modalBackdrop: null,
    toastEl: null,

    init(userOptions = {}) {
      this.options = Object.assign({}, this.options, userOptions);
      this.storagePrefix = this.options.storagePrefix;

      // 1. Injeta Guias Magnéticas Fluorescentes
      this._initGuides();

      // 2. Restaura Estado Salvo (Página e Cards)
      this._restoreSavedDimensions();

      // 3. Injeta Floating HUD Toolbar se habilitado
      if (this.options.showToolbar) {
        this._initHUD();
      }

      // 4. Injeta Modal de Exportação e Toasts
      this._initExportModal();
      this._initToast();

      // 5. Registra Listeners de Mouse (Arraste 4 Lados, Splitters e Container da Página)
      this._bindMouseEvents();

      // 6. Registra Atalhos Globais de Teclado
      this._bindKeyboardEvents();

      // Restaura toggles salvos no localStorage
      const savedEdges = localStorage.getItem(`${this.storagePrefix}_edges`);
      if (savedEdges === 'true') this.toggleEdges(true);

      const savedResizing = localStorage.getItem(`${this.storagePrefix}_resizing`);
      if (savedResizing === 'true') this.toggleResizing(true);

      this._updateToolbarState();
      return this;
    },

    _initGuides() {
      let gV = document.getElementById('snapforgeGuideV');
      let gH = document.getElementById('snapforgeGuideH');
      if (!gV) {
        gV = document.createElement('div');
        gV.id = 'snapforgeGuideV';
        gV.className = 'magnetic-snap-guide-v';
        gV.style.cssText = 'position:fixed; width:2px; height:100vh; top:0; background:#00d4ff; box-shadow:0 0 8px #00d4ff, 0 0 16px rgba(0,212,255,0.9); pointer-events:none; z-index:100001; display:none;';
        document.body.appendChild(gV);
      }
      if (!gH) {
        gH = document.createElement('div');
        gH.id = 'snapforgeGuideH';
        gH.className = 'magnetic-snap-guide-h';
        gH.style.cssText = 'position:fixed; height:2px; width:100vw; left:0; background:#00d4ff; box-shadow:0 0 8px #00d4ff, 0 0 16px rgba(0,212,255,0.9); pointer-events:none; z-index:100001; display:none;';
        document.body.appendChild(gH);
      }
      this.guideV = gV;
      this.guideH = gH;
    },

    _showGuideV(x) {
      if (!this.guideV) return;
      this.guideV.style.left = `${Math.round(x)}px`;
      this.guideV.style.display = 'block';
    },

    _showGuideH(y) {
      if (!this.guideH) return;
      this.guideH.style.top = `${Math.round(y)}px`;
      this.guideH.style.display = 'block';
    },

    _hideGuides() {
      if (this.guideV) this.guideV.style.display = 'none';
      if (this.guideH) this.guideH.style.display = 'none';
    },

    _findSnap(val, targets) {
      if (!this.options.enableMagneticSnap) {
        return { snapped: false, snapVal: val };
      }
      const threshold = this.options.snapThreshold || 14;
      for (const t of targets) {
        if (Math.abs(val - t) <= threshold) {
          return { snapped: true, snapVal: t };
        }
      }
      return { snapped: false, snapVal: val };
    },

    _restoreSavedDimensions() {
      const savedPageW = localStorage.getItem(`${this.storagePrefix}_page_width`);
      if (savedPageW) {
        document.documentElement.style.setProperty('--page-width', savedPageW);
      }

      document.querySelectorAll(this.options.cardSelector).forEach((card) => {
        if (!card.id) return;
        const saved = localStorage.getItem(`${this.storagePrefix}_card_${card.id}`);
        if (saved) {
          try {
            const data = JSON.parse(saved);
            if (data.w) { card.style.width = data.w; card.style.flex = 'none'; }
            if (data.h) card.style.height = data.h;
            if (data.mt) card.style.marginTop = data.mt;
            if (data.ml) card.style.marginLeft = data.ml;
          } catch (e) {}
        }
      });
    },

    /* ==========================================================================
       Floating HUD Toolbar
       ========================================================================== */
    _initHUD() {
      if (document.getElementById('snapforgeHUD')) return;

      const hud = document.createElement('div');
      hud.id = 'snapforgeHUD';
      hud.className = 'snapforge-hud';
      hud.innerHTML = `
        <div class="snapforge-hud-brand" id="snapforgeBrand" title="SnapForge UI - Clique para minimizar/expandir">
          <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          <span>SnapForge</span>
        </div>
        <div class="snapforge-hud-group">
          <button type="button" class="snapforge-btn" id="sfBtnEdges" title="Alternar Modo Designer / Detecção de Bordas (Alt + D)">
            📐 Bordas <kbd>Alt+D</kbd>
          </button>
          <button type="button" class="snapforge-btn" id="sfBtnResize" title="Alternar Redimensionamento 4 Lados com o Mouse">
            🖐️ Redimensionar
          </button>
          <button type="button" class="snapforge-btn active" id="sfBtnMagnet" title="Alternar Ímã Magnético">
            🧲 Ímã
          </button>
          <div class="snapforge-hud-sep"></div>
          <button type="button" class="snapforge-btn" id="sfBtnUndo" title="Desfazer Última Alteração (Ctrl + Z)" disabled>
            ↩
          </button>
          <button type="button" class="snapforge-btn" id="sfBtnRedo" title="Refazer (Ctrl + Y)" disabled>
            ↪
          </button>
          <div class="snapforge-hud-sep"></div>
          <button type="button" class="snapforge-btn" id="sfBtnExport" title="Exportar Layout para CSS, Tailwind ou JSON">
            📋 Exportar
          </button>
          <button type="button" class="snapforge-btn" id="sfBtnReset" title="Restaurar Dimensões Originais">
            ↺ Reset
          </button>
        </div>
      `;

      document.body.appendChild(hud);
      this.hud = hud;

      // Eventos dos botões do HUD
      hud.querySelector('#snapforgeBrand').addEventListener('click', () => {
        hud.classList.toggle('snapforge-minimized');
      });

      hud.querySelector('#sfBtnEdges').addEventListener('click', () => {
        this.toggleEdges();
      });

      hud.querySelector('#sfBtnResize').addEventListener('click', () => {
        this.toggleResizing();
      });

      hud.querySelector('#sfBtnMagnet').addEventListener('click', () => {
        this.toggleMagnetic();
      });

      hud.querySelector('#sfBtnUndo').addEventListener('click', () => {
        this.undo();
      });

      hud.querySelector('#sfBtnRedo').addEventListener('click', () => {
        this.redo();
      });

      hud.querySelector('#sfBtnExport').addEventListener('click', () => {
        this.openExportModal();
      });

      hud.querySelector('#sfBtnReset').addEventListener('click', () => {
        this.resetAll(true);
      });
    },

    _updateToolbarState() {
      if (!this.hud) return;
      const btnEdges = this.hud.querySelector('#sfBtnEdges');
      const btnResize = this.hud.querySelector('#sfBtnResize');
      const btnMagnet = this.hud.querySelector('#sfBtnMagnet');
      const btnUndo = this.hud.querySelector('#sfBtnUndo');
      const btnRedo = this.hud.querySelector('#sfBtnRedo');

      if (btnEdges) {
        btnEdges.classList.toggle('active', document.body.classList.contains('debug-edges'));
      }
      if (btnResize) {
        btnResize.classList.toggle('active', document.body.classList.contains('enable-resizing'));
      }
      if (btnMagnet) {
        btnMagnet.classList.toggle('active', !!this.options.enableMagneticSnap);
      }
      if (btnUndo) {
        btnUndo.disabled = this.historyStack.length === 0;
      }
      if (btnRedo) {
        btnRedo.disabled = this.redoStack.length === 0;
      }
    },

    /* ==========================================================================
       Export Modal & Toast
       ========================================================================== */
    _initExportModal() {
      if (document.getElementById('snapforgeModalBackdrop')) return;

      const backdrop = document.createElement('div');
      backdrop.id = 'snapforgeModalBackdrop';
      backdrop.className = 'snapforge-modal-backdrop';
      backdrop.innerHTML = `
        <div class="snapforge-modal">
          <div class="snapforge-modal-header">
            <div class="snapforge-modal-title">
              <span>⚡ Exportar Dimensões & Layout</span>
            </div>
            <button class="snapforge-modal-close" id="sfModalCloseBtn">&times;</button>
          </div>
          <div class="snapforge-modal-tabs">
            <button class="snapforge-tab-btn active" data-tab="css">CSS Rules</button>
            <button class="snapforge-tab-btn" data-tab="tailwind">Tailwind Classes</button>
            <button class="snapforge-tab-btn" data-tab="json">JSON Snapshot</button>
          </div>
          <div class="snapforge-modal-body">
            <pre class="snapforge-code-box" id="sfExportCodeBox"></pre>
          </div>
          <div class="snapforge-modal-footer">
            <button class="snapforge-btn" id="sfModalCloseBtn2">Fechar</button>
            <button class="snapforge-btn-primary" id="sfModalCopyBtn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span>Copiar para Área de Transferência</span>
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(backdrop);
      this.modalBackdrop = backdrop;

      // Eventos do Modal
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.closeExportModal();
      });

      backdrop.querySelector('#sfModalCloseBtn').addEventListener('click', () => this.closeExportModal());
      backdrop.querySelector('#sfModalCloseBtn2').addEventListener('click', () => this.closeExportModal());

      // Alternar Tabs
      const tabs = backdrop.querySelectorAll('.snapforge-tab-btn');
      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          tabs.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');
          this._renderExportContent(tab.dataset.tab);
        });
      });

      // Botão Copiar
      backdrop.querySelector('#sfModalCopyBtn').addEventListener('click', () => {
        const code = backdrop.querySelector('#sfExportCodeBox').textContent;
        navigator.clipboard.writeText(code).then(() => {
          this.showToast('Código copiado com sucesso!');
        }).catch(() => {
          this.showToast('Erro ao copiar!');
        });
      });
    },

    _initToast() {
      let toast = document.getElementById('snapforgeToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'snapforgeToast';
        toast.className = 'snapforge-toast';
        document.body.appendChild(toast);
      }
      this.toastEl = toast;
    },

    showToast(message) {
      if (!this.toastEl) return;
      this.toastEl.textContent = message;
      this.toastEl.classList.add('show');
      setTimeout(() => {
        this.toastEl.classList.remove('show');
      }, 2400);
    },

    openExportModal() {
      if (!this.modalBackdrop) return;
      this._renderExportContent('css');
      this.modalBackdrop.classList.add('active');
    },

    closeExportModal() {
      if (!this.modalBackdrop) return;
      this.modalBackdrop.classList.remove('active');
    },

    _renderExportContent(format = 'css') {
      const box = document.getElementById('sfExportCodeBox');
      if (!box) return;
      box.textContent = this.exportLayout(format);
    },

    exportLayout(format = 'css') {
      const snap = this.captureSnapshot();
      if (format === 'json') {
        return JSON.stringify(snap, null, 2);
      }

      if (format === 'tailwind') {
        let lines = [];
        lines.push(`/* Page container: max-w-[${snap.pageWidth}] */`);
        Object.keys(snap.cards).forEach((id) => {
          const c = snap.cards[id];
          const classes = [];
          if (c.w) classes.push(`w-[${c.w}]`);
          if (c.h) classes.push(`h-[${c.h}]`);
          if (c.mt) classes.push(`mt-[${c.mt}]`);
          if (c.ml) classes.push(`ml-[${c.ml}]`);
          if (classes.length > 0) {
            lines.push(`<!-- Element #${id} -->\nclass="${classes.join(' ')}"`);
          }
        });
        return lines.length ? lines.join('\n\n') : '/* Nenhum elemento redimensionado ainda. */';
      }

      // CSS Rules (Padrão)
      let cssRules = [];
      if (snap.pageWidth && snap.pageWidth !== '100%') {
        cssRules.push(`:root {\n  --page-width: ${snap.pageWidth};\n}`);
      }

      Object.keys(snap.cards).forEach((id) => {
        const c = snap.cards[id];
        let props = [];
        if (c.w) props.push(`  width: ${c.w}; flex: none;`);
        if (c.h) props.push(`  height: ${c.h};`);
        if (c.mt) props.push(`  margin-top: ${c.mt};`);
        if (c.ml) props.push(`  margin-left: ${c.ml};`);
        if (props.length > 0) {
          cssRules.push(`#${id} {\n${props.join('\n')}\n}`);
        }
      });

      return cssRules.length ? cssRules.join('\n\n') : '/* Nenhum card redimensionado manualmente. Redimensione algum card para exportar. */';
    },

    /* ==========================================================================
       Toggles de Funcionalidade
       ========================================================================== */
    toggleEdges(force) {
      const isActive = force !== undefined ? force : !document.body.classList.contains('debug-edges');
      document.body.classList.toggle('debug-edges', isActive);
      localStorage.setItem(`${this.storagePrefix}_edges`, isActive ? 'true' : 'false');
      this._updateToolbarState();
      this.showToast(isActive ? 'Modo Designer Ativado' : 'Modo Designer Desativado');
      return isActive;
    },

    toggleResizing(force) {
      const isActive = force !== undefined ? force : !document.body.classList.contains('enable-resizing');
      document.body.classList.toggle('enable-resizing', isActive);
      localStorage.setItem(`${this.storagePrefix}_resizing`, isActive ? 'true' : 'false');
      this._updateToolbarState();
      this.showToast(isActive ? 'Redimensionamento Ativado' : 'Redimensionamento Desativado');
      return isActive;
    },

    toggleMagnetic(force) {
      this.options.enableMagneticSnap = force !== undefined ? force : !this.options.enableMagneticSnap;
      this._updateToolbarState();
      this.showToast(this.options.enableMagneticSnap ? 'Ímã Magnético Ativado' : 'Ímã Magnético Desativado');
      return this.options.enableMagneticSnap;
    },

    resetAll(promptConfirm = false) {
      if (promptConfirm && !confirm('Deseja restaurar todos os painéis e limites de página ao padrão original?')) {
        return;
      }
      this.pushHistory();

      // Limpa cards
      document.querySelectorAll(this.options.cardSelector).forEach((c) => {
        c.style.width = '';
        c.style.height = '';
        c.style.marginTop = '';
        c.style.marginLeft = '';
        c.style.flex = '';
        if (c.id) localStorage.removeItem(`${this.storagePrefix}_card_${c.id}`);
      });

      // Limpa largura de página
      document.documentElement.style.removeProperty('--page-width');
      localStorage.removeItem(`${this.storagePrefix}_page_width`);

      const curPage = document.querySelector(this.options.pageSelector);
      if (curPage) {
        curPage.style.width = '';
        curPage.style.minHeight = '';
      }

      this.showToast('Layout restaurado ao padrão de fábrica!');
      this._updateToolbarState();
    },

    /* ==========================================================================
       Motor de Arraste e Redimensionamento com Ímã Magnético
       ========================================================================== */
    _bindMouseEvents() {
      const self = this;
      let activeCard = null;
      let activeDir = null;
      let activePage = null;
      let activePageDir = null;
      let startMouseX = 0, startMouseY = 0;
      let startW = 0, startH = 0;
      let startMarginTop = 0, startMarginLeft = 0;
      let siblingTargetsX = [];
      let siblingTargetsY = [];

      document.addEventListener('mousemove', (e) => {
        if (!document.body.classList.contains('enable-resizing')) return;

        // A. Arraste ativo da página (Container Azul)
        if (activePage && activePageDir) {
          const deltaX = e.clientX - startMouseX;
          const deltaY = e.clientY - startMouseY;
          const pr = activePage.getBoundingClientRect();

          if (activePageDir === 'page-e') {
            const snap = self._findSnap(e.clientX, [window.innerWidth - 20, window.innerWidth - 40]);
            let newW = startW + deltaX;
            if (snap.snapped) {
              newW = snap.snapVal - pr.left;
              self._showGuideV(snap.snapVal);
            } else {
              self._hideGuides();
            }
            newW = Math.max(350, Math.min(window.innerWidth - pr.left - 20, newW));
            document.documentElement.style.setProperty('--page-width', `${newW}px`);
            activePage.style.width = `${newW}px`;
          } else if (activePageDir === 'page-s') {
            const snap = self._findSnap(e.clientY, [window.innerHeight - 20]);
            let newH = startH + deltaY;
            if (snap.snapped) {
              newH = snap.snapVal - pr.top;
              self._showGuideH(snap.snapVal);
            } else {
              self._hideGuides();
            }
            newH = Math.max(250, newH);
            activePage.style.minHeight = `${newH}px`;
          }
          return;
        }

        // B. Arraste ativo de card individual
        if (activeCard && activeDir) {
          let deltaX = e.clientX - startMouseX;
          let deltaY = e.clientY - startMouseY;

          if (activeDir === 's') {
            const snap = self._findSnap(e.clientY, siblingTargetsY);
            if (snap.snapped) {
              deltaY = snap.snapVal - startMouseY;
              self._showGuideH(snap.snapVal);
            } else {
              self._hideGuides();
            }
            const newH = Math.max(100, Math.min(window.innerHeight * 0.95, startH + deltaY));
            activeCard.style.height = `${newH}px`;
          } else if (activeDir === 'n') {
            const snap = self._findSnap(e.clientY, siblingTargetsY);
            if (snap.snapped) {
              deltaY = snap.snapVal - startMouseY;
              self._showGuideH(snap.snapVal);
            } else {
              self._hideGuides();
            }
            const newMt = Math.max(0, startMarginTop + deltaY);
            const newH = Math.max(100, Math.min(window.innerHeight * 0.95, startH - deltaY));
            activeCard.style.marginTop = `${newMt}px`;
            activeCard.style.height = `${newH}px`;
          } else if (activeDir === 'e') {
            const snap = self._findSnap(e.clientX, siblingTargetsX);
            if (snap.snapped) {
              deltaX = snap.snapVal - startMouseX;
              self._showGuideV(snap.snapVal);
            } else {
              self._hideGuides();
            }
            const newW = Math.max(160, Math.min(window.innerWidth * 0.95, startW + deltaX));
            activeCard.style.width = `${newW}px`;
            activeCard.style.flex = 'none';
          } else if (activeDir === 'w') {
            const snap = self._findSnap(e.clientX, siblingTargetsX);
            if (snap.snapped) {
              deltaX = snap.snapVal - startMouseX;
              self._showGuideV(snap.snapVal);
            } else {
              self._hideGuides();
            }
            const newMl = Math.max(0, startMarginLeft + deltaX);
            const newW = Math.max(160, Math.min(window.innerWidth * 0.95, startW - deltaX));
            activeCard.style.marginLeft = `${newMl}px`;
            activeCard.style.width = `${newW}px`;
            activeCard.style.flex = 'none';
          }
          return;
        }

        // C. Hover sobre Card (Mudança Inteligente de Cursor)
        const target = e.target.closest(self.options.cardSelector);
        if (target && !e.target.closest('input, select, textarea, button, a, .snapforge-hud')) {
          const rect = target.getBoundingClientRect();
          const hit = 12;
          const nearTop = Math.abs(e.clientY - rect.top) <= hit;
          const nearBottom = Math.abs(e.clientY - rect.bottom) <= hit;
          const nearLeft = Math.abs(e.clientX - rect.left) <= hit;
          const nearRight = Math.abs(e.clientX - rect.right) <= hit;

          if (nearBottom) { target.style.cursor = 's-resize'; return; }
          if (nearTop) { target.style.cursor = 'n-resize'; return; }
          if (nearRight) { target.style.cursor = 'e-resize'; return; }
          if (nearLeft) { target.style.cursor = 'w-resize'; return; }
          target.style.cursor = '';
        }

        // D. Hover sobre Limites do Container da Página (Caixa Azul)
        const curPage = document.querySelector(self.options.pageSelector);
        if (curPage && !target) {
          const pr = curPage.getBoundingClientRect();
          const hit = 14;
          const nearRight = Math.abs(e.clientX - pr.right) <= hit && (e.clientY >= pr.top && e.clientY <= pr.bottom + hit);
          const nearBottom = Math.abs(e.clientY - pr.bottom) <= hit && (e.clientX >= pr.left && e.clientX <= pr.right + hit);

          if (nearRight) {
            document.body.style.cursor = 'col-resize';
            curPage.style.cursor = 'col-resize';
            return;
          } else if (nearBottom) {
            document.body.style.cursor = 'row-resize';
            curPage.style.cursor = 'row-resize';
            return;
          } else {
            if (!activeCard && !activePage) {
              document.body.style.cursor = '';
              curPage.style.cursor = '';
            }
          }
        }
      });

      document.addEventListener('mousedown', (e) => {
        if (!document.body.classList.contains('enable-resizing')) return;
        if (e.target.closest('input, select, textarea, button, a, .snapforge-hud, .snapforge-modal-backdrop')) return;

        // Clique em Card Individual
        const target = e.target.closest(self.options.cardSelector);
        if (target) {
          const rect = target.getBoundingClientRect();
          const hit = 12;
          const nearTop = Math.abs(e.clientY - rect.top) <= hit;
          const nearBottom = Math.abs(e.clientY - rect.bottom) <= hit;
          const nearLeft = Math.abs(e.clientX - rect.left) <= hit;
          const nearRight = Math.abs(e.clientX - rect.right) <= hit;

          if (nearBottom) activeDir = 's';
          else if (nearTop) activeDir = 'n';
          else if (nearRight) activeDir = 'e';
          else if (nearLeft) activeDir = 'w';
          else return;

          self.pushHistory();
          activeCard = target;
          startMouseX = e.clientX;
          startMouseY = e.clientY;
          startW = target.offsetWidth;
          startH = target.offsetHeight;
          startMarginTop = parseFloat(getComputedStyle(target).marginTop) || 0;
          startMarginLeft = parseFloat(getComputedStyle(target).marginLeft) || 0;

          siblingTargetsX = [];
          siblingTargetsY = [];

          const curPage = document.querySelector(self.options.pageSelector);
          if (curPage) {
            const pr = curPage.getBoundingClientRect();
            siblingTargetsX.push(pr.left, pr.right);
            siblingTargetsY.push(pr.top, pr.bottom);
          }
          siblingTargetsX.push(window.innerWidth - 20);

          document.querySelectorAll(self.options.cardSelector).forEach((c) => {
            if (c !== target) {
              const r = c.getBoundingClientRect();
              siblingTargetsX.push(r.left, r.right);
              siblingTargetsY.push(r.top, r.bottom);
            }
          });

          target.classList.add(`resizing-${activeDir}`);
          document.body.style.userSelect = 'none';
          e.preventDefault();
          return;
        }

        // Clique na borda do Container da Página (Caixa Azul)
        const curPage = document.querySelector(self.options.pageSelector);
        if (curPage) {
          const pr = curPage.getBoundingClientRect();
          const hit = 14;
          const nearRight = Math.abs(e.clientX - pr.right) <= hit && (e.clientY >= pr.top && e.clientY <= pr.bottom + hit);
          const nearBottom = Math.abs(e.clientY - pr.bottom) <= hit && (e.clientX >= pr.left && e.clientX <= pr.right + hit);

          if (nearRight) {
            self.pushHistory();
            activePage = curPage;
            activePageDir = 'page-e';
            startMouseX = e.clientX;
            startW = curPage.offsetWidth;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            e.preventDefault();
            return;
          } else if (nearBottom) {
            self.pushHistory();
            activePage = curPage;
            activePageDir = 'page-s';
            startMouseY = e.clientY;
            startH = curPage.offsetHeight;
            document.body.style.cursor = 'row-resize';
            document.body.style.userSelect = 'none';
            e.preventDefault();
            return;
          }
        }
      });

      document.addEventListener('mouseup', () => {
        self._hideGuides();

        if (activeCard && activeDir) {
          activeCard.classList.remove(`resizing-${activeDir}`);
          if (activeCard.id) {
            const saveObj = {
              w: activeCard.style.width,
              h: activeCard.style.height,
              mt: activeCard.style.marginTop,
              ml: activeCard.style.marginLeft
            };
            localStorage.setItem(`${self.storagePrefix}_card_${activeCard.id}`, JSON.stringify(saveObj));
          }
          activeCard = null;
          activeDir = null;
          document.body.style.userSelect = '';
        }

        if (activePage && activePageDir) {
          if (activePageDir === 'page-e') {
            const finalW = activePage.style.width;
            if (finalW) localStorage.setItem(`${self.storagePrefix}_page_width`, finalW);
          }
          activePage = null;
          activePageDir = null;
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
        }
      });

      // Splitters de Colunas e Linhas (.layout-resizer)
      this._bindSplitters();
    },

    _bindSplitters() {
      const self = this;
      document.querySelectorAll('.layout-resizer, .layout-resizer-vertical').forEach((resizer) => {
        let isDragging = false;
        let startPos = 0;
        let prevEl = null;
        let nextEl = null;
        let prevStartSize = 0;
        let nextStartSize = 0;
        const isVertical = resizer.classList.contains('layout-resizer-vertical');

        resizer.addEventListener('mousedown', (e) => {
          if (!document.body.classList.contains('enable-resizing')) return;
          self.pushHistory();
          isDragging = true;
          startPos = isVertical ? e.clientY : e.clientX;
          prevEl = resizer.previousElementSibling;
          nextEl = resizer.nextElementSibling;
          if (prevEl) prevStartSize = isVertical ? prevEl.offsetHeight : prevEl.offsetWidth;
          if (nextEl) nextStartSize = isVertical ? nextEl.offsetHeight : nextEl.offsetWidth;

          resizer.classList.add('is-dragging');
          document.body.style.userSelect = 'none';
          document.body.style.cursor = isVertical ? 'row-resize' : 'col-resize';
          e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
          if (!isDragging || !prevEl) return;
          const currentPos = isVertical ? e.clientY : e.clientX;
          const delta = currentPos - startPos;

          if (isVertical) {
            const newH = Math.max(60, prevStartSize + delta);
            prevEl.style.height = `${newH}px`;
          } else {
            const newW = Math.max(60, prevStartSize + delta);
            prevEl.style.width = `${newW}px`;
            prevEl.style.flex = 'none';
          }
        });

        window.addEventListener('mouseup', () => {
          if (isDragging) {
            isDragging = false;
            resizer.classList.remove('is-dragging');
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
          }
        });
      });
    },

    /* ==========================================================================
       Atalhos de Teclado Globais (Alt+D, Ctrl+Z, Ctrl+Y)
       ========================================================================== */
    _bindKeyboardEvents() {
      const self = this;
      window.addEventListener('keydown', (e) => {
        const isInput = e.target.closest('input, textarea, select');

        // Alt + D: Toggle Outlines Modo Designer
        if (e.altKey && (e.key === 'd' || e.key === 'D')) {
          e.preventDefault();
          self.toggleEdges();
          return;
        }

        // Alt + R: Toggle Modo Redimensionamento
        if (e.altKey && (e.key === 'r' || e.key === 'R')) {
          e.preventDefault();
          self.toggleResizing();
          return;
        }

        if (isInput) return;

        // Ctrl + Z: Desfazer
        if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
          e.preventDefault();
          if (e.shiftKey) self.redo();
          else self.undo();
        } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
          // Ctrl + Y: Refazer
          e.preventDefault();
          self.redo();
        }
      });
    },

    /* ==========================================================================
       Histórico (Undo / Redo / Snapshots)
       ========================================================================== */
    captureSnapshot() {
      const snap = {
        pageWidth: document.documentElement.style.getPropertyValue('--page-width') || '100%',
        cards: {}
      };
      document.querySelectorAll(`${this.options.cardSelector}[id]`).forEach((card) => {
        snap.cards[card.id] = {
          w: card.style.width || '',
          h: card.style.height || '',
          mt: card.style.marginTop || '',
          ml: card.style.marginLeft || '',
          flex: card.style.flex || ''
        };
      });
      return snap;
    },

    applySnapshot(snap) {
      if (!snap) return;
      if (snap.pageWidth) {
        document.documentElement.style.setProperty('--page-width', snap.pageWidth);
      }
      if (snap.cards) {
        Object.keys(snap.cards).forEach((id) => {
          const card = document.getElementById(id);
          if (card) {
            const c = snap.cards[id];
            card.style.width = c.w || '';
            card.style.height = c.h || '';
            card.style.marginTop = c.mt || '';
            card.style.marginLeft = c.ml || '';
            card.style.flex = c.flex || '';
            if (c.w || c.h || c.mt || c.ml) {
              localStorage.setItem(`${this.storagePrefix}_card_${id}`, JSON.stringify(c));
            } else {
              localStorage.removeItem(`${this.storagePrefix}_card_${id}`);
            }
          }
        });
      }
      this._updateToolbarState();
    },

    pushHistory() {
      this.historyStack.push(this.captureSnapshot());
      if (this.historyStack.length > this.maxHistory) this.historyStack.shift();
      this.redoStack.length = 0;
      this._updateToolbarState();
    },

    undo() {
      if (this.historyStack.length === 0) return;
      this.redoStack.push(this.captureSnapshot());
      const prev = this.historyStack.pop();
      this.applySnapshot(prev);
      this.showToast('Desfeito (Ctrl+Z)');
    },

    redo() {
      if (this.redoStack.length === 0) return;
      this.historyStack.push(this.captureSnapshot());
      const next = this.redoStack.pop();
      this.applySnapshot(next);
      this.showToast('Refeito (Ctrl+Y)');
    }
  };

  // Exportações Universais (SnapForge e compatibilidade com LayoutDesigner)
  window.SnapForge = SnapForge;
  window.LayoutDesigner = SnapForge;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SnapForge;
  }
})(window, document);
