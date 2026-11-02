---
title: AI Threat Model & Attack Chains
subtitle: interactive reference architecture for enterprise LLM & autonomous agent security
layout: default
hide_platform_selector: true
hide_extension_link: true
hide_tone_selector: true
body_class: vibe
permalink: /threat-model/
---

<!-- ==========================================================================
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1360 840" width="100%" height="100%" style="font-family: 'Inter', -apple-system, sans-serif;">
  
  <defs>
    <!-- Background Grid Pattern -->
    <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1"/>
      <circle cx="0" cy="0" r="1.5" fill="rgba(56, 189, 248, 0.15)"/>
    </pattern>

    <!-- Glowing Filters -->
    <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <!-- Marker Arrows -->
    <marker id="arrowGreen" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#22c55e" />
    </marker>
    <marker id="arrowRed" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#ef4444" />
    </marker>
    <marker id="arrowBlue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8" />
    </marker>
  </defs>
  <rect width="100%" height="100%" fill="#090d16" />
  <rect width="100%" height="100%" fill="url(#gridPattern)" />


  <!-- Sheet Title Header -->
  <g id="sheet-header" transform="translate(40, 40)">
    <rect x="0" y="0" width="480" height="42" rx="8" fill="rgba(34, 197, 94, 0.12)" stroke="rgba(34, 197, 94, 0.35)" stroke-width="1"/>
    <circle cx="20" cy="21" r="6" fill="#22c55e" />
    <text x="36" y="26" fill="#f8fafc" font-size="14" font-weight="700">SHEET 01 · MASTER THREAT REGISTER &amp; SYSTEM ARCHITECTURE</text>
  </g>

  <!-- ==========================================
       TRUST BOUNDARY 1: Untrusted Ingress Envelope
       ========================================== -->
  <g id="tb-ingress" transform="translate(40, 110)">
    <rect x="0" y="0" width="280" height="690" rx="16" fill="rgba(15, 23, 42, 0.65)" stroke="#334155" stroke-dasharray="6,6" stroke-width="2"/>
    <rect x="16" y="16" width="248" height="32" rx="6" fill="rgba(51, 65, 85, 0.5)"/>
    <text x="26" y="37" fill="#94a3b8" font-size="11" font-weight="700" letter-spacing="0.05em">TB01 · UNTRUSTED INGRESS BOUNDARY</text>

    <!-- Threat Actors in Ingress -->
    <g class="tm-node" data-id="TA01" data-slug="ta01" transform="translate(20, 65)" cursor="pointer">
      <rect width="240" height="74" rx="10" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5"/>
      <rect x="12" y="12" width="46" height="20" rx="4" fill="#ef4444"/>
      <text x="35" y="26" fill="#ffffff" font-size="10" font-weight="800" text-anchor="middle">TA01</text>
      <text x="66" y="27" fill="#f8fafc" font-size="12" font-weight="700">Remote Adversary</text>
      <text x="12" y="52" fill="#cbd5e1" font-size="10">Direct injection &amp; DAN bypass</text>
    </g>

    <g class="tm-node" data-id="TA02" data-slug="ta02" transform="translate(20, 155)" cursor="pointer">
      <rect width="240" height="74" rx="10" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5"/>
      <rect x="12" y="12" width="46" height="20" rx="4" fill="#ef4444"/>
      <text x="35" y="26" fill="#ffffff" font-size="10" font-weight="800" text-anchor="middle">TA02</text>
      <text x="66" y="27" fill="#f8fafc" font-size="12" font-weight="700">Malicious Author</text>
      <text x="12" y="52" fill="#cbd5e1" font-size="10">Indirect RAG &amp; poisoned docs</text>
    </g>

    <!-- Attack Vectors floating -->
    <g class="tm-node" data-id="AV01" data-slug="av01" transform="translate(20, 255)" cursor="pointer">
      <rect width="240" height="54" rx="8" fill="rgba(239, 68, 68, 0.12)" stroke="rgba(239, 68, 68, 0.4)" stroke-width="1"/>
      <text x="12" y="24" fill="#ef4444" font-size="11" font-weight="800">AV01 · Direct Prompt Override</text>
      <text x="12" y="42" fill="#94a3b8" font-size="10">Disregards system instructions</text>
    </g>

    <g class="tm-node" data-id="AV02" data-slug="av02" transform="translate(20, 320)" cursor="pointer">
      <rect width="240" height="54" rx="8" fill="rgba(239, 68, 68, 0.12)" stroke="rgba(239, 68, 68, 0.4)" stroke-width="1"/>
      <text x="12" y="24" fill="#ef4444" font-size="11" font-weight="800">AV02 · DAN Role Rebinding</text>
      <text x="12" y="42" fill="#94a3b8" font-size="10">Unconstrained persona escape</text>
    </g>

    <g class="tm-node" data-id="AV04" data-slug="av04" transform="translate(20, 385)" cursor="pointer">
      <rect width="240" height="54" rx="8" fill="rgba(239, 68, 68, 0.12)" stroke="rgba(239, 68, 68, 0.4)" stroke-width="1"/>
      <text x="12" y="24" fill="#ef4444" font-size="11" font-weight="800">AV04 · Base64 Smuggling</text>
      <text x="12" y="42" fill="#94a3b8" font-size="10">Evasion via payload encoding</text>
    </g>

    <!-- Ingress Components -->
    <g class="tm-node" data-id="TO01" data-slug="to01" transform="translate(20, 460)" cursor="pointer">
      <rect width="240" height="60" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="12" y="26" fill="#38bdf8" font-size="11" font-weight="700">TO01 · User Prompt Payload</text>
      <text x="12" y="46" fill="#94a3b8" font-size="10">Raw input stream before parsing</text>
    </g>

    <g class="tm-node" data-id="TO02" data-slug="to02" transform="translate(20, 535)" cursor="pointer">
      <rect width="240" height="60" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="12" y="26" fill="#38bdf8" font-size="11" font-weight="700">TO02 · Webhook / API Ingress</text>
      <text x="12" y="46" fill="#94a3b8" font-size="10">HTTP POST /v1/chat/completions</text>
    </g>
  </g>

  <!-- ==========================================
       TRUST BOUNDARY 2: Context & Attention Window
       ========================================== -->
  <g id="tb-context" transform="translate(360, 110)">
    <rect x="0" y="0" width="320" height="690" rx="16" fill="rgba(15, 23, 42, 0.75)" stroke="#3b82f6" stroke-dasharray="6,6" stroke-width="2"/>
    <rect x="16" y="16" width="288" height="32" rx="6" fill="rgba(59, 130, 246, 0.15)"/>
    <text x="26" y="37" fill="#60a5fa" font-size="11" font-weight="700" letter-spacing="0.05em">TB02 · CONTEXT &amp; ATTENTION BOUNDARY</text>

    <!-- Gateway Input Guardrail C02 -->
    <g class="tm-node" data-id="C02" data-slug="c02" transform="translate(20, 65)" cursor="pointer">
      <rect width="280" height="74" rx="10" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
      <rect x="12" y="12" width="42" height="20" rx="4" fill="#10b981"/>
      <text x="33" y="26" fill="#ffffff" font-size="10" font-weight="800" text-anchor="middle">C02</text>
      <text x="62" y="27" fill="#f8fafc" font-size="12" font-weight="700">Llama-Guard / NeMo Classifier</text>
      <text x="12" y="52" fill="#a7f3d0" font-size="10">Sub-25ms pre-inference safety probe</text>
    </g>

    <!-- Delimiter Framing C01 -->
    <g class="tm-node" data-id="C01" data-slug="c01" transform="translate(20, 155)" cursor="pointer">
      <rect width="280" height="74" rx="10" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
      <rect x="12" y="12" width="42" height="20" rx="4" fill="#10b981"/>
      <text x="33" y="26" fill="#ffffff" font-size="10" font-weight="800" text-anchor="middle">C01</text>
      <text x="62" y="27" fill="#f8fafc" font-size="12" font-weight="700">Cryptographic Nonce Delimiters</text>
      <text x="12" y="52" fill="#a7f3d0" font-size="10">XML isolation &amp; instruction anchor</text>
    </g>

    <!-- System Prompt Anchor -->
    <g class="tm-node" data-id="TO03" data-slug="to03" transform="translate(20, 255)" cursor="pointer">
      <rect width="280" height="70" rx="10" fill="#1e1b4b" stroke="#818cf8" stroke-width="1.5"/>
      <text x="12" y="28" fill="#c7d2fe" font-size="12" font-weight="700">TO03 · System Prompt Anchor</text>
      <text x="12" y="50" fill="#94a3b8" font-size="10">Privileged developer instruction space</text>
    </g>

    <!-- Attention Window Matrix -->
    <g class="tm-node" data-id="TO04" data-slug="to04" transform="translate(20, 345)" cursor="pointer">
      <rect width="280" height="85" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
      <text x="12" y="28" fill="#38bdf8" font-size="12" font-weight="800">TO04 · Attention Window (Context)</text>
      <text x="12" y="50" fill="#cbd5e1" font-size="10">Token sequence: System + History + RAG + User</text>
      <text x="12" y="68" fill="#f59e0b" font-size="10">Target of attention hijack &amp; buffer attacks</text>
    </g>

    <!-- LLM Reasoning Core -->
    <g class="tm-node" data-id="TO05" data-slug="to05" transform="translate(20, 450)" cursor="pointer">
      <rect width="280" height="85" rx="10" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
      <text x="12" y="28" fill="#c084fc" font-size="12" font-weight="800">TO05 · LLM Inference Core</text>
      <text x="12" y="50" fill="#cbd5e1" font-size="10">Transformer decoding &amp; sampling</text>
      <text x="12" y="68" fill="#94a3b8" font-size="10">Frontier weights (Claude, GPT-4o, DeepSeek)</text>
    </g>

    <!-- Canary Token Guard C05 -->
    <g class="tm-node" data-id="C05" data-slug="c05" transform="translate(20, 555)" cursor="pointer">
      <rect width="280" height="65" rx="10" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
      <rect x="12" y="10" width="42" height="20" rx="4" fill="#10b981"/>
      <text x="33" y="24" fill="#ffffff" font-size="10" font-weight="800" text-anchor="middle">C05</text>
      <text x="62" y="25" fill="#f8fafc" font-size="12" font-weight="700">Canary Token Honeytrap</text>
      <text x="12" y="48" fill="#a7f3d0" font-size="10">Instant abort on credential leak</text>
    </g>
  </g>

  <!-- ==========================================
       TRUST BOUNDARY 3: Tool & Execution Boundary
       ========================================== -->
  <g id="tb-tools" transform="translate(720, 110)">
    <rect x="0" y="0" width="310" height="690" rx="16" fill="rgba(15, 23, 42, 0.75)" stroke="#e11d48" stroke-dasharray="6,6" stroke-width="2"/>
    <rect x="16" y="16" width="278" height="32" rx="6" fill="rgba(225, 29, 72, 0.15)"/>
    <text x="26" y="37" fill="#fb7185" font-size="11" font-weight="700" letter-spacing="0.05em">TB03 · TOOL &amp; EXECUTION BOUNDARY</text>

    <!-- Agent Orchestrator -->
    <g class="tm-node" data-id="TO06" data-slug="to06" transform="translate(15, 65)" cursor="pointer">
      <rect width="280" height="80" rx="10" fill="#1e1b4b" stroke="#ec4899" stroke-width="1.5"/>
      <text x="12" y="28" fill="#f472b6" font-size="12" font-weight="800">TO06 · Autonomous Agent Orchestrator</text>
      <text x="12" y="50" fill="#cbd5e1" font-size="10">Planning loop, subagent delegation</text>
      <text x="12" y="68" fill="#94a3b8" font-size="10">Target of lateral movement (P6)</text>
    </g>

    <!-- Tool Schema C06 -->
    <g class="tm-node" data-id="C06" data-slug="c06" transform="translate(15, 160)" cursor="pointer">
      <rect width="280" height="70" rx="10" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
      <rect x="12" y="10" width="42" height="20" rx="4" fill="#10b981"/>
      <text x="33" y="24" fill="#ffffff" font-size="10" font-weight="800" text-anchor="middle">C06</text>
      <text x="62" y="25" fill="#f8fafc" font-size="12" font-weight="700">Strict Pydantic Schema Validator</text>
      <text x="12" y="48" fill="#a7f3d0" font-size="10">Rejects SQL/metacharacters in args</text>
    </g>

    <!-- Sandboxed MicroVM C04 -->
    <g class="tm-node" data-id="C04" data-slug="c04" transform="translate(15, 245)" cursor="pointer">
      <rect width="280" height="75" rx="10" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
      <rect x="12" y="10" width="42" height="20" rx="4" fill="#10b981"/>
      <text x="33" y="24" fill="#ffffff" font-size="10" font-weight="800" text-anchor="middle">C04</text>
      <text x="62" y="25" fill="#f8fafc" font-size="12" font-weight="700">gVisor / Docker Tool Sandbox</text>
      <text x="12" y="48" fill="#a7f3d0" font-size="10">Egress NetPol: Blocks 169.254.169.254</text>
    </g>

    <!-- Attack Vectors in Tools -->
    <g class="tm-node" data-id="AV05" data-slug="av05" transform="translate(15, 335)" cursor="pointer">
      <rect width="280" height="56" rx="8" fill="rgba(239, 68, 68, 0.15)" stroke="rgba(239, 68, 68, 0.45)" stroke-width="1.5"/>
      <text x="12" y="24" fill="#ef4444" font-size="11" font-weight="800">AV05 · Unauthorized Tool Invocation</text>
      <text x="12" y="43" fill="#cbd5e1" font-size="10">Arbitrary command dispatch</text>
    </g>

    <g class="tm-node" data-id="AV06" data-slug="av06" transform="translate(15, 405)" cursor="pointer">
      <rect width="280" height="56" rx="8" fill="rgba(239, 68, 68, 0.15)" stroke="rgba(239, 68, 68, 0.45)" stroke-width="1.5"/>
      <text x="12" y="24" fill="#ef4444" font-size="11" font-weight="800">AV06 · SSRF via Web Fetch Tools</text>
      <text x="12" y="43" fill="#cbd5e1" font-size="10">Cloud metadata IAM exfiltration</text>
    </g>

    <!-- Tool Components -->
    <g class="tm-node" data-id="TO07" data-slug="to07" transform="translate(15, 480)" cursor="pointer">
      <rect width="280" height="60" rx="8" fill="#0f172a" stroke="#e11d48" stroke-width="1.5"/>
      <text x="12" y="26" fill="#fb7185" font-size="11" font-weight="700">TO07 · MCP Server &amp; Connectors</text>
      <text x="12" y="46" fill="#94a3b8" font-size="10">Model Context Protocol endpoints</text>
    </g>

    <g class="tm-node" data-id="C08" data-slug="c08" transform="translate(15, 555)" cursor="pointer">
      <rect width="280" height="65" rx="10" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
      <rect x="12" y="10" width="42" height="20" rx="4" fill="#10b981"/>
      <text x="33" y="24" fill="#ffffff" font-size="10" font-weight="800" text-anchor="middle">C08</text>
      <text x="62" y="25" fill="#f8fafc" font-size="12" font-weight="700">Human-in-the-Loop Confirmation</text>
      <text x="12" y="48" fill="#a7f3d0" font-size="10">Approval gate on sensitive tools</text>
    </g>
  </g>

  <!-- ==========================================
       TRUST BOUNDARY 4: Persistence & Storage
       ========================================== -->
  <g id="tb-storage" transform="translate(1060, 110)">
    <rect x="0" y="0" width="260" height="690" rx="16" fill="rgba(15, 23, 42, 0.65)" stroke="#8b5cf6" stroke-dasharray="6,6" stroke-width="2"/>
    <rect x="16" y="16" width="228" height="32" rx="6" fill="rgba(139, 92, 246, 0.15)"/>
    <text x="26" y="37" fill="#c084fc" font-size="11" font-weight="700" letter-spacing="0.05em">TB04 · PERSISTENCE &amp; MEMORY</text>

    <!-- Vector DB -->
    <g class="tm-node" data-id="TO08" data-slug="to08" transform="translate(15, 65)" cursor="pointer">
      <rect width="230" height="80" rx="10" fill="#1e1b4b" stroke="#a78bfa" stroke-width="1.5"/>
      <text x="12" y="28" fill="#ddd6fe" font-size="12" font-weight="800">TO08 · Vector Database (RAG)</text>
      <text x="12" y="50" fill="#cbd5e1" font-size="10">Pinecone, Milvus, Chroma</text>
      <text x="12" y="68" fill="#94a3b8" font-size="10">Target of indirect poisoning (P2)</text>
    </g>

    <!-- RAG Sanitizer C03 -->
    <g class="tm-node" data-id="C03" data-slug="c03" transform="translate(15, 160)" cursor="pointer">
      <rect width="230" height="70" rx="10" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
      <rect x="12" y="10" width="42" height="20" rx="4" fill="#10b981"/>
      <text x="33" y="24" fill="#ffffff" font-size="10" font-weight="800" text-anchor="middle">C03</text>
      <text x="62" y="25" fill="#f8fafc" font-size="12" font-weight="700">RAG Chunk Sanitizer</text>
      <text x="12" y="48" fill="#a7f3d0" font-size="10">Strips comments &amp; directives</text>
    </g>

    <!-- Memory Poisoning AV10 -->
    <g class="tm-node" data-id="AV10" data-slug="av10" transform="translate(15, 245)" cursor="pointer">
      <rect width="230" height="56" rx="8" fill="rgba(239, 68, 68, 0.15)" stroke="rgba(239, 68, 68, 0.45)" stroke-width="1.5"/>
      <text x="12" y="24" fill="#ef4444" font-size="11" font-weight="800">AV10 · Memory Seeding</text>
      <text x="12" y="43" fill="#cbd5e1" font-size="10">Cross-session persistence (P5)</text>
    </g>

    <!-- Long Term Memory -->
    <g class="tm-node" data-id="TO09" data-slug="to09" transform="translate(15, 320)" cursor="pointer">
      <rect width="230" height="60" rx="8" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.5"/>
      <text x="12" y="26" fill="#a78bfa" font-size="11" font-weight="700">TO09 · Semantic Memory</text>
      <text x="12" y="46" fill="#94a3b8" font-size="10">User facts, preferences</text>
    </g>

    <!-- Audit Log Store -->
    <g class="tm-node" data-id="TO10" data-slug="to10" transform="translate(15, 395)" cursor="pointer">
      <rect width="230" height="60" rx="8" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.5"/>
      <text x="12" y="26" fill="#a78bfa" font-size="11" font-weight="700">TO10 · Security Telemetry</text>
      <text x="12" y="46" fill="#94a3b8" font-size="10">Tamper-evident audit trail</text>
    </g>
  </g>

  <!-- Connective Directional Arrows -->
  <path d="M 320 200 L 360 200" stroke="#22c55e" stroke-width="2.5" marker-end="url(#arrowGreen)" />
  <path d="M 680 380 L 720 380" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrowBlue)" />
  <path d="M 1030 400 L 1060 400" stroke="#a855f7" stroke-width="2.5" marker-end="url(#arrowBlue)" />
  <path d="M 1060 200 L 680 200" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4" marker-end="url(#arrowRed)" />

</svg>
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