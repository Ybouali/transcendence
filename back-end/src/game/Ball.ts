import { threadId } from "worker_threads";
import { Game } from "./Game";
import { globalVar } from "./object";
import { Server } from "socket.io";


export class Ball {
    game: Game;
    positionX = 0;
    positionY = 0;
    radius = 25;
    segment = 100;
    velocityX = 10;
    velocityY = 10;
    speed = 0.5;

    constructor(game: Game) {
        this.game = game;
    }
    checkCollision(io : Server){
        if ((this.positionY - this.radius) * -1 > (globalVar.Height / 2) - 5)
            this.velocityY *= -1;
        else if ((this.positionY + this.radius)  > (globalVar.Height / 2) - 5)
            this.velocityY *= -1;
        else if (this.positionX < this.game.rPlayer.positionX - 25){
            console.log("score is :", this.game.lPlayer.score);
            this.game.lPlayer.score += 1;
            io.to(this.game.roomName).emit("Lplayer_score");
            this.resetBall();
        }
        else if (this.positionX > this.game.lPlayer.positionX  + globalVar.PuddleWight / 2){
            this.game.rPlayer.score += 1;
            io.to(this.game.roomName).emit("Rplayer_score");
            console.log("score is :", this.game.rPlayer.score);
            this.resetBall();
        }
    }

    resetBall(){
        this.game.Ball.positionX = 0;
        this.game.Ball.positionY = 0;
        this.velocityX = 10;
        this.velocityY = 10;
    }

    rightPlayer(){
        if(this.positionX > 0) {
            if ((this.positionX + (this.radius))  >= (this.game.lPlayer.positionX - globalVar.PuddleWight / 2) &&
                ((this.positionY <= (this.game.lPlayer.positionY + globalVar.PuddleHeight / 2))
                && (this.positionY >= this.game.lPlayer.positionY - (globalVar.PuddleHeight / 2)))){
                    this.velocityX += this.speed;
                    this.velocityY += this.speed;
                    if (this.velocityX > 0)
                        this.velocityX *= -1 ;
            }
            else if ((this.positionX + this.radius > (this.game.lPlayer.positionX - globalVar.PuddleWight / 2)  &&  
            (this.positionY - this.radius) <= this.game.lPlayer.positionY + globalVar.PuddleHeight / 2) &&
            (this.positionY >= this.game.lPlayer.positionY)){
                if (this.velocityY < 0) 
                    this.velocityY *= -1;
                if (this.velocityX > 0)
                    this.velocityX *= -1;
            }
            else if (((this.positionX + this.radius > (this.game.lPlayer.positionX - globalVar.PuddleWight / 2) &&  
            (this.positionY + this.radius) >= this.game.lPlayer.positionY - globalVar.PuddleHeight / 2)) &&
            (this.positionY <= this.game.lPlayer.positionY)){
                if (this.velocityY > 0)
                    this.velocityY *= -1;
                if (this.velocityX > 0)
                    this.velocityX *= -1;
            }
        }
    }
    
    leftPlayer(){
        if(this.positionX < 0) {
            if (((this.positionX - (this.radius))  <= (this.game.rPlayer.positionX + globalVar.PuddleWight / 2) &&
            (this.positionY <= (this.game.rPlayer.positionY + globalVar.PuddleHeight / 2))) &&
            (this.positionY >= this.game.rPlayer.positionY - (globalVar.PuddleHeight / 2))){
                this.velocityX += this.speed;
                this.velocityY += this.speed; 
                if (this.velocityX < 0)
                    this.velocityX *= -1 ;
            }
            else if ((this.positionX - this.radius < (this.game.rPlayer.positionX + globalVar.PuddleWight / 2)) &&  
            (this.positionY - this.radius) <= this.game.rPlayer.positionY + globalVar.PuddleHeight / 2 &&
            (this.positionY >= this.game.rPlayer.positionY)){
                if (this.velocityY < 0)
                    this.velocityY *= -1;
                if (this.velocityX < 0)
                    this.velocityX *= -1;
            }
            else if ((this.positionX - this.radius < (this.game.rPlayer.positionX + globalVar.PuddleWight / 2) &&  
            (this.positionY + this.radius) >= this.game.rPlayer.positionY - globalVar.PuddleHeight / 2) &&
            (this.positionY <= this.game.rPlayer.positionY)){
                if (this.velocityY > 0)
                    this.velocityY *= -1;
                if (this.velocityX < 0)
                    this.velocityX *= -1;
            }
        }
    }

    updatePosition(io: Server) {
        this.positionX += this.velocityX;
        this.positionY += this.velocityY;
        this.checkCollision(io);
        this.leftPlayer();
        this.rightPlayer();
}
    start(io : Server){
            let interval = setInterval(() => {
                this.updatePosition(io)
                this.game.lPlayer.pushToOther();
                this.game.rPlayer.pushToOther();
                io.to(this.game.roomName).emit("startGame", this.positionX, this.positionY);
                if(this.game.lPlayer.score == 5 || this.game.rPlayer.score == 5)
                {
                    clearInterval(interval);
                    console.log("game is finished ");
                    delete(this.game)
                }
            }, 1000 / 30)
        }
};