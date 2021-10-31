//console.log("extmgm")
var SK_apps_extmgm={
	cons:{
		boxmove:{}
	},
	initUI:function(){
		sde.apps.init();
		var _appname="extmgm";
		var dom=sde.apps.domCreate("smartkey",{setName:["className","id"],setValue:["sk_apps","sk_apps_"+_appname]},null,"z-index:"+parseInt((new Date().getTime())/1000),{setName:["appname"],setValue:[_appname]});
		dom.innerHTML=
			'<div class="sk_box_head" style="">'
				+'<span class="sk_box_title">'+sde.apps.i18n("extmgm")+'</span>'
				+'<div class="sk_box_btn_close">x</div>'
			+'</div>'
			+'<div class="sk_box_main">'
				+'<div class="sk_box_content">'
					+'<div class="sk_extmgm"></div>'
				+'</div>'
			+'</div>';
		var domUL=sde.apps.domCreate("ul");
		dom.querySelector(".sk_box_content").style.cssText+="max-height:"+(window.innerHeight-150)+"px;";

        SK_apps_extmgm.list(dom);
		sde.apps.initPos(dom);
	},
	handleEvent:function(e){
		switch(e.type){
			case"click":
				if(e.target.classList.contains("sk_extmgm_li")){
					SK_apps_extmgm.action(e);
				}
				break;
			case"mouseover":
				if(e.target.classList.contains("sk_extmgm_li")){
					if(e.target.classList.contains("sk_extmgm_enabled")){
						e.target.style.cssText+='background-image:url("'+chrome.runtime.getURL("image/disable.png")+'")'
					}else{
						e.target.style.cssText+='background-image:url("'+chrome.runtime.getURL("image/enable.png")+'")'
					}
				}
				break;
			case"mouseout":
				if(e.target.classList.contains("sk_extmgm_li")){
					e.target.style.cssText+='background-image:none;'
				}
				break;
		}
	},
	list:function(dom){
		var dom=dom.querySelector(".sk_extmgm");
		var domli=sde.apps.domCreate("li",{setName:["className"],setValue:["sk_extmgm_li sk_extmgm_disableall"]},sde.apps.i18n("app_extmgm_disableall"));
			dom.appendChild(domli);
			domli.addEventListener("click",this,false);
		for(var i=0;i<SK_apps_extmgm.cons.extmgm.ext_enabled.length;i++){
			var domli=sde.apps.domCreate("li",{setName:["className"],setValue:["sk_extmgm_li sk_extmgm_enabled"]},SK_apps_extmgm.cons.extmgm.ext_enabled[i].name,null,{setName:["id"],setValue:[SK_apps_extmgm.cons.extmgm.ext_enabled[i].id]});
			domli.addEventListener("click",this,false);
			domli.addEventListener("mouseover",this,false);
			domli.addEventListener("mouseout",this,false);
			dom.appendChild(domli);
		}
		for(var i=0;i<SK_apps_extmgm.cons.extmgm.ext_disabled.length;i++){
			var domli=sde.apps.domCreate("li",{setName:["className"],setValue:["sk_extmgm_li sk_extmgm_disabled"]},SK_apps_extmgm.cons.extmgm.ext_disabled[i].name,null,{setName:["id"],setValue:[SK_apps_extmgm.cons.extmgm.ext_disabled[i].id]});
			domli.addEventListener("click",this,false);
			domli.addEventListener("mouseover",this,false);
			domli.addEventListener("mouseout",this,false);
			dom.appendChild(domli);
		}
	},
	action:function(e){
		var typeAction;
		if(e.target.classList.contains("sk_extmgm_disableall")){
			typeAction="disableall";
		}else{
			typeAction=e.target.classList.contains("sk_extmgm_enabled")?"disable":"enable";
		} 
		var objul=e.target.parentNode;
		chrome.runtime.sendMessage({type:"apps_action",apptype:"extmgm",actiontype:typeAction,id:e.target.dataset.id},function(response){
			if(response.actionDone){
				if(typeAction=="disable"){
					e.target.className="sk_extmgm_li sk_extmgm_disabled";
					objul.appendChild(e.target)
				}else if(typeAction=="enable"){
					e.target.className="sk_extmgm_li sk_extmgm_enabled";
					objul.insertBefore(e.target,objul.querySelector(".sk_extmgm_disableall").nextSibling);
				}else if(typeAction=="disableall"){
					var doms=objul.querySelectorAll(".sk_extmgm_enabled");
					for(var i=0;i<doms.length;i++){
						doms[i].className="sk_extmgm_li sk_extmgm_disabled";
						objul.appendChild(doms[i]);
					}
				}
				e.target.style.cssText+="background-image:none;"
			}
		})
	}
}
chrome.runtime.sendMessage({type:"apps_getvalue",apptype:"extmgm"},function(response){
	SK_apps_extmgm.cons.extmgm=response.value;
	SK_apps_extmgm.initUI();
})

