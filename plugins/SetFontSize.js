
//sValidation=nyfjs
//sCaption=Set Font Size
//sHint=Set Font Size 02062015
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
				//get selected text
				var sCon = plugin.getTextContent(-1, true);
				var sSiz = prompt('Input Font Size (5-40)：', '16', 'Input Font Size');
				if (sSiz>=5 && sSiz<=40){
					var html = sCon.replace(/font-size:(.*?)pt|font-size:(.*?)px/g, 'font-size: '+ sSiz + 'pt')
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
