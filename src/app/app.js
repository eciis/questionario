import angular from 'angular';

import ngMaterial from 'angular-material';

import firebase from 'angularfire';

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
  constructor($firebaseArray) {
    var app = this;

    var ref = firebase.database().ref();
    var formRef = ref.child("questionario/");
    firebaseArray = $firebaseArray(formRef);

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

    app.submit = function submit() {
      console.log(app.answer);
    };
  }
}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, ['ngMaterial', 'firebase'])
  .directive('app', app)
  .controller('AppCtrl', AppCtrl);

export default MODULE_NAME;