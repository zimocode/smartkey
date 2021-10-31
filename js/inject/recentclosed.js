console.log("recentclosed");
var SK_apps_recentclosed={
	cons:{},
	initUI:function(){
		sde.apps.init();
		var _appname="recentclosed",
			_time=parseInt((new Date().getTime())/1000);
		var dom=sde.apps.domCreate("smartkey",{setName:["className","id"],setValue:["sk_apps","sk_apps_"+_appname]},null,"z-index:"+_time,{setName:["appname"],setValue:[_appname]});
		dom.innerHTML=
			'<div class="sk_box_head" style="">'
				+'<span class="sk_box_title">'+sde.apps.i18n("recentclosed")+'</span>'
				+'<div class="sk_box_btn_close">x</div>'
			+'</div>'
			+'<div class="sk_box_main">'
				+'<div class="sk_box_content"></div>'
				+'<div class="sk_box_opt">'
					 +'<label class="sk_box_opt_labelname">'+sde.apps.i18n("n_num")+'</label>'+'<input class="sk_box_opt_range" name="n_num" min="5" max="25" type="range"><span class="sk_box_opt_rangebox"></span><br />'
					+'<input id="n_closebox_'+_time+'" class="sk_box_opt_radio" name="n_closebox" type="checkbox"><label for="n_closebox_'+_time+'" class="sk_box_opt_labeldes">'+sde.apps.i18n("n_closebox")+'</label><br />'
					+'<input class="sk_box_opt_save" type="button" value="'+sde.apps.i18n("btn_save")+'">'
				+'</div>'
			+'</div>'
			+'<div class="sk_box_menu">'
				+'<img class="sk_box_menu_btn sk_box_menu_opt" src="'+chrome.runtime.getURL("/image/options.png")+'" /><br />'
			+'</div>';
		var domUL=sde.apps.domCreate("ul");
		for(var i=0;i<SK_apps_recentclosed.cons.tabs.length;i++){
		console.log("sde.cons.tabs")
			var rctype=!SK_apps_recentclosed.cons.tabs[i].window?SK_apps_recentclosed.cons.tabs[i].tab:SK_apps_recentclosed.cons.tabs[i].window;
			var list_li=sde.apps.domCreate("li",{setName:["className"],setValue:["sk_recentclosed_li"]},(!SK_apps_recentclosed.cons.tabs[i].window?SK_apps_recentclosed.cons.tabs[i].tab.title:SK_apps_recentclosed.cons.tabs[i].window.tabs.length+" "+sde.apps.i18n("app_recentclosed_tabs")),"",{setName:["id"],setValue:[rctype.sessionId]},"");
			var rc_title;

			if(rctype.tabs){
				rc_title=rctype.tabs.length+" "+sde.apps.i18n("app_recentclosed_tabs")
				for(var ii=0;ii<rctype.tabs.length;ii++){
					rc_title+=" | "+rctype.tabs[ii].title;
				}
				list_li.classList.add("sk_recentclosed_win");
				list_li.innerHTML=rc_title;
			}
			domUL.appendChild(list_li);
			list_li.removeEventListener("click",this,false);
			list_li.addEventListener("click",this,false);
		}
		dom.querySelector(".sk_box_content").style.cssText+="max-height:"+(window.innerHeight-150)+"px;";
		dom.querySelector(".sk_box_content").appendChild(domUL);
		
		sde.apps.initOpt(dom);
		sde.apps.initPos(dom);
	},
	handleEvent:function(e){
		switch(e.type){
			case"click":
				if(e.target.classList.contains("sk_recentclosed_li")){
					chrome.runtime.sendMessage({type:"apps_action",apptype:"recentclosed",id:e.target.dataset.id},function(response){})
					if(SK_apps_recentclosed.cons.config.n_closebox){
						sde.apps.boxClose(e)
					}
				}
				break;
		}
	}
}
chrome.runtime.sendMessage({type:"apps_getvalue",apptype:"recentclosed"},function(response){
	SK_apps_recentclosed.cons.config=response.config;
	SK_apps_recentclosed.cons.tabs=response.value.tabs;
	console.log(response)
	SK_apps_recentclosed.initUI()
})
