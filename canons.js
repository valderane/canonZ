var ecran_width = window.innerWidth;
var ecran_height = window.innerHeight;

var Fond = document.getElementById("fond");
var body = document.getElementsByTagName("body")[0];

var nbCanons = 3;
var canonWidth = 80;
var canonsCoords = [];
var vitesseRotationCanons = 10;
var espaceAvantCanon = 90;
var espace = parseInt((ecran_height - espaceAvantCanon)/3)

//creation de la balle
var balleWidth = 20;
var balle = {elt:create_element('balle', balleWidth, balleWidth, 0, 0), x:0, y:0};
var vitesseBalle = 1;

var angleGlobal = 0;
var score = 0;
var eps = 50;

var canons = [];
var score_contenair;
var animRotation;



function main(){
	var i = 0;
	score_contenair = create_element('score', canonWidth, canonWidth, Fond.width/2 - 40, 15);
	espace = parseInt((ecran_height - espaceAvantCanon)/3), x = 0;//TODO rentre les coords flotantes

	//hide(balle);

	for (var i = 0; i < nbCanons; i++) {
		x = randint(0,Fond.width - canonWidth);
		canons.push(create_element('canon', canonWidth, canonWidth, x, espaceAvantCanon + i*espace));
		canonsCoords.push([x, espaceAvantCanon + i*espace]);

	}
	console.log(canonsCoords);
	animRotation = rotate(canons[nbCanons - 1], 1, vitesseRotationCanons);

	Fond.addEventListener('click', function(){
		//TODO
		translateBalle(2,eps,vitesseBalle);
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
	ctx.beginPath();
	ctx.arc(width/2, height/2, 1, 0, 2*Math.PI);
	ctx.fillStyle = "#0000FF";
	ctx.fill();
	ctx.strokeStyle="red";
	ctx.stroke();
}

function draw_balle(ctx, width, height){
	ctx.beginPath();
	ctx.arc(width/2, height/2, 10, 0, 2*Math.PI);
	ctx.fillStyle = "#AACCDE";
	ctx.fill();
	ctx.beginPath();
	ctx.arc(width/2, height/2, 1, 0, 2*Math.PI);
	ctx.fillStyle = "#FF0000";
	ctx.fill();
	ctx.strokeStyle="red";
	ctx.stroke();
}

function draw_score(ctx, width, height, score){
	ctx.clearRect(0, 0, width, height);
	ctx.beginPath;
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

	return anim;
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

function translationBalle(direction, delta){
	balle.x += delta*Math.sin(radian(direction));
	balle.y -= delta*Math.cos(radian(direction));
	positionne(balle.elt, balle.x, balle.y);
}

function translateBalle(delta, eps, vitesse){
	var coordsInit = canonsCoords[nbCanons-1];
	var animBalle;
	var c;
	clearInterval(animRotation);
	var angle = angleGlobal;
	


	show(balle.elt);
	coordsInit = [coordsInit[0] + (canonWidth/2 - balleWidth/2 ) , coordsInit[1] + (canonWidth/2 - balleWidth/2 ) ];

	positionne(balle.elt, coordsInit[0], coordsInit[1]);
	balle.x = coordsInit[0];
	balle.y = coordsInit[1];

	animBalle = setInterval(function(){
		var x  = 0;
		var d = 0;
		translationBalle(angle, delta);
		//coordsInit = getXY(balle);
		//coordsInit = [coordsInit[0] + (canonWidth/2 - balleWidth/2 ) , coordsInit[1] + (canonWidth/2 - balleWidth/2 ) ];
		//console.log([balle.x, balle.y]);
		if( balle.x<0 || balle.x>Fond.width || balle.y<0 || balle.y>Fond.height ){
			clearInterval(animBalle);
		}
		else{
			for (var i = canons.length - 2; i >= 0; i--) {
				d = distance([canonsCoords[i][0] + canonWidth/2, canonsCoords[i][1] + canonWidth/2], [balle.x+balleWidth/2, balle.y+balleWidth/2]);
				console.log(d);
				if(d<=eps){
					//hide(balle);
					clearInterval(animBalle);
					if(i == 0){
						score+=2;
						draw_score(score_contenair.getContext('2d'), score_contenair.width, score_contenair.height, score);

						for (var j = 1; j < canons.length; j++) {
							remove(canons[j]); 
						}
						translate(canons[0], canonsCoords[0], 180, 2, 2*espace, 10);
						canons[2] = canons[0];

						canonsCoords[2][0] = canonsCoords[0][0];

						for (var j = 0; j < nbCanons-1; j++) {
							x = randint(0, Fond.width);
							canons[j] = create_element('canon', canonWidth, canonWidth, x, espaceAvantCanon + j*espace); 
							canonsCoords[j][0] = x;
						}
					}
					else{
						x = randint(0, Fond.width);
						score+=1;
						draw_score(score_contenair.getContext('2d'), score_contenair.width, score_contenair.height, score);

						remove(canons[2]);

						var a = canonsCoords[0], b = canonsCoords[1];

						translate(canons[0], a, 180, 2, espace , 10);
						translate(canons[1], b, 180, 2, espace, 10);

						canons[2] = canons[1];
						canons[1] = canons[0];

						canonsCoords[2][0] = canonsCoords[1][0];
						canonsCoords[1][0] = canonsCoords[0][0];
						canons[0] = create_element('canon', canonWidth, canonWidth, x, espaceAvantCanon);
						canonsCoords[0][0] = x;


					}
					/*
					//scroller les canons
					for (var j = i+1; j < canons.length; j++) {
						remove(canons[j]); 
					}

					

					for (var j = i; j>=0; j--) {
						translate(canons[j], getXY(canons[j]), 180, 2, (nbCanons-i-1)*espace, 10);
						console.log(j + (nbCanons-i-1));
						canons[j + (nbCanons-i-1)] = canons[j];
						console.log("canonCoords x before="+canonsCoords[nbCanons-i-1][0]);
						canonsCoords[j + (nbCanons-i-1)][0] = canonsCoords[j][0];
						console.log("canonCoords x after="+canonsCoords[nbCanons-i-1][0]);
					}

					for (var j = 0; j < nbCanons-i-1; j++) {
						console.log(j);
						x = randint(0, Fond.width);
						console.log("x="+x);
						canons[j] = create_element('canon', canonWidth, canonWidth, x, espaceAvantCanon + j*espace); 
						canonsCoords[j][0] = x;
					} */

					console.log(canonsCoords);

					animRotation = rotate(canons[nbCanons-1], 1 , vitesseRotationCanons);

					//TODO
				}
			}
		}
		
	}, vitesse);
}

function getXY(elt){
	return [getValue(elt.style.left), getValue(elt.style.top)] ;
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
	var dist = Math.sqrt(Math.pow(Math.abs(a[0]-b[0]), 2) + Math.pow(Math.abs(a[1]-b[1]), 2));
	//console.log(dist);
	return dist;
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

	return parseFloat(nbr);
}

function randint(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function remove(elt){
	body.removeChild(elt);
}

main();