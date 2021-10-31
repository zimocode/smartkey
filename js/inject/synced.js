console.log("synced");
var SK_apps_synced={
	cons:{},
	initUI:function(){
		sde.apps.init();
		var _appname="synced",
			_time=parseInt((new Date().getTime())/1000);
		var dom=sde.apps.domCreate("smartkey",{setName:["className","id"],setValue:["sk_apps","sk_apps_"+_appname]},null,"z-index:"+_time,{setName:["appname"],setValue:[_appname]});
		dom.innerHTML=
			'<div class="sk_box_head" style="">'
				+'<span class="sk_box_title">'+sde.apps.i18n("synced")+'</span>'
				+'<div class="sk_box_btn_close">x</div>'
			+'</div>'
			+'<div class="sk_box_main">'
				+'<div class="sk_box_content">'
					+'<div class="sk_synced_head">'
						+'<span class="sk_synced_switch">'+sde.apps.i18n("app_synced_switch")+'</span>'
						+'<select class="sk_synced_device"></select>'
					+'</div>'
					+'<div class="sk_synced_box"></div>'
				+'</div>'
				+'<div class="sk_box_opt">'
					+'<input id="n_appwin_close_'+_time+'" class="sk_box_opt_radio" name="n_closebox" type="checkbox"><label for="n_appwin_close_'+_time+'" class="sk_box_opt_labeldes">'+sde.apps.i18n("n_closebox")+'</label><br />'
					+'<input class="sk_box_opt_save" type="button" value="'+sde.apps.i18n("btn_save")+'">'
				+'</div>'
			+'</div>'
			+'<div class="sk_box_menu">'
				+'<img class="sk_box_menu_btn sk_box_menu_opt" src="'+chrome.runtime.getURL("/image/options.png")+'" /><br />'
			+'</div>';
		dom.querySelector(".sk_box_content").style.cssText+="max-height:"+(window.innerHeight-150)+"px;";
		for(var i=0;i<SK_apps_synced.cons.sync.length&&SK_apps_synced.cons.sync.length>0;i++){
			dom.querySelector("select.sk_synced_device").appendChild(sde.apps.domCreate("option",null,SK_apps_synced.cons.sync[i].deviceName));
		}

		if(SK_apps_synced.cons.sync.length<1){
			dom.querySelector("smartkey .sk_synced_switch").innerHTML=sde.apps.i18n("app_synced_nodevice");
		}else{
			dom.querySelector("select.sk_synced_device").removeEventListener("change",this,false);
			dom.querySelector("select.sk_synced_device").addEventListener("change",this,false);			
		}
		var domBox=dom.querySelector(".sk_synced_box");
		var domUL=sde.apps.domCreate("ul");
		for(var i=0;i<SK_apps_synced.cons.sync.length>0&&SK_apps_synced.cons.sync[0].sessions.length;i++){
			var theobj=SK_apps_synced.cons.sync[0].sessions[i].window.tabs;
			for(var ii=0;ii<theobj.length;ii++){
				var domli=sde.apps.domCreate("li",{setName:["className"],setValue:["sk_synced_li"]},theobj[ii].title,null,{setName:["id"],setValue:[theobj[ii].sessionId]});
				domUL.appendChild(domli);
				domli.removeEventListener("click",this,false);
				domli.addEventListener("click",this,false);
			}
		}
		domBox.appendChild(domUL)
		sde.apps.initOpt(dom);
		sde.apps.initPos(dom);
	},
	handleEvent:function(e){
		switch(e.type){
			case"click":
				if(e.target.classList.contains("sk_synced_li")){
					chrome.runtime.sendMessage({type:"apps_action",apptype:"synced",id:e.target.dataset.id},function(response){})
					if(SK_apps_synced.cons.config.n_closebox){
						sde.apps.boxClose(e)
					}
				}
				break;
			case"change":
				this.deviceChange(e);
				break;
		}
	},
	deviceChange:function(e){
		var domBox=sde.apps.getAPPboxEle(e).querySelector(".sk_synced_box");
			domBox.innerHTML="";
		var sessionId=e.target.selectedIndex;
		var domUL=sde.apps.domCreate("ul");
		for(var i=0;i<SK_apps_synced.cons.sync[sessionId].sessions.length;i++){
			var theobj=SK_apps_synced.cons.sync[sessionId].sessions[i].window.tabs;
			for(var ii=0;ii<theobj.length;ii++){
				var domli=sde.apps.domCreate("li",{setName:["className"],setValue:["sk_synced_li"]},theobj[ii].title,null,{setName:["id"],setValue:[theobj[ii].sessionId]});
				domUL.appendChild(domli);
				domli.removeEventListener("click",this,false);
				domli.addEventListener("click",this,false);
			}
		}
		domBox.appendChild(domUL)
	}
}
chrome.runtime.sendMessage({type:"apps_getvalue",apptype:"synced"},function(response){
	SK_apps_synced.cons.config=response.config;
	SK_apps_synced.cons.sync=response.value.sync;
	SK_apps_synced.initUI()
})
