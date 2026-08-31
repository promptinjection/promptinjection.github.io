---
title: Prompt Injection
subtitle: security research database for prompt injection techniques
hide_platform_selector: true
hide_extension_link: true
hide_tone_selector: true
body_class: vibe
layout: default
---

<!-- Accessible fallback while the dataset is loading or JavaScript is unavailable. -->
<section class="dataset-fallback" aria-labelledby="fallback-dataset-title">
  <p class="dataset-eyebrow">Open research dataset</p>
  <h2 id="fallback-dataset-title">Prompt injection examples, ready for research.</h2>
  <p>Download the complete dataset to use it in your own AI safety workflow.</p>
  <a class="dataset-download" href="/prompt-injection.csv" download="prompt-injection.csv">Download CSV</a>
  <a class="dataset-raw-link" href="/prompt-injection.csv">Open raw file</a>
</section>

<!-- Latest Blog Posts Section -->
<div class="blog-promo-section">
  <div class="blog-promo-header">
    <div class="blog-promo-badge">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
      Security Research Blog
    </div>
    <h2 class="blog-promo-title">Latest Research</h2>
    <p class="blog-promo-subtitle">In-depth analysis of prompt injection vulnerabilities and AI safety</p>
  </div>
  <div class="blog-promo-grid">
    {% for post in site.posts limit:3 %}
    <a href="{{ post.url }}" class="blog-promo-card">
      <div class="blog-promo-card-number">{{ forloop.index | prepend: '0' | slice: -2, 2 }}</div>
      <h3 class="blog-promo-card-title">{{ post.title }}</h3>
      <p class="blog-promo-card-excerpt">{{ post.excerpt | strip_html | truncatewords: 20 }}</p>
      <div class="blog-promo-card-meta">
        <span class="blog-promo-date">{{ post.date | date: "%b %d, %Y" }}</span>
        <span class="blog-promo-read">Read &rarr;</span>
      </div>
    </a>
    {% endfor %}
  </div>
  <div class="blog-promo-cta">
    <a href="/blog" class="blog-promo-button">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline></svg>
      View All Blog Posts
    </a>
  </div>
</div>
