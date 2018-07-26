(function() {
  document.addEventListener('keyup', (event) => {
    if (event.key === "V" && event.ctrlKey && !event.altKey && !event.metaKey && event.shiftKey) {
      let url = Array.prototype.slice.call(document.querySelectorAll('a[href*="/issues/"]')).pop();
      if (url) {
        window.open(url, "_blank");
      }
    }
  });
})();
