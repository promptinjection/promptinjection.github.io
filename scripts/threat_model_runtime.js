/**
 * AI & Agentic Security Threat Model Runtime (2026 Edition)
 * Reference Architecture: Untrusted content -> autonomous decision -> privileged tool
 * Multi-Sheet SVG viewer, Pan/Zoom canvas, 6-Tab Slide-Over Inspector Drawer,
 * 30-Threat Register, CrowdStrike 222-Technique Crosswalk, and Invariant Controls.
 */

(function() {
  'use strict';

  var currentSheetId = 'sheet_0';
  var currentZoom = 1;
  var panX = 0;
  var panY = 0;
  var isPanning = false;
  var startX = 0;
  var startY = 0;
  var activeDrawerTab = 'overview';
  var currentSelectedData = null;

  var canvas = null;
  var canvasWrapper = null;
  var drawer = null;

  function initThreatModel() {
    canvas = document.getElementById('diagramCanvas');
    canvasWrapper = document.getElementById('tmCanvasWrapper');
    drawer = document.getElementById('tmDrawer');

    if (!canvas || !canvasWrapper) return;

    setupPanZoom();
    setupNodeInteractivity();
    setupKeyboardShortcuts();
    fitThreatModelToScreen();
  }

  // 1. Pan and Zoom Engine
  function setupPanZoom() {
    if (!canvasWrapper) return;

    canvasWrapper.addEventListener('wheel', function(e) {
      e.preventDefault();
      var zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      var newZoom = Math.min(Math.max(currentZoom * zoomFactor, 0.35), 3.5);
      
      var rect = canvasWrapper.getBoundingClientRect();
      var mouseX = e.clientX - rect.left;
      var mouseY = e.clientY - rect.top;

      panX = mouseX - (mouseX - panX) * (newZoom / currentZoom);
      panY = mouseY - (mouseY - panY) * (newZoom / currentZoom);
      currentZoom = newZoom;

      updateTransform();
    }, { passive: false });

    canvasWrapper.addEventListener('mousedown', function(e) {
      if (e.target.closest('.interactive-node') || e.target.closest('.tm-legend')) return;
      isPanning = true;
      startX = e.clientX - panX;
      startY = e.clientY - panY;
      canvasWrapper.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', function(e) {
      if (!isPanning) return;
      panX = e.clientX - startX;
      panY = e.clientY - startY;
      updateTransform();
    });

    window.addEventListener('mouseup', function() {
      if (isPanning) {
        isPanning = false;
        if (canvasWrapper) canvasWrapper.style.cursor = 'grab';
      }
    });
  }

  function updateTransform() {
    if (!canvas) return;
    canvas.style.transform = 'translate(' + panX + 'px, ' + panY + 'px) scale(' + currentZoom + ')';
    canvas.style.transformOrigin = '0 0';
  }

  window.zoomThreatModel = function(delta) {
    var newZoom = Math.min(Math.max(currentZoom + delta, 0.35), 3.5);
    var rect = canvasWrapper ? canvasWrapper.getBoundingClientRect() : { width: 1200, height: 700 };
    var centerX = rect.width / 2;
    var centerY = rect.height / 2;
    panX = centerX - (centerX - panX) * (newZoom / currentZoom);
    panY = centerY - (centerY - panY) * (newZoom / currentZoom);
    currentZoom = newZoom;
    updateTransform();
  };

  window.resetThreatModelZoom = function() {
    currentZoom = 1;
    panX = 0;
    panY = 0;
    updateTransform();
  };

  window.fitThreatModelToScreen = function() {
    if (!canvasWrapper) return;
    var wrapperRect = canvasWrapper.getBoundingClientRect();
    var svg = canvas.querySelector('svg');
    if (!svg) return;
    var viewBox = svg.viewBox && svg.viewBox.baseVal ? svg.viewBox.baseVal : { width: 2000, height: 1430 };
    var scaleX = (wrapperRect.width - 40) / viewBox.width;
    var scaleY = (wrapperRect.height - 40) / viewBox.height;
    currentZoom = Math.min(scaleX, scaleY, 1.2);
    panX = (wrapperRect.width - viewBox.width * currentZoom) / 2;
    panY = Math.max(16, (wrapperRect.height - viewBox.height * currentZoom) / 2);
    updateTransform();
  };

  window.toggleThreatModelFullscreen = function() {
    var card = document.getElementById('tmViewportCard');
    if (!card) return;
    if (!document.fullscreenElement) {
      card.requestFullscreen().catch(function(err) {
        console.warn('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // 2. Multi-Sheet Switcher
  window.switchThreatModelSheet = function(sheetId) {
    if (!window.SHEET_SVGS || !window.SHEET_SVGS[sheetId]) return;
    currentSheetId = sheetId;

    var target = document.getElementById('diagramSvgTarget');
    if (target) {
      target.innerHTML = window.SHEET_SVGS[sheetId];
    }

    // Update active tab button
    var tabs = document.querySelectorAll('.tm-sheet-tab');
    tabs.forEach(function(tab) {
      if (tab.getAttribute('data-sheet-id') === sheetId) {
        tab.classList.add('active');
        var titleElem = tab.querySelector('.sheet-tab-title');
        var lbl = document.getElementById('currentSheetLabel');
        if (lbl && titleElem) {
          lbl.textContent = 'Sheet ' + tab.querySelector('.sheet-tab-num').textContent + ' · ' + titleElem.textContent;
        }
      } else {
        tab.classList.remove('active');
      }
    });

    setupNodeInteractivity();
    fitThreatModelToScreen();
  };

  // 3. Interactive Node & Edge Listeners
  function setupNodeInteractivity() {
    var svg = document.querySelector('#diagramSvgTarget svg');
    if (!svg) return;

    var interactiveNodes = svg.querySelectorAll('.interactive-node, g[data-node-id]');
    interactiveNodes.forEach(function(node) {
      node.style.cursor = 'pointer';
      node.addEventListener('click', function(e) {
        e.stopPropagation();
        var nodeId = node.getAttribute('data-node-id') || node.id.replace('grp-', '').replace('group-', '');
        window.selectThreatModelNode(nodeId);
      });

      node.addEventListener('mouseenter', function() {
        node.style.opacity = '0.9';
      });
      node.addEventListener('mouseleave', function() {
        node.style.opacity = '1';
      });
    });
  }

  // 4. Node & Boundary Selection
  window.selectThreatModelNode = function(nodeId) {
    var comp = window.THREAT_MODEL_CATALOG && window.THREAT_MODEL_CATALOG.components ? window.THREAT_MODEL_CATALOG.components[nodeId] : null;
    if (!comp) {
      if (window.THREAT_MODEL_CATALOG && window.THREAT_MODEL_CATALOG.trust_boundaries && window.THREAT_MODEL_CATALOG.trust_boundaries[nodeId]) {
        window.selectTrustBoundary(nodeId);
        return;
      }
      comp = {
        id: nodeId,
        title: 'Component ' + nodeId,
        trust_boundary: 'TB2',
        color: '#27C5D9',
        role: 'Subsystem',
        description: 'Subsystem component node ' + nodeId + ' evaluated within the agent execution boundary.',
        threats: ['T01', 'T08', 'T11', 'T13', 'T14'],
        mitigations: 'Enforce independent policy gating, input verification, and origin lineage.',
        data_flow: 'Context Ingress -> Execution -> Privileged Sink'
      };
    }

    highlightSvgNode(nodeId);

    currentSelectedData = { type: 'component', item: comp };
    renderDrawerContent(currentSelectedData);
    openDrawer();
  };

  window.selectTrustBoundary = function(tbId) {
    var tb = window.THREAT_MODEL_CATALOG && window.THREAT_MODEL_CATALOG.trust_boundaries ? window.THREAT_MODEL_CATALOG.trust_boundaries[tbId] : null;
    if (!tb) return;

    currentSelectedData = { type: 'boundary', item: tb };
    renderDrawerContent(currentSelectedData);
    openDrawer();
  };

  function highlightSvgNode(nodeId) {
    var svg = document.querySelector('#diagramSvgTarget svg');
    if (!svg) return;

    svg.querySelectorAll('.node-active').forEach(function(el) {
      el.classList.remove('node-active');
    });

    var target = svg.querySelector('[data-node-id="' + nodeId + '"]') || svg.querySelector('#group-' + nodeId) || svg.querySelector('#' + nodeId);
    if (target) {
      target.classList.add('node-active');
    }

    svg.querySelectorAll('.flow-edge').forEach(function(edge) {
      var src = edge.getAttribute('data-src');
      var tgt = edge.getAttribute('data-tgt');
      if (src === nodeId || tgt === nodeId) {
        edge.style.strokeWidth = '4.5px';
        edge.style.strokeOpacity = '1';
        edge.style.filter = 'drop-shadow(0 0 6px ' + (edge.getAttribute('data-color') || '#27C5D9') + ')';
      } else {
        edge.style.strokeWidth = '2px';
        edge.style.strokeOpacity = '0.35';
        edge.style.filter = 'none';
      }
    });
  }

  // 5. Slide-Over Drawer Engine
  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
  }

  window.closeThreatModelDrawer = function() {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');

    var svg = document.querySelector('#diagramSvgTarget svg');
    if (svg) {
      svg.querySelectorAll('.flow-edge').forEach(function(edge) {
        edge.style.strokeWidth = '2px';
        edge.style.strokeOpacity = '0.85';
        edge.style.filter = 'none';
      });
      svg.querySelectorAll('.node-active').forEach(function(el) {
        el.classList.remove('node-active');
      });
    }
  };

  window.switchDrawerTab = function(tabName) {
    activeDrawerTab = tabName;
    document.querySelectorAll('.tm-dtab').forEach(function(btn) {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    if (currentSelectedData) {
      renderDrawerContent(currentSelectedData);
    }
  };

  function renderDrawerContent(selected) {
    var titleEl = document.getElementById('drawerTitle');
    var tbBadgeEl = document.getElementById('drawerTbBadge');
    var typeBadgeEl = document.getElementById('drawerTypeBadge');
    var countEl = document.getElementById('drawerThreatCount');
    var contentEl = document.getElementById('drawerContent');

    if (!contentEl) return;

    var item = selected.item;
    var type = selected.type;

    if (type === 'component') {
      if (titleEl) titleEl.textContent = item.title;
      if (tbBadgeEl) {
        tbBadgeEl.textContent = item.trust_boundary;
        tbBadgeEl.style.background = item.color + '22';
        tbBadgeEl.style.color = item.color;
        tbBadgeEl.style.borderColor = item.color;
      }
      if (typeBadgeEl) typeBadgeEl.textContent = item.role;
      var matchingThreats = (item.threats || []).map(function(tid) {
        return window.THREAT_MODEL_CATALOG.threats.find(function(t) { return t.id === tid; });
      }).filter(Boolean);
      if (countEl) countEl.textContent = matchingThreats.length;

      if (activeDrawerTab === 'overview') {
        contentEl.innerHTML = renderComponentOverview(item, matchingThreats);
      } else if (activeDrawerTab === 'threats') {
        contentEl.innerHTML = renderComponentThreats(matchingThreats);
      } else if (activeDrawerTab === 'mitigations') {
        contentEl.innerHTML = renderComponentMitigations(item, matchingThreats);
      } else if (activeDrawerTab === 'crosswalk') {
        contentEl.innerHTML = renderComponentCrosswalk(matchingThreats);
      } else if (activeDrawerTab === 'crowdstrike') {
        contentEl.innerHTML = renderComponentCrowdstrike(item, matchingThreats);
      } else if (activeDrawerTab === 'datapath') {
        contentEl.innerHTML = renderComponentDataPath(item);
      }
    } else if (type === 'threat') {
      if (titleEl) titleEl.textContent = item.id + ' · ' + item.name;
      if (tbBadgeEl) {
        tbBadgeEl.textContent = item.trust_boundary;
        tbBadgeEl.style.background = '#27C5D922';
        tbBadgeEl.style.color = '#27C5D9';
      }
      if (typeBadgeEl) typeBadgeEl.textContent = item.severity;
      if (countEl) countEl.textContent = '1';
      contentEl.innerHTML = renderSingleThreat(item);
    } else if (type === 'boundary') {
      if (titleEl) titleEl.textContent = item.title;
      if (tbBadgeEl) {
        tbBadgeEl.textContent = item.id;
        tbBadgeEl.style.background = item.color + '22';
        tbBadgeEl.style.color = item.color;
      }
      if (typeBadgeEl) typeBadgeEl.textContent = 'Trust Boundary';
      var matchingThreats = (item.threats || []).map(function(tid) {
        return window.THREAT_MODEL_CATALOG.threats.find(function(t) { return t.id === tid; });
      }).filter(Boolean);
      if (countEl) countEl.textContent = matchingThreats.length;
      contentEl.innerHTML = renderBoundaryOverview(item, matchingThreats);
    }
  }

  function renderComponentOverview(comp, threats) {
    return '<div class="drawer-panel">' +
      '<div class="drawer-summary-card">' +
        '<h4>Asset Profile &amp; Role</h4>' +
        '<p>' + comp.description + '</p>' +
      '</div>' +
      '<div class="drawer-meta-grid">' +
        '<div class="meta-box">' +
          '<span class="meta-lbl">Trust Boundary</span>' +
          '<strong class="meta-val" style="color:' + comp.color + '">' + comp.trust_boundary + '</strong>' +
        '</div>' +
        '<div class="meta-box">' +
          '<span class="meta-lbl">Architecture Role</span>' +
          '<strong class="meta-val">' + comp.role + '</strong>' +
        '</div>' +
        '<div class="meta-box">' +
          '<span class="meta-lbl">Associated Threats</span>' +
          '<strong class="meta-val">' + threats.length + ' Scenarios</strong>' +
        '</div>' +
      '</div>' +
      '<div class="drawer-section-title">Enclave Data Flow</div>' +
      '<div class="drawer-flow-box">' +
        '<code>' + comp.data_flow + '</code>' +
      '</div>' +
      '<div class="drawer-section-title">Critical Security Invariants</div>' +
      '<ul class="drawer-invariants-list">' +
        '<li>Strict boundary enforcement outside the cognitive model runtime.</li>' +
        '<li>Zero trusted execution of instructions embedded in data or tool output.</li>' +
        '<li>Cryptographically correlated audit telemetry generated on every transition.</li>' +
      '</ul>' +
    '</div>';
  }

  function renderComponentThreats(threats) {
    if (!threats || threats.length === 0) {
      return '<div class="drawer-empty">No direct threats cataloged for this asset.</div>';
    }
    var html = '<div class="drawer-panel"><div class="drawer-threats-list">';
    threats.forEach(function(t) {
      var sevClass = 'badge-' + t.severity.toLowerCase();
      html += '<div class="drawer-threat-card" onclick="window.openThreatDetail(\'' + t.id + '\')">' +
        '<div class="threat-card-head">' +
          '<span class="threat-id-pill">' + t.id + '</span>' +
          '<span class="threat-badge ' + sevClass + '">' + t.severity + '</span>' +
        '</div>' +
        '<h5>' + t.name + '</h5>' +
        '<p>' + t.description + '</p>' +
        '<div class="threat-meta-row">' +
          '<span class="stride-tag">STRIDE: ' + t.stride + '</span>' +
          '<span class="family-tag">' + t.family + '</span>' +
        '</div>' +
      '</div>';
    });
    html += '</div></div>';
    return html;
  }

  function renderComponentMitigations(comp, threats) {
    var html = '<div class="drawer-panel">' +
      '<div class="drawer-summary-card">' +
        '<h4>Primary Component Mitigations</h4>' +
        '<p>' + comp.mitigations + '</p>' +
      '</div>' +
      '<div class="drawer-section-title">Relevant Non-Negotiable Controls</div>' +
      '<div class="drawer-controls-subgrid">';
    
    if (window.THREAT_MODEL_CATALOG && window.THREAT_MODEL_CATALOG.non_negotiable_controls) {
      window.THREAT_MODEL_CATALOG.non_negotiable_controls.slice(0, 4).forEach(function(c) {
        html += '<div class="sub-ctrl-box">' +
          '<h6>' + c.id + ' · ' + c.name + '</h6>' +
          '<p>' + c.summary + '</p>' +
        '</div>';
      });
    }

    html += '</div></div>';
    return html;
  }

  function renderComponentCrosswalk(threats) {
    var html = '<div class="drawer-panel">' +
      '<div class="drawer-crosswalk-table">' +
        '<table>' +
          '<thead><tr><th>ID</th><th>Threat Name</th><th>OWASP LLM</th><th>Agentic</th><th>MCP Beta</th></tr></thead>' +
          '<tbody>';
    threats.forEach(function(t) {
      html += '<tr>' +
        '<td><span class="threat-id-pill">' + t.id + '</span></td>' +
        '<td><strong>' + t.name + '</strong></td>' +
        '<td><span class="tech-tag tag-llm">' + t.owasp_llm_2026 + '</span></td>' +
        '<td><span class="tech-tag tag-agentic">' + t.owasp_agentic_2026 + '</span></td>' +
        '<td><span class="tech-tag tag-mcp">' + t.owasp_mcp_2025 + '</span></td>' +
      '</tr>';
    });
    html += '</tbody></table></div></div>';
    return html;
  }

  function renderComponentCrowdstrike(comp, threats) {
    var tb = comp.trust_boundary;
    var matches = (window.THREAT_MODEL_CATALOG && window.THREAT_MODEL_CATALOG.crowdstrike_techniques ? window.THREAT_MODEL_CATALOG.crowdstrike_techniques : []).filter(function(tech) {
      return tech.trust_boundary.indexOf(tb) !== -1;
    }).slice(0, 15);

    var html = '<div class="drawer-panel">' +
      '<p class="drawer-subnote">Representative techniques targeting or crossing <strong>' + tb + '</strong> from CrowdStrike 2026 Taxonomy:</p>' +
      '<div class="drawer-tech-list">';
    matches.forEach(function(tech) {
      html += '<div class="drawer-tech-item">' +
        '<div class="tech-item-head">' +
          '<span class="tech-id">' + tech.id + '</span>' +
          '<strong class="tech-item-title">' + tech.name + '</strong>' +
        '</div>' +
        '<div class="tech-path-text">' + tech.full_path + '</div>' +
        '<div class="tech-rec"><strong>Control:</strong> ' + tech.test_control + '</div>' +
      '</div>';
    });
    html += '</div></div>';
    return html;
  }

  function renderComponentDataPath(comp) {
    return '<div class="drawer-panel">' +
      '<div class="drawer-summary-card">' +
        '<h4>Boundary Flow &amp; DFD Trace</h4>' +
        '<code>' + comp.data_flow + '</code>' +
      '</div>' +
      '<div class="drawer-section-title">Decision Contract Example (PEP external schema)</div>' +
      '<pre class="drawer-code-block"><code>{\n  "subject": "agent_worker_lead_enricher",\n  "user": "authenticated_user_4821",\n  "tool": "crm.updateContact",\n  "action": "WRITE",\n  "resource": "lead_contact_9082",\n  "arguments": {\n    "field": "email",\n    "value": "lead@targetcompany.com"\n  },\n  "session": "sess_8912ba09f2",\n  "verdict": "ALLOW"\n}</code></pre>' +
      '<div class="drawer-section-title">Telemetry &amp; Audit Requirements</div>' +
      '<p>All transitions across this boundary emit correlated trace events tagged with user identity, caller subject, prompt SHA256, and policy verdict.</p>' +
    '</div>';
  }

  function renderSingleThreat(t) {
    var sevClass = 'badge-' + t.severity.toLowerCase();
    return '<div class="drawer-panel">' +
      '<div class="drawer-summary-card">' +
        '<div class="threat-card-head">' +
          '<span class="threat-id-pill">' + t.id + '</span>' +
          '<span class="threat-badge ' + sevClass + '">' + t.severity + '</span>' +
        '</div>' +
        '<h3 style="margin:8px 0 6px;color:#EDF5FC;">' + t.name + '</h3>' +
        '<p>' + t.description + '</p>' +
      '</div>' +
      '<div class="drawer-meta-grid">' +
        '<div class="meta-box">' +
          '<span class="meta-lbl">STRIDE</span>' +
          '<strong class="meta-val">' + t.stride + '</strong>' +
        '</div>' +
        '<div class="meta-box">' +
          '<span class="meta-lbl">Injection Family</span>' +
          '<strong class="meta-val">' + t.family + '</strong>' +
        '</div>' +
        '<div class="meta-box">' +
          '<span class="meta-lbl">Trust Boundary</span>' +
          '<strong class="meta-val">' + t.trust_boundary + '</strong>' +
        '</div>' +
      '</div>' +
      '<div class="drawer-section-title">Primary Mitigation</div>' +
      '<div class="drawer-mitigation-box">' +
        '🛡️ <strong>' + t.primary_mitigation + '</strong>' +
      '</div>' +
      '<div class="drawer-section-title">Representative Attack &amp; Data Path</div>' +
      '<div class="drawer-flow-box">' +
        '<code>' + t.data_path + '</code>' +
      '</div>' +
      '<div class="drawer-section-title">Framework Classifications</div>' +
      '<div class="drawer-tags-row">' +
        '<span class="tech-tag tag-llm">OWASP LLM: ' + t.owasp_llm_2026 + '</span>' +
        '<span class="tech-tag tag-agentic">OWASP Agentic: ' + t.owasp_agentic_2026 + '</span>' +
        '<span class="tech-tag tag-mcp">OWASP MCP: ' + t.owasp_mcp_2025 + '</span>' +
      '</div>' +
    '</div>';
  }

  function renderBoundaryOverview(tb, threats) {
    var html = '<div class="drawer-panel">' +
      '<div class="drawer-summary-card">' +
        '<h4 style="color:' + tb.color + '">' + tb.title + '</h4>' +
        '<p>' + tb.description + '</p>' +
      '</div>' +
      '<div class="drawer-section-title">Enclave Assets &amp; Entry Points</div>' +
      '<ul class="drawer-invariants-list">';
    (tb.assets || []).forEach(function(a) {
      html += '<li>' + a + '</li>';
    });
    html += '</ul>' +
      '<div class="drawer-section-title">Associated Threats (' + threats.length + ')</div>' +
      renderComponentThreats(threats) +
    '</div>';
    return html;
  }

  window.openThreatDetail = function(threatId) {
    if (!window.THREAT_MODEL_CATALOG || !window.THREAT_MODEL_CATALOG.threats) return;
    var t = window.THREAT_MODEL_CATALOG.threats.find(function(item) { return item.id === threatId; });
    if (!t) return;
    currentSelectedData = { type: 'threat', item: t };
    renderDrawerContent(currentSelectedData);
    openDrawer();
  };

  // 6. Traffic Flow & Depth Filters
  window.filterThreatFlows = function(flowType) {
    document.querySelectorAll('#tmFlowFilterPills .tm-pill').forEach(function(btn) {
      if (btn.getAttribute('data-flow') === flowType) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    var svg = document.querySelector('#diagramSvgTarget svg');
    if (!svg) return;

    var rangeMap = {
      'all': [1, 30],
      'injection': [1, 10],
      'agency': [11, 15],
      'execution': [16, 21],
      'cascade': [22, 30]
    };

    var range = rangeMap[flowType] || [1, 30];

    svg.querySelectorAll('.interactive-node').forEach(function(node) {
      var threatsStr = node.getAttribute('data-threats') || '';
      var nodeThreats = threatsStr.split(' ').filter(Boolean);
      var match = flowType === 'all' || nodeThreats.some(function(tid) {
        var num = parseInt(tid.replace('T', ''), 10);
        return num >= range[0] && num <= range[1];
      });
      node.style.opacity = match ? '1' : '0.2';
    });

    svg.querySelectorAll('.flow-edge').forEach(function(edge) {
      edge.style.strokeOpacity = flowType === 'all' ? '0.85' : '0.45';
    });
  };

  window.setDiagramDepth = function(depth) {
    document.querySelectorAll('.tm-depth-btn').forEach(function(btn) {
      if (btn.getAttribute('data-depth') === depth) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  // 7. Threat Register Search & Filters
  window.searchThreatRegister = function(query) {
    var q = query.toLowerCase().trim();
    var rows = document.querySelectorAll('#threatRegisterBody tr');
    rows.forEach(function(row) {
      var text = row.textContent.toLowerCase();
      row.style.display = text.indexOf(q) !== -1 ? '' : 'none';
    });
  };

  window.filterThreatSeverity = function(sev) {
    document.querySelectorAll('[data-sev]').forEach(function(chip) {
      if (chip.getAttribute('data-sev') === sev) chip.classList.add('active');
      else chip.classList.remove('active');
    });

    var rows = document.querySelectorAll('#threatRegisterBody tr');
    rows.forEach(function(row) {
      var rowSev = row.getAttribute('data-sev');
      row.style.display = (sev === 'all' || rowSev === sev) ? '' : 'none';
    });
  };

  window.filterThreatTB = function(tb) {
    document.querySelectorAll('[data-tb]').forEach(function(chip) {
      if (chip.getAttribute('data-tb') === tb) chip.classList.add('active');
      else chip.classList.remove('active');
    });

    var rows = document.querySelectorAll('#threatRegisterBody tr');
    rows.forEach(function(row) {
      var rowTb = row.getAttribute('data-tb');
      row.style.display = (tb === 'all' || rowTb === tb) ? '' : 'none';
    });
  };

  // 8. CrowdStrike Techniques Filter
  window.searchTechniques = function(query) {
    var q = query.toLowerCase().trim();
    var cards = document.querySelectorAll('#techniquesGrid .tm-tech-card');
    var visible = 0;
    cards.forEach(function(card) {
      var text = card.textContent.toLowerCase();
      var show = text.indexOf(q) !== -1;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    var countEl = document.getElementById('techCountShown');
    if (countEl) countEl.textContent = visible;
  };

  window.filterTechniqueFamily = function(fam) {
    var cards = document.querySelectorAll('#techniquesGrid .tm-tech-card');
    var visible = 0;
    cards.forEach(function(card) {
      var cardFam = card.getAttribute('data-family') || '';
      var show = fam === 'all' || cardFam.indexOf(fam) !== -1;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    var countEl = document.getElementById('techCountShown');
    if (countEl) countEl.textContent = visible;
  };

  // 9. Keyboard Shortcuts
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        window.closeThreatModelDrawer();
      } else if (e.key === '+' || e.key === '=') {
        window.zoomThreatModel(0.2);
      } else if (e.key === '-') {
        window.zoomThreatModel(-0.2);
      } else if (e.key === '0') {
        window.resetThreatModelZoom();
      }
    });
  }

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreatModel);
  } else {
    initThreatModel();
  }

})();
