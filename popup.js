(function() {
  const domainInput = document.getElementById('domain');
  const closeTabsBtn = document.getElementById('closeTabs');
  const status = document.getElementById('status');

  function showStatus(message, isError = false) {
    status.textContent = message;
    status.className = isError ? 'error' : 'success';
    status.style.display = 'block';
    setTimeout(() => {
      status.style.display = 'none';
    }, 3000);
  }

  function patternToRegex(pattern) {
    // Convert basic glob patterns to regex
    // * matches any characters except /
    // *.domain.com matches subdomains
    const escaped = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '[^/]*');
    return new RegExp(escaped, 'i');
  }

  function matchesPattern(url, pattern) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      // Exact match
      if (hostname === pattern) {
        return true;
      }
      
      // Subdomain match (pattern starts with *.)
      if (pattern.startsWith('*.')) {
        const domain = pattern.substring(2);
        return hostname === domain || hostname.endsWith('.' + domain);
      }
      
      // Pattern ends with * (domain prefix match)
      if (pattern.endsWith('*')) {
        const prefix = pattern.substring(0, pattern.length - 1);
        return hostname.startsWith(prefix);
      }
      
      // General glob pattern match
      const regex = patternToRegex(pattern);
      return regex.test(hostname);
    } catch (e) {
      return false;
    }
  }

  closeTabsBtn.addEventListener('click', async () => {
    const pattern = domainInput.value.trim();
    
    if (!pattern) {
      showStatus('Please enter a domain or pattern', true);
      return;
    }

    try {
      const tabs = await chrome.tabs.query({});
      const tabsToClose = tabs.filter(tab => matchesPattern(tab.url, pattern));
      
      if (tabsToClose.length === 0) {
        showStatus('No tabs found matching the pattern');
        return;
      }

      const tabIds = tabsToClose.map(tab => tab.id);
      await chrome.tabs.remove(tabIds);
      
      showStatus(`Closed ${tabIds.length} tab(s)`);
      domainInput.value = '';
    } catch (error) {
      console.error('Error closing tabs:', error);
      showStatus('Error closing tabs: ' + error.message, true);
    }
  });

  // Allow Enter key to trigger close
  domainInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      closeTabsBtn.click();
    }
  });
})();
