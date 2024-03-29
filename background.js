chrome.runtime.onInstalled.addListener(function() {
  console.log("Beyang's Chrome extension has been installed")
});

const childrenTabs = {}

chrome.tabs.onRemoved.addListener(tabId => {
  const childTabIds = childrenTabs[tabId];
  if (!childTabIds) {
    return;
  }
  console.log("in response to tab closing", tabId, "deleting tabs", childTabIds);
  childTabIds.forEach(tabId => {
    chrome.tabs.remove(tabId);
  })
  delete childrenTabs[tabId];
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.name !== "openChildTabs") {
    sendResponse(null);
    return
  }

  chrome.tabs.create({
    url: request.url,
    index: sender.tab.index + 1,
    active: false
  }, (tab) => {
    childrenTabs[sender.tab.id] = [tab.id];
  });

  sendResponse({ "done": true });
});
