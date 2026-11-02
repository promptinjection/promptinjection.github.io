#!/usr/bin/env python3
"""
Build the self-contained, inlined Threat Model snippet & JavaScript bundle.
Eliminates all async fetch dependencies, CORS issues, and rendering delays.
"""

import os
import json

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(ROOT_DIR, "assets", "threat-model")
DATA_PATH = os.path.join(ROOT_DIR, "data", "threat-model.json")

def build_snippet():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        tm_data = json.load(f)

    # Read the 4 SVGs
    svg_map = {}
    for key, filename in [
        ('cluster', 'sheet1_master.svg'),
        ('attack-chains', 'sheet2_attack_chains.svg'),
        ('security-architecture', 'sheet3_defense_architecture.svg'),
        ('flow-analysis', 'sheet4_flow_analysis.svg')
    ]:
        with open(os.path.join(ASSETS_DIR, filename), "r", encoding="utf-8") as sf:
            svg_map[key] = sf.read().strip()

    sheet1_svg_inlined = svg_map['cluster']

    # Generate HTML snippet
    snippet_html = f"""<!-- ==========================================================================
     AI Threat Model & Attack Chains Reference Architecture
     Inspired by KubeDaily's threat-model engine
     ========================================================================== -->
<section class="threat-model-section" id="threat-model" aria-label="AI Threat Model Reference Architecture">
  <!-- Section Page Header -->
  <div class="kube-page-header">
    <div class="kube-page-header-content">
      <div class="kube-section-pill">Interactive Visual Architecture</div>
      <h2 class="kube-page-title">AI Threat Model &amp; Attack Chains</h2>
      <p class="kube-page-subtitle">
        An authoritative, interactive reference architecture and threat modeling engine for Large Language Models, Multi-Agent Systems, and Prompt Injection Defense. Inspect trust boundaries, threat actors, threat objects, attack vectors, and production hardening policies with real-time deep-linking, multi-layer abstraction depth, traffic flow overlays, and production-tested Python, NeMo Guardrails, Llama-Guard, and MITRE ATLAS compliance inspectors.
      </p>

      <!-- Stats Bar -->
      <div class="kube-stats-grid">
        <div class="kube-stat-card">
          <div class="kube-stat-value">4</div>
          <div class="kube-stat-label">Diagram Sheets</div>
        </div>
        <div class="kube-stat-card">
          <div class="kube-stat-value">L0–L3</div>
          <div class="kube-stat-label">Depth Levels</div>
        </div>
        <div class="kube-stat-card">
          <div class="kube-stat-value">TA01–07</div>
          <div class="kube-stat-label">Threat Actors</div>
        </div>
        <div class="kube-stat-card">
          <div class="kube-stat-value">TO01–32</div>
          <div class="kube-stat-label">Threat Objects</div>
        </div>
        <div class="kube-stat-card">
          <div class="kube-stat-value">AV01–32</div>
          <div class="kube-stat-label">Attack Vectors</div>
        </div>
        <div class="kube-stat-card">
          <div class="kube-stat-value">C01–30</div>
          <div class="kube-stat-label">Controls</div>
        </div>
        <div class="kube-stat-card">
          <div class="kube-stat-value">P1–P6</div>
          <div class="kube-stat-label">Attack Chains</div>
        </div>
      </div>
    </div>
  </div>

  <div class="threat-model-page-container">
    <!-- Interactive Viewport Toolbar -->
    <div class="threat-model-toolbar">
      <!-- Top Row: Sheets, Search & View Controls -->
      <div class="toolbar-row-top">
        <!-- Sheet Switcher Tabs (4 Sheets) -->
        <div class="sheet-switcher-group" role="tablist">
          <button id="btn-sheet-cluster" class="sheet-tab-btn active" data-sheet="cluster" onclick="switchSheet('cluster')">
            <span class="sheet-dot" style="background: #22c55e;"></span>
            01 &middot; Master Threat Register
          </button>
          <button id="btn-sheet-attack-chains" class="sheet-tab-btn" data-sheet="attack-chains" onclick="switchSheet('attack-chains')">
            <span class="sheet-dot" style="background: #ef4444;"></span>
            02 &middot; Attack Chains &amp; Narratives
          </button>
          <button id="btn-sheet-security-architecture" class="sheet-tab-btn" data-sheet="security-architecture" onclick="switchSheet('security-architecture')">
            <span class="sheet-dot" style="background: #3b82f6;"></span>
            03 &middot; Layered Reference Architecture
          </button>
          <button id="btn-sheet-flow-analysis" class="sheet-tab-btn" data-sheet="flow-analysis" onclick="switchSheet('flow-analysis')">
            <span class="sheet-dot" style="background: #a855f7;"></span>
            04 &middot; Packet &amp; Flow Analysis
          </button>
        </div>

        <!-- Live Search Box with Autocomplete Dropdown -->
        <div class="search-wrapper">
          <input id="diagramSearchInput" class="search-input" type="text" placeholder="Search (e.g. TA01, RAG, P1, C01, Tool)..." autocomplete="off" aria-label="Search architecture components">
          <button id="searchClearBtn" class="search-clear-btn" onclick="clearSearch()" style="display: none;" aria-label="Clear search">&times;</button>
          <div id="searchAutocompleteDropdown" class="autocomplete-dropdown"></div>
        </div>

        <!-- Zoom & Viewport Controls -->
        <div class="viewport-btns-group">
          <button onclick="adjustZoom(-0.15)" class="vp-btn" title="Zoom Out (-)">−</button>
          <span id="zoomIndicator" class="zoom-indicator-text">100%</span>
          <button onclick="adjustZoom(0.15)" class="vp-btn" title="Zoom In (+)">+</button>
          <button onclick="resetZoom()" class="vp-btn" title="Reset View (0)">Reset</button>
          <button onclick="toggleFullscreen()" class="vp-btn" title="Toggle Fullscreen (F)">⛶</button>
        </div>
      </div>

      <!-- Bottom Row: Multi-layer Abstraction Depth & Traffic Flow Simulator -->
      <div class="toolbar-row-bottom">
        <div class="depth-selector-group">
          <span class="depth-label">Depth Level:</span>
          <button class="depth-btn active" data-level="0" onclick="setDepthLevel(0)">L0 System</button>
          <button class="depth-btn" data-level="1" onclick="setDepthLevel(1)">L1 Component</button>
          <button class="depth-btn" data-level="2" onclick="setDepthLevel(2)">L2 Implementation</button>
          <button class="depth-btn" data-level="3" onclick="setDepthLevel(3)">L3 Deep Forensics</button>
        </div>

        <div class="flow-selector-group">
          <span class="depth-label">Traffic Overlay:</span>
          <select id="flowSelect" class="flow-select" onchange="setTrafficFlow(this.value)" aria-label="Select Traffic Overlay">
            <option value="off">Flow Overlay: Off</option>
            <option value="p1">P1 &middot; Direct Prompt Injection Exfiltration</option>
            <option value="p2">P2 &middot; Indirect RAG Document Poisoning</option>
            <option value="p3">P3 &middot; Autonomous Tool SSRF &amp; Cloud Keys</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Scalable Diagram Canvas Viewport -->
    <div class="diagram-viewport-container" id="diagramViewportContainer">
      <!-- Floating Traffic Flow Stepper -->
      <div class="flow-stepper-floating" id="flowStepperFloating">
        <div class="flow-stepper-header">
          <span class="flow-stepper-title" id="flowStepperTitle">Active Flow</span>
          <button class="flow-stepper-close" onclick="setTrafficFlow('off')">✕ Close</button>
        </div>
        <p class="flow-stepper-desc" id="flowStepperDesc"></p>
        <div class="flow-stepper-steps-row" id="flowStepperSteps"></div>
      </div>

      <!-- Scalable Pan/Zoom Canvas Pane -->
      <div class="diagram-scroll-pane" id="diagramScrollPane">
        <div class="diagram-scalable-wrapper" id="diagramScalableWrapper">
          <div class="diagram-svg-target" id="diagramSvgTarget">
            {sheet1_svg_inlined}
          </div>
        </div>
      </div>

      <!-- Native 6-Tab Slide-Over Inspector Drawer -->
      <div class="inspector-drawer" id="inspectorDrawer" role="dialog" aria-modal="true" aria-label="Component Inspector">
        <!-- Drawer Header -->
        <div class="drawer-header">
          <div>
            <div class="drawer-badges-row">
              <span id="drawerIdBadge" class="kube-badge badge-id">ID</span>
              <span id="drawerCatBadge" class="kube-badge badge-cat">Category</span>
              <span id="drawerPriorityBadge" class="kube-badge badge-priority">Priority</span>
              <span id="drawerLevelBadge" class="kube-badge badge-level">Level</span>
            </div>
            <h3 id="drawerTitle" class="drawer-title">Component Name</h3>
          </div>
          <div class="drawer-action-btns">
            <button id="drawerCopyLinkBtn" class="drawer-copy-btn" onclick="copyDeepLink()" title="Copy Deep Link to Component">
              🔗 Link
            </button>
            <button class="drawer-close-btn" onclick="closeInspector()" title="Close Drawer (Esc)">
              &times;
            </button>
          </div>
        </div>

        <!-- Drawer Tabs (6 Technical Tabs) -->
        <div class="drawer-tabs-nav" role="tablist">
          <button class="drawer-tab-btn active" data-tab="overview" onclick="switchDrawerTab('overview')">
            📘 Overview
          </button>
          <button class="drawer-tab-btn" data-tab="yaml" onclick="switchDrawerTab('yaml')">
            🛡️ Hardening (Code)
          </button>
          <button class="drawer-tab-btn" data-tab="kyverno" onclick="switchDrawerTab('kyverno')">
            ⚡ Policy-as-Code
          </button>
          <button class="drawer-tab-btn" data-tab="shell" onclick="switchDrawerTab('shell')">
            🔍 Audit (CLI)
          </button>
          <button class="drawer-tab-btn" data-tab="detection" onclick="switchDrawerTab('detection')">
            🚨 Detection
          </button>
          <button class="drawer-tab-btn" data-tab="compliance" onclick="switchDrawerTab('compliance')">
            📋 Compliance
          </button>
        </div>

        <!-- Drawer Content Pane -->
        <div class="drawer-content-pane" id="drawerContentPane"></div>
      </div>
    </div>

    <!-- Below-Canvas Comprehensive Architecture & Exploit Catalog -->
    <div class="threat-model-catalog-section">

      <!-- 4 Diagram Sheets Architecture Guide -->
      <div class="catalog-section-header">
        <h3 class="catalog-title">4 Diagram Sheets Architecture Guide</h3>
        <p class="catalog-desc">A modular reference framework detailing how Large Language Models and Autonomous Agents process prompts, execute tools, and persist state.</p>
      </div>

      <div class="catalog-grid-cards">
        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill" style="background:rgba(34, 197, 94, 0.15); color:#22c55e; border-color:rgba(34, 197, 94, 0.35);">SHEET 01</span>
            <span class="kube-badge badge-level">System Boundary</span>
          </div>
          <h4 class="chain-card-title">Master Threat Register &amp; Cluster Overview</h4>
          <p class="chain-card-body">Holistic mapping of User Ingress, Gateway Guardrails, Context Attention Windows, Tool Runtimes, and Vector Memory across 4 core trust boundaries.</p>
          <button class="chain-action-btn" onclick="switchSheet('cluster')">Open Sheet 01 &rarr;</button>
        </div>

        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill">SHEET 02</span>
            <span class="kube-badge badge-priority">Exploit Paths</span>
          </div>
          <h4 class="chain-card-title">Attack Chains &amp; Mitigation Narratives (P1–P6)</h4>
          <p class="chain-card-body">Step-by-step exploit trajectories detailing how adversaries bypass guardrails, poison RAG indices, and compromise internal infrastructure via tool invocation.</p>
          <button class="chain-action-btn" onclick="switchSheet('attack-chains')">Open Sheet 02 &rarr;</button>
        </div>

        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill" style="background:rgba(59, 130, 246, 0.15); color:#3b82f6; border-color:rgba(59, 130, 246, 0.35);">SHEET 03</span>
            <span class="kube-badge badge-id">Defense in Depth</span>
          </div>
          <h4 class="chain-card-title">Layered AI Defense Reference Architecture</h4>
          <p class="chain-card-body">Concentric protection stack encompassing Token Filtering, Nonce Isolation, Self-Reflection Monitoring, Tool Sandboxing, and Canary Token Honeytraps.</p>
          <button class="chain-action-btn" onclick="switchSheet('security-architecture')">Open Sheet 03 &rarr;</button>
        </div>

        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill" style="background:rgba(168, 85, 247, 0.15); color:#a855f7; border-color:rgba(168, 85, 247, 0.35);">SHEET 04</span>
            <span class="kube-badge badge-level">Packet Checkpoints</span>
          </div>
          <h4 class="chain-card-title">Prompt &amp; Data Flow Packet Analysis</h4>
          <p class="chain-card-body">Deep packet inspection tracking prompt progression through Tokenization, Pre-Inference Guardrails, Attention Synthesis, Tool Execution, and Egress Redaction.</p>
          <button class="chain-action-btn" onclick="switchSheet('flow-analysis')">Open Sheet 04 &rarr;</button>
        </div>
      </div>

      <!-- Attack Chains Catalog (P1–P6) -->
      <div class="catalog-section-header">
        <h3 class="catalog-title">Attack Chains &amp; Exploit Narratives (P1–P6)</h3>
        <p class="catalog-desc">Realistic multi-stage attack scenarios demonstrating how prompt injection enables remote code execution, lateral movement, and data exfiltration.</p>
      </div>

      <div class="catalog-grid-cards">
        <!-- P1 -->
        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill">P1</span>
            <span class="kube-badge badge-priority">CRITICAL</span>
          </div>
          <h4 class="chain-card-title">Direct Jailbreak to System Directive Exfiltration</h4>
          <p class="chain-card-body">Adversary crafts a multi-turn role-reversal payload. Guardrail lacks semantic boundary detection, allowing the model to echo confidential financial system directives containing API keys.</p>
          <button class="chain-action-btn" onclick="locateAndInspect('p1', 'P1', 'attack-chains')">Highlight on Diagram &rarr;</button>
        </div>

        <!-- P2 -->
        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill">P2</span>
            <span class="kube-badge badge-priority">CRITICAL</span>
          </div>
          <h4 class="chain-card-title">Indirect RAG Document Poisoning</h4>
          <p class="chain-card-body">Attacker embeds invisible prompt injection inside a PDF resume. When the HR agent ingests the chunk via vector search, the payload overrides scoring rules and dispatches an unauthorized offer.</p>
          <button class="chain-action-btn" onclick="locateAndInspect('p2', 'P2', 'attack-chains')">Highlight on Diagram &rarr;</button>
        </div>

        <!-- P3 -->
        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill">P3</span>
            <span class="kube-badge badge-priority">CRITICAL</span>
          </div>
          <h4 class="chain-card-title">Tool Call Schema Hijack to Internal SSRF</h4>
          <p class="chain-card-body">Attacker coerces an agent's web browsing tool into querying AWS instance metadata (169.254.169.254), harvesting IAM temporary STS security tokens to compromise cloud accounts.</p>
          <button class="chain-action-btn" onclick="locateAndInspect('p3', 'P3', 'attack-chains')">Highlight on Diagram &rarr;</button>
        </div>

        <!-- P4 -->
        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill" style="background:rgba(245, 158, 11, 0.15); color:#f59e0b; border-color:rgba(245, 158, 11, 0.35);">P4</span>
            <span class="kube-badge badge-priority" style="background:rgba(245, 158, 11, 0.15); color:#f59e0b; border-color:rgba(245, 158, 11, 0.35);">HIGH</span>
          </div>
          <h4 class="chain-card-title">Gradual Multi-Turn Alignment Erosion</h4>
          <p class="chain-card-body">Across 10 conversational turns, attacker slowly introduces academic paradoxes and fictional framing to dissolve refusal gradients without triggering single-turn heuristics.</p>
          <button class="chain-action-btn" onclick="locateAndInspect('p4', 'P4', 'attack-chains')">Highlight on Diagram &rarr;</button>
        </div>

        <!-- P5 -->
        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill">P5</span>
            <span class="kube-badge badge-priority">CRITICAL</span>
          </div>
          <h4 class="chain-card-title">Long-Term Memory Seeding &amp; Persistence</h4>
          <p class="chain-card-body">Attacker instructs agent to save an operational guideline into shared vector memory. In future sessions by other team members, the agent recalls the backdoor and leaks drafts.</p>
          <button class="chain-action-btn" onclick="locateAndInspect('p5', 'P5', 'attack-chains')">Highlight on Diagram &rarr;</button>
        </div>

        <!-- P6 -->
        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill">P6</span>
            <span class="kube-badge badge-priority">CRITICAL</span>
          </div>
          <h4 class="chain-card-title">Inter-Agent Lateral Movement &amp; Privilege Escalation</h4>
          <p class="chain-card-body">In a multi-agent system, an untrusted user inputs a payload to a low-privileged Triage Agent, which forwards the raw text to an Admin Execution Agent, elevating privileges.</p>
          <button class="chain-action-btn" onclick="locateAndInspect('p6', 'P6', 'attack-chains')">Highlight on Diagram &rarr;</button>
        </div>
      </div>

      <!-- AI Trust Boundaries (4 Envelopes) -->
      <div class="catalog-section-header">
        <h3 class="catalog-title">AI Trust Boundaries (4 Envelopes)</h3>
        <p class="catalog-desc">Core architectural perimeters defining security barriers between untrusted caller tokens, attention spaces, execution runtimes, and persistent datastores.</p>
      </div>

      <div class="catalog-grid-cards">
        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill" style="background:rgba(56, 189, 248, 0.15); color:#38bdf8; border-color:rgba(56, 189, 248, 0.35);">TB01</span>
            <span class="kube-badge badge-id">Ingress Boundary</span>
          </div>
          <h4 class="chain-card-title">Untrusted Ingress Envelope</h4>
          <p class="chain-card-body">Separates unauthenticated web requests, user prompt payloads, incoming emails, and third-party documents from the internal AI execution context.</p>
        </div>

        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill" style="background:rgba(59, 130, 246, 0.15); color:#3b82f6; border-color:rgba(59, 130, 246, 0.35);">TB02</span>
            <span class="kube-badge badge-id">Attention Boundary</span>
          </div>
          <h4 class="chain-card-title">Context &amp; Attention Window Envelope</h4>
          <p class="chain-card-body">Guards the Transformer attention matrix, isolating privileged developer system instructions from untrusted user tokens and retrieved RAG context.</p>
        </div>

        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill" style="background:rgba(225, 29, 72, 0.15); color:#fb7185; border-color:rgba(225, 29, 72, 0.35);">TB03</span>
            <span class="kube-badge badge-priority">Execution Boundary</span>
          </div>
          <h4 class="chain-card-title">Tool &amp; Execution Runtime Envelope</h4>
          <p class="chain-card-body">Separates stochastic generative reasoning from deterministic code execution, Model Context Protocol (MCP) servers, databases, and network sockets.</p>
        </div>

        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill" style="background:rgba(139, 92, 246, 0.15); color:#c084fc; border-color:rgba(139, 92, 246, 0.35);">TB04</span>
            <span class="kube-badge badge-level">Storage Boundary</span>
          </div>
          <h4 class="chain-card-title">Persistence &amp; Memory Envelope</h4>
          <p class="chain-card-body">Encloses persistent vector databases (Pinecone, Chroma), long-term cross-session memory scratchpads, and cryptographic audit telemetry.</p>
        </div>
      </div>

      <!-- Threat Actors Catalog (TA01–TA07) -->
      <div class="catalog-section-header">
        <h3 class="catalog-title">Threat Actors Catalog (TA01–TA07)</h3>
        <p class="catalog-desc">Profiles of adversarial entities targeting Large Language Models and autonomous agent pipelines.</p>
      </div>

      <div class="catalog-grid-cards">
        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill">TA01</span>
            <span class="kube-badge badge-priority">External</span>
          </div>
          <h4 class="chain-card-title">Remote Adversarial Prompter</h4>
          <p class="chain-card-body">Direct jailbreaker using DAN personas, instruction overrides, and token padding to exfiltrate system directives and bypass safety filters.</p>
          <button class="chain-action-btn" onclick="locateAndInspect('ta01', 'TA01', 'cluster')">Inspect TA01 &rarr;</button>
        </div>

        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill">TA02</span>
            <span class="kube-badge badge-priority">Indirect</span>
          </div>
          <h4 class="chain-card-title">Malicious Content Author (Indirect RAG)</h4>
          <p class="chain-card-body">Injects hidden instructions into public web pages, PDFs, and reviews that are ingested by automated RAG crawlers.</p>
          <button class="chain-action-btn" onclick="locateAndInspect('ta02', 'TA02', 'cluster')">Inspect TA02 &rarr;</button>
        </div>

        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill">TA03</span>
            <span class="kube-badge badge-priority">Ecosystem</span>
          </div>
          <h4 class="chain-card-title">Rogue Tool &amp; MCP Plugin Developer</h4>
          <p class="chain-card-body">Publishes poisoned tool schemas or MCP plugins that extract conversation context, hijack execution, or trigger internal SSRF.</p>
          <button class="chain-action-btn" onclick="locateAndInspect('ta03', 'TA03', 'cluster')">Inspect TA03 &rarr;</button>
        </div>

        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill">TA04</span>
            <span class="kube-badge badge-priority">Tenant</span>
          </div>
          <h4 class="chain-card-title">Compromised Multi-Tenant Caller</h4>
          <p class="chain-card-body">Legitimate authenticated user attempting to probe cross-tenant vector namespaces, cached prompt embeddings, or session histories.</p>
          <button class="chain-action-btn" onclick="locateAndInspect('ta04', 'TA04', 'cluster')">Inspect TA04 &rarr;</button>
        </div>

        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill" style="background:rgba(245, 158, 11, 0.15); color:#f59e0b; border-color:rgba(245, 158, 11, 0.35);">TA05</span>
            <span class="kube-badge badge-level">Algorithmic</span>
          </div>
          <h4 class="chain-card-title">Runaway Autonomous Agent Loop</h4>
          <p class="chain-card-body">Recursive subtask expansion and unconstrained retry loops causing severe quota depletion and execution resource starvation.</p>
          <button class="chain-action-btn" onclick="locateAndInspect('ta05', 'TA05', 'cluster')">Inspect TA05 &rarr;</button>
        </div>

        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill">TA06</span>
            <span class="kube-badge badge-priority">Insider</span>
          </div>
          <h4 class="chain-card-title">Malicious Insider / Cloud Operator</h4>
          <p class="chain-card-body">Internal operator with cluster access modifying developer prompts, disabling guardrails, or exfiltrating unredacted completion logs.</p>
          <button class="chain-action-btn" onclick="locateAndInspect('ta06', 'TA06', 'cluster')">Inspect TA06 &rarr;</button>
        </div>
      </div>

      <!-- STRIDE Threat Modeling Taxonomy for LLMs -->
      <div class="catalog-section-header">
        <h3 class="catalog-title">STRIDE Threat Modeling Taxonomy for AI &amp; LLMs</h3>
        <p class="catalog-desc">Adapting Microsoft STRIDE security methodology for Generative AI architectures.</p>
      </div>

      <div class="catalog-grid-cards">
        <div class="chain-narrative-card">
          <h4 class="chain-card-title" style="color:#38bdf8;">S &middot; Spoofing (Agent &amp; User Identity)</h4>
          <p class="chain-card-body">Adversary impersonates an orchestrator agent or supervisory administrator to bypass tool permission checks and authorize restricted actions.</p>
        </div>
        <div class="chain-narrative-card">
          <h4 class="chain-card-title" style="color:#ef4444;">T &middot; Tampering (Context &amp; Vector Ingestion)</h4>
          <p class="chain-card-body">Direct and indirect prompt injection altering system instructions, poisoning RAG embeddings, or tampering with tool arguments.</p>
        </div>
        <div class="chain-narrative-card">
          <h4 class="chain-card-title" style="color:#f59e0b;">R &middot; Repudiation (Unlogged Autonomous Actions)</h4>
          <p class="chain-card-body">Agent executing sensitive database writes or outbound network calls without immutable cryptographic telemetry or non-repudiation audit trails.</p>
        </div>
        <div class="chain-narrative-card">
          <h4 class="chain-card-title" style="color:#a855f7;">I &middot; Information Disclosure (System Directive Leakage)</h4>
          <p class="chain-card-body">Exfiltration of proprietary system prompts, internal database credentials, user PII, or internal network topology via completion streaming.</p>
        </div>
        <div class="chain-narrative-card">
          <h4 class="chain-card-title" style="color:#10b981;">D &middot; Denial of Service (Attention Flooding)</h4>
          <p class="chain-card-body">Padding prompts with quadratic attention bombs, infinite recursive sub-agent task loops, or overwhelming tokenizer boundaries.</p>
        </div>
        <div class="chain-narrative-card">
          <h4 class="chain-card-title" style="color:#fb7185;">E &middot; Elevation of Privilege (Tool Scope Breakout)</h4>
          <p class="chain-card-body">Escalating from unprivileged conversational chat to arbitrary bash execution, database root modification, or cloud metadata SSRF.</p>
        </div>
      </div>

      <!-- Production Hardening Controls & Detection Probes -->
      <div class="catalog-section-header">
        <h3 class="catalog-title">Production Hardening Controls &amp; Detection Probes (C01–C08)</h3>
        <p class="catalog-desc">Defense-in-depth security policies engineered for enterprise LLMs and autonomous agents.</p>
      </div>

      <div class="catalog-grid-cards">
        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill" style="background:rgba(16, 185, 129, 0.15); color:#10b981; border-color:rgba(16, 185, 129, 0.35);">C01</span>
            <span class="kube-badge badge-level">Layer 2: Prompt Framing</span>
          </div>
          <h4 class="chain-card-title">Cryptographic Nonce &amp; XML Delimiters</h4>
          <p class="chain-card-body">Encapsulate user input in cryptographic random nonces and XML tags so attention heads reliably isolate instructions from untrusted data.</p>
          <button class="chain-action-btn" onclick="locateAndInspect('c01', 'C01', 'security-architecture')">Inspect Control C01 &rarr;</button>
        </div>

        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill" style="background:rgba(16, 185, 129, 0.15); color:#10b981; border-color:rgba(16, 185, 129, 0.35);">C02</span>
            <span class="kube-badge badge-level">Layer 1: Gateway Ingress</span>
          </div>
          <h4 class="chain-card-title">Llama-Guard / NeMo Pre-Inference Classifier</h4>
          <p class="chain-card-body">Dedicated low-latency edge classifier evaluating prompt injection risk and refusal policies in &lt; 25ms prior to calling frontier LLMs.</p>
          <button class="chain-action-btn" onclick="locateAndInspect('c02', 'C02', 'security-architecture')">Inspect Control C02 &rarr;</button>
        </div>

        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill" style="background:rgba(16, 185, 129, 0.15); color:#10b981; border-color:rgba(16, 185, 129, 0.35);">C03</span>
            <span class="kube-badge badge-level">Layer 4: RAG Pipeline</span>
          </div>
          <h4 class="chain-card-title">RAG Chunk Sanitization &amp; Tag Stripping</h4>
          <p class="chain-card-body">Pre-processing filter stripping HTML comments, zero-font strings, and system directive markers from vector search chunks.</p>
          <button class="chain-action-btn" onclick="locateAndInspect('c03', 'C03', 'security-architecture')">Inspect Control C03 &rarr;</button>
        </div>

        <div class="chain-narrative-card">
          <div class="chain-card-top">
            <span class="chain-id-pill" style="background:rgba(16, 185, 129, 0.15); color:#10b981; border-color:rgba(16, 185, 129, 0.35);">C04</span>
            <span class="kube-badge badge-level">Layer 5: Tool Sandbox</span>
          </div>
          <h4 class="chain-card-title">Sandboxed MicroVMs &amp; Egress NetPol</h4>
          <p class="chain-card-body">Isolated container runtimes executing tools with blocked cloud metadata IPs (169.254.169.254) and read-only root filesystems.</p>
          <button class="chain-action-btn" onclick="locateAndInspect('c04', 'C04', 'security-architecture')">Inspect Control C04 &rarr;</button>
        </div>
      </div>

      <!-- 1-Click Production Security Bundles -->
      <div class="catalog-section-header">
        <h3 class="catalog-title">1-Click Production Security Bundles &amp; Artifacts</h3>
        <p class="catalog-desc">Downloadable reference architecture specifications and structured JSON datasets.</p>
      </div>

      <div class="catalog-grid-cards">
        <div class="chain-narrative-card">
          <h4 class="chain-card-title">Export Threat Model Specification (JSON)</h4>
          <p class="chain-card-body">Complete machine-readable JSON dataset mapping all 32 attack vectors, 30 controls, and 7 threat actors for automated CI/CD security scanning.</p>
          <a href="/data/threat-model.json" download class="chain-action-btn" style="text-decoration:none;">Download threat-model.json &darr;</a>
        </div>

        <div class="chain-narrative-card">
          <h4 class="chain-card-title">Architecture Vector Diagrams (SVG)</h4>
          <p class="chain-card-body">High-resolution vector architecture diagrams for Sheet 01 (Master Register) and Sheet 03 (Defense Layers) ready for threat modeling reports.</p>
          <a href="/assets/threat-model/sheet1_master.svg" download class="chain-action-btn" style="text-decoration:none;">Download Architecture SVG &darr;</a>
        </div>
      </div>

    </div>
  </div>
</section>
"""

    # Write out snippet
    snippet_path = os.path.join(ROOT_DIR, "scripts", "threat_model_snippet.html")
    with open(snippet_path, "w", encoding="utf-8") as sf:
        sf.write(snippet_html)
    print(f"Generated {snippet_path}")

    # Build threat_model_bundle.js
    catalog_json = json.dumps(tm_data["components"], indent=2)
    svg_map_json = json.dumps(svg_map)

    js_bundle = f"""
/* ==========================================================================
   AI Threat Model Engine (KubeDaily Design System)
   Embedded in-memory SVGs and catalog for instant zero-latency rendering
   ========================================================================== */

window.SHEET_SVGS = {svg_map_json};
window.THREAT_MODEL_CATALOG = {catalog_json};

(function() {{
  let currentSheet = 'cluster';
  let currentZoom = 1.0;
  let currentLevel = 0;
  let currentFlow = 'off';
  let isDragging = false;
  let startX = 0, startY = 0;
  let scrollLeft = 0, scrollTop = 0;
  let activeElement = null;
  let currentDrawerData = null;

  const flowPresets = {{
    'p1': {{
      title: 'Active Flow: P1 · Direct Jailbreak to Directive Exfiltration',
      desc: 'Adversary submits multi-turn role-reversal payload. Guardrail lacks semantic boundary detection. System prompt exfiltrated verbatim.',
      steps: ['[1] User Ingress (TA01)', '[2] Attention Window (TO04)', '[3] Safety Alignment Dissolved', '[4] Key Exfiltration (Canary C05 Alert)']
    }},
    'p2': {{
      title: 'Active Flow: P2 · Indirect RAG Document Poisoning',
      desc: 'Adversary embeds prompt inside untrusted PDF. Vector database retrieves poisoned chunk into agent context. Autonomous email tool dispatched.',
      steps: ['[1] Malicious Web/Doc (TA02)', '[2] Vector DB Ingestion (TO08)', '[3] Context Window Capture', '[4] Unauthorized Action (C08 Gate)']
    }},
    'p3': {{
      title: 'Active Flow: P3 · Tool Call SSRF & Cloud Metadata Extraction',
      desc: 'Prompt injection coerces fetch_webpage tool into requesting AWS IMDS 169.254.169.254, leaking IAM temporary STS role credentials.',
      steps: ['[1] Adversarial Prompt', '[2] Agent Tool Planner (TO06)', '[3] IMDS Query (169.254.169.254)', '[4] Sandbox Block (C04 NetPol)']
    }}
  }};

  window.initThreatModelEngine = function() {{
    initPanZoom();
    initSearch();
    attachCurrentSvgListeners();
    initKeyboardShortcuts();
    checkUrlHash();
  }};

  // Attach interactive click and hover handlers to SVG elements
  function attachCurrentSvgListeners() {{
    const target = document.getElementById('diagramSvgTarget');
    if (!target) return;
    const nodes = target.querySelectorAll('.tm-node, g[data-id]');
    nodes.forEach(node => {{
      node.style.cursor = 'pointer';
      node.addEventListener('click', (e) => {{
        e.stopPropagation();
        const idText = node.getAttribute('data-id') || node.textContent.trim().slice(0, 30);
        const slug = node.getAttribute('data-slug') || idText.toLowerCase();
        inspectNode(node, slug, idText);
      }});
    }});
  }}

  // Switch Active Diagram Sheet (Instant In-Memory SVG swap)
  window.switchSheet = function(sheetKey) {{
    if (!window.SHEET_SVGS[sheetKey]) sheetKey = 'cluster';
    currentSheet = sheetKey;

    // Update Tab UI
    document.querySelectorAll('.sheet-tab-btn').forEach(btn => {{
      btn.classList.toggle('active', btn.getAttribute('data-sheet') === sheetKey);
    }});

    const target = document.getElementById('diagramSvgTarget');
    if (!target) return;

    target.innerHTML = window.SHEET_SVGS[sheetKey];
    attachCurrentSvgListeners();
    resetZoom();
  }};

  // Inspect clicked node
  function inspectNode(element, slug, idText) {{
    if (activeElement) {{
      activeElement.classList.remove('highlight-pulse');
    }}
    activeElement = element;
    if (element) {{
      element.classList.add('highlight-pulse');
    }}

    const data = findMetadata(slug, idText);
    openInspector(data);
  }}

  // Locate and inspect component from external buttons
  window.locateAndInspect = function(slug, idText, targetSheet) {{
    if (targetSheet && currentSheet !== targetSheet) {{
      switchSheet(targetSheet);
    }}

    const data = findMetadata(slug, idText);
    const target = document.getElementById('diagramSvgTarget');
    if (target) {{
      const node = target.querySelector(`[data-id="${{idText}}"]`) || target.querySelector(`[data-slug="${{slug}}"]`);
      if (node) {{
        if (activeElement) activeElement.classList.remove('highlight-pulse');
        activeElement = node;
        node.classList.add('highlight-pulse');
      }}
    }}

    const container = document.getElementById('diagramViewportContainer');
    if (container) {{
      container.scrollIntoView({{ behavior: 'smooth', block: 'center' }});
    }}

    openInspector(data);
  }};

  // Find metadata from catalog or create fallback
  function findMetadata(slug, text) {{
    const catalog = window.THREAT_MODEL_CATALOG || {{}};
    const lowerSlug = (slug || '').toLowerCase().trim();
    const lowerText = (text || '').toLowerCase().trim();

    if (catalog[lowerSlug]) return catalog[lowerSlug];
    if (catalog[lowerText]) return catalog[lowerText];

    for (const key in catalog) {{
      const item = catalog[key];
      if (item.id && (item.id.toLowerCase() === lowerText || item.id.toLowerCase() === lowerSlug)) {{
        return item;
      }}
      if (item.name && item.name.toLowerCase().includes(lowerText)) {{
        return item;
      }}
    }}

    return {{
      id: text.slice(0, 8),
      name: text.slice(0, 40),
      category: "Architecture Component",
      priority: "HIGH",
      level: 1,
      origin: "In-Scope AI System Boundary",
      motive: "Component workload execution and reasoning",
      stride: "Spoofing, Tampering, Elevation of Privilege",
      overview: `Detailed technical specification for "${{text}}". Click on Threat Actors (TA01–TA07), Attack Vectors (AV01–AV32), or Controls (C01–C30) for full hardening policies.`,
      attackVectors: ["Exploitation of prompt injection boundaries", "Privilege escalation via tool schema tampering"],
      yaml: `# Baseline Security Policy for ${{text}}\\napiVersion: security.promptinjection.io/v1\\nkind: ComponentGuardrail\\nmetadata:\\n  name: baseline-protection\\nspec:\\n  enforceDelimiterIsolation: true\\n  maxTokenVariance: 0.12`,
      kyverno: `# NeMo Guardrail flow for ${{text}}\\ndefine flow guard_${{lowerSlug || 'component'}}\\n  user prompt injection pattern\\n  bot refuse request\\n  stop`,
      shell: `# Audit component health and telemetry\\ncurl -s https://api.your-company.com/v1/health | jq .`,
      detection: `# OpenTelemetry Anomaly Rule\\npattern_match:\\n  vector_id: "${{text}}"\\n  threshold: 0.85`,
      compliance: {{
        owasp: "LLM01:2025 (Prompt Injection)",
        mitre: "AML.T0051 (Prompt Injection)",
        nist: "NIST AI RMF 1.0 (MEASURE 2.6)",
        iso: "ISO/IEC 42001:2023 § A.8"
      }}
    }};
  }}

  // Open 6-Tab Slide-Over Inspector Drawer
  function openInspector(data) {{
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
    if (data.id) {{
      history.replaceState(null, '', '#' + data.id);
    }}
  }}

  window.closeInspector = function() {{
    const drawer = document.getElementById('inspectorDrawer');
    if (drawer) drawer.classList.remove('open');
    if (activeElement) {{
      activeElement.classList.remove('highlight-pulse');
      activeElement = null;
    }}
  }};

  // Switch Tab in Inspector Drawer
  window.switchDrawerTab = function(tabKey) {{
    document.querySelectorAll('.drawer-tab-btn').forEach(btn => {{
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabKey);
    }});

    const contentPane = document.getElementById('drawerContentPane');
    if (!contentPane || !currentDrawerData) return;

    const data = currentDrawerData;

    if (tabKey === 'overview') {{
      contentPane.innerHTML = `
        <div style="margin-bottom: 1.25rem;">
          <h4 style="font-size: 0.82rem; font-weight: 700; color: #38bdf8; text-transform: uppercase; margin-bottom: 0.5rem;">Threat Overview &amp; Context</h4>
          <p style="white-space: pre-wrap; margin-bottom: 1rem;">${{escapeHtml(data.overview || data.motive || '')}}</p>
        </div>
        <div style="margin-bottom: 1.25rem;">
          <h4 style="font-size: 0.82rem; font-weight: 700; color: #f59e0b; text-transform: uppercase; margin-bottom: 0.5rem;">STRIDE AI Classification</h4>
          <span class="kube-badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.35); font-size: 0.8rem;">
            ${{escapeHtml(data.stride || 'Tampering, Elevation of Privilege')}}
          </span>
        </div>
        <div>
          <h4 style="font-size: 0.82rem; font-weight: 700; color: #ef4444; text-transform: uppercase; margin-bottom: 0.5rem;">Associated Attack Vectors</h4>
          <ul style="padding-left: 1.25rem; font-size: 0.84rem; line-height: 1.6;">
            ${{(data.attackVectors || ['Direct Prompt Injection (AV01)', 'System Prompt Exfiltration']).map(v => `<li>${{escapeHtml(v)}}</li>`).join('')}}
          </ul>
        </div>
      `;
    }} else if (tabKey === 'yaml') {{
      contentPane.innerHTML = `
        <h4 style="font-size: 0.82rem; font-weight: 700; color: #10b981; text-transform: uppercase; margin-bottom: 0.5rem;">Production Hardening Code</h4>
        <p style="font-size: 0.82rem; color: var(--tm-text-muted); margin-bottom: 0.5rem;">Production-ready Python / YAML defense policy for this component.</p>
        <pre class="drawer-code-block"><code>${{escapeHtml(data.yaml || '# No hardening spec defined')}}</code></pre>
        <button onclick="copyCode(this)" style="padding: 5px 10px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); cursor: pointer;">
          Copy Hardening Policy
        </button>
      `;
    }} else if (tabKey === 'kyverno') {{
      contentPane.innerHTML = `
        <h4 style="font-size: 0.82rem; font-weight: 700; color: #a855f7; text-transform: uppercase; margin-bottom: 0.5rem;">Policy-as-Code (NeMo / Llama-Guard / JSON Schema)</h4>
        <p style="font-size: 0.82rem; color: var(--tm-text-muted); margin-bottom: 0.5rem;">Declarative guardrail configuration and enforcement flow.</p>
        <pre class="drawer-code-block" style="color: #c084fc;"><code>${{escapeHtml(data.kyverno || '# No policy-as-code spec')}}</code></pre>
        <button onclick="copyCode(this)" style="padding: 5px 10px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); cursor: pointer;">
          Copy Guardrail Policy
        </button>
      `;
    }} else if (tabKey === 'shell') {{
      contentPane.innerHTML = `
        <h4 style="font-size: 0.82rem; font-weight: 700; color: #38bdf8; text-transform: uppercase; margin-bottom: 0.5rem;">Audit &amp; Penetration Testing (Shell / CLI)</h4>
        <p style="font-size: 0.82rem; color: var(--tm-text-muted); margin-bottom: 0.5rem;">Automated penetration testing commands to verify guardrail resilience.</p>
        <pre class="drawer-code-block" style="color: #67e8f9;"><code>${{escapeHtml(data.shell || '# No audit script defined')}}</code></pre>
        <button onclick="copyCode(this)" style="padding: 5px 10px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); cursor: pointer;">
          Copy CLI Command
        </button>
      `;
    }} else if (tabKey === 'detection') {{
      contentPane.innerHTML = `
        <h4 style="font-size: 0.82rem; font-weight: 700; color: #f43f5e; text-transform: uppercase; margin-bottom: 0.5rem;">Detection Rules &amp; Telemetry Signatures</h4>
        <p style="font-size: 0.82rem; color: var(--tm-text-muted); margin-bottom: 0.5rem;">OpenTelemetry, SIEM, and regex detection signatures.</p>
        <pre class="drawer-code-block" style="color: #fb7185;"><code>${{escapeHtml(data.detection || '# No detection signature defined')}}</code></pre>
        <button onclick="copyCode(this)" style="padding: 5px 10px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.3); cursor: pointer;">
          Copy Detection Rule
        </button>
      `;
    }} else if (tabKey === 'compliance') {{
      const comp = data.compliance || {{}};
      contentPane.innerHTML = `
        <h4 style="font-size: 0.82rem; font-weight: 700; color: #fbbf24; text-transform: uppercase; margin-bottom: 0.5rem;">Compliance &amp; Framework Alignment</h4>
        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.85rem;">
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--tm-border); padding: 10px 14px; border-radius: 8px;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #38bdf8; text-transform: uppercase;">OWASP GenAI Top 10</div>
            <div style="font-size: 0.86rem; font-weight: 600; color: var(--tm-text-head); margin-top: 2px;">${{escapeHtml(comp.owasp || 'LLM01:2025 (Prompt Injection)')}}</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--tm-border); padding: 10px 14px; border-radius: 8px;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #ef4444; text-transform: uppercase;">MITRE ATLAS™ Framework</div>
            <div style="font-size: 0.86rem; font-weight: 600; color: var(--tm-text-head); margin-top: 2px;">${{escapeHtml(comp.mitre || 'AML.T0051 (Prompt Injection)')}}</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--tm-border); padding: 10px 14px; border-radius: 8px;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #10b981; text-transform: uppercase;">NIST AI Risk Management Framework (AI RMF 1.0)</div>
            <div style="font-size: 0.86rem; font-weight: 600; color: var(--tm-text-head); margin-top: 2px;">${{escapeHtml(comp.nist || 'GOVERN 1.2, MEASURE 2.6, MANAGE 2.4')}}</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--tm-border); padding: 10px 14px; border-radius: 8px;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #a855f7; text-transform: uppercase;">ISO / IEC 42001:2023</div>
            <div style="font-size: 0.86rem; font-weight: 600; color: var(--tm-text-head); margin-top: 2px;">${{escapeHtml(comp.iso || 'Clause 8.2 & Annex A.6')}}</div>
          </div>
        </div>
      `;
    }}
  }};

  // Copy Deep Link
  window.copyDeepLink = function() {{
    if (!currentDrawerData) return;
    const url = window.location.origin + window.location.pathname + '#' + currentDrawerData.id;
    if (navigator.clipboard) {{
      navigator.clipboard.writeText(url).then(() => {{
        const btn = document.getElementById('drawerCopyLinkBtn');
        if (btn) {{
          const old = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => btn.textContent = old, 1800);
        }}
      }});
    }}
  }};

  window.copyCode = function(btn) {{
    const pre = btn.previousElementSibling;
    if (!pre) return;
    const text = pre.innerText;
    if (navigator.clipboard) {{
      navigator.clipboard.writeText(text).then(() => {{
        const old = btn.textContent;
        btn.textContent = 'Copied to Clipboard!';
        setTimeout(() => btn.textContent = old, 1800);
      }});
    }}
  }};

  // Pan & Zoom Implementation
  function initPanZoom() {{
    const pane = document.getElementById('diagramScrollPane');
    const wrapper = document.getElementById('diagramScalableWrapper');
    if (!pane || !wrapper) return;

    pane.addEventListener('mousedown', (e) => {{
      if (e.target.closest('.tm-node') || e.target.closest('button') || e.target.closest('input')) return;
      isDragging = true;
      pane.classList.add('grabbing');
      startX = e.pageX - pane.offsetLeft;
      startY = e.pageY - pane.offsetTop;
      scrollLeft = pane.scrollLeft;
      scrollTop = pane.scrollTop;
    }});

    pane.addEventListener('mouseleave', () => {{
      isDragging = false;
      pane.classList.remove('grabbing');
    }});

    pane.addEventListener('mouseup', () => {{
      isDragging = false;
      pane.classList.remove('grabbing');
    }});

    pane.addEventListener('mousemove', (e) => {{
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - pane.offsetLeft;
      const y = e.pageY - pane.offsetTop;
      const walkX = (x - startX) * 1.5;
      const walkY = (y - startY) * 1.5;
      pane.scrollLeft = scrollLeft - walkX;
      pane.scrollTop = scrollTop - walkY;
    }});

    pane.addEventListener('wheel', (e) => {{
      if (e.ctrlKey || e.metaKey) {{
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.1 : -0.1;
        adjustZoom(delta);
      }}
    }}, {{ passive: false }});
  }}

  window.adjustZoom = function(delta) {{
    currentZoom = Math.min(Math.max(currentZoom + delta, 0.45), 2.2);
    applyZoom();
  }};

  window.resetZoom = function() {{
    currentZoom = 1.0;
    applyZoom();
    const pane = document.getElementById('diagramScrollPane');
    if (pane) {{
      pane.scrollLeft = 0;
      pane.scrollTop = 0;
    }}
  }};

  function applyZoom() {{
    const wrapper = document.getElementById('diagramScalableWrapper');
    const indicator = document.getElementById('zoomIndicator');
    if (wrapper) {{
      wrapper.style.transform = `scale(${{currentZoom}})`;
    }}
    if (indicator) {{
      indicator.textContent = `${{Math.round(currentZoom * 100)}}%`;
    }}
  }}

  window.toggleFullscreen = function() {{
    const container = document.getElementById('diagramViewportContainer');
    if (!container) return;
    if (!document.fullscreenElement) {{
      container.requestFullscreen().catch(err => console.warn(err));
    }} else {{
      document.exitFullscreen().catch(err => console.warn(err));
    }}
  }};

  // Search with Autocomplete
  function initSearch() {{
    const input = document.getElementById('diagramSearchInput');
    const dropdown = document.getElementById('searchAutocompleteDropdown');
    const clearBtn = document.getElementById('searchClearBtn');
    if (!input || !dropdown) return;

    input.addEventListener('input', () => {{
      const q = input.value.trim().toLowerCase();
      if (clearBtn) clearBtn.style.display = q ? 'block' : 'none';
      if (!q) {{
        dropdown.style.display = 'none';
        return;
      }}

      const catalog = window.THREAT_MODEL_CATALOG || {{}};
      const matches = [];
      for (const key in catalog) {{
        const item = catalog[key];
        const matchScore = (item.id && item.id.toLowerCase().includes(q)) ||
                           (item.name && item.name.toLowerCase().includes(q)) ||
                           (item.category && item.category.toLowerCase().includes(q));
        if (matchScore) {{
          matches.push(item);
          if (matches.length >= 8) break;
        }}
      }}

      if (matches.length === 0) {{
        dropdown.innerHTML = `<div style="padding: 12px; font-size: 0.8rem; color: var(--tm-text-muted); text-align: center;">No matching components found for "${{escapeHtml(q)}}"</div>`;
        dropdown.style.display = 'block';
      }} else {{
        dropdown.innerHTML = matches.map(m => `
          <div class="autocomplete-item" onclick="locateAndInspect('${{m.id.toLowerCase()}}', '${{escapeHtml(m.id)}}'); clearSearch();">
            <span class="autocomplete-id">${{escapeHtml(m.id)}}</span>
            <span class="autocomplete-name">${{escapeHtml(m.name)}}</span>
            <span class="autocomplete-cat">${{escapeHtml(m.category || '')}}</span>
          </div>
        `).join('');
        dropdown.style.display = 'block';
      }}
    }});

    document.addEventListener('click', (e) => {{
      if (!e.target.closest('.search-wrapper')) {{
        dropdown.style.display = 'none';
      }}
    }});
  }}

  window.clearSearch = function() {{
    const input = document.getElementById('diagramSearchInput');
    const dropdown = document.getElementById('searchAutocompleteDropdown');
    const clearBtn = document.getElementById('searchClearBtn');
    if (input) input.value = '';
    if (dropdown) dropdown.style.display = 'none';
    if (clearBtn) clearBtn.style.display = 'none';
  }};

  // Depth Level Switcher
  window.setDepthLevel = function(level) {{
    currentLevel = level;
    document.querySelectorAll('.depth-btn').forEach(btn => {{
      btn.classList.toggle('active', parseInt(btn.getAttribute('data-level'), 10) === level);
    }});

    const target = document.getElementById('diagramSvgTarget');
    if (target) {{
      const nodes = target.querySelectorAll('[data-level]');
      nodes.forEach(node => {{
        const nodeLevel = parseInt(node.getAttribute('data-level') || '0', 10);
        node.style.opacity = nodeLevel <= currentLevel ? '1' : '0.25';
      }});
    }}
  }};

  // Traffic Flow Overlay / Stepper
  window.setTrafficFlow = function(flowKey) {{
    currentFlow = flowKey;
    const select = document.getElementById('flowSelect');
    if (select && select.value !== flowKey) select.value = flowKey;

    const stepperBox = document.getElementById('flowStepperFloating');
    if (!stepperBox) return;

    if (flowKey === 'off' || !flowPresets[flowKey]) {{
      stepperBox.style.display = 'none';
      return;
    }}

    const preset = flowPresets[flowKey];
    document.getElementById('flowStepperTitle').textContent = preset.title;
    document.getElementById('flowStepperDesc').textContent = preset.desc;
    document.getElementById('flowStepperSteps').innerHTML = preset.steps.map((s, idx) => `
      <span class="flow-step-pill ${{idx === 0 ? 'active' : ''}}">${{escapeHtml(s)}}</span>
    `).join('');

    stepperBox.style.display = 'block';

    if (flowKey === 'p1' || flowKey === 'p2' || flowKey === 'p3') {{
      if (currentSheet !== 'attack-chains') {{
        switchSheet('attack-chains');
      }}
    }}
  }};

  // Keyboard Navigation
  function initKeyboardShortcuts() {{
    document.addEventListener('keydown', (e) => {{
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {{
        if (e.key === 'Escape') {{
          e.target.blur();
          clearSearch();
        }}
        return;
      }}

      if (e.key === 'Escape') {{
        closeInspector();
        clearSearch();
      }} else if (e.key === '+' || e.key === '=') {{
        adjustZoom(0.15);
      }} else if (e.key === '-' || e.key === '_') {{
        adjustZoom(-0.15);
      }} else if (e.key === '0') {{
        resetZoom();
      }} else if (e.key === 'f' || e.key === 'F') {{
        toggleFullscreen();
      }} else if (e.key === '/') {{
        e.preventDefault();
        const input = document.getElementById('diagramSearchInput');
        if (input) input.focus();
      }}
    }});
  }}

  // URL Hash Deep-linking
  function checkUrlHash() {{
    const hash = window.location.hash.replace('#', '').trim();
    if (hash) {{
      setTimeout(() => {{
        locateAndInspect(hash.toLowerCase(), hash);
      }}, 350);
    }}
  }}

  function escapeHtml(str) {{
    if (!str) return '';
    return str.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }}
}})();
"""
    bundle_path = os.path.join(ROOT_DIR, "scripts", "threat_model_bundle.js")
    with open(bundle_path, "w", encoding="utf-8") as jf:
        jf.write(js_bundle.strip())
    print(f"Generated {bundle_path}")

if __name__ == "__main__":
    build_snippet()
