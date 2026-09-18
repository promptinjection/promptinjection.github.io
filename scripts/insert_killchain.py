#!/usr/bin/env python3
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX_PATH = os.path.join(ROOT, "index.md")
SNIPPET_PATH = os.path.join(ROOT, "scripts", "killchain_snippet.html")
MANAGE_PATH = os.path.join(ROOT, "manage.md")

with open(INDEX_PATH, "r", encoding="utf-8") as f:
    index_content = f.read()

with open(SNIPPET_PATH, "r", encoding="utf-8") as f:
    killchain_html = f.read()

# Check if already inserted
if 'id="ai-kill-chain"' in index_content:
    print("Already in index.md, replacing existing block...")
    # Replace from <!-- ========================================================================== \n AI Kill Chain to </section>
    import re
    index_content = re.sub(r'<!-- ===+.*AI Kill Chain 10-Stage Matrix.*?</section>\n', '', index_content, flags=re.DOTALL)

# Insert after end of categories section
target = '</section>\n\n<!-- Interactive Prompt Explorer Section -->'
if target in index_content:
    new_index = index_content.replace(target, f"</section>\n\n{killchain_html}\n<!-- Interactive Prompt Explorer Section -->")
    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        f.write(new_index)
    print("Successfully inserted AI Kill Chain into index.md")
else:
    print("Target marker not found in index.md!")

# Also create manage.md (and manage page) for user direct access
manage_md_content = f"""---
title: AI Kill Chain Framework
subtitle: 10-stage matrix for agentic & LLM security
hide_platform_selector: true
hide_extension_link: true
hide_tone_selector: true
body_class: vibe
layout: default
---

{killchain_html}
"""

with open(MANAGE_PATH, "w", encoding="utf-8") as f:
    f.write(manage_md_content)
print("Successfully created manage.md")

