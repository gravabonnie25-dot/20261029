// 宣告走路精靈圖變數
let walkSprite;

// 宣告閃巴掌特效精靈圖變數
let slapSprite;

// 設定走路精靈圖的動畫格數
const WALK_FRAMES = 8;

// 設定閃巴掌特效精靈圖的動畫格數
const SLAP_FRAMES = 10;

// 設定走路精靈圖的整張圖片寬度
const WALK_SHEET_WIDTH = 451;

// 設定走路精靈圖的整張圖片高度
const WALK_SHEET_HEIGHT = 81;

// 設定閃巴掌精靈圖的整張圖片寬度
const SLAP_SHEET_WIDTH = 1222;

// 設定閃巴掌精靈圖的整張圖片高度
const SLAP_SHEET_HEIGHT = 122;

// 設定角色在畫面上的顯示高度
const CHARACTER_DISPLAY_HEIGHT = 180;

// 設定角色移動速度
const MOVE_SPEED = 5;

// 設定目前動畫影格
let currentFrame = 0;

// 設定上一次更新動畫影格的時間
let lastFrameTime = 0;

// 設定動畫影格切換間隔
const FRAME_INTERVAL = 100;

// 設定角色目前的水平位置
let characterX;

// 設定角色目前的垂直位置
let characterY;

// 設定目前是否播放閃巴掌動畫
let isSlapping = false;

// 預先載入圖片素材
function preload() {
  // 載入走路精靈圖
  walkSprite = loadImage(
    "走路/walk.png",
    // 圖片載入成功時顯示訊息
    () => console.log("走路精靈圖載入成功"),
    // 圖片載入失敗時顯示錯誤訊息
    () => console.error("走路精靈圖載入失敗，請確認檔案路徑是否正確")
  );

  // 載入閃巴掌特效精靈圖
  slapSprite = loadImage(
    "閃巴掌/特效.png",
    // 圖片載入成功時顯示訊息
    () => console.log("閃巴掌特效精靈圖載入成功"),
    // 圖片載入失敗時顯示錯誤訊息
    () => console.error("閃巴掌特效精靈圖載入失敗，請確認檔案路徑是否正確")
  );
}

// 設定程式初始狀態
function setup() {
  // 建立符合瀏覽器視窗大小的畫布
  const renderer = createCanvas(windowWidth, windowHeight);

  // 設定畫布使用固定定位
  renderer.elt.style.position = "fixed";

  // 將畫布固定在視窗左側
  renderer.elt.style.left = "0";

  // 將畫布固定在視窗上方
  renderer.elt.style.top = "0";

  // 設定畫布寬度填滿整個視窗
  renderer.elt.style.width = "100vw";

  // 設定畫布高度填滿整個視窗
  renderer.elt.style.height = "100vh";

  // 設定畫布以區塊方式顯示
  renderer.elt.style.display = "block";

  // 設定畫布位於網頁最底層
  renderer.elt.style.zIndex = "-1";

  // 將角色放在畫面中央
  characterX = width / 2;

  // 將角色垂直置中
  characterY = height / 2 - CHARACTER_DISPLAY_HEIGHT / 2;

  // 設定圖片從左上角開始繪製
  imageMode(CORNER);

  // 移除圖形外框
  noStroke();
}

// 每一幀執行一次
function draw() {
  // 設定背景顏色為 #bde0fe
  background("#bde0fe");

  // 判斷是否按下右方向鍵
  const rightPressed = keyIsDown(RIGHT_ARROW);

  // 判斷是否按下左方向鍵
  const leftPressed = keyIsDown(LEFT_ARROW);

  // 如果按下右方向鍵
  if (rightPressed) {
    // 切換為閃巴掌特效動畫
    isSlapping = true;

    // 讓角色向右移動
    characterX += MOVE_SPEED;
  }

  // 如果按下左方向鍵
  else if (leftPressed) {
    // 切換為走路動畫
    isSlapping = false;

    // 讓角色向左移動
    characterX -= MOVE_SPEED;
  }

  // 如果沒有按下方向鍵
  else {
    // 沒有移動時播放走路動畫
    isSlapping = false;
  }

  // 更新目前動畫影格
  updateAnimationFrame();

  // 限制角色不要超出畫布邊界
  limitCharacterPosition();

  // 繪製角色
  drawCharacter();
}

// 更新動畫影格
function updateAnimationFrame() {
  // 取得目前時間
  const currentTime = millis();

  // 判斷是否達到切換動畫影格的時間
  if (currentTime - lastFrameTime >= FRAME_INTERVAL) {
    // 將目前動畫影格加一
    currentFrame++;

    // 根據目前動畫種類循環播放影格
    if (isSlapping) {
      // 閃巴掌動畫播放到最後一格後回到第一格
      currentFrame %= SLAP_FRAMES;
    } else {
      // 走路動畫播放到最後一格後回到第一格
      currentFrame %= WALK_FRAMES;
    }

    // 記錄本次更新動畫的時間
    lastFrameTime = currentTime;
  }
}

// 限制角色位置
function limitCharacterPosition() {
  // 取得角色目前顯示寬度
  const characterWidth = getCharacterDisplayWidth();

  // 限制角色不能超出畫面左右兩側
  characterX = constrain(characterX, 0, width - characterWidth);

  // 讓角色保持在畫面垂直中央
  characterY = height / 2 - CHARACTER_DISPLAY_HEIGHT / 2;
}

// 取得角色目前顯示寬度
function getCharacterDisplayWidth() {
  // 宣告單一動畫影格的原始寬度
  let frameWidth;

  // 判斷目前是否為閃巴掌動畫
  if (isSlapping) {
    // 計算閃巴掌單格影格寬度
    frameWidth = SLAP_SHEET_WIDTH / SLAP_FRAMES;
  } else {
    // 計算走路單格影格寬度
    frameWidth = WALK_SHEET_WIDTH / WALK_FRAMES;
  }

  // 取得目前使用的精靈圖高度
  const spriteHeight = isSlapping
    ? SLAP_SHEET_HEIGHT
    : WALK_SHEET_HEIGHT;

  // 依照圖片比例計算顯示寬度
  return frameWidth * CHARACTER_DISPLAY_HEIGHT / spriteHeight;
}

// 繪製角色精靈
function drawCharacter() {
  // 根據目前動畫狀態選擇要使用的圖片
  const sprite = isSlapping ? slapSprite : walkSprite;

  // 如果圖片尚未載入完成
  if (!sprite || !sprite.width || !sprite.height) {
    // 設定文字水平置中
    textAlign(CENTER, CENTER);

    // 設定提示文字大小
    textSize(20);

    // 設定提示文字顏色
    fill("#333333");

    // 顯示圖片載入提示
    text("圖片載入中，請確認圖片路徑是否正確", width / 2, height / 2);

    // 結束繪製角色
    return;
  }

  // 宣告整張精靈圖的寬度
  let sheetWidth;

  // 宣告整張精靈圖的高度
  let sheetHeight;

  // 宣告動畫總格數
  let totalFrames;

  // 判斷目前是否為閃巴掌動畫
  if (isSlapping) {
    // 使用閃巴掌精靈圖寬度
    sheetWidth = SLAP_SHEET_WIDTH;

    // 使用閃巴掌精靈圖高度
    sheetHeight = SLAP_SHEET_HEIGHT;

    // 使用閃巴掌動畫格數
    totalFrames = SLAP_FRAMES;
  } else {
    // 使用走路精靈圖寬度
    sheetWidth = WALK_SHEET_WIDTH;

    // 使用走路精靈圖高度
    sheetHeight = WALK_SHEET_HEIGHT;

    // 使用走路動畫格數
    totalFrames = WALK_FRAMES;
  }

  // 計算單一動畫影格的原始寬度
  const frameWidth = sheetWidth / totalFrames;

  // 計算單一動畫影格的顯示寬度
  const displayWidth =
    frameWidth * CHARACTER_DISPLAY_HEIGHT / sheetHeight;

  // 計算目前動畫影格在精靈圖中的水平位置
  const sourceX = currentFrame * frameWidth;

  // 儲存目前畫布狀態
  push();

  // 將繪圖原點移動到角色位置
  translate(characterX, characterY);

  // 判斷是否按下左方向鍵
  if (keyIsDown(LEFT_ARROW)) {
    // 將角色水平翻轉
    scale(-1, 1);

    // 修正水平翻轉後的繪製位置
    translate(-displayWidth, 0);
  }

  // 從水平精靈圖中擷取目前動畫影格並繪製
  image(
    sprite,
    0,
    0,
    displayWidth,
    CHARACTER_DISPLAY_HEIGHT,
    sourceX,
    0,
    frameWidth,
    sheetHeight
  );

  // 還原畫布狀態
  pop();
}

// 偵測鍵盤按下事件
function keyPressed() {
  // 判斷是否按下左右方向鍵
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    // 防止瀏覽器因方向鍵而捲動頁面
    return false;
  }
}

// 當瀏覽器視窗尺寸改變時執行
function windowResized() {
  // 重新調整畫布大小
  resizeCanvas(windowWidth, windowHeight);

  // 重新限制角色所在位置
  limitCharacterPosition();
}