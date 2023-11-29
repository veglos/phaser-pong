var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);
var playerPaddle;
var aiPaddle;
var ball;

function preload() {
  this.load.image("paddle", "./src/assets/images/paddle.png");
  this.load.image("ball", "./src/assets/images/ball.png");
}

function create() {
  // Paddles
  playerPaddle = this.physics.add
    .sprite(25, this.cameras.main.centerY, "paddle")
    .setImmovable(true);

  aiPaddle = this.physics.add
    .sprite(this.cameras.main.width - 25, this.cameras.main.centerY, "paddle")
    .setImmovable(true);

  // Ball
  ball = this.physics.add.sprite(
    this.cameras.main.centerX,
    this.cameras.main.centerY,
    "ball",
  );
  ball.setVelocity(-200, 200);
  ball.setBounce(1); // Make the ball bounce off of objects
  ball.setCollideWorldBounds(true); // Enable collision with world bounds

  // Enable physics collision for objects
  this.physics.add.collider(ball, playerPaddle, hitPaddle, null, this);
  this.physics.add.collider(ball, aiPaddle, hitPaddle, null, this);

  // Enable keyboard input
  this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
  this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
}

function hitPaddle(ball, paddle) {
  // Change ball's velocity based on where it hit the paddle
  var diff = 0;

  if (ball.y < paddle.y) {
    // Ball hit the top of the paddle
    diff = paddle.y - ball.y;
    ball.setVelocityY(-10 * diff);
  } else if (ball.y > paddle.y) {
    // Ball hit the bottom of the paddle
    diff = ball.y - paddle.y;
    ball.setVelocityY(10 * diff);
  } else {
    // Ball hit the middle of the paddle
    ball.setVelocityY(2 + Math.random() * 8);
  }
}

// Game logic updates (movement, collision, scores)
function update() {
  // Player Paddle Movement
  if (this.upKey.isDown && playerPaddle.y > playerPaddle.displayHeight / 2) {
    playerPaddle.y -= 5;
  } else if (
    this.downKey.isDown &&
    playerPaddle.y < this.cameras.main.height - playerPaddle.displayHeight / 2
  ) {
    playerPaddle.y += 5;
  }

  // AI Paddle Movement
  if (ball.y < aiPaddle.y && aiPaddle.y > aiPaddle.displayHeight / 2) {
    aiPaddle.y -= 3; // AI moves up
  } else if (
    ball.y > aiPaddle.y &&
    aiPaddle.y < this.cameras.main.height - aiPaddle.displayHeight / 2
  ) {
    aiPaddle.y += 3; // AI moves down
  }
}
