var ecran_width = window.innerWidth;
var ecran_height = window.innerHeight;
var dataVersion = 12;
var soundActive = true;
//les songs
var click = new Audio('click.wav');

var quete = function(but, texte, type, limite, recompenseType, recompense, indice){
	/*
	type = "score", "scoreMax" 
	recompenseType = "balle", "pieces" , "canons"
	recompense = num de balle, nb de pieces, num du canon
	texte = texte a afficher en cas de succes 
	indice = 0,1,2 ... indice de la quete dans le storage
	*/
	this.but = but;
	this.texte = texte;
	this.type = type;
	this.limite = limite;
	this.recompense = recompense;
	this.recompenseType = recompenseType;
	this.indice = indice;
}

var quetesPendantJeu = []; //contient toutes les quetes déblocables pendant le jeu
var quetesGameOver = []; //quetes a verifier pendant le jeu

function menu(){

	init();

	var logo, logo_meilleur_score, meilleur_score, logo_bullets, bullets, play, options = [], bg;
	var play_width, logoWidth = 40;
	var bonusConnexion = 20;
	
	bg = document.getElementById('bg');
	redimensionne(bg, ecran_width, ecran_height);

	var ms = parseInt(localStorage.scoreMAx) ;

	//logo = document.getElementById('logo');
	logo_meilleur_score = document.getElementById('logo_meilleur_score');
	//meilleur_score = document.getElementById('meilleur_score');
	logo_bullets = document.getElementById('logo_bullets');
	//bullets = document.getElementById('bullets');
	play = document.getElementById('play');
	options.push(document.getElementById('sound_active_desactive'));
	options.push(document.getElementById('skins'));

	//redimentionner
	//redimensionne(logo, ecran_width, ecran_height/4);
	redimensionne(logo_meilleur_score, logoWidth, logoWidth);
	//redimensionne(meilleur_score, logoWidth, logoWidth);
	redimensionne(logo_bullets, logoWidth, logoWidth);
	//redimensionne(bullets, logoWidth, logoWidth);

	if(ecran_width/2 <=150){
		play_width = ecran_width/2
	}
	else{
		play_width = 300;
	}
	redimensionne(play, play_width, play_width/3);
	for (var i = 0; i < options.length; i++) {
		redimensionne(options[i], 50, 50);
	}

	positionne(play,ecran_width/2-getWidth(play)/2, ecran_height/2);
	positionne(options[0], ecran_width/2 - 50 - options[0].width  , ecran_height - 150);
	positionne(options[1], ecran_width/2 + 50, ecran_height - 150);	
	positionne(logo_meilleur_score, 0, 3);
	//positionne(meilleur_score, logoWidth, 3);
	positionne(logo_bullets, ecran_width - logoWidth - 30, 3);
	//positionne(bullets, ecran_width - logoWidth - 10, 3);

	//recompenser le joueur d'une connexion quotidienne TODO
	if(new Date() - new Date(localStorage.lastTime) > 24*60*1000 ){
		localStorage.bullets = ""+(parseInt(localStorage.bullets) + bonusConnexion);
		localStorage.lastTime = ""+(new Date());
	}

	//afficher les pieces et le meilleur score 
	//draw_score(meilleur_score.getContext('2d'), meilleur_score.width, meilleur_score.height, ms);
	//draw_score(bullets.getContext('2d'), meilleur_score.width, meilleur_score.height, parseInt(localStorage.bullets));
	
	//write("hello world 1", 50, ecran_width, ecran_height/2, 0 );

	//afficher les scores
	//les chiffres et lettres 
	var alphabet = new Image();
	alphabet.src = 'ui.png';
	alphabet.onload = function(){
		var pointsMax = write(alphabet, localStorage.scoreMAx, 20, 100, 50, 0 );
		var pieces = write(alphabet, localStorage.bullets, 20, 20*localStorage.bullets.length, 50, 0 );

		positionne(pointsMax, 0, 50);
		positionne(pieces, ecran_width - pieces.width-20, 50);
	}
	
	
}

function gameOver(bool){
	var itemsWidth = ecran_width/5;
	var y_items = 3*ecran_height/4 - itemsWidth;
	var alert;
	var bullets = parseInt(localStorage.bullets);
	if(bool){
		alert = createImage('go.gif', ecran_width, ecran_height/2, ecran_width, ecran_height/2);
		positionne(alert, 0, -ecran_height/4);
	}
	else{
		alert = createImage('go.png', ecran_width, ecran_height/2, ecran_width, ecran_height/2);
		positionne(alert, 0, -ecran_height/4);
	}

	var items = [];
	items.push(create_element('null', itemsWidth, itemsWidth, ecran_width/2 - 2*itemsWidth, y_items));
	items.push(create_element('null', itemsWidth, itemsWidth, ecran_width/2 - itemsWidth/2, y_items));
	items.push(create_element('null', itemsWidth, itemsWidth, ecran_width/2 + itemsWidth, y_items));

	var imgs = [new Image(), new Image(), new Image()];
	imgs[0].src = "home.png";
	imgs[1].src = "restart.png";
	imgs[2].src = "revive.png";

	//faire apparaitre alert
	translateOut(alert, getXY(alert), 180, 25, ecran_height/2, 5);
	
	//affichage des boutons d'option

	imgs[2].onload = function(){
		fillImage(items[2], imgs[2]);
	}
	imgs[1].onload = function(){
		fillImage(items[1], imgs[1]);
	}
	imgs[0].onload = function(){
		fillImage(items[0], imgs[0]);
	}

	items[0].onclick = function(){
		localStorage.pointsInitiaux = "0";
		location.href = "menu.html";
	}
	items[1].onclick = function(){
		localStorage.pointsInitiaux = "0";
		window.location.reload();
	}
	items[2].onclick = function(){

		if(bullets > 50){
			localStorage.bullets = ""+(bullets - 50);
			localStorage.pointsInitiaux = ""+score;
			location.href = "canons.html";
		}
		else{
			shake(items[2], 40);
		}
	}

	localStorage.distanceTotale = ""+(parseInt(localStorage.distanceTotale) + score);


	//TODO 
}


function skinsMenu(){
	init();
	var newSkin = document.getElementById('newSkin'), skinsBalises = [], skinsBackgrounds = [];
	positionne(newSkin, ecran_height/4 + 25, ecran_width/2 - 50);

	var bullets = parseInt(localStorage.bullets), skins = localStorage.skins.split(",").map(Number), skinSelected = 0;
	var skinsContainers = [];
	var unite = ecran_width/5, delta = 25, width = unite - delta;
	var y0 = ecran_height/4 + 100, x0 = 0;
	var x = x0, y = y0;
	var j = 0, times = 0;
	var logoWidth = 50, logo_bullets, blts;

	if(localStorage.skinSelected){
		skinSelected = parseInt(localStorage.skinSelected);
	}
	positionne(newSkin, ecran_width/2-125, ecran_height/4);

	skins[0] = 1;


	function clickSkin(indice){
		if(skins[indice] == 1){
			//on peut choisir le skin
			setImage(skinsBackgrounds[skinSelected], "ballContainer0btained.png");
			skinSelected = indice+"";
			localStorage.skinSelected = skinSelected;	
			setImage(skinsBackgrounds[skinSelected], "ballContainerSelected.png");
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
		if(bullets >= requiredBUllets && idispo != []){
			indice = idispo[randint(0, idispo.length - 1)];
			bullets -= requiredBUllets;
			localStorage.bullets = ""+bullets;
			draw_score(blts.getContext('2d'), blts.width, blts.height, bullets);
			skins[indice] = 1;
			localStorage.setItem('skins', skins);
			devoileSkin(indice);
		}
	}

	function drawSkin(id, x, y){

		var imgSkin;
		var background;	
			if(skins[id] == 1){
				background = createImage("ballContainer0btained.png", unite, unite);
				imgSkin = createImage("ball"+id+".png", width, width);	
			}
			else{
				background = createImage("ballContainer.png", unite, unite);
				imgSkin = createImage("ball10.png", width, width);
			}
			imgSkin.onclick = function(){
					clickSkin(id);
			}
			positionne(background, x, y);
			positionne(imgSkin, delta/2+x, 5+y);
			skinsBackgrounds.push(background);
			skinsBalises.push(imgSkin);
	
	}

	function devoileSkin(id){
		setImage(skinsBackgrounds[id], "ballContainer0btained.png", unite, unite);
		setImage(skinsBalises[id], "ball"+id+".png");
		skins[id] = 1;
	}

	for (var i = 0; i < skins.length; i++) {
		//skinsContainers.push(create_element('null', unite, unite, x, y));

		//affichage de l'image des balles
		drawSkin(i, x, y); 

		//varier la position
		x += unite;
		if(x-x0>4*unite){
			x = x0;
			y += unite;
		}
		j++;
	}

	setImage(skinsBackgrounds[skinSelected], "ballContainerSelected.png", unite, unite);

	//affichage de l'argent
	logo_bullets = document.getElementById('logo_bullets');
	blts = document.getElementById('bullets');
	redimensionne(logo_bullets, logoWidth, logoWidth);
	redimensionne(blts, logoWidth, logoWidth);
	positionne(logo_bullets, ecran_width/2 - logoWidth - 5, 3);
	positionne(blts, ecran_width/2 + 5, 3);
	draw_score(blts.getContext('2d'), blts.width, blts.height, parseInt(localStorage.bullets));


	newSkin.addEventListener('click', function(){newS(100);});
	//TODO
}



function init(){
	//charge toutes les variables d'environement du joueur, 
	//ie skin, background et scoreMAx
	//initialise le storage si pas encore initialisé
	/*if(localStorage.dataVersion != dataVersion){
		resetStorage();
	} */
	if(!localStorage.scoreMAx){
		localStorage.setItem('scoreMAx', 0);
		localStorage.setItem('skins', [0,0,0,0,0,0,0,0,0,0]);
		localStorage.setItem('bg', [0,0,0,0,0,0,0,0,0,0]);
		localStorage.setItem('skinSelected', 0);
		localStorage.setItem('bgSelected', 0);
		localStorage.setItem('pointsInitiaux', 0);
	}
	if(!localStorage.bullets){
		localStorage.setItem('bullets', 100);
	}
	if(!localStorage.dataVersion){
		localStorage.setItem("dataVersion", dataVersion)
	}
	if(!localStorage.lastTime){
		localStorage.setItem('lastTime', (new Date())+"");
	}
	if(!localStorage.distanceTotale){
		localStorage.setItem('distanceTotale', 0);
		localStorage.setItem('nbFOisReessayer', 0);
		localStorage.setItem('nbBallesJoue', 0);
		localStorage.setItem('likeFacebook', 0);
		localStorage.setItem('rate', 0);
		localStorage.setItem('limitesQuetes', [10,10,2,10,50]);
		localStorage.setItem('recompensesPieces', [50,50,50,50,50]);
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
	ctx.fillStyle = "#EEEEEE";
	ctx.font="150px Arial";
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
	localStorage.removeItem('lastTime');
	localStorage.removeItem('pointsInitiaux');
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

function createImage(image, w, h){
	var body = document.getElementsByTagName("body")[0];
    var c = document.createElement('img');
    c.width = w;
    c.height = h;
    c.src  =image;
    body.appendChild(c);
    return c;
}

function setImage(elt, img){
	elt.src = img;
}

function getDs(lettre){
	if(lettre == '1'){ return [128*2, 128*4]; }
	if(lettre == '2'){ return [128*3, 128*4];}
	if(lettre == '3'){ return [128*4, 128*4];}
	if(lettre == '4'){ return [128*5, 128*4];}
	if(lettre == '5'){ return [0, 128*5];}	
	if(lettre == '6'){ return [128*1, 128*5];}
	if(lettre == '7'){ return [128*2, 128*5];}
	if(lettre == '8'){ return [128*3, 128*5];}
	if(lettre == '9'){ return [128*4, 128*5];}
	if(lettre == ' '){ return [128*5, 128*5];}
	if(lettre == '0'){ return [128*2, 128*2];}

	var letterPos =lettre.toUpperCase().charCodeAt(0) - 65;
	var i = letterPos % 6 , j = parseInt(letterPos/6);
	console.log("i="+i+" j="+j);
	return [128*i , 128*j] ;


}

function write(ui, texte, tailleCaractere, width, y , style){
	// TODO
	//prends un texte et l'affiche avec la police pixel art
	//retourne le canvas dans lequel on a écrit
	var contenair = create_element('null', width, tailleCaractere , 0, y );
	var x = 0, 
		ds = [], 
		ctx = contenair.getContext('2d') ;
	for (var i = 0; i < texte.length; i++) {
		ds = getDs(texte[i]); // prendre les valeurs de dsx et dsy
		ctx.drawImage(ui, ds[0], ds[1], 128, 128, i*tailleCaractere, 0, tailleCaractere, tailleCaractere);
	}

	return contenair;
	
}

function writeIn(ui, ctx, texte, tailleCaractere, style){
	// TODO
	//prends un texte et l'affiche avec la police pixel art
	//retourne le canvas dans lequel on a écrit
	var x = 0, 
		ds = [];
	for (var i = 0; i < texte.length; i++) {
		ds = getDs(texte[i]); // prendre les valeurs de dsx et dsy
		ctx.drawImage(ui, ds[0], ds[1], 128, 128, i*tailleCaractere, 0, tailleCaractere, tailleCaractere);
	}
}

function disparitionEphemere(c, vitesse){
	c.style.opacity = "1";
	var anim=setInterval(function(){
		c.style.opacity = ""+(parseFloat(c.style.opacity)-0.1)
		if(parseFloat(c.style.opacity) <= 0){
			clearInterval(anim);
		}
	},vitesse);
}

function checkQuete(quetes, ui){
	/* prends une liste de quetes et check si les quetes sont réussis. si
       oui afficher le texte de quete réussie et attribuer la récompense */
    var scoreMAx = parseInt(localStorage.scoreMAx);
    var message;
    var time = 100;
    var quete;
    var bullets = parseInt(localStorage.bullets);
    for (var i = 0; i < quetes.length; i++) {
    	quete = quetes[i];
    	//TODO ajouter de nouvelles quetes
    	if(quete.type == "depasseMax"){
    		if(score > scoreMAx){ // se dépasser
    			//afficher le message de succès
    			message = write(ui, quetes.texte, 50, quete.texte.length*50, ecran_height/8, 1);
    			positionne(message, ecran_width/2 - message.width/2, message.height);
    			disparitionEphemere(message, time);
    			//recompenser
    			localStorage.bullets = ""+(bullets + quete.recompense);
    			time += time;
    		}
    	}
    	else if(quete.type == "balle"){
    		//TODO
    	}
    	else{
    		if(parseInt(localStorage.getItem(quete.type)) > quete.limite)
    		{
    			//ici on a franchi la limite
    			//afficher le message de succès
    			message = write(ui, quetes.texte, 50, quete.texte.length*50, ecran_height/8, 1);
    			positionne(message, ecran_width/2 - message.width/2, message.height);
    			disparitionEphemere(message, time)
    			//recompenser
    			localStorage.bullets = ""+(bullets + quete.recompense);
    			//actualiser les limites et les recompenses
    			localStorage.limites[quete.indice] = ""+(parseInt(localStorage.limites[quete.indice]) + 50);
    			localStorage.recompenses[quete.indice] = ""+(parseInt(localStorage.recompenses[quete.indice]) + 50);
    			time += time;
    		}
    	}
    }

}


