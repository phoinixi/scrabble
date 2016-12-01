import angular from 'angular';
import boardComponent from './board.component';
import BoardService from './board.service';
import WordsService from './words.service';

const name = 'board';

angular.module(name, [])
    .component('boardComponent', boardComponent)
    .service('BoardService', BoardService)
    .service('WordsService', WordsService);

export default {
    name
};
