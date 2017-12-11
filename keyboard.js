// octave に指定されたオクターブ数分の鍵盤を持つキーボードを elem の中に作成し、
// 各キーを点灯／消灯させるために使用するインスタンスを返す
// キーの幅は width のサイズ内で収まるように調整され、必要な大きさが elem.style.width にセットされる
function Keyboard(elem, octave, width){
  // keys に音の高さが低い順に div を入れる
  var keys = [];

  // 白鍵の数を元にして鍵盤上での白鍵の幅を求める（小数点以下は切り捨て）
  var whiteWidth = width / (octave * 7) | 0;
  // 白鍵の１オクターブ分のサイズを12分割して黒鍵の幅を求める
  var blackWidth = whiteWidth * 7 / 12;

  //キーボード全体のサイズ
  elem.style.width = whiteWidth * 7 * octave + 'px';

  for(var wi = 0, i = 0; i < octave * 12; ++i) {
    var k = document.createElement('div');
    switch (i % 12) {
      case 0:  //C
      case 2:  //D
      case 4:  //E
      case 5:  //F
      case 7:  //G
      case 9:  //A
      case 11: //B
        k.className = 'white';
        k.style.width = whiteWidth + 'px';
        k.style.left = (whiteWidth * wi) + 'px';
        ++wi;
        break;
      case 1: //C#
      case 3: //D#
      case 6: //F#
      case 8: //G#
      case 10://A#
        k.className = 'black';
        k.style.width = (blackWidth | 0) + 'px';
        k.style.left = (i * blackWidth | 0) + 'px';
        break;
    }
    elem.appendChild(k);
    keys.push(k);
  }

  this.keys = keys;
}

// 点灯されている全てのキーを消灯する
Keyboard.prototype.clearActive = function() {
  var keys = this.keys;
  for (var i = 0; i < keys.length; ++i) {
    keys[i].classList.remove('active');
  }
}

// キーを点灯する
// activeKeys には一番低い音を 0 とした数値を配列で指定する
// 例: ドミソに点灯させたい場合 [0, 4, 7]
Keyboard.prototype.setActive = function(activeKeys) {
  this.clearActive();
  var keys = this.keys;
  for (var i = 0; i < activeKeys.length; ++i) {
    if (activeKeys[i] === null || !keys[activeKeys[i]]) continue;
    keys[activeKeys[i]].classList.add('active');
  }
}
