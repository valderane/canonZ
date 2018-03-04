var ecran_width = window.innerWidth;
var ecran_height = window.innerHeight;

var Fond = document.getElementById("fond");
var body = document.getElementsByTagName("body")[0];

var nbCanons = 3;
var canonWidth = 80;
var vitesseRotationCanons = 20;
var espaceAvantCanon = 90;
var espace = parseInt((ecran_height - espaceAvantCanon)/3);


var angleGlobal = 0;
var score = 0;
var score_contenair;
var eps = 30;

var canons = [];
var animRotation = [];

var once = false;

var peutCliquer = true;

var scoreMAx, skins, bg, skinSelected, bgSelected; 

initVar();//recuperation des donnees

//creation de la balle
var balleWidth = 20;
var balle = {elt:create_element('balle', balleWidth, balleWidth, 0, 0), x:0, y:0};
var vitesseBalle = 5;

function main(){
	var i = 0;
	score_contenair = create_element('score', canonWidth, canonWidth, Fond.width/2 - 40, 15);
	espace = parseInt((ecran_height - espaceAvantCanon)/3), x = 0;//TODO rentre les coords flotantes

	hide(balle.elt);

	for (var i = 0; i < nbCanons; i++) {
		x = randint(0,Fond.width - canonWidth);
		canons.push({elt:create_element('canon', canonWidth, canonWidth, x, espaceAvantCanon + i*espace), x:x, y:espaceAvantCanon + i*espace});
		//canonsCoords.push([x, espaceAvantCanon + i*espace]);

	}
	animRotation.push(rotate(canons[nbCanons - 1].elt, Math.sign(canons[nbCanons-2].x - canons[nbCanons-1].x), 1, vitesseRotationCanons));
	console.log("animRotation"+animRotation);
	Fond.addEventListener('click', function(){
		//TODO
		if(peutCliquer){
			peutCliquer = false;
			clearInterval(animRotation[0]);
			animRotation.splice(0, 1);
			console.log(animRotation);
			translateBalle(2,eps,vitesseBalle);
			translate(canons[nbCanons-1].elt, getXY(canons[nbCanons-1].elt), 180 + angleGlobal, 2, 10, 10);
		
		}
		
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
	ctx.arc(width/2, height/2, eps, 0, 2*Math.PI);
	ctx.strokeStyle="red";
	ctx.stroke();
}

function draw_balle(ctx, width, height){
	ctx.beginPath();
	ctx.arc(width/2, height/2, 10, 0, 2*Math.PI);
	if(skinSelected == 0){
		ctx.fillStyle = "#AACCDE";
	}
	else if(skinSelected == 1){
		ctx.fillStyle = "#AA47DE";
	}
	else if(skinSelected == 2){
		ctx.fillStyle = "#1447FC";
	}
	else if(skinSelected == 3){
		ctx.fillStyle = "#05834DE";
	}
	else if(skinSelected == 4){
		ctx.fillStyle = "#AC4520";
	}
	
	ctx.fill();
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

function rotate(c, sens, deltaAngle, vitesse){
	var anim = setInterval(function(){
		rotationCanon(c, sens*deltaAngle);
		
		angleGlobal = (angleGlobal+sens*deltaAngle)%360;

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


function translateCanon(canon, indiceCanon, delta, limite, vitesse){
	var y = canons[indiceCanon].y, x = canons[indiceCanon].x;
	var anim = setInterval(function(){
		y += delta;
		positionne(canon,x, y);
		if(y>limite){
			//TODO
			y = limite;
			positionne(canon, x, y);
			canons[indiceCanon].y = y;
			peutCliquer = true;
			angleGlobal = 0;
			if(!once){
				animRotation.push(rotate(canons[nbCanons-1].elt, Math.sign(canons[nbCanons-2].x - canons[nbCanons-1].x) ,1 , vitesseRotationCanons));
				once = true;
			}
			clearInterval(anim);
			for (var i = 0; i < nbCanons - 1; i++) {
				show(canons[i].elt);
			}
			
		}
	}, vitesse);
}

function translationBalle(direction, delta){
	balle.x += delta*Math.sin(radian(direction));
	balle.y -= delta*Math.cos(radian(direction));
	positionne(balle.elt, balle.x, balle.y);
	//particules([balle.x  , balle.y], [20, 20], [0.5, 0.5], 1, 10, angleGlobal - 2, angleGlobal + 2, 5, draw_aleatoire, [5, 10] );
}

function translateBalle(delta, eps, vitesse){
	var coordsInit = [canons[nbCanons-1].x, canons[nbCanons-1].y];
	var animBalle;
	var c;
	var angle = angleGlobal;
	once = false;
	


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
			gameOver(); // de ui.js
		}
		else{
			for (var i = canons.length - 2; i >= 0; i--) {
				d = distance([canons[i].x + canonWidth/2, canons[i].y + canonWidth/2], [balle.x+balleWidth/2, balle.y+balleWidth/2]);
				if(d<=eps){
					hide(balle.elt);
					clearInterval(animBalle);
					if(i == 0){
						score+=2;
						draw_score(score_contenair.getContext('2d'), score_contenair.width, score_contenair.height, score);

						for (var j = 1; j < canons.length; j++) {
							remove(canons[j].elt); 
						}
						
						canons[2] = canons[0];
						translateCanon(canons[2].elt, 2, 2, espaceAvantCanon + 2*espace, 10);
						
						//canons[2].y = espaceAvantCanon + 2*espace; 

						for (var j = 0; j < nbCanons-1; j++) {
							x = randint(0, Fond.width - canonWidth );
							canons[j] = {elt:create_element('canon', canonWidth, canonWidth, x, espaceAvantCanon + j*espace), x:x, y:espaceAvantCanon + j*espace}; 
							hide(canons[j].elt);
							console.log("canon "+j+" [ "+canons[j].x+","+canons[j].y+" ]");
						}

					}
					else{
						x = randint(0, Fond.width - canonWidth);
						score+=1;
						draw_score(score_contenair.getContext('2d'), score_contenair.width, score_contenair.height, score);

						remove(canons[2].elt);

						canons[2] = canons[1];
						canons[1] = canons[0];

						translateCanon(canons[2].elt, 2, 2, espaceAvantCanon +  2*espace , 10);
						translateCanon(canons[1].elt, 1, 2, espaceAvantCanon +  espace, 10);

						//canonsCoords[2][0] = canonsCoords[1][0];
						//canonsCoords[1][0] = canonsCoords[0][0];

						canons[0] = {elt:create_element('canon', canonWidth, canonWidth, x, espaceAvantCanon), x:x, y:espaceAvantCanon};
						hide(canons[0].elt);
						console.log("canon "+0+" [ "+canons[0].x+","+canons[0].y+" ]");

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

					break;

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

function initVar(){
	//charge toutes les variables d'environement du joueur, 
	//ie skin, background et scoreMAx
	//initialise le storage si pas encore initialisé
	scoreMAx = parseInt(localStorage.scoreMAx);
	skins = localStorage.skins; // sous forme de texte "0,0,0,0..."
	bg = localStorage.bg; // sous forme de texte "0,0,0,0..."
	skinSelected = parseInt(localStorage.skinSelected); // sous forme de texte "0,0,0,0..."
	bgSelected = parseInt(localStorage.bgSelected); // sous forme de texte "0,0,0,0..."
}

function sin(x){
	return Math.sin(x);
}

function translationEffet(elt, direction, pos, delta, effet){
	var x = pos[0], y = pos[1];
	x = x  + effet(y) +delta*Math.sin(radian(direction));
	y = y - delta*Math.cos(radian(direction));
	positionne(elt, x, y);
	return [x, y];
}

function translateParticule(elt, d, init, limite, dirmin, dirmax, ret, vitesse){
	var positionActuelle = init;
	var dir = randint(dirmin, dirmax);
	var anim = setInterval(function(){
		positionActuelle = translationEffet(elt, dir, positionActuelle, randint(d[0], [1]), sin);
			if(distance(init, positionActuelle)>limite){
				clearInterval(anim);
				remove(elt);
			}
			if(ret!=0){
				retrecir(elt, 2, 2, ret);
			}

	},vitesse);
}

function retrecir(elt, limW, limH, delta){
	var width = elt.width-delta, height = elt.height-delta;
	if(width>limW && height>limH){
		redimensionne(elt, width, height);
	}
}

function particules(init, t, d, n, limite, dirmin, dirmax, retrecir, style, v){
	var width, positionActuelle = init;
	var anims = [];
	var particules = [];
	for (var i = 0; i < n; i++) {
		width = randint(t[0], t[1]);
		particules.push(create_element('null', width, width, init[0], init[1]));
		style(particules[i].getContext('2d'),width );
	}

	for (var i = 0; i < n; i++) {
		translateParticule(particules[i], d, init, limite, dirmin, dirmax, retrecir ,randint(v[0], v[1]));
	}
	

}

function draw_aleatoire(ctx, w){
	ctx.beginPath();
	ctx.arc(w/2, w/2, w/2, 0, 2*Math.PI);
	ctx.globalAlpha = Math.random();
	ctx.fillStyle = randomColor();
	ctx.fill();
}

function randomColor(){
	return "rgb("+randint(0,255)+","+randint(0,255)+","+randint(0,255)+")";
}

main();