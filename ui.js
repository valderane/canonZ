var ecran_width = window.innerWidth;
var ecran_height = window.innerHeight;
var dataVersion = 1;

function menu(){

	init();

	var logo, logo_meilleur_score, meilleur_score, play, options = [], bg;
	var play_width;
	
	bg = document.getElementById('bg');
	redimensionne(bg, ecran_width, ecran_height);

	var ms = parseInt(localStorage.scoreMAx) ;

	//logo = document.getElementById('logo');
	logo_meilleur_score = document.getElementById('logo_meilleur_score');
	meilleur_score = document.getElementById('meilleur_score');
	play = document.getElementById('play');
	options.push(document.getElementById('sound_active_desactive'));
	options.push(document.getElementById('skins'));

	//redimentionner
	//redimensionne(logo, ecran_width, ecran_height/4);
	redimensionne(logo_meilleur_score, 50, 50);
	redimensionne(meilleur_score, 50, 50);

	if(ecran_width/2 <=150){
		play_width = ecran_width/2
	}
	else{
		play_width = 150;
	}
	redimensionne(play, play_width, play_width);
	for (var i = 0; i < options.length; i++) {
		redimensionne(options[i], 50, 50);
	}

	//positionne le logo
	//positionne(logo, ecran_width/2-getWidth(logo)/2, 0);
	positionne(play,ecran_width/2-getWidth(play)/2, ecran_height/2);
	positionne(options[0], ecran_width/2 - 50 - options[0].width  , ecran_height - 150);
	positionne(options[1], ecran_width/2 + 50, ecran_height - 150);
	//positionne(options[2], ecran_width/2 + 50 , ecran_height - 80);
	//positionne(options[3], ecran_width - getWidth(options[3]) - 20, ecran_height - 150);
	positionne(logo_meilleur_score, ecran_width/2 - getWidth(logo_meilleur_score) - 5, 3*ecran_height/8 - getHeight(logo_meilleur_score)/2);
	positionne(meilleur_score, ecran_width/2 + 5, 3*ecran_height/8 - getHeight(meilleur_score)/2);
	
	draw_score(meilleur_score.getContext('2d'), meilleur_score.width, meilleur_score.height, ms);
	//TODO  gere
	
	
}

function gameOver(){
	var y_items = 3*ecran_height/4 - 50;
	var alert = create_element('null', ecran_width, ecran_height/2, 0, ecran_height/4);
	var items = [];
	items.push(create_element('null', 50, 50, ecran_width/2 - 100, y_items));
	items.push(create_element('null', 50, 50, ecran_width/2 - 25, y_items));
	items.push(create_element('null', 50, 50, ecran_width/2 + 50, y_items));

	var imgs = [new Image(), new Image(), new Image()];
	imgs[0].src = "home.png";
	imgs[1].src = "restart.png";
	imgs[2].src = "piece.png";

	imgs[2].onload = function(){
		fillImage(items[0], imgs[0]);
		fillImage(items[1], imgs[1]);
		fillImage(items[2], imgs[2]);
	}

	imgs[0].onclick = function(){
		location.href = "menu.html";
	}
	imgs[1].onclick = function(){
		location.href = "canons.html";
	}
	imgs[2].onclick = function(){
		location.href = "canons.html";
	}


	//TODO 
}


function skinsMenu(){
	init();
	var newSkin = document.getElementById('newSkin');
	positionne(newSkin, ecran_height/4 + 25, ecran_width/2 - 50);

	var bullets = parseInt(localStorage.bullets), skins = localStorage.skins.split(",").map(Number), skinSelected = 0;
	var skinsContainers = [];
	var unite = ecran_width/5;
	var y0 = ecran_height/4 + 100, x0 = 0;
	var x = x0, y = y0;
	var j = 0, times = 0;

	skins[0] = 1;

	console.log(skins);

	function clickSkin(indice){
		if(skins[indice] == 1){
			//on peut choisir le skin
			skinSelected = indice+"";
			localStorage.skinSelected = skinSelected;			
		}

	}

	function newS(requiredBUllets){
		var idispo = [], indice = 0;
		for (var i = 0; i < skins.length; i++) {
			if(skins[i]==0){idispo.push(i)}
		}
		/*var popup = create_element('null', ecran_height/2, ecran_width, 0, ecran_height/4);
		var ballImage = create_element('null', ecran_height/4, ecran_height/4, 3*ecran_height/8, ecran_width/2 - ecran_height/4);
		var anim = setInterval(fun)*/
		if(bullets >= requiredBUllets){
			indice = idispo[randint(0, idispo.length - 1)];
			console.log(indice)
			bullets -= requiredBUllets;
			localStorage.bullets = ""+bullets;
			skins[indice] = 1;
			localStorage.setItem('skins', skins);
			drawSkin(indice);
		}
	}

	function drawSkin(id){
		if(skins[id] == 1){
			draw_aleatoire(skinsContainers[id].getContext('2d'), unite, "#AACCEE");
		}
		else{
			draw_aleatoire(skinsContainers[id].getContext('2d'), unite, "#FFFFFF");
		}
	
	}

	for (var i = 0; i < skins.length; i++) {
		skinsContainers.push(create_element('null', unite, unite, x, y));


		//affichage de l'image des balles
		drawSkin(i); 

		//varier la position
		x += unite;
		if(x-x0>4*unite){
			x = x0;
			y += unite;
		}
		j++;
	}

	newSkin.addEventListener('click', function(){newS(50);});
	//TODO
}



function init(){
	//charge toutes les variables d'environement du joueur, 
	//ie skin, background et scoreMAx
	//initialise le storage si pas encore initialisé
	if(localStorage.dataVersion != dataVersion){
		resetStorage();
	}
	if(!localStorage.scoreMAx){
		localStorage.setItem('scoreMAx', 0);
		localStorage.setItem('skins', [0,0,0,0,0,0,0,0,0,0]);
		localStorage.setItem('bg', [0,0,0,0,0,0,0,0,0,0]);
		localStorage.setItem('skinSelected', 0);
		localStorage.setItem('bgSelected', 0);
	}
	if(!localStorage.bullets){
		localStorage.setItem('bullets', 100);
	}
	if(!localStorage.dataVersion){
		localStorage.setItem("dataVersion", dataVersion)
	}
	
}




//fonctions de modulation de l'affichage
function positionne(elt, x, y){
	elt.style.position = 'absolute';
	elt.style.top = y+"px";
	elt.style.left = x+"px";
}

function redimensionne(elt, width , height){
	//donne width et height a l'element elt
	elt.style.width = width+"px";
	elt.style.height = height+"px";
}

function fill_carre(ctx){
	ctx.beginPath();
	ctx.fillStyle = 'red';
	ctx.fillRect(0, 0, 100, 100);

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

function getWidth(elt){
	return getValue(elt.style.width);
}

function getHeight(elt){
	return getValue(elt.style.height);
}

function create_element(nature, width, height, x, y){
	//width and height should be > 50
	var body = document.getElementsByTagName("body")[0];
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

function draw_aleatoire(ctx, w, color){
	ctx.beginPath();
	ctx.arc(w/2, w/2, w/3, 0, 2*Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
}

function draw_score(ctx, width, height, score){
	ctx.clearRect(0, 0, width, height);
	ctx.beginPath;
	ctx.textAlign = "center";
	ctx.fillStyle = "#000000";
	ctx.font="200px Arial";
	ctx.fillText(""+score, width/2, height);
}

function randint(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function resetStorage(){
	localStorage.removeItem('bullets');
	localStorage.removeItem('skins');
	localStorage.removeItem('scoreMAx');
	localStorage.removeItem('dataVersion');
}

function setImage(elt, img){
	elt.src = img;
}


function fillImage(elt, img ){
	var ctx = elt.getContext('2d');
	//ctx.clearRect(0, 0, elt.width, elt.height);
	ctx.beginPath();
	ctx.drawImage(img, 0, 0, elt.width, elt.height);
}
/*
function setAnimation(container, img , nbFrames, speed){
	var w = container.width, h = container.height;
	var i; 
	setInterval(function(){

	}, vitesse)
}

*/
