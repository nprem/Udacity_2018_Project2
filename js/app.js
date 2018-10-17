/*
 * Create a list that holds all of your cards
 */

var deckCards = [   
                'fa-diamond', 'fa-diamond',
                'fa-paper-plane-o', 'fa-paper-plane-o',
                'fa-anchor', 'fa-anchor',
                'fa-bolt', 'fa-bolt', 
                'fa-cube', 'fa-cube',
                'fa-leaf', 'fa-leaf', 
                'fa-bicycle', 'fa-bicycle', 
                'fa-bomb', 'fa-bomb',
            ];

function generateCard(card) {
    //template string...
    return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function initGame() {
    var matchedCards = [];

    var deck = document.querySelector('.deck');
    var str = '';

    shuffle(deckCards).forEach(function(card) {
        //console.log(card);
        str += generateCard(card);
    });
    
    moves = 0;
    counter.innerText = moves;
    //console.log(str);
    deck.innerHTML = str;
}

var counter = document.querySelector('.moves');
var moves = 0;
var matchedCards = [];
const stars = document.querySelectorAll(".fa-star");

//modal
var modal = document.getElementById('modalDisplay');
var span = document.getElementsByClassName("close")[0];
span.addEventListener('click', modalClose)

initGame();

var restart = document.querySelector('.restart').querySelector('i');
restart.addEventListener('click', resetGrid);

var cards = document.querySelectorAll('.card');
cards.forEach(card => card.addEventListener('click', selectCard));

var lstComparedCards = [];
let isCardFlipped = false;
var lockDeck = false;

function selectCard() {
    startTimer();

    if(lockDeck) return;

    if(lstComparedCards.length == 2)
    {
        lstComparedCards = [];
    }

    if(!isCardFlipped)
    {
        moves += 1;
        //console.log(moves);
        counter.innerText = moves;

        lstComparedCards.push(this);
        isCardFlipped = true;
        this.classList.toggle('open');
        this.classList.toggle('show');
        //console.log(lstComparedCards[0]);
        return;
    }

    //logic to prevent matching by clicking the same card twice
    if(lstComparedCards[0] == this)
    {
        return;
    }

    moves += 1;
    counter.innerText = moves;

    lstComparedCards.push(this);
    isCardFlipped = false;
    this.classList.toggle('open');
    this.classList.toggle('show');
    //console.log(lstComparedCards[1]);

    checkForMatchedCards();

    //set star rating based on number of moves....
    if(moves > 10 && moves < 15) {
        stars[2].style.visibility = "collapse";
    }
    else if(moves >=15) {
        stars[1].style.visibility = "collapse";
    }

    if(matchedCards.length == 16) {
        displayMessage();
        stopTimer();
        matchedCards = [];
    }
}

function checkForMatchedCards() {
    //console.log(lstComparedCards[0].dataset.card);

    if(lstComparedCards[0].dataset.card == lstComparedCards[1].dataset.card)
    {
        lstComparedCards[0].classList.add('match');
        lstComparedCards[1].classList.add('match');
        lockMatchedCards();

        matchedCards.push(lstComparedCards[0]);
        matchedCards.push(lstComparedCards[1]);

        return;
    }

    closeCards();
}

function lockMatchedCards() {
    lstComparedCards[0].removeEventListener('click', selectCard);
    lstComparedCards[1].removeEventListener('click', selectCard);
}

function closeCards() {
    lockDeck = true;

    setTimeout(() => {
        lstComparedCards[0].classList.remove('open');
        lstComparedCards[0].classList.remove('show');
        lstComparedCards[1].classList.remove('open');
        lstComparedCards[1].classList.remove('show');

        lockDeck = false;
    }, 1000);
}

function resetGrid() {
    cards.forEach(function(card) {
        card.classList.remove('open', 'show', 'match');
        card.addEventListener('click', selectCard);
    });

    moves = 0;
    counter.innerText = moves;

    var matchedCards = [];

    resetTimer();

    stars[1].style.visibility = "visible";
    stars[2].style.visibility = "visible";
}

function displayMessage() {
    //alert("Game over!!!" + " You took " + moves + " moves to complete the game!" );
    var msgElement = document.getElementsByClassName("message")[0];
    msgElement.innerHTML = "Congratulations!!!" + "<br>You made " + moves + " moves." 
                                + "<br>Time taken: " + formattedTime + " (hh:mm:ss)" 
                                +"<br>Star Rating: " + getStarRating();

    modal.style.display = "block";
}

//Timer
var timer = document.getElementById("timer");
var elapedTime = 0;
var interval; //timer id used to clear interval
var formattedTime;
var isTimerOn = false;

function updateTime() {
    elapedTime += 1; //function runs every sec, approximate
    formattedTime = formatTime(elapedTime);
    //console.log(formattedTime);
    timer.innerText = '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' 
                                    + formattedTime;
}

function formatTime(timeInSeconds) {
    var hours = Math.floor(timeInSeconds/3600);
    var minutes = Math.floor((timeInSeconds - hours * 3600) / 60);
    var seconds = timeInSeconds - (hours * 3600) - (minutes * 60);

    if(hours < 10) {hours = "0" + hours;}
    if(minutes < 10) {minutes = "0" + minutes;}
    if(seconds < 10) {seconds = "0" + seconds;}

    return hours + ":" + minutes + ":" + seconds;
}

function startTimer() {
    if(!isTimerOn)
    {
        elapedTime = 0;
        interval = setInterval(updateTime, 1000);
        isTimerOn = true;
    }
}

function stopTimer() {
    if(isTimerOn) {
        clearInterval(interval);
        interval = null;
        isTimerOn = false;
    }
}

function resetTimer() {
    stopTimer();
    elapedTime = 0;
    var formattedTime = formatTime(elapedTime);
    timer.innerText = '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' 
                                    + formattedTime;
}

//modal
function modalClose() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if(event.target == modal) {
        modal.style.display = "none";
    }
}

function playAgain() {
    modal.style.display = "none";
    resetGrid();
}

function getStarRating() {
    var str = '<span class="fa fa-star"></span>';
    if(stars[1].style.visibility == 'visible')
    {
        str += '<span class="fa fa-star"></span>';
    }
    if(stars[2].style.visibility == 'visible')
    {
        str += '<span class="fa fa-star"></span>';
    }

    return str;
}



