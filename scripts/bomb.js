class Bomb{

  constructor(w,h, yVel, xVel, y, x){
    this.screenWidth = w;
    this.screenHeight = h;
    if (yVel) this.yVel = yVel;
    else this.yVel = Math.random()*(w-100)+25;
    if (xVel)this.xVel = xVel;
    else this.xVel = 0;
    if (y)this.y = y;
    else this.y = 0;
    if (x)this.x = x;
    else this.x =  Math.random()*(w-50)+25;
    this.img = document.createElement('img');
    this.img.src="img/bomb.png";
    this.width = 50;
    this.untilturn = 20;
  }
  move(){
    this.y+=this.yVel;// changing x and y
    this.x+=this.xVel;
    if (this.x+this.width>=w-10||this.x<=10){//if the bomb is moving horizontally and bounces against a wall
      this.xVel*=-1;
      this.x+=2*this.xVel;
    }
    if(this.xVel!==0){//moving sideways
      this.untilTurn--;//decreasing time until the bomb turns around
      if(this.untilTurn<=0){
        this.xVel*=-1;//switching direction
        this.untilTurn = Math.random()*20+10;
      }
    }
    //after going past bottom of screen
    if(this.y>=h) this.reset();//appears on the top of the screen
  }
  moveDown(){
    this.y+=10;
    //after going past bottom of screen
    if(this.y>=h) this.reset();
  }
  reset(){
    this.x = Math.random()*(w-50)+25;
    this.y = 0;
  }
  draw(context){
    context.drawImage(this.img,this.x,this.y,this.width+2.3,this.width+2.3);
  }
}
