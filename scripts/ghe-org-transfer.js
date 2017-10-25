var config = {
  // site root.
  siteRoot: 'https://<your github domain>',
  // Github Login path
  loginPath: '/login',
  // Github Login Account
  loginParams: {
    email: '<your email>',
    password:  '<your password>'
  },
  viewportSize: {
    width: 3000,
    height: 2500
  },
  paths: [
    "<your owner>/<your repository>"
  ],
  destOrganization: '<your destination of organization>',
  reason: 'transfer this repository to new oragnization',
};

var casper = require('casper').create({
  verbose: true,
  // debug info warning error
  logLevel: 'error',
  viewportSize: config.viewportSize,
  pageSettings: {
    loadImages: false,
    loadPlugins: false,
    webSecurityEnabled: true,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
  },
  waitTimeout: 10000,
});


main();

function main() {
  casper.start();

  login(casper);
  transfer(casper);
  testRedirectAfterTransfer(casper);

  casper.run();
}


/**
 * config で指定された対象サイトにログインする
 *
 * config 内のログイン関連のパラメータを使用してログインする。
 * ただし config.isLoginRequired が false の場合はログインしない。
 *
 * @param casper CasperJS のインスタンス。
 */
function login(casper) {
  // access & login.
  var loginUrl = config.siteRoot + config.loginPath;
  casper.start(loginUrl, function() {
    this.fillSelectors('form[action="/session"]', {
      'input#login_field': config.loginParams.email,
      'input#password':    config.loginParams.password
    }, true);
  });
}

/**
 * Transfer 実行
 *
 * @param casper CasperJS のインスタンス。
 */
function transfer(casper) {

  casper.each(config.paths, function(casper, path) {
    var url = config.siteRoot + '/' + path + '/settings';

    // click Transfer button.
    casper.thenOpen(url, function () {
      // wait for reason popup.
      casper.wait(3000, function() {
        this.echo('[url] '+url);
        if (this.exists('form.stafftools-form')) {
          this.fillSelectors('form.stafftools-form', {
            '#reason': config.reason
          }, true);
        }
      });
    });

    // click button "Transfer".
    casper.then(function() {
      this.waitFor(function check() {
        return this.evaluate(function () {
          return document.querySelector('#options_bucket > div.boxed-group.dangerzone > div > button:nth-child(6)').length　> 0;
        });
      }, function then() {
        this.click('#options_bucket > div.boxed-group.dangerzone > div > button:nth-child(6)');
      }, function timeout() {
        this.capture('timeout_transfer_form.png');
      });
    });

    // execute transfer on "Transfer repository" popup.
    casper.then(function() {
      this.echo("[step] fill '#transfer_confirm > form'");
      // this.capture('transfer_form.png');
      this.waitFor(function check() {
        return this.evaluate(function () {
          return document.querySelector('#transfer_confirm > form').length　> 0;
        });
      }, function then() {
        this.fillSelectors('#transfer_confirm > form', {
          '#confirm_repository_name': path,
          '#confirm_new_owner': config.destOrganization,
        }, true);
      }, function timeout() {
        this.capture('timeout_transfer_form.png');
      });
    });

    // check the checkbox of "Team Developer".
    casper.then(function() {
      this.echo('[step] input checkbox #team-59');
      this.waitFor(function check() {
        return this.evaluate(function () {
          return document.querySelector('#team-59').length　> 0;
        });
      }, function then() {
        this.click('input#team-59');
      }, function timeout() {
        this.capture("timeout_team-59.png");
      });
    });

    // click the button labeled "Transfer".
    casper.then(function() {
      this.echo('[step] click the button labeled "Transfer"');
      this.click('#js-repo-pjax-container > div.container.new-discussion-timeline.experiment-repo-nav > div.repository-content > div > form > div.form-actions > button');
    });

    // wait 1 sec for next access url.
    // casper.then(function() {
    //   casper.wait(1000, function() {
    //     casper.capture("finished.png");
    //   });
    // });
  });
}

/**
 * Transfer 実行後テスト
 *
 * @param casper CasperJS のインスタンス。
 */
function testRedirectAfterTransfer(casper) {
  casper.then(function() {
    casper.each(config.paths,function(self,path){
      var url = config.siteRoot + '/' + path;
      casper.thenOpen(url, function () {
        casper.waitFor(function check() {
            return this.evaluate(function () {
                return document.querySelectorAll('.logged-in').length　> 0;
            });
        }, function then() {
          var redirectUrl = config.siteRoot + '/' + config.destOrganization + '/' + path.split('/')[1];
          if (redirectUrl == this.getCurrentUrl()) {
            casper.echo("(^-^) redirect ok:" + url + " to " + redirectUrl);
          } else {
            casper.echo("(>_<) redirect ng:" + url + " to " + redirectUrl);
          }
        });
      });
    });
  });
}
