---
title: Blog
subtitle: Security research insights and prompt injection analysis
layout: blog-index
---

<div class="blog-index">
  <div class="blog-hero">
    <div class="blog-hero-badge">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
      Security Research
    </div>
    <h1 class="blog-hero-title">Security Research Blog</h1>
    <p class="blog-hero-subtitle">In-depth analysis, latest discoveries, and practical insights into prompt injection vulnerabilities and AI safety</p>
    <div class="blog-hero-stats">
      <span class="hero-stat">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline></svg>
        {{ site.posts | size }} Articles
      </span>
      <span class="hero-stat">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
        {% assign all_tags = "" | split: "" %}{% for post in site.posts %}{% for tag in post.tags %}{% unless all_tags contains tag %}{% assign all_tags = all_tags | push: tag %}{% endunless %}{% endfor %}{% endfor %}{{ all_tags | size }} Topics
      </span>
    </div>
  </div>

  {% assign all_tags = "" | split: "" %}
  {% for post in site.posts %}
    {% for tag in post.tags %}
      {% unless all_tags contains tag %}
        {% assign all_tags = all_tags | push: tag %}
      {% endunless %}
    {% endfor %}
  {% endfor %}

  {% if all_tags.size > 0 %}
  <div class="blog-tag-filter">
    <button class="blog-filter-tag active" data-tag="all">All Posts</button>
    {% for tag in all_tags %}
    <button class="blog-filter-tag" data-tag="{{ tag }}">{{ tag }}</button>
    {% endfor %}
  </div>
  {% endif %}

  <div class="blog-posts-grid">
    {% for post in site.posts %}
    <article class="blog-post-card" data-tags="{{ post.tags | join: ',' }}">
      <div class="post-card-number">{{ forloop.index | prepend: '0' | slice: -2, 2 }}</div>
      <div class="post-header">
        <h2 class="post-title">
          <a href="{{ post.url }}">{{ post.title }}</a>
        </h2>
        <div class="post-meta">
          <span class="post-date">
            <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {{ post.date | date: "%B %d, %Y" }}
          </span>
          {% if post.author %}
          <span class="post-author">
            <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            {{ post.author }}
          </span>
          {% endif %}
          <span class="post-reading-time">
            <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12,6 12,12 16,14"></polyline>
            </svg>
            {% assign words = post.content | number_of_words %}{% assign minutes = words | divided_by: 200 %}{% if minutes < 1 %}1{% else %}{{ minutes }}{% endif %} min read
          </span>
        </div>
      </div>
      
      {% if post.excerpt %}
      <div class="post-excerpt">
        {{ post.excerpt | strip_html | truncatewords: 30 }}
      </div>
      {% endif %}
      
      {% if post.tags %}
      <div class="post-tags">
        {% for tag in post.tags %}
        <span class="post-tag">{{ tag }}</span>
        {% endfor %}
      </div>
      {% endif %}
      
      <div class="post-footer">
        <a href="{{ post.url }}" class="read-more">
          Read Article
          <svg class="read-more-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12,5 19,12 12,19"></polyline>
          </svg>
        </a>
      </div>
    </article>
    {% endfor %}
  </div>

  {% if site.posts.size == 0 %}
  <div class="no-posts">
    <div class="no-posts-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14,2 14,8 20,8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10,9 9,9 8,9"></polyline>
      </svg>
    </div>
    <h3>No posts yet</h3>
    <p>Check back soon for security research insights and prompt injection analysis.</p>
  </div>
  {% endif %}
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const filterTags = document.querySelectorAll('.blog-filter-tag');
  const postCards = document.querySelectorAll('.blog-post-card');
  
  filterTags.forEach(function(tag) {
    tag.addEventListener('click', function() {
      const selectedTag = this.getAttribute('data-tag');
      
      filterTags.forEach(function(t) { t.classList.remove('active'); });
      this.classList.add('active');
      
      postCards.forEach(function(card) {
        const cardTags = card.getAttribute('data-tags') || '';
        if (selectedTag === 'all' || cardTags.split(',').indexOf(selectedTag) !== -1) {
          card.style.display = '';
          card.style.animation = 'blogCardFadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});
</script>
