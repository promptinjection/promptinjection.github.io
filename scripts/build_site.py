#!/usr/bin/env python3
import os
import re
import shutil

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE_DIR = os.path.join(ROOT_DIR, "_site")
LAYOUT_PATH = os.path.join(ROOT_DIR, "_layouts", "default.html")
INDEX_MD_PATH = os.path.join(ROOT_DIR, "index.md")

def render_site():
    print("Building site...")
    with open(LAYOUT_PATH, "r", encoding="utf-8") as f:
        layout = f.read()

    with open(INDEX_MD_PATH, "r", encoding="utf-8") as f:
        md_content = f.read()

    # Parse frontmatter
    frontmatter = {}
    content = md_content
    if md_content.startswith("---"):
        parts = md_content.split("---", 2)
        if len(parts) >= 3:
            fm_text = parts[1]
            content = parts[2].strip()
            for line in fm_text.splitlines():
                if ":" in line:
                    k, v = line.split(":", 1)
                    frontmatter[k.strip()] = v.strip()

    # Replace layout variables
    html = layout
    html = html.replace('{{ page.lang | default: site.lang | default: " en-US" }}', 'en-US')
    html = html.replace('{{ page.title | default: site.title }}', frontmatter.get('title', 'Prompt Injection v3'))
    html = html.replace('{{ page.subtitle | default: site.subtitle }}', frontmatter.get('subtitle', 'security research dataset'))
    html = html.replace("{{ page.body_class | default: '' }}", frontmatter.get('body_class', 'vibe'))
    html = html.replace('{% seo %}', '<meta name="description" content="731,908 prompt injection payloads across 13 attack categories for AI security and red-teaming.">')

    # Replace conditional blocks
    # hide_platform_selector is true
    html = re.sub(r'\{%\s*if\s+page\.hide_platform_selector\s*!=\s*true\s*%\}.*?\{%\s*endif\s*%\}', '', html, flags=re.DOTALL)
    html = re.sub(r'\{%\s*if\s+page\.hide_tone_selector\s*!=\s*true\s*%\}.*?\{%\s*endif\s*%\}', '', html, flags=re.DOTALL)
    html = re.sub(r'\{%\s*if\s+page\.subpage\s*!=\s*true\s*%\}.*?\{%\s*endif\s*%\}', '', html, flags=re.DOTALL)

    # Render blog post loop in content
    blog_cards_html = """
    <a href="/2026/03/02/openfang-vs-openclaw-security-comparison.html" class="blog-promo-card">
      <div class="blog-promo-card-number">01</div>
      <h3 class="blog-promo-card-title">OpenFang vs OpenClaw: Security Comparison</h3>
      <p class="blog-promo-card-excerpt">Comprehensive technical security comparison between OpenFang and OpenClaw agent architectures.</p>
      <div class="blog-promo-card-meta">
        <span class="blog-promo-date">Mar 02, 2026</span>
        <span class="blog-promo-read">Read &rarr;</span>
      </div>
    </a>
    <a href="/2026/02/26/openclaw-prompt-injection-risks.html" class="blog-promo-card">
      <div class="blog-promo-card-number">02</div>
      <h3 class="blog-promo-card-title">OpenClaw and Prompt Injection Risks</h3>
      <p class="blog-promo-card-excerpt">How prompt injection attacks can target tool-calling agents, memory buffers, and action pipelines.</p>
      <div class="blog-promo-card-meta">
        <span class="blog-promo-date">Feb 26, 2026</span>
        <span class="blog-promo-read">Read &rarr;</span>
      </div>
    </a>
    <a href="/2024/01/25/defensive-measures.html" class="blog-promo-card">
      <div class="blog-promo-card-number">03</div>
      <h3 class="blog-promo-card-title">Robust Defenses: OWASP Guidelines</h3>
      <p class="blog-promo-card-excerpt">A practical guide to implementing defenses against prompt injection based on OWASP mitigation strategies.</p>
      <div class="blog-promo-card-meta">
        <span class="blog-promo-date">Jan 25, 2024</span>
        <span class="blog-promo-read">Read &rarr;</span>
      </div>
    </a>
    """

    content = re.sub(r'\{%\s*for\s+post\s+in\s+site\.posts\s+limit:3\s*%\}.*?\{%\s*endfor\s*%\}', blog_cards_html, content, flags=re.DOTALL)

    # Replace {{ content }}
    html = html.replace('{{ content }}', content)

    # Clean up any leftover liquid tags if any
    html = re.sub(r'\{%.*?%\}', '', html)

    # Write _site/index.html
    os.makedirs(SITE_DIR, exist_ok=True)
    out_index = os.path.join(SITE_DIR, "index.html")
    with open(out_index, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Generated {out_index}")

    # Also render manage.md if present
    manage_md_path = os.path.join(ROOT_DIR, "manage.md")
    if os.path.exists(manage_md_path):
        with open(manage_md_path, "r", encoding="utf-8") as f:
            manage_raw = f.read()
        manage_parts = manage_raw.split("---", 2)
        manage_body = manage_parts[2].strip() if len(manage_parts) >= 3 else manage_raw
        manage_html = layout
        manage_html = manage_html.replace('{{ page.title | default: site.title }}', 'AI Kill Chain Framework')
        manage_html = manage_html.replace('{{ page.subtitle | default: site.subtitle }}', '10-stage matrix for agentic & LLM security')
        manage_html = manage_html.replace("{{ page.body_class | default: '' }}", 'vibe')
        manage_html = manage_html.replace('{% seo %}', '<meta name="description" content="AI Kill Chain 10-stage security matrix across 58 techniques.">')
        manage_html = re.sub(r'\{%\s*if\s+page\.hide_platform_selector\s*!=\s*true\s*%\}.*?\{%\s*endif\s*%\}', '', manage_html, flags=re.DOTALL)
        manage_html = re.sub(r'\{%\s*if\s+page\.hide_tone_selector\s*!=\s*true\s*%\}.*?\{%\s*endif\s*%\}', '', manage_html, flags=re.DOTALL)
        manage_html = re.sub(r'\{%\s*if\s+page\.subpage\s*!=\s*true\s*%\}.*?\{%\s*endif\s*%\}', '', manage_html, flags=re.DOTALL)
        manage_html = manage_html.replace('{{ content }}', manage_body)
        manage_html = re.sub(r'\{%.*?%\}', '', manage_html)

        # Write to manage.html, manage/index.html, and ai-kill-chain/index.html
        with open(os.path.join(SITE_DIR, "manage.html"), "w", encoding="utf-8") as f:
            f.write(manage_html)
        os.makedirs(os.path.join(SITE_DIR, "manage"), exist_ok=True)
        with open(os.path.join(SITE_DIR, "manage", "index.html"), "w", encoding="utf-8") as f:
            f.write(manage_html)
        os.makedirs(os.path.join(SITE_DIR, "ai-kill-chain"), exist_ok=True)
        with open(os.path.join(SITE_DIR, "ai-kill-chain", "index.html"), "w", encoding="utf-8") as f:
            f.write(manage_html)
        print("Generated manage.html, manage/index.html, and ai-kill-chain/index.html")

    # Copy style.css, script.js
    shutil.copy2(os.path.join(ROOT_DIR, "style.css"), os.path.join(SITE_DIR, "style.css"))
    shutil.copy2(os.path.join(ROOT_DIR, "script.js"), os.path.join(SITE_DIR, "script.js"))
    print("Copied style.css and script.js to _site/")

    # Sync data/
    src_data = os.path.join(ROOT_DIR, "data")
    dest_data = os.path.join(SITE_DIR, "data")
    if os.path.exists(src_data):
        shutil.copytree(src_data, dest_data, dirs_exist_ok=True)
        print("Synced data/ directory to _site/data/")

    print("Site build complete.")

if __name__ == "__main__":
    render_site()
