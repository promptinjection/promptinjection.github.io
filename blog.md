---
title: Blog
subtitle: Security research insights and prompt injection analysis
layout: blog-index
---

<div class="blog-index">
  <div class="blog-hero">
    <h1 class="blog-hero-title">Security Research Blog</h1>
    <p class="blog-hero-subtitle">Insights, analysis, and discoveries in prompt injection security research</p>
  </div>

  <div class="blog-posts-grid">
    {% for post in site.posts %}
    <article class="blog-post-card">
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
        </div>
      </div>
      
      {% if post.excerpt %}
      <div class="post-excerpt">
        {{ post.excerpt }}
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
          Read More
          <svg class="read-more-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9,18 15,12 9,6"></polyline>
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
