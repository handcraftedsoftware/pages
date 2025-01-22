---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
title: "Turning ideas into apps and books that inspire"
---



<header>
    <div class="hero page-section">
        <h1 class="section-header">Turning ideas into apps and books that inspire</h1>
        <p>
            Creating unique apps and engaging books to
            inspire and empower.
        </p>
    </div>
</header>

<main>
    <section class="featured-ios-apps page-section">
      <h2 class="section-header">Featured Apps</h2>
      <div class="apps-list">
          <div class="apps-grid">
            {% for app in site.data.featured_ios_apps %}
            <div class="app">
                <a class="app-icon" href="{{ app.link }}" title="{{ app.description }}">
                    <img src="{{ app.image }}" alt="{{ app.name }}">
                </a>
                <div class="app-details">
                    <a class="app-name" href="{{ app.link }}" title="{{ app.description }}">
                        <strong>{{ app.name }}</strong>
                    </a>
                    <p class="app-desription">{{ app.description }}</p>
                </div>
            </div>
            {% endfor %}
        </div>
      </div>
    </section>

    <section id="books" class="portfolio-section page-section">
        <h2 class="section-header">Books</h2>
        <div class="apps-list">
          <div class="apps-grid">
            {% for app in site.data.featured_books %}
            <div class="app">
                <a class="book-cover" href="{{ app.link }}" title="{{ app.description }}">
                    <img src="{{ app.image }}" alt="{{ app.name }}">
                </a>
                <div class="app-details">
                    <a class="app-name" href="{{ app.link }}" title="{{ app.description }}">
                        <strong>{{ app.name }}</strong>
                    </a>
                    <p class="app-desription">{{ app.description }}</p>
                </div>
            </div>
            {% endfor %}
        </div>
      </div>
    </section>

    <section id="about" class="page-section">
        <h2 class="section-header">About Me</h2>
        <div class="about-content" style="display: flex">
            <img
              style="border-radius: 50%; margin-right: 1rem; width: 8rem; height: 8rem;"
                src="/assets/images/profile.png"
                alt="Profile Picture"
                class="profile-pic"
            />
            <p>
            Hi! I'm Natalia, a developer dedicated to creating apps that inspire and empower.
            My passion lies in bringing ideas to life and crafting seamless,
            user-focused experiences that truly make a difference.
            With every project, I strive to merge creativity and functionality,
            transforming complex problems into elegant solutions.
            </p>
        </div>
    </section>

    <section id="blog" class="page-section">
        <h2 class="section-header">Latest Posts</h2>
        <ul class="post-list latest-post-list">
        {% assign latest_posts = site.posts | sort "date" | reverse | slice: 0, 3 %}
        {% for post in latest_posts %}
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
                {{ post.excerpt }}

                <a href="{{ post.url | relative_url }}">Continue reading…</a>
            </div>
        </li>
        {% endfor %}
        </ul>
    </section>
</main>
