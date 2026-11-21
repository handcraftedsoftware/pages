## handcrafted.software

Personal Jekyll site for handcrafted.software.

### Local setup

This repository currently builds with Ruby 3.3 and Bundler 2.5.23.

```sh
mise exec ruby@3.3.0 -- bundle install
```

### Run locally

```sh
mise exec ruby@3.3.0 -- bundle exec jekyll serve --host 127.0.0.1 --port 4000 --disable-disk-cache
```

Open `http://127.0.0.1:4000/`.

The standalone Senior AI Babysitter game is at `/senior-ai-babysitter/`.
Its HTML, JavaScript, CSS, and illustration live in `senior-ai-babysitter/`
and are copied directly into the Jekyll build.

### Build check

```sh
mise exec ruby@3.3.0 -- bundle exec jekyll build --destination /private/tmp/handcrafted-software-site --disable-disk-cache
```
