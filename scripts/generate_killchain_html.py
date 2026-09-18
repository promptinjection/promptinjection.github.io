#!/usr/bin/env python3
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = os.path.join(ROOT, "data", "ai-kill-chain.json")

def generate_html():
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    stages = data["stages"]
    total_techs = sum(len(s["techniques"]) for s in stages)

    # 1. Stepper chips
    stepper_html = ['<div class="killchain-stepper" id="killchainStepper" role="tablist" aria-label="AI Kill Chain Stages">']
    stepper_html.append('<button class="killchain-step-chip active" data-stage="all" role="tab" aria-selected="true"><span class="killchain-step-num">ALL</span><span>All 10 Stages</span></button>')
    for s in stages:
        stepper_html.append(f'<button class="killchain-step-chip" data-stage="{s["id"]}" role="tab" aria-selected="false"><span class="killchain-step-num">{s["number"]}</span><span>{s["short_name"]}</span></button>')
    stepper_html.append('</div>')

    # 2. Matrix 10 columns
    grid_html = ['<div class="killchain-matrix-grid" id="killchainMatrixGrid">']
    for s in stages:
        grid_html.append(f'<div class="killchain-col" data-stage-col="{s["id"]}">')
        grid_html.append(f'  <div class="killchain-col-header">')
        grid_html.append(f'    <span class="killchain-col-stage-tag">Stage {s["number"]}</span>')
        grid_html.append(f'    <h3 class="killchain-col-title">{s["name"]}</h3>')
        grid_html.append(f'    <span class="killchain-col-count">{len(s["techniques"])} techniques</span>')
        grid_html.append(f'  </div>')

        for idx, t in enumerate(s["techniques"], 1):
            tech_id = f"T{s['number']}.{idx:02d}"
            escaped_name = t["name"].replace('"', '&quot;')
            escaped_desc = t["desc"].replace('"', '&quot;')
            escaped_sample = t["sample"].replace('"', '&quot;').replace("'", "&#39;")
            cat = t["category"]
            grid_html.append(f'  <div class="killchain-card" data-stage="{s["id"]}" data-tech-id="{tech_id}" data-category="{cat}" data-name="{escaped_name}" data-desc="{escaped_desc}" data-sample="{escaped_sample}" role="button" tabindex="0" aria-label="{t["name"]} ({cat})">')
            grid_html.append(f'    <p class="killchain-card-name">{t["name"]}</p>')
            grid_html.append(f'    <div class="killchain-card-bottom">')
            grid_html.append(f'      <span class="killchain-card-cat-badge">{cat}</span>')
            grid_html.append(f'      <span class="killchain-card-action">Details &rarr;</span>')
            grid_html.append(f'    </div>')
            grid_html.append(f'  </div>')

        grid_html.append('</div>')
    grid_html.append('</div>')

    full_section = f"""<!-- ==========================================================================
     AI Kill Chain 10-Stage Matrix Framework (Same Chart Design as Lineaje)
     ========================================================================== -->
<section class="killchain-section" id="ai-kill-chain" aria-label="AI Kill Chain Framework">
  <div class="section-header-modern">
    <div class="killchain-badge">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      Security Architecture Framework
    </div>
    <h2>The AI Kill Chain™ Matrix</h2>
    <p>A comprehensive 10-stage system-level framework mapping 58 attack techniques across large language models, autonomous agents, and tool-augmented workflows.</p>
  </div>

  <!-- Horizontal Stage Progression Stepper -->
  {''.join(stepper_html)}

  <!-- Search & Filter Toolbar -->
  <div class="killchain-toolbar">
    <div class="killchain-search-box">
      <svg class="killchain-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      <input type="text" class="killchain-search-input" id="killchainSearchInput" placeholder="Filter techniques (e.g. exfiltration, memory, tool, injection)..." aria-label="Filter AI Kill Chain techniques">
    </div>
    <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
      <button class="killchain-fullscreen-btn" id="killchainFullscreenBtn" type="button" title="Toggle Fullscreen View">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
        <span id="kcFullscreenText">Fullscreen View</span>
      </button>
      <span class="killchain-scroll-hint">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        Scroll horizontally
      </span>
      <span class="killchain-meta-status" id="killchainStatus">Showing 58 techniques across 10 stages</span>
    </div>
  </div>

  <!-- 10-Column Matrix Container -->
  <div class="killchain-matrix-container" id="killchainMatrixContainer">
    {''.join(grid_html)}
  </div>
</section>
"""
    return full_section

if __name__ == "__main__":
    html = generate_html()
    out_file = os.path.join(ROOT, "scripts", "killchain_snippet.html")
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(html)
    print("Generated killchain_snippet.html, length:", len(html))
