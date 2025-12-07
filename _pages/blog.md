---
layout: base
title: "Blog"
permalink: /blog/
stylesheet: /assets/css/blog.css
---

<div class="blog-index">
  <div class="page-intro">
    <h1 class="page-title">The Log</h1>
    <p class="page-subtitle">Notes on code, research, and coffee.</p>
  </div>

  <ul class="post-list">
    {% for post in site.posts %}
      <li class="list-item">
        <div class="post-card">
          <div>
            <span class="card-date">{{ post.date | date: "%d %b %Y" }}</span>
            <h2 class="card-title">
              <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
            </h2>
            <p class="card-excerpt">
              {% if post.description %}
                {{ post.description }}
              {% else %}
                {{ post.excerpt | strip_html | truncatewords: 25 }}...
              {% endif %}
            </p>
          </div>
          <div class="card-footer">
            Read Article <span>→</span>
          </div>
        </div>
      </li>
    {% endfor %}
  </ul>
</div>