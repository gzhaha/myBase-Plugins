
//sValidation=nyfjs
//sCaption=Calculate
//sHint=Calculate 02072015
//sCategory=MainMenu.TxtUtils
//sPosition=XZ-255
//sCondition=CURDB; DBRW; CURINFOITEM; HTMLEDIT; HTMLSELECTED
//sID=p.gzhaha.Calculate
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

				
				//load math.js
				var xFn=new CLocalFile(plugin.getScriptFile());
				var sDir=xFn.getDirectory();
				xFn=new CLocalFile(sDir, 'math.js');
				sCode=xFn.loadText();

				if (sCode){
					//get selected text from info item edit area
					var sCon = plugin.getSelectedText(-1, false);
					eval.call(null, sCode);
					
					//Calculate
					try{
						//remove all space
						sCon1 = sCon.replace(/\s/g, '')
						
						//Rounding for four digits 
						var cResult = math.round(math.eval(sCon1)*10000)/10000;
						var cFinal = sCon + " = " + cResult + ' ';
						plugin.replaceSelectedText(-1, cFinal, false);
					}
					catch(e){
						alert(e);
					}
				}else{
					alert('Component script file missing.'+'\n\n'+'math.js');	
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
