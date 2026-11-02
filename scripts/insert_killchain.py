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

import re

# Match the entire Kill Chain section if present
pattern = r'<!-- =+[\r\n\s]+AI Kill Chain 10-Stage Matrix Framework.*?<\/section>[\r\n\s]+<!-- Interactive Prompt Explorer Section -->'
replacement = f"{killchain_html}\n<!-- Interactive Prompt Explorer Section -->"

if re.search(pattern, index_content, flags=re.DOTALL):
    new_index = re.sub(pattern, replacement, index_content, flags=re.DOTALL)
    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        f.write(new_index)
    print("Successfully replaced AI Kill Chain in index.md")
else:
    # If not present yet, insert before explorer
    target = '<!-- Interactive Prompt Explorer Section -->'
    if target in index_content:
        new_index = index_content.replace(target, f"{killchain_html}\n{target}")
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

