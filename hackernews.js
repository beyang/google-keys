(function() {
  new KeyboardNav({
    resultSelectors: ["tr.athing td.title span.titleline a[href]:not([href^='from?site=']), tr td.subtext a[href^='item?id=']"],
    cssClass: "hackernews-keys",
    cssStyle: '.quick-selected { background-color: rgba(255, 102, 0, 0.1) !important; border-radius: 2px !important; }',
    searchBoxSelector: "input[name='q']",
    processResults: (results) => results.filter(link => 
      !link.href.includes('item?id=') || link.textContent.includes('comment')
    )
  });
})();
