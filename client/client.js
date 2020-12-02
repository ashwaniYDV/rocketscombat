let socket = io();

let canvasWidth = 1000;
let canvasHeight = 600;

const c = new Candy();
c.createCanvas(canvasWidth, canvasHeight);
let canvas = c.canvas;

let form = document.getElementById('form');
let playerName = document.getElementById('player-name');
let navTitle = document.getElementById('navbarDropdown');

let rocketImage = c.loadImage('./images/Rockets.png');
let bulletImage = c.loadImage('./images/bullet.png');
let smokeImage = c.loadImage('./images/emitter1.png');

function preload() {
  init();
}

function init() {

  // game-alert box
  let div = document.getElementById('game-alerts');
  let scrolling = false;
  div.onmouseover = function () { scrolling = true; }
  div.onmouseout = function () { scrolling = false; }
  socket.on('game-alerts', function (data) {
    div.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
      if (!scrolling) {
        div.scrollBy(0, div.offsetHeight * 10);
      }
      div.innerHTML += '<a class="dropdown-item">' + data[i] + '</a>';
    }
    navTitle.innerHTML = `Notifications <span style="color: black; margin: 0; padding: 0;">${ data.length }</span>`;
  });

  // CLIENT SIDE GAME LOGIC

  // NEW PLAYER
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    socket.emit('new-player', { name: playerName.value });
    playerName.disabled = true;
  })

  let game = new Game(socket);
  game.sendUserInput();


  // draw loop
  socket.on('update', data => draw(data));
  socket.on('remove-player', data => delete game.players[data.id]);
  // get data for the first time
  socket.on('init-players', data => game.getServerData(data));


  function draw(data) {
    c.clear();

    // update client data every frame
    game.updateClientData(data);

    game.draw();

    // console.log(game.bullets);

    c.fill('black');
    c.textSize(15);
    c.textAlign('left')
    c.text('score : ' + game.players[socket.id].score, 15, 25);
  }

}
