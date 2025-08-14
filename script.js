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
    [screen1, screen2, screen3, screen4, screen5].forEach(s => {
        if (s) s.style.display = 'none';
    });
    if (screenToShow) screenToShow.style.display = 'flex';
    if (appContainer) appContainer.classList.add('active');
}

function updateStepper(currentStepIndex) {
    const steps = document.querySelectorAll('.stepper .step');
    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index < currentStepIndex) {
            step.classList.add('completed');
        } else if (index === currentStepIndex) {
            step.classList.add('active', 'completed');
        }
    });
}

function displayFoodDetails(food) {
    const nameEl = document.getElementById('details-food-name');
    const imageEl = document.getElementById('details-food-image');
    const infoEl = document.getElementById('details-food-info');
    const placeholderEl = document.getElementById('details-placeholder');

    if (!detailsPanel || !nameEl || !imageEl || !infoEl || !placeholderEl) return;
    if (currentMode === 'clusterFeedback' && detailsPanel.querySelector('.cluster-feedback-item')) return;
    
    if (!food) {
        nameEl.textContent = '';
        imageEl.src = '';
        imageEl.style.display = 'none';
        infoEl.innerHTML = '';
        placeholderEl.style.display = 'block';
        detailsPanel.scrollTop = 0;
        Object.values(foodContainers).forEach(fc => fc.classList.remove('selected-food-item'));
        return;
    }
    nameEl.textContent = food.label;
    imageEl.src = food.imgSrc;
    imageEl.style.display = 'block';
    infoEl.innerHTML = food.info ? food.info.replace(/\n/g, '<br>') : '情報なし';
    placeholderEl.style.display = 'none';
    detailsPanel.scrollTop = 0;
    Object.values(foodContainers).forEach(fc => fc.classList.remove('selected-food-item'));
    if (foodContainers[food.name]) foodContainers[food.name].classList.add('selected-food-item');
}

function resetScreen3UI() {
    if (canvasContainer) {
        canvasContainer.querySelectorAll('.food-container').forEach(fc => fc.remove());
    }
    if (ctx && clusterCanvas) {
        ctx.clearRect(0, 0, clusterCanvas.width, clusterCanvas.height);
    }
    foodContainers = {};
    experimentData.clusters = [];
    drawAllClusters();

    if (detailsPanel) {
        detailsPanel.innerHTML = `<h3 id="details-food-name"></h3><img id="details-food-image" src="" alt="選択された食品の画像" style="display:none;"><div id="details-food-info"></div><p id="details-placeholder" class="info-text" style="display:block;">食品の[i]ボタンをクリックすると、ここに詳細情報が表示されます。</p>`;
    }
    if (statusMessage) updateStatusMessage("");
    if (finishPlacementBtn) finishPlacementBtn.style.display = 'none';
    if (goToFeedbackBtn) goToFeedbackBtn.style.display = 'none';
    if (saveFeedbackAndDataBtn) saveFeedbackAndDataBtn.style.display = 'none';
    if (clusterCanvas) clusterCanvas.classList.remove('active-drawing');
    removeActiveDeleteButton();
    isDrawingCluster = false;
    currentDrawingCluster = null;
}

function initializeApp() {
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
        Object.values(foodContainers).forEach(container => {
            const handle = container.querySelector('.drag-handle');
            if (handle) { handle.style.cursor = 'default'; handle.onmousedown = null; }
        });
        displayFoodDetails(null);
        clusterCanvas.classList.add('active-drawing');
        finishPlacementBtn.style.display = 'none';
        goToFeedbackBtn.style.display = 'inline-block';
        updateStatusMessage('食品を円で囲んでクラスターを作成してください。');
    });

    goToFeedbackBtn.addEventListener('click', () => {
        currentMode = 'clusterFeedback';
        updateStepper(4);
        // フィードバック画面のUIを生成するロジック
    });

    saveFeedbackAndDataBtn.addEventListener('click', () => {
        // フィードバックのバリデーション
        showScreen(screen4);
        updateStepper(5);
        // アンケートフォームの生成ロジック
    });

    submitAndFinishBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        // アンケートのバリデーションとデータ送信
        showScreen(screen5);
        updateStepper(6);
    });

    backToScreen1Btn.addEventListener('click', () => {
        showScreen(screen1);
        updateStepper(0);
    });
    
    backToScreen2Btn.addEventListener('click', () => {
        if (confirm("実験説明画面に戻りますか？現在の配置やクラスターの情報はリセットされます。")) {
            resetScreen3UI();
            showScreen(screen2);
            updateStepper(1);
        }
    });

    backToStartBtn2.addEventListener('click', () => {
        if (confirm("最初の画面に戻りますか？")) {
            resetScreen3UI();
            showScreen(screen1);
            updateStepper(0);
        }
    });

    if (clusterCanvas) {
        clusterCanvas.addEventListener('mousedown', handleClusterMouseDown);
        clusterCanvas.addEventListener('click', handleClusterClick);
    }
}

function initializeExperiment() {
    infoViewStartTime = null;
    lastViewedFood = null;

    if (!canvasContainer || !clusterCanvas || !ctx) return;
    clusterCanvas.width = canvasContainer.clientWidth;
    clusterCanvas.height = canvasContainer.clientHeight;
    experimentData.startTime = Date.now();
    experimentData.moveHistory = [];
    experimentData.clusters = [];
    experimentData.positions = [];

    canvasContainer.querySelectorAll('.food-container').forEach(fc => fc.remove());
    foodContainers = {};

    foodList.forEach((food) => {
        const foodContainer = document.createElement('div');
        foodContainer.className = 'food-container';
        foodContainer.dataset.name = food.name;

        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        const actionButton = document.createElement('div');
        actionButton.className = 'info-button'; actionButton.textContent = 'i';
        dragHandle.appendChild(actionButton);
        foodContainer.appendChild(dragHandle);
        
        const img = document.createElement('img');
        img.src = food.imgSrc;
        img.alt = food.label;
        img.className = 'food-image';
        foodContainer.appendChild(img);
        canvasContainer.appendChild(foodContainer);
        
        const itemW = 80, itemH = 110;
        const maxW = canvasContainer.clientWidth, maxH = canvasContainer.clientHeight;
        const buffer = 5;
        let initialX = Math.max(buffer, Math.floor(Math.random() * (maxW - itemW - 2 * buffer)));
        let initialY = Math.max(buffer, Math.floor(Math.random() * (maxH - itemH - 2 * buffer)));
        
        foodContainer.style.left = `${initialX}px`;
        foodContainer.style.top = `${initialY}px`;
        
        foodContainers[food.name] = foodContainer;
        makeDraggable(foodContainer, dragHandle, food);
    });
    
    updateStatusMessage('食品の青いバーをドラッグして自由に配置してください。');
    finishPlacementBtn.style.display = 'inline-block';
    goToFeedbackBtn.style.display = 'none';
    saveFeedbackAndDataBtn.style.display = 'none';
}

function makeDraggable(element, handle, food) {
    const actionButton = handle.querySelector('.info-button');
    actionButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (infoViewStartTime) {
            const duration = Math.floor((Date.now() - infoViewStartTime) / 1000);
            experimentData.moveHistory.push({ eventType: 'infoViewEnd', target: lastViewedFood.name, details: { duration } });
        }
        displayFoodDetails(food);
        infoViewStartTime = Date.now();
        lastViewedFood = food;
        experimentData.moveHistory.push({ eventType: 'infoViewStart', target: food.name });
    });

    handle.onmousedown = (e) => {
        if (infoViewStartTime) {
            const duration = Math.floor((Date.now() - infoViewStartTime) / 1000);
            experimentData.moveHistory.push({ eventType: 'infoViewEnd', target: lastViewedFood.name, details: { duration } });
            infoViewStartTime = null;
            lastViewedFood = null;
        }
        onMouseDown(e, element, handle);
    };
}

function onMouseDown(e, element, handle) {
    if (currentMode !== 'placement' || e.button !== 0) return;
    let isDragging = true;
    element.classList.add('dragging');
    handle.style.cursor = 'grabbing';

    let iMouseX = e.clientX;
    let iMouseY = e.clientY;
    let iElemX = element.offsetLeft;
    let iElemY = element.offsetTop;

    const onMouseMove = (moveEvent) => {
        if (!isDragging) return;
        let nX = iElemX + (moveEvent.clientX - iMouseX);
        let nY = iElemY + (moveEvent.clientY - iMouseY);
        nX = Math.max(0, Math.min(nX, canvasContainer.clientWidth - element.offsetWidth));
        nY = Math.max(0, Math.min(nY, canvasContainer.clientHeight - element.offsetHeight));
        element.style.left = `${nX}px`;
        element.style.top = `${nY}px`;
    };

    const onMouseUp = () => {
        if (!isDragging) return;
        isDragging = false;
        element.classList.remove('dragging');
        handle.style.cursor = 'grab';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        
        const fX = element.offsetLeft, fY = element.offsetTop;
        let pE = experimentData.positions.find(p => p.name === element.dataset.name);
        if (pE) { pE.x = fX; pE.y = fY; }
        experimentData.moveHistory.push({ eventType: 'dragEnd', target: element.dataset.name, position: { x: fX, y: fY } });
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    experimentData.moveHistory.push({ eventType: 'dragStart', target: element.dataset.name, position: { x: iElemX, y: iElemY } });
}

function handleClusterMouseDown(e) {
    if (currentMode !== 'clustering' || isDrawingCluster) return;
    isDrawingCluster = true;
    const rect = clusterCanvas.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    currentDrawingCluster = { centerX: startX, centerY: startY, radius: 0, color: getRandomClusterColor(), items: [] };
    
    const onMouseMove = (moveEvent) => {
        if (!isDrawingCluster) return;
        const currentX = moveEvent.clientX - rect.left;
        const currentY = moveEvent.clientY - rect.top;
        const dx = currentX - startX;
        const dy = currentY - startY;
        currentDrawingCluster.radius = Math.sqrt(dx * dx + dy * dy);
        drawAllClusters();
        drawCircle(startX, startY, currentDrawingCluster.radius, currentDrawingCluster.color, `${currentDrawingCluster.color}33`);
    };

    const onMouseUp = () => {
        isDrawingCluster = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        identifyItemsInCluster(currentDrawingCluster);
        if (currentDrawingCluster.items.length >= 3) {
            const name = prompt("クラスターの名前を入力してください:", `クラスター${experimentData.clusters.length + 1}`);
            if (name) {
                currentDrawingCluster.name = name;
                experimentData.clusters.push(currentDrawingCluster);
            }
        }
        drawAllClusters();
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

function identifyItemsInCluster(cluster) {
    const cRect = canvasContainer.getBoundingClientRect();
    Object.values(foodContainers).forEach(container => {
        const fRect = container.getBoundingClientRect();
        const foodCenterX = (fRect.left - cRect.left) + fRect.width / 2;
        const foodCenterY = (fRect.top - cRect.top) + fRect.height / 2;
        const distance = Math.sqrt(Math.pow(foodCenterX - cluster.centerX, 2) + Math.pow(foodCenterY - cluster.centerY, 2));
        if (distance <= cluster.radius) {
            cluster.items.push(container.dataset.name);
        }
    });
}

function drawCircle(centerX, centerY, radius, stroke, fill) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
}

function drawAllClusters() {
    ctx.clearRect(0, 0, clusterCanvas.width, clusterCanvas.height);
    experimentData.clusters.forEach(cluster => {
        drawCircle(cluster.centerX, cluster.centerY, cluster.radius, cluster.color, `${cluster.color}33`);
    });
}

function handleClusterClick(e) {
    // クラスター削除のロジック
}

function removeActiveDeleteButton() {
    // 削除ボタンを消す処理
}

function getRandomClusterColor() {
    return `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})`;
}

function generateFileName(info) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
    const timeStr = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
    const subjectName = info.name.replace(/\s+/g, '_');
    return `FoodCognitiveMap_${subjectName}_${dateStr}_${timeStr}.json`;
}

function showLoading(show, message = '読み込み中...') {
    if (show) {
        loadingSpinner.classList.add('active');
        statusMessage.textContent = message;
    } else {
        loadingSpinner.classList.remove('active');
    }
}

function updateStatusMessage(message) {
    statusMessage.textContent = message;
}

document.addEventListener('DOMContentLoaded', initializeApp);