
//sValidation=nyfjs
//sCaption=Calculate
//sHint=Calculate 30052015
//sCategory=MainMenu.TxtUtils
//sPosition=TB-255
//sCondition=CURDB; DBRW; CURINFOITEM; HTMLEDIT; HTMLSELECTED
//sID=p.gzhaha.Calculate
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
				var sCon = plugin.getSelectedText(-1, false);
				
				//load math.js
				var sFile = plugin.getScriptFile();
				var jsPath = sFile.substring(0,sFile.lastIndexOf('/'));
				var s=new CLocalFile(jsPath+"/math.js");
				var sJs=s.loadText();
				eval.call(null, sJs);
				
				//Calculate
				try{
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
