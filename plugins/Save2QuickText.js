
//sValidation=nyfjs
//sCaption=Save to Quick Text
//sHint=Save selected Text to Quick Text 16062015
//sCategory=MainMenu.TxtUtils
//sPosition=XZ-255
//sCondition=CURDB; DBRW; CURINFOITEM; HTMLEDIT; HTMLSELECTED
//sID=p.gzhaha.SaveText2QuickTextFile
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
				//get selected text from info item edit area
				var sCon = plugin.getSelectedText(-1, false);
				
				try{
					var sFn=platform.getSaveFileName({sTitle: 'Select Quick Text File', sFilter: 'Quick Text files(*.q.txt);;Text files(*.txt)'});
					var f=new CLocalFile(sFn);
					var nBytes=f.saveUtf8(sCon);
					if(nBytes>=0){
						alert('Saved Successfully!');
					}
				}
				catch(e){
					alert(e);
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
