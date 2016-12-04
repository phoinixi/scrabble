import {EMPTY_LETTER} from '../constants';

function BoardController($state, $interval, WordsService, BoardService, ScoreService) {

    const $ctrl = this;
    $ctrl.words = {};
    $ctrl.user = {};
    let countdownStarted = false;

    $ctrl.$onInit = () => {
        setUserData($state.params.username, $state.params.score);
        getNextWord();
    };

    function resetBoard() {
        const {scrambled, result} = WordsService.getOriginalWords();
        setWords({scrambled, result});
        WordsService.flushWordsMapping();
    }

    function startCountdown() {
        countdownStarted = true;
        const stopInterval = $interval(() => {
            $ctrl.secondsLeft -= 1;
            if ($ctrl.secondsLeft === 0) {
                stopGame();
                $interval.cancel(stopInterval);
            }
        }, 1000);
    }

    function stopGame() {
        console.log(ScoreService.getScore());
    }

    function getNextWord() {
        WordsService.getWord()
            .then(response => {
                setWords({
                    scrambled: response.scrabble,
                    result: WordsService.getOriginalWords().result
                });
                ScoreService.initScore(response.scrabble.length);
                if (!countdownStarted) startCountdown();
            })
            .catch(error => console.error(error));
    }

    function addToResult(scrambledIndex, letter) {
        const words = BoardService.addToResult(scrambledIndex, letter, $ctrl.words.scrambled, $ctrl.words.result);
        if (!words) return;
        setWords(words);
        if (BoardService.isResultBoardFull(words.result) && BoardService.checkSolution(words.result)) {
            console.log(ScoreService.getScore());
            getNextWord();
        }
    }

    function deleteFromResult(resultIndex, letter) {
        const words = BoardService.deleteFromResult(resultIndex, letter, $ctrl.words.scrambled, $ctrl.words.result);
        ScoreService.decrementScore();
        if (words) setWords(words);
    }

    function setWords(words) {
        Object.assign($ctrl.words, words); 
    }

    function setUserData(username, score) {
        $ctrl.username = username;
        $ctrl.score = score;
    }

    Object.assign($ctrl, {
        secondsLeft: 40,
        addToResult,
        deleteFromResult,
        resetBoard,
    });
}

BoardController.$inject = ['$state', '$interval', 'WordsService', 'BoardService', 'ScoreService'];
export default BoardController;