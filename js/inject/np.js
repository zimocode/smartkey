Array.prototype.contains=function (ele) {
    for (var i=0;i<this.length;i++){
        if (this[i]==ele){
            return true;
        }
	}
	return false;
}
var fn_np={
	init:function(){
		chrome.runtime.sendMessage({type:"getappconf",apptype:"next"},function(response){
			//fn_np.keywds=response.keywds;
			fn_np.getURL(response.keywds);
		})
	},
	getURL:function(keywds){
		var theURL="";
		var lnks=document.querySelectorAll("a");
		for(var i=lnks.length-1;i>0;i--){
			if(keywds.contains(lnks[i].innerText)){
				theURL=lnks[i].href;
				break;
			}
			if(keywds.contains(lnks[i].id)){
				theURL=lnks[i].href;
				break;
			}
			for(var ii=0;ii<lnks[i].classList.length;ii++){
				if(keywds.contains(lnks[i].classList[ii])){
					theURL=lnks[i].href;
					break;
				}
			}
			if(keywds.contains(lnks[i].rel)){
				theURL=lnks[i].href;
				break;
			}
			if(theURL){break;}
		}
		chrome.runtime.sendMessage({type:"action",url:theURL,name:"next",npok:true},function(response){});
	}
}
fn_np.init();