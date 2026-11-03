import re
import os

with open('scripts/threat_model_snippet.html', 'r', encoding='utf-8') as f:
    snippet = f.read().strip()

# 1. Update index.md
with open('index.md', 'r', encoding='utf-8') as f:
    index_md = f.read()

# Replace from the start of threat model comment/section until the kill chain comment
pattern = r'(<!-- =+[\r\n\s]+AI Threat Model.*?<\/section>[\r\n\s]+)(?=<!-- =+[\r\n\s]+AI Kill Chain)'
if re.search(pattern, index_md, flags=re.DOTALL):
    index_md = re.sub(pattern, snippet + '\n\n', index_md, flags=re.DOTALL)
    print("Cleanly replaced Threat Model in index.md")
else:
    # Alternative match
    pattern2 = r'(<section class="threat-model-section".*?<\/section>[\r\n\s]+)(?=<!-- =+[\r\n\s]+AI Kill Chain)'
    if re.search(pattern2, index_md, flags=re.DOTALL):
        index_md = re.sub(pattern2, snippet + '\n\n', index_md, flags=re.DOTALL)
        print("Replaced Threat Model section in index.md via pattern 2")
    else:
        print("Warning: could not find exact replacement pattern in index.md!")

with open('index.md', 'w', encoding='utf-8') as f:
    f.write(index_md)

# 2. Update threat-model.md
tm_frontmatter = """---
title: AI Threat Model & Reference Architecture
subtitle: interactive reference architecture for enterprise AI & autonomous agent security
layout: default
hide_platform_selector: true
hide_extension_link: true
hide_tone_selector: true
body_class: vibe
permalink: /threat-model/
---

"""
with open('threat-model.md', 'w', encoding='utf-8') as f:
    f.write(tm_frontmatter + snippet + '\n')
print("Updated threat-model.md successfully")

