import firebase from 'firebase';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import user from './src/js/user';
import board from './src/js/board';

// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyAh2zsPL3FJsB2Y4ETGEh8ML6ntnf-I3hE",
    authDomain: "scrambler-b48ab.firebaseapp.com",
    databaseURL: "https://scrambler-b48ab.firebaseio.com",
    storageBucket: "scrambler-b48ab.appspot.com",
    messagingSenderId: "194228686950"
});

const app = {
    name: 'scrabble',
    version: '0.0.1'
}

angular.module(app.name, [
        'ui.router',
        user.name,
        board.name
    ]).config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider.state('scrabble', {
            url: '/',
            template: '<user></user>'
        }).state('game', {
            url: '/board',
            template: '<board></board>',
            params: {
                username: '',
                score: 0
            }
        });;

        $urlRouterProvider.otherwise('/');
    })
    .run(function ($rootScope, $state, UserService) {
        $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {

            if (!UserService.username && to.name !== 'scrabble') {
                ev.preventDefault();
                $state.go('scrabble');
            }
        });
    });

angular.bootstrap(document, [app.name]);
