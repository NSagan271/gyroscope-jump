class Water{
  constructor(w, h, vel){
    this.height = 0;
    this.screenWidth = w;
    this.screenHeight = h;
    if (vel) this.vel = vel;
    else this.vel = 0;
  }
  draw(context, moveDown){//drawing rising water
    var val=50;//determines color of a segement of water
    var i=0;
     if (this.height+this.vel<this.screenHeight){//hasn't reached the top of the screen
       this.height+=this.vel;//increasing height
       for(i= this.height;i>-10;i-=5){//filling in a segment
         val=Math.random()*1+30;
         context.fillStyle="hsla(0,100%,"+val+"%,0.5)";
         context.fillRect(0,this.screenHeight-i,this.screenWidth,10.1);
       }
     }
     else if(moveDown){//if moving down
       this.height-=this.vel/35;//the water moves down a little more (makes game easier)
       for(i= this.height;i>-10;i-=5){
         val=Math.random()*1+30;//filling in segments
         context.fillStyle="hsla(0,100%,"+val+"%,0.5)";
         context.fillRect(0,his.screenHeight-i,this.screenWidth,10.1);
       }
     }
   }
  drawWhenPaused(context){
     for(var i= this.height;i>-10;i-=5){
       var val=Math.random()*1+30;
       context.fillStyle="hsla(0,100%,"+val+"%,0.5)";
       context.fillRect(0,this.screenHeight-i,this.screenWidth,10.1);
     }
   }
  moveDown(){
     this.height -=10;
   }
   drawWhenOver(context){
     if (this.height<=0) this.height = this.screenHeight;
     if (this.height < this.screenHeight) this.height+=this.vel;
     for(var i= this.height;i>-10;i-=5){
       var val=Math.random()*1+30;
       context.fillStyle="hsla(0,100%,"+val+"%,0.5)";
       context.fillRect(0,this.screenHeight-i,this.screenWidth,10.1);
     }
   }
  newLevel(levelSets){
     this.vel+=(0.25/(2*Math.sqrt(levelSets)))*(h/900);//increasing water's speed (using the derivative of a sqrt function)
     if(levelSets<3)this.vel+=(0.1/(2*Math.sqrt(levelSets)))*(h/1000);
     if (this.height<=0)this.height=-this.vel* 20;//if the water is below the bottom of the screen
   }
}
