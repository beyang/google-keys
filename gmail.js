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

function isGmailEmailPage() {
  return window.location.hostname === "mail.google.com" && window.location.href.match(/\/[A-Za-z]{32}$/g);
}

function isGmailMessageOrThreadPage() {
  if (window.location.hostname !== "mail.google.com") {
    return false;
  }
  
  const hash = window.location.hash;
  
  // Check if we're on a specific message/thread page (not inbox or other list views)
  // This includes:
  // - Individual messages: /#inbox/FMfcgzQbgJQhkfRngZvnhsTqZRCdNdfl
  // - Search results with specific message: /#search/.../FMfcgzQbgJQhkfRngZvnhsTqZRCdNdfl
  // - Other folder messages: /#sent/abc123, /#drafts/def456, etc.
  
  // Look for the Gmail message ID pattern at the end of the URL
  // Gmail message IDs are typically long alphanumeric strings
  const messageIdPattern = /\/[A-Za-z0-9]{15,}$/;
  
  // We want to enable the feature when we're viewing a specific message/thread
  // This means the URL should end with a message ID
  return messageIdPattern.test(hash);
}

function showCopiedNotification() {
  const notification = document.createElement('div');
  notification.textContent = 'Copied permalink';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #4CAF50;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 2000);
}

function copyCurrentURL() {
  const currentURL = window.location.href;
  
  // Transform the URL to a cleaner format
  // Extract the message ID from the end of the URL
  const messageIdMatch = currentURL.match(/\/([A-Za-z0-9]{15,})$/);
  
  if (messageIdMatch) {
    const messageId = messageIdMatch[1];
    // Extract the base URL parts
    const baseMatch = currentURL.match(/^(https:\/\/mail\.google\.com\/mail\/u\/\d+\/)/);
    
    if (baseMatch) {
      const baseURL = baseMatch[1];
      const cleanURL = `${baseURL}#all/${messageId}`;
      
      navigator.clipboard.writeText(cleanURL).then(() => {
        showCopiedNotification();
      }).catch(err => {
        console.error('Failed to copy URL:', err);
      });
      return;
    }
  }
  
  // Fallback to original URL if transformation fails
  navigator.clipboard.writeText(currentURL).then(() => {
    showCopiedNotification();
  }).catch(err => {
    console.error('Failed to copy URL:', err);
  });
}

const isMacOS = navigator.platform.includes('Mac');

document.addEventListener('keydown', function(event) {
  if (!isGmailMessageOrThreadPage()) {
    return;
  }
  
  const isShiftCmdL = isMacOS && event.shiftKey && event.metaKey && event.key === 'l';
  const isShiftCtrlL = !isMacOS && event.shiftKey && event.ctrlKey && event.key === 'l';
  
  if (isShiftCmdL || isShiftCtrlL) {
    event.preventDefault();
    copyCurrentURL();
  }
}, false);

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
