var AUDIO_FILE_COUNT = 18;
var GAME_WIDTH = 400;
var GAME_HEIGHT = 800;
var BALL_RADIUS = 32;
var PADDLE_WIDTH = 104;
var PADDLE_HEIGHT = 24;
var Breakout = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Breakout ()
    {
        Phaser.Scene.call(this, { key: 'breakout' });

        this.bricks;
        this.paddle;
        this.ball;
    },

    preload: function ()
    {
        for (var i = 0; i < AUDIO_FILE_COUNT; i++) {
            this.load.audio('audio' + i, 'audio/audio'+i+'.m4a');    
        }
        this.load.audio('cookies', 'audio/get_those_cookies.m4a');    

        this.load.image('ball', 'images/vanjie.png');
        this.load.image('paddle', 'images/paddle.png');
        for (var i = 0; i < 5; i++) {
            this.load.image('cookies' + i, 'images/cookies'+i+'.png');    
        }
    },

    create: function ()
    {
        //  Enable world bounds, but disable the floor
        this.physics.world.setBoundsCollision(true, true, true, false);
        var BRICK_WIDTH = 80;
        var BRICK_HEIGHT = 40;
        //  Create the bricks in a 10x6 grid
        this.bricks = this.physics.add.staticGroup({
            key: ['cookies4', 'cookies1', 'cookies3', 'cookies0', 'cookies2'],
            frameQuantity: 5,
            gridAlign: { width: 5, height: 5, cellWidth: BRICK_WIDTH, cellHeight: BRICK_HEIGHT, x: BRICK_WIDTH/2, y: 100 }
        });

        this.ball = this.physics.add.image(GAME_WIDTH/2, GAME_HEIGHT - 7 * PADDLE_HEIGHT, 'ball').setCollideWorldBounds(true).setBounce(1);
        this.ball.setData('onPaddle', true);

        this.paddle = this.physics.add.image(GAME_WIDTH/2, GAME_HEIGHT - 5 * PADDLE_HEIGHT, 'paddle').setImmovable();


        //  Our colliders
        this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);
        this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);

        //  Input events
        this.input.on('pointermove', function (pointer) {

            //  Keep the paddle within the game
            this.paddle.x = Phaser.Math.Clamp(pointer.x, PADDLE_WIDTH/2, GAME_WIDTH - PADDLE_WIDTH/2);

            if (this.ball.getData('onPaddle'))
            {
                this.ball.x = this.paddle.x;
            }

        }, this);

        this.input.on('pointerup', function (pointer) {

            if (this.ball.getData('onPaddle'))
            {
                this.ball.setVelocity(-75, -300);
                this.ball.setData('onPaddle', false);
            }

        }, this);
    },

    hitBrick: function (ball, brick)
    {
        brick.disableBody(true, true);
        gtag('event', "hitBrick", {
            'event_label': "brick " + (this.bricks.getLength()-this.bricks.countActive())
        });

        if (this.bricks.countActive() === 0)
        {
            this.sound.play('cookies');
            document.querySelector("#outro-overlay").style.display = "flex";
            gtag('event', "win game", {
                'event_label': "win game"
            });
        } else {
            var soundId = Math.floor(AUDIO_FILE_COUNT * Math.random());
            this.sound.play('audio'+soundId);
        }
    },

    resetBall: function ()
    {
        this.ball.setVelocity(0);
        this.ball.setPosition(this.paddle.x, GAME_HEIGHT - 7 * PADDLE_HEIGHT);
        this.ball.setData('onPaddle', true);
    },

    resetLevel: function ()
    {
        this.resetBall();

        this.bricks.children.each(function (brick) {

            brick.enableBody(false, 0, 0, true, true);

        });
    },

    hitPaddle: function (ball, paddle)
    {
        var diff = 0;

        if (ball.x < paddle.x)
        {
            //  Ball is on the left-hand side of the paddle
            diff = paddle.x - ball.x;
            ball.setVelocityX(-10 * diff);
        }
        else if (ball.x > paddle.x)
        {
            //  Ball is on the right-hand side of the paddle
            diff = ball.x -paddle.x;
            ball.setVelocityX(10 * diff);
        }
        else
        {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            ball.setVelocityX(2 + Math.random() * 8);
        }
    },

    update: function ()
    {
        if (this.ball.y > GAME_HEIGHT - 2 * PADDLE_HEIGHT)
        {
            this.resetBall();
        }
    }

});

var config = {
    type: Phaser.WEBGL,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'phaser-example',
    scene: [ Breakout ],
    physics: {
        default: 'arcade'
    },
    transparent: true
};

var game = new Phaser.Game(config);

var playCount = 0;
function hideOverlays() {
    document.querySelector("#intro-overlay").style.display = "none";
    if (getComputedStyle(document.querySelector("#outro-overlay"),null).display
 !== "none") {
        game.scene.scenes[0].resetLevel()
        document.querySelector("#outro-overlay").style.display = "none";
        playCount++;
        gtag('event', "play again", {
            'event_label': "play again " + playCount
        });
    }
}

function handleOutboundLink(fromOutro) {
    var label = fromOutro ? "from outro" : "from in game";
    gtag('event', "click", {
        'event_category': 'Outbound Link',
        'event_label': 'Youtube Channel Link '+label
    });
}
