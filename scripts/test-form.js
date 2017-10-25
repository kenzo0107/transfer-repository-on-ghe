var config = {
  viewportSize: {
    width: 750,
    height: 1334
  }
};

var casper = require('casper').create({
  // ログを標準出力に戻す
  // @see http://docs.casperjs.org/en/latest/modules/casper.html#casper-options
  verbose: true,
  // ログレベルを設定
  // debug info warning error
  logLevel: 'info',
  // 画面サイズを設定
  viewportSize: config.viewportSize,
  // ページ設定
  pageSettings: {
    loadImages: true,
    loadPlugins: true,
    webSecurityEnabled: false,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
  },
});

var utils = require("utils");


main();

function main() {
  casper.start();
  testForm(casper);
  casper.run();
}


function testForm(casper) {

  var url = 'http://nginxserver/index.html';

  casper.then(function() {
    casper.thenOpen(url, function () {
      casper.waitFor(function check() {
          return casper.evaluate(function () {
              return document.querySelector('form').length　> 0;
          });
      }, function then() {
        // this.fill('form', {}, true);
      }, function timeout() {
        this.capture('timeout_enquate_detail.png');
      });
    });
  });
}
