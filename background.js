const TARGET_URL = "https://www.netflix.com/watch/";

const devLog = (...args) => {
    if (chrome.runtime.getManifest().env === 'dev') {
        console.log(...args);
    }
};

const devWarn = (...args) => {
    if (chrome.runtime.getManifest().env === 'dev') {
        console.warn(...args);
    }
};
   
let activeWatchTabIds = new Set();
const activateTab = (tabId) => {
    activeWatchTabIds.add(tabId);
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["content.js"],
    }).then(() => {
        chrome.tabs.sendMessage(tabId, { type: "TAB_ACTIVATED" });
    });
};

const inactivatedTab = (tabId) => {
    activeWatchTabIds.delete(tabId);
    chrome.tabs.sendMessage(tabId, { type: "TAB_INACTIVATED" });
};

// 再生ページの開始/終了イベント
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        const url = tab.url || '';
        if (url.includes(TARGET_URL)) {
            devLog('Netflix再生ページに入りました');
            activateTab(tabId);
        } else if (activeWatchTabIds.has(tabId)) {
            // 再生ページから離れたと判断
            devLog('Netflix再生ページから離れました');
            // トリガー処理をここに
            inactivatedTab(tabId);
        }
    }
});

// 再生ページタブのアクティブ/非アクティブイベント
let lastNetflixTabId;
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url && tab.url.includes(TARGET_URL)) {
            devLog('Netflixタブに戻ってきた');
            lastNetflixTabId = activeInfo.tabId;
            activateTab(lastNetflixTabId);
        } else if (lastNetflixTabId) {
            devLog('Netflix以外のタブに移動した');
            inactivatedTab(lastNetflixTabId);
            lastNetflixTabId = null;
        }
    });
});

