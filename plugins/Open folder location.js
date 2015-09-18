
//sValidation=nyfjs
//sCaption=Open folder location
//sHint=Open folder location for the current shortcut
//sCategory=MainMenu.Attachments; Context.Attachments
//sCondition=CURDB; DBRW; OUTLINE; CURINFOITEM
//sID=p.OpenFolderLocation
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=wjjsoft

/////////////////////////////////////////////////////////////////////
// Extension scripts for myBase Desktop v7.x
// Copyright 2015 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

//17:44 9/18/2015 initial commit by wjj;
//This plugin tries to open the folder location where the current shortcut file resides;
//Usage: right-click on a 'shortcut' within the attachment pane, then select 'Open folder location' menu item;

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

try{

	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		var _srcfn_of_shortcut=function(sSsgFn){
			var sSrcFn='', sTxt=xNyf.loadText(sSsgFn)||'';
			var vLines=sTxt.split('\n');
			for(var i in vLines){
				var sLine=_trim(vLines[i]), sTag='url=file://';
				if(sLine.toLowerCase().indexOf(sTag)==0){
					var sSrc=sLine.substr(sTag.length);
					if(sSrc){
						sSrcFn=sSrc;
						break;
					}
				}
			}
			return sSrcFn;
		};

		var bFullPath=true, nLinks=0;
		var vFiles=plugin.getSelectedAttachments(-1, bFullPath);
		if(vFiles && vFiles.length>0){
			for(var i in vFiles){
				var sSsgFn=vFiles[i];
				if(xNyf.isShortcut(sSsgFn)){
					nLinks++;
					var sFn=_srcfn_of_shortcut(sSsgFn).replace(/^([\/\\]+)(?=[a-z]\:.+)/i, '');
					if(sFn){
						if(sFn[0]=='.'){
							var sDirNyf=new CLocalFile(xNyf.getDbFile()).getDirectory();
							sFn=new CLocalFile(sDirNyf, sFn).toString();
						}
						var sDir=new CLocalFile(sFn).getDirectory();
						if(sDir){
							if(new CLocalDir(sDir).exists()){
								new CLocalFile(sDir).launch(); //2015.9.18 may not work on Mac ???????????????
								break;
							}else{
								alert(_lc('Prompt.Failure.DirNotExisting', 'Directory does not exist.')+'\n\n'+sDir);
							}
						}
					}
				}
			}
		}

		if(nLinks<=0){
			alert(_lc2('NoShortcutSel', 'No shortcut entry is currently selected.'));
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

}catch(e){
	alert(e);
}
