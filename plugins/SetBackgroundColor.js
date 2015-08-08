
//sValidation=nyfjs
//sCaption=Set Background Color
//sHint=Set Font Background Color 08082015
//sCategory=Context.HtmlEdit
//sPosition=XZ-255
//sCondition=CURDB; DBRW; CURINFOITEM; HTMLEDIT
//sID=p.gzhaha.SetFontSize
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
				var sCfgKey='gzhaha.SetBGColor';
				var vFields = [
							 {sField: "color", sLabel: 'Color: ', sInit: localStorage.getItem(sCfgKey)|| '#999999'}
							];
				var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 400, nSpacing: 10, bVerticalLayout: false});

				if(vRes && vRes.length === 1){
					//get text
					var sCon = plugin.getTextContent(-1, true);
						uColor = vRes[0]
						localStorage.setItem(sCfgKey, uColor);
						var regx = /<body(.*?|)>/;
						var html = sCon.replace(regx, '<body bgcolor="'+ uColor + '">');						

						plugin.commitCurrentChanges();
						plugin.setTextContent(-1, html, true);
						plugin.setDomDirty(-1, true);
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
