// DOM要素のキャッシュ
let appContainer, screen1, screen2, screen3, screen4, screen5,
    subjectNameInput, subjectAgeInput, subjectEmailInput, goToScreen2Btn, startExperimentBtn,
    canvasContainer, clusterCanvas, ctx,
    finishPlacementBtn, goToFeedbackBtn, saveFeedbackAndDataBtn, submitAndFinishBtn,
    loadingSpinner, statusMessage, detailsPanel,
    backToScreen1Btn, backToScreen2Btn, backToStartBtn2;

// グローバル変数
let experimentData = { subjectInfo: {}, positions: [], clusters: [], placementTime: null, moveHistory: [] };
let currentMode = 'intro', foodContainers = {}, isDrawingCluster = false, currentDrawingCluster = null, activeDeleteButton = null, selectedClusterIndexForDeletion = -1;
let infoViewStartTime = null, lastViewedFood = null;

// 食品リスト
const foodList = [
    { name: "gyoza", label: "餃子", imgSrc: "gyoza.jpg", info: "油・水なしで、誰が調理しても簡単にパリッパリの羽根ができる、うす皮パリッと、ジューシーで具がギュッと詰まった焼き餃子です。\n国産のお肉と野菜を使用しています。" },
    { name: "chahan", label: "チャーハン", imgSrc: "chahan.png", info: "焦がしにんにくのマー油と葱油の香ばしさや、噛むほどに広がる焼豚のうま味で、一心不乱に食べきってしまいたくなるチャーハンです。" },
    { name: "empanada", label: "エンパナーダ", imgSrc: "empanada.jpg", info: "アルゼンチン伝統料理。パイ生地にお好みの具材を包んでオーブンで焼いた、南米で人気のミートパイです。" },
    { name: "gratin", label: "グラタン", imgSrc: "gratin.png", info: "蔵王産ミルクを使用。チーズのおいしさとプリプリのえびがマッチしたグラタンです。" },
    { name: "lasagna", label: "ラザニア", imgSrc: "lasagna.png", info: "オーブンで焼き上げたチーズが香ばしい、生パスタを使った本格ラザニアです。" },
    { name: "australian_meatpie", label: "オーストラリアンミートパイ", imgSrc: "australian_meatpie.jpg", info: "チーズ風味が香るミートソースは、100%オージービーフを使用。サクサクのパイ生地とのコンビネーションを楽しめます。" },
    { name: "ravioli", label: "ラビオリ", imgSrc: "ravioli.webp", info: "爽やかな風味のリコッタチーズとほうれん草をパスタ生地で包みトマトソースで和えたラビオリです。" },
    { name: "yakionigiri", label: "焼きおにぎり", imgSrc: "yakionigiri.jpg", info: "ニッスイの独自技術「香りのＷアップ製法」で、しょうゆの風味と香りをより引き立たせました。" },
    { name: "reitou_udon", label: "冷凍うどん", imgSrc: "reitou_udon.jpg", info: "強いコシと弾力のさぬきうどんに、瀬戸内産いりこを使用しただし香るつゆが特徴です。" },
    { name: "reitou_pasta", label: "冷凍パスタ", imgSrc: "reitou_pasta.jpg", info: "牛挽肉の旨みと赤ワインの風味が特長のボロネーゼソース。ゴーダチーズと揚げなすをトッピング。" },
    { name: "fried_potato", label: "フライドポテト", imgSrc: "fried_potato.jpg", info: "じゃがいもを細長く切って油で揚げた、世界中で人気のスナック。家庭で手軽に楽しめます。" },
    { name: "karaage", label: "鶏のから揚げ", imgSrc: "karaage.png", info: "食欲を満たす肉の塊、これぞから揚げの金字塔！秘伝にんにく油、葱油、特級醤油の極旨仕込みだれが特徴です。" }
];

function getCurrentTimestamp() {
    return experimentData.startTime ? Math.floor((Date.now() - experimentData.startTime) / 1000) : 0;
}

function showScreen(screenToShow) {
    [screen1, screen2, screen3, screen4, screen5].forEach(s => s && s.classList.remove('active'));
    screenToShow && screenToShow.classList.add('active');
    appContainer && appContainer.classList.add('active');
}

function updateStepper(currentStepIndex) {
    const steps = document.querySelectorAll('.stepper .step');
    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index < currentStepIndex) step.classList.add('completed');
        else if (index === currentStepIndex) step.classList.add('active', 'completed');
    });
}

function initializeApp() {
    // DOM要素取得
    appContainer = document.getElementById('app');
    screen1 = document.getElementById('screen1');
    screen2 = document.getElementById('screen2');
    screen3 = document.getElementById('screen3');
    screen4 = document.getElementById('screen4');
    screen5 = document.getElementById('screen5');
    subjectNameInput = document.getElementById('subjectName');
    subjectAgeInput = document.getElementById('subjectAge');
    subjectEmailInput = document.getElementById('subjectEmail');
    goToScreen2Btn = document.getElementById('goToScreen2Btn');
    startExperimentBtn = document.getElementById('startExperimentBtn');
    canvasContainer = document.getElementById('canvas-container');
    clusterCanvas = document.getElementById('clusterCanvas');
    ctx = clusterCanvas ? clusterCanvas.getContext('2d') : null;
    finishPlacementBtn = document.getElementById('finishPlacementBtn');
    goToFeedbackBtn = document.getElementById('goToFeedbackBtn');
    saveFeedbackAndDataBtn = document.getElementById('saveFeedbackAndDataBtn');
    submitAndFinishBtn = document.getElementById('submitAndFinishBtn');
    loadingSpinner = document.getElementById('loadingSpinner');
    statusMessage = document.getElementById('statusMessage');
    detailsPanel = document.getElementById('details-panel');
    backToScreen1Btn = document.getElementById('backToScreen1Btn');
    backToScreen2Btn = document.getElementById('backToScreen2Btn');
    backToStartBtn2 = document.getElementById('backToStartBtn2');

    // イベントリスナ設定
    goToScreen2Btn.addEventListener('click', () => {
        if (!subjectNameInput.value.trim() || !subjectAgeInput.value.trim() || !subjectEmailInput.value.trim()) return alert("全ての項目を入力してください。");
        experimentData.subjectInfo = { name: subjectNameInput.value, age: subjectAgeInput.value, email: subjectEmailInput.value };
        showScreen(screen2);
        updateStepper(1);
    });

    startExperimentBtn.addEventListener('click', () => {
        showScreen(screen3);
        updateStepper(2);
        currentMode = 'placement';
        initializeExperiment();
    });

    finishPlacementBtn.addEventListener('click', () => {
        currentMode = 'clustering';
        updateStepper(3);
        // ... 他の処理
    });

    goToFeedbackBtn.addEventListener('click', () => {
        currentMode = 'clusterFeedback';
        updateStepper(4);
        // ... 他の処理
    });

    saveFeedbackAndDataBtn.addEventListener('click', () => {
        // ... バリデーション ...
        showScreen(screen4);
        updateStepper(5);
    });

    submitAndFinishBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        // ... データ送信 ...
        showScreen(screen5);
        updateStepper(6);
    });

    backToScreen1Btn.addEventListener('click', () => {
        showScreen(screen1);
        updateStepper(0);
    });

    // ... 他のイベントリスナ ...
}

// ... 他の関数 (initializeExperiment, makeDraggable, etc.) ...

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    updateStepper(0);
});