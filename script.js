// === Config ===
const MEATPIE_PRICE_JPY = 300; // 実価格（必要に応じて変更）
const MEATPIE_ID = 'australian_meatpie';

// DOM要素のキャッシュ
let appContainer, screen1, screen2, screen3, screen4, screen5,
    subjectNameInput, subjectAgeInput, subjectEmailInput, goToScreen2Btn, startExperimentBtn,
    canvasContainer, clusterCanvas, ctx,
    finishPlacementBtn, goToFeedbackBtn, saveFeedbackAndDataBtn, submitAndFinishBtn,
    loadingSpinner, statusMessage, detailsPanel,
    backToScreen1Btn, backToScreen2Btn, backToStartBtn2;

// グローバル変数
let subjectInfo = {};
let experimentData = {
    subjectInfo: {}, positions: [], clusters: [],
    placementTime: null, moveHistory: [], relations: []
};
let currentMode = 'intro';
let foodContainers = {};
let isDrawingCluster = false;
let currentDrawingCluster = null;
let activeDeleteButton = null;
let selectedClusterIndexForDeletion = -1;

// ===== 初期配置のための設定値 =====
const MEAT_PIE_NAME = "australian_meatpie";

// キャンバスサイズは実際の描画サイズに合わせて後で微調整OK
const RING_PADDING = 30;     // 枠からの余白
const MIN_GAP = 12;          // アイコン同士のすき間目安



// 食品リスト
let foodList = [
    { name: "gyoza", label: "餃子", imgSrc: "4c913c8dc502ecd4682d9b2ce0ee6e9f-e1529890604890.jpeg", info: "油・水なしで、誰が調理しても簡単にパリッパリの羽根ができる、うす皮パリッと、ジューシーで具がギュッと詰まった焼き餃子です。\n誰もが好きな、間違いない安定感のある王道のおいしさです。\n国産のお肉と野菜を使用しています。\n【内容量】12個入り（276g）" },
    { name: "chahan", label: "チャーハン", imgSrc: "65cae64b3ce70.png", info: "焦がしにんにくのマー油と葱油の香ばしさや、噛むほどに広がる焼豚のうま味で、一度口にすると一心不乱に食べきってしまいたくなるチャーハンです。\n焦がしにんにくの香りを引き立たせ、焼豚の風味も調整し、メリハリのある味を実現。\nどんどん食べ進めたくなる味に進化しました。\n【内容量】580g" },
    { name: "empanada", label: "エンパナーダ", imgSrc: "51HpEz7bykL.jpg_BO30,255,255,255_UF900,850_SR1910,1000,0,C_QL100_.png", info: "アルゼンチン伝統料理：具材をパイ生地で包んで焼いた料理。本場の味わいを楽しめるエンパナーダの6個セット。南米の伝統的な味を日本で堪能できます。\n食べ比べセット：シェフが厳選した６種類のエンパナーダを一度に楽しめる贅沢な詰め合わせパック" },
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
    if (!experimentData.startTime) return 0;
    return Math.floor((Date.now() - experimentData.startTime) / 1000);
}

function loadFoodListFromLocalStorage() {
    try {
        const storedFoodList = localStorage.getItem('foodList');
        if (storedFoodList) {
            const parsedList = JSON.parse(storedFoodList);
            if (Array.isArray(parsedList) && parsedList.length > 0) {
                foodList = parsedList;
            }
        }
    } catch (e) { console.error("Error loading food list:", e); }
}

function showScreen(screenToShow) {
    if (!appContainer || !screenToShow) return;
    [screen1, screen2, screen3, screen4, screen5].forEach(s => {
        if(s) s.classList.remove('active');
    });
    screenToShow.classList.add('active');
    if (!appContainer.classList.contains('active')) {
      appContainer.classList.add('active');
    }
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
    console.log("[DEBUG] initializeApp: Starting application initialization.");
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

    if (subjectAgeInput) {
        subjectAgeInput.addEventListener('input', (e) => {
            const halfWidthValue = e.target.value.replace(/[０-９]/g, (s) => {
                return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
            });
            e.target.value = halfWidthValue;
        });
    }

    if (goToScreen2Btn) {
        goToScreen2Btn.addEventListener('click', () => {
            const name = subjectNameInput.value.trim();
            const ageString = subjectAgeInput.value.trim();
            const email = subjectEmailInput.value.trim();
            if (!name || !ageString || !email) { alert("全ての項目を入力してください。"); return; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert("有効なメールアドレスを入力してください。"); return; }
            const ageNum = parseInt(ageString, 10);
            if (isNaN(ageNum) || ageNum < 18 || ageNum > 99) { alert("年齢は18歳から99歳の間で、有効な数値を入力してください。"); return; }
            experimentData.subjectInfo = { name, age: ageNum, email };
            if (screen2) { showScreen(screen2); currentMode = 'instructions'; }
        });
    }

    if (startExperimentBtn) {
        startExperimentBtn.addEventListener('click', () => {
            if (!screen3) return;
            showScreen(screen3);
            currentMode = 'placement';
            try { initializeExperiment(); }
            catch (e) { console.error('[CRITICAL_ERROR] Error in initializeExperiment:', e); alert("実験初期化エラー。"); }
        });
    }

    if (finishPlacementBtn) {
        finishPlacementBtn.addEventListener('click', () => {
            if (!clusterCanvas || !goToFeedbackBtn) return;
            currentMode = 'clustering';
            removeActiveDeleteButton();
            experimentData.placementTime = getCurrentTimestamp();
            experimentData.moveHistory.push({ timestamp: experimentData.placementTime, eventType: 'placementEnd', target: 'finishPlacementBtn', details: { message: 'クラスター作成フェーズへ移行' } });
            Object.values(foodContainers).forEach(container => {
                const handle = container.querySelector('.drag-handle');
                if (handle) { handle.style.cursor = 'default'; handle.onmousedown = null; }
            });
            displayFoodDetails(null);
            clusterCanvas.classList.add('active-drawing');
            finishPlacementBtn.style.display = 'none';
            goToFeedbackBtn.style.display = 'inline-block';
            updateStatusMessage('食品を円で囲んでクラスターを作成 (3つ以上中に入れる)、または既存のクラスターをクリックして削除できます。');
        });
    }

    if (goToFeedbackBtn) {
        goToFeedbackBtn.addEventListener('click', () => {
            const hasMeatpie = experimentData.clusters.some(
                c => (c.items || []).some(it => it.name === MEATPIE_ID)
            );
            if (!hasMeatpie) {
                alert('ミートパイを含むクラスターを1つ以上作成してください。');
                return;
            }
            document.body.classList.add('feedback-mode-active'); // ★ この行を追加
            currentMode = 'clusterFeedback';
            removeActiveDeleteButton();
            updateStatusMessage('作成した各クラスターについて、以下の項目を記入してください。');
            
            if (!detailsPanel) {
                console.error("[CRITICAL_ERROR] detailsPanel not found!");
                return;
            }
    
            detailsPanel.innerHTML = ''; // パネルをクリア
const infoHeader = document.createElement('p');
infoHeader.className = 'info-text';
infoHeader.textContent = '作成した各クラスターについて、以下の項目を記入してください。';
detailsPanel.appendChild(infoHeader);


            if (experimentData.clusters.length === 0) {
                detailsPanel.innerHTML = '<p class="info-text">作成されたクラスターはありません。このまま次へ進んでください。</p>';
            } else {
                const clusterListContainer = document.createElement('div');
                clusterListContainer.className = 'cluster-list';
                detailsPanel.appendChild(clusterListContainer);
    
                const formContainer = document.createElement('div');
                formContainer.className = 'cluster-feedback-form';
                detailsPanel.appendChild(formContainer);
    
                const showClusterFeedback = (clusterIndex) => {
                    // 他のボタンのアクティブ状態を解除
                    clusterListContainer.querySelectorAll('.cluster-list-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    // クリックされたボタンをアクティブにする
                    const selectedButton = clusterListContainer.querySelector(`[data-cluster-index="${clusterIndex}"]`);
                    if(selectedButton) selectedButton.classList.add('active');
    
                    // フォームを生成
                    const cluster = experimentData.clusters[clusterIndex];
                    const labels = cluster.items.map(item => {
    const food = foodList.find(f => f.name === item.name);
    return food ? food.label : item.name;
}).join('、 ');
                    const itemsText = labels.length > 0 ? ` (内容: ${labels})` : '';
    
                    formContainer.innerHTML = `
                        <h4>${cluster.name}${itemsText}</h4>
                        <label for="reasonCreated">このクラスターを作成した理由:</label>
                        <textarea id="reasonCreated" rows="3" placeholder="例：これらは「洋食」という点で似ていると感じたため。">${cluster.feedback?.reasonCreated || ''}</textarea>
                        <label for="meaning">どのような意味があると思いますか？:</label>
                        <textarea id="meaning" rows="3" placeholder="例：このグループは「子どもが好きな夕食メニュー」と言えるかもしれません。">${cluster.feedback?.meaning || ''}</textarea>
                        <label for="reasonName">その名前にした理由:</label>
                        <textarea id="reasonName" rows="3" placeholder="例：グループの特徴をそのまま名前にしました。">${cluster.feedback?.reasonName || ''}</textarea>
                    `;
    
                    // 入力があるたびに、リアルタイムでデータを保存
                    formContainer.querySelector('#reasonCreated').addEventListener('input', (e) => {
                        if (!cluster.feedback) cluster.feedback = {};
                        cluster.feedback.reasonCreated = e.target.value;
                    });
                    formContainer.querySelector('#meaning').addEventListener('input', (e) => {
                        if (!cluster.feedback) cluster.feedback = {};
                        cluster.feedback.meaning = e.target.value;
                    });
                    formContainer.querySelector('#reasonName').addEventListener('input', (e) => {
                        if (!cluster.feedback) cluster.feedback = {};
                        cluster.feedback.reasonName = e.target.value;
                    });
                };
    
                experimentData.clusters.forEach((cluster, index) => {
                    const clusterItem = document.createElement('div');
                    clusterItem.className = 'cluster-list-item';
                    clusterItem.textContent = cluster.name;
                    clusterItem.dataset.clusterIndex = index;
                    clusterItem.addEventListener('click', () => showClusterFeedback(index));
                    clusterListContainer.appendChild(clusterItem);
                });
                
                // 最初に一番目のクラスターのフォームを表示
                if (experimentData.clusters.length > 0) {
                    showClusterFeedback(0);
                }
            }
    
            if(goToFeedbackBtn) goToFeedbackBtn.style.display = 'none';
            if(saveFeedbackAndDataBtn) saveFeedbackAndDataBtn.style.display = 'inline-block';
            if(clusterCanvas) clusterCanvas.classList.remove('active-drawing');
            document.querySelectorAll('.food-container .info-button').forEach(btn => btn.style.pointerEvents = 'none');
            experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'enterClusterFeedback', target:'application', details: { clusterCount: experimentData.clusters.length } });
        });
    }


if (saveFeedbackAndDataBtn) {
        saveFeedbackAndDataBtn.addEventListener('click', () => {
            let allProvided = true;
            for (const cluster of experimentData.clusters) {
                if (!cluster.feedback || 
                    !cluster.feedback.reasonCreated?.trim() || 
                    !cluster.feedback.meaning?.trim() || 
                    !cluster.feedback.reasonName?.trim()) 
                {
                    allProvided = false;
                    break;
                }
            }
    
            if (!allProvided) {
                alert("全てのクラスターについて、3つのフィードバック項目すべてを記入してください。");
                return;
            }
            
            const form = document.getElementById('surveyForm');
            if(form) {
                // アンケートのHTMLを生成
                form.innerHTML = ` <!-- A. 価格予想 -->
<fieldset class="survey-section">
    <legend>価格予想（ミートパイ）</legend>
    <div class="survey-question">
      <p class="question-text">ミートパイはいくらくらいだと思いますか？（円）</p>
      <input type="number" min="0" step="1" name="price_estimate_guess" required>
    </div>
  </fieldset>

  <!-- B. 実価格提示 → 公正感/購買意欲（A1入力後に表示） -->
  <fieldset class="survey-section" id="block_price_reveal" style="display:none;">
    <legend>価格提示と評価</legend>
    <div class="survey-question">
      <p class="question-text">実際の価格は <strong id="revealedPrice"></strong> 円です。</p>
    </div>
    <div class="survey-question">
      <p class="question-text">この価格についてどう感じますか？</p>
      <div class="likert-options">
        <label><input type="radio" name="price_fairness_after_reveal" value="1" required> 高すぎる</label>
        <label><input type="radio" name="price_fairness_after_reveal" value="2"> やや高い</label>
        <label><input type="radio" name="price_fairness_after_reveal" value="3"> ちょうど良い</label>
        <label><input type="radio" name="price_fairness_after_reveal" value="4"> やや安い</label>
        <label><input type="radio" name="price_fairness_after_reveal" value="5"> 安すぎる</label>
      </div>
    </div>
    <div class="survey-question">
      <p class="question-text">この価格なら購入したいと思いますか？</p>
      <div class="likert-options">
        <label><input type="radio" name="purchase_intent_after_reveal" value="1" required> 思う</label>
        <label><input type="radio" name="purchase_intent_after_reveal" value="2"> どちらとも言えない</label>
        <label><input type="radio" name="purchase_intent_after_reveal" value="3"> 思わない</label>
      </div>
    </div>
    <div class="survey-question">
      <p class="question-text">その理由（任意）</p>
      <textarea name="purchase_intent_reason" rows="2" placeholder="自由記述（任意）"></textarea>
    </div>
  </fieldset>

  <!-- C. 認知・経験・チャネル・シーン -->
  <fieldset class="survey-section">
    <legend>認知・経験・チャネル・シーン</legend>

    <div class="survey-question">
      <p class="question-text">ミートパイという食品を知っていましたか？</p>
      <label><input type="radio" name="awareness_meatpie" value="1" required> 知っていた</label>
      <label><input type="radio" name="awareness_meatpie" value="0"> 知らなかった</label>
    </div>

    <div id="awareness_followups" style="display:none;">
      <p class="question-text">どこで知りましたか？（複数選択可）</p>
      <div class="checkbox-group">
        <label><input type="checkbox" name="awareness_sources[]" value="tv"> テレビ</label>
        <label><input type="checkbox" name="awareness_sources[]" value="sns"> SNS</label>
        <label><input type="checkbox" name="awareness_sources[]" value="friends_family"> 友人・家族</label>
        <label><input type="checkbox" name="awareness_sources[]" value="abroad_trip"> 海外滞在・旅行</label>
        <label><input type="checkbox" name="awareness_sources[]" value="bakery_store"> ベーカリー</label>
        <label><input type="checkbox" name="awareness_sources[]" value="convenience_store"> コンビニ</label>
        <label><input type="checkbox" name="awareness_sources[]" value="supermarket"> スーパー</label>
        <label><input type="checkbox" id="aw_src_other_chk" name="awareness_sources[]" value="other"> その他</label>
      </div>
      <input type="text" id="aw_src_other_text" name="awareness_sources_other" placeholder="その他（記入）" style="display:none;">
    </div>

    <div class="survey-question">
      <p class="question-text">ミートパイを食べたことはありますか？</p>
      <label><input type="radio" name="tried_meatpie" value="1" required> ある</label>
      <label><input type="radio" name="tried_meatpie" value="0"> ない</label>
    </div>

    <div class="survey-question">
      <p class="question-text">ミートパイはどこで買えるイメージですか？</p>
      <label><input type="radio" name="where_buy_impression" value="convenience_store" required> コンビニ</label>
      <label><input type="radio" name="where_buy_impression" value="supermarket"> スーパー</label>
      <label><input type="radio" name="where_buy_impression" value="bakery"> ベーカリー</label>
      <label><input type="radio" name="where_buy_impression" value="frozen_delivery"> 冷凍宅配</label>
      <label><input type="radio" name="where_buy_impression" value="unknown"> 不明</label>
      <label><input type="radio" id="buy_other_radio" name="where_buy_impression" value="other"> その他</label>
      <input type="text" id="buy_other_text" name="where_buy_impression_other" placeholder="その他（記入）" style="display:none;margin-left:.75rem;">
    </div>

    <div class="survey-question">
      <p class="question-text">どんなシーンで食べるイメージですか？（複数選択可）</p>
      <div class="checkbox-group" id="q_scenes">
        <label><input type="checkbox" name="consumption_scenes[]" value="breakfast"> 朝食</label>
        <label><input type="checkbox" name="consumption_scenes[]" value="lunch"> 昼食</label>
        <label><input type="checkbox" name="consumption_scenes[]" value="dinner"> 夕食</label>
        <label><input type="checkbox" name="consumption_scenes[]" value="snack"> おやつ・小腹</label>
        <label><input type="checkbox" name="consumption_scenes[]" value="party"> パーティ・差し入れ</label>
        <label><input type="checkbox" name="consumption_scenes[]" value="unknown"> 特になし・不明</label>
        <label><input type="checkbox" id="scene_other_chk" name="consumption_scenes[]" value="other"> その他</label>
      </div>
      <input type="text" id="scene_other_text" name="consumption_scenes_other" placeholder="その他（記入）" style="display:none;">
    </div>

    <div class="survey-question">
      <p class="question-text">ミートパイは手に取りやすいと感じますか？</p>
      <div class="likert-options">
        <label><input type="radio" name="accessibility_perception" value="1" required> 全く思わない</label>
        <label><input type="radio" name="accessibility_perception" value="2"> あまり思わない</label>
        <label><input type="radio" name="accessibility_perception" value="3"> どちらとも言えない</label>
        <label><input type="radio" name="accessibility_perception" value="4"> そう思う</label>
        <label><input type="radio" name="accessibility_perception" value="5"> 非常にそう思う</label>
      </div>
    </div>
  </fieldset>



                <fieldset class="survey-section"><legend>A. 実験の全体的な感想について</legend><div class="survey-question"><p class="question-text">1. 今回の実験は楽しかった</p><div class="likert-scale"><span>全くそう思わない</span><div class="likert-options"><label><input type="radio" name="q1_fun" value="1" required><span>1</span></label><label><input type="radio" name="q1_fun" value="2"><span>2</span></label><label><input type="radio" name="q1_fun" value="3"><span>3</span></label><label><input type="radio" name="q1_fun" value="4"><span>4</span></label><label><input type="radio" name="q1_fun" value="5"><span>5</span></label></div><span>非常にそう思う</span></div></div><div class="survey-question"><p class="question-text">2. 食品を配置する作業は、直感的で分かりやすかった</p><div class="likert-scale"><span>全くそう思わない</span><div class="likert-options"><label><input type="radio" name="q2_intuitive" value="1" required><span>1</span></label><label><input type="radio" name="q2_intuitive" value="2"><span>2</span></label><label><input type="radio" name="q2_intuitive" value="3"><span>3</span></label><label><input type="radio" name="q2_intuitive" value="4"><span>4</span></label><label><input type="radio" name="q2_intuitive" value="5"><span>5</span></label></div><span>非常にそう思う</span></div></div><div class="survey-question"><p class="question-text">3. 食品をどこに配置するか、判断に迷うことが多かった</p><div class="likert-scale"><span>全くそう思わない</span><div class="likert-options"><label><input type="radio" name="q3_confused" value="1" required><span>1</span></label><label><input type="radio" name="q3_confused" value="2"><span>2</span></label><label><input type="radio" name="q3_confused" value="3"><span>3</span></label><label><input type="radio" name="q3_confused" value="4"><span>4</span></label><label><input type="radio" name="q3_confused" value="5"><span>5</span></label></div><span>非常にそう思う</span></div></div></fieldset>
                <fieldset class="survey-section"><legend>B. ご自身の思考プロセスや戦略について</legend><div class="survey-question"><p class="question-text">4. 実験を始める前に、ある程度の配置計画を立てていた</p><div class="likert-scale"><span>計画なし</span><div class="likert-options"><label><input type="radio" name="q4_plan" value="1" required><span>1</span></label><label><input type="radio" name="q4_plan" value="2"><span>2</span></label><label><input type="radio" name="q4_plan" value="3"><span>3</span></label><label><input type="radio" name="q4_plan" value="4"><span>4</span></label><label><input type="radio" name="q4_plan" value="5"><span>5</span></label></div><span>綿密に計画</span></div></div><div class="survey-question"><p class="question-text">5. 個々の食品の関係よりも、全体のバランスを考えながら配置した</p><div class="likert-scale"><span>全くそう思わない</span><div class="likert-options"><label><input type="radio" name="q5_balance" value="1" required><span>1</span></label><label><input type="radio" name="q5_balance" value="2"><span>2</span></label><label><input type="radio" name="q5_balance" value="3"><span>3</span></label><label><input type="radio" name="q5_balance" value="4"><span>4</span></label><label><input type="radio" name="q5_balance" value="5"><span>5</span></label></div><span>非常にそう思う</span></div></div><div class="survey-question"><p class="question-text">6. グループ分けをする際、見た目の類似性を重視した</p><div class="likert-scale"><span>全くそう思わない</span><div class="likert-options"><label><input type="radio" name="q6_visual" value="1" required><span>1</span></label><label><input type="radio" name="q6_visual" value="2"><span>2</span></label><label><input type="radio" name="q6_visual" value="3"><span>3</span></label><label><input type="radio" name="q6_visual" value="4"><span>4</span></label><label><input type="radio" name="q6_visual" value="5"><span>5</span></label></div><span>非常にそう思う</span></div></div><div class="survey-question"><p class="question-text">7. グループ分けをする際、味や食文化といった抽象的な関連性を重視した</p><div class="likert-scale"><span>全くそう思わない</span><div class="likert-options"><label><input type="radio" name="q7_abstract" value="1" required><span>1</span></label><label><input type="radio" name="q7_abstract" value="2"><span>2</span></label><label><input type="radio" name="q7_abstract" value="3"><span>3</span></label><label><input type="radio" name="q7_abstract" value="4"><span>4</span></label><label><input type="radio" name="q7_abstract" value="5"><span>5</span></label></div><span>非常にそう思う</span></div></div><div class="survey-question"><p class="question-text">8. 最終的な食品の配置とグループ分けに、自分自身で納得している</p><div class="likert-scale"><span>全くそう思わない</span><div class="likert-options"><label><input type="radio" name="q8_satisfied" value="1" required><span>1</span></label><label><input type="radio" name="q8_satisfied" value="2"><span>2</span></label><label><input type="radio" name="q8_satisfied" value="3"><span>3</span></label><label><input type="radio" name="q8_satisfied" value="4"><span>4</span></label><label><input type="radio" name="q8_satisfied" value="5"><span>5</span></label></div><span>非常にそう思う</span></div></div></fieldset>
                <fieldset class="survey-section"><legend>C. あなたの食生活について</legend><div class="survey-question"><p class="question-text">9. 普段、どのくらいの頻度で自炊をしますか？</p><div class="likert-scale" id="q9_cooking_freq"><label><input type="radio" name="q9_cooking_freq" value="1" required><span>全くしない</span></label><label><input type="radio" name="q9_cooking_freq" value="2"><span>月に数回</span></label><label><input type="radio" name="q9_cooking_freq" value="3"><span>週に1-2回</span></label><label><input type="radio" name="q9_cooking_freq" value="4"><span>週に3-5回</span></label><label><input type="radio" name="q9_cooking_freq" value="5"><span>ほぼ毎日</span></label></div></div><div class="survey-question"><p class="question-text">10. 食や料理に対する関心は強い方だ</p><div class="likert-scale"><span>全くそう思わない</span><div class="likert-options"><label><input type="radio" name="q10_interest" value="1" required><span>1</span></label><label><input type="radio" name="q10_interest" value="2"><span>2</span></label><label><input type="radio" name="q10_interest" value="3"><span>3</span></label><label><input type="radio" name="q10_interest" value="4"><span>4</span></label><label><input type="radio" name="q10_interest" value="5"><span>5</span></label></div><span>非常にそう思う</span></div></div><div class="survey-question"><p class="question-text">11. 冷凍食品を食べる機会は多い</p><div class="likert-scale"><span>全くそう思わない</span><div class="likert-options"><label><input type="radio" name="q11_frozen" value="1" required><span>1</span></label><label><input type="radio" name="q11_frozen" value="2"><span>2</span></label><label><input type="radio" name="q11_frozen" value="3"><span>3</span></label><label><input type="radio" name="q11_frozen" value="4"><span>4</span></label><label><input type="radio" name="q11_frozen" value="5"><span>5</span></label></div><span>非常にそう思う</span></div></div><div class="survey-question"><p class="question-text">12. 今回の実験で表示された食品のうち、知らなかった、または何かわからなかったものがあれば、全てにチェックを入れてください。</p><div class="checkbox-group" id="q12_unknown_foods"></div></div></fieldset>
                <button id="submitAndFinishBtn" type="submit">アンケートを回答し、データを送信する</button>
                `;

                const unknownFoodsContainer = document.getElementById('q12_unknown_foods');
                if (unknownFoodsContainer) {
                    foodList.forEach(food => {
                        const label = document.createElement('label');
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.name = 'unknown_foods[]';
                        checkbox.value = food.name;
                        label.appendChild(checkbox);
                        label.appendChild(document.createTextNode(` ${food.label}`));
                        unknownFoodsContainer.appendChild(label);
                    });
                }
                
                // ★★★ここが重要★★★
                // 新しく生成した送信ボタンを取得して、クリックイベントを設定
                const submitAndFinishBtn = document.getElementById('submitAndFinishBtn');
                if (submitAndFinishBtn) {
                    submitAndFinishBtn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        if (!form.checkValidity()) {
                            alert('未回答のアンケート項目があります。全ての項目にご回答ください。');
                            form.reportValidity();
                            return;
                        }
                        
                        const surveyData = {};
                        const formData = new FormData(form);
                        for (const [key, value] of formData.entries()) {
                            if (key.endsWith('[]')) {
                                const cleanKey = key.slice(0, -2);
                                if (!surveyData[cleanKey]) surveyData[cleanKey] = [];
                                surveyData[cleanKey].push(value);
                            } else {
                                surveyData[key] = value;
                            }
                        }
                        if (!surveyData.unknown_foods) {
                            surveyData.unknown_foods = [];
                        }
                        experimentData.survey = surveyData;
                        
showLoading(true, "データを送信中...");

try {
  const gasWebAppUrl = 'https://script.google.com/macros/s/AKfycbz0bmNUp44bmRt6_HEC1kulC1SAcEhP7VljceEIT4uqrXfb5wA-ICiO2YN1WlPTYvsA/exec';
  const dataToSave = { ...experimentData, experimentEndTimeISO: new Date().toISOString() };

  // レスポンスは読まずに送るだけ
  await fetch(gasWebAppUrl, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(dataToSave)
  });

} catch (error) {
  console.warn('[WARNING] fetch failed but probably sent successfully:', error);

} finally {
  // 成否に関わらず完了画面へ
  showScreen(screen5);
  updateStepper(5);
  showLoading(false);
}

                    });
                }
            }
            showScreen(screen4);
            updateStepper(4);
        });
    }



    if (backToScreen1Btn) {
        backToScreen1Btn.addEventListener('click', () => {
            if (confirm("前の画面に戻りますか？")) {
                showScreen(screen1);
                currentMode = 'intro';
            }
        });
    }
    if (backToScreen2Btn) {
        backToScreen2Btn.addEventListener('click', () => {
            if (confirm("このフェーズを最初からやり直しますか？\n注意：現在の配置やクラスターの情報は全てリセットされます。")) {
                document.body.classList.remove('feedback-mode-active'); // ★ この行を追加
                resetScreen3UI();
                showScreen(screen2);
                currentMode = 'instructions';
            }
        });
    }
    if (backToStartBtn2) {
        backToStartBtn2.addEventListener('click', () => {
            if (confirm("最初の画面に戻りますか？")) {
                showScreen(screen1);
                currentMode = 'intro';
            }
        });
    }

    if (clusterCanvas) {
        clusterCanvas.addEventListener('mousedown', handleClusterMouseDown);
        clusterCanvas.addEventListener('click', handleClusterClick);
    }

    try { loadFoodListFromLocalStorage(); } catch (e) { console.error("Error loading food list:", e); }
    try {
        if (screen1) showScreen(screen1); else { console.error("CRITICAL: screen1 not found!"); alert("初期画面エラー"); }
    } catch (e) { console.error("Error showing screen1:", e); }
    console.log("[DEBUG] initializeApp: Finished.");
}


function waitImagesLoaded(rootEl) {
  const imgs = Array.from(rootEl.querySelectorAll('img'));
  if (imgs.length === 0) return Promise.resolve();
  let done = 0;
  return new Promise(res => {
    const check = () => { if (++done >= imgs.length) res(); };
    imgs.forEach(img => {
      if (img.complete) check();
      else {
        img.addEventListener('load', check, { once: true });
        img.addEventListener('error', check, { once: true });
      }
    });
  });
}


// 中央配置＋リング配置
function arrangeInitialLayout(canvas, containersMap) {
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    const cx = W / 2;
    const cy = H / 2;

    // DOMからおおよそのアイテムサイズを推定（最初の要素を使う）
    const any = Object.values(containersMap)[0];
    const itemW = any ? any.offsetWidth || 96 : 96;
    const itemH = any ? any.offsetHeight || 96 : 96;
    const itemR = Math.max(itemW, itemH) / 2;

    // リング半径（枠や重なりを避けるため、最小辺の約40%くらいを基準に）
    const ringRadius = Math.max(
        120, 
        Math.min(W, H) * 0.40 - itemR - RING_PADDING
    );

    // ミートパイ＝センター
    const meat = containersMap[MEAT_PIE_NAME];
    if (meat) {
        setCenterPos(meat, cx, cy);
        // 上バーをやさしい赤にするためのクラスを付与
        const dh = meat.querySelector('.drag-handle');
        if (dh) dh.classList.add('is-meatpie');
    }

    // 残りをリングに等間隔（少しだけランダム揺らぎ）
    const others = Object.keys(containersMap).filter(n => n !== MEAT_PIE_NAME);
    const n = others.length;
    if (n === 0) return;

    // 接触しない角度間隔の目安（超ざっくり）
    const neededArc = (Math.max(itemW, itemH) + MIN_GAP) / ringRadius; // ラジアン
    const baseStep = Math.max((2 * Math.PI) / n, neededArc);
    let angle = -Math.PI / 2; // 上から並べ始め

    for (const name of others) {
        const jitter = (Math.random() - 0.5) * (baseStep * 0.25);
        const a = angle + jitter;
        const x = cx + ringRadius * Math.cos(a);
        const y = cy + ringRadius * Math.sin(a);
        setCenterPos(containersMap[name], x, y);
        angle += baseStep;
    }
}

// 中心(cx,cy)で指定 → CSSのleft/topへ反映
function setCenterPos(el, cx, cy) {
    const w = el.offsetWidth || 96;
    const h = el.offsetHeight || 96;
    el.style.position = 'absolute';
    el.style.left = `${Math.round(cx - w / 2)}px`;
    el.style.top  = `${Math.round(cy - h / 2)}px`;
}




function initializeExperiment() {
    let infoViewStartTime = null;
    let lastViewedFood = null;
    console.log('[DEBUG] initializeExperiment: Started. Current mode is:', currentMode);
    if (currentMode !== 'placement') {
        currentMode = 'placement';
    }
    if (!canvasContainer || !clusterCanvas || (clusterCanvas && !ctx) || !detailsPanel) {
        updateStatusMessage("エラー: 実験エリアの初期化に失敗しました。");
        return;
    }

    try {
        clusterCanvas.width = canvasContainer.clientWidth;
        clusterCanvas.height = canvasContainer.clientHeight;
        ctx.clearRect(0, 0, clusterCanvas.width, clusterCanvas.height);


        experimentData.startTime = Date.now();
        experimentData.moveHistory = [];
        experimentData.clusters = [];
        experimentData.positions = [];

        if (detailsPanel) {
            detailsPanel.innerHTML = `<h3 id="details-food-name"></h3><img id="details-food-image" src="" alt="選択された食品の画像" style="display:none;"><div id="details-food-info"></div><p id="details-placeholder" class="info-text" style="display:block;">食品の[i]ボタンをクリックすると、ここに詳細情報が表示されます。</p>`;
        }
        displayFoodDetails(null);

        experimentData.moveHistory.push({ timestamp: 0, eventType: 'experimentStart', target: 'experiment', details: { message: '配置フェーズ開始' } });
        canvasContainer.querySelectorAll('.food-container').forEach(fc => fc.remove());
        removeActiveDeleteButton();
        foodContainers = {};

        foodList.forEach((food) => {
            const foodContainer = document.createElement('div');
            foodContainer.className = 'food-container';
            foodContainer.dataset.name = food.name;

            const dragHandle = document.createElement('div');
            dragHandle.className = 'drag-handle';
            const actionButton = document.createElement('div');
            actionButton.className = 'info-button'; actionButton.textContent = 'i';
            actionButton.title = `${food.label}について`;
            dragHandle.appendChild(actionButton);
            foodContainer.appendChild(dragHandle);
            
            const img = document.createElement('img');
            img.src = food.imgSrc; img.alt = food.label; img.className = 'food-image';
            img.onerror = () => { img.alt = `${food.label} (画像読込失敗)`; };
            foodContainer.appendChild(img);
            canvasContainer.appendChild(foodContainer);
            // すべてDOMに追加し終わったら、中央＋リング配置を実行
arrangeInitialLayout(canvasContainer, foodContainers);

// 配置結果を experimentData.positions に記録（moveHistoryも）
experimentData.positions = [];
Object.entries(foodContainers).forEach(([name, el]) => {
    experimentData.positions.push({ name, x: el.offsetLeft, y: el.offsetTop });
    experimentData.moveHistory.push({
        timestamp: getCurrentTimestamp(),
        eventType: 'initialPlace',
        target: name,
        position: { x: el.offsetLeft, y: el.offsetTop }
    });
});

            foodContainers[food.name] = foodContainer;
            makeDraggable(foodContainer, dragHandle, food, { infoViewStartTime, lastViewedFood });
        });
        awaitImagesAndArrange();

async function awaitImagesAndArrange() {
  await waitImagesLoaded(canvasContainer);                      // ← 画像読み込み待ち
  arrangeInitialLayout(canvasContainer, foodContainers);        // ← 中央＋円形配置

  // 配置結果を experimentData に記録
  experimentData.positions = [];
  Object.entries(foodContainers).forEach(([name, el]) => {
    experimentData.positions.push({ name, x: el.offsetLeft, y: el.offsetTop });
    experimentData.moveHistory.push({
      timestamp: getCurrentTimestamp(),
      eventType: 'initialPlace',
      target: name,
      position: { x: el.offsetLeft, y: el.offsetTop }
    });
  });
}
        updateStatusMessage('食品の青いバーをドラッグして自由に配置してください。');
        if (finishPlacementBtn) finishPlacementBtn.style.display = 'inline-block';
        if (goToFeedbackBtn) goToFeedbackBtn.style.display = 'none';
        if (saveFeedbackAndDataBtn) saveFeedbackAndDataBtn.style.display = 'none';
        if (clusterCanvas) clusterCanvas.classList.remove('active-drawing');
        document.querySelectorAll('.food-container .info-button').forEach(btn => btn.style.pointerEvents = 'auto');
    } catch (error) {
        console.error("[CRITICAL_ERROR] Error within initializeExperiment main block:", error);
        updateStatusMessage("エラー: 食品アイテムの配置中に問題が発生しました。");
    }
    console.log('[DEBUG] initializeExperiment finished.');
}

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
    const itemsInCluster = currentDrawingCluster.items.map(item => {
        const food = foodList.find(f => f.name === item.name);
        return food ? food.label : item.name;
    }).join('、 ');

    const confirmationMessage = `以下の食品でクラスターを作成しますか？\n\n【内容】\n${itemsInCluster}`;
    
    // 確認ダイアログを表示
    if (confirm(confirmationMessage)) {
        const clusterName = prompt("このクラスターの名前を入力してください:", `クラスター${experimentData.clusters.length + 1}`);
        if (clusterName && clusterName.trim() !== "") {
            currentDrawingCluster.name = clusterName.trim();
            experimentData.clusters.push(currentDrawingCluster);
            experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'clusterCreated', target: currentDrawingCluster.name, details: { id: currentDrawingCluster.id, type: 'circle', radius: currentDrawingCluster.radius, itemCount: currentDrawingCluster.items.length } });
        } else {
             experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'clusterDrawCancel', target: 'clusterCanvas', details: { message: 'No name provided for circle cluster' } });
        }
    }
    // もし確認ダイアログで「キャンセル」が押されたら、何もしない
    currentDrawingCluster = null; ctx.clearRect(0, 0, clusterCanvas.width, clusterCanvas.height); drawAllClusters();
}

function identifyItemsInCluster(cluster) {
    if (!cluster || cluster.type !== 'circle' || cluster.radius <= 0) return;
    cluster.items = [];
    const cRect = canvasContainer.getBoundingClientRect();

    Object.values(foodContainers).forEach(container => {
        const rect = container.getBoundingClientRect();
        const itemLeft = rect.left - cRect.left;
        const itemRight = itemLeft + rect.width;
        const itemTop = rect.top - cRect.top;
        const itemBottom = itemTop + rect.height;

        // 円の中心から最も近い矩形上の点を見つける
        const closestX = Math.max(itemLeft, Math.min(cluster.centerX, itemRight));
        const closestY = Math.max(itemTop, Math.min(cluster.centerY, itemBottom));

        // その点と円の中心との距離を計算
        const dx = cluster.centerX - closestX;
        const dy = cluster.centerY - closestY;
        const distanceToEdge = Math.sqrt((dx * dx) + (dy * dy));

        // 矩形が円に少しでも触れているかを判定
        if (distanceToEdge <= cluster.radius) {
            // 関連度（relevance）の計算は、アイコンの中心点で行う
            const itemCenterX = itemLeft + rect.width / 2;
            const itemCenterY = itemTop + rect.height / 2;
            const distanceToCenter = Math.sqrt(Math.pow(itemCenterX - cluster.centerX, 2) + Math.pow(itemCenterY - cluster.centerY, 2));
            
            // 中心点が円の外にある場合でも、関連度がマイナスにならないように0に固定
            const normalizedDistance = Math.min(distanceToCenter, cluster.radius);
            const relevance = Math.round((1 - (normalizedDistance / cluster.radius)) * 100);

            cluster.items.push({ 
                name: container.dataset.name, 
                relevance: relevance 
            });
        }
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