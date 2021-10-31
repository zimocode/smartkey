Array.prototype.contains=function (ele) {
    for (var i=0;i<this.length;i++){
        if (this[i]==ele){
            return true;
        }
	}
	return false;
}
var config,localConf,editMode=false;
var keyMap=[
	{key:"Esc",code:27},
	{key:"F1",code:112},
	{key:"F2",code:113},
	{key:"F3",code:114},
	{key:"F4",code:115},
	{key:"F5",code:116},
	{key:"F6",code:117},
	{key:"F7",code:118},
	{key:"F8",code:119},
	{key:"F9",code:120},
	{key:"F10",code:121},
	{key:"F11",code:122},
	{key:"F12",code:123},
	{key:"Insert",code:45},
	{key:"Delete",code:46},
	{key:"Home",code:36},
	{key:"End",code:35},
	{key:"`",code:192},
	{key:"1",code:49},
	{key:"2",code:50},
	{key:"3",code:51},
	{key:"4",code:52},
	{key:"5",code:53},
	{key:"6",code:54},
	{key:"7",code:55},
	{key:"8",code:56},
	{key:"9",code:57},
	{key:"0",code:48},
	{key:"-",code:189},
	{key:"=",code:187},
	{key:"Backspace",code:8},
	{key:"Tab",code:9},
	{key:"Q",code:81},
	{key:"W",code:87},
	{key:"E",code:69},
	{key:"R",code:82},
	{key:"T",code:84},
	{key:"Y",code:89},
	{key:"U",code:85},
	{key:"I",code:73},
	{key:"O",code:79},
	{key:"P",code:80},
	{key:"[",code:219},
	{key:"]",code:221},
	//{key:"\\",code:220},
	{key:"CapsLock",code:20},
	{key:"A",code:65},
	{key:"S",code:83},
	{key:"D",code:68},
	{key:"F",code:70},
	{key:"G",code:71},
	{key:"H",code:72},
	{key:"J",code:74},
	{key:"K",code:75},
	{key:"L",code:76},
	{key:";",code:186},
	//{key:"'",code:222},
	{key:"Enter",code:13},

	{key:"Z",code:90},
	{key:"X",code:88},
	{key:"C",code:67},
	{key:"V",code:86},
	{key:"B",code:66},
	{key:"N",code:78},
	{key:"M",code:77},
	{key:",",code:188},
	{key:".",code:190},
	{key:"/",code:191},
	{key:"Space",code:32},
	{key:"PageUp",code:33},
	{key:"PageDown",code:34}
	]
var getConf=function(){
	chrome.storage.sync.get(function(items){
		config=items;
	})
	chrome.storage.local.get(function(items){
		localConf=items;
		// if(!localConf.first){
		// 	sdo.first();
		// }
		sdo.init();
	})
}
var actionModel={
	group:["ag_none","ag_nav",/*"ag_scroll",*/"ag_tab","ag_window",/*"ag_copy",*/"ag_txt",/*"ag_lnk","ag_img","ag_apps",*/"ag_chrome","ag_ext","ag_apps","ag_others","ag_exp"/*,"ag_dep"*/],
	action:[
		[//group none
			{name:"none"}
		],
		[//group nav
			{name:"back"},
			{name:"forward"},
			{name:"scroll",selects:["n_scroll","n_effect"]},
			{name:"reload",selects:["n_tab","n_reload_clear"]},
			{name:"stop",selects:["n_tab"]},
			/*{name:"lastlevel"},*/
			{name:"next",selects:["n_optype","n_position","n_pin"],texts:["n_npkey_n"]},
			{name:"previous",selects:["n_optype","n_position","n_pin"],texts:["n_npkey_p"]}
		],
		[//group tab
			{name:"close",selects:["n_tab","n_close_sel"],checks:["n_close_keep"]},
			{name:"newtab",selects:["n_optype","n_position","n_pin"]},
			{name:"reopen"},
			{name:"open",selects:["n_optype","n_position","n_pin"],texts:["n_url"]},
			{name:"openclip",selects:["n_optype","n_position","n_pin"]},
			{name:"switchtab",selects:["n_tab_lrhl"]},
			{name:"move",selects:["n_position_lrhl"]},
			{name:"detach",selects:["n_tab"]},//movetowin
			{name:"pin"},
			{name:"duplicate"},
			{name:"copytabele",selects:["n_tab_single","n_copytabele_content"]}
		],
		[//group window
			{name:"newwin",selects:["n_wintype","n_winincog"]},
			{name:"closewin",selects:["n_win"]},
			{name:"max"},
			{name:"min"},
			{name:"full"}
		],
		[//group txt
			{name:"copytxt"},
			/*{name:"paste"},*/
			{name:"txtsearch",selects:["n_engine","n_encoding","n_optype","n_position","n_pin"]},
			{name:"qr"},
			{name:"tts",selects:["n_voicename","n_gender"],ranges:["n_rate","n_pitch","n_volume"]},
			{name:"speaker"}/**/
		],
		// [//group lnk
		// 	{name:"openlnk",selects:["n_target","n_new_position","n_pin"]},
		// 	{name:"copylnkurl"},
		// 	{name:"copylnktxt"},
		// 	{name:"copylnkaslnk"}/*,
		// 	{name:"copylnkas"}*/
		// ],
		// [//group img
		// 	{name:"openimg",selects:["n_target","n_new_position","n_pin"]},
		// 	{name:"saveimg",selects:["n_dlbar"]},
		// 	{name:"saveimgas",selects:["n_dlbar"]},
		// 	{name:"copyimgurl"},
		// 	{name:"imgsearch",selects:["n_imgengine","n_encoding","n_target","n_new_position","n_pin"]}
		// ],

		[//group chrome
			{name:"crpages",selects:["n_crpages","n_optype","n_position","n_pin"]},
			{name:"restart"},
			{name:"exit"}
		],
		[//group smartup
			{name:"optionspage"},
			{name:"reloadext"}
		],
		[//group apps
			{name:"rss"},
			{name:"tablist"},
			{name:"random"},
			{name:"extmgm"},
			{name:"recentbk"},
			{name:"recentht"},
			{name:"base64"},
			{name:"qr"},
			{name:"numc"},
			{name:"speaker"},
			{name:"appslist"}
			/*{name:"gmail"},
			{name:"ary"},
			{name:"color"},
			{name:"autorelaod"},
			{name:"password"}*/
		],
		[//group others
			{name:"dldir"},
			{name:"capture"},
			{name:"bookmark",selects:["n_tab"]},
			{name:"script",selects:["n_jq","n_script"]},
			{name:"source",selects:["n_optype","n_position","n_pin"]},
			{name:"zoom",selects:["n_zoom"]},
			{name:"savepage",selects:["n_tab"]},
			{name:"mail",selects:["n_mail","n_tab"],texts:["n_mail_prefix","n_mail_domain"]},
			{name:"print"}
			/*,
			{name:"test"}*/
		],
		[//ag_exp
			{name:"recentclosed"},
			{name:"synced"}
		],
		[//deprecated
			{name:"zoom_dep",selects:["n_zoom"]}
		]
	]
}
var moreModel={
	selecttype:["closesel"],
	selects:{
		n_tab:["s_current","s_others","s_all","s_head","s_last","s_left","s_right","s_lefts","s_rights"],
		n_tab_single:["s_current","s_left","s_right","s_head","s_last"],
		n_tab_lrhl:["s_left","s_right","s_head","s_last"],

		n_optype:["s_current","s_new","s_back","s_incog"],

		n_position:["s_default","s_left","s_right","s_head","s_last"],
		n_position_lrhl:["s_left","s_right","s_head","s_last"],

		n_win:["s_current","s_all","s_others"],
		n_wintype:["s_normal","s_popup","s_panel","s_detached_panel"],
		n_winincog:["s_no","s_yes"],

		n_reload_clear:["s_no","s_yes"],
		n_close_sel:["s_default","s_left","s_right","s_head","s_last"],
		n_pin:["s_unpin","s_pinned"],
		n_effect:["s_on","s_off"],
		n_jq:["s_yes","s_no"],
		n_copytabele_content:["s_tabele_title","s_tabele_url","s_tabele_aslnk"],
		n_crpages:["s_cr_set","s_cr_ext","s_cr_history","s_cr_app","s_cr_bookmark","s_cr_dl","s_cr_flag"],
		n_dlbar:["s_yes","s_no"],
		n_encoding:["s_none","s_unicode","s_uri","s_uric"],
		n_zoom:["s_in","s_out","s_reset"],
		n_scroll:["s_up","s_down","s_left","s_right","s_top","s_bottom","s_leftmost","s_rightmost"],
		n_mail:["s_gmail","s_defaultmail","s_gmailapps"],
		n_gender:["s_female","s_male"],
		n_voicename:["native"],
		effect:["on","off"],
		script:[],
		n_engine:[]
	},
	texts:{
		n_npkey_n:"next,pnnext,next ›,›,>",
		n_npkey_p:"previous,pnprev,‹ prev,‹,<",
		n_num:"5",
		n_mail_prefix:"Interesting Page:"
	},
	ranges:{
		n_pitch:1,
		n_volume:1,
		n_rate:1
	}
}
var sdo={
	cons:{
		boxmove:{},
		editedConf:{id:null,type:null,itemtype:null,conf:null}
	},
	init:function(){
		window.addEventListener("click",this,false);
		window.addEventListener("mousemove",this,false);
		window.addEventListener("mousedown",this,false);
		window.addEventListener("mouseup",this,false);
		window.addEventListener("change",this,false);
		window.addEventListener("keypress",this,false);
		window.addEventListener("keydown",this,false)
		sdo.initItem("action");
		sdo.initItem("engine");
		sdo.initItem("script");
		//sdo.initEngine();
		//sdo.initScript();
		sdo.initPer();

		sdo.initValue();
		sdo.initI18n();
		sdo.initLog();
		sdo.initEnd();		
	},
	handleEvent:function(e){
		switch(e.type){
			case"click":
				switch(e.target.id){
					case"box_reset":
						sdo.keyboxReset(e);
						break;
					case"conf_reset":
						sdo.confReset();
						break;
				}
				if(e.target.classList.contains("box_btn_close")||e.target.classList.contains("box_btn_cancel")){
					sdo.boxClose(e);
				}
				if(e.target.classList.contains("tab")){
					sdo.tabChange(e);
				}
				if(e.target.classList.contains("item_edit")){
					sdo.itemEdit(e,"edit");
				}
				if(e.target.classList.contains("btn_add")){
					sdo.itemEdit(e,"add");
				}
				if(e.target.classList.contains("box_btn_save")){
					sdo.itemSave(e);
				}
				if(e.target.classList.contains("item_del")||e.target.classList.contains("box_btn_del")){
					sdo.itemDel(e);
				}
				break;
			case"mousemove":
				if(sdo.cons.boxmove.enable&&(e.target.classList.contains("box_head")||e.target.classList.contains("box_title"))){
					sdo.boxMove(e);
				}
				break;
			case"mousedown":
				if(e.button==0&&(e.target.classList.contains("box_head")||e.target.classList.contains("box_title"))){
					var boxposX=e.target.classList.contains("box_head")?e.target.parentNode.offsetLeft:e.target.parentNode.parentNode.offsetLeft,
						boxposY=e.target.classList.contains("box_head")?e.target.parentNode.offsetTop:e.target.parentNode.parentNode.offsetTop;
					sdo.cons.boxmove.enable=true;
					sdo.cons.boxmove.posX=e.clientX-boxposX;
					sdo.cons.boxmove.posY=e.clientY-boxposY;
				}
				break;
			case"mouseup":
				sdo.cons.boxmove.enable=false;
				break;
			case"change":
				switch(e.target.id){
					case"box_mydes":
						var _dom=sdo.getAPPboxEle(e).querySelector(".box_destext");
						e.target.checked?_dom.style.cssText+="display:block;":_dom.style.cssText+="display:none;"
						break;
					case"conf_import":
						sdo.confImport();
						break;
				}
				if(e.target.classList.contains("box_action")){
					sdo.changeAction(e);
				}
				if(e.target.classList.contains("change")){
					console.log("setChange")
					sdo.setChange(e);
				}
				if(e.target.classList.contains("box_range")){
					e.target.nextSibling.innerHTML=e.target.value;
				}
				break;
			case"keypress":
				//console.log(e)
				//e.preventDefault();
				break;
			case"keydown":
				//if(!e.target.classList.contains("box_keyvalue")){return}
				if(!editMode||e.target.classList.contains("box_text")||e.target.classList.contains("box_note")||e.target.classList.contains("box_destext")){return;}
				e.preventDefault();

				var dombox=document.querySelector("smartkey.sk_apps_edit"),
					domkeybox=dombox.querySelector(".box_keyvalue");
				if(!sdo.cons.editedConf.conf.code){sdo.cons.editedConf.conf.code=[]}
				var _keyarray=["ctrl","alt","shift"];
				for(var i=0;i<_keyarray.length;i++){
					var _dom=dombox.querySelector("#box_"+_keyarray[i]);
					if(e[_keyarray[i]+"Key"]){
						_dom.checked=true;
					}else{
						_dom.checked=false;
					}
				}
				var _key=sdo.codeToKey(e.keyCode);
				domkeybox.value+=_key?(" "+_key):"";
				if(_key){
					sdo.cons.editedConf.conf.code.push(e.keyCode);
				}
				break;
		}
	},
	domCreate:function(edom,eele,einner,ecss,edata,etxt){
		var dom=document.createElement(edom);
		if(eele){
			for (var i = 0;i<eele.setName.length; i++) {
				if(eele.setName[i]=="for"){
				//if(["for","checked"].contains(eele.setName[i])){
					dom.setAttribute(eele.setName[i],eele.setValue[i]);
				}else if(eele.setName[i]=="checked"){
					eele.setValue[i]?dom.setAttribute(eele.setName[i],"checked"):null;
				}else if(eele.setName[i]=="readonly"){
					dom.setAttribute(eele.setName[i],"");
				}else{
					dom[eele.setName[i]]=eele.setValue[i];
				}
			}
		}
		if(einner){dom.innerHTML=einner}
		if(ecss){
			dom.style.cssText+=ecss;
		}
		if(edata){
			for (var i = 0;i<edata.setName.length; i++) {
				dom.dataset[edata.setName[i]]=edata.setValue[i];
			}
		}
		if(etxt){
			dom.innerText=etxt;
		}
		return dom;
	},
	tabChange:function(e){
		var ele=e.target;
		var id=parseInt(ele.dataset.id);
		var tabs=document.querySelectorAll(".tab");
		var sets=document.querySelectorAll(".set");
		for(var i=0;i<sets.length;i++){
			sets[i].style.cssText+="display:none;";
			tabs[i].classList.remove("tab_select");
		}
		sets[id].style.cssText+="display:block;";
		tabs[id].classList.add("tab_select");

		//
		if(id==2){
			sdo.initExportConf();
		}
	},
	formatKey:function(key){
		var _str="";
		for(var i=0;i<key.length;i++){
			_str=(_str?_str+" ":"")+key[i].toString();
		}
		//console.log(_str)
		return _str;
	},
	getKey:function(code){
		if(!code){return ""}
		code=code.toString();
		var codes=code.split(",");
		var keys=[];
		for(var i=0;i<codes.length;i++){
			for(var ii=0;ii<keyMap.length;ii++){
				if(keyMap[ii].code==codes[i]){
					keys.push(keyMap[ii].key);
					break;
				}
			}			
		}
		return keys;
	},
	initValue:function(){
		var doms=document.querySelectorAll(".init");
		for(var i=0;i<doms.length;i++){
			var	_value=config[sdo.getDataset(doms[i],"confobj","value")][sdo.getDataset(doms[i],"confele","value")];
			if(doms[i].tagName.toLowerCase()=="input"&&doms[i].type=="range"){
				doms[i].value=_value;
				doms[i].nextSibling.innerHTML=_value;
				continue;
			}
			if(doms[i].tagName.toLowerCase()=="input"&&doms[i].type=="checkbox"){
				doms[i].checked=_value;
				continue;
			}
		}
	},
	initItem:function(type){
		//console.log(type)
		var dom=document.querySelector("#item_"+type);
			dom.innerHTML="";
		for(var i=0;i<config[type].length;i++){
			if(type=="action"){
				var _str='<span class="item_name item_edit">'+((config[type][i].mydes&&config[type][i].mydes.type)?config[type][i].mydes.value:sdo.getI18n(config[type][i].name))+'</span>'
					+'<span class="item_del">x</span>'
					+'<span class="item_key item_edit">'+(config[type][i].ctrl?'Ctrl + ':'')
					+sdo.formatKey(sdo.getKey(config[type][i].code))+'</span>'
				var thedom=sdo.domCreate("li",{setName:["className"],setValue:["item item_ex item_edit"]},_str,null,{setName:["confid"],setValue:[i]});
				dom.appendChild(thedom);
			}else if(type=="engine"){
				var _str='<span class="item_name item_edit">'+config.engine[i].name+'</span>'
					+'<span class="item_del">x</span>'
				var thedom=sdo.domCreate("li",{setName:["className"],setValue:["item item_edit"]},_str,null,{setName:["confid"],setValue:[i]});
				dom.appendChild(thedom);
			}else if(type=="script"){
				var _str='<span class="item_name item_edit">'+config.script[i].name+'</span>'
					+'<span class="item_del">x</span>'
				var thedom=sdo.domCreate("li",{setName:["className"],setValue:["item item_edit"]},_str,null,{setName:["confid"],setValue:[i]});
				dom.appendChild(thedom);
			}
		}
	},
	initAction:function(){
		for(var i=0;i<config[type].length;i++){
			var _str='<span class="item_name item_edit">'+((config[type][i].mydes&&config[type][i].mydes.type)?config[type][i].mydes.value:sdo.getI18n(config[type][i].name))+'</span>'
				+'<span class="item_del">x</span>'
				+'<span class="item_key item_edit">'+(config[type][i].ctrl?'Ctrl + ':'')
				+sdo.formatKey(sdo.getKey(config[type][i].code))+'</span>'
			var thedom=sdo.domCreate("li",{setName:["className"],setValue:["item item_ex item_edit"]},_str,null,{setName:["confid"],setValue:[i]});
			dom.appendChild(thedom);
		}
	},
	initEngine:function(){
		var dom=document.querySelector("#item_engine");
		for(var i=0;i<config.engine.length;i++){
			var _str='<span class="item_name">'+config.engine[i].name+'</span>'
				+'<span class="item_del">x</span>'
			var thedom=sdo.domCreate("li",{setName:["className"],setValue:["item"]},_str);
			dom.appendChild(thedom);
		}
	},
	initScript:function(){
		var dom=document.querySelector("#item_script");
		for(var i=0;i<config.script.length;i++){
			var _str='<span class="item_name">'+config.script[i].name+'</span>'
				+'<span class="item_del">x</span>'
			var thedom=sdo.domCreate("li",{setName:["className"],setValue:["item"]},_str);
			dom.appendChild(thedom);
		}
	},
	initPer:function(){
		chrome.permissions.getAll(function(pers){
			theFunction(pers);
		});
		var theFunction=function(pers){
			var thepers=pers.permissions;
			var theorgs=pers.origins;
			var eleOBJ={setName:["className"],setValue:["item item_per item-del"]};
			var domOBJ_pers=document.querySelector("#item_pers");
				domOBJ_pers.innerHTML="";
			var domOBJ_orgs=document.querySelector("#item_orgs");
				domOBJ_orgs.innerHTML="";
			for(var i=thepers.length-1;i>-1;i--){
				var liOBJ=sdo.domCreate("li",eleOBJ,"","width:200px;",{setName:["confid"],setValue:[i]});
				var liName=sdo.domCreate("span",{setName:["className"],setValue:["item_name"]},"","","",thepers[i]);
				var liDel=sdo.domCreate("span",{setName:["className"],setValue:["item_del"]},"x");
				liOBJ.appendChild(liName);
				liOBJ.appendChild(liDel);
				domOBJ_pers.appendChild(liOBJ);
			}
			for(var i=0;i<theorgs.length;i++){
				var liOBJ=sdo.domCreate("li",eleOBJ,"","width:200px;",{setName:["confid"],setValue:[i]});
				var liName=sdo.domCreate("span",{setName:["className"],setValue:["item_name"]},"","","",theorgs[i]);
				var liDel=sdo.domCreate("span",{setName:["className"],setValue:["item_del"]},"x");
				liOBJ.appendChild(liName);
				liOBJ.appendChild(liDel);
				domOBJ_orgs.appendChild(liOBJ);
			}
		}
	},
	initLog:function(){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if (xhr.readyState == 4){
				var xhrLog=JSON.parse(xhr.response);
				var domlog=document.querySelector(".set_log");
					domlog.innerHTML=""
				for(var i=0;i<xhrLog.log.length;i++){
					var dom=sdo.domCreate("details");
						dom.open="open";
					var _summary=sdo.domCreate("summary",null,xhrLog.log[i].ver+" - "+xhrLog.log[i].date);
					var _ul=sdo.domCreate("ul");
					for(var ii=0;ii<xhrLog.log[i].content.length;ii++){
						var _li=sdo.domCreate("li",null,xhrLog.log[i].content[ii]);
						_ul.appendChild(_li);
					}
					dom.appendChild(_summary);
					dom.appendChild(_ul);
					domlog.appendChild(dom);
				}
				var _details=sdo.domCreate("details");
				var _summary=sdo.domCreate("summary",null,"more...");
				_details.appendChild(_summary);
				for(var i=0;i<xhrLog.oldlog.length;i++){
					var dom=sdo.domCreate("details");
					var _summary=sdo.domCreate("summary",null,xhrLog.oldlog[i].ver+" - "+xhrLog.oldlog[i].date);
					var _ul=sdo.domCreate("ul");
					for(var ii=0;ii<xhrLog.oldlog[i].content.length;ii++){
						var _li=sdo.domCreate("li",null,xhrLog.oldlog[i].content[ii]);
						_ul.appendChild(_li);
					}
					dom.appendChild(_summary);
					dom.appendChild(_ul);
					_details.appendChild(dom);
				}
				domlog.appendChild(_details);
			}
		}
		xhr.open('GET',"../change.log", true);
		xhr.send();
	},
	initI18n:function(){
		var i18nOBJ=document.querySelectorAll("[data-i18n]");
		for(var i=0;i<i18nOBJ.length;i++){
			var trans=sdo.getI18n(i18nOBJ[i].dataset.i18n);
			if(!trans){continue;}
			if(i18nOBJ[i].tagName.toLowerCase()=="input"&&i18nOBJ[i].type=="button"){
				i18nOBJ[i].value=trans;
			}else if(i18nOBJ[i].title=="_i18n"){
				i18nOBJ[i].title=trans;
			}else{
				i18nOBJ[i].innerHTML=trans;
			}
			/*if(i18nOBJ[i].title=="_i18n"){
				i18nOBJ[i].title=trans;
				if(i18nOBJ[i].tagName.toLowerCase()=="input"){
					i18nOBJ[i].value="+"
				}
			}*/
		}
	},
	initEnd:function(){
		document.querySelector("#ext_ver").innerText=chrome.runtime.getManifest().version;
		document.querySelector("#set_0").style.cssText+="display:block;";

		document.title=sdo.getI18n("settings")+" - "+sdo.getI18n("ext_name");
		//show first msg
		if(!localConf.first){
			sdo.first();
			chrome.storage.local.get(function(items){
				items.first=true;
				chrome.storage.local.set(items);
			})
		}
		//init voice engine
		chrome.tts?chrome.tts.getVoices(function(voice){
			for(var i=0;i<voice.length;i++){
				if(voice[i].voiceName=="native"){
					//moreModel.selects.n_voicename.splice(0,0,voice[i].voiceName);
				}else{
					moreModel.selects.n_voicename.push(voice[i].voiceName)
				}
			}
		}):null;
	},
	initBoxBtn:function(dom,btn){
		var dombtn=dom.querySelectorAll(".box_submit input[type=button]");
		for(var i=0,i_btn=0;i<btn.length;i++){
			if(btn[i]){
				dombtn[i].value=btn[i];
			}else{
				i_btn++;
				dombtn[i].remove();
			}
		}
	},
	first:function(){
		var confid,btn,
			dom=document.querySelector("smartkey.sk_apps").cloneNode(true),
			domcontent=dom.querySelector(".box_content"),
			btn=["",sdo.getI18n("btn_done"),""];
		domcontent.id="box_note";
		domcontent.innerHTML=sdo.getI18n("msg_first");	
		sdo.initBoxBtn(dom,btn);
		dom.style.cssText+="display:block;";
		sdo.initPos(dom);
	},
	itemEdit:function(e,type){
		var confid,btn,_conf,
			dom=document.querySelector("smartkey.sk_apps").cloneNode(true),
			domcontent=dom.querySelector(".box_content");
			confobj=sdo.getDataset(e,"confobj","value");

		if(confobj=="action"){
			editMode=true;
			dom.classList.add("sk_apps_edit")
		}
		if(type=="edit"){
			btn=[sdo.getI18n("btn_del"),sdo.getI18n("btn_cancel"),sdo.getI18n("btn_save")];
			confid=parseInt(sdo.getDataset(e,"confid","value"));
		}else{
			btn=["",sdo.getI18n("btn_cancel"),sdo.getI18n("btn_save")];
			confid=config[confobj].length;
		}
		sdo.initBoxBtn(dom,btn);


		//////////////////////

		if(type=="edit"){
			var _getconf=config[confobj][confid];
			_conf={
				name:_getconf.name,
				ctrl:_getconf.ctrl,
				shift:_getconf.shift,
				alt:_getconf.alt,
				code:[]
			};
			_getconf.content?_conf.content=_getconf.content:null;
			_getconf.selects?_conf.selects=_getconf.selects:null;
			_getconf.texts?_conf.texts=_getconf.texts:null;
			_getconf.checks?_conf.checks=_getconf.checks:null;
			_getconf.ranges?_conf.ranges=_getconf.ranges:null;
			_getconf.note?_conf.note=_getconf.note:null;
			for(var i=0;_getconf.code&&i<_getconf.code.length;i++){
				_conf.code.push(_getconf.code[i]);
			}			
		}else{
			_conf={
				name:"none",
				ctrl:false,
				shift:false,
				alt:false,
				code:[]
			};
		}

		// if(type=="edit"){
		// 	var _getconf=config[confobj][confid];
		// 	_conf={
		// 		name:_getconf.name,
		// 		ctrl:_getconf.ctrl,
		// 		shift:_getconf.shift,
		// 		alt:_getconf.alt,
		// 		code:[]
		// 	};
		// 	for(var i=0;_getconf.code&&i<_getconf.code.length;i++){
		// 		_conf.code.push(_getconf.code[i]);
		// 	}			
		// }else{
		// 	_conf={
		// 		name:"none",
		// 		ctrl:false,
		// 		shift:false,
		// 		alt:false,
		// 		code:[]
		// 	};
		// }

		// if(type=="edit"){
		// 	_conf=config[confobj][confid];
		// 	var _code=[];
		// 	for(var i=0;i<_conf.code.length;i++){
		// 		_code.push(_conf.code[i]);
		// 	}				
		// 	_conf.code=_code;
		
		// }else{
		// 	_conf={}
		// }

		sdo.cons.editedConf={};
		sdo.cons.editedConf={
			id:confid,
			type:type,
			itemtype:confobj,
			conf:_conf
		}

		switch(confobj){
			case"action":
				var actionbox=sdo.domCreate("div",{setName:["className"],setValue:["actionbox"]});
				actionbox.appendChild(sdo.itemAction(_conf));
				actionbox.appendChild(sdo.itemDes(_conf));
				actionbox.appendChild(sdo.itemMore(_conf));
				domcontent.appendChild(actionbox);

				var otherbox=sdo.domCreate("div",{setName:["className"],setValue:["otherbox"]});
				otherbox.appendChild(sdo.itemKey(_conf));
				otherbox.appendChild(sdo.itemNote(_conf));
				domcontent.appendChild(otherbox);
				break;
			case"engine":
				domcontent.innerHTML='<label class="box_label">'+sdo.getI18n("con_name")+'</label><input name="name" type="text" class="box_text box_text_engine" value="'+(_conf.name?_conf.name:"")+'"><br /><label class="box_label">'+sdo.getI18n("con_content")+'</label><input name="content" type="text" class="box_text box_text_engine" value="'+(_conf.content?_conf.content:"")+'">'
				break;
			case"script":
				domcontent.innerHTML='<label class="box_label">'+sdo.getI18n("con_name")+'</label><input name="name" type="text" class="box_text box_text_engine" value="'+(_conf.name?_conf.name:"")+'"><br /><label class="box_label">'+sdo.getI18n("con_content")+'</label><textarea name="content" type="text" class="box_text box_text_engine">'+(_conf.content?_conf.content:"")+'</textarea>'
				break;
		}
		dom.style.cssText+="display:block;";
		sdo.initPos(dom);
	},
	initPos:function(dom){
		document.body.appendChild(dom);
		var _height=window.getComputedStyle(dom).height,
			_width=window.getComputedStyle(dom).width;
			_height=parseInt(_height.substr(0,_height.length-2));
			_width=parseInt(_width.substr(0,_width.length-2));
		dom.style.cssText+="left:"+(window.innerWidth-_width)/2+"px;";
		var boxBGOBJ=document.documentElement.appendChild(sdo.domCreate("div",{setName:["className"],setValue:["box_bg"]}));
		window.setTimeout(function(){
			dom.style.cssText+="opacity:.98;top:"+(window.innerHeight-_height)/2+"px;";
			boxBGOBJ?boxBGOBJ.style.cssText+="opacity:.8;":null;
		},200)
	},
	itemAction:function(confobj){
		var domselect=sdo.domCreate("select",{setName:["className"],setValue:["box_select box_action"]});
		var _index=0;
		for(var i=0;i<actionModel.group.length;i++){
			var selgrp=sdo.domCreate("optgroup",{setName:["label"],setValue:[sdo.getI18n(actionModel.group[i])]});
			for(var ii=0;ii<actionModel.action[i].length;ii++){
				var _option=sdo.domCreate("option",{setName:["value"],setValue:[actionModel.action[i][ii].name]},sdo.getI18n(actionModel.action[i][ii].name))
				selgrp.appendChild(_option);
			}
			domselect.appendChild(selgrp);
		}
		domselect.value=confobj.name;
		return domselect;
	},
	itemDes:function(confobj){
		var domdes=sdo.domCreate("div",{setName:["className"],setValue:["box_desbox"]});
		var deschk=sdo.domCreate("input",{setName:["type","id","checked"],setValue:["checkbox","box_mydes",(confobj.mydes?confobj.mydes.type:false)]});
		var deslbl=sdo.domCreate("label",{setName:["for"],setValue:["box_mydes"]},sdo.getI18n("con_mydes"));
		var destxt=sdo.domCreate("input",{setName:["type","className","value"],setValue:["text","box_destext",confobj.mydes?confobj.mydes.value:""]},null,(confobj.mydes&&confobj.mydes.type?"display:inline-block;":"display:none;"));
		domdes.appendChild(deschk);
		domdes.appendChild(deslbl);
		domdes.appendChild(sdo.domCreate("br"));
		domdes.appendChild(destxt);
		return domdes;
	},
	itemMore:function(confobj){
		//console.log(confobj)
		var dommore=sdo.domCreate("div",{setName:["className"],setValue:["box_more"]})
		if(confobj.texts){
			for(var i=0;i<confobj.texts.length;i++){
				//fix action of mail
				if(confobj.texts[i].type=="n_mail_domain"){
					var _css,_class;
					if(confobj.selects[0].value=="s_gmailapps"){
						_css="display:inline-block";
						_class="confix confix-no";
					}else{
						_css="display:none";
						_class="confix confix-yes"
					}
					var _div=sdo.domCreate("div",{setName:["className"],setValue:[_class]},null,_css)
					_div.appendChild(sdo.domCreate("label",{setName:["className"],setValue:["box_label"]},sdo.getI18n(confobj.texts[i].type)));
					_div.appendChild(sdo.moreText(confobj.texts[i].type,confobj.texts[i].value));
					_div.appendChild(sdo.domCreate("br"));
					dommore.appendChild(_div);
					continue;
				}
				dommore.appendChild(sdo.domCreate("label",{setName:["className"],setValue:["box_label"]},sdo.getI18n(confobj.texts[i].type)));
				dommore.appendChild(sdo.moreText(confobj.texts[i].type,confobj.texts[i].value));
				dommore.appendChild(sdo.domCreate("br"));
			}
		}
		if(confobj.selects){
			for(var i=0;i<confobj.selects.length;i++){
				dommore.appendChild(sdo.domCreate("label",{setName:["className"],setValue:["box_label"]},sdo.getI18n(confobj.selects[i].type)));
				dommore.appendChild(sdo.moreSelect(confobj.selects[i].type,confobj.selects[i].value));
				dommore.appendChild(sdo.domCreate("br"));
			}
		}
		if(confobj.ranges){
			console.log("range")
			for(var i=0;i<confobj.ranges.length;i++){
				dommore.appendChild(sdo.domCreate("label",{setName:["className"],setValue:["box_label"]},sdo.getI18n(confobj.ranges[i].type)));
				dommore.appendChild(sdo.moreRange(confobj.ranges[i].type,confobj.ranges[i].value));
				dommore.appendChild(sdo.domCreate("br"));
			}
		}
		if(confobj.checks){
			for(var i=0;i<confobj.checks.length;i++){
				dommore.appendChild(sdo.domCreate("input",{setName:["id","className","type","checked","name"],setValue:[confobj.checks[i].type,"box_check","checkbox",confobj.checks[i].value,confobj.checks[i].type]}));
				dommore.appendChild(sdo.domCreate("label",{setName:["id","for"],setValue:[confobj.checks[i].type,confobj.checks[i].type]},sdo.getI18n(confobj.checks[i].type)))
			}
		}
		return dommore;
	},
	itemKey:function(confobj){
		var domkey=sdo.domCreate("div",{setName:["className"],setValue:["box_key"]});
		var _str="<input id='box_ctrl' type='checkbox'"+(confobj.ctrl?"checked":"")+"><label for='box_ctrl'>Ctrl</label>"
			+"<input id='box_alt' type='checkbox'"+(confobj.alt?"checked":"")+"><label for='box_alt'>Alt</label>"
			+"<input id='box_shift' type='checkbox'"+(confobj.shift?"checked":"")+"><label for='box_shift'>Shift</label>"
			+"<input id='box_reset' type='button' value='"+sdo.getI18n("btn_reset")+"' style='height:20px;line-height:20px;min-width:60px;margin:1px;float:right;box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.26);'>"
		var metabox=sdo.domCreate("div",null,_str,"padding:3px 0;");
		var codebox=sdo.domCreate("input",{setName:["type","value","className","readonly"],setValue:["text",sdo.formatKey(sdo.getKey(confobj.code)),"box_keyvalue",""]});

		domkey.appendChild(codebox);
		domkey.appendChild(metabox);
		return domkey;
	},
	itemNote:function(confobj){
		var domnote=sdo.domCreate("div",{setName:["className"],setValue:["box_notewrap"]});
		var _span=sdo.domCreate("span",null,"Note for the action:");
		var _text=sdo.domCreate("textarea",{setName:["className"],setValue:["box_note"]},(confobj.note?confobj.note.value:""));
		domnote.appendChild(_span);
		domnote.appendChild(_text);
		return domnote;
	},
	moreText:function(type,value){	
		var valueOBJ={setName:["name","className"],setValue:[type,"box_select"]};
		var valueOBJ={
			setName:["name","type","value","className"],
			setValue:[type,"text",value?value:(moreModel.texts[type]?moreModel.texts[type]:""),"box_text"]};
		var domText=sdo.domCreate("input",valueOBJ);
		return domText;
	},
	moreSelect:function(type,value){
		var domselect=sdo.domCreate("select",{setName:["className","name"],setValue:["box_select",type]});

		//selset of engine/script
		if(["n_engine","n_imgengine","n_script"].contains(type)){
			moreModel.selects[type]=[];
			var _type=type.substr(2);
			for(var i=0;i<config[_type].length;i++){
				moreModel.selects[type].push(config[_type][i].name);
			}
		}

		for(var i=0;i<moreModel.selects[type].length;i++){
			var _option=sdo.domCreate("option",{setName:["value"],setValue:[moreModel.selects[type][i]]},(type=="n_voicename"?moreModel.selects[type][i]:sdo.getI18n(moreModel.selects[type][i])));
			if(["n_engine","n_imgengine","n_script"].contains(type)){
				_option.value=i;
			}
			domselect.appendChild(_option);
		}
		domselect.value=value;
		return domselect;
	},
	moreRange:function(type,value){
		//console.log(value)
		var rangeModel={
			n_pitch:[0,2,.1],
			n_volume:[0,1,.1],
			n_rate:[.1,10,.1]
		}
		var dom=sdo.domCreate("span",{setName:["className"],setValue:["box_range_parent"]});
		var valueOBJ={
			setName:["name","type","value","className","min","max","step"],
			setValue:[type,"range",value?value:(moreModel.ranges[type]?moreModel.ranges[type]:""),"box_range",rangeModel[type][0],rangeModel[type][1],rangeModel[type][2]]};
		var domRange=sdo.domCreate("input",valueOBJ);
		var domSpan=sdo.domCreate("span",{setName:["className"],setValue:["box_range_value"]},value?value:(moreModel.ranges[type]?moreModel.ranges[type]:""))
		dom.appendChild(domRange);
		dom.appendChild(domSpan);
		return dom;
	},
	getAPPboxEle:function(e){
		var ele=e.target||e;
		var getele=function(ele){
			if(ele.tagName&&ele.tagName.toLowerCase()=="smartkey"&&ele.classList.contains("sk_apps")){
				return ele;
			}else{
				return getele(ele.parentNode);
			}
		}
		return getele(ele);
	},
	getDataset:function(e,type,returntype){
		var ele=e.target||e;
		var type=type?type:"confobj",
			returntype=returntype?returntype:"ele";
		var getdata=function(ele){
			if(ele.dataset[type]==""||ele.dataset[type]){
				return ele;
			}else{
				return arguments.callee(ele.parentNode);
			}
		}
		if(returntype=="value"){
			return getdata(ele).dataset[type];
		}else{
			return getdata(ele);
		}
	},
	getI18n:function(str){
		if(!str){return;}
		if(str.indexOf("n_position_")!=-1){
			str="n_position";
		}else if(str.indexOf("n_tab_")!=-1){
			str="n_tab";
		}
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
	boxMove:function(e){
		var ele=e.target||e;
		var OBJ=sdo.getAPPboxEle(ele);
		if(!OBJ){return false;}
		OBJ.querySelector(".box_head").style.cssText+="cursor:move;";
		OBJ.style.cssText+="transition:none;"+
			"left:"+(e.clientX-sdo.cons.boxmove.posX)+"px;"+
			"top:"+(e.clientY-sdo.cons.boxmove.posY)+"px;"
	},
	changeAction:function(e){
		//console.log(e)
		var dom=e.target.parentNode;
		dom.querySelector(".box_desbox")?dom.querySelector(".box_desbox").remove():null;
		dom.querySelector(".box_more")?dom.querySelector(".box_more").remove():null;

		var confobj={
			mydes:{type:false,value:""}
		}
		var _more=["select","text","check","range"];
		for(var i=0;i<actionModel.action.length;i++){
			for(var ii=0;ii<actionModel.action[i].length;ii++){
				if(actionModel.action[i][ii].name==e.target.value){
					for(var iii=0;iii<_more.length;iii++){
						if(actionModel.action[i][ii][_more[iii]+"s"]){
							confobj[_more[iii]+"s"]=[];
							for(var j=0;j<actionModel.action[i][ii][_more[iii]+"s"].length;j++){
								confobj[_more[iii]+"s"].push({type:actionModel.action[i][ii][_more[iii]+"s"][j]})
							}
						}
					}
					break;
				}
			}
		}

		sdo.getAPPboxEle(e).querySelector(".box_note").value="";
		dom.appendChild(sdo.itemDes(confobj));
		dom.appendChild(sdo.itemMore(confobj));

	},
	keyToCode:function(e){
		var code;
		code=e.keyCode;
		return code;
	},
	codeToKey:function(code){
		var key;
		for(var i=0;i<keyMap.length;i++){
			if(keyMap[i].code==code){
				key=keyMap[i].key;
				break;
			}
		}
		return key||"";
	},
	keyboxReset:function(e){
		sdo.getAPPboxEle(e).querySelector(".box_keyvalue").value="";

		var _keyarray=["ctrl","alt","shift"];
		for(var i=0;i<_keyarray.length;i++){
			var _dom=sdo.getAPPboxEle(e).querySelector("#box_"+_keyarray[i]);
			_dom.checked=false;
		}
		sdo.cons.editedConf.conf.code=[];
	},
	itemSave:function(e){
		var dom=sdo.getAPPboxEle(e),
			_type=sdo.cons.editedConf.itemtype;
		var _check=sdo.checkConf(dom);
		switch(_check){
			case"blank":
				alert(sdo.getI18n("msg_blank"));
				return;
				break;
			case"key":
				alert(sdo.getI18n("msg_setkey"));
				return;
				break;
			case"repeat":
				alert(sdo.getI18n("msg_repeatkey"));
				return;
				break;
		}

		switch(sdo.cons.editedConf.itemtype){
			case"action":
				sdo.cons.editedConf.conf.ctrl=dom.querySelector("#box_ctrl").checked;
				sdo.cons.editedConf.conf.alt=dom.querySelector("#box_alt").checked;
				sdo.cons.editedConf.conf.shift=dom.querySelector("#box_shift").checked;
				sdo.cons.editedConf.conf.name=dom.querySelector(".box_action").value;

				//mydes
				var _destype=dom.querySelector("#box_mydes").checked,
					_desvalue=dom.querySelector(".box_destext").value;
				if(_desvalue){
					sdo.cons.editedConf.conf.mydes={type:_destype,value:_desvalue};
				}else{
					delete sdo.cons.editedConf.conf.mydes;
				}
				//select,text,check,range
				var _more=["select","text","check","range"];
				for(var j=0;j<_more.length;j++){
					var domconf=dom.querySelectorAll(".box_more .box_"+_more[j]);
					if(domconf.length==0){
						sdo.cons.editedConf.conf[_more[j]+"s"]?(delete sdo.cons.editedConf.conf[_more[j]+"s"]):null
					}else{
						sdo.cons.editedConf.conf[_more[j]+"s"]=[];
					}
					for(var i=0;i<domconf.length;i++){
						var _obj;
						if(_more[j]=="check"){
							_obj={type:domconf[i].name,value:domconf[i].checked}
						}else{
							_obj={type:domconf[i].name,value:domconf[i].value}
						}
						sdo.cons.editedConf.conf[_more[j]+"s"].push(_obj)
					}
				}

				//note
				var _note={};
				_note.value=dom.querySelector(".box_content .box_note").value;
				if(_note.value){
					sdo.cons.editedConf.conf.note=_note;
				}else{
					sdo.cons.editedConf.conf.note?(delete sdo.cons.editedConf.conf.note):null;
				}
				break;
			case"engine":
				var _texts=dom.querySelectorAll(".box_text");
				for(var i=0;i<_texts.length;i++){
					sdo.cons.editedConf.conf[_texts[i].name]=_texts[i].value;
				}
				break;
			case"script":
				var _texts=dom.querySelector(".box_text");
				sdo.cons.editedConf.conf[_texts.name]=_texts.value;
				var _textarea=dom.querySelector("textarea");
				sdo.cons.editedConf.conf[_textarea.name]=_textarea.value;
				break;
		}
		config[sdo.cons.editedConf.itemtype][sdo.cons.editedConf.id]={};
		config[sdo.cons.editedConf.itemtype][sdo.cons.editedConf.id]=sdo.cons.editedConf.conf;
		sdo.saveConf();
		sdo.boxClose(e);
		sdo.initItem(_type);
		sdo.cons.editedConf={};
	},
	checkConf:function(dom){
		var _value="";
		if(sdo.cons.editedConf.itemtype=="action"
			&&(!sdo.cons.editedConf.conf.code||sdo.cons.editedConf.conf.code.length==0)){
			_value="key";
			return _value;
		}
		//fix code repeat
		if(sdo.cons.editedConf.itemtype=="action"){
			for(var i=0;i<config.action.length;i++){
				if(sdo.cons.editedConf.id==i){continue;}
				if(sdo.cons.editedConf.conf.code.toString().indexOf(config.action[i].code.toString())==0||config.action[i].code.toString().indexOf(sdo.cons.editedConf.conf.code.toString())==0){
					_value="repeat";
					return _value;
				}
			}
		}

		var fixURL=function(url){
			var fixstrs=["http://","https://","ftp://","chrome://","chrome-extension://","view-source:chrome-extension://"];
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
		}
		var texts=dom.querySelectorAll("input[type=text]");
		for(var i=0;i<texts.length;i++){
			if(!texts[i].value){
				if(texts[i].classList.contains("box_destext")&&!dom.querySelector("#box_mydes").checked){continue;}
				_value="blank";
				break;
			//fix url
			}else if(texts[i].name=="n_url"||(texts[i].name=="content"&&texts[i].classList.contains("box_text_engine"))){
				texts[i].value=fixURL(texts[i].value);
			}
		}
		return _value;
	},
	itemDel:function(e){
		console.log("itemDel")
		var _type,_id;
		if(!sdo.cons.editedConf.type){
			_id=sdo.getDataset(e,"confid","value");
			_type=sdo.getDataset(e,"confobj","value");
		}else{
			_id=sdo.cons.editedConf.id;
			_type=sdo.cons.editedConf.itemtype;
			sdo.boxClose(e);
		}
		//del permission
		if(_type=="permission"){
			var _pertype=sdo.getDataset(e,"type","value");
			var _per=e.target.parentNode.querySelector(".item_name").innerText;
			var _delper=function(removed){
				if(removed){
					sdo.initPer();
		  			sdo.showMsgBox(sdo.getI18n("msg_delpers"),"save",3);
				}else{
					sdo.showMsgBox(sdo.getI18n("msg_delpers_fail"),"warning",3);
				}				
			}
			if(_pertype=="permissions"){
				chrome.permissions.remove({permissions:[_per]},function(removed){
					_delper(removed);
				});
			}else{
				chrome.permissions.remove({origins:[_per]},function(removed){
					_delper(removed);
				});
			}
			// config[_type].splice(_id,1);
			// sdo.saveConf();
			//sdo.initItem(_type);
			return;
		}
		//del last
		if(config[_type].length==1){
			sdo.showMsgBox(sdo.getI18n("msg_dellast"),"warning");
			return;
		}		
		//del engine/script
		if(_type=="engine"||_type=="script"){
			var _obj=[];
			for(var i=0;i<config.action.length;i++){
				for(var ii=0;config.action[i].selects&&ii<config.action[i].selects.length;ii++){
					// if(config.action[i].selects[ii].type=="n_"+_type&&config.action[i].selects[ii].value==_id){
					// 	sdo.showMsgBox(sdo.getI18n("msg_delinuse"),"warning");
					// 	return;
					// }else if(config.action[i].selects[ii].type=="n_"+_type){
					// 	_obj.push([i,ii]);
					// }
					if(config.action[i].selects[ii].type=="n_"+_type&&config.action[i].selects[ii].value==_id){
						sdo.showMsgBox(sdo.getI18n("msg_delinuse"),"warning");
						return;
					}
					if(config.action[i].selects[ii].type=="n_"+_type){
						_obj.push([i,ii]);
					}
				}
			}
			var _changed=false;
			for(var i=0;i<_obj.length;i++){
				var _objid=config.action[_obj[i][0]].selects[_obj[i][1]].value;
				// if(_id=_objid){
				// 	sdo.showMsgBox(sdo.getI18n("msg_delinuse"),"warning");
				// 	break;
				// }else{
				// 	if(_id<_objid){
				// 		config.action[_obj[i][0].selects[_obj[i][1]]].value--;
				// 	}
				// }
				if(_id<_objid){
					config.action[_obj[i][0]].selects[_obj[i][1]].value--;
					_changed=true;
				}
			}
			config[_type].splice(_id,1);
			sdo.saveConf();
			sdo.initItem(_type);
			_changed?sdo.initItem("action"):null;
			return;
		}
		//del action
		config[_type].splice(_id,1);
		sdo.saveConf();
		sdo.initItem(_type);
	},
	saveConf:function(str,type,mytime){
		chrome.storage.sync.clear();
		chrome.storage.sync.set(JSON.parse(JSON.stringify(config)),function(){
			//console.log(chrome.runtime.lastError)
		});
		sdo.showMsgBox(str,type,mytime);
		chrome.runtime.sendMessage({type:"reloadconf"},function(response){});
	},
	showMsgBox:function(str,type,mytime,index){
		var str=str?str:sdo.getI18n("msg_saved");
		var type=type?type:"save";
		var mytime=(mytime&&mytime>0)?mytime:2;
		var index=index?index:10000;
		var OBJ=document.querySelector("#msgbox");
		sdo.posMsgBox();
		switch(type){
			case"save":
				OBJ.style.cssText+="background-color:#259b24;";
				break;
			case"error":
				OBJ.style.cssText+="background-color:red;";
				break;
			case"warning":
				OBJ.style.cssText+="background-color:yellow;color:rgba(0,0,0,.8);";
				break;
		}
		OBJ.innerText=str;
		//OBJ.style.cssText+="top:70px;opacity:0;";
		window.setTimeout(function(){
			OBJ.style.cssText+="transition:all .4s ease-in-out;top:30px;opacity:1;z-index:"+index;
		},100);
		window.setTimeout(function(){
			OBJ.style.cssText+="transition:all .5s ease-in-out;top:0px;opacity:0;z-index:1";
		},mytime*1000)
	},
	posMsgBox:function(){
		var OBJ=document.querySelector("#msgbox");
		OBJ.style.left=(window.innerWidth-parseInt(window.getComputedStyle(OBJ).width.substr(0,window.getComputedStyle(OBJ).width.length-2)))/2+"px"
	},
	boxClose:function(e,type){
		editMode=false;
		var domBoxBG=document.querySelector(".box_bg"),
			theEle=sdo.getAPPboxEle(e);
		sdo.cons.editedConf={};
		domBoxBG?domBoxBG.style.cssText+="transition:all .4s ease-in-out;opacity:0;":null;
		theEle.style.cssText+="transition:all .4s ease-in-out;top:0;opacity:0;";
		window.setTimeout(function(){
			domBoxBG?domBoxBG.remove():null;
			theEle.remove();
		},400)
	},
	setChange:function(e){
		var dom=e.target||e;
		var _value="";
		var confOBJ=config[sdo.getDataset(e,"confobj","value")][sdo.getDataset(e,"confele","value")];
		if(dom.tagName.toLowerCase()=="input"&&dom.type=="range"){
			_value=dom.value;
			dom.nextSibling.innerText=dom.value;
		}
		if(dom.tagName.toLowerCase()=="input"&&dom.type=="checkbox"){
			_value=dom.checked;
		}
		config[sdo.getDataset(e,"confobj","value")][sdo.getDataset(e,"confele","value")]=_value;
		sdo.saveConf();
	},
	initExportConf:function(){
		var blob = new Blob([JSON.stringify(config)]);
		var reader=new FileReader();
		reader.readAsDataURL(blob)
		reader.onload=function(e){
			var str=e.target.result.substr(13);
			var newBlob=new Blob([str]);
			var a=document.createElement("a");
			a.href=window.URL.createObjectURL(newBlob);
			a.download="smartkey.config";
			a.textContent=sdo.getI18n("con_export");
			document.querySelector("#conf_export").innerHTML="";
			document.querySelector("#conf_export").appendChild(a);
		}
	},
	confReset:function(){
		var reset=prompt(sdo.getI18n("msg_reset"));
		if(reset=="ReSeT"){
			chrome.runtime.sendMessage({type:"getdefaultconf"},function(response){
				config={};
				config=response;
				chrome.storage.local.clear();
				sdo.saveConf();
				window.setTimeout(function(){
					window.location.reload();
				},1000)
			});
		}else{
			sdo.showMsgBox(sdo.getI18n("msg_reset2"),"warning")
		}
	},
	confImport:function(){
		var file=document.querySelector("#conf_import").files[0];
		var reader=new FileReader();
		reader.readAsText(file);
		reader.onload=function(e){
			var str=Base64.decode(e.target.result);
			try{
				var importConf=JSON.parse(str);
				console.log(importConf);
				if(importConf.version>config.version){
					alert(sdo.getI18n("msg_importver"));
					return;
				}
				if(importConf){
					config=importConf;
					sdo.saveConf();
					window.setTimeout(function(){
						window.location.reload();
					},1000)	
				}	
			}
			catch(error){
				alert(sdo.getI18n("msg_confimport"))
			}
		}
	}
}
getConf();