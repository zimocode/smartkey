var config;
var per={
	begin:function(){
		var theFunction=function(items){
			var strs="";
			if(items.permsg.thepers[0]||items.permsg.theorgs[0]){
				config=items.permsg;
				per.pers=config.thepers?config.thepers:null;
				per.orgs=config.theorgs?config.theorgs:null;
				for(var i=0;per.pers&&i<per.pers.length;i++){
					strs=strs+" "+per.pers[i];
				}
				for(var i=0;per.orgs&&i<per.orgs.length;i++){
					strs=strs+" "+per.orgs[i];
				}
				document.querySelector("#perlist").innerHTML=strs;
				var i18nOBJ=document.querySelectorAll("[data-i18n]");
				for(var i=0;i<i18nOBJ.length;i++){
					var trans=per.getI18n(i18nOBJ[i].dataset.i18n);
					if(!trans){continue;}
					if(i18nOBJ[i].tagName.toLowerCase()=="input"&&i18nOBJ[i].type=="button"){
						i18nOBJ[i].value=trans;
					}else{
						i18nOBJ[i].innerHTML=trans;
					}
				}
				per.init();
			}
		}
		chrome.storage.local.get(function(items){
			theFunction(items);
		})
	},
	getI18n:function(str){
		var i18n;
		// if(config.general.settings.setlang=="auto"){
		// 	i18n=chrome.i18n.getMessage(str)
		// }
		i18n=chrome.i18n.getMessage(str);
		var trans=i18n?i18n:str;
		return str.substr(0,4)=="des_"?"*"+trans:trans;
	},
	init:function(){
		window.addEventListener("click",this,false);
		window.addEventListener("unload",this,false);
	},
	handleEvent:function(e){
		switch(e.type){
			case"click":
				if(e.target.id=="getpers"){
					if(per.pers&&per.orgs){
						chrome.permissions.request({permissions: per.pers,origins: per.orgs}, function(granted){checkRequest(granted);})
					}else if(per.pers){
						chrome.permissions.request({permissions: per.pers}, function(granted){checkRequest(granted);})
					}else if(per.orgs){
						chrome.permissions.request({origins: per.orgs}, function(granted){checkRequest(granted);})
					}
					
					var checkRequest=function(granted){
						if (granted) {
							chrome.runtime.sendMessage({type:"getpersok",pers:per.pers},function(response){

							})
							var count=5;
							document.querySelector("#perlistbox").style.cssText+="font-size:18px;color:red;text-align:center;";
							document.querySelector("#perbtnbox").remove();
							cut();
							window.setInterval(cut,1000);
							function cut(){
								if(count){
									document.querySelector("#perlistbox").innerHTML=per.getI18n("per_after")+" "+count+" s.";
									//"thepers request successful! Please re-try the last gesture.<br \/>This page will be closed in "+count+" s.";
									count-=1;
								}else{
									window.close();
								}
							}
						} else {
							alert("failed!");
							window.close();
						}
						chrome.storage.local.remove("permsg")
					}
				}
				break;
			case"unload":
				chrome.storage.local.remove("permsg")
				break;
		}
	}
}
per.begin()