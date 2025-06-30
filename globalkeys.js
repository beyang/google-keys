(function() {
  const isMacOS = navigator.platform.includes('Mac');

  document.addEventListener('keydown', function (event) {
    if (isMacOS && event.ctrlKey && event.key === "v") {
      event.preventDefault();
      window.scrollBy(0, window.innerHeight);
    } else if (isMacOS && event.altKey && (event.key === "v" || event.key === "√")) {
      event.preventDefault();
      window.scrollBy(0, -window.innerHeight);
    }
  }, false);
})();
