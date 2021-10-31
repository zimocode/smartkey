var config,localConf;
if(!editMode){
	var editMode=false;
}
chrome.storage.sync.get(function(items){
	config=items;
	chrome.storage.local.get(function(items){
		localConf=items;
		sde.init();
	})
})
var sde={
	keyArray:[],
	timeout:null,
	apps:{
		enable:false,
	},
	sendcmd:function(e){
		console.log(e.keyCode)
		chrome.runtime.sendMessage({
			keycode:e.keyCode,
			ctrl:e.ctrlKey,
			alt:e.altKey,
			shift:e.shiftKey
		})
	},
	init:function(){
		if (window==top) {
			window.addEventListener("keydown",this,false);
		}
	},
	handleEvent:function(e){
		switch(e.type){
			case"keydown":
				if(!editMode){}else{return;}
				this.Edown(e);
				window.clearTimeout(sde.timeout);
				sde.timeout=window.setTimeout(function(){
					sde.keyArray=[];
				},config.general.timeout)
				break
		}
	},
	Edown:function(e){
		if(e.target.tagName.toLowerCase()=="input"||
			e.target.tagName.toLowerCase()=="textarea"||
			e.keyCode==17){return}
		sde.keyArray.push(e.keyCode)	
		var key={
			alt:e.altKey,
			shift:e.shiftKey,
			ctrl:e.ctrlKey,
			code:sde.keyArray
		}
		for(var i=0;i<100000;i++){
			i=i+1
		}
		for(var i=0;i<config.action.length;i++){
			if(key.ctrl==config.action[i].ctrl&&key.code.toString()==config.action[i].code.toString()){
				sde.sendKey(config.action[i]);
				e.preventDefault();
				break;
			}
		}
	},
	sendKey:function(key){
		key.type="action";
		key.selEle={txt:window.getSelection().toString()}
		chrome.runtime.sendMessage(key,function(response){
			if(response.prevent){
				//e.preventDefault();
			}
		})		
	}
}
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse) {
	if(message.type=="status"){
		sendResponse({type:message.type,message:true})
	}
	if(message.type=="reloadconf"){
		chrome.storage.sync.get(function(items){
			config=items;
		})
	}
});