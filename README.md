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

### Build check

```sh
mise exec ruby@3.3.0 -- bundle exec jekyll build --destination /private/tmp/handcrafted-software-site --disable-disk-cache
```
