---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
title: "Small, focused apps and practical tools"
---



<header>
    <div class="hero page-section">
        <h1 class="section-header">Small, focused apps and practical tools</h1>
        <p>
            I'm Natalia Obukhova, an independent developer building small apps
            and practical tools for focused real-world tasks: drawing,
            organizing, planning a week, and making creative work easier.
        </p>
        <div class="hero-actions">
            <a class="primary-action" href="#apps">Explore apps</a>
            <a class="secondary-action" href="#books">See books and notes</a>
        </div>
    </div>
</header>

<main>
    <section id="apps" class="featured-ios-apps page-section">
      <h2 class="section-header">Apps</h2>
      <div class="apps-list">
          <div class="apps-grid">
            {% for app in site.data.featured_ios_apps %}
            <div class="app">
                <a class="app-icon" href="{{ app.link }}" title="{{ app.description }}">
                    <img src="{{ app.image }}" alt="{{ app.name }} app icon">
                </a>
                <div class="app-details">
                    <a class="app-name" href="{{ app.link }}" title="{{ app.description }}">
                        <strong>{{ app.name }}</strong>
                    </a>
                    <p class="app-description">{{ app.description }}</p>
                </div>
            </div>
            {% endfor %}
        </div>
        <p class="section-link">
            <a href="/apps/">Browse all apps</a>
        </p>
      </div>
    </section>

    <section id="books" class="portfolio-section page-section">
        <h2 class="section-header">Books and planners</h2>
        <div class="apps-list">
          <div class="apps-grid">
            {% for app in site.data.featured_books %}
            <div class="app">
                <a class="book-cover" href="{{ app.link }}" title="{{ app.description }}">
                    <img src="{{ app.image }}" alt="{{ app.name }} book cover">
                </a>
                <div class="app-details">
                    <a class="app-name" href="{{ app.link }}" title="{{ app.description }}">
                        <strong>{{ app.name }}</strong>
                    </a>
                    <p class="app-description">{{ app.description }}</p>
                </div>
            </div>
            {% endfor %}
        </div>
      </div>
    </section>

    <section id="building-with-ai" class="page-section ai-notes-section">
        <h2 class="section-header">Building with AI</h2>
        <p class="section-intro">
            I use AI agents to help plan, review, and improve small products,
            with clear roles, privacy boundaries, and evidence-based decisions.
        </p>
        <ul class="ai-notes-list">
            <li>
                <a href="/posts/ai-agents-roles-boundaries-review-loops">
                    Why AI Agents Need Roles, Boundaries, and Review Loops
                </a>
            </li>
            <li>
                <a href="/posts/ai-assisted-lightbox-landing-page-case-study">
                    How I Used an AI-Assisted Workflow to Improve One App Landing Page
                </a>
            </li>
        </ul>
    </section>

    <section id="blog" class="page-section">
        <h2 class="section-header">Notes</h2>
        <ul class="post-list latest-post-list">
        {% assign latest_posts = site.posts | sort: "date" | reverse %}
        {% assign visible_posts = 0 %}
        {% for post in latest_posts %}
        {% unless post.categories contains "AI" %}
        {% if visible_posts < 3 %}
        <li>
            <h3 class="post-title">
                <a href="{{ post.url | relative_url }}">
                  {{ post.title | escape }}
                </a>
            </h3>
            <p class="post-meta">
                {%- assign date_format = site.minima.date_format | default: "%b
                %-d, %Y" -%} {{ post.date | date: date_format }}
            </p>
            <div class="post-content">
                {{ post.excerpt | strip_html | normalize_whitespace | truncate: 220 }}

                <a href="{{ post.url | relative_url }}">Continue reading…</a>
            </div>
        </li>
        {% assign visible_posts = visible_posts | plus: 1 %}
        {% endif %}
        {% endunless %}
        {% endfor %}
        </ul>
    </section>
</main>
