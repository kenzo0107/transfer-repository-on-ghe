## By CasperJS + PhantomJS, Transfer Organization on GitHub Enterprise.

You transfer a repository to a new owner by using headless browser with CasperJS and PhantomJS.  

## Environment

- CasperJS 1.1.4  
- PhantomJS 2.1.1  

## Get Started

- git clone

```
macOS%$ git clone https://github.com/kenzo0107/ghe-org-transfer
macOS%$ cd ghe-org-transfer
```

- Edit <your ****> on `scripts/ghe-org-transfer.js`

```
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
```

ex) hoge/mywonderfulrepo ---> moge/mywonderfulrepo

```
paths: [
  "hoge/mywonderfulrepo"
],
destOrganization: 'moge',
```

## Run CasperJS

```
$ macOS%$ make run
```

## for Sandbox

The script `test-form.js` is executed for nginx/html/index.html.  
It is suitable for testing the behavior of casperjs.
