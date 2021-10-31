//console.log("tablist")
var SK_apps_tablist={
	cons:{},
	initUI:function(){
		sde.apps.init();
		var _appname="tablist",
			_time=parseInt((new Date().getTime())/1000);
		var dom=sde.apps.domCreate("smartkey",{setName:["className","id"],setValue:["sk_apps","sk_apps_"+_appname]},null,"z-index:"+_time,{setName:["appname"],setValue:[_appname]});
		dom.innerHTML=
			'<div class="sk_box_head" style="">'
				+'<span class="sk_box_title">'+sde.apps.i18n(_appname)+'</span>'
				+'<div class="sk_box_btn_close">x</div>'
			+'</div>'
			+'<div class="sk_box_main">'
				+'<div class="sk_box_content"></div>'
				+'<div class="sk_box_opt">'
					+'<input id="n_closebox_'+_time+'" class="sk_box_opt_radio" name="n_closebox" type="checkbox"><label for="n_closebox_'+_time+'" class="sk_box_opt_labeldes">'+sde.apps.i18n("n_closebox")+'</label>'
					+'<input class="sk_box_opt_save" type="button" value="'+sde.apps.i18n("btn_save")+'">'
				+'</div>'
			+'</div>'
			+'<div class="sk_box_menu">'
				+'<img class="sk_box_menu_btn sk_box_menu_opt" src="'+chrome.runtime.getURL("/image/options.png")+'" title="'+sde.apps.i18n("app_tip_opt")+'" /><br />'
			+'</div>';
		var domUL=sde.apps.domCreate("ul");
		for(var i=0;i<this.cons.list.length;i++){
			var inner="<img src='"+this.cons.list[i].favIconUrl+"'>"+this.cons.list[i].title+"<span class='sk_tablist_button_liclose'>x</span>"
			var list_li=sde.apps.domCreate("li",{setName:["className"],setValue:["sk_tablist_li"]},inner,"",{setName:["id"],setValue:[i]},"");
			if(SK_apps_tablist.cons.list[i].id==SK_apps_tablist.cons.curtab.id){
				list_li.classList.add("sk_tablist_cur");
			}
			list_li.addEventListener("click",this,false);
			domUL.appendChild(list_li);
		}
		dom.querySelector(".sk_box_content").style.cssText+="max-height:"+(window.innerHeight-150)+"px;";
		dom.querySelector(".sk_box_content").appendChild(domUL);
		sde.apps.initOpt(dom);
		sde.apps.initPos(dom);
	},
	handleEvent:function(e){
		sde.apps.handleEvent(e);
		switch(e.type){
			case"click":
				if(e.target.classList.contains("sk_tablist_button_liclose")){
					var theDom=e.target.parentNode;
					chrome.runtime.sendMessage({type:"apps_action",apptype:"tablist",id:SK_apps_tablist.cons.list[theDom.dataset.id].id,actiontype:"list_close"},function(response){})
					e.target.parentNode.style.cssText+="height:0;opacity:0;";
					window.setTimeout(function(){
						e.target.parentNode.remove();
					},500)
				}
				if(e.target.classList.contains("sk_tablist_li")||(e.target.parentNode.classList.contains("sk_tablist_li")&&!e.target.classList.contains("sk_tablist_button_liclose"))){
					var theDom=e.target.classList.contains("sk_tablist_li")?e.target:e.target.parentNode;
					chrome.runtime.sendMessage({type:"apps_action",apptype:"tablist",id:SK_apps_tablist.cons.list[theDom.dataset.id].id,actiontype:"list_switch"},function(response){})
					if(SK_apps_tablist.cons.config.n_closebox){
						sde.apps.boxClose(e);
					}
				}
				break;
		}
	}
}
chrome.runtime.sendMessage({type:"apps_getvalue",apptype:"tablist"},function(response){
	SK_apps_tablist.cons.config=response.config;
	SK_apps_tablist.cons.list=response.value.list;
	SK_apps_tablist.cons.curtab=response.value.curtab;
	SK_apps_tablist.initUI()
})