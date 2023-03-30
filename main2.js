//------------CARGAMOS LAS PALETAS DEL JUGADOR 1 ---------------


var paddle1 = 10;
var paddle1X = 10;
var paddle1Y;


var paddle2 = 10;
var paddle2Y = 685;

var paddle1Height = 110;
var paddle2Height = 110;

var score1 = 0;
var score2 = 0;


var playerscore =0;

var pcscore =0;

//posición y velocidad x, y de la pelota y su radio

var pelota = {
    x:350/2,
    y:480/2,
    r:20,
    dx:3,
    dy:3
}

nariz_Y = 0;
nariz_X = 0;
puntos_nariz = 0;

//----------------VARIABLE QUE DEFINE EL ESTATUS DEL JUEGO --------------
estatus = "";


 function preload() 
 {

    //---------------PRE-CARGA DE SONIDOS DEL JUEGO -----------------

     ball_touch_paddel = loadSound("ball_touch_paddel.wav");
     missed = loadSound("missed.wav");

 }


function setup()
{

    //-----------CARGA EL LIENZO ----------------
    var canvas =  createCanvas(700,600);
    canvas.parent('canvas');


    //------------CARGA DE LA CAMARA --------------
    video = createCapture(VIDEO);
    video.size(700, 600);
    video.hide();


    //--------CARGA DEL MODELO POSENET -------------
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);

}


//-----------FUNCION DE MODELO CARGADO ---------------

function modelLoaded() 
{
  console.log('PoseNet se ha inicializado');
}


//--------------FUNCION QUE CAPTURA RESULTADOS DEL POSENET------------
function gotPoses(results)
{
  if(results.length > 0)
  {
 console.log(results);
    nariz_Y = results[0].pose.nose.y;
    nariz_X = results[0].pose.nose.x;
    puntos_nariz =  results[0].pose.keypoints[0].score;
    
  }
}


//-----------------FUNCION DE INICIO DEL JUEGO -----------------
function jugar()
{
  estatus = "jugar";
  document.getElementById("estatus").innerHTML = "El juego está cargado";
}


//----------------FUNCION DE DIBUJO SOBRE LIENZO -----------

function draw()
{
    if(estatus == "jugar")
    {
        background(0); 
        image(video, 0, 0, 700, 600);

        fill("black");
        stroke("black");
        rect(680,0,20,700);

        fill("black");
        stroke("black");
        rect(0,0,20,700);

        if(puntos_nariz > 0.2)
        {
            fill("aqua");
            stroke("aqua");
            circle(nariz_X, nariz_Y, 30);
        }


        //Llamar a la función paddleInCanvas 
        paddleInCanvas();
        
        //Paleta izquierda
        fill(250,0,0);
        stroke(0,0,250);
        strokeWeight(0.5);
        paddle1Y = nariz_Y; 
        rect(paddle1X,paddle1Y,paddle1,paddle1Height,100);


        //Paleta de la computadora
        fill("#FFA500");
        stroke("#FFA500");
        var paddle2y =pelota.y-paddle2Height/2;  
        
        rect(paddle2Y,paddle2y,paddle2,paddle2Height,100);
    
        //Llamar a la función  midline
        midline();
    
        //Llamar a la función drawScore
         drawScore();

        //Llamar a la función models  
        models();

         //Llamar a la función move, la cual es muy importante
        move();

    }

}



//Función reset, para cuando la pelota no entra en contacto con la pelota

function reset()
{
   pelota.x = width/2+100,
   pelota.y = height/2+100;
   pelota.dx =3;
   pelota.dy =3;   
}


//La función midline dibuja una línea en el centro
function midline()
{
    for(i=0;i<480;i+=10) 
    {
        var y = 0;
        fill("white");
        stroke(0);
        rect(width/2,y+i,10,480);
    }
}


//La función drawScore muestra los puntajes
function drawScore()
{
    textAlign(CENTER);
    textSize(20);
    fill("white");
    stroke(250,0,0);
    text("Tú:  ",100,50);
    text(playerscore,140,50);
    text("Pc:  ",500,50);
    text(pcscore,555,50)
}


//Función muy importante para este juego
function move()
{
   fill(50,350,0);
   stroke(255,0,0);
   strokeWeight(0.5);
   ellipse(pelota.x,pelota.y,pelota.r,20)
   pelota.x = pelota.x + pelota.dx;
   pelota.y = pelota.y + pelota.dy;

    if(pelota.x + pelota.r > width - pelota.r/2)
    {
       pelota.dx = -pelota.dx - 0.5;       
    }

    if (pelota.x - 2.5 * pelota.r/2 < 0)
    {
        if (pelota.y >= paddle1Y && pelota.y <= paddle1Y + paddle1Height) 
        {
            pelota.dx = -pelota.dx+0.5; 
            ball_touch_paddel.play();
            playerscore++;
        }

        else
        {
            pcscore++;
            missed.play();
            reset();
            navigator.vibrate(100);
        }
    }

    if(pcscore ==4)
    {
        fill("purple");
        stroke(0)
        rect(0,0,width,height-1);
        fill("white");
        stroke("white");
        textSize(25);
        text("¡Fin del juego!",width/2,height/2);
        text("Presiona el botón de reinicio para jugar de nuevo",width/2,height/2+30)
        noLoop();
        pcscore = 0;
    }
   
    if(pelota.y+pelota.r > height || pelota.y-pelota.r <0)
    {
        pelota.dy =- pelota.dy;
    }   
}


//Ancho, altura y velocidad de la pelota escritos en el canvas
function models()
{
    textSize(18);
    fill(255);
    noStroke();
    text("Velocidad de la pelota: "+abs(pelota.dx),150,20);

}


//Esta función ayuda a que la pelota no salga del canvas
function paddleInCanvas()
{
  if(mouseY + paddle1Height > height)
  {
    mouseY = height - paddle1Height;
  }

  if(mouseY < 0)
  {
     mouseY =0;
  }
 
  
}

function restart()
{
  loop();
  pcscore = 0;
  playerscore = 0;
}
