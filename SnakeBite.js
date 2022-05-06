"use strict";
var W, H, S = 20;
var snake = [], foods = [];
var keyCode = 0;
var point = 0;
var timer = NaN;
var ctx;

//Pointオブジェクト
function Point(x, y) {
	this.x = x;
	this.y = y;
}

//初期化変数
function init() {
	var canvas = document.getElementById('field');
	W = canvas.width / S;
	H = canvas.height / S;
	ctx = canvas.getContext('2d');
	ctx.font = "20px sans-serif";

	//ヘビの初期化
	snake.push(new Point(W / 2, H / 2));

	//餌の初期化
	for (var i = 0; i < 10; i++) {
		addFood();
	}

	timer = setInterval("tick()", 200);
	window.onkeydown = keydown;
}

//餌の追加
function addFood() {
	while (true) {
		var x = Math.floor(Math.random() * W);
		var y = Math.floor(Math.random() * H);
		if (isHit(foods, x, y) || isHit(snake, x, y)) {
			continue;
		}

		foods.push(new Point(x, y));
		break;
	}
}

//衝突判定
function isHit(data, x, y) {
	for (var i = 0; i < data.length; i++) {
		if (data[i].x == x && data[i].y == y) {
			return true;
		}
	}
	return false;
}

function moveFood(x, y) {
	foods = foods.filter(function (p) {
			return (p.x != x || p.y != y);
		});
	addFood();
}

function tick() {
	var x = snake[0].x;
	var y = snake[0].y;

	switch (keyCode) {

		//左
		case 37: x--; break;

		//上
		case 38: y--; break;

		//右
		case 39: x++; break;

		//下
		case 40: y++; break;

		default: paint(); return;
	}

	//自分or壁に衝突？
	if (isHit(snake, x, y) ||
		x < 0 ||
		x >= W ||
		y < 0 ||
		y >= H) {
			clearInterval(timer);
			paint();
			return;
	}

	//頭を先頭に追加
	snake.unshift(new Point(x, y));

	//餌を食べた
	if (isHit(foods, x, y)) {
		point += 10;
		moveFood(x, y);

	//食べてない→しっぽを削除
	} else {
		snake.pop();
	}

	paint();
}

function paint() {
	ctx.clearRect(0, 0, W * S, H * S);
	ctx.fillStyle = "rgb(256, 0, 0)";
	ctx.fillText(point, S, S * 2);
	ctx.fillStyle = "rgb(0, 0, 255)";
	foods.forEach(function (p) {
		ctx.fillText("+", p.x * S, (p.y + 1) * S);
	});
	snake.forEach(function (p) {
			ctx.fillText("*", p.x * S, (p.y + 1) * S);
	});
}

function keydown(event) {
	keyCode = event.keyCode;
}