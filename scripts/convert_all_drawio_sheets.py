import xml.etree.ElementTree as ET
import html
import os
import re

def parse_style(style_str):
    res = {}
    if not style_str:
        return res
    for part in style_str.split(';'):
        part = part.strip()
        if not part:
            continue
        if '=' in part:
            k, v = part.split('=', 1)
            res[k.strip()] = v.strip()
        else:
            res[part] = True
    return res

tree = ET.parse('/Users/apple/Downloads/AI_Threat_Modeling_All_Frameworks/AI_Threat_Modeling_All_Frameworks.drawio')
root = tree.getroot()

KEY_SHEETS = [
    (0, 'sheet0_reference_system.svg', 'Reference System (TB0–TB3)'),
    (1, 'sheet1_workflow.svg', 'Threat Modeling Workflow'),
    (2, 'sheet2_trust_boundaries.svg', 'Trust Boundaries & Assets'),
    (3, 'sheet3_crowdstrike_paths.svg', 'CrowdStrike Taxonomy → Paths'),
    (4, 'sheet4_owasp_llm.svg', 'OWASP LLM Top 10 (2026)'),
    (5, 'sheet5_owasp_agentic.svg', 'OWASP Agentic Top 10 (2026)'),
    (6, 'sheet6_owasp_mcp.svg', 'OWASP MCP Top 10 (2025 Beta)'),
    (7, 'sheet7_mitre_atlas.svg', 'MITRE ATLAS Pathways'),
    (10, 'sheet8_runtime_enforcement.svg', 'Runtime Capability Enforcement'),
    (11, 'sheet9_attack_paths.svg', '6 Attack Paths & Boundary Crossings')
]

os.makedirs('assets/threat-model', exist_ok=True)
converted_sheets = {}

for sheet_idx, filename, sheet_title in KEY_SHEETS:
    diag = root.findall('diagram')[sheet_idx]
    gm = diag.find('mxGraphModel')
    if gm is None:
        continue
    pw = int(float(gm.get('pageWidth', '2000')))
    ph = int(float(gm.get('pageHeight', '1400')))
    rc = gm.find('root')
    
    nodes = []
    edges = []
    node_geom = {}
    
    for c in rc.findall('mxCell'):
        cid = c.get('id')
        if cid in ('0', '1'):
            continue
        st = parse_style(c.get('style', ''))
        val = c.get('value', '')
        geom = c.find('mxGeometry')
        if c.get('edge'):
            edges.append({
                'id': cid,
                'source': c.get('source'),
                'target': c.get('target'),
                'style': st
            })
        elif geom is not None and geom.get('width') is not None:
            gx = float(geom.get('x', 0))
            gy = float(geom.get('y', 0))
            gw = float(geom.get('width', 0))
            gh = float(geom.get('height', 0))
            node_geom[cid] = {'x': gx, 'y': gy, 'w': gw, 'h': gh}
            nodes.append({
                'id': cid,
                'x': gx, 'y': gy, 'w': gw, 'h': gh,
                'val': val,
                'style': st
            })
            
    svg_lines = []
    svg_lines.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {pw} {ph}" width="100%" height="100%" class="threat-model-sheet-svg" data-sheet-id="{sheet_idx}">' )
    svg_lines.append('<defs>')
    for color_key, col in [('gold', '#EFC85C'), ('cyan', '#27C5D9'), ('purple', '#B8A3FF'), ('green', '#4AD49E'), ('coral', '#FE6577'), ('white', '#EDF5FC')]:
        svg_lines.append(f'''  <marker id="arr-{sheet_idx}-{color_key}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="{col}" />
  </marker>''')
    svg_lines.append('''  <filter id="cShadow" x="-10%" y="-10%" width="120%" height="120%">
    <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.4" />
  </filter>
</defs>''')
    
    # Background
    svg_lines.append(f'<rect width="{pw}" height="{ph}" fill="#0B1220" />')
    
    # Render containers / big rects first (w > 500 and h > 400 or dashed)
    container_nodes = [n for n in nodes if n['w'] > 600 and n['h'] > 300 or n['style'].get('dashed') == '1' or n['id'] in ('n1', 'n2', 'n6', 'n7', 'n8', 'n9', 'n41', 'n44')]
    container_ids = {n['id'] for n in container_nodes}
    
    for n in container_nodes:
        if n['x'] == 0 and n['y'] == 0 and n['w'] == pw and n['h'] == ph:
            continue
        cid = n['id']
        st = n['style']
        fill = st.get('fillColor', '#152439')
        stroke = st.get('strokeColor', '#35516C')
        sw = st.get('strokeWidth', '1.5')
        dashed = 'stroke-dasharray="8 5"' if st.get('dashed') == '1' else ''
        rx = '14' if st.get('rounded') == '1' else '0'
        svg_lines.append(f'<rect id="{cid}" x="{n["x"]}" y="{n["y"]}" width="{n["w"]}" height="{n["h"]}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {dashed} opacity="0.95" />')
        
    # Render Edges
    if edges:
        svg_lines.append('<g class="diagram-edges">')
        for e in edges:
            eid = e['id']
            src_id = e['source']
            tgt_id = e['target']
            st = e['style']
            col = st.get('strokeColor', '#4AD49E')
            sw = st.get('strokeWidth', '2')
            src = node_geom.get(src_id)
            tgt = node_geom.get(tgt_id)
            if not src or not tgt:
                continue
            exitX = float(st.get('exitX', 1))
            exitY = float(st.get('exitY', 0.5))
            entryX = float(st.get('entryX', 0))
            entryY = float(st.get('entryY', 0.5))
            sx = src['x'] + src['w'] * exitX
            sy = src['y'] + src['h'] * exitY
            tx = tgt['x'] + tgt['w'] * entryX
            ty = tgt['y'] + tgt['h'] * entryY
            
            m_col = 'green'
            if '#EFC85C' in col: m_col = 'gold'
            elif '#27C5D9' in col: m_col = 'cyan'
            elif '#B8A3FF' in col: m_col = 'purple'
            elif '#FE6577' in col: m_col = 'coral'
            elif '#EDF5FC' in col: m_col = 'white'
            
            if tx >= sx + 10:
                midX = (sx + tx) / 2
                d = f"M {sx:.1f} {sy:.1f} C {midX:.1f} {sy:.1f}, {midX:.1f} {ty:.1f}, {tx:.1f} {ty:.1f}"
            else:
                outX = max(sx, tx) + 28
                d = f"M {sx:.1f} {sy:.1f} L {outX:.1f} {sy:.1f} L {outX:.1f} {ty:.1f} L {tx:.1f} {ty:.1f}"
            svg_lines.append(f'  <path id="{eid}" class="flow-edge" d="{d}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-opacity="0.85" marker-end="url(#arr-{sheet_idx}-{m_col})" />')
        svg_lines.append('</g>')
        
    # Render interactive and card nodes
    card_nodes = [n for n in nodes if n['id'] not in container_ids]
    for n in card_nodes:
        cid = n['id']
        st = n['style']
        val = n['val']
        fill = st.get('fillColor', 'none')
        stroke = st.get('strokeColor', 'none')
        sw = st.get('strokeWidth', '1')
        rx = '10' if st.get('rounded') == '1' else '4'
        gx, gy, gw, gh = n['x'], n['y'], n['w'], n['h']
        
        # Determine if node is interactive
        is_interactive = bool(val and gw > 100 and gh > 30)
        cls = 'interactive-node' if is_interactive else 'static-element'
        
        svg_lines.append(f'<g id="grp-{sheet_idx}-{cid}" class="{cls}" data-node-id="{cid}" style="{"cursor:pointer;" if is_interactive else ""}">')
        if fill != 'none' or stroke != 'none':
            svg_lines.append(f'  <rect x="{gx}" y="{gy}" width="{gw}" height="{gh}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" filter="url(#cShadow)" />')
            
        if val:
            color = st.get('fontColor', '#EDF5FC')
            fs = st.get('fontSize', '16')
            fw = '700' if st.get('fontStyle') == '1' else '400'
            align = st.get('align', 'left')
            justify = 'center' if st.get('verticalAlign') == 'middle' else 'flex-start'
            pad = st.get('spacing', '12')
            svg_lines.append(f'''  <foreignObject x="{gx}" y="{gy}" width="{gw}" height="{gh}" style="pointer-events: none;">
    <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: {justify}; padding: {pad}px; box-sizing: border-box; color: {color}; font-size: {fs}px; font-weight: {fw}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.35; text-align: {align};">
      {val}
    </div>
  </foreignObject>''')
        svg_lines.append('</g>')
        
    svg_lines.append('</svg>')
    full_svg = '\n'.join(svg_lines)
    
    out_path = os.path.join('assets/threat-model', filename)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(full_svg)
    converted_sheets[sheet_idx] = {
        'id': f'sheet_{sheet_idx}',
        'file': filename,
        'title': sheet_title,
        'svg': full_svg
    }
    print(f"Converted Sheet {sheet_idx}: {sheet_title} -> {filename} ({len(full_svg)} bytes)")

print(f"Total sheets converted: {len(converted_sheets)}")
