var w;
var h;
var themes = [['black','white'],['blueviolet','#B0E0E6 '], ['darkslategrey','cyan'], ['midnightblue','deeppink'], ['maroon','whitesmoke'], ['darkslateblue','bisque'], ['navy','fuchsia'], ['dimgrey','lime'], ['#651a1a','lavender'], ['teal','palegreen'], ['lightgrey','black'], ['darkgreen','aliceblue'],['indigo','gold'],['orangered','moccasin'], ['khaki','crimson'],['turquoise','coral'],['pink','yellow'],['purple','gray'],['blue','yellow'],['teal','pink'],['cyan','purple'],['#2efa91','#864991'],['black','red'],['black','gold'],['silver','black'],['green','black'],['brown','orange'],['green','yellow'],['blue','orange'],['midnightblue','brick'],['#ff0080','lime'],['silver','blue']];
var context;
var canvas;
var levelSets=0;
var paused=false;
var highScore=0;
var score=0;
var background;

var deathByBomb = false;

var moveDown=false;
var moveDownTo;

var over=false;
var overAnim = false;

//audio/visual
var theme=0;
var playSound=true;
var die = new Audio('sounds/die.mp3');
var newlev=new Audio('sounds/newlev.mp3');
var up = new Audio('sounds/up.mp3');
var explode = new Audio('sounds/explode.mp3');

//objects
var character;
var platforms = [];
var water;
var bombs = [];


var drawing = true;
var pausing = {now:false, next:true};

//easter egg: tilt screen
var tilt;
var prevTilt;
var tilting = {now:false, next:true};

$(window).on('load', function(){
  init();
});

function init(){
  setPosition();

  //load sounds
  die.load();
  newlev.load();
  up.load();
  explode.load();

  //creating a character
  character= new Player(w,h);
  var color = getCookie('color');
  if (color !== '')character.setColors(color);
  platforms = [new Platform(w,h)];
  water = new Water(w,h);

  //load high score from cookie*
  highScore=getCookie('hScore'); //
  if(highScore===''){//cookie not found
    highScore=0; //default value is 0
    $('#hScore').html("High Score: 0"); //update high score text
  }
  else $('#hScore').html("High Score: "+highScore); //update high score text

  updateAll();//start the gameplay

  //easter egg: screen tilt
  setInterval(function(){
    if(tilting.now&&!paused){ //set to tilt and game is not paused
      if(prevTilt!==0)context.translate(-w/2*prevTilt,-h/2*prevTilt); //translated so that the canvas rotates around the center
      context.rotate(-prevTilt);   //return to regular rotation; reverse previous rotation
      if(prevTilt!==0)context.translate(w/2*prevTilt,h/2*prevTilt); //returning canvas to normal loaction

      tilt=Math.random()*Math.PI/10-Math.PI/20; //rotate to a random position
      prevTilt=tilt;//(prevTilt is set so that this rotation can be reversed)
      if(tilt!==0)context.translate(-w/2*tilt,-h/2*tilt);//translated so that the canvas rotates around the center
      context.rotate(tilt); //tilt canvas
      if(tilt!==0)context.translate(w/2*tilt,h/2*tilt);//returning canvas to normal loaction
    }
  },1500);
}

function setPosition(){
  //find window height and width
  h = $(window).height();
  w=$(window).width();

  //set button and text position*
  $("#over").css("left",w/2-$('#over').width()/2); //centered
  $('h1').css("font-size",w/16+"px"); //text size
  $('#ovebtn').css('width',w/16*9+'px'); //button position
  $("#overbtn").css("left",w/2-w/16*4.5);
  $('#overbtn').css('width',w/16*9+( -w/11));

  //init canvas
  canvas = document.createElement("canvas");
  context = canvas.getContext("2d");
  canvas.width = w;
  canvas.height = h;
  background= document.createElement('img');
  background.src="img/back.png";
  context.fillStyle = "black";
  context.fillRect(0,0,canvas.width, canvas.height); //black background
  $('body').append(canvas);
}

function updateAll(){
  setInterval(function(){
    if (drawing){
      easterEgg();
      checkPausing();
      drawBackground();
      if(!over && !paused && !moveDown) move();
      if (moveDown) moveObjectsDown();
      draw();
      if (deathByBomb && character.gameOver()){
        overAnim=true;//the water rises to the top of the screen
        $("#over").css("visibility","visible");//GAME OVER text
        water.vel=6; //faster water
        over = true;
        deathByBomb = false;
        reset();
      }
    }
    else{
      draw();
    }
  },25);
}

function move(){
  character.move(keys[39] || keys[68], keys[37] || keys[65], keys[38]||keys[87]||keys[32], keys[40]||keys[83]);
  for(var i=platforms.length;i>0;i--)platforms[i-1].move();
  for (var i=0;i<bombs.length;i++)bombs[i].move();
  checkSubmerged();
  checkBombed();
  interactionWithPlatforms();
}

function draw(){
  character.draw(context, deathByBomb);
  for(var i=platforms.length;i>0;i--)platforms[i-1].draw(context, themes[theme][1]);
  if (!over){
    if (!paused)water.draw(context, moveDown);//draw water
    else water.drawWhenPaused(context);//draw water
  }
  for (var i=0;i<bombs.length;i++)bombs[i].draw(context);
  if (over)water.drawWhenOver(context);

}

function easterEgg(){
  if((keys[49]||keys[97])&&(keys[50]||keys[98])&&(keys[55]||keys[103])) { //setting screen tilt (easter egg)
    if(tilting.now!=tilting.next&&!tilting.now){//pressing the keys for the first time when not tilting
      tilt=(Math.random()*Math.PI/10)-Math.PI/20;//random tilt
      prevTilt=tilt;//used to reverse tilt
    }
    else tilt=0; //turning tilt feature
    tilting.now=tilting.next;
    if(tilting.now){//tilting screen
      if(tilt!==0)context.translate(-w/2*tilt,-h/2*tilt);//rotating from middle of screen
      context.rotate(tilt);
      if(tilt!==0)context.translate(w/2*tilt,h/2*tilt);//translating back to the original position
      tilt=0;
    }
    else{//reversing tilt (back to normal)
      if(prevTilt!==0)context.translate(-w/2*prevTilt,-h/2*prevTilt);
      context.rotate(-prevTilt);
      if(prevTilt!==0)context.translate(w/2*prevTilt,h/2*prevTilt);
      tilt=0;//not tilted
      prevTilt=0;

    }
  }
  else if(tilting.now==tilting.next)tilting.next=!tilting.next;//keys released
}

function drawBackground(){
  context.fillStyle = themes[theme][0];//filling background
  context.fillRect(0,0,canvas.width, canvas.height);
  for(var i=0;i<h;i+=1000){//drawing image (repeated x and y)
    for(var j=0;j<w;j+=1000){
      context.drawImage(background,j,i,1000,1000);
    }
  }
}

function checkPausing(){
  if(keys[27]){//esc key pressed --> pause/unpause
    if(pausing.now!=pausing.next){//key pressed; not being held
      pausing.now=!pausing.now;
      paused=!paused;
      if(!paused){//changing button text
        $('#pauseInst').html('ESC <br>to pause');
        $('#pause').html('<span class="glyphicon glyphicon-pause"></span>');
      }
      else {//changing button text
        $('#pauseInst').html('ESC <br>to unpause');
        $('#pause').html('<span class="glyphicon glyphicon-play"></span>');
      }
    }
  }
  else if (pausing.now==pausing.next) pausing.next=!pausing.now;//key released
}

function checkSubmerged(){
  if (h-water.height<=character.y){//the character is completely submerged
    over=true;//game over
    if(playSound){//
      die.play();
    }
    overAnim=true;//the water rises to the top of the screen
    $("#over").css("visibility","visible");//GAME OVER text
    water.vel=6; //faster water
  }
}

function interactionWithPlatforms(){
  for (var i = 0; i < platforms.length; i++){
    if(character.floor>=platforms[i].y+10){//the character is below the bar
      if(character.y+10<platforms[i].y&&character.y+70>platforms[i].y+10){//the character is inside the gap between the bars
          if(character.x-3+character.xVel<=platforms[i].drawX+platforms[i].vel){//hitting left bar
            character.x=platforms[i].drawX+Math.abs(character.xVel)*2+8;//character bounces back
            if(platforms[i].width>platforms[i].widthTo&&platforms[i].vel>0) character.x+=(1+platforms[i].vel);//compensating for gap width changing
            else if(platforms[i].width<platforms[i].widthTo&&platforms[i].vel<0) character.x+=(1+platforms[i].vel);
            else  character.x+=1;
            if(character.t>0){//used to determine if the character is falling from a higher level
              character.x+=10;//prevents a glitch where the character jumps up
            }
          }
          if(character.x+80+character.xVel>=platforms[i].drawX+platforms[i].width){//hitting right bar
            character.x=platforms[i].drawX+platforms[i].width-Math.abs(character.xVel)*2-80-8;//character bounces back
            if(platforms[i].width<platforms[i].widthTo&&platforms[i].vel>0) character.x-=(1+platforms[i].vel);//compensating for gap width changing
            else if(platforms[i].width>platforms[i].widthTo&&platforms[i].vel<0)character.x-=(1+platforms[i].vel);
            else character.x-=1;
            if(character.t>0){//used to determine if the character is falling from a higher level
              character.x-=10;//prevents a glitch where the character jumps up
            }
          }
      }
      if (character.y<=platforms[i].y+20&&(character.x<platforms[i].drawX ||character.x+80> platforms[i].drawX+platforms[i].width)){//character hitting the bottom of the bar

        character.t=Math.abs(character.t);//bouncing back
        character.y+=Math.abs(character.xVel)*0.5*character.t;
      }

      if (character.y<platforms[i].y&&(character.x<platforms[i].drawX ||character.x+80> platforms[i].drawX+platforms[i].width)){//jumping onto the bar
        character.floor=platforms[i].y-80;//changing where the "floor" is for the character
        if(platforms.length==i+1){//new level
          score++;

          if(parseInt(highScore)<score){//updating high score
            highScore=score;
            setCookie('hScore',highScore);//updating cookie
            $('#hScore').html('High Score: ' + highScore);//updating html
          }

          $('#score').html("Score: "+score);//updaing html
          if(i===0)$('.inst').css("visibility", "hidden");//hiding instructions (if level 1)
          if(water.vel===0)water.vel=0.385;//starting water rising
          if(playSound){//plays a 'beep' sound
            if(platforms[i].y>360) up.play();
            else newlev.play();
          }
          //the following code prevents the gap between the bars for the next level is not directly on top of the gap for this level
          var newX;//x value of the new gameplay
          var width=Math.random()*70+170;//next gap width
          if (w>1200)width+=(w-1200)/15;//increasing width for wider screens
          var num; //the number of positions the new bar can start from
          if(w>platforms[i].width*3+100){//enough space on the screen
            var gap1=platforms[i].x-platforms[i].width;//left limit for the new gap
            var gap2=platforms[i].x+platforms[i].width;//right limit
            if(gap1<50){//gap1 is too far right; the new gap is going to be to the right
              num=w-gap2-50;
              newX=Math.random()*num+gap2;
            }
            else if(gap2+150>w-50){//gap2 is too far left; the new gap is going to be to the left
              num=gap1-50;
              newX=Math.random()*num+50;
            }
            else{//the new gap can  be to the left or the right
              num=gap1+w-gap2-100;
              newX=Math.random()*num+10;
              if (newX>gap1)newX+=platforms[i].width*2;
            }
          }
          else newX=Math.random()*(w-300)+50; // if there is a narrow screen

          platforms[i+1]=new Platform(w,h,newX, platforms[i].y-160,Math.random()*2.5+2,width,i+1); //bar for next level

          if(platforms[i].y<=360){//at the top of the screen
            theme=Math.floor(Math.random()*32);//changing colors
            moveDown=true;//everything has to move down to make room for the next set of levels
            moveDownTo=platforms[1].y;
            character.y=platforms[i].y;
            character.y-=90;//prevents glitch (the character was drawn below the bar)
            character.x+=character.xVel;
          }
        }
      }
    }
    else if (character.floor==platforms[i].y-80&&character.x>platforms[i].drawX&&character.x+80< platforms[i].drawX+platforms[i].width&&character.y>=character.floor-70){//falling through the gap
      character.floor=platforms[i].y+80;
    }
  }
}
function moveObjectsDown(){
  character.moveDown();
  for (var i = 0; i < platforms.length; i ++)platforms[i].moveDown();
  for (var i = 0; i < bombs.length; i ++)bombs[i].moveDown();
  water.moveDown();
  if(platforms[platforms.length-1].y>=moveDownTo)finishMovingDown();
}
function finishMovingDown(){
  moveDown=false;

  platforms=[platforms[platforms.length-2],platforms[platforms.length-1]];//the platforms array only consists of the
                                              //bars that are currently on the screen
  platforms[0].index=0;
  platforms[1].index=1;

 levelSets++;

  character.newLevel(levelSets);
  water.newLevel(levelSets)
  character.floor=platforms[0].y-80;//changing "floor" variable

  if(score>=5){//creating a bomb object
    var bombXVel=0;
    if(score>=20)bombXVel=Math.random()*3+3;//bomb moving side to side

    if((score-5)/(Math.floor(bombs.length*3))>=bombs.length){//determining whether to add a bomb
      var bWidth = 50;
      //determining bomb width based on screen width
      if(w<=1400)bWidth=40;
      else if(w<1700&&w>1400)bWidth-=(1700-w)*0.033;
      else if(w<2100&&w>1700) bWidth-=(1700-w)*0.005;
      else if(w>=2100) bWidth=55;
      if(w>2500){ //creating an extra bomb if the screen is wide enough
        bombs.push(new Bomb(w,h,Math.random()*3+3,bombXVel,0, Math.random()*(w-100)+25));
        bombs[bombs.length-1].width=bWidth;
      }
      //adding a bomb object
      bombs.push(new Bomb(w,h,Math.random()*3+3,bombXVel,0, Math.random()*(w-100)+25));
      bombs[bombs.length-1].width=bWidth;
    }
  }
}

function checkBombed(){
  for (var i = 0 ; i < bombs.length; i++){
    if(bombs[i].x<character.x+73&&bombs[i].x+bombs[i].width-bombs[i].width/4>character.x+10&&bombs[i].y+bombs[i].width>character.y+7&&bombs[i].y+bombs[i].width/4<character.y+73){
      over=true;
      context.fillStyle = themes[theme][0];//filling in the background
      context.fillRect(0,0,canvas.width, canvas.height);
      for(var i=0;i<h;i+=1000){
        for(var j=0;j<w;j+=1000){
          context.drawImage(background,j,i,1000,1000);
        }
      }
      deathByBomb=true;//different animation when this variable is true
      if(playSound){
        explode.play();//explosion sound
      }
    }
  }
}
function reset(){
  overAnim=false;
  over = true;
  drawing = false;
}
function restart(){//clicking RETRY button
  over=false;//new game
  drawing = true;
  bombs=[];
  $("#over").css("visibility","hidden");//hiding GAME OVER text
  $('.inst').css("visibility","visible");//showing instructions

  character.reset(w,h);
  platforms = [new Platform(w,h)];//new bar/level
  water = new Water(w,h);
  score=0;//reset score
  $('#score').html("Score: "+score);//update score html

};

function pauseGame(){
  console.log("hi");
  paused=!paused;//pausing/unpausing game
  if(!paused){//updating buttons and text
    $('#pauseInst').html('ESC <br>to pause');
    $('#pause').html('<span class="glyphicon glyphicon-pause"></span>');
  }
  else {
    $('#pauseInst').html('ESC <br>to unpause');
    $('#pause').html('<span class="glyphicon glyphicon-play"></span>');
  }
}
function toggleSound(){
   playSound=!playSound;//updating variable
   //updating buttons
   if(!playSound)$('#sound').html('<span class="glyphicon glyphicon-volume-off"></span>');
   else $('#sound').html('<span class="glyphicon glyphicon-volume-up"></span>');
}

function setCookie(cname, cvalue) {//save a cookie
    var d = new Date();
    d.setTime(d.getTime() + (10*365*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; "+expires;
    return "";
}
function getCookie(cname){//retrieve a cookie
    var name = cname + "=";
    var ca = document.cookie.split(';'); //separating multiple cookies
    for(var i=0; i<ca.length; i++) {//check for the given cookie name
      var c = ca[i];//cookie at index i
      while (c.charAt(0)==' ') c = c.substring(1);
      if (c.indexOf(name) === 0) return c.substring(name.length,c.length); // return cookie value
    }
    return "";//if the cookie doesn't exist
}

var keys = {};//key value object: stores key presses

$(window).on('keydown',function(event){//key pressed
  keys[event.which] =true;//adding to key object
});

$(window).on('keyup',function(event){//when a key is released
  //set momentum for character
  if (event.which == 39 || event.which ==68 || event.which == 37 || event.which ==65) character.stop();
  delete keys[event.which];//delete element

});
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  jQuery(document).on("mobileinit", function() {
    $.extend( $.mobile , {
      autoInitializePage: false
    });
  });
  jQuery.ajax({
        url: 'http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js',
        dataType: 'script',
        success: function(){
          $('#top').html('swipe to move, tap to jump');
          $('#top').css({'width':'100%','text-align':'center','margin-right':'-230px'});
          //character motion
         $('body').on('tap', function(){//tap to jump
              if(!character.jumping&&character.y>=character.floor-1){
                character.jumping = true;
                character.t=-6;
              }

          });
          $('body').on('swiperight',function(){//swipe to go right
            keys [39]=true;
            delete keys [37];
          });
          $('body').on('swipeleft',function(){//swipe to go left
            keys [37]=true;
            delete keys [39];
          });
        },
        async: true
    });
}
$(window).on('resize', function(){
  location.reload();
});
