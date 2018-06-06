window.onload = function(){
	var oTime = document.getElementById('time');
	var oLife = document.getElementById('life');
	var oGrade  = document.getElementById('grade');
	var oMsgBox = document.getElementById('msg_box');
	var oMsgTab = document.getElementById('msg_tab');
	var iLevl = 0;
	var oBtns = oMsgTab.tBodies[0].rows[0].getElementsByTagName('button');
	var levelArr = [{'tSec':3000,ySp:1},{'tSec':2500,ySp:2},{'tSec':2000,ySp:3},{'tSec':1500,ySp:4},{'tSec':1000,ySp:5}];
	var aChObj = {
		'0-20':'新手',
		'21-50':'菜鸟',
		'51-70':'高手',
		'71-100':'高高手',
		'101-300':'无敌了'
	};
	var iTimer = null;
	var iTimer2 = null;
	var allTarget = [];
	var isDie = false;
	var aTgt = [];
	var aZd = [];
	var iSeconds = 0;
	var iGrade = 0;
	var iLife = oLife.width();
	var oGun = document.getElementById('gun');
	var winWid = document.documentElement.clientWidth||document.body.clientWidth;
	var winHei = document.documentElement.clientHeight||document.body.clientHeight;
	var clearTmp = [];
	var maxl = winWid-48;
	var maxt = winHei-41;
	oGun.style.left = oGun.offsetLeft+'px';
	oGun.style.bottom = 0;
	oGun.style.position = 'absolute';
	for(var i=65;i<=90;i++){
		allTarget.push(i);
	}
	function construct(){
		for(var i=0;i<aTgt.length;i++){
			document.body.removeChild(aTgt[i].elm);
		}
		aTgt.length = 0;
		for(var i=0;i<aZd.length;i++){
			document.body.removeChild(aZd[i].elm);
		}
		aZd.length = 0;
		for(var i=0;i<clearTmp.length;i++){
			document.body.removeChild(clearTmp[i].elm);
		}
		clearTmp.length = 0;
		iSeconds = 0;
		iGrade = 0;
		iLife = 150;
		oGrade.innerHTML = 0;
		oLife.width(iLife);
		iLevl = 0;
	}
	function showMsg(msg){
		oMsgBox.style.display = 'block';
		oMsgBox.style.left = (winWid-oMsgBox.offsetWidth)/2+'px';
		oMsgBox.style.top = (winHei-oMsgBox.offsetHeight)/2+'px';
		oMsgTab.tHead.rows[0].cells[0].innerHTML = msg;
	}
	// 游戏开始
	var isFocus = false;
	var sTsMsg  ='开始游戏';
	window.onblur = function(){
		clearInterval(iTimer);
		clearInterval(iTimer2);
		sTsMsg  ='继续游戏';
		isFocus = false;
	}
	showMsg(sTsMsg);
	oBtns[0].onclick = function(){
		iTimer = setInterval(main,1000/60);
		iTimer2 = setInterval(addElms,3000);
		oMsgBox.style.display = 'none';
	}
	oBtns[1].onclick = function(){
		oMsgBox.style.display = 'none';
	}
	window.onfocus = function(){
		if(isFocus===false){
			isFocus = true;
			if(isDie){
				sTsMsg = '重新开始';
			}
			isDie = false;
			showMsg(sTsMsg);
			oBtns[0].onclick = function(){
				iTimer = setInterval(main,1000/60);
				iTimer2 = setInterval(addElms,3000);
				oMsgBox.style.display = 'none';
			}
			oBtns[1].onclick = function(){
				oMsgBox.style.display = 'none';
			}
		}else{
			isFocus = true;
		}
	}
	onkeydown = function(ev){
		var oEvent = ev||event;
		for(var i=0;i<aTgt.length;i++){
			if(aTgt[i]['code']==oEvent.keyCode){
				var newElmx = document.createElement('div');
				newElmx.className = 'zidan';
				newElmx.style.left = oGun.left()+20+'px';
				newElmx.style.top = oGun.offsetTop+'px';
				document.body.appendChild(newElmx);
				aZd.push({
					'l':oGun.left(),
					't':oGun.top(),
					'elm':newElmx,
					'index':i
				});
				break;
			}
		}
	}
	function impactCheck(obj1,obj2){
		var l1 = obj1.offsetLeft;
		var t1 = obj1.offsetTop;
		var r1 = l1+obj1.offsetWidth;
		var b1 = t1+obj1.offsetHeight;

		var l2 = obj2.offsetLeft;
		var t2 = obj2.offsetTop;
		var r2 = l2+obj2.offsetWidth;
		var b2 = t2+obj2.offsetHeight;
		if(l1>r2 || t1>b2 || r1<l2 || b1<t2){
			return false;
		}else{
			return true;
		}
	}
	// 将秒转化为字符串
	function secToStr(seconds){
		var iMu = seconds/3600;
		var iSec = (seconds%3600)/60;
		var iHm = (seconds%3600)%60;
		iMu = iMu>=10?parseInt(iMu):'0'+parseInt(iMu);
		iSec = iSec>=10?parseInt(iSec):'0'+parseInt(iSec);
		iHm = iHm>=10?parseInt(iHm):'0'+parseInt(iHm);
		return iMu+'：'+iSec+'：'+iHm;
	}
	// 所用时间
	function main(){
		iSeconds++;
		var timeStr = secToStr(iSeconds);
		oTime.innerHTML = timeStr;
		// 目标运动
		for(var i=0;i<aTgt.length;i++){
			aTgt[i].l += aTgt[i].xSp;
			aTgt[i].t += aTgt[i].ySp;
			if(aTgt[i].l<0){
				aTgt[i].l = 0;
				aTgt[i].xSp = -aTgt[i].xSp;
			}else if(aTgt[i].l>maxl){
				aTgt[i].l = maxl;
				aTgt[i].xSp = -aTgt[i].xSp;
			}
			if(aTgt[i].t>maxt){
				aTgt[i].t = maxt;
			}
			aTgt[i].elm.left(aTgt[i].l);
			aTgt[i].elm.top(aTgt[i].t);
			if(aTgt[i].t>=maxt){
				// 如果炮弹还没有打中，则销毁炮弹
				for(var j=0;j<aZd.length;j++){
					if(aZd[j]['index'] == i){
						document.body.removeChild(aZd[j].elm);
						aZd.splice(j,1);
						break;
					}
				}
				clearTmp.push({
					'elm':aTgt[i].elm,
					'iNow':1,
					'type':1
				});
				aTgt.splice(i,1);
				i--;
			}
		}
		var isNext = false;
		// 炮弹运动
		for(var i=0;i<aZd.length;i++){
			
			for(var j=0;j<aTgt.length;j++){
				isNext = false;
				if(impactCheck(aZd[i].elm,aTgt[j].elm) && aZd[i]['index']==j){
					clearTmp.push({
						'elm':aTgt[j].elm,
						'iNow':1								
					});
					aTgt.splice(j,1);
					isNext = true;
					j--;
					break;
				}
			}
			
			if(isNext){
				document.body.removeChild(aZd[i].elm);
				aZd.splice(i,1);
				i--;
				iGrade++;
				oGrade.innerHTML = iGrade;
			}else{
				aZd[i].xSp = (aTgt[aZd[i]['index']].l+20-aZd[i].l)/8;
				aZd[i].ySp = (aTgt[aZd[i]['index']].t+25-aZd[i].t)/8;
				aZd[i].xSp = aZd[i].xSp>0?Math.ceil(aZd[i].xSp):Math.floor(aZd[i].xSp);
				aZd[i].ySp = aZd[i].ySp>0?Math.ceil(aZd[i].ySp):Math.floor(aZd[i].ySp);
				aZd[i].l+=aZd[i].xSp;
				aZd[i].t+=aZd[i].ySp;
				
				aZd[i].elm.left(aZd[i].l);
				aZd[i].elm.top(aZd[i].t);

			}
		}
		//目标自杀
		for(var i=0;i<clearTmp.length;i++){
			if(clearTmp[i].iNow<5){
				clearTmp[i].elm.className = 'die';
				clearTmp[i].iNow++;
			}else{
				if(clearTmp[i]['type']){
					iLife-=5;
					oLife.width(iLife);
					if(oLife.width()<=0){
						clearInterval(iTimer);
						clearInterval(iTimer2);
						isDie = true;
						showMsg(getChengHao(iGrade,iSeconds)+'您的成绩如下('+'得分：'+iGrade+',用时：'+secToStr(iSeconds)+')');
						construct();
					}
				}
				document.body.removeChild(clearTmp[i].elm);
				clearTmp.splice(i,1);
				i--;
			}
		}
		if(iSeconds!=0 && iSeconds%1000==0 && iLevl<levelArr.length-1){
			iLevl++;
			clearInterval(iTimer2);
			iTimer2 = setInterval(addElms,levelArr[iLevl]['tSec']);
			return;
		}
	}
	//获取称号
	function getChengHao(grade,sec){
		var sRes = '';
		for(var i in aChObj){
			var tmpArr = i.split('-');
			if(grade>=tmpArr[0] && grade<=tmpArr[1]){
				sRes = aChObj[i];
				break;
			}
		}
		if(sec<3600){
			sRes+='：你生命力太弱，太丢脸了！';
		}else{
			sRes+='：你是个顽强的猴子！';
		}
		return sRes;
	}
	//定时添加目标
	function addElms(){
		// document.title = iLevl
		for(var i=0;i<3;i++){
			var newElm = document.createElement('div');
			newElm.className = 'move';
			var iCode = allTarget[Math.floor(Math.random()*allTarget.length)];
			var l = Math.floor(Math.random()*(maxl));
			var t = -30;
			var xSp = Math.random()>0.5?2:-2;
			aTgt.push({
				'l':l,
				't':t,
				'xSp':xSp,
				'ySp':levelArr[iLevl].ySp,
				'code':iCode,
				'elm':newElm
			});
			newElm.style.left = l+'px';
			newElm.style.top = t+'px';
			newElm.innerHTML = '<span>'+String.fromCharCode(iCode)+'</span>';
			document.body.appendChild(newElm);
		}
	}
}
function getStyle(obj,name){
	if(obj.currentStyle){
		return obj.currentStyle[name];
	}else{
		return getComputedStyle(obj,false)[name];
	}
}
Object.prototype.left = function(value){
	if(arguments.length){
		this.style.left = value+'px';
	}else{
		return parseInt(getStyle(this,'left'));
	}
}
Object.prototype.width = function(value){
	if(arguments.length){
		this.style.width = value+'px';
	}else{
		return parseInt(getStyle(this,'width'));
	}
}
Object.prototype.top = function(value){
	if(arguments.length){
		this.style.top = value+'px';
	}else{
		return parseInt(getStyle(this,'top'));
	}
	
}