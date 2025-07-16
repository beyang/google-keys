(function() {
  const messageLink = document.querySelector('a[href^="/messages"]');
  if (messageLink) {
    window.location.href = messageLink.href;
  }
})();
