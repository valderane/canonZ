var ecran_width = window.innerWidth;
var ecran_height = window.innerHeight;

var Fond = document.getElementById("fond");
var body = document.getElementsByTagName("body")[0];

function main(){
	var i = 0;
	var canon = create_element('canon', 80, 80, 50, 500);
	var canon2 = create_element('canon', 80, 80, 250, 350);
	var score = create_element('score', 80, 80, Fond.width/2 - 40, 15);
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
	ctx.fillStyle = "#BACADA";
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
	ctx.fillStyle = "#000000";
	ctx.font="50px Arial";
	ctx.fillText(""+score, width/2, height/2);
}

function rotation(c, angle){
	var ctx = c.getContext('2d');
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.translate(c.width/2, c.height/2);
	ctx.rotate(angle*Math.PI/180);
	ctx.translate(-c.width/2, -c.height/2);
	draw_canon(ctx, c.width, c.height);
}

function rotate(c, angle, vitesse){
	var anim = setInterval(function(){
		rotation(c, angle);
	}, vitesse);

	return anim
}

main();