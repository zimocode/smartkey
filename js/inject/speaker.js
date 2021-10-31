console.log("speaker")
var SK_apps_speaker={
	cons:{},
	initUI:function(){
		sde.apps.init();
		var _appname="speaker",
			_time=parseInt((new Date().getTime())/1000);
		var dom=sde.apps.domCreate("smartkey",{setName:["className","id"],setValue:["sk_apps","sk_apps_"+_appname]},null,"z-index:"+_time,{setName:["appname"],setValue:[_appname]});
		dom.innerHTML=
			'<div class="sk_box_head" style="">'
				+'<span class="sk_box_title">'+sde.apps.i18n("speaker")+'</span>'
				+'<div class="sk_box_btn_close">x</div>'
			+'</div>'
			+'<div class="sk_box_main">'
				+'<div class="sk_box_content">'
					+'<div class="sk_speakerbox">'
						+'<div class="speaker_inputbox">'
							+'<textarea class="speaker_inputarea">'+SK_apps_speaker.cons.seltxt+'</textarea><br />'
							+'<button class="speaker_btn_play">'+sde.apps.i18n("btn_play")+'</button>'
							+'<button class="speaker_btn_pause" style="display:none;">'+sde.apps.i18n("btn_pause")+'</button>'
							+'<button class="speaker_btn_stop">'+sde.apps.i18n("btn_stop")+'</button>'
						+'</div>'
					+'</div>'
				+'</div>'
				+'<div class="sk_box_opt">'
					+'<label class="sk_box_opt_labelname">'+sde.apps.i18n("n_voicename")+'</label><select name="n_voicename" class="sk_box_opt_select"><option value="s_unpin">'+sde.apps.i18n("s_unpin")+'</option><option value="s_pinned">'+sde.apps.i18n("s_pinned")+'</option></select><br />'
					+'<label class="sk_box_opt_labelname">'+sde.apps.i18n("n_gender")+'</label><select name="n_gender" class="sk_box_opt_select"><option value="female">'+sde.apps.i18n("s_female")+'</option><option value="male">'+sde.apps.i18n("s_male")+'</option></select><br />'
					+'<label class="sk_box_opt_labelname">'+sde.apps.i18n("n_rate")+'</label><input name="n_rate" class="sk_box_opt_range" min=".1" max="10" step=".1" type="range"><span class="sk_box_opt_rangebox"></span><br />'
					+'<label class="sk_box_opt_labelname">'+sde.apps.i18n("n_pitch")+'</label><input name="n_pitch" class="sk_box_opt_range" min=".1" max="2" step=".1" type="range"><span class="sk_box_opt_rangebox"></span><br />'
					+'<label class="sk_box_opt_labelname">'+sde.apps.i18n("n_volume")+'</label><input name="n_volume" class="sk_box_opt_range" min=".1" max="1" step=".1" type="range"><span class="sk_box_opt_rangebox"></span><br />'
					+'<input class="sk_box_opt_save" type="button" value="'+sde.apps.i18n("btn_save")+'">'
				+'</div>'
			+'</div>'
			+'<div class="sk_box_menu">'
				+'<img class="sk_box_menu_btn sk_rss_boxmenu_list sk_rss_btnopt sk_box_menu_opt" src="'+chrome.runtime.getURL("/image/options.png")+'" title="'+sde.apps.i18n("app_tip_opt")+'" /><br />'
			+'</div>';
		var voicedom=dom.querySelector(".sk_box_opt select[name=n_voicename]");
		var _options;
		for(var i=0;i<SK_apps_speaker.cons.voicename.length;i++){
			_options+='<option value="'+SK_apps_speaker.cons.voicename[i]+'">'+SK_apps_speaker.cons.voicename[i]+'</option>';
		}
		voicedom.innerHTML=_options;
        //document.body.appendChild(dom);

        dom.querySelector(".speaker_btn_pause").addEventListener("click",this,false);
        dom.querySelector(".speaker_btn_play").addEventListener("click",this,false);
        dom.querySelector(".speaker_btn_stop").addEventListener("click",this,false);
        sde.apps.initOpt(dom);
		sde.apps.initPos(dom);
	},
	handleEvent:function(e){
		switch(e.type){
			case"click":
				if(e.target.className.indexOf("speaker_btn")==0){
					if(!sde.apps.getAPPboxEle(e).querySelector("textarea").value){return;}
					SK_apps_speaker.speaker(e);
					pausebtn=sde.apps.getAPPboxEle(e).querySelectorAll("button")[1];
					if(e.target.className=="speaker_btn_pause"){
						e.target.className="speaker_btn_resume";
						e.target.innerText=sde.apps.i18n("btn_resume");
					}else if(e.target.className=="speaker_btn_resume"){
						e.target.className="speaker_btn_pause";
						e.target.innerText=sde.apps.i18n("btn_pause");
					}else if(e.target.className=="speaker_btn_play"){
						pausebtn.style.cssText+="display:inline-block;";
					}else if(e.target.className=="speaker_btn_stop"){
						pausebtn.style.cssText+="display:none";
					}
				}
				break;
		}
	},
	speaker:function(e){
		chrome.runtime.sendMessage({type:"apps_action",apptype:"speaker",value:{type:e.target.className.substr(12),txt:sde.apps.getAPPboxEle(e).querySelector("textarea").value}},function(response){})
	}
}
chrome.runtime.sendMessage({type:"apps_getvalue",apptype:"speaker"},function(response){
	console.log(response)
	SK_apps_speaker.cons.config=response.config;
	SK_apps_speaker.cons.voicename=response.value.voicename;
	SK_apps_speaker.cons.seltxt=response.value.seltxt;
	SK_apps_speaker.initUI();
})
