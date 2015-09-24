
//sValidation=nyfjs
//sCaption=Custom search scope ...
//sHint=Search for words or RegExp within a specified scope
//sCategory=MainMenu.Search
//sPosition=
//sCondition=CURDB
//sID=p.CustomSearch
//sAppVerMin=7.0
//sAuthor=wjjsoft

/////////////////////////////////////////////////////////////////////
// Extension scripts for myBase Desktop v7.x
// Copyright 2015 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

//17:28 9/24/2015 initial commit by wjj;
//This plugin is used to run searches for words or RegExp with in a specified scope;
//To search for RegExp, make sure to add a pair of slashes surrouding the find phrase, like this: /pattern/i

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

var _scale_file_size=function(n){
	var nKilo=1024;
	var nMega=nKilo*nKilo;
	var nGiga=nKilo*nKilo*nKilo;
	var s='';
	if(n>=nGiga){
		s=''+Math.floor(n/nGiga*10)/10+' GiB';
	}else if(n>=nMega){
		s=''+Math.floor(n/nMega*10)/10+' MiB';
	}else if(n>=nKilo){
		s=''+Math.floor(n/nKilo*10)/10+' KiB';
	}else{
		s=''+n+' B';
	}
	return s;
};

try{

	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		var sCfgKey1='CustomSearch.sPhrase', sCfgKey2='CustomSearch.iRange', sCfgKey3='CustomSearch.bTitles', sCfgKey4='CustomSearch.bContents', sCfgKey5='CustomSearch.bAttachments', sCfgKey6='CustomSearch.bAllDbs';

		var vRange=[
			_lc('p.Common.CurBranch', 'Current branch')
			, _lc('p.Common.CurDB', 'Current database')
			];

		var vScope=[
			localStorage.getItem(sCfgKey3)+'|'+'Item titles'
			, localStorage.getItem(sCfgKey4)+'|'+'HTML contents'
			, localStorage.getItem(sCfgKey5)+'|'+'Attachments'
			];

		var vFields = [
			{sField: "lineedit", sLabel: _lc2('Phrase', 'Search for words or RegExp (eg. /pattern/i ):'), sInit: localStorage.getItem(sCfgKey1)||'', bReq: true}
			, {sField: 'check', sLabel: 'Data scope:', vItems: vScope}
			, {sField: "combolist", sLabel: _lc2('Range', 'Outline scope:'), vItems: vRange, nInit: localStorage.getItem(sCfgKey2)||'', bReq: false}
			, {sField: 'check', sLabel: '', vItems: [localStorage.getItem(sCfgKey6)+'|'+'With all opened databases']}
		];

		var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 540, vMargins: [8, 0, 30, 0], bVert: true});
		if(vRes && vRes.length>=4){

			var sFor=vRes[0], vChk=vRes[1], iRng=vRes[2], bAllDbs=vRes[3][0];
			var bTitles=vChk[0], bContents=vChk[1], bAttachments=vChk[2];

			sFor=_trim(sFor);

			localStorage.setItem(sCfgKey1, sFor);
			localStorage.setItem(sCfgKey2, iRng);
			localStorage.setItem(sCfgKey3, bTitles);
			localStorage.setItem(sCfgKey4, bContents);
			localStorage.setItem(sCfgKey5, bAttachments);
			localStorage.setItem(sCfgKey6, bAllDbs);

			if(bTitles || bContents || bAttachments){

				plugin.initProgressRange(plugin.getScriptTitle(), 0);

				var mToScan={};
				var sDefNoteFn=plugin.getDefNoteFn();

				var nCountOfEntries=0;

				//2013.12.12 users reported the 'runtime error' that possibly came from Array.push();
				//We encountered the similar problem within the epub making scripts;
				//Workaround: use the key-val map to substitute the Array;

				var _push=function(i, p, n){
					var v=mToScan[i];
					if(!v) v=mToScan[i]=[];
					v[v.length]={sSsgPath: p, sSsgName: n};
					nCountOfEntries++;
				};

				var _load_entries=function(iDbPos){
					var bBranch=(iRng==0), sCurItem=bBranch ? plugin.getCurInfoItem(iDbPos) : plugin.getDefRootContainer();
					if(!sCurItem){
						sCurItem=plugin.getDefRootContainer();
						bBranch=false;
					}
					var xDb=new CNyfDb(iDbPos);
					xDb.traverseOutline(sCurItem, bBranch, function(sSsgPath, iLevel){

						var sTitle=xDb.getFolderHint(sSsgPath); if(!sTitle) sTitle='Untitled';

						var bContinue=plugin.ctrlProgressBar(sTitle+' ['+nCountOfEntries+']', 1, true);
						if(!bContinue){mToScan={}; return true;}

						if(bTitles){
							_push(iDbPos, sSsgPath, '');
						}
						
						if(bContents||bAttachments){
							var vFiles=xDb.listFiles(sSsgPath);
							for(var i in vFiles){
								var sSsgName=vFiles[i];
								if(sSsgName==sDefNoteFn){
									if(bContents) _push(iDbPos, sSsgPath, sSsgName);
								}else{
									if(bAttachments) _push(iDbPos, sSsgPath, sSsgName);
								}
							}
						}
					});
				};

				if(bAllDbs){
					var n=plugin.getDbCount();
					while( n-- > 0 ) _load_entries(n);

				}else{
					_load_entries(plugin.getCurDbIndex());
				}

				var xRE=undefined;
				{
					//construct the xRE;
					var v=sFor.match(/^\/(.*)\/([igm]*)$/);
					if(v && v.length>1){
						var sRE=v[1], sOpt=v[2];
						if(sRE){
							xRE=new RegExp(sRE, sOpt.replace(/g/gi, '')); //remove the redundant 'g'.
						}
					}
				}

				var _match_boolean=function(s){
					var bOK=false;
					//To-do ... ??????????
					return bOK;
				};

				var _match=function(s){
					var bOK=false, s=s.replace(/[\r\n]/g, ' ');
					if(xRE!=undefined){
						bOK=s.match(xRE);
					}
					if(!bOK){
						bOK=_match_boolean(s);
					}
					if(!bOK){
						bOK=s.toLowerCase().indexOf(sFor.toLowerCase())>=0;
					}
					return bOK;
				};

				var _findstr_to_hilite=function(s){
					s=s||'';
					if(xRE!=undefined){
						//2012.2.7 consider the regexp control words, like: /\bmain\b/i, that is to highlight 'main', rather than 'b' or 'i';
						s=s.replace(/\\\w/g, '');
						s=s.replace(/\/[igm]*$/g, '');
					}
					s=s.replace(/[`~\!@#\$%\^&\*\(\)_\+\-=\[\]\\\{\}\|;\'\:\"\,\.\/<>\?\Z\A]/g, ' ').replace(/\s{2,}/g, ' ');
					return _trim(s);
				};

				//2011.9.4 this is used for highlighting the search words;
				var sFindStr=_findstr_to_hilite(sFor);

				//plugin.runQuery({bListOut: true}); //make sure the Query-results window is open and cleared;

				plugin.initProgressRange(plugin.getScriptTitle(), nCountOfEntries);

				plugin.showResultsPane(true, true);
				plugin.setResultsPaneTitle(plugin.getScriptTitle()+'  ['+sFor+']');

				var nFound=0;
				for(var iDbPos in mToScan){

					var vII=mToScan[iDbPos];
					if(vII.length>0){

						var xDb=new CNyfDb(parseInt(iDbPos)), sDbFn=xDb.getDbFile();
						for(var i in vII){

							var xII=vII[i];
							var sSsgPath=xII.sSsgPath, sSsgName=xII.sSsgName, xSsgFn=new CLocalFile(sSsgPath, sSsgName);
							var sTitle=xDb.getFolderHint(sSsgPath)||'';
							var bDefNote=(sSsgName==sDefNoteFn);

							var nSize=xDb.getFileSize(xSsgFn, false);

							var bContinue=plugin.ctrlProgressBar( ((bDefNote?'':sSsgName)||sTitle||'Untitled')+' ['+_scale_file_size(nSize)+']', 1, true);
							if(!bContinue) break;

							var sTxt='';
							if(sSsgName){

								var sTxt=xDb.parseFile(sSsgPath, sSsgName, false);

								if(bDefNote){
									//if(sTitle) sTxt=sTitle+'\n'+sTxt;
								}else{
									//2013.10.21 take a look at filenames as well for attachments.
									sTxt=sSsgName+'\n'+sTxt;
								}

								var sHint=xDb.getFileHint(xSsgFn);
								if(sHint) sTxt+='\n'+sHint;
							}else{
								//To scan item titles only;
								sTxt=sTitle;
							}

							if(sTxt && _match(sTxt)){
								nFound++;
								plugin.appendToResults(sDbFn, sSsgPath, sSsgName, sFindStr);
							}
						}
					}
				}

				plugin.setResultsPaneTitle(plugin.getScriptTitle()+'  ['+sFor+'] '+_lc('p.Common.Found', 'Found: (%nFound%)').replace(/%nFound%/g, ''+nFound));
			}
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

}catch(e){
	alert(e);
}
