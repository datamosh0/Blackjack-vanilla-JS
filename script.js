const playerHand = document.querySelector('.playerHand');
const dealerHand = document.querySelector('.dealerHand');
const playerTotalEl = document.querySelector('.playerTot');
const dealerTotalEl = document.querySelector('.dealerTot');
const hitBtn = document.querySelector('.hit');
const standBtn = document.querySelector('.stand');
const playBtn = document.querySelector('.playAgain');
const aceBtn = document.querySelector('.ace');
const game = document.querySelector('.game');
const winMsg = document.querySelector('.winMsg');
const picLink = 'backCard.jpeg';
const url = 'http://deckofcardsapi.com/api/deck/new/draw/?count=21';

async function getJson(url) {
    let response = await fetch(url)
    let data = await response.json();
    return data
}

let jsonData = [];
async function gameInstance() {
    jsonData = await getJson(url)
    dealPlayer(jsonData.cards)
    dealDealer(jsonData.cards)
}

let playerTotal = 0;
let dealerTotal = 0;
function dealPlayer(data) {
    //players hand
    for (let i = 0; i < 2; i++) {
        playerHand.insertAdjacentHTML("beforeend", `    
            <img src="${data[i].images.png}" id="pHit${i}">`);
        let code = data[i].value;
        if(code==="ACE") aceBtn.classList.remove('hiddenButton');
        addValue(code, player=true);
        data.shift();
    }

    //the player hits
    for (let i = 0; i < 5; i++) {
        let code = data[i].value;
        let temp = 0;
        if(code === 'JACK'||code === 'QUEEN'||code === 'KING') temp = 10;
        else if(code === 'ACE') temp = 1;
        else temp = parseInt(code)
        playerHand.insertAdjacentHTML("beforeend", `
            <img value="${temp}" class="playerHits" id="pHit${i+2}" src="${data[i].images.png}">
        `);
        data.shift();
    }
}

const dealDealer = (data) => {
    //dealers hand
    dealerHand.insertAdjacentHTML("beforeend", `
        <img src="${data[0].images.png}" alt="">`)
    dealerHand.insertAdjacentHTML("beforeend", `
        <div class="dealerHidden">
            <img src="${data[1].images.png}" id="dHit${1}">
        </div>
        `)
    code = data[0].value;
    code1 = data[1].value;
    if(code==="ACE") code=11;
    if(code1==="ACE") code=11;
    addValue(code, player=false)
    addValue(code1, player=false)
    data.shift();
    data.shift();
    dealerHand.insertAdjacentHTML('beforeend', `
        <img src="${picLink}"class="card" id="back">`)

        //the dealer hits
    for (let i = 0; i < 5; i++) {
        let code = data[i].value;
        let temp = 0;
        if(code === 'JACK'||code === 'QUEEN'||code === 'KING') temp = 10;
        else if(code === 'ACE') temp = 1;
        else temp = parseInt(code)
        dealerHand.insertAdjacentHTML("beforeend", `
            <img value="${temp}" id="dHit${i+2}" class="dealerHits" src="${data[i].images.png}">
        `);
        data.shift();
    }
}

const addValue = (code, player) => {
    let valueToAdd = 0;
    if(code === 'JACK'||code === 'QUEEN'||code === 'KING') valueToAdd = 10;
    else if(code === 'ACE') valueToAdd = 1;
    else valueToAdd += parseInt(code);
    if(player) {
        playerTotal += valueToAdd;
        playerTotalEl.innerText = playerTotal
    } else {
        dealerTotal += valueToAdd;
    }
}

aceBtn.addEventListener('click', function(){
    addValue(10, player=true)
    aceBtn.classList.add('hiddenButton')
})

hitBtn.addEventListener('click', function() {
    let hit = document.querySelector('.playerHits')
    hit.classList.remove('playerHits')
    let code = hit.getAttribute('value')
    if(code==="ACE") aceBtn.classList.remove('hiddenButton');
    addValue(code, player=true)
    if(playerTotal>21) {
        standFunc(true)
        end('Player busts!')
    }
    if(playerTotal>11) aceBtn.classList.add('hiddenButton');
})

standBtn.addEventListener('click', function() {
    standFunc(playerBust = false)
    if(dealerTotal>playerTotal&&dealerTotal<=21){
        end('Dealer Wins!')
    }else {
        end('Player Wins!')
    }
})

const standFunc = (playerBust) => {
    let temp = document.getElementById('back')
    temp.parentNode.removeChild(temp);
    document.querySelector('.dealerHidden').classList.remove('dealerHidden')    
    if(!playerBust) {
        while(dealerTotal<17) {
        let temp2 = document.querySelector('.dealerHits')
        temp2.classList.remove('dealerHits')
        let code = temp2.getAttribute('value')
        addValue(code, player=false)
        }
    }
    dealerTotalEl.innerText = dealerTotal
}
gameInstance();

const end = (msg) => {
    hitBtn.classList.add('hiddenButton')
    standBtn.classList.add('hiddenButton')
    playBtn.classList.remove('hiddenButton')
    winMsg.innerText = msg
    playerTotal = 0;
    dealerTotal = 0;
}

playBtn.addEventListener('click', function() {
    hitBtn.classList.remove('hiddenButton')
    standBtn.classList.remove('hiddenButton')
    playBtn.classList.add('hiddenButton')
    playerHand.innerHTML = '';
    dealerHand.innerHTML = '';
    dealerTotalEl.innerText = '';
    winMsg.innerText = '';
    gameInstance();
})
