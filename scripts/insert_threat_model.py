#!/usr/bin/env python3
"""
Insert the inlined Threat Model snippet into index.md, threat-model.md, and bundle JS into script.js.
"""

import os
import re

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SNIPPET_PATH = os.path.join(ROOT_DIR, "scripts", "threat_model_snippet.html")
BUNDLE_JS_PATH = os.path.join(ROOT_DIR, "scripts", "threat_model_bundle.js")
INDEX_MD_PATH = os.path.join(ROOT_DIR, "index.md")
TM_MD_PATH = os.path.join(ROOT_DIR, "threat-model.md")
SCRIPT_JS_PATH = os.path.join(ROOT_DIR, "script.js")

def insert_all():
    with open(SNIPPET_PATH, "r", encoding="utf-8") as f:
        snippet = f.read().strip()

    with open(BUNDLE_JS_PATH, "r", encoding="utf-8") as f:
        bundle_js = f.read().strip()

    # 1. Update index.md
    with open(INDEX_MD_PATH, "r", encoding="utf-8") as f:
        index_content = f.read()

    # If threat model section already exists in index.md, replace it; otherwise insert before kill chain
    if '<section class="threat-model-section"' in index_content:
        index_content = re.sub(
            r'<!-- =+[\r\n\s]+AI Threat Model & Attack Chains Reference Architecture.*?<\/section>[\r\n\s]+(?=<!-- =+[\r\n\s]+AI Kill Chain)',
            snippet + '\n\n',
            index_content,
            flags=re.DOTALL
        )
        print("Replaced existing Threat Model section in index.md")
    else:
        target_marker = '<!-- ==========================================================================\n     AI Kill Chain 10-Stage Matrix Framework'
        if target_marker in index_content:
            index_content = index_content.replace(target_marker, snippet + '\n\n' + target_marker)
            print("Inserted Threat Model section into index.md before Kill Chain")
        else:
            # Fallback regex
            index_content = re.sub(
                r'(<!-- =+[\r\n\s]+AI Kill Chain 10-Stage Matrix Framework)',
                snippet + '\n\n\\1',
                index_content,
                count=1
            )
            print("Inserted Threat Model section into index.md via regex")

    with open(INDEX_MD_PATH, "w", encoding="utf-8") as f:
        f.write(index_content)

    # 2. Update threat-model.md
    tm_frontmatter = """---
title: AI Threat Model & Attack Chains
subtitle: interactive reference architecture for enterprise LLM & autonomous agent security
layout: default
hide_platform_selector: true
hide_extension_link: true
hide_tone_selector: true
body_class: vibe
permalink: /threat-model/
---

"""
    with open(TM_MD_PATH, "w", encoding="utf-8") as f:
        f.write(tm_frontmatter + snippet)
    print("Updated threat-model.md with full inlined snippet")

    # 3. Integrate into script.js
    with open(SCRIPT_JS_PATH, "r", encoding="utf-8") as f:
        script_content = f.read()

    # Append bundle_js if not already present
    if 'window.SHEET_SVGS =' not in script_content:
        script_content += '\n\n' + bundle_js
        print("Appended threat_model_bundle.js to script.js")
    else:
        # Replace existing bundle in script.js
        script_content = re.sub(
            r'\/\* =+[\r\n\s]+AI Threat Model Engine \(KubeDaily Design System\).*',
            bundle_js,
            script_content,
            flags=re.DOTALL
        )
        print("Updated threat_model_bundle.js in script.js")

    # Ensure initThreatModelEngine() is called in DOMContentLoaded
    if 'initThreatModelEngine();' not in script_content:
        script_content = script_content.replace(
            'initPromptDataset();',
            'initPromptDataset();\n  if (typeof initThreatModelEngine === "function") initThreatModelEngine();'
        )
        print("Added initThreatModelEngine() call to DOMContentLoaded")

    with open(SCRIPT_JS_PATH, "w", encoding="utf-8") as f:
        f.write(script_content)

    print("All Threat Model assets inserted and synced successfully.")

if __name__ == "__main__":
    insert_all()
