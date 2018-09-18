function getGitHubPRURL() {
  return Array.prototype.slice.call(document.querySelectorAll('a[href^="https://github.com/"]')).filter(a => a.href.indexOf("/pull/") >= 0).pop();
}

function getGitHubCommitURL() {
  return Array.prototype.slice.call(document.querySelectorAll('a[href^="https://github.com/"]')).filter(a => a.href.indexOf("/commit/") >= 0).pop();
}

function getGitHubIssueURL() {
  return Array.prototype.slice.call(document.querySelectorAll('a[href^="https://github.com/"]')).filter(a => a.href.indexOf("/issues/") >= 0).pop();
}

function getSourcegraphURL() {
  return Array.prototype.slice.call(document.querySelectorAll('a[href^="httpsf://sourcegraph"]')).filter(a => a.innerText.toLowerCase() === "view it on sourcegraph").pop();
}

(function() {
  document.addEventListener('keyup', (event) => {
    if (event.key === "V" && event.ctrlKey && !event.altKey && !event.metaKey && event.shiftKey) {
      for (const urlFn of [getGitHubPRURL, getGitHubIssueURL, getGitHubCommitURL, getSourcegraphURL]) {
        const url = urlFn()
        if (url) {
          window.open(url, "_blank");
          return;
        }
      }
    }
  });
})();
