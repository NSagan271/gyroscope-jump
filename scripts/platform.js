class Platform{
  constructor(w, h, splitX, y, vel, splitW, index){
    this.screenWidth = w;
    this.screenHeight = h;
    if (!splitX) splitX = 100;
    this.x = splitX;
    if (!y)  y = h - 160;
    this.y = y;
    if (!splitW)  splitW = 200;
    this.width = splitW;
    if (!vel)  vel = 2;
    this.vel = vel;

    this.index = index;
    this.maxWidth = Math.random()*25+25;
    this.widthTo = splitW - this.maxWidth;
    this.drawX = splitX - splitW/2;
    this.widthChange = this.maxWidth;

    if (w>1200)this.width+=(w-1200)/15;
    else if(w<700){
      this.widthTo=50;
      this.widthChange=this.width/2-25;
    }
  }
  move(){
    this.x+=this.vel;//changing position
    if(this.width<this.widthTo){//increasing width of gap
      this.width+=(1+Math.abs(this.vel));
      this.drawX=this.x-this.width/2;//changing where the bars are based on the width of the gap
      if (this.width>=this.widthTo)this.widthTo-=this.widthChange*2;//changing direction of width change (--> decreasing)
    }
    else{//decreasing width
      this.width-=(1+Math.abs(this.vel));
      this.drawX=this.x-this.width/2;//changing where the bars are drawn
      if (this.width<=this.widthTo)this.widthTo+=this.widthChange*2;//changing direction of width change
    }

    if (this.x+this.width/2>=w-40){//changing direction of bar movement when the gap reaches the edge of the screen
      this.vel=-Math.abs(this.vel);//going left
    }
    else if (this.x-this.width/2<=40){
      this.vel=Math.abs(this.vel); //going right
    }
  }

  moveDown(){
    this.y+=10;
  }
  draw(context, color){//drawing bars
    context.strokeStyle='black';//black outline
    context.lineWidth=1.5;
    context.strokeRect(0,this.y,this.drawX,10); //two rectangles: one on either side of the gap
    context.strokeRect(this.drawX+this.width,this.y,this.screenWidth,10);
    context.fillStyle = color; //colored fill
    context.fillRect(0,this.y+1.5,this.drawX,7);//two rectangles: one on either side of the gap
    context.fillRect(this.drawX+this.width,this.y+1.5,this.screenWidth,7);
  }
}
