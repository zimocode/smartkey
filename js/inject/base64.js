console.log("base64")
var SK_apps_base64={
	cons:{
		boxmove:{}
	},
	initUI:function(){
		sde.apps.init();
		var _appname="base64";
		var dom=sde.apps.domCreate("smartkey",{setName:["className","id"],setValue:["sk_apps","sk_apps_"+_appname]},null,"z-index:"+parseInt((new Date().getTime())/1000),{setName:["appname"],setValue:[_appname]});
		dom.innerHTML=
			'<div class="sk_box_head" style="">'
				+'<span class="sk_box_title">'+sde.apps.i18n("base64")+'</span>'
				+'<div class="sk_box_btn_close">x</div>'
			+'</div>'
			+'<div class="sk_box_main">'
				+'<div class="sk_box_content">'
					+'<div class="base64box">'
						+'<div class="base_str">'
							+'<textarea class="base_areastr">'+'dGVzdA=='+'</textarea><br />'
							+'<button class="base_btn_code">'+sde.apps.i18n("btn_decode")+'</button><button class="base_btn_encode">'+sde.apps.i18n("btn_encode")+'</button>'
						+'</div>'
						+'<div class="base_code">'
							+'<textarea class="base_areacode"></textarea><br />'
							+'<button class="base_btn_back">'+sde.apps.i18n("btn_back")+'</button>'
						+'</div>'
					+'</div>'
					+'<div class="sk_copyright">Based on <a href="https://github.com/dankogai/js-base64" target="_blank">js-base64@Github</a></div>'
				+'</div>'
			+'</div>';
		var domUL=sde.apps.domCreate("ul");
		dom.querySelector(".sk_box_content").style.cssText+="max-height:"+(window.innerHeight-150)+"px;";

        dom.querySelector(".base_btn_code").addEventListener("click",this,false);
        dom.querySelector(".base_btn_encode").addEventListener("click",this,false);
        dom.querySelector(".base_btn_back").addEventListener("click",this,false);

		sde.apps.initPos(dom);
	},
	handleEvent:function(e){
		switch(e.type){
			case"click":
				var objstr=sde.apps.getAPPboxEle(e).querySelector(".base_str textarea"),
					objcode=sde.apps.getAPPboxEle(e).querySelector(".base_code textarea");
				objcode.value="";
				if(!objstr.value){return;}
				if(e.target.classList.contains("base_btn_code")){
					SK_apps_base64.showPanel(e);
					objcode.value=Base64.toBase64(objstr.value);
				}else if(e.target.classList.contains("base_btn_encode")){
					SK_apps_base64.showPanel(e);
					objcode.value=Base64.fromBase64(objstr.value);
				}else if(e.target.classList.contains("base_btn_back")){
					SK_apps_base64.showPanel(e);
				}
				break;
		}
	},
	showPanel:function(e){
		var obj=sde.apps.getAPPboxEle(e).querySelector(".base_code");
		if(e.target.classList.contains("base_btn_back")){
			obj.style.cssText+="left:-500px;"
		}else{
			obj.style.cssText+="left:20px;"
		}
	}
}
SK_apps_base64.initUI();
// chrome.runtime.sendMessage({type:"apps_getvalue",apptype:"appslist"},function(response){
// 	SK_apps_base64.initUI();
// })