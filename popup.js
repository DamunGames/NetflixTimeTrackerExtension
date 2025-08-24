const checkboxTimeDisplayUseRatio = document.getElementById('ntt.timeDisplay.useRatio');

chrome.storage.local.get(null, ((data) => {console.log(data)}));

// 初期状態の読み込み
chrome.storage.local.get('ntt.timeDisplay.useRatio', (data) => {
    checkboxTimeDisplayUseRatio.checked = data['ntt.timeDisplay.useRatio'] ?? false;
});

// 状態変更時に保存
checkboxTimeDisplayUseRatio.addEventListener('change', () => {
    chrome.storage.local.set({ 'ntt.timeDisplay.useRatio': checkboxTimeDisplayUseRatio.checked });
});