class Player{
  constructor(w,h,x,y,xVel){
    if (x) this.x = x;
    else this.x = 0;
    if (y)this.y = y;
    else this.y = h-80;
    if (xVel) this.xVel = xVel;
    else this.xVel = 6;
    this.maxVel = this.xVel*1.1;
    this.screenHeight = h;
    this.screenWidth = w;
    this.xMult = w/1100;
    this.xMult = ((this.xMult<1.225)?1.225:((this.xMult>1.35)?1.35:this.xMult));
    this.t = 0;//used to determine yVelocity when the character is jumping
    this.rotate = 0;//used for the rotation of the gyroscope character
    this.xPlus = 0;//used to increase the speed of the character
    this.xStop = 0;//used to slow down the character before stopping
    this.jumping = false;
    this.floor = h-80;
    this.over = false;
    this.explodeCount = 1;
    this.deathByBomb = false;
    this.setColors();
  }
  move(right, left, up, down){
    if (right){
      this.xVel=Math.abs(this.xVel);//x value increasing
      if(this.x+10<=w-80) this.x+=(this.xVel*this.xMult+this.xPlus);
      else this.x=1; //appearing of the opposite side of the screen
    }
    if (left){
      this.xVel=-Math.abs(this.xVel);//x value decreasing
      if(this.x>=0) this.x+=(this.xVel*this.xMult-this.xPlus);
      else this.x=w-81; //appearing on the opposite side of the screen
    }
    if (this.xStop !==0) {//slowing down the character before stopping
       this.x+=this.xStop;//slowly increasing x
       this.xStop/=1.3;
       if (Math.abs (this.xStop) <=0.4) this.xMo =0;//completely stop character
    }
    if(up&&!this.jumping&&this.y>=this.floor-1){ //jumping (if not already jumping)
      this.jumping=true;
      this.t= -6;
    }
    if(down){//move down manually
      this.t+=0.4;
    }

   if (this.jumping){//jumping
     this.y+=Math.abs(this.xVel)*0.5*this.t;
     this.t+=0.3;
    }

    if (this.y>=this.floor-1){//prevent character from going through level floor
      this.y=this.floor-1;
      this.jumping = false; //stops jumping
    }
    else if (this.y<this.floor-1){//falling through a hole in a level
      if(!this.jumping){
        this.jumping=true;
        this.t=5;//makes the y value of the character increase
      }
    }
    this.rotateCharacter();
  }
  rotateCharacter(){
    if(this.xVel>0)this.rotate+=(this.xVel+this.xPlus)/65; //rotates positions of circles in character
    else this.rotate+=(this.xVel-this.xPlus)/65;

  }

  draw(context, deathByBomb){
     context.fillStyle="black";
     context.lineWidth="3";
     for(var i = this.rotate; i<Math.PI*2-0.0001+this.rotate; i+=Math.PI/11 ){//creating a circle of circles

       context.strokeStyle = this.col[Math.round((i-this.rotate)/Math.PI*6)];//determining outline color

       //bomb explosion animation
       if(deathByBomb && this.explodeCount<20){
         this.explodeCount++;//gradual explosion
       }

       for(var j = 35; j>0;j-=10){//there are three layers of circles
          context.beginPath();
          //position based on angle i (x = cos(i) and y= sin(i))
         context.arc((this.x+40)-Math.cos(i-j/10)*j*this.explodeCount, (this.y+40)-Math.sin(i-j)*j*this.explodeCount, 5, 0, Math.PI*2, true);
         if(this.explodeCount>1){//bomb explosion
           for (i=1+this.rotate;i<this.explodeCount+this.rotate;i++){//magic
             context.arc((this.x+40)-Math.cos(i-j/10)*j*this.explodeCount, (this.y+40)-Math.sin(i-j)*j*this.explodeCount, 5, 0, Math.PI*2, true);
           }
         }
         //finishing drawing a circle
         context.closePath();
         context.stroke();
         context.fill();

       }
       if (this.explodeCount>=20){//after a bomb explosion
         this.over = true;
       }
     }
     context.fillStyle="";
  }

  moveDown(){
    this.y+=10;
    this.floor+=10;
  }
  newLevel(levelSets, newFloor){
    this.y+=90;//returning character to proper position (had been previously moved up 90px)
    this.xPlus+=(0.18/(2*Math.sqrt(levelSets)))*(h/1000);//increasing the character's velocity
    this.floor= newFloor;//changing "floor" variable
  }
  setColors(i){
    if (i == 1) this.col = ['white','darkslategrey','lightgrey','darkgrey','dimgrey','black','white','darkslategrey','lightgrey','darkgrey','dimgrey','black'];
    else if (i==2) this.col = ['red','magenta','crimson','maroon','orangered','mediumvioletred','red','magenta','crimson','maroon','orangered','mediumvioletred'];
    else if (i == 3) this.col = ['blue','aquamarine','navy','cyan','indigo','skyblue','blue','aquamarine','navy','cyan','indigo','skyblue'];
    else if (i == 4) this.col = ['green','lime','olive','lawngreen','forestgreen','limegreen','green','lime','olive','lawngreen','forestgreen','limegreen'];
    else if (i == 5) this.col = ['lightpink','lightsalmon','lemonchiffon','lightgreen','skyblue','lavender','lightpink','lightsalmon','lemonchiffon','lightgreen','skyblue','lavender'];
    else if (i == 6) this.col = ['darkred','brown','darkgoldenrod','darkgreen','darkslategrey','darkmagenta','darkred','brown','darkgoldenrod','darkgreen','darkslategrey','darkmagenta'];
    else this.col = ['red','orangered','yellow','lime','aqua','fuchsia','red','orangered','yellow','lime','aqua','fuchsia'];
  }
  stop(){
    this.xStop = this.xVel/2
  }
  gameOver(){
    return this.over;
  }
}
