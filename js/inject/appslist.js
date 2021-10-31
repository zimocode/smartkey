console.log("appslist");
var SK_apps_appslist={
	cons:{},
	initUI:function(){
		sde.apps.init();
		var _appname="appslist",
			_time=parseInt((new Date().getTime())/1000);
		var dom=sde.apps.domCreate("smartkey",{setName:["className","id"],setValue:["sk_apps","sk_apps_"+_appname]},null,"z-index:"+_time,{setName:["appname"],setValue:[_appname]});
		dom.innerHTML=
			'<div class="sk_box_head" style="">'
				+'<span class="sk_box_title">'+sde.apps.i18n("appslist")+'</span>'
				+'<div class="sk_box_btn_close">x</div>'
			+'</div>'
			+'<div class="sk_box_main">'
				+'<div class="sk_box_content">'
					+'<div class="sk_appslist_box"></div>'
				+'</div>'
				+'<div class="sk_box_opt">'
					+'<input id="n_closebox" class="sk_box_opt_radio" name="n_closebox" type="checkbox"><label for="n_closebox" class="sk_box_opt_labeldes">'+sde.apps.i18n("n_closebox")+'</label>'
					+'<input class="sk_box_opt_save" type="button" value="'+sde.apps.i18n("btn_save")+'">'
				+'</div>'
			+'</div>'
			+'<div class="sk_box_menu">'
				+'<img class="sk_box_menu_btn sk_box_menu_opt" src="'+chrome.runtime.getURL("/image/options.png")+'" /><br />'
			+'</div>';
		dom.style.cssText+="border-color:#e91e63;";
		dom.querySelector(".sk_box_head").style.cssText+="background-color:#e91e63;";
		dom.querySelector(".sk_box_content").style.cssText+="max-height:"+(window.innerHeight-150)+"px;";

		var domBox=dom.querySelector(".sk_appslist_box");
		var domUL=sde.apps.domCreate("ul");
		var theobj=SK_apps_appslist.cons.appslist.apps;
		for(var i=0;i<theobj.length;i++){
			var domli=sde.apps.domCreate("li",{setName:["className"],setValue:["sk_appslist_li"]},sde.apps.i18n(theobj[i]),null,{setName:["id"],setValue:[theobj[i]]});
			domUL.appendChild(domli);
			domli.removeEventListener("click",this,false);
			domli.addEventListener("click",this,false);
		}
		domBox.appendChild(domUL)
		sde.apps.initOpt(dom);
		sde.apps.initPos(dom);
	},
	handleEvent:function(e){
		switch(e.type){
			case"click":
				if(e.target.classList.contains("sk_appslist_li")){
					chrome.runtime.sendMessage({type:"apps_action",apptype:"appslist",id:e.target.dataset.id},function(response){})
					if(SK_apps_appslist.cons.config.n_closebox){
						sde.apps.boxClose(e)
					}
				}
		}
	}
}
chrome.runtime.sendMessage({type:"apps_getvalue",apptype:"appslist"},function(response){
	SK_apps_appslist.cons.config=response.config;
	SK_apps_appslist.cons.appslist=response.value;
	SK_apps_appslist.initUI();
})
