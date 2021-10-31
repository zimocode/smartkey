console.log("qr")
var SK_apps_qr={
	cons:{
		boxmove:{}
	},
	initUI:function(){
		sde.apps.init();
		var _appname="qr",
			_time=parseInt((new Date().getTime())/1000);
		var dom=sde.apps.domCreate("smartkey",{setName:["className","id"],setValue:["sk_apps","sk_apps_"+_appname]},null,"z-index:"+_time,{setName:["appname"],setValue:[_appname]});
		dom.innerHTML=
			'<div class="sk_box_head" style="">'
				+'<span class="sk_box_title">'+sde.apps.i18n("qr")+'</span>'
				+'<div class="sk_box_btn_close">x</div>'
			+'</div>'
			+'<div class="sk_box_main">'
				+'<div class="sk_box_content">'
					+'<div class="sk_qrbox">'
						+'<div class="qr_inputbox">'
							+'<div class="qr_typelist"><input class="qr_type_url" id="qr_type_url_'+_time+'" name="qr_type_'+_time+'" type="radio"><label for="qr_type_url_'+_time+'">'+sde.apps.i18n("app_qr_url")+'</label></div>'
							+'<div class="qr_typelist"><input class="qr_type_seltxt" id="qr_type_seltxt_'+_time+'" name="qr_type_'+_time+'" type="radio"><label for="qr_type_seltxt_'+_time+'">'+sde.apps.i18n("app_qr_seltxt")+'</label></div>'
							+'<div class="qr_typelist"><input class="qr_type_title" id="qr_type_title_'+_time+'" name="qr_type_'+_time+'" type="radio"><label for="qr_type_title_'+_time+'">'+sde.apps.i18n("app_qr_title")+'</label></div>'
							+'<div class="qr_typelist"><input class="qr_type_customer" id="qr_type_customer_'+_time+'" name="qr_type_'+_time+'" type="radio"><label for="qr_type_customer_'+_time+'">'+sde.apps.i18n("app_qr_customer")+'</label></div>'
							+'<textarea class="qr_inputarea" disabled="disabled">'+location.href+'</textarea><br />'
							+'<button class="qr_btn_done">'+sde.apps.i18n("btn_done")+'</button>'
							+'<div class="sk_copyright">Based on <a href="https://github.com/jeromeetienne/jquery-qrcode" target="_blank">jquery-qrcode@Github</a></div>'
						+'</div>'
						+'<div class="qr_outputbox">'
							+'<div class="qr_output"></div>'
							+'<button class="qr_btn_back">'+sde.apps.i18n("btn_back")+'</button>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>';
		//dom.querySelector(".sk_box_content").style.cssText+="max-height:"+(window.innerHeight-150)+"px;";
		//dom.style.cssText+="left:"+(window.innerWidth-350)/2+"px;";
        //document.body.appendChild(dom);drg
        if(SK_apps_qr.cons.seltxt){
        	dom.querySelector(".qr_type_seltxt").checked=true;
        	dom.querySelector(".qr_inputarea").innerText=SK_apps_qr.cons.seltxt;
        }else{
        	dom.querySelector(".qr_type_url").checked=true;
        	dom.querySelector(".qr_inputarea").innerText=location.href;
        }

        dom.querySelector(".qr_btn_done").addEventListener("click",this,false);
        dom.querySelector(".qr_btn_back").addEventListener("click",this,false);
        dom.querySelector(".qr_type_customer").addEventListener("change",this,false);
        dom.querySelector(".qr_type_title").addEventListener("change",this,false);
        dom.querySelector(".qr_type_url").addEventListener("change",this,false);
        dom.querySelector(".qr_type_seltxt").addEventListener("change",this,false);

		sde.apps.initPos(dom);
	},
	handleEvent:function(e){
		switch(e.type){
			case"click":
				function toUtf8(str) {    
				    var out, i, len, c;    
				    out = "";    
				    len = str.length;    
				    for(i = 0; i < len; i++) {    
				        c = str.charCodeAt(i);    
				        if ((c >= 0x0001) && (c <= 0x007F)) {    
				            out += str.charAt(i);    
				        } else if (c > 0x07FF) {    
				            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));    
				            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));    
				            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));    
				        } else {    
				            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));    
				            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));    
				        }    
				    }    
				    return out;    
				}

				var objinput=sde.apps.getAPPboxEle(e).querySelector(".qr_inputarea"),
					objcode=sde.apps.getAPPboxEle(e).querySelector(".base_code textarea");
				if(!objinput.value){return;}
				if(e.target.classList.contains("qr_btn_done")){
					SK_apps_qr.showPanel(e);
					sde.apps.getAPPboxEle(e).querySelector(".qr_output").innerHTML="";
					jQuery('.qr_output').qrcode(toUtf8(objinput.value));
				}else if(e.target.classList.contains("qr_btn_back")){
					SK_apps_qr.showPanel(e);
				}
				break;
			case"change":
				if(e.target.name.indexOf("qr_type")!=0){return;}
				var _area=sde.apps.getAPPboxEle(e).querySelector(".qr_inputarea");
				if(e.target.classList.contains("qr_type_url")){
					_area.value=location.href;
					_area.disabled="disabled";
				}else if(e.target.classList.contains("qr_type_title")){
					_area.value=document.title;
					_area.disabled="disabled";
				}else if(e.target.classList.contains("qr_type_seltxt")){
					console.log(SK_apps_qr.cons.seltxt)
					_area.value=SK_apps_qr.cons.seltxt;
					_area.disabled="disabled";
				}else{
					//_area.value="";
					_area.removeAttribute("disabled");
					_area.focus();
				}
				break;
		}
	},
	showPanel:function(e){
		var obj=sde.apps.getAPPboxEle(e).querySelector(".qr_outputbox");
		if(e.target.classList.contains("qr_btn_back")){
			obj.style.cssText+="left:-500px;"
		}else{
			obj.style.cssText+="left:0px;"
		}
	}
}
chrome.runtime.sendMessage({type:"apps_getvalue",apptype:"qr"},function(response){
	SK_apps_qr.cons.seltxt=response.value.seltxt;
	SK_apps_qr.initUI();
})
