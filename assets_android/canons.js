var ecran_width = window.innerWidth;
var ecran_height = window.innerHeight;

var body = document.getElementsByTagName("body")[0];
redimensionne(body, ecran_width, ecran_height);

var nbCanons = 3;
var canonWidth = ecran_width/5;
var vitesseRotationCanons = 15;
var espaceAvantCanon = canonWidth + 40;
var deltaAng = 1.5;
var deltaTranslationCanon = 5;
var espace = parseInt((ecran_height - espaceAvantCanon)/3);

 
var angleGlobal = 0;
var score = pointsInitiaux = parseInt(localStorage.pointsInitiaux);
var score_contenair;
var scoreWidth = canonWidth;
var alphabet = new Image();
	alphabet.src = 'ui.png';
	alphabet.onload = function(){
		score_contenair = write(alphabet, score+"", scoreWidth, (""+score).length*scoreWidth, 0, 0 );
		
		positionne(score_contenair, ecran_width/2 - score_contenair.width/2, 15);
	}
var eps = canonWidth/2-10;

var canons = [];
var animRotation = [];
var imageCanon = document.getElementById("canon");


var once = false;

var peutCliquer = true;

var scoreMAx, skins, bg, skinSelected, bgSelected; 

initVar();//recuperation des donnees

//creation de la balle
var balleWidth = canonWidth/2;
var balle = {elt:createImage('ball'+localStorage.skinSelected+'.png', balleWidth, balleWidth), x:0, y:0};
var vitesseBalle = 15;
var deltaBalle = 16;

//image de la pièce
var imgPiece = new Image();
imgPiece.src = 'piece.png';
var nbPieces = 0, pieces = [], pieceWidth = 2*balleWidth/3; //TODO


function main(){
	var i = 0;
	espace = parseInt((ecran_height - espaceAvantCanon)/3), x = 0;//TODO rentre les coords flotantes

	hide(balle.elt);

	for (var i = 0; i < nbCanons; i++) {
		x = randint(0,ecran_width - canonWidth);
		canons.push({elt:create_element('canon', canonWidth, canonWidth, 0, 0), x:x, y:espaceAvantCanon + i*espace});
		positionne(canons[i].elt, canons[i].x, canons[i].y);
		//canonsCoords.push([x, espaceAvantCanon + i*espace]);
	}


	animRotation.push(rotate(nbCanons - 1, sign(canons[nbCanons-2].x - canons[nbCanons-1].x), deltaAng, vitesseRotationCanons));
	
	canons[nbCanons-1].elt.addEventListener('click', function(){
		if(peutCliquer){
			peutCliquer = false;
			clearInterval(animRotation[0]);
			animRotation.splice(0, 1);
			translateBalle(deltaBalle, eps,vitesseBalle);
			translate(canons[nbCanons-1].elt, getXY(canons[nbCanons-1].elt), 180 + angleGlobal, 2, 10, 10);
		
		}
	} );
	

	body.addEventListener('click', function(){
		//TODO
		if(peutCliquer){
			peutCliquer = false;
			clearInterval(animRotation[0]);
			animRotation.splice(0, 1);
			translateBalle(deltaBalle, eps,vitesseBalle);
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
		draw_score(ctx, width, height, score);
	}


	body.appendChild(canvas);
	return canvas;
}

function draw_canon(ctx, width, height){
	// draw a canon on a context ctx
	ctx.beginPath();
	/*ctx.arc(width/2, height/2, width/2-10, 0, 2*Math.PI);
	ctx.fillStyle = "#FFFFFF";
	ctx.fill();
	ctx.fillRect(width/2-10, height/2-30, 20, 20);
	*/
	ctx.drawImage(imageCanon, 0, 0, width, height);
	/*ctx.beginPath();
	ctx.arc(width/2, height/2, eps, 0, 2*Math.PI);
	ctx.strokeStyle="red";
	ctx.stroke();*/
}

function draw_balle(ctx, width, height){
	ctx.beginPath();
	ctx.arc(width/2, height/2, 10, 0, 2*Math.PI);
	if(skinSelected == 0){
		ctx.fillStyle = randomColor();
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
	else{
		ctx.fillStyle = "#AA47DE";
	}
	
	ctx.fill();
}

function createImage(image, w, h){
    var c = document.createElement('img');
    c.width = w;
    c.height = h;
    c.src  =image;
    body.appendChild(c);
    return c;
}


function draw_score(ctx, width, height, score){
	ctx.clearRect(0, 0, width, height);
	ctx.beginPath;
	writeIn(alphabet , ctx, score+"", canonWidth, 0 );
}

function rotationCanon(c, angle){
	var ctx = canons[c].elt.getContext('2d');
	ctx.clearRect(0, 0, canonWidth, canonWidth);
	ctx.translate(canonWidth/2, canonWidth/2);
	ctx.rotate(angle*Math.PI/180);
	ctx.translate(-canonWidth/2, -canonWidth/2);
	draw_canon(ctx, canonWidth, canonWidth);
	//canons[c].elt.style.transform = "rotate("+angle+"deg)";
	//console.log(c);
}

function rotate(c, sens, deltaAngle, vitesse){
	var anim = setInterval(function(){
		
		angleGlobal = (angleGlobal+sens*deltaAngle)%360;
		if(sens == 0){
			sens = 1;
		}
		rotationCanon(c, sens*deltaAngle);
		if(Math.abs(angleGlobal) >= 90){
			sens = -sens;
		}

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

function translateIn(elt, init, direction, delta, limite, vitesse){
	var d = delta;
	var anim = setInterval(function(){
		translation(elt, direction, d);
		d+=1
		if(distance(init, getXY(elt))>limite){
			//TODO
			clearInterval(anim);
		} 
	}, vitesse);
}

function translateOut(elt, init, direction, delta, limite, vitesse){
	var d = delta;
	var anim = setInterval(function(){
		translation(elt, direction, d);
		if(d > 5){d-=1;}
		if(distance(init, getXY(elt))>limite){
			//TODO
			clearInterval(anim);
		} 
	}, vitesse);
}

function translateCanon(indiceCanon, delta, limite, vitesse){
	//var y = canons[indiceCanon].y //, x = canons[indiceCanon].x;
	var anim = setInterval(function(){
		canons[indiceCanon].y += delta;
		positionne(canons[indiceCanon].elt, canons[indiceCanon].x, canons[indiceCanon].y);
		if(canons[indiceCanon].y>limite){
			//TODO
			clearInterval(anim);
			canons[indiceCanon].y = limite;
			positionne(canons[indiceCanon].elt, canons[indiceCanon].x, canons[indiceCanon].y);
			//canons[indiceCanon].y = y;
			angleGlobal = 0;
			for (var i = 0; i < nbCanons - 1; i++) {
				show(canons[i].elt);
			}
			if(!once){
				animRotation.push(rotate(nbCanons-1, sign(canons[nbCanons-2].x - canons[nbCanons-1].x) ,deltaAng , vitesseRotationCanons));
				once = true;
			}

			//place ta pièce
			if(score > 10){
				var k = 0 , l = nbCanons - 1, x = 0, y = 0 , r = 0;
				nbPieces = randint(0,1);
				for (var i = 0; i < nbPieces; i++) {
					d = distance([canons[k].x, canons[k].y] , [canons[l].x, canons[l].y]);
					r = randint(canonWidth , d - canonWidth);
					x = canons[l].x + canonWidth/2 + r/d*(canons[k].x - canons[l].x);
					y = canons[l].y + canonWidth/2 + r/d*(canons[k].y - canons[l].y) ;
					//console.log("x0="+(canons[l].x + canonWidth/2)+" x1="+(canons[k].x + canonWidth/2)+" y0="+(canons[l].y + canonWidth/2)+" y1="+(canons[k].y + canonWidth/2)+" x="+x+" y="+y);
					pieces.push({elt:create_element('null', pieceWidth, pieceWidth, x - pieceWidth/2, y -  pieceWidth/2), x:x - pieceWidth/2, y:y - pieceWidth/2 , w:pieceWidth});
					pieces[i].elt.getContext('2d').drawImage(imgPiece, 0, 0, pieceWidth, pieceWidth);
					shake(pieces[i].elt, 50);
				}
			}


			peutCliquer = true;
		}
	}, vitesse);
}

function translationBalle(direction, delta){
	balle.x += delta*Math.sin(radian(direction));
	balle.y -= delta*Math.cos(radian(direction));
	positionne(balle.elt, balle.x, balle.y);
	//particules([balle.x  , balle.y], [5, 5], [1, 1], 1, 1.5, angleGlobal - 2, angleGlobal + 2, 5, draw_aleatoire, [0.5, 1] );
}

function translateBalle(delta, eps, vitesse){
	var coordsInit = [canons[nbCanons-1].x, canons[nbCanons-1].y];
	var animBalle;
	var c, canon3, canon2;
	var angle = angleGlobal;
	var zonesDePlacement = [];
	once = false;
	
	show(balle.elt);
	coordsInit = [coordsInit[0] + (canonWidth/2 - balleWidth/2 ) , coordsInit[1] + (canonWidth/2 - balleWidth/2 ) ];

	positionne(balle.elt, coordsInit[0], coordsInit[1]);
	balle.x = coordsInit[0];
	balle.y = coordsInit[1];

	//particules([balle])

	animBalle = setInterval(function(){
		var x  = 0;
		var d = 0;
		translationBalle(angleGlobal, delta);
		if(delta > 10){delta = delta - 0.5;}

		//si la balle touche une pièce TODO
		for (var i = 0; i < pieces.length; i++) {
			d = distance([pieces[i].x + pieces[i].w/2, pieces[i].y + pieces[i].w/2] , [balle.x+balleWidth/2, balle.y+balleWidth/2]);
			if(d < pieceWidth - 5){
				remove(pieces[i].elt);
				localStorage.bullets = ( parseInt(localStorage.bullets) + 1 )+""; 
				particules([pieces[i].x + pieces[i].w/2, pieces[i].y + pieces[i].w/2], [15,15], [5,5], 5 , 50, 0, 360, 0, draw_piece, 30);
				pieces.splice(i, 1);
				//sound

			}
		}

		//si la balle sort du terrain
		if( balle.x + balleWidth < 0 || balle.x + balleWidth>ecran_width || balle.y + balleWidth < 0 || balle.y+balleWidth>ecran_height ){
			clearInterval(animBalle);
			particules([balle.x  , balle.y], [10, 10], [10, 10], 5, 100, angleGlobal - 90, angleGlobal + 90, 0, draw_aleatoire, 30 );
            //mettre a jour les scores
            if(score > parseInt(localStorage.scoreMAx)){
                localStorage.scoreMAx = ""+score;
                gameOver(true);
            }
            else{
				gameOver(false); // de ui.js
			}

		}
		//si la balle touche un canon
		else{
			for (var i = canons.length - 2; i >= 0; i--) {
				d = distance([canons[i].x + canonWidth/2, canons[i].y + canonWidth/2], [balle.x+balleWidth/2, balle.y+balleWidth/2]);
				if(d<=eps){
					//sound
					hide(balle.elt);
					clearInterval(animBalle);
					if(i == 0){
						score+=4;

						redimensionneC(score_contenair, (""+score).length*scoreWidth, score_contenair.height);//redimensionner avant d'ecrire
						draw_score(score_contenair.getContext('2d'), score_contenair.width, score_contenair.height, score);
						positionne(score_contenair, ecran_width/2 - (""+score).length*scoreWidth/2, 15);

						for (var j = 1; j < canons.length; j++) {
							hide(canons[j].elt); 
						}
						canon3 = canons[2];
						canons[2] = canons[0];
						canons[0] = canon3;
						zonesDePlacement = [];
						zonesDePlacement.push([0, canons[2].x - canonWidth], [canons[2].x + canonWidth, ecran_width - canonWidth]);
						translateCanon(2, 2*deltaTranslationCanon, espaceAvantCanon + 2*espace, 15);
						
						var k = randint(0,1);

						for (var j = 0; j < nbCanons-1; j++) {
							x = randint(zonesDePlacement[Math.abs(k - j)][0], zonesDePlacement[Math.abs(k - j)][1]);
							if(x<=ecran_height - canonWidth && x>=0){
								canons[j].x = x
							}
							else{
								canons[j].x = randint(0, ecran_width - canonWidth);
							}
							canons[j].y = espaceAvantCanon + j*espace;
							positionne(canons[j].elt, canons[j].x, canons[j].y);
							//hide(canons[j].elt);
						}
						rotationCanon(0, -angleGlobal );
						shake(score_contenair, 50);

					}
					else{
						//sound
						score+=1;

						redimensionneC(score_contenair, (""+score).length*scoreWidth, score_contenair.height);//redimensionner avant d'ecrire
						draw_score(score_contenair.getContext('2d'), score_contenair.width, score_contenair.height, score);
						positionne(score_contenair, ecran_width/2 - (""+score).length*scoreWidth/2, 15);

						hide(canons[2].elt);
						canon3 = canons[2];
						canons[2] = canons[1];
						canons[1] = canons[0];
						canons[0] = canon3;
						zonesDePlacement = [];
						zonesDePlacement.push([0, canons[1].x - canonWidth], [canons[1].x + canonWidth, ecran_width - canonWidth]);

						translateCanon(2, deltaTranslationCanon, espaceAvantCanon +  2*espace , 15);
						translateCanon(1, deltaTranslationCanon, espaceAvantCanon +  espace, 15);

						//canonsCoords[2][0] = canonsCoords[1][0];
						//canonsCoords[1][0] = canonsCoords[0][0];
						
						var k = randint(0,1);
						x = randint(zonesDePlacement[k][0], zonesDePlacement[k][1]);
						if(x <= ecran_width - canonWidth && x>=0){
							canons[0].x = x;
						}
						else{
							canons[0].x = randint(0, ecran_width - canonWidth);
						}
						canons[0].y = espaceAvantCanon;
						rotationCanon(0, -angleGlobal);
						positionne(canons[0].elt, canons[0].x, canons[0].y);
						//hide(canons[0].elt);

					}

					canons[nbCanons-1].elt.onclick = function(){
						if(peutCliquer){
							peutCliquer = false;
							clearInterval(animRotation[0]);
							animRotation.splice(0, 1);
							translateBalle(deltaBalle, eps,vitesseBalle);
							translate(canons[nbCanons-1].elt, getXY(canons[nbCanons-1].elt), 180 + angleGlobal, 2, 10, 10);
						
						}
					}

					particules([balle.x  , balle.y], [10, 10], [10, 10], 5, 70, angleGlobal - 90, angleGlobal +90, 0, draw_aleatoire, 30 );

					for (var i = 0; i < pieces.length; i++) {
						remove( pieces[i].elt );
					}
					pieces = [];

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

function redimensionneC(c, width , height){
	//donne width et height a l'element elt
	c.width = width;
	c.height = height;
}

function positionne(elt, x, y){
	elt.style.position = 'absolute';
	elt.style.top = y+"px";
	elt.style.left = x+"px";
}

function hide(elt){
	elt.style.display = 'none';
}

function cache(elt){
	elt.style.visibility = 'hidden';    
}

function cache(montre){
	elt.style.visibility = 'visible';
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
    return Math.floor(Math.random()*(Math.abs(max-min)+1)+min);
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
		translateParticule(particules[i], d, init, limite, dirmin, dirmax, retrecir ,v);
	}
}

function draw_aleatoire(ctx, w){
	ctx.beginPath();
	ctx.arc(w/2, w/2, w/2, 0, 2*Math.PI);
	ctx.fillStyle = "rgb("+255+","+55+","+155+")";
	ctx.fill();
}

function draw_piece(ctx, w){
	ctx.beginPath();
	ctx.globalAlpha = 0.6;
	ctx.drawImage(imgPiece, 0, 0, w, w);
}

function shake(elt , vitesse){
	translation(elt, -90, 15);
    setTimeout(function(){
        translation(elt, 90, 15);
    }, vitesse);

    setTimeout(function(){
        translation(elt, 90, 15);
    }, 2*vitesse);

    setTimeout(function(){
         translation(elt, -90, 15);
    }, 3*vitesse);
}

function shakeAll(vitesse){
    for(var i = 0; i < canons.length; i++){
        shake(canons[i].elt, vitesse);
    }
}


function randomColor(){
	return "rgb("+randint(0,255)+","+randint(0,255)+","+randint(0,255)+")";
}

function sign(a){
	return (a)/Math.abs(a);
}

setTimeout(function(){
	main();
}, 100);
