/**
 * Complete Interactive Architecture & Threat Model Engine
 * Inspired by KubeDaily's threat-model engine
 * Standardized for AI, Large Language Models, and Autonomous Agent Security
 */

(function () {
  let currentSheet = 'cluster';
  let currentZoom = 1.0;
  let currentLevel = 0;
  let currentFlow = 'off';
  let isDragging = false;
  let startX = 0, startY = 0;
  let scrollLeft = 0, scrollTop = 0;
  let activeElement = null;
  let currentDrawerData = null;
  let threatModelCatalog = {};

  const sheetConfig = {
    'cluster': {
      title: '01 · Master Threat Register & System Architecture',
      svgPath: '/assets/threat-model/sheet1_master.svg',
      dotColor: '#22c55e'
    },
    'attack-chains': {
      title: '02 · Attack Chains & Mitigation Narratives',
      svgPath: '/assets/threat-model/sheet2_attack_chains.svg',
      dotColor: '#ef4444'
    },
    'security-architecture': {
      title: '03 · Layered AI Defense Reference Architecture',
      svgPath: '/assets/threat-model/sheet3_defense_architecture.svg',
      dotColor: '#3b82f6'
    },
    'flow-analysis': {
      title: '04 · Prompt & Data Flow Packet Analysis',
      svgPath: '/assets/threat-model/sheet4_flow_analysis.svg',
      dotColor: '#a855f7'
    }
  };

  const flowPresets = {
    'p1': {
      title: 'Active Flow: P1 · Direct Jailbreak to Directive Exfiltration',
      desc: 'Adversary submits multi-turn role-reversal payload. Guardrail lacks semantic boundary detection. System prompt exfiltrated verbatim.',
      steps: ['[1] User Ingress (TA01)', '[2] Attention Window (TO04)', '[3] Safety Alignment Dissolved', '[4] Key Exfiltration (Canary C05 Alert)']
    },
    'p2': {
      title: 'Active Flow: P2 · Indirect RAG Document Poisoning',
      desc: 'Adversary embeds prompt inside untrusted PDF. Vector database retrieves poisoned chunk into agent context. Autonomous email tool dispatched.',
      steps: ['[1] Malicious Web/Doc (TA02)', '[2] Vector DB Ingestion (TO08)', '[3] Context Window Capture', '[4] Unauthorized Action (C08 Gate)']
    },
    'p3': {
      title: 'Active Flow: P3 · Tool Call SSRF & Cloud Metadata Extraction',
      desc: 'Prompt injection coerces fetch_webpage tool into requesting AWS IMDS 169.254.169.254, leaking IAM temporary STS role credentials.',
      steps: ['[1] Adversarial Prompt', '[2] Agent Tool Planner (TO06)', '[3] IMDS Query (169.254.169.254)', '[4] Sandbox Block (C04 NetPol)']
    }
  };

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', async () => {
    await loadThreatModelData();
    initPanZoom();
    initSearch();
    await switchSheet('cluster');
    initKeyboardShortcuts();
    checkUrlHash();
  });

  // Load JSON catalog
  async function loadThreatModelData() {
    try {
      const res = await fetch('/data/threat-model.json');
      if (res.ok) {
        const data = await res.json();
        threatModelCatalog = data.components || {};
      }
    } catch (e) {
      console.warn('Could not load /data/threat-model.json, using built-in catalog fallback:', e);
    }
  }

  // Switch Active Diagram Sheet
  window.switchSheet = async function (sheetKey) {
    if (!sheetConfig[sheetKey]) sheetKey = 'cluster';
    currentSheet = sheetKey;

    // Update Tab UI
    document.querySelectorAll('.sheet-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-sheet') === sheetKey);
    });

    const target = document.getElementById('diagram-svg-target');
    if (!target) return;

    try {
      const res = await fetch(sheetConfig[sheetKey].svgPath);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const svgText = await res.text();
      target.innerHTML = svgText;

      const svgEl = target.querySelector('svg');
      if (svgEl) {
        attachSvgListeners(svgEl);
      }
    } catch (err) {
      console.warn('SVG inlining failed, using fallback img:', err);
      target.innerHTML = `<img src="${sheetConfig[sheetKey].svgPath}" alt="Threat Model Sheet" style="display:block;max-width:none;" />`;
    }

    resetZoom();
  };

  // Attach interactive click and hover handlers to SVG elements
  function attachSvgListeners(svgEl) {
    const nodes = svgEl.querySelectorAll('.tm-node, g[data-id]');
    nodes.forEach(node => {
      node.style.cursor = 'pointer';
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        const idText = node.getAttribute('data-id') || node.textContent.trim().slice(0, 30);
        const slug = node.getAttribute('data-slug') || idText.toLowerCase();
        inspectNode(node, slug, idText);
      });
    });
  }

  // Inspect clicked node
  function inspectNode(element, slug, idText) {
    if (activeElement) {
      activeElement.classList.remove('highlight-pulse');
    }
    activeElement = element;
    if (element) {
      element.classList.add('highlight-pulse');
    }

    const data = findMetadata(slug, idText);
    openInspector(data);
  }

  // Locate and inspect component from external buttons
  window.locateAndInspect = function (slug, idText, targetSheet) {
    if (targetSheet && currentSheet !== targetSheet) {
      switchSheet(targetSheet).then(() => {
        highlightAndOpen(slug, idText);
      });
    } else {
      highlightAndOpen(slug, idText);
    }
  };

  function highlightAndOpen(slug, idText) {
    const data = findMetadata(slug, idText);
    const target = document.getElementById('diagram-svg-target');
    if (target) {
      const node = target.querySelector(`[data-id="${idText}"]`) || target.querySelector(`[data-slug="${slug}"]`);
      if (node) {
        if (activeElement) activeElement.classList.remove('highlight-pulse');
        activeElement = node;
        node.classList.add('highlight-pulse');
      }
    }

    const container = document.getElementById('diagram-viewport-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    openInspector(data);
  }

  // Find metadata from catalog or create fallback
  function findMetadata(slug, text) {
    const lowerSlug = (slug || '').toLowerCase().trim();
    const lowerText = (text || '').toLowerCase().trim();

    if (threatModelCatalog[lowerSlug]) return threatModelCatalog[lowerSlug];
    if (threatModelCatalog[lowerText]) return threatModelCatalog[lowerText];

    for (const key in threatModelCatalog) {
      const item = threatModelCatalog[key];
      if (item.id && (item.id.toLowerCase() === lowerText || item.id.toLowerCase() === lowerSlug)) {
        return item;
      }
      if (item.name && item.name.toLowerCase().includes(lowerText)) {
        return item;
      }
    }

    return {
      id: text.slice(0, 8),
      name: text.slice(0, 40),
      category: "Architecture Component",
      priority: "HIGH",
      level: 1,
      origin: "In-Scope AI System Boundary",
      motive: "Component workload execution and reasoning",
      stride: "Spoofing, Tampering, Elevation of Privilege",
      overview: `Detailed technical specification for "${text}". Click on Threat Actors (TA01–TA07), Attack Vectors (AV01–AV32), or Controls (C01–C30) for full hardening policies.`,
      attackVectors: ["Exploitation of prompt injection boundaries", "Privilege escalation via tool schema tampering"],
      yaml: `# Baseline Security Policy for ${text}\napiVersion: security.promptinjection.io/v1\nkind: ComponentGuardrail\nmetadata:\n  name: baseline-protection\nspec:\n  enforceDelimiterIsolation: true\n  maxTokenVariance: 0.12`,
      kyverno: `# NeMo Guardrail flow for ${text}\ndefine flow guard_${lowerSlug || 'component'}\n  user prompt injection pattern\n  bot refuse request\n  stop`,
      shell: `# Audit component health and telemetry\ncurl -s https://api.your-company.com/v1/health | jq .`,
      detection: `# OpenTelemetry Anomaly Rule\npattern_match:\n  vector_id: "${text}"\n  threshold: 0.85`,
      compliance: {
        owasp: "LLM01:2025 (Prompt Injection)",
        mitre: "AML.T0051 (Prompt Injection)",
        nist: "NIST AI RMF 1.0 (MEASURE 2.6)",
        iso: "ISO/IEC 42001:2023 § A.8"
      }
    };
  }

  // Open 6-Tab Slide-Over Inspector Drawer
  function openInspector(data) {
    currentDrawerData = data;
    const drawer = document.getElementById('inspectorDrawer');
    if (!drawer) return;

    // Badges
    const idBadge = document.getElementById('drawerIdBadge');
    const catBadge = document.getElementById('drawerCatBadge');
    const priBadge = document.getElementById('drawerPriorityBadge');
    const levelBadge = document.getElementById('drawerLevelBadge');
    const titleEl = document.getElementById('drawerTitle');

    if (idBadge) idBadge.textContent = data.id || 'NODE';
    if (catBadge) catBadge.textContent = data.category || 'Component';
    if (priBadge) priBadge.textContent = data.priority || 'HIGH';
    if (levelBadge) levelBadge.textContent = 'L' + (data.level !== undefined ? data.level : 1);
    if (titleEl) titleEl.textContent = data.name || 'Component';

    // Set default tab to overview
    switchDrawerTab('overview');

    // Open drawer
    drawer.classList.add('open');

    // Update URL hash
    if (data.id) {
      history.replaceState(null, '', '#' + data.id);
    }
  }

  window.closeInspector = function () {
    const drawer = document.getElementById('inspectorDrawer');
    if (drawer) drawer.classList.remove('open');
    if (activeElement) {
      activeElement.classList.remove('highlight-pulse');
      activeElement = null;
    }
  };

  // Switch Tab in Inspector Drawer
  window.switchDrawerTab = function (tabKey) {
    document.querySelectorAll('.drawer-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabKey);
    });

    const contentPane = document.getElementById('drawerContentPane');
    if (!contentPane || !currentDrawerData) return;

    const data = currentDrawerData;

    if (tabKey === 'overview') {
      contentPane.innerHTML = `
        <div style="margin-bottom: 1.25rem;">
          <h4 style="font-size: 0.82rem; font-weight: 700; color: #38bdf8; text-transform: uppercase; margin-bottom: 0.5rem;">Threat Overview &amp; Context</h4>
          <p style="white-space: pre-wrap; margin-bottom: 1rem;">${escapeHtml(data.overview || data.motive || '')}</p>
        </div>
        <div style="margin-bottom: 1.25rem;">
          <h4 style="font-size: 0.82rem; font-weight: 700; color: #f59e0b; text-transform: uppercase; margin-bottom: 0.5rem;">STRIDE AI Classification</h4>
          <span class="kube-badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.35); font-size: 0.8rem;">
            ${escapeHtml(data.stride || 'Tampering, Elevation of Privilege')}
          </span>
        </div>
        <div>
          <h4 style="font-size: 0.82rem; font-weight: 700; color: #ef4444; text-transform: uppercase; margin-bottom: 0.5rem;">Associated Attack Vectors</h4>
          <ul style="padding-left: 1.25rem; font-size: 0.84rem; line-height: 1.6;">
            ${(data.attackVectors || ['Direct Prompt Injection (AV01)', 'System Prompt Exfiltration']).map(v => `<li>${escapeHtml(v)}</li>`).join('')}
          </ul>
        </div>
      `;
    } else if (tabKey === 'yaml') {
      contentPane.innerHTML = `
        <h4 style="font-size: 0.82rem; font-weight: 700; color: #10b981; text-transform: uppercase; margin-bottom: 0.5rem;">Production Hardening Code</h4>
        <p style="font-size: 0.82rem; color: var(--tm-text-muted); margin-bottom: 0.5rem;">Production-ready Python / YAML defense policy for this component.</p>
        <pre class="drawer-code-block"><code>${escapeHtml(data.yaml || '# No hardening spec defined')}</code></pre>
        <button onclick="copyCode(this)" style="padding: 5px 10px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); cursor: pointer;">
          Copy Hardening Policy
        </button>
      `;
    } else if (tabKey === 'kyverno') {
      contentPane.innerHTML = `
        <h4 style="font-size: 0.82rem; font-weight: 700; color: #a855f7; text-transform: uppercase; margin-bottom: 0.5rem;">Policy-as-Code (NeMo / Llama-Guard / JSON Schema)</h4>
        <p style="font-size: 0.82rem; color: var(--tm-text-muted); margin-bottom: 0.5rem;">Declarative guardrail configuration and enforcement flow.</p>
        <pre class="drawer-code-block" style="color: #c084fc;"><code>${escapeHtml(data.kyverno || '# No policy-as-code spec')}</code></pre>
        <button onclick="copyCode(this)" style="padding: 5px 10px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); cursor: pointer;">
          Copy Guardrail Policy
        </button>
      `;
    } else if (tabKey === 'shell') {
      contentPane.innerHTML = `
        <h4 style="font-size: 0.82rem; font-weight: 700; color: #38bdf8; text-transform: uppercase; margin-bottom: 0.5rem;">Audit &amp; Penetration Testing (Shell / CLI)</h4>
        <p style="font-size: 0.82rem; color: var(--tm-text-muted); margin-bottom: 0.5rem;">Automated penetration testing commands to verify guardrail resilience.</p>
        <pre class="drawer-code-block" style="color: #67e8f9;"><code>${escapeHtml(data.shell || '# No audit script defined')}</code></pre>
        <button onclick="copyCode(this)" style="padding: 5px 10px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); cursor: pointer;">
          Copy CLI Command
        </button>
      `;
    } else if (tabKey === 'detection') {
      contentPane.innerHTML = `
        <h4 style="font-size: 0.82rem; font-weight: 700; color: #f43f5e; text-transform: uppercase; margin-bottom: 0.5rem;">Detection Rules &amp; Telemetry Signatures</h4>
        <p style="font-size: 0.82rem; color: var(--tm-text-muted); margin-bottom: 0.5rem;">OpenTelemetry, SIEM, and regex detection signatures.</p>
        <pre class="drawer-code-block" style="color: #fb7185;"><code>${escapeHtml(data.detection || '# No detection signature defined')}</code></pre>
        <button onclick="copyCode(this)" style="padding: 5px 10px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.3); cursor: pointer;">
          Copy Detection Rule
        </button>
      `;
    } else if (tabKey === 'compliance') {
      const comp = data.compliance || {};
      contentPane.innerHTML = `
        <h4 style="font-size: 0.82rem; font-weight: 700; color: #fbbf24; text-transform: uppercase; margin-bottom: 0.5rem;">Compliance &amp; Framework Alignment</h4>
        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.85rem;">
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--tm-border); padding: 10px 14px; border-radius: 8px;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #38bdf8; text-transform: uppercase;">OWASP GenAI Top 10</div>
            <div style="font-size: 0.86rem; font-weight: 600; color: var(--tm-text-head); margin-top: 2px;">${escapeHtml(comp.owasp || 'LLM01:2025 (Prompt Injection)')}</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--tm-border); padding: 10px 14px; border-radius: 8px;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #ef4444; text-transform: uppercase;">MITRE ATLAS™ Framework</div>
            <div style="font-size: 0.86rem; font-weight: 600; color: var(--tm-text-head); margin-top: 2px;">${escapeHtml(comp.mitre || 'AML.T0051 (Prompt Injection)')}</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--tm-border); padding: 10px 14px; border-radius: 8px;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #10b981; text-transform: uppercase;">NIST AI Risk Management Framework (AI RMF 1.0)</div>
            <div style="font-size: 0.86rem; font-weight: 600; color: var(--tm-text-head); margin-top: 2px;">${escapeHtml(comp.nist || 'GOVERN 1.2, MEASURE 2.6, MANAGE 2.4')}</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--tm-border); padding: 10px 14px; border-radius: 8px;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #a855f7; text-transform: uppercase;">ISO / IEC 42001:2023</div>
            <div style="font-size: 0.86rem; font-weight: 600; color: var(--tm-text-head); margin-top: 2px;">${escapeHtml(comp.iso || 'Clause 8.2 & Annex A.6')}</div>
          </div>
        </div>
      `;
    }
  };

  // Copy Deep Link
  window.copyDeepLink = function () {
    if (!currentDrawerData) return;
    const url = window.location.origin + window.location.pathname + '#' + currentDrawerData.id;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        const btn = document.getElementById('drawerCopyLinkBtn');
        if (btn) {
          const old = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => btn.textContent = old, 1800);
        }
      });
    }
  };

  window.copyCode = function (btn) {
    const pre = btn.previousElementSibling;
    if (!pre) return;
    const text = pre.innerText;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        const old = btn.textContent;
        btn.textContent = 'Copied to Clipboard!';
        setTimeout(() => btn.textContent = old, 1800);
      });
    }
  };

  // Pan & Zoom Implementation
  function initPanZoom() {
    const pane = document.getElementById('diagramScrollPane');
    const wrapper = document.getElementById('diagramScalableWrapper');
    if (!pane || !wrapper) return;

    pane.addEventListener('mousedown', (e) => {
      if (e.target.closest('.tm-node') || e.target.closest('button') || e.target.closest('input')) return;
      isDragging = true;
      pane.classList.add('grabbing');
      startX = e.pageX - pane.offsetLeft;
      startY = e.pageY - pane.offsetTop;
      scrollLeft = pane.scrollLeft;
      scrollTop = pane.scrollTop;
    });

    pane.addEventListener('mouseleave', () => {
      isDragging = false;
      pane.classList.remove('grabbing');
    });

    pane.addEventListener('mouseup', () => {
      isDragging = false;
      pane.classList.remove('grabbing');
    });

    pane.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - pane.offsetLeft;
      const y = e.pageY - pane.offsetTop;
      const walkX = (x - startX) * 1.5;
      const walkY = (y - startY) * 1.5;
      pane.scrollLeft = scrollLeft - walkX;
      pane.scrollTop = scrollTop - walkY;
    });

    // Mouse wheel zoom with Ctrl
    pane.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.1 : -0.1;
        adjustZoom(delta);
      }
    }, { passive: false });
  }

  window.adjustZoom = function (delta) {
    currentZoom = Math.min(Math.max(currentZoom + delta, 0.45), 2.2);
    applyZoom();
  };

  window.resetZoom = function () {
    currentZoom = 1.0;
    applyZoom();
    const pane = document.getElementById('diagramScrollPane');
    if (pane) {
      pane.scrollLeft = 0;
      pane.scrollTop = 0;
    }
  };

  function applyZoom() {
    const wrapper = document.getElementById('diagramScalableWrapper');
    const indicator = document.getElementById('zoomIndicator');
    if (wrapper) {
      wrapper.style.transform = `scale(${currentZoom})`;
    }
    if (indicator) {
      indicator.textContent = `${Math.round(currentZoom * 100)}%`;
    }
  }

  window.toggleFullscreen = function () {
    const container = document.getElementById('diagramViewportContainer');
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => console.warn(err));
    } else {
      document.exitFullscreen().catch(err => console.warn(err));
    }
  };

  // Search with Autocomplete
  function initSearch() {
    const input = document.getElementById('diagramSearchInput');
    const dropdown = document.getElementById('searchAutocompleteDropdown');
    const clearBtn = document.getElementById('searchClearBtn');
    if (!input || !dropdown) return;

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (clearBtn) clearBtn.style.display = q ? 'block' : 'none';
      if (!q) {
        dropdown.style.display = 'none';
        return;
      }

      const matches = [];
      for (const key in threatModelCatalog) {
        const item = threatModelCatalog[key];
        const matchScore = (item.id && item.id.toLowerCase().includes(q)) ||
                           (item.name && item.name.toLowerCase().includes(q)) ||
                           (item.category && item.category.toLowerCase().includes(q));
        if (matchScore) {
          matches.push(item);
          if (matches.length >= 8) break;
        }
      }

      if (matches.length === 0) {
        dropdown.innerHTML = `<div style="padding: 12px; font-size: 0.8rem; color: var(--tm-text-muted); text-align: center;">No matching components found for "${escapeHtml(q)}"</div>`;
        dropdown.style.display = 'block';
      } else {
        dropdown.innerHTML = matches.map(m => `
          <div class="autocomplete-item" onclick="locateAndInspect('${m.id.toLowerCase()}', '${escapeHtml(m.id)}'); clearSearch();">
            <span class="autocomplete-id">${escapeHtml(m.id)}</span>
            <span class="autocomplete-name">${escapeHtml(m.name)}</span>
            <span class="autocomplete-cat">${escapeHtml(m.category || '')}</span>
          </div>
        `).join('');
        dropdown.style.display = 'block';
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-wrapper')) {
        dropdown.style.display = 'none';
      }
    });
  }

  window.clearSearch = function () {
    const input = document.getElementById('diagramSearchInput');
    const dropdown = document.getElementById('searchAutocompleteDropdown');
    const clearBtn = document.getElementById('searchClearBtn');
    if (input) input.value = '';
    if (dropdown) dropdown.style.display = 'none';
    if (clearBtn) clearBtn.style.display = 'none';
  };

  // Depth Level Switcher
  window.setDepthLevel = function (level) {
    currentLevel = level;
    document.querySelectorAll('.depth-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.getAttribute('data-level'), 10) === level);
    });

    // In a multi-depth SVG, elements tagged data-level > currentLevel are dimmed
    const target = document.getElementById('diagram-svg-target');
    if (target) {
      const nodes = target.querySelectorAll('[data-level]');
      nodes.forEach(node => {
        const nodeLevel = parseInt(node.getAttribute('data-level') || '0', 10);
        node.style.opacity = nodeLevel <= currentLevel ? '1' : '0.25';
      });
    }
  };

  // Traffic Flow Overlay / Stepper
  window.setTrafficFlow = function (flowKey) {
    currentFlow = flowKey;
    const select = document.getElementById('flowSelect');
    if (select && select.value !== flowKey) select.value = flowKey;

    const stepperBox = document.getElementById('flowStepperFloating');
    if (!stepperBox) return;

    if (flowKey === 'off' || !flowPresets[flowKey]) {
      stepperBox.style.display = 'none';
      return;
    }

    const preset = flowPresets[flowKey];
    document.getElementById('flowStepperTitle').textContent = preset.title;
    document.getElementById('flowStepperDesc').textContent = preset.desc;
    document.getElementById('flowStepperSteps').innerHTML = preset.steps.map((s, idx) => `
      <span class="flow-step-pill ${idx === 0 ? 'active' : ''}">${escapeHtml(s)}</span>
    `).join('');

    stepperBox.style.display = 'block';

    // If flow is P1/P2/P3, highlight on sheet
    if (flowKey === 'p1' || flowKey === 'p2' || flowKey === 'p3') {
      if (currentSheet !== 'attack-chains') {
        switchSheet('attack-chains');
      }
    }
  };

  // Keyboard Navigation
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          e.target.blur();
          clearSearch();
        }
        return;
      }

      if (e.key === 'Escape') {
        closeInspector();
        clearSearch();
      } else if (e.key === '+' || e.key === '=') {
        adjustZoom(0.15);
      } else if (e.key === '-' || e.key === '_') {
        adjustZoom(-0.15);
      } else if (e.key === '0') {
        resetZoom();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === '/') {
        e.preventDefault();
        const input = document.getElementById('diagramSearchInput');
        if (input) input.focus();
      }
    });
  }

  // URL Hash Deep-linking
  function checkUrlHash() {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash) {
      setTimeout(() => {
        locateAndInspect(hash.toLowerCase(), hash);
      }, 350);
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
