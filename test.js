// Chrome を開いて Ctrl + Shift + J testBuilder(); と打てば
// ラジオボタンの組み合わせでエラーにならない奴を全部列挙する
function testBuilder(){
  var r = [];
  var items = chordBuilder.items;
  var values = {
    key: 0,
    basic1: 0,
    basic2: 0,
    basic3: 0,
    basic4: 0,
    tension1: 0,
    tension2: 0,
    tension3: 0,
    omit: 0,
    bass: 0,
  };
  var errors;
  for (values.omit = 0; values.omit < items.omit.length; ++values.omit) {
    for (values.tension3 = 0; values.tension3 < items.tension3.length; ++values.tension3) {
      for (values.tension2 = 0; values.tension2 < items.tension2.length; ++values.tension2) {
        for (values.tension1 = 0; values.tension1 < items.tension1.length; ++values.tension1) {
          for (values.basic4 = 0; values.basic4 < items.basic4.length; ++values.basic4) {
            for (values.basic3 = 0; values.basic3 < items.basic3.length; ++values.basic3) {
              for (values.basic2 = 0; values.basic2 < items.basic2.length; ++values.basic2) {
                for (values.basic1 = 0; values.basic1 < items.basic1.length; ++values.basic1) {
                  if (chordBuilder.validate(values).length == 0) {
                    r.push(chordBuilder.build(values));
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  console.log('全 '+r.length+' パターン');
  console.log(JSON.stringify(r).replace(/",/g, '",\n'));
}

// Chrome を開いて Ctrl + Shift + J でコンソールを出して testDetector(); と打てば
// 列挙されている項目についてテストが可能
function testDetector() {
  var testData = [
    {input: 'C',          want: [0,     0,     0,     0, null, null, null, null]},
    {input: 'Cmaj',       want: [0,     0,     0,     0, null, null, null, null]},// test maj
    {input: 'Cm',         want: [0,     0,    -1,     0, null, null, null, null]},
    {input: 'Caug',       want: [0,     0,     0,     1, null, null, null, null]},
    {input: 'Caug7',      want: [0,     0,     0,     1,    0, null, null, null]},
    {input: 'Caug9',      want: [0,     0,     0,     1,    0,    0, null, null]},
    {input: 'Cdim',       want: [0,     0,    -1,    -1, null, null, null, null]},
    {input: 'Cadd2',      want: [0,     0,     0,     0, null,  -12, null, null]},
    {input: 'Cadd9',      want: [0,     0,     0,     0, null,  -12, null, null]},
    {input: 'Cadd4',      want: [0,     0,     0,     0, null, null,  -12, null]},
    {input: 'C6',         want: [0,     0,     0,     0,   -1, null, null, null]},
    {input: 'C7',         want: [0,     0,     0,     0,    0, null, null, null]},
    {input: 'C9',         want: [0,     0,     0,     0,    0,    0, null, null]},
    {input: 'C11',        want: [0,     0,     0,     0,    0,    0,    0, null]},
    {input: 'C13',        want: [0,     0,     0,     0,    0,    0,    0,    0]},
    {input: 'CM7',        want: [0,     0,     0,     0,    1,    0, null, null]},
    {input: 'CM9',        want: [0,     0,     0,     0,    1,    0, null, null]},
    {input: 'CM11',       want: [0,     0,     0,     0,    1,    0,    0, null]},
    {input: 'CM13',       want: [0,     0,     0,     0,    1,    0,    0,    0]},
    {input: 'Cmaj7',      want: [0,     0,     0,     0,    1,    0, null, null]},// test maj
    {input: 'Cm6',        want: [0,     0,    -1,     0,   -1, null, null, null]},
    {input: 'Cm7',        want: [0,     0,    -1,     0,    0, null, null, null]},
    {input: 'Cm9',        want: [0,     0,    -1,     0,    0,    0, null, null]},
    {input: 'CmM7',       want: [0,     0,    -1,     0,    1, null, null, null]},
    {input: 'CmM9',       want: [0,     0,    -1,     0,    1,    0, null, null]},
    {input: 'C69',        want: [0,     0,     0,     0,   -1,    0, null, null]},
    {input: 'Cm69',       want: [0,     0,    -1,     0,   -1,    0, null, null]},
    {input: 'Csus4',      want: [0,     0,     1,     0, null, null, null, null]},
    {input: 'Cmadd9',     want: [0,     0,    -1,     0, null,  -12, null, null]},
    {input: 'C7sus4',     want: [0,     0,     1,     0,    0, null, null, null]},
    {input: 'CM7sus4',    want: [0,     0,     1,     0,    1, null, null, null]},
    {input: 'C9sus4',     want: [0,     0,     1,     0,    0,    0, null, null]},
    {input: 'C-5',        want: [0,     0,     0,    -1, null, null, null, null]},
    {input: 'C7-5',       want: [0,     0,     0,    -5,    0, null, null, null]},
    {input: 'C7(b9)',     want: [0,     0,     0,     0,    0,   -1, null, null]},
    {input: 'C7(9)',      want: [0,     0,     0,     0,    0,    0, null, null]},
    {input: 'C7(#9)',     want: [0,     0,     0,     0,    0,   +1, null, null]},
    {input: 'C7(11)',     want: [0,     0,     0,     0,    0, null,    0, null]},
    {input: 'C7(#11)',    want: [0,     0,     0,     0,    0, null,   +1, null]},
    {input: 'C7(b13)',    want: [0,     0,     0,     0,    0, null, null,   -1]},
    {input: 'C7(13)',     want: [0,     0,     0,     0,    0, null, null,    0]},
    {input: 'C7(9,11)',   want: [0,     0,     0,     0,    0,    0,    0, null]},
    {input: 'C7(9,13)',   want: [0,     0,     0,     0,    0,    0, null,    0]},
    {input: 'C7(9,11,13)',want: [0,     0,     0,     0,    0,    0,    0,    0]},
    {input: 'C13omit1',   want: [0,     0,     0,     0,    0,    0,    0,    0]},
    {input: 'C13omit3',   want: [0,     0,     0,     0,    0,    0,    0,    0]},
    {input: 'C13omit5',   want: [0,     0,     0,     0,    0,    0,    0,    0]},
    {input: 'C13omit7',   want: [0,     0,     0,     0,    0,    0,    0,    0]},
    {input: 'C13omit9',   want: [0,     0,     0,     0,    0,    0,    0,    0]},
    {input: 'C13omit11',  want: [0,     0,     0,     0,    0,    0,    0,    0]},

    //http://www.rittor-music.co.jp/app/shibanzukun/mychordbook.html
    //これのコード入力の階層っぽいやつのがいいのかね。

    // シャープのテスト
    {input: 'C#',         want: [0, 0, 0, 0, null, null, null, null]},
    {input: 'C#m',        want: [0, 0,-1, 0, null, null, null, null]},
  ];


  for (var i = 0; i < testData.length; ++i) {
    // テストして、想定と違う結果を出したときはメッセージで報告
    var want = testData[i].want.join(',');
    var got = detectChordName(testData[i].input).diff.join(',');
    if (got !== want) {
      console.log(testData[i].input + ' の出力が変だった！！　欲しかった答え: ' + want + '　得られた答え: ' + got);
    } else {
      console.log(testData[i].input + ' OK');
    }
  }
}
