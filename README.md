<div align="center">
  <h1>Prompt Injection</h1>
  <p></p>
  
  <p>
    <a href="https://promptinjection.github.io" target="_blank"><b>Live site</b></a>
    ·
    <a href="https://github.com/promptinjection/promptinjection.github.io/issues" target="_blank">Report bug</a>
    ·
    <a href="https://github.com/promptinjection/promptinjection.github.io/issues" target="_blank">Request feature</a>
  </p>
</div>

---

## 




## Developer Guide 

Prerequisites: Ruby, Bundler, Jekyll

```bash
gem install bundler jekyll
bundle install
bundle exec jekyll serve
```

Then open `http://127.0.0.1:4000` in your browser.

## Project Structure

- `_layouts/default.html` — main layout and header/footer
- `style.css` — global styles, theme, cards, modal
- `script.js` — rendering, search, modal, platform open logic
- `prompt-injection.csv` — dataset of prompts (source content)
- `_config.yml` — site config (GitHub Pages URL/baseurl set)

## Deploy (GitHub Pages)

This repository is configured for GitHub Pages. Push to `main` and Pages will build and serve at:

- User/org site: `https://promptinjection.github.io`

If you later add a custom domain, update the `CNAME` file and set `url` in `_config.yml` accordingly.

## Contributing

Contributions are welcome! Fix UI, add categories, improve prompts, or refine copy.

1) Fork this repo
2) Create a feature branch
3) Commit your changes
4) Open a PR

## License

MIT — see `LICENSE`.

---
