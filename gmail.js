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

function getClickCandidate() {
  for (const urlFn of [getGitHubPRURL, getGitHubIssueURL, getGitHubCommitURL, getSourcegraphURL]) {
    const url = urlFn()
    if (url) {
      return url;
    }
  }
  return null;
}

function preload(url) {
  var i = document.createElement('iframe');
  i.style.display = 'none';
  i.onload = function() { i.parentNode.removeChild(i); };
  i.src = url;
  document.body.appendChild(i);
}

(function() {
  document.addEventListener('keyup', (event) => {
    if (event.key === "V" && event.ctrlKey && !event.altKey && !event.metaKey && event.shiftKey) {
      const url = getClickCandidate()
      if (url) {
        window.open(url, "_blank");
      }
    }

    if (event.key === "F" && event.ctrlKey && !event.altKey && !event.metaKey && event.shiftKey) {
      setTimeout(() => {
        const url = getClickCandidate();
        console.log('url', url);
        if (url) {
          preload(url)
        }
      }, 5000);
    }

    
  });


})();
