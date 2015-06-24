
//sValidation=nyfjs
//sCaption=Word Count
//sHint=Word Count 02062015
//sCategory=MainMenu.TxtUtils
//sPosition=XZ-255
//sCondition=CURDB; DBRW; CURINFOITEM; HTMLEDIT; HTMLSELECTED
//sID=p.gzhaha.WordCount
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
				//get selected text
				var sCon = plugin.getSelectedText(-1, false);
				
				//run function
				var html = fnWordCount(sCon);

				alert('Words Count：' + html + ' words')
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

//Words Count：
//http://blog.csdn.net/gavid0124/article/details/38117381
function fnWordCount(str){
	sLen = 0;
	try{
   		str = str.replace(/(\r\n+|\s+|　+)/g,"龘");
		str = str.replace(/[\x00-\xff]/g,"m");	
		str = str.replace(/m+/g,"*");
		str = str.replace(/龘+/g,"");
		sLen = str.length;
	}catch(e){
		
	}
	return sLen;
}
