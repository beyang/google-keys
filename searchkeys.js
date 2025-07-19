(function() {
  new KeyboardNav({
    resultSelectors: ["div.yuRUbf a[href] h3"],
    cssClass: "google-keys",
    cssStyle: '.quick-selected::before { content: "> "; position: absolute; left: -15px; color: #1a73e8; font-weight: bold; }',
    searchBoxSelector: "input.gsfi"
  });
})();
