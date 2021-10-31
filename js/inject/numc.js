console.log("numc")
var SK_apps_numc={
	cons:{},
	initUI:function(){
		sde.apps.init();
		var _appname="numc";
		var dom=sde.apps.domCreate("smartkey",{setName:["className","id"],setValue:["sk_apps","sk_apps_"+_appname]},null,"z-index:"+parseInt((new Date().getTime())/1000),{setName:["appname"],setValue:[_appname]});
		dom.innerHTML=
			'<div class="sk_box_head" style="">'
				+'<span class="sk_box_title">'+sde.apps.i18n("numc")+'</span>'
				+'<div class="sk_box_btn_close">x</div>'
			+'</div>'
			+'<div class="sk_box_main">'
				+'<div class="sk_box_content">'
					+'<div class="numcbox">'
						+'<span class="sk_numc_span">'+sde.apps.i18n("app_numc_from")+'<select class="sk_numc_intype"></select>'+'</span><br />'
						+'<input class="sk_numc_input" type="text"><br />'
						+'<span class="sk_numc_span">'+sde.apps.i18n("app_numc_to")+'<select class="sk_numc_outtype"></select>'+'</span><br />'
						+'<input class="sk_numc_output" type="text"><br />'
						+'<button class="sk_numc_btn">'+sde.apps.i18n("btn_done")+'</button>'
					+'</div>'
				+'</div>'
			+'</div>';
		dom.querySelector(".sk_numc_btn").addEventListener("click",SK_apps_numc.handleEvent,false);
		sde.apps.initPos(dom);

		var selectIn=dom.querySelector("select.sk_numc_intype");
		var selectOut=dom.querySelector("select.sk_numc_outtype");
		for(var i=2;i<33;i++){
			var theOption=sde.apps.domCreate("option",{setName:["value"],setValue:[i.toString()]},i.toString());
			selectIn.appendChild(theOption);
		}
		selectOut.innerHTML=selectIn.innerHTML;

		chrome.storage.local.get(function(items){
			var data;
			!items.apps?items.apps={}:null;
			if(!items.apps.numc){
				items.apps.numc={
					from:"10",
					to:"2",
					input:"100"
				}
				data=items.apps.numc;
				chrome.storage.local.set(items);
			}else{
				data=items.apps.numc;
			}
			
			dom.querySelector(".sk_numc_input").value=data.input;
			dom.querySelector(".sk_numc_intype").value=data.from;
			dom.querySelector(".sk_numc_outtype").value=data.to;
		})		
	},
	handleEvent:function(e){
		switch(e.type){
			case"click":
				if(e.target.classList.contains("sk_numc_btn")){
					SK_apps_numc.convert(e);
				}
				break;
		}
	},
	convert:function(e){
		var dom=sde.apps.getAPPboxEle(e);
		var input=dom.querySelector(".sk_numc_input").value;
		var from=dom.querySelector(".sk_numc_intype").value;
		var to=dom.querySelector(".sk_numc_outtype").value;
		var output;
		var outputdom=dom.querySelector(".sk_numc_output");
		var from10=function(num,type){
			num=new Number(num);
			return num.toString(type)
		}
		var to10=function(num,type){
			return parseInt(num,type)
		}
		if(from=="10"){
			output=from10(input,to);
		}
		if(to=="10"){
			output=to10(input,from);
		}
		if(from!="10"&&to!="10"){
			output=from10(to10(input,from),to)
		}
		outputdom.value=output;
		chrome.storage.local.get(function(items){
			var obj={
				input:input,
				from:from,
				to:to
			}
			items.apps.numc=obj;
			chrome.storage.local.set(items);
		})
	}
}
SK_apps_numc.initUI();
// chrome.runtime.sendMessage({type:"apps_getvalue",typevalue:"extmgm"},function(response){
// 	SK_apps_numc.cons.zoom=response.value.zoom;
// 	SK_apps_numc.initUI();
// })
