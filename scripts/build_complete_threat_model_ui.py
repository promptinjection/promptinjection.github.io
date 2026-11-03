import json
import html
import os

with open('data/threat-model.json', 'r', encoding='utf-8') as f:
    catalog = json.load(f)

# Load all 10 SVGs
svg_sheets = {}
for s in catalog['sheets']:
    path = os.path.join('assets/threat-model', s['filename'])
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as sf:
            svg_sheets[s['id']] = sf.read()
    else:
        print(f"Warning: {path} not found")

print(f"Loaded {len(svg_sheets)} SVGs for bundling.")

# 1. Generate threat_model_snippet.html
html_parts = []
html_parts.append('''<!-- AI & Agentic Security Threat Model (All Frameworks) -->
<section id="threat-model" class="threat-model-section" aria-label="AI & Agentic Security Threat Model">
  <div class="tm-container">
    
    <!-- Hero Header -->
    <div class="tm-header">
      <div class="tm-header-top">
        <span class="tm-badge-pulse"><span class="pulse-dot"></span> AI/AGENTIC THREAT MODELING • REFERENCE SYSTEM</span>
        <span class="tm-edition-pill">EDITION 2026-11-03 • 30 SCENARIOS • 222 TECHNIQUES</span>
      </div>
      <h2 class="tm-title">Untrusted content → autonomous decision → privileged tool</h2>
      <p class="tm-subtitle">
        Reference agent architecture reading emails &amp; RAG documents, making autonomous reasoning decisions, and invoking privileged CRM &amp; MCP tools.
        Crosswalked across <strong>CrowdStrike 2026 Taxonomy</strong>, <strong>OWASP LLM 2026</strong>, <strong>OWASP Agentic 2026</strong>, <strong>OWASP MCP Beta</strong>, <strong>MITRE ATLAS</strong>, <strong>NIST AI RMF</strong>, and <strong>CSA MAESTRO</strong>.
      </p>
      <div class="tm-quick-actions">
        <button class="tm-btn-primary" onclick="document.getElementById('tmThreatRegister').scrollIntoView({behavior:'smooth'})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Explore 30-Scenario Register
        </button>
        <button class="tm-btn-secondary" onclick="document.getElementById('tmControlsSection').scrollIntoView({behavior:'smooth'})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          10 Non-Negotiable Controls
        </button>
        <button class="tm-btn-secondary" onclick="document.getElementById('tmCrowdstrikeSection').scrollIntoView({behavior:'smooth'})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          222 CrowdStrike Techniques
        </button>
      </div>
    </div>

    <!-- Multi-Sheet Navigation Tabs -->
    <div class="tm-sheet-tabs-container">
      <div class="tm-sheet-tabs-scroll" id="sheetTabsScroll">
        <button class="tm-sheet-tab active" data-sheet-id="sheet_0" onclick="window.switchThreatModelSheet('sheet_0')">
          <span class="sheet-tab-num">00</span>
          <span class="sheet-tab-title">Reference System Architecture (TB0–TB3)</span>
        </button>
        <button class="tm-sheet-tab" data-sheet-id="sheet_9" onclick="window.switchThreatModelSheet('sheet_9')">
          <span class="sheet-tab-num">11</span>
          <span class="sheet-tab-title">6 Attack Paths &amp; Boundary Crossings</span>
        </button>
        <button class="tm-sheet-tab" data-sheet-id="sheet_8" onclick="window.switchThreatModelSheet('sheet_8')">
          <span class="sheet-tab-num">10</span>
          <span class="sheet-tab-title">Runtime Capability Enforcement (External PEP)</span>
        </button>
        <button class="tm-sheet-tab" data-sheet-id="sheet_1" onclick="window.switchThreatModelSheet('sheet_1')">
          <span class="sheet-tab-num">01</span>
          <span class="sheet-tab-title">Threat Modeling Workflow (Methods &amp; Sequence)</span>
        </button>
        <button class="tm-sheet-tab" data-sheet-id="sheet_2" onclick="window.switchThreatModelSheet('sheet_2')">
          <span class="sheet-tab-num">02</span>
          <span class="sheet-tab-title">Trust Boundaries &amp; Assets Decomposition</span>
        </button>
        <button class="tm-sheet-tab" data-sheet-id="sheet_4" onclick="window.switchThreatModelSheet('sheet_4')">
          <span class="sheet-tab-num">04</span>
          <span class="sheet-tab-title">OWASP LLM Top 10 (2026)</span>
        </button>
        <button class="tm-sheet-tab" data-sheet-id="sheet_5" onclick="window.switchThreatModelSheet('sheet_5')">
          <span class="sheet-tab-num">05</span>
          <span class="sheet-tab-title">OWASP Agentic Top 10 (2026)</span>
        </button>
        <button class="tm-sheet-tab" data-sheet-id="sheet_6" onclick="window.switchThreatModelSheet('sheet_6')">
          <span class="sheet-tab-num">06</span>
          <span class="sheet-tab-title">OWASP MCP Top 10 (2025 Beta)</span>
        </button>
        <button class="tm-sheet-tab" data-sheet-id="sheet_7" onclick="window.switchThreatModelSheet('sheet_7')">
          <span class="sheet-tab-num">07</span>
          <span class="sheet-tab-title">MITRE ATLAS Attack Pathways</span>
        </button>
        <button class="tm-sheet-tab" data-sheet-id="sheet_3" onclick="window.switchThreatModelSheet('sheet_3')">
          <span class="sheet-tab-num">03</span>
          <span class="sheet-tab-title">CrowdStrike Taxonomy → Paths</span>
        </button>
      </div>
    </div>

    <!-- Diagram Viewport & Interactive Canvas -->
    <div class="tm-viewport-card" id="tmViewportCard">
      <!-- Toolbar Controls -->
      <div class="tm-toolbar">
        <div class="tm-toolbar-left">
          <span class="tm-current-sheet-label" id="currentSheetLabel">Sheet 00 · Reference System Architecture (TB0–TB3)</span>
          <div class="tm-filter-pills" id="tmFlowFilterPills">
            <button class="tm-pill active" data-flow="all" onclick="window.filterThreatFlows('all')">All Paths</button>
            <button class="tm-pill" data-flow="injection" onclick="window.filterThreatFlows('injection')">T01–T10 Injection</button>
            <button class="tm-pill" data-flow="agency" onclick="window.filterThreatFlows('agency')">T11–T15 Agency/PII</button>
            <button class="tm-pill" data-flow="execution" onclick="window.filterThreatFlows('execution')">T16–T21 Supply Chain</button>
            <button class="tm-pill" data-flow="cascade" onclick="window.filterThreatFlows('cascade')">T22–T30 Cascade/Loop</button>
          </div>
        </div>

        <div class="tm-toolbar-right">
          <div class="tm-depth-selector">
            <span class="tm-control-label">Depth:</span>
            <button class="tm-depth-btn active" data-depth="L0" onclick="window.setDiagramDepth('L0')" title="L0: Enclaves">L0</button>
            <button class="tm-depth-btn" data-depth="L1" onclick="window.setDiagramDepth('L1')" title="L1: Component Flows">L1</button>
            <button class="tm-depth-btn" data-depth="L2" onclick="window.setDiagramDepth('L2')" title="L2: Threats">L2</button>
            <button class="tm-depth-btn" data-depth="L3" onclick="window.setDiagramDepth('L3')" title="L3: Full Techniques">L3</button>
          </div>

          <div class="tm-zoom-controls">
            <button class="tm-btn-icon" onclick="window.zoomThreatModel(0.2)" title="Zoom In (+)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </button>
            <button class="tm-btn-icon" onclick="window.zoomThreatModel(-0.2)" title="Zoom Out (-)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </button>
            <button class="tm-btn-icon" onclick="window.resetThreatModelZoom()" title="Reset Zoom (1:1)">
              <span style="font-size:11px;font-weight:700;">1:1</span>
            </button>
            <button class="tm-btn-icon" onclick="window.fitThreatModelToScreen()" title="Fit View">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
            </button>
            <button class="tm-btn-icon" onclick="window.toggleThreatModelFullscreen()" title="Toggle Fullscreen">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Canvas Container -->
      <div class="tm-canvas-wrapper" id="tmCanvasWrapper">
        <div class="tm-canvas" id="diagramCanvas">
          <div id="diagramSvgTarget">
''')

# Embed Sheet 0 SVG directly inside the viewport for instantaneous display
html_parts.append(svg_sheets.get('sheet_0', ''))

html_parts.append('''          </div>
        </div>

        <!-- Floating Interactive Legend -->
        <div class="tm-legend" id="tmLegend">
          <div class="tm-legend-title">TRUST BOUNDARIES</div>
          <div class="tm-legend-item" onclick="window.selectTrustBoundary('TB0')">
            <span class="tm-dot" style="background:#EFC85C;"></span>
            <span class="tm-legend-name">TB0 · Untrusted Origin</span>
          </div>
          <div class="tm-legend-item" onclick="window.selectTrustBoundary('TB1')">
            <span class="tm-dot" style="background:#27C5D9;"></span>
            <span class="tm-legend-name">TB1 · Ingestion / Data</span>
          </div>
          <div class="tm-legend-item" onclick="window.selectTrustBoundary('TB2')">
            <span class="tm-dot" style="background:#B8A3FF;"></span>
            <span class="tm-legend-name">TB2 · Agent Execution</span>
          </div>
          <div class="tm-legend-item" onclick="window.selectTrustBoundary('TB3')">
            <span class="tm-dot" style="background:#FE6577;"></span>
            <span class="tm-legend-name">TB3 · Privileged Effects</span>
          </div>
          <div class="tm-legend-item" onclick="window.selectThreatModelNode('n24')">
            <span class="tm-dot" style="background:#4AD49E;"></span>
            <span class="tm-legend-name">PEP/PDP · External Policy Gate</span>
          </div>
        </div>

        <!-- Hint Overlay -->
        <div class="tm-hint-overlay">
          <span>💡 Click any component, boundary, or threat card to open full 6-tab analysis drawer. Scroll / drag to pan.</span>
        </div>
      </div>

      <!-- Slide-Over Inspector Drawer (KubeDaily 6-Tab Style) -->
      <div class="tm-drawer" id="tmDrawer" aria-hidden="true">
        <div class="tm-drawer-header">
          <div class="tm-drawer-title-group">
            <div class="tm-drawer-badges">
              <span class="tm-badge-tb" id="drawerTbBadge">TB1 · INGESTION</span>
              <span class="tm-badge-type" id="drawerTypeBadge">Component</span>
              <span class="tm-badge-sev" id="drawerSevBadge" style="display:none;">CRITICAL</span>
            </div>
            <h3 class="tm-drawer-title" id="drawerTitle">Asset Title</h3>
          </div>
          <button class="tm-drawer-close" onclick="window.closeThreatModelDrawer()" aria-label="Close Inspector">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- 6 Tabs -->
        <div class="tm-drawer-tabs">
          <button class="tm-dtab active" data-tab="overview" onclick="window.switchDrawerTab('overview')">Overview</button>
          <button class="tm-dtab" data-tab="threats" onclick="window.switchDrawerTab('threats')">Threats (<span id="drawerThreatCount">0</span>)</button>
          <button class="tm-dtab" data-tab="mitigations" onclick="window.switchDrawerTab('mitigations')">Mitigations &amp; PEP</button>
          <button class="tm-dtab" data-tab="crosswalk" onclick="window.switchDrawerTab('crosswalk')">Frameworks</button>
          <button class="tm-dtab" data-tab="crowdstrike" onclick="window.switchDrawerTab('crowdstrike')">CrowdStrike</button>
          <button class="tm-dtab" data-tab="datapath" onclick="window.switchDrawerTab('datapath')">Data Path &amp; DFD</button>
        </div>

        <!-- Drawer Tab Body Panels -->
        <div class="tm-drawer-content" id="drawerContent">
          <!-- Populated dynamically by JS -->
        </div>
      </div>
    </div>

    <!-- 30-Threat Register Interactive Section -->
    <div class="tm-section-block" id="tmThreatRegister">
      <div class="tm-section-header">
        <div>
          <span class="tm-subhead">OFFICIAL THREAT REGISTER</span>
          <h3 class="tm-sec-title">30 Representative AI &amp; Agentic Threat Scenarios</h3>
          <p class="tm-sec-desc">Comprehensive matrix crosswalked with OWASP LLM 2026, OWASP Agentic 2026, OWASP MCP 2025 beta, STRIDE, and CrowdStrike taxonomy.</p>
        </div>
        <div class="tm-search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="threatSearchInput" placeholder="Search threats, IDs, mitigations, keywords..." onkeyup="window.searchThreatRegister(this.value)">
        </div>
      </div>

      <!-- Filters Bar -->
      <div class="tm-table-filters">
        <div class="tm-filter-group">
          <span class="tm-filter-lbl">Severity:</span>
          <button class="tm-filter-chip active" data-sev="all" onclick="window.filterThreatSeverity('all')">All (30)</button>
          <button class="tm-filter-chip chip-critical" data-sev="CRITICAL" onclick="window.filterThreatSeverity('CRITICAL')">Critical (7)</button>
          <button class="tm-filter-chip chip-high" data-sev="HIGH" onclick="window.filterThreatSeverity('HIGH')">High (20)</button>
          <button class="tm-filter-chip chip-medium" data-sev="MEDIUM" onclick="window.filterThreatSeverity('MEDIUM')">Medium (3)</button>
        </div>
        <div class="tm-filter-group">
          <span class="tm-filter-lbl">Trust Boundary:</span>
          <button class="tm-filter-chip active" data-tb="all" onclick="window.filterThreatTB('all')">All Boundaries</button>
          <button class="tm-filter-chip" data-tb="TB0" onclick="window.filterThreatTB('TB0')">TB0 Origin</button>
          <button class="tm-filter-chip" data-tb="TB1" onclick="window.filterThreatTB('TB1')">TB1 Ingestion</button>
          <button class="tm-filter-chip" data-tb="TB2" onclick="window.filterThreatTB('TB2')">TB2 Execution</button>
          <button class="tm-filter-chip" data-tb="TB3" onclick="window.filterThreatTB('TB3')">TB3 Privileged</button>
        </div>
      </div>

      <!-- Threat Table -->
      <div class="tm-table-container">
        <table class="tm-table" id="threatRegisterTable">
          <thead>
            <tr>
              <th style="width:70px;">ID</th>
              <th style="width:220px;">Threat Scenario</th>
              <th style="width:100px;">Severity</th>
              <th>Description &amp; Primary Mitigation</th>
              <th style="width:90px;">OWASP '26</th>
              <th style="width:90px;">Agentic '26</th>
              <th style="width:90px;">MCP Beta</th>
              <th style="width:130px;">STRIDE</th>
              <th style="width:80px;">Action</th>
            </tr>
          </thead>
          <tbody id="threatRegisterBody">
''')

# Populate Threat Table rows statically for SSR and SEO
for t in catalog['threats']:
    sev_class = f"badge-{t['severity'].lower()}"
    html_parts.append(f'''            <tr class="threat-row" data-id="{t['id']}" data-sev="{t['severity']}" data-tb="{t['trust_boundary']}" onclick="window.openThreatDetail('{t['id']}')">
              <td><span class="threat-id-pill">{t['id']}</span></td>
              <td><strong class="threat-name">{html.escape(t['name'])}</strong></td>
              <td><span class="threat-badge {sev_class}">{t['severity']}</span></td>
              <td>
                <div class="threat-desc-cell">{html.escape(t['description'])}</div>
                <div class="threat-mit-cell">🛡️ <em>{html.escape(t['primary_mitigation'])}</em></div>
              </td>
              <td><span class="tech-tag tag-llm">{t['owasp_llm_2026']}</span></td>
              <td><span class="tech-tag tag-agentic">{t['owasp_agentic_2026']}</span></td>
              <td><span class="tech-tag tag-mcp">{t['owasp_mcp_2025']}</span></td>
              <td><span class="stride-cell">{html.escape(t['stride'])}</span></td>
              <td><button class="tm-btn-inspect" onclick="event.stopPropagation(); window.openThreatDetail('{t['id']}')">Inspect</button></td>
            </tr>''')

html_parts.append('''          </tbody>
        </table>
      </div>
    </div>

    <!-- 6 Representative Attack Stories (Sheet 11) -->
    <div class="tm-section-block" id="tmAttackStoriesSection">
      <div class="tm-section-header">
        <div>
          <span class="tm-subhead">END-TO-END ATTACK STORIES</span>
          <h3 class="tm-sec-title">6 Representative Attacker Execution Paths</h3>
          <p class="tm-sec-desc">Traced directly from draw.io Sheet 11: entry mechanisms, trust boundary failures, impact outcomes, and blocking controls.</p>
        </div>
      </div>
      <div class="tm-attack-stories-grid">
''')

for s in catalog['attack_stories']:
    t_badges = ' '.join([f'<span class="threat-id-pill">{tid}</span>' for tid in s['threat_ids']])
    html_parts.append(f'''        <div class="tm-story-card">
          <div class="tm-story-header">
            <h4>{html.escape(s['title'])}</h4>
            <div class="story-threats">{t_badges}</div>
          </div>
          <div class="story-step-item">
            <span class="story-step-lbl lbl-entry">ENTRY</span>
            <div class="story-step-desc">{html.escape(s['entry'])}</div>
          </div>
          <div class="story-step-item">
            <span class="story-step-lbl lbl-fail">BOUNDARY FAILURE</span>
            <div class="story-step-desc">{html.escape(s['boundary_failure'])}</div>
          </div>
          <div class="story-step-item">
            <span class="story-step-lbl lbl-impact">IMPACT</span>
            <div class="story-step-desc">{html.escape(s['impact'])}</div>
          </div>
          <div class="story-step-item">
            <span class="story-step-lbl lbl-block">BLOCK AT</span>
            <div class="story-step-desc highlight-block">{html.escape(s['block_at'])}</div>
          </div>
        </div>''')

html_parts.append('''      </div>
    </div>

    <!-- 10 Non-Negotiable Controls Section -->
    <div class="tm-section-block" id="tmControlsSection">
      <div class="tm-section-header">
        <div>
          <span class="tm-subhead">ARCHITECTURAL INVARIANTS</span>
          <h3 class="tm-sec-title">10 Non-Negotiable Controls at Every Trust Boundary</h3>
          <p class="tm-sec-desc">Mandatory security controls required to safely run autonomous models reading untrusted content and calling privileged tools.</p>
        </div>
      </div>
      <div class="tm-controls-grid">
''')

for c in catalog['non_negotiable_controls']:
    html_parts.append(f'''        <div class="tm-control-card">
          <div class="tm-control-num">{c['id']}</div>
          <h4 class="tm-control-title">{html.escape(c['name'])}</h4>
          <p class="tm-control-summary">{html.escape(c['summary'])}</p>
          <div class="tm-control-impl">
            <span class="impl-tag">Enforcement:</span> {html.escape(c['implementation'])}
          </div>
        </div>''')

html_parts.append('''      </div>
    </div>

    <!-- CrowdStrike 222-Technique Crosswalk Section -->
    <div class="tm-section-block" id="tmCrowdstrikeSection">
      <div class="tm-section-header">
        <div>
          <span class="tm-subhead">PROMPT INJECTION TAXONOMY</span>
          <h3 class="tm-sec-title">CrowdStrike 222-Technique Crosswalk</h3>
          <p class="tm-sec-desc">Complete technique-level crosswalk from the 2026 CrowdStrike prompt injection taxonomy to OWASP, trust boundaries, and verification ideas.</p>
        </div>
        <div class="tm-search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="techniqueSearchInput" placeholder="Search 222 techniques, families, boundaries..." onkeyup="window.searchTechniques(this.value)">
        </div>
      </div>
      <div class="tm-techniques-container">
        <div class="tm-tech-summary-bar">
          <span>Showing <strong id="techCountShown">222</strong> of 222 classified injection techniques</span>
          <div class="tm-tech-family-pills" id="techFamilyPills">
            <button class="tm-pill active" onclick="window.filterTechniqueFamily('all')">All Families</button>
            <button class="tm-pill" onclick="window.filterTechniqueFamily('Direct')">Direct Injection</button>
            <button class="tm-pill" onclick="window.filterTechniqueFamily('Indirect')">Indirect Context</button>
            <button class="tm-pill" onclick="window.filterTechniqueFamily('Semantic')">Semantic</button>
            <button class="tm-pill" onclick="window.filterTechniqueFamily('Cognitive')">Cognitive</button>
            <button class="tm-pill" onclick="window.filterTechniqueFamily('Multimodal')">Multimodal</button>
          </div>
        </div>
        <div class="tm-tech-grid" id="techniquesGrid">
''')

# Populate top techniques
for t in catalog['crowdstrike_techniques'][:40]:
    html_parts.append(f'''          <div class="tm-tech-card" data-family="{html.escape(t['family'])}" data-id="{t['id']}">
            <div class="tm-tech-card-header">
              <span class="tech-id">{t['id']}</span>
              <span class="tech-tb">{t['trust_boundary']}</span>
            </div>
            <h5 class="tech-title">{html.escape(t['name'])}</h5>
            <div class="tech-path">{html.escape(t['full_path'])}</div>
            <div class="tech-idea"><strong>Control:</strong> {html.escape(t['test_control'])}</div>
            <div class="tech-mappings">
              <span class="badge-sub">{t['owasp_llm']}</span>
              <span class="badge-sub">{t['owasp_agentic']}</span>
              <span class="badge-sub">{t['owasp_mcp']}</span>
            </div>
          </div>''')

html_parts.append('''        </div>
      </div>
    </div>

    <!-- Framework Sources & Citations -->
    <div class="tm-section-block" id="tmFrameworksSection">
      <div class="tm-section-header">
        <div>
          <span class="tm-subhead">AUTHORITATIVE SOURCES</span>
          <h3 class="tm-sec-title">15 Industry Frameworks &amp; Standards</h3>
          <p class="tm-sec-desc">Official source specifications and guidance referenced in this threat model architecture.</p>
        </div>
      </div>
      <div class="tm-frameworks-grid">
''')

for f in catalog['frameworks']:
    html_parts.append(f'''        <a href="{html.escape(f['url'])}" target="_blank" rel="noopener noreferrer" class="tm-framework-card">
          <div class="tm-framework-name">{html.escape(f['name'])}</div>
          <div class="tm-framework-url">{html.escape(f['url'])}</div>
          <div class="tm-framework-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
          </div>
        </a>''')

html_parts.append('''      </div>
    </div>

  </div>
</section>
''')

snippet_content = ''.join(html_parts)
with open('scripts/threat_model_snippet.html', 'w', encoding='utf-8') as f:
    f.write(snippet_content)
print(f"Generated threat_model_snippet.html ({len(snippet_content)} bytes)")
