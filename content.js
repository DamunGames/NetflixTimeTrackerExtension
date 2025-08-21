// タイマーを追加する標的のclass
const BOTTOM_CONTROLS_PARENT = ".ltr-100d0a9";
const BOTTOM_CONTROLS_PARENT_CACHE = ".default-ltr-iqcdef-cache-100d0a9";
const TIMELINE_PARENT = ".ltr-1npqywr";
const TIMELINE_PARENT_CACHE = ".default-ltr-iqcdef-cache-1npqywr";

// styleを参照するclass
const REFLECTION_TIMER_DIV = ".ltr-lb3bic";
const REFLECTION_TIMER_DIV_CACHE = ".default-ltr-iqcdef-cache-lb3bic";
const REFLECTION_TIMER_SPAN = ".ltr-1qtcbde";
const REFLECTION_TIMER_SPAN_CACHE = ".default-ltr-iqcdef-cache-1qtcbde";

// 追加する要素の名前
const CUSTOM_TIMER_ID = "custom-timer";
const CUSTOM_TIMER_TEXT_ID = "custom-timer-text";

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

const querySelectorWithLog = (parent, selector, selector2) => {
    const element = parent.querySelector(selector);
    const element2 = parent.querySelector(selector2);
    if (!element && !element2) {
        devWarn(`${parent}: not found query ${selector} ${selector2}`);
    }
    if (element) return element;
    return element2;
}

const createTimer = () => {
    const bottomControlsParent = querySelectorWithLog(document, BOTTOM_CONTROLS_PARENT, BOTTOM_CONTROLS_PARENT_CACHE);
    if (!bottomControlsParent) return;
    const timelineParent = querySelectorWithLog(bottomControlsParent, TIMELINE_PARENT, TIMELINE_PARENT_CACHE);
    if (!timelineParent) return;
    const reflectionTimerDiv = querySelectorWithLog(bottomControlsParent, REFLECTION_TIMER_DIV, REFLECTION_TIMER_DIV_CACHE);
    if (!reflectionTimerDiv) return;
    const reflectionTimerSpan = querySelectorWithLog(reflectionTimerDiv, REFLECTION_TIMER_SPAN, REFLECTION_TIMER_SPAN_CACHE);
    if (!reflectionTimerSpan) return;

    let timerDiv = document.createElement("div");
    timerDiv.id = CUSTOM_TIMER_ID;
    timerDiv.className = reflectionTimerDiv.className;    // 残り時間のstyleを流用
    timerDiv.style.alignItems = "center";
    timerDiv.style.justifyContent = "center";
    timelineParent.prepend(timerDiv);

    // paddingを左右反転
    const computedStyle = window.getComputedStyle(timerDiv);
    timerDiv.style.paddingRight = computedStyle.paddingLeft;
    timerDiv.style.paddingLeft = "0";

    let timerTextSpan = document.createElement("span");
    timerTextSpan.id = CUSTOM_TIMER_TEXT_ID;
    timerTextSpan.className = reflectionTimerSpan.className;
    timerDiv.appendChild(timerTextSpan);
};

const updateTimer = () => {
    const video = document.querySelector("video");
    const timerTextSpan = document.getElementById(CUSTOM_TIMER_TEXT_ID);

    if (!video || !timerTextSpan) return;

    timerTextSpan.innerText = `${formatTime(video.currentTime)}`;
};

// 分:秒 形式に変換
const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// 要素の監視（MutationObserver）
const observeControls = () => {
    const observer = new MutationObserver(() => {
        if (querySelectorWithLog(document, BOTTOM_CONTROLS_PARENT, BOTTOM_CONTROLS_PARENT_CACHE) && !document.getElementById(CUSTOM_TIMER_ID)) {
            createTimer();
            updateTimer();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
};

// 初期化
observeControls();
setInterval(updateTimer, 300); // 0.3秒ごとに更新