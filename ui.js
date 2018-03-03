var ecran_width = window.innerWidth;
var ecran_height = window.innerHeight;

function menu(){
	var logo, logo_meilleur_score, meilleur_score, play, options = [];
	var play_width;

	logo = document.getElementById('logo');
	logo_meilleur_score = document.getElementById('logo_meilleur_score');
	meilleur_score = document.getElementById('meilleur_score');
	play = document.getElementById('play');
	options.push(document.getElementById('sound_active_desactive'));
	options.push(document.getElementById('like'));
	options.push(document.getElementById('rate'));
	options.push(document.getElementById('skins'));

	//redimentionner
	redimensionne(logo, ecran_width, ecran_height/4);
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
	positionne(logo, ecran_width/2-getWidth(logo)/2, 0);
	positionne(play,ecran_width/2-getWidth(play)/2, ecran_height/2);
	positionne(options[0], 20, ecran_height - 150);
	positionne(options[1], ecran_width/2 - 50 - getWidth(options[2]) , ecran_height - 80);
	positionne(options[2], ecran_width/2 + 50 , ecran_height - 80);
	positionne(options[3], ecran_width - getWidth(options[3]) - 20, ecran_height - 150);
	positionne(logo_meilleur_score, ecran_width/2 - getWidth(logo_meilleur_score) - 50, 3*ecran_height/8 - getHeight(logo_meilleur_score)/2);
	positionne(meilleur_score, ecran_width/2 + getWidth(meilleur_score), 3*ecran_height/8 - getHeight(meilleur_score)/2);
	//TODO  mettre du contenu
	
	
}

function gameOver(){
	var y_items = 3*ecran_height/4 - 50;
	var alert = create_element('null', ecran_width, ecran_height/2, 0, ecran_height/4);
	var items = [];
	items.push(create_element('null', 50, 50, ecran_width/2 - 100, y_items));
	items.push(create_element('null', 50, 50, ecran_width/2 - 25, y_items));
	items.push(create_element('null', 50, 50, ecran_width/2 + 50, y_items));
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