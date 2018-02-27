var ecran_width = window.innerWidth;
var ecran_height = window.innerHeight;

var Fond = document.getElementById("fond");
var body = document.getElementsByTagName("body")[0];

var nbCanons = 3;
var canonWidth = 80;
var espaceAvantCanon = 90;

//creation de la balle
var balle = create_element('balle', canonWidth, canonWidth, 0, 0);

var angleGlobal = 0;
var score = 0;
var eps = 1;

var canons = [];
var score_contenair;
var animRotation;



function main(){
	var i = 0;
	score_contenair = create_element('score', canonWidth, canonWidth, Fond.width/2 - 40, 15);
	var espace = (ecran_height - espaceAvantCanon)/3;

	hide(balle);

	for (var i = 0; i < nbCanons; i++) {
		canons.push(create_element('canon', canonWidth, canonWidth, randint(0,Fond.width-80), espaceAvantCanon + i*espace));
	}

	animRotation = rotate(canons[nbCanons - 1], 1, 40);

	Fond.addEventListener('click', function(){
		//TODO
		translateBalle(2,eps,10);
	});
	//translate(canon, getXY(canon), 0, 1, 10, 10);
} 

function create_element(nature, width, height, x, y){
	//width and height should be > 50
	var canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	canvas.style.position = "absolute";
	canvas.style.top = y+"px";
	canvas.style.left = x+"px";

	var ctx = canvas.getContext('2d');

	if(nature == "canon"){
		draw_canon(ctx, width, height);
	}
	else if(nature == "balle"){
		draw_balle(ctx, width, height);
	}
	else if(nature == "score"){
		draw_score(ctx, width, height, 0);
	}

	body.appendChild(canvas);
	return canvas;
}

function draw_canon(ctx, width, height){
	// draw a canon on a context ctx
	ctx.beginPath();
	ctx.arc(width/2, height/2, 20, 0, 2*Math.PI);
	ctx.fillStyle = "#FFFFFF";
	ctx.fill();
	ctx.fillRect(width/2-10, height/2-30, 20, 20);
}

function draw_balle(ctx, width, height){
	ctx.beginPath();
	ctx.arc(width/2, height/2, 10, 0, 2*Math.PI);
	ctx.fillStyle = "#AACCDE";
	ctx.fill();
}

function draw_score(ctx, width, height, score){
	ctx.textAlign = "center";
	ctx.fillStyle = "#FFFFFF";
	ctx.font="50px Arial";
	ctx.fillText(""+score, width/2, height/2);
}

function rotationCanon(c, angle){
	var ctx = c.getContext('2d');
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.translate(c.width/2, c.height/2);
	ctx.rotate(angle*Math.PI/180);
	ctx.translate(-c.width/2, -c.height/2);
	draw_canon(ctx, c.width, c.height);
}

function rotate(c, deltaAngle, vitesse){
	var anim = setInterval(function(){
		rotationCanon(c, deltaAngle);
		angleGlobal = (angleGlobal+deltaAngle)%360;

	}, vitesse);

	return anim
}

function translation(elt, direction, delta){
	var x = getXY(elt)[0], y = getXY(elt)[1];
	x = x + delta*Math.sin(radian(direction));
	y = y - delta*Math.cos(radian(direction));
	positionne(elt, x, y);
}

function translate(elt, init, direction, delta, limite, vitesse){
	var anim = setInterval(function(){
		translation(elt, direction, delta);
		if(distance(init, getXY(elt))>limite){
			//TODO
			clearInterval(anim);
		}
	}, vitesse);
}

function translateBalle(delta, eps, vitesse){
	var coordsInit = getXY(canons[nbCanons-1]);
	var animBalle;
	var c;
	var coordsCanons = [];
	clearInterval(animRotation);
	var angle = angleGlobal;
	show(balle);
	for (var i = 0; i < canons.length ; i++) {
		c = getXY(canons[i]);
		coordsCanons.push([c[0] + canonWidth/2, c[1] + canonWidth/2]);
	}

	positionne(balle, coordsInit[0], coordsInit[1]);
	animBalle = setInterval(function(){
		translation(balle, angle, delta);
		coordsInit = getXY(balle);
		if( coordsInit[0]<0 || coordsInit[0]>Fond.width || coordsInit[1]<0 || coordsInit[1]>Fond.height ){
			clearInterval(animBalle);
		}
		else{
			for (var i = canons.length - 2; i >= 0; i--) {
				if(distance(coordsCanons[i], [getXY(balle)[0]+canonWidth/2, getXY(balle)[1]+canonWidth/2])<eps){
					hide(balle);
					clearInterval(animBalle);
					if(i == 0){
						score+=2;
						draw_score(score_contenair.getContext('2d'), score_contenair.width, score_contenair.height, score);

					}
					else{
						score+=1;
						draw_score(score_contenair.getContext('2d'), score_contenair.width, score_contenair.height, score);
					}
					//TODO
				}
			}
		}
		
	}, vitesse);
}

function getXY(elt){
	return [getValue(elt.style.left), parseInt(elt.style.top)] ;
}

function redimensionne(elt, width , height){
	//donne width et height a l'element elt
	elt.style.width = width+"px";
	elt.style.height = height+"px";
}

function positionne(elt, x, y){
	elt.style.position = 'absolute';
	elt.style.top = y+"px";
	elt.style.left = x+"px";
}

function hide(elt){
	elt.style.display = 'none';
}

function show(elt){
	elt.style.display = 'block';
}

function radian(degre){
	return (Math.PI*degre)/180;
}

function distance(a, b){
	return Math.sqrt((a[0]-b[0])^2 + (a[1]-b[1])^2);
}

function getValue(text){
	var nbr = "", digit;
	for (var i = 0; i < text.length; i++) {
		digit = text[i];
		if(digit == 'p'){
			break;
		}
		else{
			nbr+=digit;
		}
	}

	return parseInt(nbr);
}

function randint(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function remove(elt){
	body.removeChild(elt);
}

main();