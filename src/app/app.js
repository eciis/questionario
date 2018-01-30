import angular from 'angular';

import ngMaterial from 'angular-material';

import firebase from 'firebase';

import '../style/app.css';
import '../../node_modules/angular-material/angular-material.css';

let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

class AppCtrl {
  constructor() {
    var app = this;

    app.loading = false;
    app.submited = false;

    app.answer = {
      navegadores: [],
      so: []
    };

    app.browsers = [{
      name: 'Internet Explorer',
      icon: 'ie.svg'
    }, {
      name: 'Google Chrome',
      icon: 'chrome.svg'
    }, {
      name: 'Mozilla Firefox',
      icon: 'firefox.svg'
    }, {
      name: 'Microsoft Edge',
      icon: 'edge.svg'
    }, {
      name: 'Safari',
      icon: 'safari.svg'
    }, {
      name: 'Não sei informar',
      icon: ''
    }];

    app.operationalSystems = [{
      name: 'Windows',
      icon: 'windows.svg'
    }, {
      name: 'Mac OS',
      icon: 'macosx.svg'
    }, {
      name: 'Linux',
      icon: 'linux.svg'
    }, {
      name: 'Não sei informar',
      icon: ''
    }];
    app.selectedSystems = [];

    app.select = function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }
    };

    app.exists = function (item, list) {
      return list.indexOf(item) > -1;
    };

    function getUserInfo() {
      var nVer = navigator.appVersion;
      var nAgt = navigator.userAgent;
      var browserName = navigator.appName;
      var fullVersion = '' + parseFloat(navigator.appVersion);
      var majorVersion = parseInt(navigator.appVersion, 10);
      var nameOffset, verOffset, ix;

      // In Opera 15+, the true version is after "OPR/" 
      if ((verOffset = nAgt.indexOf("OPR/")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 4);
      }
      // In Edge, the true version is after "Edge/" 
      else if ((verOffset = nAgt.indexOf("Edge/")) != -1) {
        browserName = "Microsoft Edge";
        fullVersion = nAgt.substring(verOffset + 5);
      }
      // In older Opera, the true version is after "Opera" or after "Version"
      else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
          fullVersion = nAgt.substring(verOffset + 8);
      }
      // In MSIE, the true version is after "MSIE" in userAgent
      else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset + 5);
      }
      // In Chrome, the true version is after "Chrome" 
      else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset + 7);
      }
      // In Safari, the true version is after "Safari" or after "Version" 
      else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
          fullVersion = nAgt.substring(verOffset + 8);
      }
      // In Firefox, the true version is after "Firefox" 
      else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 8);
      }
      // In most other browsers, "name/version" is at the end of userAgent 
      else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
        (verOffset = nAgt.lastIndexOf('/'))) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
          browserName = navigator.appName;
        }
      }
      // trim the fullVersion string at semicolon/space if present
      if ((ix = fullVersion.indexOf(";")) != -1)
        fullVersion = fullVersion.substring(0, ix);
      if ((ix = fullVersion.indexOf(" ")) != -1)
        fullVersion = fullVersion.substring(0, ix);

      majorVersion = parseInt('' + fullVersion, 10);
      if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
      }

      // Operational System Informations
      var OSName = "Unknown OS";
      if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
      if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
      if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
      if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";

      // Screen size informations
      var screenW = 640,
        screenH = 480;
      if (parseInt(navigator.appVersion) > 3) {
        screenW = screen.width;
        screenH = screen.height;
      } else if (navigator.appName == "Netscape" &&
        parseInt(navigator.appVersion) == 3 &&
        navigator.javaEnabled()
      ) {
        var jToolkit = java.awt.Toolkit.getDefaultToolkit();
        var jScreenSize = jToolkit.getScreenSize();
        screenW = jScreenSize.width;
        screenH = jScreenSize.height;
      }

      return {
        osName: OSName,
        platform: navigator.platform,
        screenSize: {
          width: screenW,
          height: screenH
        },
        browserName: browserName,
        fullVersion: fullVersion,
        majorVersion: majorVersion,
        userAgent: navigator.userAgent
      };
    }

    app.submit = function submit(form) {
      app.loading = true;
      app.answer.userInfo = getUserInfo();
      app.answer.timestamp = new Date().toLocaleString();

      var newNode = firebase.database().ref('questionario/').push();

      
      function callback(controller) {
        controller.submited = true;
      }

      newNode.set(app.answer).then(callback(app));
    };
  }
}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, ['ngMaterial'])
  .directive('app', app)
  .controller('AppCtrl', AppCtrl)
  .run(function () {
    var config = {
      apiKey: "AIzaSyCmIPGTNwwX6SXOlxIoO2UgCVy-5Y0Q3-c",
      authDomain: "plataforma-cis.firebaseapp.com",
      databaseURL: "https://plataforma-cis.firebaseio.com",
      projectId: "plataforma-cis",
      storageBucket: "",
      messagingSenderId: "224208425156"
    };
    firebase.initializeApp(config);
  });

export default MODULE_NAME;