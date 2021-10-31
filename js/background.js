Array.prototype.contains=function (ele) {
    for (var i=0;i<this.length;i++){
        if (this[i]==ele){
            return true;
        }
	}
	return false;
}
Array.prototype.containsAll=function(ele){
	var arraylen=ele.length;
	if(this.length<arraylen){return false;}
	for(var i=0;i<arraylen;i++){
		if(!this.contains(ele[i])){
			return false;
			break;
		}else{
			if(i==arraylen-1){
				return true;
			}
		}
	}
}
var key;
var defaultConf={
	version:1.0,
	general:{
		timeout:1000,
		icon:true,
		autosave:true,
		notif:false,
		appnotif:true
	},
	action:[
		{
			name: "newtab",
			ctrl: false,
			alt: false,
			shift: false,
			code:[78, 69, 87],
			selects:[
				{type: "n_optype",value: "s_new"},
				{type: "n_position",value: "s_default"},
				{type: "n_pin",value: "s_unpin"}
			]
		},
		{
			name: "close",
			ctrl: false,
			alt: false,
			shift: false,
			code:[67, 76],
			selects:[
				{type: "n_tab",value: "s_current"},
				{type: "n_close_sel",value: "s_default"}
			],
			checks:[
				{type:"n_close_keep",value:false}
			],
		},
		{
			name:"reload",
			ctrl:false,
			shift:false,
			alt:false,
			code:[82,69],
			selects:[
				{type:"n_tab",value:"s_current"},
				{type:"n_reload_clear",value:"s_no"}
			]
		},
		{
			name:"optionspage",
			ctrl:false,
			shift:false,
			alt:false,
			code:[79,80,84]
		},
	],
	engine:[
		{
			name:"Google",
			content:"https://www.google.com/search?q=%s"
		},
		{
			name:"Bing",
			content:"http://www.bing.com/search?q=%s"
		}
	],
	script:[
		{
			name:"test script",
			content:"alert('test')"
		}
	]
}
var config=defaultConf;
var loadconf=function(){
	chrome.storage.sync.get(function(items){
		if(!items.general){
			config=defaultConf;
			chrome.storage.sync.set(JSON.parse(JSON.stringify(defaultConf)),function(){
				//console.log(chrome.runtime.lastError)
			});
		}
		else{
			config=items;
		}
		//sdb.init();
	})
	chrome.storage.local.get(function(items){
		localConf=items;
		// console.log(localConf)
		// if(!localConf.install){
		// 	chrome.tabs.create({url:"../html/options.html"});
		// 	localConf.install=true;
		// 	//chrome.storage.local.set(localConf);
		// 	console.log(localConf)
		// }
	})
}
loadconf();
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
	config.general.icon?sdb.setIcon("normal",tabId):null;
	//show icon
	if(config.general.icon){
		sdb.setIcon("normal",tabId,changeInfo,tab);
		if(changeInfo.status=="complete"){
			chrome.tabs.sendMessage(tabId,{type:"status"},function(response){
				if(!response){
					sdb.setIcon("warning",tabId,changeInfo,tab);
				}
			});
		}	
	}
})
chrome.runtime.onInstalled.addListener(function(details){
	console.log(details.reason);
	chrome.windows.getAll({populate:true},function(windows){
		for(var i=0;i<windows.length;i++){
			for(var ii=0;ii<windows[i].tabs.length;ii++){
				chrome.tabs.executeScript(windows[i].tabs[ii].id,{file:"js/event.js",runAt:"document_start"})
			}
		}
	})
	if(details.reason=="install"){
		chrome.tabs.create({url:"../html/options.html"});
	}
	if(details.reason=="update"){
		// chrome.storage.sync.get(function(items){
		// 	if(DEV||(items.general&&items.general.settings.notif)){
		// 		var notif={
		// 	        type:"list",
		// 	        title:chrome.i18n.getMessage("notif_title"),
		// 	        message:"",
		// 	        iconUrl: "icon.png",
		// 	        items: [],
		// 	        buttons:[
		// 				{title:chrome.i18n.getMessage("notif_btn_open"),iconUrl:"image/open.png"},
		// 				{title:chrome.i18n.getMessage("notif_btn_rate"),iconUrl:"image/star.png"}
		// 			]
		// 		}
		// 		var xhr = new XMLHttpRequest();
		// 		xhr.onreadystatechange=function(){
		// 			if (xhr.readyState == 4){
		// 				var items=JSON.parse(xhr.response);
		// 				for(var i=0;i<items.log[0].content.length;i++){
		// 					notif.items.push({title:i+1+". ",message:items.log[0].content[i]});
		// 				}
		// 				chrome.notifications.create("",notif,function(){})
		// 			}
		// 		}
		// 		xhr.open('GET',"../change.log", true);
		// 		xhr.send();
		// 	}
		// })		
	}
})
var sdb={
	cons:{},
	saveConf:function(){
		chrome.storage.sync.set(JSON.parse(JSON.stringify(config)),function(){
			//sdb.showNotif();
		});
	},
	showNotif:function(txt,type,title){
		var _type=type?type:"basic",
			_title=title?title:sdb.getI18n("msg_notiftitle"),
			_txt=txt?txt:sdb.getI18n("msg_change");
		var notif={
	        	iconUrl:"icon.png",
				type:_type,
				title:_title,
				message:_txt
			};
		chrome.notifications.create("",notif,function(){});
	},
	getI18n:function(str){
		if(!str){return;}
		//console.log(str)
		var i18n;
		// if(["n_stop","n_reload","n_move","n_detach","n_switchtab","n_copytab","n_copytabele_target","n_bookmark","n_savepage","n_mail_target"].contains(str)){
		// 	str="n_close";
		// }

		//lang change
		// if(config.general.settings.lang=="lang_auto"){
		// 	str="tl_"+str;
		// }else{
		// 	str=str;
		// }
		i18n=chrome.i18n.getMessage(str);
		if(!i18n&&str.indexOf("tl_")==0){
			i18n=chrome.i18n.getMessage(str.substr(3));
		}

		var trans=i18n?i18n:str;
		if(str.indexOf("tl_des_")==0||str.indexOf("des_")==0){
			trans="* "+trans;
		}
		//add beta to ext name
		// if(DEV&&str=="ext_name"){
		// 	trans+=" (Beta)"
		// }
		return trans//str.substr(0,4)=="des_"?"* "+trans:trans;
	},
	setIcon:function(status,tabId,changeInfo,tab){
		switch(status){
			case"normal":
				//chrome.pageAction.setIcon({tabId:tab.id,path:"../image/icon_bar.png"});
				break;
			case"warning":
				chrome.pageAction.setIcon({tabId:tab.id,path:"../image/icon_bar_error.png"});
				chrome.pageAction.setTitle({tabId:tab.id,title:"smartKey can't work perfectly in this tab!"})
				break;
		}
		chrome.pageAction.show(tabId);
	},
	getConfELe:function(type,value){
		//getConfELe("selects","n_target")
		var _value="";
		for(var i=0;i<(key[type]?key[type].length:0);i++){
			if(key[type][i].type==value){
				_value=key[type][i].value;
				break;
			}
		}
		value=="n_pin"?(_value=(_value=="s_unpin"?false:true)):null;
		switch(value){
			case"n_reload_clear":
			case"n_winincog":
				_value=_value=="s_no"?false:true;
				break;
		}
		if(type=="ranges"){_value=Number(_value)}
		return _value;
	},
	getId:function(value){
		var theId=[];
		switch(value){
			case"s_default":
				theId.push(value)
				break;
			case"s_current":
				theId.push(sdb.curTab.id);
				break;
			case"s_head":
				theId.push(sdb.curWin.tabs[0].id);
				break;
				chrome.tabs.query({index:0},function(tabs){
					theId.push(tabs[0].id);
				})
				break;
			case"s_last":
				theId.push(sdb.curWin.tabs[sdb.curWin.tabs.length-1].id);
				break;
			case"s_left":
				if(sdb.curTab.index==0){
					theId.push(sdb.curWin.tabs[sdb.curWin.tabs.length-1].id);
					break;
				}
				for(var i=0;i<sdb.curWin.tabs.length&&sdb.curWin.tabs.length>1;i++){
					if(sdb.curWin.tabs[i].index==sdb.curTab.index-1){
						theId.push(sdb.curWin.tabs[i].id);
						break;
					}
				}
				break;
			case"s_right":
				if(sdb.curTab.index==sdb.curWin.tabs.length-1){
					theId.push(sdb.curWin.tabs[0].id);
					break;
				}
				for(var i=0;i<sdb.curWin.tabs.length&&sdb.curWin.tabs.length>1;i++){
					if(sdb.curWin.tabs[i].index==sdb.curTab.index+1){
						theId.push(sdb.curWin.tabs[i].id);
						break;
					}
				}
				break;
			case"s_lefts":
				if(sdb.curTab.index==0){
					theId=false;
					break;
				}
				for(var i=0;i<sdb.curWin.tabs.length&&sdb.curWin.tabs.length>1;i++){
					if(sdb.curWin.tabs[i].index<sdb.curTab.index){
						theId.push(sdb.curWin.tabs[i].id);
					}
				}
				break;
			case"s_rights":
				if(sdb.curTab.index==sdb.curWin.tabs.length-1){
					theId=false;
					break;
				}
				for(var i=0;i<sdb.curWin.tabs.length&&sdb.curWin.tabs.length>1;i++){
					if(sdb.curWin.tabs[i].index>sdb.curTab.index){
						theId.push(sdb.curWin.tabs[i].id);
					}
				}
				break;
			case"s_others":
				if(sdb.curWin.tabs.length==1){
					theId=false;
					break;
				}
				for(var i=0;i<sdb.curWin.tabs.length&&sdb.curWin.tabs.length>1;i++){
					if(sdb.curWin.tabs[i].index!=sdb.curTab.index){
						theId.push(sdb.curWin.tabs[i].id);
					}
				}
				break;
			case"s_all":
				for(var i=0;i<sdb.curWin.tabs.length;i++){
					theId.push(sdb.curWin.tabs[i].id);
				}
				break;
		}
		return theId;
	},
	getIndex:function(value,type){
		var _new=(type=="new"?true:false);
		var theIndex=[];
		switch(value){
			case"s_current":
				theIndex.push(sdb.curTab.index);
				break;
			case"s_default":
				theIndex.push(false);
				break;
			case"s_head":
				theIndex.push(0);
				break;
			case"s_last":
				if(_new){
					theIndex.push(sdb.curWin.tabs.length);
					break;
				}
				theIndex.push(sdb.curWin.tabs.length-1);
				break;
			case"s_left":
				if(_new){
					theIndex.push(sdb.curTab.index==0?0:sdb.curTab.index);
					break;
				}
				theIndex.push(sdb.curTab.index==0?sdb.curWin.tabs.length-1:sdb.curTab.index-1);
				break;
			case"s_right":
				if(_new){
					theIndex.push(sdb.curTab.index==sdb.curWin.tabs.length-1?sdb.curWin.tabs.length:sdb.curTab.index+1);
					break;
				}
				theIndex.push(sdb.curTab.index==sdb.curWin.tabs.length-1?0:sdb.curTab.index+1);
				break;
		}
		return theIndex;
	},
	checkPermission:function(thepers,theorgs,theFunction){
		if(thepers&&theorgs){
			chrome.permissions.contains({permissions: thepers,origins:theorgs},function(result){checkPers(result)})
		}else if(thepers){
			chrome.permissions.contains({permissions: thepers},function(result){checkPers(result)})
		}else if(theorgs){
			chrome.permissions.contains({origins:theorgs},function(result){checkPers(result)})
		}
		var getPers=function(thepers,theorgs){
			var transOBJ={};
				transOBJ.permsg={};
				thepers?transOBJ.permsg.thepers=thepers:null;
				theorgs?transOBJ.permsg.theorgs=theorgs:null;
			chrome.storage.local.set(transOBJ,function(){});
			chrome.windows.create({url:"../html/getpermissions.html",focused:true,type:"popup",width:800,height:500})
			return
			chrome.tabs.create({url:"../html/getpermissions.html"})
		}
		var checkPers=function(result){
			if (result) {
				theFunction();
		    }else {
		    	getPers(thepers,theorgs);
		    }
		}
	},
	open:function(url,target,index,pin){
		console.log("url:"+url+"\ntarget:"+target+"\nindex:"+index+"\npin:"+pin);
		if(!url){return;}
		var theTarget=target,
			theURL=url,
			theIndex=index,
			thePin=pin;
		if(theTarget=="s_current"){
			chrome.tabs.update({url:theURL,pinned:thePin});
			return;
		}else if(theTarget=="s_incog"){
			chrome.windows.getAll(function(windows){
				var _flag=false;
				for(var i=0;i<windows.length;i++){
					if(windows[i].incognito/*||i==windows.length-1*/){
						_flag=windows[i].id;
						break;
					}
				}
				if(_flag===0||_flag){
					chrome.windows.update(_flag,{focused:true});
					chrome.tabs.create({windowId:_flag,url:theURL,active:theTarget=="s_back"?false:true,index:theIndex,pinned:thePin})
				}else{
					chrome.windows.create({url:theURL,incognito:true},function(window){
						chrome.tabs.update({pinned:thePin});
					})
				}
			})
			return;
		}
		(theIndex||theIndex===0)?chrome.tabs.create({url:theURL,active:theTarget=="s_back"?false:true,index:theIndex,pinned:thePin}):chrome.tabs.create({url:theURL,active:theTarget=="s_back"?false:true,pinned:thePin})
	},
	insertTest:function(appname){
		chrome.tabs.executeScript({code:'chrome.runtime.sendMessage({type:"apps_test",apptype:"'+appname+'",value:sde.apps.enable},function(response){})',runAt:"document_start"});	
	},
	insertBasic:function(){
		return;
	},
	initAppconf:function(appname){
		if(!config.apps){config.apps={}}
		if(!config.apps[appname]/*||!config.apps[appname].config*/){
			config.apps[appname]=appConfmodel[appname];
			//config.apps[appname].config=appConfmodel[appname];
			chrome.storage.sync.set(JSON.parse(JSON.stringify(config)),function(){});
		}
	},
	action:{
		none:function(){
			return;
		},
		back:function(){//chk
			chrome.tabs.executeScript({code:"window.history.go(-1)",runAt:"document_start"},function(){})
		},
		forward:function(){//chk
			chrome.tabs.executeScript({code:"window.history.go(+1)",runAt:"document_start"},function(){})
		},
		scroll:function(){
			var effect=false;
			for(var i=0;i<(key.selects?key.selects.length:0);i++){
				if(key.selects[i].type=="n_effect"){
					var effect=key.selects[i].value=="s_on"?true:false;
					continue;
				}
				if(key.selects[i].type=="n_scroll"){
					var scrolltype=key.selects[i].value.substr(2);
					continue;
				}
			}
			sdb.cons.scroll={};
			sdb.cons.scroll.effect=effect;
			sdb.cons.scroll.type=scrolltype;//key.name;
			chrome.tabs.executeScript({file:"js/inject/scroll.js",runAt:"document_start"},function(){})
		},
		reload:function(){//chk
			var ids=sdb.getId(sdb.getConfELe("selects","n_tab"));
			var clear=sdb.getConfELe("selects","n_reload_clear");
			for(var i=0;ids&&i<ids.length;i++){
				chrome.tabs.reload(ids[i],{bypassCache:clear});
			}
		},
		stop:function(){//chk
			var ids=sdb.getId(sdb.getConfELe("selects","n_stop"));
			for(var i=0;ids&&i<ids.length;i++){
				chrome.tabs.executeScript(ids[i],{code:"window.stop()",runAt:"document_start"},function(){})
			}
		},		
		next:function(){
			if(key.npok){
				sdb.open(key.url,sdb.cons.next.target,sdb.cons.next.index,sdb.cons.next.pin);
				sdb.cons.next={};
			}else{
				sdb.cons.next={};
				sdb.cons.next.index=sdb.getIndex(sdb.getConfELe("selects","n_position"),"new")[0];
				sdb.cons.next.pin=sdb.getConfELe("selects","n_pin");
				sdb.cons.next.target=sdb.getConfELe("selects","n_optype");
				sdb.cons.next.keywds=(sdb.getConfELe("texts","n_npkey_n")||sdb.getConfELe("texts","n_npkey_p")).split(",");
				chrome.tabs.executeScript({file:"js/inject/np.js",runAt:"document_start"},function(){})				
			}
		},
		previous:function(){
			sdb.action.next();
		},
		close:function(){
			var ids=sdb.getId(sdb.getConfELe("selects","n_tab")),
				selid=sdb.getId(sdb.getConfELe("selects","n_close_sel"))[0],
				selvalue=sdb.getConfELe("selects","n_close_sel");
			if(sdb.curWin.tabs.length==1&&!sdb.curWin.incognito&&key.checks[0].value){
				chrome.tabs.create({},function(){
					chrome.tabs.remove(ids,function(){
						selvalue!="s_default"?chrome.tabs.update(selid,{active:true}):null;
					});
				})
			}else{
				chrome.tabs.remove(ids,function(){
					selvalue!="s_default"?chrome.tabs.update(selid,{active:true}):null;
				});	
			}
		},
		newtab:function(){//chk
			var theTarget=sdb.getConfELe("selects","n_optype"),
				theIndex=sdb.getIndex(sdb.getConfELe("selects","n_position"),"new")[0],
				thePin=sdb.getConfELe("selects","n_pin");
			sdb.open("chrome://newtab",theTarget,theIndex,thePin);
		},
		reopen:function(){
			var theFunction=function(){
				chrome.sessions.restore();
			}
			var thepers=["sessions"];
			var theorgs;
			sdb.checkPermission(thepers,theorgs,theFunction);
		},
		open:function(){//chk
			sdb.open(sdb.getConfELe("texts","n_url"),sdb.getConfELe("selects","n_optype"),sdb.getIndex(sdb.getConfELe("selects","n_position"),"new")[0],sdb.getConfELe("selects","n_pin"));
		},
		openclip:function(){//chk
			var _url,
				clipOBJ=document.body.appendChild(document.createElement("textarea"));
			clipOBJ.focus();
			document.execCommand('paste', false, null);
			_url=clipOBJ.value;
			clipOBJ.remove();

			sdb.open(_url,sdb.getConfELe("selects","n_optype"),sdb.getIndex(sdb.getConfELe("selects","n_position"),"new")[0],sdb.getConfELe("selects","n_pin"));
		},
		switchtab:function(){
			var id=sdb.getId(sdb.getConfELe("selects","n_tab_lrhl"))[0];
			chrome.tabs.update(id,{active:true});
		},
		move:function(){
			var index=sdb.getIndex(sdb.getConfELe("selects","n_position_lrhl"))[0];
			chrome.tabs.move(sdb.curTab.id,{index:index});
		},
		detach:function(){
			if(sdb.curWin.tabs.length==1){return;}
			var _target=sdb.getConfELe("selects","n_tab"),
				ids=sdb.getId(_target);
			if(ids==false||_target=="s_all"){return;}
			chrome.windows.create({tabId:ids[0]},function(window){
				if(ids.length>1){
					ids.splice(0,1);
					chrome.tabs.move(ids,{windowId:window.id,index:-1})
				}
			})
			return;
		},
		pin:function(){
			var thePin=sdb.curTab.pinned?false:true;
			chrome.tabs.update({pinned:thePin},function(tab){})
		},
		duplicate:function(){
			chrome.tabs.duplicate(sdb.curTab.id,function(tab){})
		},
		copytabele:function(){
			var theFunction=function(){
				var theIndex=sdb.getIndex(sdb.getConfELe("selects","n_tab_single"))[0];
				chrome.tabs.query({index:theIndex},function(tabs){
					var cptarget=tabs[0];
					var cpcontent=sdb.getConfELe("selects","n_copytabele_content");
					var clipOBJ=document.body.appendChild(document.createElement("textarea"));
					switch(cpcontent){
						case"s_tabele_title":
							clipOBJ.value=cptarget.title;
							break;
						case"s_tabele_url":
							clipOBJ.value=cptarget.url;
							break;
						case"s_tabele_aslnk":
							clipOBJ.value='<a href="'+cptarget.url+'">'+cptarget.title+'<\/a>';
							break;
					}	
					clipOBJ.select();
					document.execCommand('copy', false, null);
					clipOBJ.remove();				
				})
			}
			var thepers=["clipboardRead"];
			var theorgs;
			sdb.checkPermission(thepers,theorgs,theFunction);
		},
		newwin:function(){//chk
			var theType=sdb.getConfELe("selects","n_wintype").substr(2),
				theIncog=sdb.getConfELe("selects","n_winincog");
			chrome.windows.create({type:theType,incognito:theIncog});
		},
		closewin:function(){
			var theWin=sdb.getConfELe("selects","n_win");
			if(theWin=="s_current"){
				chrome.windows.remove(sdb.curWin.id)
			}else{
				chrome.windows.getAll({populate:true},function(windows){
					for(var i=0;i<windows.length;i++){
						if(theWin=="s_others"){
							if(windows[i].id!=sdb.curWin.id){
								chrome.windows.remove(windows[i].id);
							}
						}else{
							chrome.windows.remove(windows[i].id);
						}
					}
				})
			}
		},
		max:function(){
			chrome.windows.update(sdb.curWin.id,{state:(sdb.curWin.state=="normal"?"maximized":"normal")},function(window){
				sdb.curWin.state=window.state;
			})
		},
		min:function(){
			chrome.windows.update(sdb.curWin.id,{state:"minimized"})			
		},
		full:function(){
			var t;
			if(sdb.curWin.state!="fullscreen"){
				sdb.cons.winstate=sdb.curWin.state;
				t="fullscreen";
			}else{
				t=sdb.cons.winstate;
			}
			chrome.windows.update(sdb.curWin.id,{state:t},function(window){})
		},
		copytxt:function(){//?????????????????
			if(!key.selEle.txt){return;}
			var theFunction=function(){
				var clipOBJ=document.body.appendChild(document.createElement("textarea"));
				clipOBJ.value=key.selEle.txt;
				clipOBJ.select();
				document.execCommand('copy', false, null);
				clipOBJ.remove();				
			}
			var thepers=["clipboardRead"];
			var theorgs;
			sdb.checkPermission(thepers,theorgs,theFunction);
		},
		txtsearch:function(){//chk
			if(!key.selEle.txt){return;}
			var engine,theURL,enTxt;
			var theEngine=sdb.getConfELe("selects","n_engine"),
				theTarget=sdb.getConfELe("selects","n_optype"),
				theCode=sdb.getConfELe("selects","n_encoding"),
				theIndex=sdb.getIndex(sdb.getConfELe("selects","n_position"),"new")[0],
				thePin=sdb.getConfELe("selects","n_pin");
			switch(theCode){
				case"s_unicode":
					enTxt=escape(key.selEle.txt);
					break;
				case"s_uri":
					enTxt=encodeURI(key.selEle.txt);
					break;
				case"s_uric":
					enTxt=encodeURIComponent(key.selEle.txt);
					break;
				default:
					enTxt=key.selEle.txt;
					break;
			}
			var _engine=config.engine[theEngine].content;
			theURL=_engine.replace(/%s/g,enTxt);

			sdb.open(theURL,theTarget,theIndex,thePin);
		},
		tts:function(){
			if(!key.selEle.txt){return;}
			var theFunction=function(){
				var _text=key.selEle.txt,
					_voicename=sdb.getConfELe("selects","n_voicename"),
					_gender=sdb.getConfELe("selects","n_gender").substr(2),
					_rate=sdb.getConfELe("ranges","n_rate"),
					_pitch=sdb.getConfELe("ranges","n_pitch"),
					_volume=sdb.getConfELe("ranges","n_volume");
				console.log(_rate)
				chrome.tts.speak(_text,{voiceName:_voicename,gender:_gender,rate:_rate,pitch:_pitch,volume:_volume})
			}
			var thepers=["tts"];
			var theorgs;
			sdb.checkPermission(thepers,theorgs,theFunction);
		},
		crpages:function(){
			var theURL="",
				theTarget=sdb.getConfELe("selects","n_optype"),
				_url=sdb.getConfELe("selects","n_crpages"),
				theIndex=sdb.getIndex(sdb.getConfELe("selects","n_position"),"new")[0],
				thePin=sdb.getConfELe("selects","n_pin");
			switch(_url){
				case"s_cr_set":
					theURL="chrome://settings";
					break;
				case"s_cr_ext":
					theURL="chrome://extensions";
					break;
				case"s_cr_history":
					theURL="chrome://historys";
					break;
				case"s_cr_app":
					theURL="chrome://apps";
					break;
				case"s_cr_bookmark":
					theURL="chrome://bookmarks";
					break;
				case"s_cr_dl":
					theURL="chrome://downloads";
					break;
				case"s_cr_flag":
					theURL="chrome://flags";
					break;
			}
			sdb.open(theURL,theTarget,theIndex,thePin);	
		},
		restart:function(){
			chrome.tabs.create({url:"chrome://restart/",active:false})
		},
		exit:function(){
			chrome.tabs.create({url:"chrome://quit/",active:false})
		},
		optionspage:function(){
			var theTarget="s_new",
				theURL="../html/options.html",
				theIndex=false,
				thePin=false;
			sdb.open(theURL,theTarget,theIndex,thePin);
		},
		reloadext:function(){
			chrome.runtime.reload();
		},
		dldir:function(){
			var theFunction=function(){
				chrome.downloads.showDefaultFolder();
			}
			var thepers=["downloads"];
			var theorgs;
			sdb.checkPermission(thepers,theorgs,theFunction);
		},
		capture:function(){
			chrome.tabs.captureVisibleTab({format:"png"},function(dataURL){
				chrome.tabs.create({url:dataURL})
			})
		},
		bookmark:function(){
			var theFunction=function(){
				var ids=sdb.getId(sdb.getConfELe("selects","n_tab"));
				for(var i=0;i<ids.length;i++){
					chrome.tabs.get(ids[i],function(tab){
						chrome.bookmarks.search({url:tab.url},function(nodes){
							if(nodes.length){
								chrome.bookmarks.remove(nodes[0].id);
							}else{
								chrome.bookmarks.create({url:tab.url,title:tab.title})
							}
						})
					})
				}			
			}
			var thepers=["bookmarks"];
			var theorgs;
			sdb.checkPermission(thepers,theorgs,theFunction);
		},
		script:function(){
			var _script=sdb.getConfELe("selects","n_script"),
				_jq=sdb.getConfELe("selects","n_jq");
			if(_jq=="s_yes"){
				chrome.tabs.executeScript({file:"js/jquery.min.js",runAt:"document_start"},function(){
					chrome.tabs.executeScript({code:config.script[_script].content,runAt:"document_start"},function(){})
				})
			}else{
				inject();
				chrome.tabs.executeScript({code:config.script[_script].content,runAt:"document_start"},function(){})
			}
		},
		source:function(){
			var theTarget=sdb.getConfELe("selects","n_optype"),
				theURL="view-source:"+sdb.curTab.url,
				theIndex=sdb.getIndex(sdb.getConfELe("selects","n_position"),"new")[0];
				thePin=sdb.getConfELe("selects","n_pin");
			sdb.open(theURL,theTarget,theIndex,thePin);
		},
		zoom:function(){
			//with chrome.tabs.setzoom
			sdb.cons.zoom=sdb.getConfELe("selects","n_zoom");
			chrome.tabs.executeScript({file:"js/inject/zoom.js",runAt:"document_start"},function(){})
		},
		savepage:function(){
			var theFunction=function(){
				var ids=sdb.getId(sdb.getConfELe("selects","n_tab"));
				for(var i=0;i<ids.length;i++){
					chrome.tabs.get(ids[i],function(tab){
						chrome.pageCapture.saveAsMHTML({tabId:tab.id},function(data){
							var url = window.URL.createObjectURL(data);
							chrome.downloads.download({url:url,filename:tab.title+".mhtml"})
						})
					})
				}				
			}
			var thepers=["pageCapture","downloads"];
			var theorgs;
			sdb.checkPermission(thepers,theorgs,theFunction);
		},
		mail:function(){
			var urls=[],titles=[];
			var _mail=sdb.getConfELe("selects","n_mail"),
				_domain=sdb.getConfELe("texts","n_mail_domain"),
				_prefix=sdb.getConfELe("texts","n_mail_prefix"),
				_index=sdb.getIndex(sdb.getConfELe("selects","n_tab"));
			console.log(_index)
			var _sub=_prefix,
				_body="";
			for(var i=0;i<_index.length;i++){
				urls.push(sdb.curWindow.tabs[_index[i]].url);
				titles.push(sdb.curWindow.tabs[_index[i]].title);
			}
			titles.length==1?_sub+=titles[0]:_sub+=titles.length+" "+"pages";
			for(var i=0;i<titles.length;i++){
				_body+=titles[i]+" - "+encodeURIComponent(urls[i])+"        ";
			}

			if(_mail=="s_defaultmail"){
				chrome.tabs.update(sdb.curTab.id,{url:"mailto:?subject="+_sub+'&body='+_body});
			}else{
				chrome.tabs.create({url:"https://mail.google.com"+(_mail=="s_gmailapps"?"/a/"+_domain:"")+"/mail/?view=cm&fs=1&tf=1&su="+_sub+'&body='+_body})
			}
		},
		print:function(){
			chrome.tabs.executeScript({code:"window.print()",runAt:"document_start"},function(){})
		},
		/////////////// mini apps
		rss:function(){
			var _appname="rss";
			sdb.initAppconf(_appname);
			var _obj={};
			sdb.cons[_appname]=_obj;
			sdb.insertTest(_appname);
		},
		tablist:function(call_appslist){
			var _appname="tablist";
			sdb.initAppconf(_appname);
			var _obj={
				curtab:sdb.curTab,
				list:[]
			}
			chrome.tabs.query({currentWindow:true},function(tabs){
				_obj.list=tabs;
				sdb.cons[_appname]=_obj;
				sdb.insertTest(_appname);	
			})
		},
		random:function(){
			var _appname="random";
			//sdb.initAppconf(_appname);
			sdb.insertTest(_appname);
		},
		extmgm:function(){
			var theFunction=function(){
				var _appname="extmgm";
				sdb.initAppconf(_appname);
				var _obj={
					ext_enabled:[],
					ext_disabled:[]
				}
				chrome.management.getAll(function(ext){
					for(var i=0;i<ext.length;i++){
						if(ext[i].type=="extension"){
							if(ext[i].enabled){
								if(ext[i].id!=sdb.extID){_obj.ext_enabled.push(ext[i]);}
							}else{
								_obj.ext_disabled.push(ext[i]);
							}
						}
					}
					sdb.cons[_appname]=_obj;
					sdb.insertTest(_appname);		
				})				
			}

			var thepers=["management"];
			var theorgs;
			sdb.checkPermission(thepers,theorgs,theFunction);
		},
		base64:function(){
			sdb.insertTest("base64");
		},
		qr:function(){
			var _appname="qr";
			var _obj={
				seltxt:key.selEle.txt
			}
			sdb.cons[_appname]=_obj;
			sdb.insertTest(_appname);
		},
		numc:function(){
			var _appname="numc";
			sdb.insertTest(_appname);
		},
		speaker:function(){
			var theFunction=function(){
				var _appname="speaker";
				sdb.initAppconf(_appname);
				var _obj={
					voicename:[],
					seltxt:key.selEle.txt
				}
				chrome.tts.getVoices(function(voice){
					for(var i=0;i<voice.length;i++){
						if(voice[i].voiceName=="native"){
							_obj.voicename.splice(0,0,voice[i].voiceName);
						}else{
							_obj.voicename.push(voice[i].voiceName)
						}
					}
					sdb.cons[_appname]=_obj;
					sdb.insertTest(_appname);
				})
			}
			var thepers=["tts"];
			var theorgs;
			sdb.checkPermission(thepers,theorgs,theFunction);
		},
		recentbk:function(call_appslist){
			var theFunction=function(){
				var _appname="recentbk";
				sdb.initAppconf(_appname);
				var _obj={}
				chrome.bookmarks.getRecent(parseInt(config.apps.recentbk.n_num),function(bkArray){
					_obj.bk=bkArray;
					sdb.cons[_appname]=_obj;
					sdb.insertTest(_appname);	
				})
			}
			var thepers=["bookmarks"];
			var theorgs;
			sdb.checkPermission(thepers,theorgs,theFunction);
		},
		recentht:function(call_appslist){
			var theFunction=function(){
				var _appname="recentht";
				sdb.initAppconf(_appname);
				var _obj={}
				chrome.history.search({text:"",maxResults:parseInt(config.apps.recentht.n_num)},function(items){
					_obj.ht=items;
					sdb.cons[_appname]=_obj;
					sdb.insertTest(_appname);
				})
			}
			var thepers=["history"];
			var theorgs;
			sdb.checkPermission(thepers,theorgs,theFunction);
		},
		recentclosed:function(call_appslist){
			var theFunction=function(){
				var _appname="recentclosed";
				sdb.initAppconf(_appname);
				var _obj={
					tabs:[]
				}
				chrome.sessions.getRecentlyClosed({maxResults:parseInt(config.apps[_appname].n_num)},function(items){
					_obj.tabs=items;
					sdb.cons[_appname]=_obj;
					sdb.insertTest(_appname);
				})
			}

			var thepers=["sessions"];
			var theorgs;
			sdb.checkPermission(thepers,theorgs,theFunction);
		},
		synced:function(){
			var theFunction=function(){
				var _appname="synced";
				sdb.initAppconf(_appname);
				var _obj={
					sync:[]
				}
				chrome.sessions.getDevices(function(items){
					_obj.sync=items;
					sdb.cons[_appname]=_obj;
					sdb.insertTest(_appname);
				})				
			}
			var thepers=["sessions"];
			var theorgs;
			sdb.checkPermission(thepers,theorgs,theFunction);
		},
		appslist:function(){
			var _appname="appslist";
			sdb.initAppconf(_appname);
			var _obj={
				apps:["rss","tablist","random","extmgm","recentbk","recentht","recentclosed","synced","base64","qr","numc","speaker"]
			}
			sdb.cons[_appname]=_obj;
			sdb.insertTest(_appname);
		},
	},
	apps_action:function(message,sendResponse){
		console.log(message)
		switch(message.apptype){
			case"rss":
				var appsconf=config.apps[message.apptype];
				var theURL=message.link,
					theTarget=appsconf.n_optype;
					theIndex=sdb.getIndex(appsconf.n_position,"new")[0];
					thePin=appsconf.n_pin=="s_unpin"?false:true;
				sdb.open(theURL,theTarget,theIndex,thePin);
				break
				chrome.windows.getCurrent({populate:true},function(window){
					sub.curWin=window;
					chrome.tabs.query({active:true,currentWindow:true},function(tabs){
						sub.curTab=tabs[0];
						var appsconf=config.apps[message.apptype].config;
						var theURL=message.link,
							theTarget=appsconf.n_optype;
							theIndex=sdb.getIndex(appsconf.n_position,"new");
							thePin=appsconf.n_pin=="s_unpin"?false:true;
						sub.open(theURL,theTarget,theIndex,thePin);
					})
				})
				break;
			case"recentbk":
			case"recentht":
				var appsconf=config.apps[message.apptype];
				var theURL=message.link,
					theTarget=appsconf.n_optype,
					theIndex=sdb.getIndex(appsconf.n_position,"new")[0],
					thePin=appsconf.n_pin=="s_unpin"?false:true;
				sdb.open(theURL,theTarget,theIndex,thePin);
				break;
			case"tablist":
				if(message.actiontype=="list_switch"){
					message.id?chrome.tabs.update(Number(message.id),{active:true}):null;
				}else{
					message.id?chrome.tabs.remove(Number(message.id)):null;
				}
				break;
			case"extmgm":
				switch(message.actiontype){
					case"enable":
					case"disable":
						chrome.management.setEnabled(message.id,message.actiontype=="enable"?true:false,function(){})
						sendResponse({type:"apps_action",actionDone:true});
						break;
					case"disableall":
						for(var i=0;i<sub.cons.extmgm.ext_enabled.length;i++){
							console.log(sub.cons.extmgm.ext_enabled[i].id)
							chrome.management.setEnabled(sub.cons.extmgm.ext_enabled[i].id,false);
						}
						sendResponse({type:"apps_action",actionDone:true});
						break;
				}
				break;
			case"recentclosed":
			case"synced":
				chrome.sessions.restore(message.id);
				break;
			case"appslist":
				sdb.action[message.id](true);
				break;
			case"speaker":
				switch(message.value.type){
					case"play":
						if(!message.value.txt){return;}
						var _conf=config.apps[message.apptype];
						var text=message.value.txt,
							voicename=_conf.n_voicename,
							gender=_conf.n_gender,
							rate=_conf.n_rate,
							pitch=_conf.n_pitch,
							volume=_conf.n_volume;
						console.log(text+voicename+gender+rate);
						chrome.tts.speak(text,{voiceName:voicename,gender:gender,rate:rate,pitch:pitch,volume:volume})
						break;
					case"pause":
						chrome.tts.pause()
						break;
					case"resume":
						chrome.tts.resume()
						break;
					case"stop":
						chrome.tts.stop()
						break;
				}
				break;
		}
	},
}
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	console.log(message.type)
	if(message.type=="getdefaultconf"){
		sendResponse(defaultConf);
		return;
	}
	if(message.type=="reloadconf"){
		loadconf();
		chrome.windows.getAll({populate:true},function(windows){
			for(var i=0;i<windows.length;i++){
				for(var ii=0;ii<windows[i].tabs.length;ii++){
					chrome.tabs.sendMessage(windows[i].tabs[ii].id,{type:"reloadconf"});
				}
			}
		})
		return;
	}
	if(message.type=="getappconf"){
		console.log(sdb.cons[message.apptype])
		sendResponse(sdb.cons[message.apptype]);
		return;
	}
	if(message.type=="apps_test"){
		console.log(message)
		if(!message.value){
			chrome.tabs.insertCSS({file:"css/apps_basic.css",runAt:"document_start"},function(){})
			chrome.tabs.executeScript({file:"js/apps_basic.js",runAt:"document_start"},function(){})
		}
		// if(sdb.cons.insertapp.name=="base64"){
		// 	chrome.tabs.executeScript({file:"js/base64.min.js",runAt:"document_start"},function(){})
		// 	chrome.tabs.insertCSS({file:"css/inject/"+sdb.cons.insertapp.name+".css",runAt:"document_start"},function(){});
		// 	chrome.tabs.executeScript({file:"js/inject/"+sdb.cons.insertapp.name+".js",runAt:"document_start"},function(){})
		// }else if(sdb.cons.insertapp.name=="qr"){
		// 	chrome.tabs.executeScript({file:"js/jquery.min.js",runAt:"document_start"},function(){})
		// 	chrome.tabs.executeScript({file:"js/jquery.qrcode.min.js",runAt:"document_start"},function(){})
		// 	chrome.tabs.insertCSS({file:"css/inject/"+sdb.cons.insertapp.name+".css",runAt:"document_start"},function(){});
		// 	chrome.tabs.executeScript({file:"js/inject/"+sdb.cons.insertapp.name+".js",runAt:"document_start"},function(){})
		//}
		if(message.apptype=="base64"){
			chrome.tabs.executeScript({file:"js/base64.min.js",runAt:"document_start"},function(){})
		}else if(message.apptype=="qr"){
			chrome.tabs.executeScript({file:"js/jquery.min.js",runAt:"document_start"},function(){});
			chrome.tabs.executeScript({file:"js/jquery.qrcode.min.js",runAt:"document_start"},function(){})
		}
		console.log(message)
		chrome.tabs.insertCSS({file:"css/inject/"+message.apptype+".css",runAt:"document_start"},function(){});
		chrome.tabs.executeScript({file:"js/inject/"+message.apptype+".js",runAt:"document_start"},function(){})
		return;
	}
	if(message.type=="apps_getvalue"){
		switch(message.apptype){
			case"recentht":
			case"recentbk":
			case"tablist":
			case"extmgm":
			case"recentclosed":
			case"synced":
			case"appslist":
			case"base64":
			case"qr":
			case"numc":
			case"speaker":
			case"rss":
				sendResponse({type:message.apptype,config:config.apps[message.apptype],value:sdb.cons[message.apptype]})
				break;
			// case"rss":
			// 	sendResponse({type:message.type,config:config.apps[sub.cons.insertapp.name],value:sub.cons[sub.cons.insertapp.name]});
			// 	break;
		}
		return
	}
	if(message.type=="apps_action"){
		sdb.apps_action(message,sendResponse);
		return;
	}
	if(message.type=="apps_saveconf"){
		console.log(message.apptype);
		console.log(message.config);
		config.apps[message.apptype]=message.config;
		sdb.saveConf();
		sdb.showNotif();
		return;
	}

	//action
	key=message;
	console.log(key);
	sdb.extID=sender.id;
	chrome.windows.getCurrent({populate:true},function(window){
		sdb.curWin=window;
		chrome.tabs.query({active:true,currentWindow:true},function(tabs){
			sdb.curTab=tabs[0];
			sdb.action[key.name]();
		})
	})
	// if(message.type=="action"){
	// 	for(var i=0;i<config.action.length;i++){
	// 		if(message.ctrl==config.action[i].ctrl&&message.code.toString()==config.action[i].code.toString()){
	// 			sdb.action[config.action[i].name]();
	// 			break;
	// 		}
	// 	}
	// }
})

var appConfmodel={
	rss:{feed:["http://news.google.com/news?cf=all&ned=us&hl=en&output=rss"],n_optype:"s_back",n_position:"s_default",n_pin:"s_unpin",n_closebox:false},
	tablist:{n_closebox:true},
	recentbk:{n_optype:"s_back",n_position:"s_default",n_pin:"s_unpin",n_num:10,n_closebox:true},
	recentht:{n_optype:"s_back",n_position:"s_default",n_pin:"s_unpin",n_num:10,n_closebox:true},
	speaker:{n_rate:1,n_pitch:1,n_volume:1,n_gender:"s_female",n_voicename:"native"},
	appslist:{n_closebox:true},
	recentclosed:{n_num:10,n_closebox:true},
	synced:{n_closebox:true}
}
sdb.extID=chrome.runtime.id;