// DOM要素のキャッシュ
let appContainer, screen1, screen2, screen3, screen4, screen5,
    subjectNameInput, subjectAgeInput, subjectEmailInput, goToScreen2Btn,
    instructionTitle, instructionBody, instructionContinueBtn,
    canvasContainer, clusterCanvas, ctx,
    finishPlacementBtn, goToFeedbackBtn, saveFeedbackAndDataBtn, submitAndFinishBtn,
    loadingSpinner, statusMessage, detailsPanel,
    backToScreen1Btn, backToScreen2Btn, backToStartBtn2;

// グローバル変数
let experimentData = { subjectInfo: {}, positions: [], clusters: [], placementTime: null, moveHistory: [] };
let currentMode = 'intro', foodContainers = {}, isDrawingCluster = false, currentDrawingCluster = null, activeDeleteButton = null, selectedClusterIndexForDeletion = -1

// 食品リスト
let foodList = [
    { name: "gyoza", label: "餃子", imgSrc: "4c913c8dc502ecd4682d9b2ce0ee6e9f-e1529890604890.jpeg", info: "油・水なしで、誰が調理しても簡単にパリッパリの羽根ができる、うす皮パリッと、ジューシーで具がギュッと詰まった焼き餃子です。\n誰もが好きな、間違いない安定感のある王道のおいしさです。\n国産のお肉と野菜を使用しています。\n【内容量】12個入り（276g）" },
    { name: "chahan", label: "チャーハン", imgSrc: "65cae64b3ce70.png", info: "焦がしにんにくのマー油と葱油の香ばしさや、噛むほどに広がる焼豚のうま味で、一度口にすると一心不乱に食べきってしまいたくなるチャーハンです。\n焦がしにんにくの香りを引き立たせ、焼豚の風味も調整し、メリハリのある味を実現。\nどんどん食べ進めたくなる味に進化しました。\n【内容量】580g" },
    { name: "empanada", label: "エンパナーダ", imgSrc: "51HpEz7bykL.jpg_BO30,255,255,255_UF900,850_SR1910,1000,0,C_QL100_.png", info: "アルゼンチン伝統料理：本場の味わいを楽しめるエンパナーダの6個セット。南米の伝統的な味を日本で堪能できます。\n食べ比べセット：シェフが厳選した６種類のエンパナーダを一度に楽しめる贅沢な詰め合わせパック" },
    { name: "gratin", label: "グラタン", imgSrc: "sho_id100.png", info: "蔵王産ミルクを使用。チーズのおいしさとプリプリのえびがマッチしたグラタンです。\nチーズの風味豊かに！チーズを感じられるようカットサイズにもこだわっています。" },
    { name: "lasagna", label: "ラザニア", imgSrc: "81o0dpS0JnL._AC_SL1500_.jpg", info: "オーブンで焼き上げたチーズが香ばしい、生パスタを使った本格ラザニア。ちょっと小腹がすいた時、お夜食に、ランチメニューの一品に、ビールのおつまみなどにぴったりな一品です。" },
    { name: "australian_meatpie", label: "オーストラリアンミートパイ", imgSrc: "5904891501521.png", info: "チーズ風味が香るミートソースは、100%オージービーフを使用しています。家族や友達、みんなで楽しめる6個入りパックです。\nパイ生地は、フタ部分と下のパイで2種類の異なるパイ生地を使用しています。\n特に上のフタになっているパイはサクサクに仕上げているので、なかのトロっとしたソースとの絶妙なコンビネーションを楽しめます。" },
    { name: "ravioli", label: "ラビオリ", imgSrc: "1280x1280.jpg", info: "爽やかな風味のリコッタチーズとほうれん草をパスタ生地で包みトマトソースで和えたラビオリです。リコッタのマイルドな味わいとトマトソースの相性は抜群、さらにチーズをトッピングし風味豊かに仕上げました。" },
    { name: "yakionigiri", label: "焼きおにぎり", imgSrc: "71+s1Tix9qL.jpg", info: "香りを立たせ、持続させるニッスイの独自技術「香りのＷアップ製法」で、しょうゆの風味と香りをより引き立たせました。\nたまりしょうゆと二段仕込みしょうゆをブレンドした、まろやかでコクのあるしょうゆの風味豊かな焼きおにぎりです。" },
    { name: "reitou_udon", label: "冷凍うどん", imgSrc: "7116302.jpg", info: "強いコシと弾力のさぬきうどんに、瀬戸内産いりこを使用しただし香るまろやかでコクのあるつゆ。麺はこだわりの包丁切りで、つゆとの絡みも良くお召し上がりいただけます。" },
    { name: "reitou_pasta", label: "冷凍パスタ", imgSrc: "op_bolognese.jpg", info: "牛挽肉の旨みと赤ワインの風味が特長のボロネーゼソース。ゴーダチーズとごろっと大きな揚げなすをトッピング。" },
    { name: "karaage", label: "鶏のから揚げ", imgSrc: "65a665121d4b5.png", info: "食欲を満たす肉の塊、これぞから揚げの金字塔！\nにんにく風味アップでさらに白飯がガツガツ進む！\n秘伝にんにく油、葱油、特級醤油の極旨仕込みだれにじっくり漬け込んだ香りがクセになるから揚げです。\n火入れの温度にこだわった”秘伝にんにく油”でにんにくの香りが引き立ち、肉汁がジュワッと広がります。" }
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

function showInstructionScreen(title, bodyHtml, buttonText, nextAction) {
    if(instructionTitle) instructionTitle.textContent = title;
    if(instructionBody) instructionBody.innerHTML = bodyHtml;
    if(instructionContinueBtn) instructionContinueBtn.textContent = buttonText;
    
    const newBtn = instructionContinueBtn.cloneNode(true);
    instructionContinueBtn.parentNode.replaceChild(newBtn, instructionContinueBtn);
    instructionContinueBtn = document.getElementById('instruction-continue-btn');
    
    if(instructionContinueBtn) instructionContinueBtn.addEventListener('click', nextAction);
    
    showScreen(screen2);
}

function displayFoodDetails(food) {
    const nameEl = document.getElementById('details-food-name');
    const imageEl = document.getElementById('details-food-image');
    const infoEl = document.getElementById('details-food-info');
    const placeholderEl = document.getElementById('details-placeholder');

    if (!detailsPanel || !nameEl || !imageEl || !infoEl || !placeholderEl) return;
    
    if (currentMode === 'clusterFeedback') {
        // フィードバックモードでは食品詳細を表示しない
        return;
    }
    
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
    instructionTitle = document.getElementById('instruction-title');
    instructionBody = document.getElementById('instruction-body');
    instructionContinueBtn = document.getElementById('instruction-continue-btn');
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
        
        updateStepper(1);
        showInstructionScreen(
            "フェーズ1：食品の配置",
            `<p>これから、画面上に様々な食品が表示されます。<br>マウスのドラッグ＆ドロップで、あなたが「関係が近い」と思うものが近くなるように、自由に配置してください。<br>「関係性」に正解はありません。あなただけの「頭の中の地図」を作るつもりで、楽しんで配置してみてください。</p>`,
            "配置を開始する",
            () => {
                showScreen(screen3);
                currentMode = 'placement';
                initializeExperiment();
            }
        );
    });

    finishPlacementBtn.addEventListener('click', () => {
        updateStepper(2);
        showInstructionScreen(
            "フェーズ2：グループの作成",
            "<p>次に、配置した食品を意味のまとまりごとに、マウスで円を描いて囲み、グループを作成してください。<br>１つのグループには、必ず３つ以上の食品を入れてください。</p>",
            "グループ作成を開始する",
            () => {
                showScreen(screen3);
                currentMode = 'clustering';
                Object.values(foodContainers).forEach(container => {
                    const handle = container.querySelector('.drag-handle');
                    if (handle) { handle.style.cursor = 'default'; handle.onmousedown = null; }
                });
                displayFoodDetails(null);
                clusterCanvas.classList.add('active-drawing');
                finishPlacementBtn.style.display = 'none';
                goToFeedbackBtn.style.display = 'inline-block';
                updateStatusMessage('食品を円で囲んでクラスターを作成してください。');
            }
        );
    });
    
    goToFeedbackBtn.addEventListener('click', () => {
        updateStepper(3);
        showInstructionScreen(
            "フェーズ3：フィードバック",
            "<p>最後に、作成した各グループについて、なぜそのように分けたのか、どのような意味があるかなどを教えてください。</p>",
            "フィードバックを開始する",
            () => {
                showScreen(screen3);
                currentMode = 'clusterFeedback';
                document.body.classList.add('feedback-mode-active');
                updateStatusMessage('作成した各クラスターについて、以下の項目を記入してください。');
                // (フィードバック画面のUI生成ロジック)
            }
        );
    });
    
    saveFeedbackAndDataBtn.addEventListener('click', () => {
        // (フィードバックのバリデーション)
        showScreen(screen4);
        updateStepper(4);
        // (アンケートフォームの生成ロジック)
    });

    submitAndFinishBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        // (アンケートのバリデーションとデータ送信)
        showScreen(screen5);
        updateStepper(5);
    });

    backToScreen1Btn.addEventListener('click', () => {
        showScreen(screen1);
        updateStepper(0);
    });
    
    backToScreen2Btn.addEventListener('click', () => {
        if (confirm("実験説明画面に戻りますか？現在の配置やクラスターの情報はリセットされます。")) {
            document.body.classList.remove('feedback-mode-active');
            resetScreen3UI();
            showScreen(screen1); // 最初に戻って説明からやり直す
            updateStepper(0);
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
        actionButton.className = 'info-button';
        actionButton.textContent = 'i';
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

function makeDraggable(element, handle, food, experimentScope) {
    const actionButton = handle.querySelector('.info-button');
    actionButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentMode === 'placement' || currentMode === 'clustering') {
            if (experimentScope.infoViewStartTime && experimentScope.lastViewedFood) {
                const duration = Math.floor((Date.now() - experimentScope.infoViewStartTime) / 1000);
                experimentData.moveHistory.push({
                    timestamp: getCurrentTimestamp(),
                    eventType: 'infoViewEnd',
                    target: experimentScope.lastViewedFood.name,
                    details: { duration: duration }
                });
            }
            displayFoodDetails(food);
            experimentScope.infoViewStartTime = Date.now();
            experimentScope.lastViewedFood = food;
            experimentData.moveHistory.push({
                timestamp: getCurrentTimestamp(),
                eventType: 'infoViewStart',
                target: food.name
            });
        }
    });

    handle.onmousedown = (e) => {
        if (experimentScope.infoViewStartTime && experimentScope.lastViewedFood) {
            const duration = Math.floor((Date.now() - experimentScope.infoViewStartTime) / 1000);
            experimentData.moveHistory.push({
                timestamp: getCurrentTimestamp(),
                eventType: 'infoViewEnd',
                target: experimentScope.lastViewedFood.name,
                details: { duration: duration }
            });
            experimentScope.infoViewStartTime = null;
            experimentScope.lastViewedFood = null;
        }
        onMouseDown(e, element, handle);
    };
}

function onMouseDown(e, element, handle) {
    if (currentMode !== 'placement' || e.button !== 0) {
        handle.style.cursor = 'default';
        return;
    }
    let isDragging = true;
    element.classList.add('dragging'); // ★ドラッグ開始時にクラスを追加
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
        element.classList.remove('dragging'); // ★ドラッグ終了時にクラスを削除
        handle.style.cursor = (currentMode === 'placement') ? 'grab' : 'default';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        const fX = element.offsetLeft, fY = element.offsetTop;
        let pE = experimentData.positions.find(p => p.name === element.dataset.name);
        if (pE) {
            pE.x = fX;
            pE.y = fY;
        } else {
            experimentData.positions.push({ name: element.dataset.name, x: fX, y: fY });
        }
        experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'dragEnd', target: element.dataset.name, position: { x: fX, y: fY } });
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'dragStart', target: element.dataset.name, position: { x: iElemX, y: iElemY } });
}

function handleClusterMouseDown(e) {
    if (currentMode !== 'clustering' || isDrawingCluster || !clusterCanvas || !ctx) return;
    removeActiveDeleteButton(); isDrawingCluster = true;
    const rect = clusterCanvas.getBoundingClientRect();
    const startX = e.clientX - rect.left, startY = e.clientY - rect.top;
    currentDrawingCluster = {
        id: `cluster_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, type: 'circle',
        centerX: startX, centerY: startY, radius: 0,
        name: '', items: [], color: getRandomClusterColor(), feedback: {}
    };
    clusterCanvas.addEventListener('mousemove', handleClusterMouseMove);
    clusterCanvas.addEventListener('mouseup', handleClusterMouseUp);
    clusterCanvas.addEventListener('mouseleave', handleClusterMouseUp);
    experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'clusterDrawStart', target: 'clusterCanvas', details: { type: 'circle', centerX: startX, centerY: startY } });
}

function handleClusterMouseMove(e) {
    if (!isDrawingCluster || !currentDrawingCluster || currentDrawingCluster.type !== 'circle') return;
    const rect = clusterCanvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left, currentY = e.clientY - rect.top;
    const dx = currentX - currentDrawingCluster.centerX, dy = currentY - currentDrawingCluster.centerY;
    currentDrawingCluster.radius = Math.sqrt(dx * dx + dy * dy);

    ctx.clearRect(0, 0, clusterCanvas.width, clusterCanvas.height);
    drawAllClusters();

    const drawingFillColor = currentDrawingCluster.color.startsWith('rgb(') ?
        currentDrawingCluster.color.replace('rgb(', 'rgba(').replace(')', ', 0.1)') :
        `${currentDrawingCluster.color}1A`;

    drawCircle(currentDrawingCluster.centerX, currentDrawingCluster.centerY, currentDrawingCluster.radius, currentDrawingCluster.color, drawingFillColor, 2, true);
}

function handleClusterMouseUp(e) {
    if (!isDrawingCluster || !currentDrawingCluster || currentDrawingCluster.type !== 'circle') return;
    isDrawingCluster = false;
    clusterCanvas.removeEventListener('mousemove', handleClusterMouseMove);
    clusterCanvas.removeEventListener('mouseup', handleClusterMouseUp);
    clusterCanvas.removeEventListener('mouseleave', handleClusterMouseUp);

    if (currentDrawingCluster.radius < 10) {
        updateStatusMessage('クラスターが小さすぎます。もう一度描画してください。');
        currentDrawingCluster = null; ctx.clearRect(0, 0, clusterCanvas.width, clusterCanvas.height); drawAllClusters(); return;
    }
    identifyItemsInCluster(currentDrawingCluster);
    if (currentDrawingCluster.items.length < 3) {
        updateStatusMessage(`クラスター内の食品が${currentDrawingCluster.items.length}個です。3つ以上になるように作成してください。`);
        experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'clusterDrawCancel', target: 'clusterCanvas', details: { message: 'Less than 3 items', itemCount: currentDrawingCluster.items.length } });
        currentDrawingCluster = null; ctx.clearRect(0, 0, clusterCanvas.width, clusterCanvas.height); drawAllClusters(); return;
    }
    const clusterName = prompt("このクラスターの名前を入力してください:", `クラスター${experimentData.clusters.length + 1}`);
    if (clusterName && clusterName.trim() !== "") {
        currentDrawingCluster.name = clusterName.trim();
        experimentData.clusters.push(currentDrawingCluster);
        experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'clusterCreated', target: currentDrawingCluster.name, details: { id: currentDrawingCluster.id, type: 'circle', radius: currentDrawingCluster.radius, itemCount: currentDrawingCluster.items.length } });
    } else {
        experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'clusterDrawCancel', target: 'clusterCanvas', details: { message: 'No name provided for circle cluster' } });
    }
    currentDrawingCluster = null; ctx.clearRect(0, 0, clusterCanvas.width, clusterCanvas.height); drawAllClusters();
}

function identifyItemsInCluster(cluster) {
    if (!cluster || cluster.type !== 'circle' || cluster.radius <= 0) return;
    cluster.items = [];
    Object.values(foodContainers).forEach(container => {
        const rect = container.getBoundingClientRect();
        const cRect = canvasContainer.getBoundingClientRect();
        const iCX = (rect.left - cRect.left) + rect.width / 2, iCY = (rect.top - cRect.top) + rect.height / 2;
        const dX = iCX - cluster.centerX, dY = iCY - cluster.centerY;
        if (Math.sqrt(dX * dX + dY * dY) <= cluster.radius) cluster.items.push(container.dataset.name);
    });
}

function handleClusterClick(e) {
    if (currentMode !== 'clustering' || isDrawingCluster || !clusterCanvas || !ctx || experimentData.clusters.length === 0) return;
    removeActiveDeleteButton(); const rect = clusterCanvas.getBoundingClientRect();
    const cX = e.clientX - rect.left, cY = e.clientY - rect.top;
    let clClicked = null, clIdx = -1;
    for (let i = experimentData.clusters.length - 1; i >= 0; i--) {
        const cl = experimentData.clusters[i];
        if (cl.type === 'circle') {
            const dX_ = cX - cl.centerX, dY_ = cY - cl.centerY;
            if (Math.sqrt(dX_ * dX_ + dY_ * dY_) <= cl.radius) { clClicked = cl; clIdx = i; break; }
        }
    }
    if (clClicked) {
        selectedClusterIndexForDeletion = clIdx;
        createAndShowDeleteButton(clClicked, e.clientX, e.clientY);
    }
}

function createAndShowDeleteButton(cluster, screenX, screenY) {
    removeActiveDeleteButton(); activeDeleteButton = document.createElement('button');
    activeDeleteButton.id = 'dynamicDeleteClusterBtn'; activeDeleteButton.textContent = `「${cluster.name}」を削除`;
    document.body.appendChild(activeDeleteButton);
    activeDeleteButton.style.left = `${screenX + 5}px`; activeDeleteButton.style.top = `${screenY + 5}px`;
    activeDeleteButton.onclick = () => {
        if (selectedClusterIndexForDeletion > -1 && selectedClusterIndexForDeletion < experimentData.clusters.length) {
            const delCl = experimentData.clusters.splice(selectedClusterIndexForDeletion, 1)[0];
            experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'clusterDelete', target: delCl.name, details: { id: delCl.id } });
        }
        selectedClusterIndexForDeletion = -1; removeActiveDeleteButton(); drawAllClusters();
    };
}

function removeActiveDeleteButton() {
    if (activeDeleteButton) { activeDeleteButton.remove(); activeDeleteButton = null; }
}

function drawCircle(centerX, centerY, radius, strokeStyle, fillStyle, lineWidth, isFilled = true) {
    if (!ctx || radius <= 0) return; ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    if (strokeStyle) ctx.strokeStyle = strokeStyle; if (lineWidth) ctx.lineWidth = lineWidth; ctx.stroke();
    if (isFilled && fillStyle) { ctx.fillStyle = fillStyle; ctx.fill(); }
}

function drawAllClusters() {
    if (!ctx || !clusterCanvas) return;
    ctx.clearRect(0, 0, clusterCanvas.width, clusterCanvas.height);
    experimentData.clusters.forEach(cluster => {
        if (cluster.type === 'circle' && cluster.radius > 0) {
            const fillColor = cluster.color.startsWith('rgb(') ?
                cluster.color.replace('rgb(', 'rgba(').replace(')', ', 0.2)') :
                `${cluster.color}33`;
            drawCircle(cluster.centerX, cluster.centerY, cluster.radius, cluster.color, fillColor, 2, true);
        }
    });
}

function getRandomClusterColor() {
    const r = Math.floor(Math.random() * 180) + 50; const g = Math.floor(Math.random() * 180) + 50; const b = Math.floor(Math.random() * 180) + 50;
    return `rgb(${r},${g},${b})`;
}

function generateFileName(info) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
    const timeStr = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
    const subjectName = info && info.name ? info.name.replace(/\s+/g, '_') : 'UnknownSubject';
    return `FoodCognitiveMap_${subjectName}_${dateStr}_${timeStr}.json`;
}

function showLoading(show, message = '') {
    if (!loadingSpinner || !statusMessage) return;
    if (show) { loadingSpinner.classList.add('active'); statusMessage.textContent = message || '読み込み中...'; }
    else { loadingSpinner.classList.remove('active'); }
}

function updateStatusMessage(message) {
    if (!statusMessage) return; statusMessage.textContent = message; console.log(`[STATUS] ${message}`);
}

document.addEventListener('DOMContentLoaded', initializeApp);
}