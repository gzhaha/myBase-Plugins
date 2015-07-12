
//sValidation=nyfjs
//sCaption=Recover database ...
//sHint=Run the ssg5recover tool to recover corrupted .nyf databases
//sCategory=MainMenu.Maintain
//sPosition=
//sCondition=
//sID=p.ssg5recover
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

//21:01 7/12/2015 Initial commit by wjj;
//This plugin simply invokes the ssg5recover command-line tool to recover corrupted .nyf databases;
//The ssg5recover tool is included within the SSG5 command-line package, and can be downloaded from the website: http://wjjsoft.com/tid_ssg#recover

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

try{

	var sCfgKey1='ssg5recover.sFnExe', sCfgKey2='ssg5recover.sFnNyf';
	var sFnExe=(platform.getOsType()=='Win32') ? 'ssg5recover.exe' : 'ssg5recover';

	var sDescrExe=_lc2('FnExe', 'File path to %Ssg5Recover% (Downloadable from: http://wjjsoft.com/tid_ssg)').replace(/%Ssg5Recover%/g, sFnExe);
	var sDescrNyf=_lc2('FnNyf', 'File path to a corrupted .nyf database');
	var sFilter='myBase databases (*.nyf);;All files(*.*)';

	var vFields = [
		{sField: 'file', sLabel: sDescrExe, sFilter: sFnExe, sTitle: plugin.getScriptTitle(), sInit: localStorage.getItem(sCfgKey1)||''}
		, {sField: 'file', sLabel: sDescrNyf, sTitle: plugin.getScriptTitle(), sFilter: sFilter, sInit: localStorage.getItem(sCfgKey2)||''}
	];

	var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 560, vMargins: [6, 0, 30, 0], bVert: true});
	if(vRes && vRes.length==2){

		var sFnExe=vRes[0], sFnNyf=vRes[1];
		if(sFnExe && sFnNyf){

			localStorage.setItem(sCfgKey1, sFnExe);
			localStorage.setItem(sCfgKey2, sFnNyf);

			var xFnExe=new CLocalFile(sFnExe), xFnNyf=new CLocalFile(sFnNyf);
			if(xFnExe.exists() && xFnNyf.exists()){
				if(xFnExe.exec([sFnNyf])){
					var sPath=xFnNyf.getDirectory(false), sTitle=xFnNyf.getTitle(), sExt=xFnNyf.getSuffix(true);
					var xFnNew=new CLocalFile(sPath, sTitle+'_RECOVERED'+sExt);
					var sMsg=_lc2('Done', 'Successfully invoked the ssg5recover tool; During the process in Terminal, you may be asked for confirmation or database password if needed; And the new storage file will be generated if all goes OK. Please be patient...');
					alert(sMsg+'\n\n'+xFnExe+'\n'+xFnNyf+'\n\n=> '+xFnNew);
				}else{
					alert('Failed to invoke the ssg5recover tool.'+'\n\n'+xFnExe);
				}
			}else{
				alert('File not found.'+'\n\n'+xFnExe+'\n'+xFnNyf);
			}

		}else{
			alert('Bad input of file paths.');
		}
	}

}catch(e){
	alert(e);
}
