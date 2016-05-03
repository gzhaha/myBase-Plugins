
//sValidation=nyfjs
//sCaption=Set Background Image
//sHint=Set Font Background Image 30042016
//sCategory=Context.HtmlEdit
//sPosition=XZ-255
//sCondition=CURDB; DBRW; CURINFOITEM; HTMLEDIT
//sID=p.gzhaha.SetBgImg
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=Xia Zhang

/////////////////////////////////////////////////////////////////////
// Extension scripts for myBase Desktop v7.x
// Copyright 2015 Xia Zhang (MIT Licensed)
/////////////////////////////////////////////////////////////////////

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

try{
	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){
		if(!xNyf.isReadonly()){
			if(plugin.isContentEditable()){

				var sTxt=prompt('Background Img name:', '', 'Enter Background Img name');

				if (sTxt){
					var sCon = plugin.getTextContent(-1, true);
					var regx = /<body(.*?|)>/;
					var html = sCon.replace(regx, '<body background="'+ sTxt + '">');
						
					plugin.setTextContent(-1, html, true);						
					plugin.setDomDirty(-1, true);
					plugin.commitCurrentChanges(-1);					
				}
				else{
					alert("Please Provide Background Img name!");
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
