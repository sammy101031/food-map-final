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

// 食品リスト
let foodList = [
{ name: "gyoza", label: "餃子", imgSrc: "gyoza.jpg", info: "油・水なしで、誰が調理しても簡単にパリッパリの羽根ができる、うす皮パリッと、ジューシーで具がギュッと詰まった焼き餃子です。\n誰もが好きな、間違いない安定感のある王道のおいしさです。\n国産のお肉と野菜を使用しています。\n【内容量】12個入り（276g）" },
{ name: "chahan", label: "チャーハン", imgSrc: "chahan.png", info: "焦がしにんにくのマー油と葱油の香ばしさや、噛むほどに広がる焼豚のうま味で、一度口にすると一心不乱に食べきってしまいたくなるチャーハンです。\n焦がしにんにくの香りを引き立たせ、焼豚の風味も調整し、メリハリのある味を実現。\nどんどん食べ進めたくなる味に進化しました。\n【内容量】580g" },
{ name: "empanada", label: "エンパナーダ", imgSrc: "empanada.jpg", info: "アルゼンチン伝統料理：本場の味わいを楽しめるエンパナーダの6個セット。南米の伝統的な味を日本で堪能できます。\n食べ比べセット：シェフが厳選した６種類のエンパナーダを一度に楽しめる贅沢な詰め合わせパック" },
{ name: "gratin", label: "グラタン", imgSrc: "gratin.png", info: "蔵王産ミルクを使用。チーズのおいしさとプリプリのえびがマッチしたグラタンです。\nチーズの風味豊かに！チーズを感じられるようカットサイズにもこだわっています。" },
{ name: "lasagna", label: "ラザニア", imgSrc: "lasagna.png", info: "オーブンで焼き上げたチーズが香ばしい、生パスタを使った本格ラザニア。ちょっと小腹がすいた時、お夜食に、ランチメニューの一品に、ビールのおつまみなどにぴったりな一品です。" },
{ name: "australian_meatpie", label: "オーストラリアンミートパイ", imgSrc: "australian_meatpie.jpg", info: "チーズ風味が香るミートソースは、100%オージービーフを使用しています。家族や友達、みんなで楽しめる6個入りパックです。\nパイ生地は、フタ部分と下のパイで2種類の異なるパイ生地を使用しています。\n特に上のフタになっているパイはサクサクに仕上げているので、なかのトロっとしたソースとの絶妙なコンビネーションを楽しめます。" },
{ name: "ravioli", label: "ラビオリ", imgSrc: "ravioli.webp", info: "爽やかな風味のリコッタチーズとほうれん草をパスタ生地で包みトマトソースで和えたラビオリです。リコッタのマイルドな味わいとトマトソースの相性は抜群、さらにチーズをトッピングし風味豊かに仕上げました。" },
{ name: "yakionigiri", label: "焼きおにぎり", imgSrc: "yakionigiri.jpg", info: "香りを立たせ、持続させるニッスイの独自技術「香りのＷアップ製法」で、しょうゆの風味と香りをより引き立たせました。\nたまりしょうゆと二段仕込みしょうゆをブレンドした、まろやかでコクのあるしょうゆの風味豊かな焼きおにぎりです。" },
{ name: "reitou_udon", label: "冷凍うどん", imgSrc: "reitou_udon.jpg", info: "強いコシと弾力のさぬきうどんに、瀬戸内産いりこを使用しただし香るまろやかでコクのあるつゆ。麺はこだわりの包丁切りで、つゆとの絡みも良くお召し上がりいただけます。" },
{ name: "reitou_pasta", label: "冷凍パスタ", imgSrc: "reitou_pasta.jpg", info: "牛挽肉の旨みと赤ワインの風味が特長のボロネーゼソース。ゴーダチーズとごろっと大きな揚げなすをトッピング。" },
{ name: "fried_potato", label: "フライドポテト", imgSrc: "fried_potato.jpg", info: "じゃがいもを細長く切って油で揚げた、世界中で人気のスナック。\n冷凍品を家庭で揚げるだけで、カリッとした食感が楽しめます。" },
{ name: "karaage", label: "鶏のから揚げ", imgSrc: "karaage.png", info: "食欲を満たす肉の塊、これぞから揚げの金字塔！\nにんにく風味アップでさらに白飯がガツガツ進む！\n秘伝にんにく油、葱油、特級醤油の極旨仕込みだれにじっくり漬け込んだ香りがクセになるから揚げです。\n火入れの温度にこだわった”秘伝にんにく油”でにんにくの香りが引き立ち、肉汁がジュワッと広がります。" }
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
([screen1, screen2, screen3, screen4, screen5]).forEach(s => {
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
if (foodContainers && foodContainers.hasOwnProperty(food.name)) foodContainers.food.name.classList.add('selected-food-item');
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
    detailsPanel.innerHTML = `<h3 id="details-food-name"></h3><img id="details-food-image" src="" alt="選択された食品の画像" style="display:none;"><div id="details-food-info"></div><p id="details-placeholder" class="info-text" style="display:block;">食品の「i」ボタンをクリックすると、ここに詳細情報が表示されます。</p>`;
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
        currentMode = 'clusterFeedback';
        removeActiveDeleteButton();
        updateStatusMessage('作成した各クラスターについて、以下の項目を記入してください。');
        if (detailsPanel) {
            detailsPanel.innerHTML = '';
            detailsPanel.scrollTop = 0;
            const placeholder = document.createElement('p');
            placeholder.id = 'details-placeholder';
            placeholder.className = 'info-text';
            detailsPanel.appendChild(placeholder);
            if (experimentData.clusters.length === 0) {
                placeholder.textContent = '作成されたクラスターはありません。このまま保存してください。';
                placeholder.style.display = 'block';
            } else {
                placeholder.style.display = 'none';
                experimentData.clusters.forEach((cluster, index) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'cluster-feedback-item';
                    const labels = cluster.items.map(name => (foodList.find(f => f.name === name) || {}).label || name).join('、 ');
                    const itemsText = labels.length > 0 ? ` (内容: ${labels})` : ' (内容なし)';
                    itemDiv.innerHTML = `<h4>クラスター: ${cluster.name}${itemsText}</h4>
                        <label for="reasonCreated_${index}">このクラスターを作成した理由:</label><textarea id="reasonCreated_${index}" data-cluster-index="${index}" data-feedback-type="reasonCreated" rows="3" placeholder="例：これらは「洋食」という点で似ていると感じたため。"></textarea>
                        <label for="meaning_${index}">どのような意味があると思いますか？:</label><textarea id="meaning_${index}" data-cluster-index="${index}" data-feedback-type="meaning" rows="3" placeholder="例：このグループは「子どもが好きな夕食メニュー」と言えるかもしれません。"></textarea>
                        <label for="reasonName_${index}">その名前にした理由:</label><textarea id="reasonName_${index}" data-cluster-index="${index}" data-feedback-type="reasonName" rows="3" placeholder="例：グループの特徴をそのまま名前にしました。"></textarea>`;
                    detailsPanel.appendChild(itemDiv);
                });
            }
        }
        if(goToFeedbackBtn) goToFeedbackBtn.style.display = 'none';
        if(saveFeedbackAndDataBtn) saveFeedbackAndDataBtn.style.display = 'inline-block';
        if(clusterCanvas) clusterCanvas.classList.remove('active-drawing');
        document.querySelectorAll('.food-container .info-button').forEach(btn => btn.style.pointerEvents = 'none');
        experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'enterClusterFeedback', target: 'application', details: { clusterCount: experimentData.clusters.length } });
    });
}

if (saveFeedbackAndDataBtn) {
    saveFeedbackAndDataBtn.addEventListener('click', () => {
        let allProvided = true;
        if (experimentData.clusters.length > 0) {
            for (let i = 0; i < experimentData.clusters.length; i++) {
                const reasonCreatedEl = document.getElementById(`reasonCreated_${i}`);
                const meaningEl = document.getElementById(`meaning_${i}`);
                const reasonNameEl = document.getElementById(`reasonName_${i}`);
                const checkAndMark = (el) => { if (!el || el.value.trim() === '') { allProvided = false; if (el) el.classList.add('feedback-missing'); return false; } else if (el) { el.classList.remove('feedback-missing'); } return true; };
                checkAndMark(reasonCreatedEl); checkAndMark(meaningEl); checkAndMark(reasonNameEl);
            }
        }
        if (!allProvided) { alert("全てのクラスターについて、3つのフィードバック項目すべてを記入してください。\n（未記入の項目は枠が赤くなっています）"); return; }
        experimentData.clusters.forEach((cluster, index) => {
            cluster.feedback = {
                reasonCreated: document.getElementById(`reasonCreated_${index}`)?.value.trim() || '',
                meaning: document.getElementById(`meaning_${index}`)?.value.trim() || '',
                reasonName: document.getElementById(`reasonName_${index}`)?.value.trim() || ''
            };
        });
        const form = document.getElementById('surveyForm');
        if(form) {
            form.innerHTML = ''; // Clear previous form
            const fullSurveyHTML = `
            <fieldset class="survey-section"><legend>A. 実験の全体的な感想について</legend><div class="survey-question"><p class="question-text">1. 今回の実験は楽しかった</p><div class="likert-scale"><span>全くそう思わない</span><div class="likert-options"><label><input type="radio" name="q1_fun" value="1" required><span>1</span></label><label><input type="radio" name="q1_fun" value="2"><span>2</span></label><label><input type="radio" name="q1_fun" value="3"><span>3</span></label><label><input type="radio" name="q1_fun" value="4"><span>4</span></label><label><input type="radio" name="q1_fun" value="5"><span>5</span></label></div><span>非常にそう思う</span></div></div><div class="survey-question"><p class="question-text">2. 食品を配置する作業は、直感的で分かりやすかった</p><div class="likert-scale"><span>全くそう思わない</span><div class="likert-options"><label><input type="radio" name="q2_intuitive" value="1" required><span>1</span></label><label><input type="radio" name="q2_intuitive" value="2"><span>2</span></label><label><input type="radio" name="q2_intuitive" value="3"><span>3</span></label><label><input type="radio" name="q2_intuitive" value="4"><span>4</span></label><label><input type="radio" name="q2_intuitive" value="5"><span>5</span></label></div><span>非常にそう思う</span></div></div><div class="survey-question"><p class="question-text">3. 食品をどこに配置するか、判断に迷うことが多かった</p><div class="likert-scale"><span>全くそう思わない</span><div class="likert-options"><label><input type="radio" name="q3_confused" value="1" required><span>1</span></label><label><input type="radio" name="q3_confused" value="2"><span>2</span></label><label><input type="radio" name="q3_confused" value="3"><span>3</span></label><label><input type="radio" name="q3_confused" value="4"><span>4</span></label><label><input type="radio" name="q3_confused" value="5"><span>5</span></label></div><span>非常にそう思う</span></div></div></fieldset>
            <fieldset class="survey-section"><legend>B. ご自身の思考プロセスや戦略について</legend><div class="survey-question"><p class="question-text">4. 実験を始める前に、ある程度の配置計画を立てていた</p><div class="likert-scale"><span>計画なし</span><div class="likert-options"><label><input type="radio" name="q4_plan" value="1" required><span>1</span></label><label><input type="radio" name="q4_plan" value="2"><span>2</span></label><label><input type="radio" name="q4_plan" value="3"><span>3</span></label><label><input type="radio" name="q4_plan" value="4"><span>4</span></label><label><input type="radio" name="q4_plan" value="5"><span>5</span></label></div><span>綿密に計画</span></div></div>