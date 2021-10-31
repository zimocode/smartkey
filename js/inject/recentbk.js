//console.log("recentbk");
var SK_apps_recentbk={
	cons:{},
	initUI:function(){
		sde.apps.init();
		var _appname="recentbk",
			_time=parseInt((new Date().getTime())/1000);
		var dom=sde.apps.domCreate("smartkey",{setName:["className","id"],setValue:["sk_apps","sk_apps_"+_appname]},null,"z-index:"+_time,{setName:["appname"],setValue:[_appname]});
		dom.innerHTML=
			'<div class="sk_box_head" style="">'
				+'<span class="sk_box_title">'+sde.apps.i18n("recentbk")+'</span>'
				+'<div class="sk_box_btn_close">x</div>'
			+'</div>'
			+'<div class="sk_box_main">'
				+'<div class="sk_box_content"></div>'
				+'<div class="sk_box_opt">'
					+'<label class="sk_box_opt_labelname">'+sde.apps.i18n("n_optype")+'</label><select name="n_optype" class="sk_box_opt_select"><option value="s_new">'+sde.apps.i18n("s_new")+'</option><option value="s_back">'+sde.apps.i18n("s_back")+'</option><option value="s_current">'+sde.apps.i18n("s_current")+'</option><option value="s_incog">'+sde.apps.i18n("s_incog")+'</option></select><br />'
					+'<label class="sk_box_opt_labelname">'+sde.apps.i18n("n_position")+'</label><select name="n_position" class="sk_box_opt_select"><option value="s_default">'+sde.apps.i18n("s_default")+'</option><option value="s_left">'+sde.apps.i18n("s_left")+'</option><option value="s_right">'+sde.apps.i18n("s_right")+'</option><option value="s_head">'+sde.apps.i18n("s_head")+'</option><option value="s_last">'+sde.apps.i18n("s_last")+'</option></select><br />'
					+'<label class="sk_box_opt_labelname">'+sde.apps.i18n("n_pin")+'</label><select name="n_pin" class="sk_box_opt_select"><option value="s_unpin">'+sde.apps.i18n("s_unpin")+'</option><option value="s_pinned">'+sde.apps.i18n("s_pinned")+'</option></select><br />'
					+'<label class="sk_box_opt_labelname">'+sde.apps.i18n("n_num")+'</label>'+'<input class="sk_box_opt_range" name="n_num" min="5" max="50" type="range"><span class="sk_box_opt_rangebox"></span><br />'
					+'<input id="n_closebox_'+_time+'" class="sk_box_opt_radio" name="n_closebox" type="checkbox"><label for="n_closebox_'+_time+'" class="sk_box_opt_labeldes">'+sde.apps.i18n("n_closebox")+'</label><br />'
					+'<input class="sk_box_opt_save" type="button" value="'+sde.apps.i18n("btn_save")+'">'
				+'</div>'
			+'</div>'
			+'<div class="sk_box_menu">'
				+'<img class="sk_box_menu_btn sk_box_menu_opt" src="'+chrome.runtime.getURL("/image/options.png")+'" /><br />'
			+'</div>';
		var domUL=sde.apps.domCreate("ul");
		for(var i=0;i<this.cons.bk.length;i++){
			var list_li=sde.apps.domCreate("li",{setName:["className"],setValue:["sk_recentbk_li"]},"<span class='li_0'>"+this.cons.bk[i].title+"</span><span class='li_1' title='"+this.cons.bk[i].title+"''>"+this.cons.bk[i].url+"</span>","",{setName:["id"],setValue:[i]},"");
			domUL.appendChild(list_li);
			list_li.querySelector(".li_1").removeEventListener("click",this,false);
			list_li.querySelector(".li_1").addEventListener("click",this,false);
		}
		//dom.querySelector(".sk_box_content").style.cssText+="max-height:"+(window.innerHeight-150)+"px;";
		dom.querySelector(".sk_box_content").appendChild(domUL);
		sde.apps.initOpt(dom);
		sde.apps.initPos(dom);
	},
	handleEvent:function(e){
		switch(e.type){
			case"click":
				if(e.target.classList.contains("sk_recentbk_li")||e.target.parentNode.classList.contains("sk_recentbk_li")){
					var theDom=e.target.classList.contains("sk_recentbk_li")?e.target:e.target.parentNode;
					chrome.runtime.sendMessage({type:"apps_action",apptype:"recentbk",link:SK_apps_recentbk.cons.bk[theDom.dataset.id].url},function(response){})
					if(SK_apps_recentbk.cons.config.n_appwin_close){
						sde.apps.boxClose(e)
					}
				}
				break;
		}
	}
}
chrome.runtime.sendMessage({type:"apps_getvalue",apptype:"recentbk"},function(response){
	SK_apps_recentbk.cons.config=response.config;
	SK_apps_recentbk.cons.bk=response.value.bk;
	SK_apps_recentbk.initUI()
})
