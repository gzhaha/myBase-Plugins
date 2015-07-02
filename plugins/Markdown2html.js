
//sValidation=nyfjs
//sCaption=mdText2html
//sHint=MarkDownText2html 02072015
//sCategory=MainMenu.TxtUtils
//sPosition=XZ-255
//sCondition=CURDB; DBRW; CURINFOITEM; HTMLEDIT; HTMLSELECTED
//sID=p.gzhaha.MarkDown2html
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=Xia Zhang

/////////////////////////////////////////////////////////////////////
// Extension scripts for myBase Desktop v7.x
// Copyright 2015 Xia Zhang (MIT Licensed)
/////////////////////////////////////////////////////////////////////

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

				
				//load marked.js
				var xFn=new CLocalFile(plugin.getScriptFile());
				var sDir=xFn.getDirectory();
				xFn=new CLocalFile(sDir, 'marked.js');
				sCode=xFn.loadText();

				if (sCode){
					eval.call(null, sCode);
					//get selected text from info item edit erea
					var sCon = plugin.getSelectedText(-1, false);
					
					//formats(table,code,blockquote)
					var sStyle='\n'+'var xStyle=document.getElementsByTagName("style")[0]; if(xStyle.innerHTML.indexOf("code") < 0) {var t = document.createTextNode("\\ntable{border-collapse:collapse; border:solid black; border-width:2px 0 2px 1px;}\\nth, td {border:solid black;border-width:2px 1px 1px 0;padding:1px;}\\nth {background-color:#DDD}\\ntable tr:nth-child(2n) {background-color: #f8f8f8;}\\nblockquote{border-left: 6px solid #DDD; color:#777}\\ncode {background-color:#EEE;border-radius: 3px; padding: 3px 5px 0px 5px;border: 1px solid #D6D6D6;color: #D14;}\\np{font-weight:normal}"); xStyle.appendChild(t); document.head.appendChild(xStyle);}; ';
					plugin.runDomScript(-1, sStyle);
					
					//parse markdown text to html
					var html = marked(sCon);
					plugin.replaceSelectedText(-1, html, true);	
				}
				else{
					alert('Component script file missing.'+'\n\n'+'marked.js');
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
