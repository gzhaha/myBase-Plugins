
//sValidation=nyfjs
//sCaption=Set Font Size
//sHint=Set Font Size 11062015
//sCategory=Context.HtmlEdit
//sPosition=XZ-255
//sCondition=CURDB; DBRW; CURINFOITEM; HTMLEDIT
//sID=p.gzhaha.SetFontSize
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=Xia Zhang

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

try{
	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){
		if(!xNyf.isReadonly()){
			if(plugin.isContentEditable()){
				//get text
				var sCon = plugin.getTextContent(-1, true);
				var sSiz = prompt('Input Font Size (5-40):', '16', 'Input Font Size');
				if (sSiz>=5 && sSiz<=40){

					//match px, pt, %
					var regx = /font-size:( |)\d{1,2}(|\.\d+)(| )pt|font-size:( |)\d{1,2}(|\.\d+)(| )px|font-size:( |)\d{1,3}(| )%/g
					var html = sCon.replace(regx, 'font-size: '+ sSiz + 'pt')

					//2015.6.12 'setHTML' clears DOM entirely including UNDO stack, so it'd be worth to first save current modifications as a history revision for UNDOable;
					plugin.commitCurrentChanges();

					plugin.setTextContent(-1, html, true);
					plugin.setDomDirty(-1, true);
				}
				else{
					alert("Value should be 5-40!")
				}
			}else{
				alert(_lc('Prompt.Warn.ReadonlyContent', 'Cannot modify the content opened as Readonly.'));
			}
		}else{
			alert(_lc('Prompt.Warn.ReadonlyDb', 'Cannot modify the database opened as Readonly.'));
		}
	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}
}catch(e){
	alert(e);
}
