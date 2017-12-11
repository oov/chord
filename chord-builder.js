// コード組み立て用フォームを準備し、それを操作するためのインスタンスを返す
// frm には form タグのエレメントを渡す必要があり、そのタグの中には以下のクラス名を持つ ul/ol タグが必要
// .cb-key
// .cb-basic1
// .cb-basic2
// .cb-basic3
// .cb-basic4
// .cb-tension1
// .cb-tension2
// .cb-tension3
// .cb-omit
// .cb-bass
// .cb-error-messages
function ChordBuilder(frm) {
  var elems = {}; // ラジオボタンを入れる先
  var items = this.items; // ラジオボタンに入れる項目

  // ラジオボタンを追加
  var keys = Object.keys(items);
  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    var item = items[key];
    var elem = frm.querySelector('.cb-' + key);
    if (!elem) {
      throw new Error('エレメント ".cb-' + key + '" が見つかりません');
    }
    elems[key] = elem;
    elem.innerHTML = "";
    for (var j = 0; j < item.length; ++j) {
      var li = document.createElement('li');
      var label = document.createElement('label');
      var input = document.createElement('input');
      input.type = "radio";
      input.name = key;
      input.value = j;
      input.checked = j == 0; // 最初の項目を予め選択
      label.appendChild(input);
      if (item[j] !== null) {
        label.appendChild(document.createTextNode(item[j]));
      }
      li.appendChild(label);
      elem.appendChild(li);
    }
  }

  var err = frm.querySelector('.cb-error-messages');
  if (!err) {
    throw new Error('エレメント ".cb-error-messages" が見つかりません');
  }

  this.err = err;
  this.elems = elems;
  this.form = frm;
}

// 画面に表示している全てのエラー情報を消す
ChordBuilder.prototype.clearErrors = function(errors) {
  var elems = this.elems;
  var keys = Object.keys(elems);
  for (var i = 0; i < keys.length; ++i) {
    elems[keys[i]].classList.remove('has-error');
  }
  var err = this.err;
  err.innerHTML = "";
}

// 画面にエラー情報を表示する
// errors には ChordError のインスタンスの配列を渡す
ChordBuilder.prototype.setErrors = function(errors) {
  this.clearErrors();
  var elems = this.elems;
  var err = this.err;
  for(var i = 0; i < errors.length; ++i) {
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(errors[i].msg));
    err.appendChild(li);
    var places = errors[i].places;
    for (var j = 0; j < places.length; ++j) {
      elems[places[j]].classList.add('has-error');
    }
  }
}

// ChordBuilder におけるエラー情報を表すインスタンス
// msg にはエラー内容、places にはエラー箇所を配列で渡す
// 例: new ChordError('「キー」と「ベース」で同じ音は選べません', ['key', 'bass'])
function ChordError(msg, places) {
  this.msg = msg;
  this.places = places;
}

// ラジオボタンに入れる項目
ChordBuilder.prototype.items = {
  key: ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'],
  basic1: [null, 'm', 'aug', 'dim', 'add9', 'add2', 'add4'],
  basic2: [null, 'M'],
  basic3: [null, '6', '7', '9', '11', '13'],
  basic4: [null, 'sus4', '-5'],
  tension1: [null, '9', 'b9', '#9'],
  tension2: [null, '11', '#11'],
  tension3: [null, '13', 'b13'],
  omit: [null, 'omit1', 'omit3', 'omit5', 'omit7', 'omit9', 'omit11'],
  bass: [null, 'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'],
};

// values の選択状態がコードとして正しいか調べ、
// 見つかったエラーを ChordError のインスタンスの配列で返す
// エラーがなかった場合は空の配列を返す
ChordBuilder.prototype.validate = function(values) {
  var errors = [];
  var v = values;
  // basic1～4 の禁止ルール ---------------------------------

  // msus4 はダメ
  if (v.basic1 == 1 && v.basic4 == 1) {
    errors.push(new ChordError('"m" と "sus4" は同時に選べません', ['basic1', 'basic4']));
  }
  // Msus4 はダメ
  if (v.basic2 == 1 && v.basic4 == 1) {
    errors.push(new ChordError('"M" と "sus4" は同時に選べません', ['basic2', 'basic4']));
  }

  // aug-5 はダメ
  if (v.basic1 == 2 && v.basic4 == 2) {
    errors.push(new ChordError('"aug" と "-5" は同時に選べません', ['basic1', 'basic4']));
  }

  // omit の禁止ルール -------------------------------

  // augomit5, dimomit5 はダメ
  if ((v.basic1 == 2 || v.basic1 == 3) && v.omit == 3) {
    errors.push(new ChordError('"aug" や "dim" と "omit5" は同時に選べません', ['basic1', 'omit']));
  }

  // -5omit5 はダメ
  if (v.basic4 == 2 && v.omit == 3) {
    errors.push(new ChordError('"-5" と "omit5" は同時に選べません', ['basic4', 'omit']));
  }

  // 9omit7, 11omit7, 13omit7 以外の omit7 はダメ
  if (v.basic3 != 3 && v.basic3 != 4 && v.basic3 != 5 && v.omit == 4) {
    errors.push(new ChordError('"omit7" を使うには "9", "11", "13" を選んでおく必要があります', ['basic3', 'omit']));
  }

  // 11omit9, 13omit9 以外の omit9 はダメ
  if (v.basic3 != 4 && v.basic3 != 5 && v.omit == 5) {
    errors.push(new ChordError('"omit9" を使うには "11", "13" を選んでおく必要があります', ['basic3', 'omit']));
  }

  // 13omit11 以外の omit11 はダメ
  if (v.basic3 != 5 && v.omit == 6) {
    errors.push(new ChordError('"omit11" を使うには "13" を選んでおく必要があります', ['basic3', 'omit']));
  }

  // bass の禁止ルール ---------------------------------

  if (v.key == v.bass - 1) {
    errors.push(new ChordError('「キー」と「ベース」で同じ音は選べません', ['key', 'bass']));
  }

  return errors;
}

// ChordBuilder のフォームで現在選択されている項目をまとめて返す
ChordBuilder.prototype.getValues = function() {
  var frm = this.form;
  return {
    key: parseInt(frm.key.value, 10),
    basic1: parseInt(frm.basic1.value, 10),
    basic2: parseInt(frm.basic2.value, 10),
    basic3: parseInt(frm.basic3.value, 10),
    basic4: parseInt(frm.basic4.value, 10),
    tension1: parseInt(frm.tension1.value, 10),
    tension2: parseInt(frm.tension2.value, 10),
    tension3: parseInt(frm.tension3.value, 10),
    omit: parseInt(frm.omit.value, 10),
    bass: parseInt(frm.bass.value, 10),
  };
}

// values に基いてコードを組み立てて返す
// ただしエラーがある values を渡した場合の動作は保証されない
ChordBuilder.prototype.build = function(values) {
  var items = this.items;
  var chord = [];
  chord.push(items.key[values.key]);
  chord.push(items.basic1[values.basic1]);
  chord.push(items.basic2[values.basic2]);
  chord.push(items.basic3[values.basic3]);
  chord.push(items.basic4[values.basic4]);

  var tension = [];
  tension.push(items.tension1[values.tension1]);
  tension.push(items.tension2[values.tension2]);
  tension.push(items.tension3[values.tension3]);
  tension = tension.filter(function(v){ return v !== null; });
  if (tension.length > 0) {
    chord.push('(' + tension.join(', ') + ')');
  }

  chord.push(items.omit[values.omit]);

  var bass = items.bass[values.bass];
  if (bass !== null) {
    chord.push(' on ' + bass);
  }

  return chord.filter(function(v){ return v !== null; }).join('');
}