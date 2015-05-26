
//sValidation=nyfjs
//sCaption=md2html
//sHint=MarkDown2html 26052015
//sCategory=MainMenu.TxtUtils
//sPosition=TB-255
//sCondition=CURDB; DBRW; CURINFOITEM; HTMLEDIT; HTMLSELECTED
//sID=p.gzhaha.MarkDown2html
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=Xia Zhang

//This script can change the selected markdown style text to html by utilizing marked.js 

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
				
				//formats(table,code,blockquote)
				var sCode='\n'+'var xStyle=document.getElementsByTagName("style")[0]; if(xStyle.innerHTML.indexOf("code") < 0) {var t = document.createTextNode("\\ntable{border-collapse:collapse; border:solid black; border-width:2px 0 2px 1px;}\\nth, td {border:solid black;border-width:2px 1px 1px 0;padding:1px;}\\nth {background-color:#DDD}\\ntable tr:nth-child(2n) {background-color: #f8f8f8;}\\nblockquote{border-left: 6px solid #DDD; color:#777}\\ncode {font-size: 98%;background-color: rgba(0, 0, 0, 0.04);border-radius: 3px;}\\np{font-weight:normal}"); xStyle.appendChild(t); document.head.appendChild(xStyle);}; ';
				plugin.runDomScript(-1, sCode);
				
				//load marked.js
				var sFile = plugin.getScriptFile();
				var jsPath = sFile.substring(0,sFile.lastIndexOf('/'));
				var sTxt=platform.parseFile(jsPath+"/marked.js");
				eval.call(null, sTxt);
				
				//parse markdown text to html
				var html = marked(sCon);
				plugin.replaceSelectedText(-1, html, true);		

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
