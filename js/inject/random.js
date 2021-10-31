//console.log("random")
var SK_apps_random={
	cons:{
		boxmove:{}
	},
	initUI:function(){
		sde.apps.init();
		var _appname="random";
		var dom=sde.apps.domCreate("smartkey",{setName:["className","id"],setValue:["sk_apps","sk_apps_"+_appname]},null,"z-index:"+parseInt((new Date().getTime())/1000),{setName:["appname"],setValue:[_appname]});
		dom.innerHTML=
			'<div class="sk_box_head" style="">'
				+'<span class="sk_box_title">'+sde.apps.i18n("random")+'</span>'
				+'<div class="sk_box_btn_close">x</div>'
			+'</div>'
			+'<div class="sk_box_main">'
				+'<div class="sk_box_content"></div>'
			+'</div>';
		var domUL=sde.apps.domCreate("ul");
		dom.querySelector(".sk_box_content").style.cssText+="max-height:"+(window.innerHeight-150)+"px;";
		chrome.storage.local.get(function(items){
			var randData;
			!items.apps?items.apps={}:null;
			if(!items.apps.random){
				items.apps.random={
					min:1,
					max:9,
					num:4,
					norepeat:false,
					add:true
				}
				randData=items.apps.random;
				chrome.storage.local.set(items);
			}else{
				randData=items.apps.random;
			}
			
			var min=randData.min,
				max=randData.max,
				num=randData.num,
				norepeat=randData.norepeat,
				add=randData.add;
			dom.querySelector(".sk_box_content").innerHTML=
				'<div class="randombox">'
					+'<input id="sk_random_print" type="text"><br />'
					+'<span class="sk_random_span">'+sde.apps.i18n("app_random_bound")+'</span>'
					+'<input id="min" class="sk_random_text" type="text" value="'+min+'"><span>~</span><input id="max" class="sk_random_text" type="text" value="'+max+'"><br />'
					+'<span class="sk_random_span">'+sde.apps.i18n("app_random_num")+'</span><input id="num" class="sk_random_text" type="text" value="'+num+'"><br />'
					+'<input class="sk_random_chkbox" id="sk_random_norepeat" type="checkbox" '+(norepeat?'checked="true"':'')+'><label for="sk_random_norepeat">'+sde.apps.i18n("app_random_norepeat")+'</label><br />'
					+'<input class="sk_random_chkbox" id="sk_random_add" type="checkbox" '+(add?'checked="true"':'')+'><label for="sk_random_add">'+sde.apps.i18n("app_random_fill")+'</label><br />'
					+'<button class="sk_random_btn">'+sde.apps.i18n("btn_done")+'</button>'
				+'</div>'
			dom.querySelector(".sk_random_btn").addEventListener("click",SK_apps_random.handleEvent,false);
			sde.apps.initPos(dom);
		})
		//sde.apps.initOpt(dom);
	},
	handleEvent:function(e){
		switch(e.type){
			case"click":
				if(e.target.classList.contains("sk_random_btn")){
					SK_apps_random.randnum(e);
				}
				break;
		}
	},
	randnum:function(e){
		var domRandom=sde.apps.getAPPboxEle(e);
		var printBox=domRandom.querySelector("#sk_random_print");
		var randLength=parseInt(domRandom.querySelector("#num").value),
			min=parseInt(domRandom.querySelector("#min").value),
			max=parseInt(domRandom.querySelector("#max").value),
			norepeat=domRandom.querySelector("#sk_random_norepeat").checked;
			add=domRandom.querySelector("#sk_random_add").checked;
		var nums=[],strs="",flag=false,strlen=0;
		printBox.value="loading...";
		if(isNaN(min)||isNaN(max)||isNaN(randLength)){
			printBox.value="Error";
			return;
		}
		if(max<min){
			_max=max;_min=min;
			max=Math.max(_min,_max);
			min=Math.min(_min,_max);			
		}
		if((max-min+1)<randLength){
			norepeat=false;
		}
		for(var i=0;i<randLength;i++){
			var num=parseInt(Math.random()*(max-min+1)+min-(min<0?1:0));
			for(var ii=0;norepeat&&ii<nums.length;ii++){
				if(num==nums[ii]){
					flag=true;
					return arguments.callee(e)
					break;
				}
			}
			nums.push(num);
		}
		for(var i=0;add&&i<nums.length;i++){
			var thestr=nums[i].toString();
			strlen=(thestr.length>strlen)?thestr.length:strlen;
		}
		for(var i=0;i<nums.length;i++){
			var thestr=nums[i].toString();
			var addlen=strlen-thestr.length;
			for(var ii=0;add&&ii<addlen;ii++){
				thestr="0"+thestr;
			}
			strs=strs+" "+thestr;
		}
		printBox.value=strs;

		chrome.storage.local.get(function(items){
			items.apps.random={
				min:min,
				max:max,
				num:randLength,
				norepeat:norepeat,
				add:add
			}
			chrome.storage.local.set(items);
		})
	}
}
SK_apps_random.initUI();
// chrome.runtime.sendMessage({type:"apps_getvalue",apptype:"random"},function(response){
// 	SK_apps_random.initUI();
// })
