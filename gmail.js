function getGitHubURL() {
  return Array.prototype.slice.call(document.querySelectorAll('a[href^="https://github.com/"]')).filter(a => a.href.indexOf("/issues/") >= 0 || a.href.indexOf("/pull/") >= 0).pop();
}

function getSourcegraphURL() {
  return Array.prototype.slice.call(document.querySelectorAll('a[href^="https://sourcegraph"]')).filter(a => a.innerText.toLowerCase() === "view it on sourcegraph").pop();
}

function shouldActivate(event) {
  if (event.key === "V" && event.ctrlKey && !event.altKey && !event.metaKey && event.shiftKey) {
    return true;
  }
  if (window.navigator.platform.startsWith("MacIntel") && event.key === "V" && !event.ctrlKey && !event.altKey && event.metaKey && event.shiftKey) {
    return true;
  }
  return false;
}

(function() {
  document.addEventListener('keyup', (event) => {
    if (shouldActivate(event)) {
      const sgURL = getSourcegraphURL();
      if (sgURL) {
        window.open(sgURL, "_blank");
        return;
      }
      const ghURL = getGitHubURL();
      if (ghURL) {
        window.open(ghURL, "_blank");
        return;
      }
    }
  });
})();
