// タイマーを追加する標的のclass
const CLASS_TARGET_PARENT = "ltr-100d0a9";
const CLASS_TARGET = "ltr-1npqywr";

// styleを参照するclass
const CLASS_REFLECTION = "ltr-lb3bic";
const CLASS_REFLECTION_TEXT = "ltr-1qtcbde";

// 追加する要素の名前
const CUSTOM_TIMER_ID = "custom-timer";
const CUSTOM_TIMER_TEXT_ID = "custom-timer-text";

const createTimer = () => {
    const controlsParentContainer = document.querySelector(`.${CLASS_TARGET_PARENT}`);
    if (!controlsParentContainer) return;
    const controlsContainer = controlsParentContainer.querySelector(`.${CLASS_TARGET}`);
    if (!controlsContainer) return;
    const controlsReflection = controlsParentContainer.querySelector(`.${CLASS_REFLECTION_TEXT}`);
    if (!controlsReflection) return;

    let timerDiv = document.createElement("div");
    timerDiv.id = CUSTOM_TIMER_ID;
    timerDiv.className = CLASS_REFLECTION;    // 残り時間のstyleを流用
    timerDiv.style.alignItems = "center";
    timerDiv.style.justifyContent = "center";
    controlsContainer.prepend(timerDiv);

    // paddingを左右反転
    const computedStyle = window.getComputedStyle(timerDiv);
    timerDiv.style.paddingRight = computedStyle.paddingLeft;
    timerDiv.style.paddingLeft = "0";

    let timerTextSpan = document.createElement("span");
    timerTextSpan.id = CUSTOM_TIMER_TEXT_ID;
    timerTextSpan.className = CLASS_REFLECTION_TEXT;
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
        const controlsContainer = document.querySelector(`.${CLASS_TARGET_PARENT}`);
        if (controlsContainer && !document.getElementById(CUSTOM_TIMER_ID)) {
            createTimer();
            updateTimer();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
};

// 初期化
observeControls();
setInterval(updateTimer, 300); // 0.3秒ごとに更新