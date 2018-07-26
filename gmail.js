(function() {
  document.addEventListener('keyup', (event) => {
    if (event.key === "V" && event.ctrlKey && !event.altKey && !event.metaKey && event.shiftKey) {
      let url = Array.prototype.slice.call(document.querySelectorAll('a[href^="https://github.com/"]')).filter(a => a.href.indexOf("/issues/") >= 0 || a.href.indexOf("/pull/") >= 0).pop();
      if (url) {
        window.open(url, "_blank");
      }
    }
  });
})();
