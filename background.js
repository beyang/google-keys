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

function isSameURL(u, v) {
    return u === v;
}

chrome.webNavigation.onBeforeNavigate.addListener(async (navEvent) => {
    if (!await tabExists(navEvent.tabId)) {
        console.log("Skipping nonexistent (pre-rendered) tab", navEvent.tabId)
        return
    }
    const currentTab = await new Promise(resolve => chrome.tabs.get(navEvent.tabId, t => resolve(t)))
    const windows = await new Promise(resolve => chrome.windows.getAll({ populate: true, windowTypes: ['normal'] }, windows => resolve(windows)));
    const tabs = (await Promise.all(
        windows.map(w => new Promise(resolve => chrome.tabs.getAllInWindow(w.id, tabs => resolve(tabs))))
    )).flatMap(tabs => tabs);

    const matchingTabs = tabs.filter(tab => tab.id !== navEvent.tabId && isSameURL(tab.url, navEvent.url));
    if (matchingTabs.length === 0) {
        return;
    }
    const matchingTab = matchingTabs[0]
    const { index: matchingTabIndex, windowId: matchingTabWindowId } = matchingTab

    // Create new tab in matching tab's window (so window remains after tab is moved)
    const placeholderTab = await new Promise(resolve => chrome.tabs.create({ windowId: matchingTab.windowId }, resolve))

    // Move matching tab after current tab
    await new Promise(resolve => chrome.tabs.move(matchingTab.id, { windowId: currentTab.windowId, index: currentTab.index + 1 }, resolve))

    // Make matching tab the active one
    await new Promise(resolve => chrome.tabs.update(matchingTab.id, { active: true }, resolve))

    // Move current tab (no longer active) to matching tab's former window
    await new Promise(resolve => chrome.tabs.move(currentTab.id, { windowId: matchingTabWindowId, index: matchingTabIndex }, resolve))

    // Clean up empty tab in matching tab's former window
    await new Promise(resolve => chrome.tabs.remove(placeholderTab.id, resolve))
});

async function tabExists(tabId) {
    const windows = await new Promise(resolve => chrome.windows.getAll({ populate: true, windowTypes: ['normal'] }, windows => resolve(windows)))
    return (await Promise.all(
        windows.map(w => new Promise(resolve => chrome.tabs.getAllInWindow(w.id, tabs => resolve(tabs.map(t => t.id).includes(tabId)))))
    )).includes(true)
}

// Debug function
async function printAllWindowsAndTabs() {
    const windows = await new Promise(resolve => chrome.windows.getAll({ populate: true, windowTypes: ['normal'] }, windows => resolve(windows)))
    for (const w of windows) {
        console.log("  window", window.id, window)
        const tabs = await new Promise(resolve => chrome.tabs.getAllInWindow(w.id, tabs => resolve(tabs)))
        if (!tabs) {
            continue
        }
        for (const t of tabs) {
            console.log("    tab", t.id, t.url, t)
        }
    }
}
