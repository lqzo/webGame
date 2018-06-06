var imgData = new Array(
	{ name: "bg", path: "img/bg.png" },
	{ name: "wall", path: "img/ban.png" },
	{ name: "caibao", path: "img/caibao.png" },
	{ name: "key", path: "img/key.png" },
	{ name: "player", path: "img/player.png" },
	{ name: "pt", path: "img/pt.png" },
	{ name: "zidan", path: "img/zidan.png" },
	{ name: "jqpt", path: "img/jqpt.png" },
	{ name: "zhuzi", path: "img/zhuzi.png" },
	{ name: "button", path: "img/button.png" },
	{ name: "changban", path: "img/changban.png" }
);

var backLayer, cLayer, box1, button, changban, buttonIsClick = true,
	loadimg, imglist, zidan, keywhat, changbanspeed = 10;
//程序所用到的数组
var showlist = new Array(), keyArray = new Array(), floorArray = new Array(),
	paotaiArray = new Array(), zidanArray = new Array();
//人物四方向的速度
var leftspeend = -5, rightspeend = 5, topspeend = -5, buttomspeend = 5;
var pt, jqpt, jqptRotate = 0, zdx, zdy, speed = 10, btntimer;
var gameovertext, gamewintext;
var caibaiLocal = [
	[1100, 495],
	[50, 50],
	[380, 680]
], randomnum;

window.onload = function () {
	init(50, "canvas", 900, 600, main);
}

function main() {
	LGlobal.box2d = new LBox2d();
	backLayer = new LSprite();
	addChild(backLayer);
	backLayer.addEventListener(LEvent.ENTER_FRAME, onfram);
	LGlobal.stage.addEventListener(LKeyboardEvent.KEY_DOWN, down);
	LGlobal.stage.addEventListener(LKeyboardEvent.KEY_UP, up);
	loadimg = new LoadingSample3();
	backLayer.addChild(loadimg);
	LLoadManage.load(
		imgData,
		function (progress) {
			loadimg.setProgress(progress);
		},
		function (result) {
			imglist = result;
			backLayer.removeChild(loadimg);
			loadimg = null;
			gameInit();
		}
	);
}

//游戏初始化
function gameInit() {
	showlist.push(new LBitmapData(imglist["bg"]));
	backLayer.addChild(new LBitmap(showlist[0]));
	randomnum = Math.floor(Math.random() * 3);
	playerInit();
	changbanInit();
	zhuziInit();
	buttonInit();
	keyInit();
	banInit();
	paitaiInt();
	zidanInit();
	jqptInit();
}

//竹子陷阱方法
function zhuziInit() {
	zhuzi = new LSprite();
	zhuzi.x = 975;
	zhuzi.y = 25;
	var img = new LBitmap(new LBitmapData(imglist["zhuzi"]));
	zhuzi.addChild(img);
	backLayer.addChild(zhuzi);
	var updownTimer = new LTimer(20, 0);
	updownTimer.addEventListener(LTimerEvent.TIMER, updown);
	updownTimer.start();
}

function playerInit() {
	box1 = new LSprite();
	box1.x = 50;
	box1.y = 790;
	var img = new LBitmapData(imglist["player"], 0, 0, 40, 40);
	var list = new LGlobal.divideCoordinate(120, 160, 4, 3);
	backLayer.addChild(box1);
	box1.setBodyMouseJoint(true);
	box1.addBodyPolygon(40, 40, 0, 0, 0.5, 0);
	playeranime = new LAnimation(box1, img, list);
	box1.addEventListener(LEvent.ENTER_FRAME, playerAnime);
}

//机关初始化
function changbanInit() {
	changban = new LSprite();
	changban.x = 966;
	changban.y = 623;
	var img = new LBitmap(new LBitmapData(imglist["changban"]));
	changban.addChild(img);
	backLayer.addChild(changban);
}

//机关按钮初始化
function buttonInit() {
	button = new LSprite();
	button.x = 800;
	button.y = 770;
	var img = new LBitmap(new LBitmapData(imglist["button"]));
	button.addChild(img);
	backLayer.addChild(button);
}

//墙壁初始化
function banInit() {
	//四周墙壁
	for (var j = 0; j < 2; j++) {
		for (var i = 0; i < 24; i++) {
			newFloor(52 * i, 840 * j);
		}
	}
	for (var j = 0; j < 2; j++) {
		for (var i = 0; i < 18; i++) {
			newFloor(1200 * j, 48 * i);
		}
	}

	for (var i = 0; i < 3; i++) {
		newFloor(52 * (i + 1), 695);
	}

	for (var i = 0; i < 3; i++) {
		newFloor(52 * (i + 1), 743);
	}
	for (var i = 0; i < 8; i++) {
		newFloor(312, 456 + 48 * i);
	}
	for (var i = 0; i < 4; i++) {
		newFloor(312 + 52 * i, 600);
	}
	for (var i = 0; i < 2; i++) {
		newFloor(468, 648 + 48 * i);
	}
	for (var i = 0; i < 2; i++) {
		newFloor(652, 700 + 48 * i);
	}
	for (var i = 0; i < 3; i++) {
		newFloor(600 + 52 * i, 796);
	}
	for (var i = 0; i < 3; i++) {
		newFloor(1044 + 52 * i, 600);
	}
	for (var i = 0; i < 4; i++) {
		newFloor(852, 652 + 48 * i);
	}
	for (var i = 0; i < 3; i++) {
		newFloor(748 + 52 * i, 604);
	}
	for (var i = 0; i < 6; i++) {
		newFloor(992, 360 + 48 * i);
	}
	for (var i = 0; i < 3; i++) {
		newFloor(836 + 52 * i, 408);
	}
	for (var i = 0; i < 3; i++) {
		newFloor(836 + 52 * i, 456);
	}
	for (var i = 0; i < 5; i++) {
		newFloor(52 + 52 * i, 300);
	}
	for (var i = 0; i < 3; i++) {
		newFloor(312, 248 + 48 * i);
	}
	for (var i = 0; i < 5; i++) {
		newFloor(652, 100 + 48 * i);
	}
	for (var i = 0; i < 5; i++) {
		newFloor(548 + 52 * i, 204);
	}
	for (var i = 0; i < 2; i++) {
		newFloor(1096 + i * 52, 443);
	}
	
}

//宝箱初始化
function doorInit() {
	door = new LSprite();
	door.x = caibaiLocal[randomnum][0];
	door.y = caibaiLocal[randomnum][1];
	var img = new LBitmap(new LBitmapData(imglist["caibao"]));
	door.addChild(img);
	backLayer.addChild(door);
}

//钥匙初始化
function keyInit() {
	newKey(60, 260);
	newKey(380, 680);
	newKey(1130, 800);
}

//炮台初始化
function paitaiInt() {
	newPaotia(10, 600, 0);
	newPaotia(10, 450, 0);
	newPaotia(150, 300, 90);
	newPaotia(270, 300, 90);
	newPaotia(10, 180, 0);
	newPaotia(325, 10, 90);
	newPaotia(530, 195, 270);
	newPaotia(740, 195, 270);
}

//子弹初始化
function zidanInit() {
	newZidan(55, 609, 60, false);
	newZidan(55, 459, 20, false);
	newZidan(55, 189, 20, false);
	newZidan(130, 350, 40, true);
	newZidan(250, 350, 30, true);
	newZidan(300, 60, 600, true);
	newZidan(539, 135, 30, true);
	newZidan(749, 135, 600, true);
	var timer = new LTimer(30, 0);
	timer.addEventListener(LTimerEvent.TIMER, noVertical);
	timer.start();
}

//加强炮台初始化
function jqptInit() {

	var zdSpeedx = Math.floor(5 - Math.random() * 10);
	var zdSpeedy = Math.floor(5 - Math.random() * 10);
	zdx = zdSpeedx;
	zdy = zdSpeedy;

	jqptzd1 = new LSprite();
	var zdImg = new LBitmap(new LBitmapData(imglist["zidan"]));
	jqptzd1.x = 593;
	jqptzd1.y = 443;
	jqptzd1.addChild(zdImg);
	backLayer.addChild(jqptzd1);

	jqptzd2 = new LSprite();
	var zdImg2 = new LBitmap(new LBitmapData(imglist["zidan"]));
	jqptzd2.x = 593;
	jqptzd2.y = 443;
	jqptzd2.addChild(zdImg2);
	backLayer.addChild(jqptzd2);

	jqptzd3 = new LSprite();
	var zdImg3 = new LBitmap(new LBitmapData(imglist["zidan"]));
	jqptzd3.x = 593;
	jqptzd3.y = 443;
	jqptzd3.addChild(zdImg3);
	backLayer.addChild(jqptzd3);

	jqptzd4 = new LSprite();
	var zdImg4 = new LBitmap(new LBitmapData(imglist["zidan"]));
	jqptzd4.x = 593;
	jqptzd4.y = 443;
	jqptzd4.addChild(zdImg4);
	backLayer.addChild(jqptzd4);

	zidanArray.push(jqptzd1);
	zidanArray.push(jqptzd2);
	zidanArray.push(jqptzd3);
	zidanArray.push(jqptzd4);
	jqpt = new LSprite();
	jqpt.x = 550;
	jqpt.y = 400;
	var img = new LBitmap(new LBitmapData(imglist["jqpt"]));
	jqpt.addChild(img);
	jqpt.addBodyCircle(50, 50, 50, 0, 0, 0, 0);
	backLayer.addChild(jqpt);

	var timer = new LTimer(20, 0);
	timer.addEventListener(LTimerEvent.TIMER, rotate);
	timer.start();

	var zdtimer = new LTimer(40, 0);
	zdtimer.addEventListener(LTimerEvent.TIMER, jqptzd1Anim);
	zdtimer.start();
}

/*-----------------------------
初始化中用到的方法
------------------------------- */

//竹子动画
function updown() {
	zhuzi.y += speed;
	if (zhuzi.y >= 250) {
		speed = -speed;
	}
	if (zhuzi.y <= 25) {
		speed = -speed;
	}
}

//按键事件
function down(ev) {
	if (ev.keyCode == 37) {
		keywhat = "left";
	}
	if (ev.keyCode == 39) {
		keywhat = "right";
	}
	if (ev.keyCode == 38) {
		keywhat = "top";
	}
	if (ev.keyCode == 40) {
		keywhat = "buttom";
	}
}
function up() {
	keywhat = "";
}

function rotate() {
	jqptRotate += 45;
	if (jqptRotate > 360) {
		jqptRotate = 45;
	}
	jqpt.setRotate(jqptRotate);
}

//旋转炮台动画
function jqptzd1Anim() {

	jqptzd1.x += zdx;
	jqptzd1.y += 10;
	jqptzd2.x += zdx;
	jqptzd2.y -= 10;

	jqptzd3.x += 10;
	jqptzd3.y += zdy;
	jqptzd4.x -= 10;
	jqptzd4.y += zdy;

	for (var i = 0; i < floorArray.length; i++) {
		if (jqptzd1.hitTestObject(floorArray[i]) || jqptzd2.hitTestObject(floorArray[i])) {
			jqptzd1.x = 593;
			jqptzd1.y = 443;
			jqptzd2.x = 593;
			jqptzd2.y = 443;
			zdx = Math.floor(5 - Math.random() * 10);
		}
		if (jqptzd3.hitTestObject(floorArray[i]) || jqptzd4.hitTestObject(floorArray[i])) {
			jqptzd3.x = 593;
			jqptzd3.y = 443;
			jqptzd4.x = 593;
			jqptzd4.y = 443;
			zdy = Math.floor(5 - Math.random() * 10);
		}
	}
}
//创建子弹
function newZidan(x, y) {
	zidan = new LSprite();
	zidan.x = x;
	zidan.y = y;
	var img = new LBitmap(new LBitmapData(imglist["zidan"]));
	zidan.addChild(img);
	backLayer.addChild(zidan);
	zidanArray.push(zidan);
}
//子弹动画
function noVertical() {
	for (var i = 0; i < 8; i++) {
		if (i < 3) {
			zidanArray[i].x += 7;
			for (var j = 0; j < floorArray.length; j++) {
				if (zidanArray[i].hitTestObject(floorArray[j])) {
					zidanArray[i].x = 55;
				}
			}
		} else {
			if (i > 5) {
				zidanArray[i].y -= 4;
			} else if (i == 5) {
				zidanArray[i].y += 4;
			} else {
				zidanArray[i].y += 5;
			}
			for (var j = 0; j < floorArray.length; j++) {
				if (zidanArray[i].hitTestObject(floorArray[j])) {
					if (i > 5) {
						zidanArray[i].y = 135;
					} else if (i == 5) {
						zidanArray[i].y = 60;
					} else {
						zidanArray[i].y = 350;
					}
				}
			}
		}
	}
}

//创建炮台
function newPaotia(x, y, isrotate) {
	pt = new LSprite();
	pt.x = x;
	pt.y = y;
	var img = new LBitmap(new LBitmapData(imglist["pt"]));
	pt.addChild(img);
	if (isrotate == 90) {
		pt.setRotate(90);
	} else if (isrotate == 180) {
		pt.setRotate(180);
	} else if (isrotate == 270) {
		pt.setRotate(270);
	}
	backLayer.addChild(pt);
	paotaiArray.push(pt);
}

//创建钥匙
function newKey(x, y) {
	key = new LSprite();
	key.x = x;
	key.y = y;
	key.name = "key";
	var img = new LBitmap(new LBitmapData(imglist["key"]));
	key.addChild(img);
	backLayer.addChild(key);
	key.addBodyPolygon(img.getWidth(), img.getHeight(), 0, 0, 0, 0);
	keyArray.push(key);
}

//创建墙壁
function newFloor(x, y) {
	var img = new LBitmap(new LBitmapData(imglist["wall"]));
	floor1 = new LSprite();
	floor1.x = x;
	floor1.y = y;
	floor1.addChild(img);
	backLayer.addChild(floor1);
	floor1.addBodyPolygon(img.getWidth(), img.getHeight(), 0, 0, 0, 0);
	floorArray.push(floor1);
}

//机关动画
function close() {
	changban.y -= changbanspeed;
	if (changban.y <= 350) {
		changbanspeed = 0;
		btntimer.stop();
	}
}

//左右判定
function leftorRight(leftorright) {
	if (box1.hitTestObject(changban)) {
		rightspeend = 0;
	}
	if (box1.hitTestObject(button)) {
		if (buttonIsClick) {
			button.x += 15;
			button.scaleX = 0.5;
			rightspeend = 0;
			buttonIsClick = false;
			btntimer = new LTimer(20, 0);
			btntimer.addEventListener(LTimerEvent.TIMER, close);
			btntimer.start();
		}
	}

	for (var i = 0; i < floorArray.length; i++) {
		if (box1.hitTestObject(floorArray[i])) {
			if (leftorright == "left") {
				leftspeend = 0;
			} else if (leftorright == "right") {
				rightspeend = 0;
			}
		}
		if (leftorright == "left") {
			rightspeend = 5;
			topspeend = -5;
			buttomspeend = 5;
		} else if (leftorright == "right") {
			leftspeend = -5;
			topspeend = -5;
			buttomspeend = 5;
		}
	}
}

//上下判定
function topOrButtom(toporbuttom) {
	for (var i = 0; i < floorArray.length; i++) {
		if (box1.hitTestObject(floorArray[i])) {
			if (toporbuttom == "top") {
				topspeend = 0;
			} else if (toporbuttom == "buttom") {
				buttomspeend = 0;
			}
		}
		if (toporbuttom == "top") {
			buttomspeend = 7;
			leftspeend = -7;
			rightspeend = 7;
		} else if (toporbuttom == "buttom") {
			topspeend = -7;
			leftspeend = -7;
			rightspeend = 7;
		}
	}
}

//人物动画
function playerAnime() {
	box1.setRotate(0);
	for (var i = 0; i < keyArray.length; i++) {
		if (box1.hitTestObject(keyArray[i])) {
			backLayer.removeChild(keyArray[i]);
		}
	}
	if (backLayer.getChildByName("key") == null) {
		doorInit();
		if (box1.hitTestObject(door)) {
			rightspeend = 0;
			gamewintext = new LTextField();
			gamewintext.text = "GAME　　WIN";
			gamewintext.x = 400;
			gamewintext.y = 400;
			gamewintext.size = 50;
			gamewintext.color = "red";
			gamewintext.weight = "bolder";
			backLayer.addChild(gamewintext);
			backLayer.removeChild(door);
			box1.removeAllEventListener();
		}
	}
	/*
	 * 角色死亡
	 * */
	for (var i = 0; i < zidanArray.length; i++) {
		if (box1.hitTestObject(zidanArray[i]) || box1.hitTestObject(zhuzi)) {
			gameovertext = new LTextField();
			gameovertext.text = "GAME　　OVER";
			gameovertext.x = 400;
			gameovertext.y = 400;
			gameovertext.size = 50;
			gameovertext.color = "red";
			gameovertext.weight = "bolder";
			backLayer.addChild(gameovertext);
			backLayer.removeChild(box1);
			box1.removeAllEventListener();
		}
	}

	if (keywhat != "" && keywhat == "left") {
		box1.x += leftspeend;
		playeranime.setAction(1);
		playeranime.onframe();
		leftorRight("left");
	}
	if (keywhat != "" && keywhat == "right") {
		box1.x += rightspeend;
		playeranime.setAction(2);
		playeranime.onframe();
		leftorRight("right");
	}
	if (keywhat != "" && keywhat == "top") {
		playeranime.setAction(3);
		playeranime.onframe();
		box1.y += topspeend;
		topOrButtom("top");
	}
	if (keywhat != "" && keywhat == "buttom") {
		playeranime.setAction(0);
		playeranime.onframe();
		box1.y += buttomspeend;
		topOrButtom("buttom");
	}
}

//场景移动
function onfram() {
	backLayer.x = LGlobal.width * 0.5 - box1.x;
	backLayer.y = LGlobal.height * 0.5 - box1.y;
	if (backLayer.x > 0) {
		backLayer.x = 0;
	} else if (backLayer.x < LGlobal.width - 1200) {
		backLayer.x = LGlobal.width - 1200;
	}
	if (backLayer.y > 0) {
		backLayer.y = 0;
	} else if (backLayer.y < LGlobal.height - 840) {
		backLayer.y = LGlobal.height - 840;
	}
	LGlobal.box2d.synchronous();
}