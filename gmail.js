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

function getURLToOpen() {
  return getGitHubPRURL() || getGitHubIssueURL() || getGitHubCommitURL() || getSourcegraphURL();
}

(function() {
  let intervalID;
  let i = 0;
  const maxI = 50;
  const checkForQuickOpenURLs = () => {
    if (i <= 0 && intervalID) {
      clearInterval(intervalID)
      i = 0;
      intervalID = undefined;
      return;
    }
    i--;

    const u = getURLToOpen();
    if (u) {
      chrome.runtime.sendMessage({ name: "openChildTabs", url: u.href });
      if (intervalID) {
        clearInterval(intervalID);
        i = 0;
        intervalID = undefined;
      }
      return;
    }
  }

  const newPage = event => {
    if (!isGmailEmailPage()) {
      return;
    }

    if (intervalID) { // existing loop already exists
      i = maxI;
      return;
    }
    i = maxI;
    intervalID = setInterval(checkForQuickOpenURLs, 500);
  }

  window.addEventListener('popstate', newPage)
})();

function isGmailEmailPage() {
  return window.location.hostname === "mail.google.com" && window.location.href.match(/\/[A-Za-z]{32}$/g);
}
