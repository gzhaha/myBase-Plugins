
//sValidation=nyfjs
//sCaption=Insert quick text ...
//sHint=Insert quick text into current HTML content
//sCategory=MainMenu.Insert
//sCondition=CURDB; DBRW; CURINFOITEM; HTMLEDIT
//sID=p.Ins.QuickText
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=wjjsoft


//11:34 6/10/2015
//Plugin/Insert quick text:
//Quick text is customizable, simply save quick text as *.q.txt files in either the program's install folder, 
//or the script's folder './plugins', or the current database's folder, and or the special sub folder './quicktext' under the program's folder;

//For end-users to define a keyboard shortcut to this function, select 'View - Options - Keyboard', 
//find the 'Quick text' item in the list, and then press a shortcut key on it.


var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

try{
	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			if(plugin.isContentEditable()){

				var vDisp=[
					  '----------------------------------------'
					, '////////////////////////////////////////'
					, '########################################'
				];

				var nStart=vDisp.length;

				var sSuffix='.q.txt';
				var xRE=new RegExp(sSuffix.replace(/\./g, '\\.')+'$', 'gi');

				var vDirs=[];
				{
					vDirs.push(plugin.getAppWorkingDir());
					vDirs.push(plugin.getAppWorkingDir()+'/quicktext');
					vDirs.push(new CLocalFile(plugin.getScriptFile()).getDirectory());
					vDirs.push(new CLocalFile(xNyf.getDbFile()).getDirectory());
				}

				var vFiles=[];
				for(var j in vDirs){
					var xDir=new CLocalDir(vDirs[j]);
					if(xDir.exists()){
						var v=xDir.listFiles('*'+sSuffix);
						for(var i in v){
							var xFn=new CLocalFile(xDir.toString()); xFn.append(v[i]);
							var sTitle=xFn.getLeafName().replace(xRE, '') + ' ('+xDir+')';
							vDisp.push(sTitle);
							vFiles.push(xFn.toString());
						}
					}
				}

				var sDir=new CLocalFile(plugin.getScriptFile()).getDirectory();

				var sCfgKey='InsertQuickText.iSel';
				var sMsg=_lc2('SelText', 'Select a quick text from the list (customizable by saving quick text as *.q.txt files in the program folder)');
				var iSel=dropdown(sMsg, vDisp, localStorage.getItem(sCfgKey));
				if(iSel>=0){

					localStorage.setItem(sCfgKey, iSel);

					var sTxt;
					if(iSel<nStart){
						sTxt=vDisp[iSel];
					}else{
						var xFn=new CLocalFile(vFiles[iSel-nStart]);
						sTxt=xFn.loadText();
					}

					if(sTxt){
						plugin.replaceSelectedText(-1, sTxt, false);
					}
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
