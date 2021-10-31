//console.log("rss")
var SK_apps_rss={
	cons:{},
	initUI:function(){
		sde.apps.init();
		var _appname="rss",
			_time=parseInt((new Date().getTime())/1000);
		var dom=sde.apps.domCreate("smartkey",{setName:["className","id"],setValue:["sk_apps","sk_apps_"+_appname]},null,"z-index:"+_time,{setName:["appname"],setValue:[_appname]});	
		dom.innerHTML=
			'<div class="sk_box_head" style=""><span class="sk_box_title">'+sde.apps.i18n(_appname)+'</span><div class="sk_box_btn_close">x</div>'
			+'</div>'
			+'<div class="sk_box_main">'
				+'<div class="sk_box_content">'
					+'<div class="sk_rss_head">'
						+'<span class="sk_rss_rsshead"></span>'
					+'</div>'
					+'<div class="sk_rss_box">'
						+'<span style="color: #3698F9;">Loading </span><img style="display: inline-block;margin-bottom: -10px;" src="'+chrome.runtime.getURL("/image/loading.gif")+'" />'
					+'</div>'
				+'</div>'
				+'<div class="sk_rss_menu">'
					+'<div class="sk_rss_menu_head">'
						+sde.apps.i18n("app_rss_sub")
					+'</div>'
					+'<div class="sk_rss_menu_sub">'
						+'<input class="sk_rss_menu_sub_text" type="text" placeholder="'+sde.apps.i18n("app_rss_subplace")+'">'
						+'<input class="sk_rss_menu_sub_btn" type="button" value="'+sde.apps.i18n("app_rss_new")+'">'
					+'</div>'
					+'<ul class="sk_rss_menu_list"></ul>'
				+'</div>'
				+'<div class="sk_box_opt">'
					+'<label class="sk_box_opt_labelname">'+sde.apps.i18n("n_optype")+'</label><select name="n_optype" class="sk_box_opt_select"><option value="s_new">'+sde.apps.i18n("s_new")+'</option><option value="s_back">'+sde.apps.i18n("s_back")+'</option><option value="s_current">'+sde.apps.i18n("s_current")+'</option><option value="s_incog">'+sde.apps.i18n("s_incog")+'</option></select><br />'
					+'<label class="sk_box_opt_labelname">'+sde.apps.i18n("n_position")+'</label><select name="n_position" class="sk_box_opt_select"><option value="s_default">'+sde.apps.i18n("s_default")+'</option><option value="s_left">'+sde.apps.i18n("s_left")+'</option><option value="s_right">'+sde.apps.i18n("s_right")+'</option><option value="s_head">'+sde.apps.i18n("s_head")+'</option><option value="s_last">'+sde.apps.i18n("s_last")+'</option></select><br />'
					+'<label class="sk_box_opt_labelname">'+sde.apps.i18n("n_pin")+'</label><select name="n_pin" class="sk_box_opt_select"><option value="s_unpin">'+sde.apps.i18n("s_unpin")+'</option><option value="s_pinned">'+sde.apps.i18n("s_pinned")+'</option></select><br />'
					+'<input id="n_closebox_'+_time+'" class="sk_box_opt_radio" name="n_closebox" type="checkbox"><label for="n_closebox_'+_time+'" class="sk_box_opt_labeldes">'+sde.apps.i18n("n_closebox")+'</label>'
					+'<input class="sk_box_opt_save" type="button" value="'+sde.apps.i18n("btn_save")+'">'
				+'</div>'
			+'</div>'
			+'<div class="sk_box_menu">'
				+'<img class="sk_box_menu_btn sk_rss_boxmenu_list sk_rss_btnmenu" src="'+chrome.runtime.getURL("/image/menu.svg")+'" title="'+sde.apps.i18n("app_rss_menu")+'" /><br />'
				+'<img class="sk_box_menu_btn sk_rss_boxmenu_list sk_rss_btnopt sk_box_menu_opt" src="'+chrome.runtime.getURL("/image/options.png")+'" title="'+sde.apps.i18n("app_tip_opt")+'" /><br />'
			+'</div>'
		dom.style.cssText+="border-color:rgb(255, 102, 0);";

		var domUL=sde.apps.domCreate("ul");
		dom.querySelector(".sk_box_content").style.cssText+="max-height:"+(window.innerHeight-150)+"px;";
		dom.querySelector(".sk_box_head").style.cssText+="background-color:rgb(255, 102, 0);";

		dom.querySelector(".sk_rss_btnmenu").addEventListener("click",SK_apps_rss.handleEvent,false);
		dom.querySelector(".sk_rss_menu_sub_btn").addEventListener("click",SK_apps_rss.handleEvent,false);

		sde.apps.initOpt(dom);
		sde.apps.initPos(dom);

		if(SK_apps_rss.cons.config.feed&&SK_apps_rss.cons.config.feed.length>0){
			SK_apps_rss.rss(dom,SK_apps_rss.cons.config.feed[0]);
			SK_apps_rss.menu(dom);
		}else{
			dom.querySelector(".rssbox").innerHTML="there is no sub.";
			SK_apps_rss.showMenu(dom)
		}
	},
	handleEvent:function(e){
		switch(e.type){
			case"click":
				if(e.target.classList.contains("app_rss_li")){
					SK_apps_rss.openlink(e);
				}
				if(e.target.classList.contains("sk_rss_btnmenu")){
					SK_apps_rss.showMenu(e);
				}
				if(e.target.classList.contains("sk_rss_menuli")){
					SK_apps_rss.rssSwitch(e,e.target.dataset.url);
				}
				if(e.target.classList.contains("sk_rss_menu_sub_btn")){
					SK_apps_rss.rssAdd(e);
				}
				if(e.target.classList.contains("sk_rss_lidel")){
					SK_apps_rss.rssDel(e);
				}
				if(e.target.name=="n_closebox"){
					SK_apps_rss.cons.config[e.target.name]=e.target.checked;
					SK_apps_rss.saveConf();
				}
				break;
			case"change":
				if(e.target.classList.contains("sk_box_opt_select")){
					SK_apps_rss.cons.config[e.target.name]=e.target.value;
					SK_apps_rss.saveConf();
				}
				break;
		}
	},
	saveConf:function(){
		var _conf=SK_apps_rss.cons.config;
		chrome.runtime.sendMessage({type:"apps_saveconf",apptype:"rss",config:_conf},function(response){})
	},
	fixURL:function(url){
		var fixstrs=["http://","https://"];
		var theFlag=false;
		for(var i=0;i<fixstrs.length;i++){
			if(url.indexOf(fixstrs[i])==0){
				theFlag=true;
				break;
			}
		}
		if(!theFlag){
			return "http://"+url;
		}else{
			return url;
		}
	},
	rssDel:function(e){
		chrome.storage.local.get(function(items){
			var theid=e.target.parentNode.dataset.id;
			if(!items.apps.rss.feedtitle[theid]){
			}else{
				items.apps.rss.feedtitle.splice(theid,1);
				chrome.storage.local.set(items);
			}
			SK_apps_rss.cons.config.feed.splice(theid,1);
			SK_apps_rss.saveConf();
			e.target.parentNode.remove();
		})
	},
	rssAdd:function(e){
		var dom=sde.apps.getAPPboxEle(e);
		var domadd=dom.querySelector(".sk_rss_menu_sub_text");
		var domlist=dom.querySelector(".sk_rss_menu_list");
		if(!domadd.value){return;}
		var theurl=SK_apps_rss.fixURL(domadd.value);
		var domli=sde.apps.domCreate("li",{setName:["className","title"],setValue:["sk_rss_menuli",theurl]},theurl,null,{setName:["url","id"],setValue:[theurl,SK_apps_rss.cons.config.feed.length]});
		var domdel=sde.apps.domCreate("span",{setName:["className"],setValue:["sk_rss_lidel"]},"x");
		domli.appendChild(domdel);
		domlist.appendChild(domli);		
		domdel.addEventListener("click",SK_apps_rss.handleEvent,false);	
		domli.addEventListener("click",this,false);
		SK_apps_rss.cons.config.feed.push(theurl);
		SK_apps_rss.saveConf();
		domadd.value="";
	},
	rssSwitch:function(e,url){
		var rssheaddom=sde.apps.getAPPboxEle(e).querySelector(".sk_rss_rsshead");
		rssheaddom.innerHTML=""
		sde.apps.getAPPboxEle(e).querySelector(".sk_rss_box").innerHTML='<span style="color: #3698F9;">Loading </span><img style="display: inline-block;margin-bottom: -10px;" src="'+chrome.runtime.getURL("/image/loading.gif")+'" />';
		SK_apps_rss.showMenu(e);
		SK_apps_rss.rss(e.target,url);
	},
	showMenu:function(e){
		var dommenu=sde.apps.getAPPboxEle(e).querySelector(".sk_rss_menu");
		var _conf=window.getComputedStyle(dommenu).opacity==0?true:false
		if(_conf){
			dommenu.style.cssText+="display:block;opacity:1;"
		}else{
			dommenu.style.cssText+="display:none;opacity:0;"
		}
	},
	menu:function(dom){
		var domlist=sde.apps.getAPPboxEle(dom).querySelector(".sk_rss_menu_list");
		domlist.innerHTML="";
		chrome.storage.local.get(function(items){
			var feed=SK_apps_rss.cons.config.feed;
			var feedtitle=items.apps.rss.feedtitle;
			for(var i=0;i<feed.length;i++){
				var domli=sde.apps.domCreate("li",{setName:["className","title"],setValue:["sk_rss_menuli",feed[i]]},feedtitle[i]?feedtitle[i]:feed[i],null,{setName:["url","id"],setValue:[feed[i],i]});
				domli.addEventListener("click",SK_apps_rss.handleEvent,false);
				var domdel=sde.apps.domCreate("span",{setName:["className"],setValue:["sk_rss_lidel"]},"x");
				domdel.addEventListener("click",SK_apps_rss.handleEvent,false);
				domli.appendChild(domdel);
				domlist.appendChild(domli);
			}
		})
	},
	rss:function(dom,url){
        xhr=new XMLHttpRequest();
        xhr.open("post",url,"flase");
        xhr.onreadystatechange=function(){
			var rssdom=sde.apps.getAPPboxEle(dom).querySelector(".sk_rss_box");
	        if(xhr.readyState ==4) {
	            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
	            	function replace_cdata(str){
	            		var newstr;
	            			newstr=str.indexOf("<![CDATA[")==0?str.replace("<![CDATA[",""):str;
	            			newstr=newstr.indexOf("]]>")==newstr.length-3?newstr.replace("]]>",""):newstr;
	            		return newstr;
	            	}
	                var OBJ=[];
			            OBJ.length=0;
			        if(xhr.responseXML){
			        	var theResponse=xhr.responseXML
			        }else{
			        	var theResponse=sde.apps.domCreate("div",null,theResponse,"display:none;");
			        	theResponse.innerHTML=xhr.responseText;
			        }
			        var rss_title=replace_cdata(theResponse.querySelector("channel>title")?theResponse.querySelector("channel>title").innerHTML:"noname");
			        var rss_link=replace_cdata(theResponse.querySelector("channel>link").innerHTML);
			        var rss_img=replace_cdata(theResponse.querySelector("channel>image>url")?theResponse.querySelector("channel>image>url").innerHTML:chrome.runtime.getURL("/image/rss.png"));

			        var items=theResponse.querySelectorAll("item");
			        for(var i=0;i<items.length;i++){
			            var itemele=items[i].childNodes;
			            var theOBJ={};
			            for(var ii=0;ii<itemele.length;ii++){
			                if(itemele[ii].tagName){
			                	var thetext=replace_cdata(itemele[ii].innerHTML);
			                    theOBJ[itemele[ii].tagName.toLowerCase()]=thetext;
			                }
			            }
			            OBJ.push(theOBJ);
			        }

			        //update rsstitle;
					chrome.storage.local.get(function(items){
						var feed=SK_apps_rss.cons.config.feed;
						for(var i=0;i<feed.length;i++){
							if(feed[i]==url){
								items.apps.rss.feedtitle[i]=rss_title;
								break;
							}
						}
						chrome.storage.local.set(items);
						SK_apps_rss.menu(dom)
					})

			        //rss head
			        rssheaddom=sde.apps.getAPPboxEle(dom).querySelector(".sk_rss_head .sk_rss_rsshead");
			        rssheaddom.innerHTML='<img src="'+rss_img+'" /><a href="'+rss_link+'" target="_blank">'+rss_title+'</a>'

			        rssdom.innerHTML="";
			        for(var i=0;i<OBJ.length;i++){
			        	var liobj=sde.apps.domCreate("li",{setName:["className"],setValue:["app_rss_li"]},null,null,{setName:["link"],setValue:[OBJ[i].link]},OBJ[i].title)
			        	rssdom.appendChild(liobj);
			        	liobj.removeEventListener("click",SK_apps_rss.handleEvent,false);
			        	liobj.addEventListener("click",SK_apps_rss.handleEvent,false);
			        }
	            } else {
	                rssdom.innerHTML="Request was unsuccessful, you may try again later. " + xhr.responseText;
	            }
	        }
	    };
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(null);
	},
	openlink:function(e){
		chrome.runtime.sendMessage({type:"apps_action",apptype:"rss",link:e.target.dataset.link},function(response){})
		if(SK_apps_rss.cons.config.n_closebox){
			sde.apps.boxClose(e)
		}
	}
}
chrome.runtime.sendMessage({type:"apps_getvalue",apptype:"rss"},function(response){
	SK_apps_rss.cons.config=response.config;
	chrome.storage.local.get(function(items){
		if(!items.apps){items.apps={}}
		if(!items.apps.rss||!items.apps.rss.feedtitle){
			items.apps.rss={
				feedtitle:SK_apps_rss.cons.config.feed
			}
		}else{
			for(var i=0;i<SK_apps_rss.cons.config.feed.length;i++){
				if(!items.apps.rss.feedtitle[i]){
					items.apps.rss.feedtitle[i]=SK_apps_rss.cons.config.feed[i];
				}
			}	
		}
		chrome.storage.local.set(items);
		SK_apps_rss.initUI();
	})
})

