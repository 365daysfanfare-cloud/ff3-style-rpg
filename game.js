// ゲーム定数
const CLASSES = [
    { name: '戦士', hp: 50, atk: 15, def: 12, mag: 5, spr: 5 },
    { name: '魔法使い', hp: 30, atk: 8, def: 6, mag: 18, spr: 12 },
    { name: '僧侶', hp: 40, atk: 10, def: 10, mag: 12, spr: 16 },
    { name: '盗賊', hp: 35, atk: 16, def: 9, mag: 8, spr: 7 },
    { name: '黒魔導士', hp: 25, atk: 6, def: 5, mag: 20, spr: 10 },
    { name: '白魔導士', hp: 28, atk: 7, def: 6, mag: 15, spr: 18 },
    { name: '狩人', hp: 45, atk: 14, def: 11, mag: 7, spr: 6 },
    { name: 'ナイト', hp: 60, atk: 13, def: 15, mag: 6, spr: 8 },
    { name: '忍者', hp: 32, atk: 18, def: 8, mag: 9, spr: 9 },
    { name: 'モンク', hp: 48, atk: 17, def: 10, mag: 10, spr: 11 }
];

const STAGES = [
    { name: 'イノシシの森', enemies: [{ name: 'イノシシ', maxHp: 20, atk: 8, def: 3, mag: 2, spr: 2, sprite: '🐗' }], goldReward: 100 },
    { name: 'スライム沼', enemies: [{ name: 'スライム', maxHp: 15, atk: 6, def: 2, mag: 3, spr: 3, sprite: '🟢' }, { name: 'スライム', maxHp: 15, atk: 6, def: 2, mag: 3, spr: 3, sprite: '🟢' }], goldReward: 150 },
    { name: 'ゴブリン洞窟', enemies: [{ name: 'ゴブリン', maxHp: 25, atk: 10, def: 4, mag: 3, spr: 3, sprite: '👹' }], goldReward: 200 },
    { name: 'スケルトン墓地', enemies: [{ name: 'スケルトン', maxHp: 30, atk: 12, def: 5, mag: 2, spr: 2, sprite: '💀' }, { name: 'スケルトン', maxHp: 30, atk: 12, def: 5, mag: 2, spr: 2, sprite: '💀' }], goldReward: 250 },
    { name: 'オークの砦', enemies: [{ name: 'オーク', maxHp: 40, atk: 14, def: 6, mag: 4, spr: 4, sprite: '🐗' }], goldReward: 300 },
    { name: 'ドラゴンの巣', enemies: [{ name: 'ワイバーン', maxHp: 50, atk: 16, def: 7, mag: 8, spr: 6, sprite: '🐉' }], goldReward: 400 },
    { name: '悪魔の塔1階', enemies: [{ name: '悪魔', maxHp: 45, atk: 15, def: 8, mag: 12, spr: 8, sprite: '😈' }, { name: '悪魔', maxHp: 45, atk: 15, def: 8, mag: 12, spr: 8, sprite: '😈' }], goldReward: 450 },
    { name: '悪魔の塔2階', enemies: [{ name: '上位悪魔', maxHp: 60, atk: 18, def: 10, mag: 15, spr: 10, sprite: '😈' }], goldReward: 500 },
    { name: '悪魔の塔3階', enemies: [{ name: '魔王', maxHp: 100, atk: 20, def: 12, mag: 18, spr: 12, sprite: '👿' }, { name: '上位悪魔', maxHp: 60, atk: 18, def: 10, mag: 15, spr: 10, sprite: '😈' }], goldReward: 600 },
    { name: '魔王の玉座', enemies: [{ name: '大魔王', maxHp: 150, atk: 25, def: 15, mag: 22, spr: 15, sprite: '👿' }], goldReward: 1000 }
];

// ゲーム状態
let gameState = {
    screen: 'menu',
    party: [],
    currentStage: 0,
    currentEnemies: [],
    battleLog: [],
    gold: 0,
    gameOverReason: ''
};

// 初期化
function init() {
    render();
}

// レンダリング
function render() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    switch (gameState.screen) {
        case 'menu':
            renderMenu(app);
            break;
        case 'characterCreation':
            renderCharacterCreation(app);
            break;
        case 'game':
            renderGame(app);
            break;
        case 'saveLoad':
            renderSaveLoad(app);
            break;
        case 'gameover':
            renderGameOver(app);
            break;
    }
}

// メニュー画面
function renderMenu(container) {
    const html = `
        <div class="menu-screen">
            <h1>⚔️ FF3風RPG</h1>
            <div class="menu-buttons">
                <button onclick="startNewGame()">新規ゲーム</button>
                <button onclick="goToSaveLoad('load')">ゲームを読み込む</button>
            </div>
        </div>
    `;
    container.innerHTML = html;
}

// キャラクター作成画面
function renderCharacterCreation(container) {
    let formHtml = '<div class="character-creation-screen"><h2>パーティを編成しよう</h2><div class="character-form">';
    
    for (let i = 0; i < 3; i++) {
        const character = gameState.party[i] || {};
        formHtml += `
            <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                <h3 style="color: #ffd700; margin-bottom: 10px;">キャラクター ${i + 1}</h3>
                <div class="form-group">
                    <label>名前</label>
                    <input type="text" id="name${i}" value="${character.name || ''}" placeholder="キャラクター名">
                </div>
                <div class="form-group">
                    <label>職業</label>
                    <select id="class${i}">
                        ${CLASSES.map((cls, idx) => `<option value="${idx}" ${character.classIndex === idx ? 'selected' : ''}>${cls.name}</option>`).join('')}
                    </select>
                </div>
                <div class="character-preview">
                    <div id="preview${i}"></div>
                </div>
            </div>
        `;
    }

    formHtml += `
        </div>
        <div class="form-buttons">
            <button onclick="confirmCharacters()">決定</button>
            <button onclick="backToMenu()">戻る</button>
        </div>
        </div>
    `;

    container.innerHTML = formHtml;

    // プレビュー更新
    for (let i = 0; i < 3; i++) {
        updateCharacterPreview(i);
        document.getElementById(`class${i}`).addEventListener('change', () => updateCharacterPreview(i));
    }
}

function updateCharacterPreview(index) {
    const classSelect = document.getElementById(`class${index}`);
    if (!classSelect) return;
    
    const classIndex = parseInt(classSelect.value);
    const cls = CLASSES[classIndex];
    
    const html = `
        <p><span class="stat">${cls.name}</span></p>
        <p>HP: <span class="stat">${cls.hp}</span> | ATK: <span class="stat">${cls.atk}</span> | DEF: <span class="stat">${cls.def}</span></p>
        <p>MAG: <span class="stat">${cls.mag}</span> | SPR: <span class="stat">${cls.spr}</span></p>
    `;
    
    const preview = document.getElementById(`preview${index}`);
    if (preview) {
        preview.innerHTML = html;
    }
}

// ゲーム画面
function renderGame(container) {
    const stage = STAGES[gameState.currentStage];
    
    let enemiesHtml = '';
    gameState.currentEnemies.forEach(enemy => {
        const hpPercent = (enemy.hp / enemy.maxHp) * 100;
        enemiesHtml += `
            <div style="margin-bottom: 20px;">
                <div class="enemy-sprite">${enemy.sprite}</div>
                <div class="enemy-hp-info">
                    <p>${enemy.name}</p>
                    <div class="hp-bar">
                        <div class="hp-fill" style="width: ${hpPercent}%">${enemy.hp}/${enemy.maxHp}</div>
                    </div>
                </div>
            </div>
        `;
    });

    let partyHtml = '';
    gameState.party.forEach((char, idx) => {
        const hpPercent = (char.hp / char.maxHp) * 100;
        partyHtml += `
            <div class="character-card">
                <h4>${char.name} (${char.className})</h4>
                <p>Lv.${char.level}</p>
                <div class="hp-bar">
                    <div class="hp-fill" style="width: ${hpPercent}%">${char.hp}/${char.maxHp}</div>
                </div>
                <p>ATK: ${char.atk} | DEF: ${char.def} | MAG: ${char.mag}</p>
            </div>
        `;
    });

    let logHtml = '';
    gameState.battleLog.forEach(log => {
        const logType = log.type || 'info';
        const logMessage = log.message || log;
        logHtml += `<div class="log-entry ${logType}">${logMessage}</div>`;
    });

    const html = `
        <div class="game-screen">
            <div class="game-left">
                <div class="stage-info">
                    <h3>🗺️ ${stage.name}</h3>
                    <p>ステージ: ${gameState.currentStage + 1}/10</p>
                </div>
                <div class="battle-log">${logHtml}</div>
            </div>
            <div class="game-right">
                <div class="party-status">
                    <h3>⚔️ パーティ</h3>
                    ${partyHtml}
                </div>
                <div class="enemy-area">
                    <h3>敵</h3>
                    ${enemiesHtml}
                </div>
                <div class="actions">
                    <h3>⚡ アクション</h3>
                    <div class="action-buttons">
                        <button onclick="playerAttack(0)">攻撃</button>
                        <button onclick="playerMagic(0)">魔法</button>
                        <button onclick="playerDefend(0)">防御</button>
                        <button onclick="goToSaveLoad('save')">セーブ</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// セーブロード画面
function renderSaveLoad(container) {
    const action = gameState.lastAction || 'save';
    
    let slotsHtml = '';
    for (let i = 0; i < 5; i++) {
        const saveData = JSON.parse(localStorage.getItem(`save${i}`));
        if (saveData) {
            slotsHtml += `
                <div class="save-slot" onclick="handleSaveLoad(${i}, '${action}')">
                    <div class="save-slot-info">セーブ ${i + 1}</div>
                    <div class="save-slot-details">
                        ステージ: ${saveData.currentStage + 1}/10 | ゴールド: ${saveData.gold}
                    </div>
                </div>
            `;
        } else {
            slotsHtml += `
                <div class="save-slot empty" onclick="handleSaveLoad(${i}, '${action}')">
                    <div class="save-slot-info">セーブ ${i + 1} (空)</div>
                </div>
            `;
        }
    }

    const html = `
        <div class="save-load-screen">
            <h2>${action === 'save' ? 'セーブする' : 'ロードする'}</h2>
            <div class="save-slots">${slotsHtml}</div>
            <div style="margin-top: 20px;">
                <button onclick="backToGame()" style="width: 100%;">戻る</button>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// ゲームオーバー画面
function renderGameOver(container) {
    const isCleared = gameState.currentStage >= 10;
    const html = `
        <div class="gameover-screen">
            <h2>${isCleared ? '🎉 ゲームクリア!' : '💀 ゲームオーバー'}</h2>
            <p>${gameState.gameOverReason}</p>
            <p>獲得ゴールド: ${gameState.gold}</p>
            <div class="menu-buttons" style="margin-top: 30px;">
                <button onclick="goToMenu()">メニューに戻る</button>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// ゲーム操作
function startNewGame() {
    gameState = {
        screen: 'characterCreation',
        party: [],
        currentStage: 0,
        currentEnemies: [],
        battleLog: [],
        gold: 0,
        gameOverReason: ''
    };
    render();
}

function confirmCharacters() {
    gameState.party = [];
    for (let i = 0; i < 3; i++) {
        const name = document.getElementById(`name${i}`).value || `キャラ${i + 1}`;
        const classIndex = parseInt(document.getElementById(`class${i}`).value);
        const cls = CLASSES[classIndex];

        gameState.party.push({
            name: name,
            className: cls.name,
            classIndex: classIndex,
            level: 1,
            exp: 0,
            maxHp: cls.hp,
            hp: cls.hp,
            atk: cls.atk,
            def: cls.def,
            mag: cls.mag,
            spr: cls.spr
        });
    }

    gameState.screen = 'game';
    startBattle();
    render();
}

function startBattle() {
    const stage = STAGES[gameState.currentStage];
    gameState.currentEnemies = stage.enemies.map(enemy => ({
        name: enemy.name,
        maxHp: enemy.maxHp,
        hp: enemy.maxHp,
        atk: enemy.atk,
        def: enemy.def,
        mag: enemy.mag,
        spr: enemy.spr,
        sprite: enemy.sprite
    }));
    
    // battleLog を正しいフォーマットで初期化
    gameState.battleLog = [
        { type: 'info', message: `${stage.name}に入った！` },
        { type: 'info', message: `敵が現れた：${gameState.currentEnemies.map(e => e.name).join('、')}` }
    ];
}

function playerAttack(charIndex) {
    const char = gameState.party[charIndex];
    const enemy = gameState.currentEnemies[0];
    
    if (!enemy) return;

    const damage = Math.max(1, char.atk + Math.floor(Math.random() * 10) - enemy.def);
    enemy.hp = Math.max(0, enemy.hp - damage);

    gameState.battleLog.push({
        type: 'player',
        message: `${char.name}の攻撃！${enemy.name}に${damage}のダメージ`
    });

    if (enemy.hp <= 0) {
        gameState.battleLog.push({
            type: 'info',
            message: `${enemy.name}を倒した！`
        });
        gameState.currentEnemies.shift();

        if (gameState.currentEnemies.length === 0) {
            stageClear();
        }
    } else {
        enemyTurn();
    }

    render();
}

function playerMagic(charIndex) {
    const char = gameState.party[charIndex];
    const enemy = gameState.currentEnemies[0];
    
    if (!enemy) return;

    const damage = Math.max(1, char.mag * 1.5 + Math.floor(Math.random() * 15) - enemy.spr);
    enemy.hp = Math.max(0, enemy.hp - damage);

    gameState.battleLog.push({
        type: 'player',
        message: `${char.name}が魔法を唱えた！${enemy.name}に${Math.floor(damage)}のダメージ`
    });

    if (enemy.hp <= 0) {
        gameState.battleLog.push({
            type: 'info',
            message: `${enemy.name}を倒した！`
        });
        gameState.currentEnemies.shift();

        if (gameState.currentEnemies.length === 0) {
            stageClear();
        }
    } else {
        enemyTurn();
    }

    render();
}

function playerDefend(charIndex) {
    const char = gameState.party[charIndex];
    gameState.battleLog.push({
        type: 'player',
        message: `${char.name}は防御した！`
    });
    char.def += 5;
    enemyTurn();
    char.def -= 5;
    render();
}

function enemyTurn() {
    gameState.currentEnemies.forEach(enemy => {
        const target = gameState.party[Math.floor(Math.random() * gameState.party.length)];
        const damage = Math.max(1, enemy.atk + Math.floor(Math.random() * 8) - target.def);
        target.hp = Math.max(0, target.hp - damage);

        gameState.battleLog.push({
            type: 'enemy',
            message: `${enemy.name}の攻撃！${target.name}に${damage}のダメージ`
        });

        if (target.hp <= 0) {
            gameState.battleLog.push({
                type: 'enemy',
                message: `${target.name}は倒れた...`
            });
        }
    });

    if (gameState.party.every(char => char.hp <= 0)) {
        gameState.screen = 'gameover';
        gameState.gameOverReason = 'パーティが全滅した...';
    }
}

function stageClear() {
    gameState.gold += STAGES[gameState.currentStage].goldReward;
    gameState.battleLog.push({
        type: 'info',
        message: `ステージクリア！${STAGES[gameState.currentStage].goldReward}ゴールド獲得`
    });

    gameState.party.forEach(char => {
        char.level += 1;
        char.maxHp += 10;
        char.hp = char.maxHp;
        char.atk += 2;
        char.def += 1;
        char.mag += 1;
        char.spr += 1;
    });

    gameState.currentStage += 1;

    if (gameState.currentStage >= 10) {
        gameState.screen = 'gameover';
        gameState.gameOverReason = `全てのステージをクリアした！\n最終ゴールド: ${gameState.gold}`;
    } else {
        setTimeout(() => {
            startBattle();
            render();
        }, 1500);
    }
}

function goToSaveLoad(action) {
    gameState.screen = 'saveLoad';
    gameState.lastAction = action;
    render();
}

function handleSaveLoad(slotIndex, action) {
    if (action === 'save') {
        localStorage.setItem(`save${slotIndex}`, JSON.stringify(gameState));
        gameState.battleLog.push({
            type: 'info',
            message: `セーブスロット${slotIndex + 1}に保存しました`
        });
        gameState.screen = 'game';
    } else {
        const saveData = JSON.parse(localStorage.getItem(`save${slotIndex}`));
        if (saveData) {
            gameState = saveData;
            gameState.screen = 'game';
        }
    }
    render();
}

function backToGame() {
    gameState.screen = 'game';
    render();
}

function backToMenu() {
    gameState.screen = 'menu';
    render();
}

function goToMenu() {
    gameState.screen = 'menu';
    gameState = {
        screen: 'menu',
        party: [],
        currentStage: 0,
        currentEnemies: [],
        battleLog: [],
        gold: 0,
        gameOverReason: ''
    };
    render();
}

// ゲーム開始
init();
