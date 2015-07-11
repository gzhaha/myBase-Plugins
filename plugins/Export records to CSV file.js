
//sValidation=nyfjs
//sCaption=Export records to CSV file ...
//sHint=Export data records to a CSV file
//sCategory=MainMenu.Export
//sCondition=CURDB; CURINFOITEM;
//sID=p.ExportCSV
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

//15:03 7/11/2015 Initial commit by peihao wang;
//This plugin searches the database/branch for a list of specified data records [key=value] and save results in a .csv file;


var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

try{
	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		var sCfgKey1='ExportCSV.sFields', sCfgKey2='ExportCSV.sFnDst', sCfgKey3='ExportCSV.iRange', sCfgKey4='ExportCSV.iCharset';

		var vRange=[
			  _lc('p.Common.CurBranch', 'Current branch')
			, _lc('p.Common.CurDB', 'Current database')
			];

		var vCharset=[
			  _lc('p.Common.Ansi', 'ANSI (Current system locale)')
			, _lc('p.Common.Utf8', 'UTF-8')
			];

		var vInputFields = [
			{sField: 'lineedit', sLabel: _lc2('Fields', 'Enter field names (separated with comma)'), sInit: localStorage.getItem(sCfgKey1)||''}
			, {sField: 'savefile', sLabel: _lc2('File', 'Save as .csv file'), sTitle: plugin.getScriptTitle(), sFilter: 'Comma-Separated Values (*.csv);;All files(*.*)', sInit: localStorage.getItem(sCfgKey2)||''}
			, {sField: 'combolist', sLabel: _lc2('Range', 'Data range'), vItems: vRange, nInit: localStorage.getItem(sCfgKey3)||''}
			, {sField: 'combolist', sLabel: _lc2('Encoding', 'Character encoding'), vItems: vCharset, nInit: localStorage.getItem(sCfgKey4)||''}
		];

		var vResInput=input(plugin.getScriptTitle(), vInputFields, {nMinSize: 700, vMargins: [6, 0, 30, 0], bVert: true});
		if(vResInput && vResInput.length==4){

			var sKeys=vResInput[0]||'', sFnDst=vResInput[1]||'', iRange=vResInput[2], iCharset=vResInput[3];
			var vKeys=[];
			{
				var v=sKeys.replace(/\t/g, ',').replace(/;/g, ',').replace(/\|/g, ',').split(',');
				for(var i in v){
					var k=_trim(v[i]);
					if(k){
						vKeys.push(k);
					}
				}	
			}

			if(sFnDst && sKeys && vKeys && vKeys.length>0){

				localStorage.setItem(sCfgKey1, sKeys);
				localStorage.setItem(sCfgKey2, sFnDst);
				localStorage.setItem(sCfgKey3, iRange);
				localStorage.setItem(sCfgKey4, iCharset);

				var sCurItem = ( (iRange==0) ? plugin.getCurInfoItem() : plugin.getDefRootContainer());
				var bUtf8 = (iCharset==1) ? true : false;

				if(sCurItem){

					var _parse_fields=function(vLines, bNewFields){
						var vFields=[];
						for(var i in vLines||[]){
					
							var sLine=_trim(vLines[i]); if(!sLine) continue;
							var p=sLine.indexOf('=');
					
							/*
							//Detect the colon ':' as a delimiter
							if(p<0){
								//detect if it is a timestamp, e.g. Last-modified:02/01/2007 10:32 AM
								var p1=sLine.indexOf(':');
								if(p1>0){
									var p2=sLine.search(/\b\d{1,2}\:\d{1,2}/);
									if(p2>0){
										if(p1<p2){
											p=p1;
										}
									}else{
										p=p1;
									}
								}
							}
							*/
					
							if(p>0){
								var k=_trim(sLine.substring(0, p));
								var v=_trim(sLine.substring(p+1));
								if(k){
									vFields.push({sKey: k, sVal: v, iPos: (bNewFields ? -1 : i)});
								}
							}else if(p<0){
								if(bNewFields){
									var k=_trim(sLine);
									vFields.push({sKey: k, sVal: '', iPos: -1});
								}
							}
						}
						return vFields;
					};

					var vRecords = [];
					{

						//2015.6.11 make sure to first commit current changes in the html editor;
						if(plugin.isContentEditable()) plugin.commitCurrentChanges();

						var _act_on_treeitem = function(sSsgPath, iLevel){
							var xSsgFn = new CLocalFile(sSsgPath); xSsgFn.append(plugin.getDefNoteFn());
							var sTxt = xNyf.loadText(''+xSsgFn); sTxt = platform.extractTextFromHtml(sTxt);
							var vLines=sTxt.split('\n');
							var v0=_parse_fields(vLines, false);
							if(v0 && v0.length > 0) vRecords.push(v0);
						}
						xNyf.traverseOutline(sCurItem, true, _act_on_treeitem);
					}

					var _retrieve_values=function(vFields){
						if(vFields && vFields.length>0){
							var vRes=[], sVal='', bFound=false;
							for(var j in vKeys){
								var sKey=vKeys[j];
								if(sKey){
									sVal='';
									for(var i in vFields){
										var f=vFields[i];
										if(f && f.sKey.toLowerCase()==sKey.toLowerCase()){
											sVal=f.sVal;
											break;
										}
									}
									if(sVal){
										bFound=true;
									}
									vRes.push(sVal);
								}
							}
							if(bFound) return vRes;
						}
					};

					if(vRecords && vRecords.length>0){

						var _is_number=function(s){
							return (s||'').search(/^\d+$|^\d+\.\d+$|^\d+\.\d+e[+-]?\d{1,5}$|^0x[0-9a-f]+$/i)>=0;
						};

						var sCsv='', sCrlf='\n'; //platform.getOsType()=='Win32' ? '\r\n' : '\n';
						for(var i in vRecords){
							var v=_retrieve_values(vRecords[i]);
							if(v && v.length>0){
								var sLine='';
								for(var j in v){
									var sVal=v[j];
									if(sLine) sLine+=',';
									/*if(_is_number(sVal)){
										sLine+=sVal;
									}else{
										sLine+='"'+sVal+'"';
									}*/
									sLine+='"'+sVal.replace(/\"/g, '""')+'"';
								}
								if(sCsv) sCsv+=sCrlf;
								sCsv+=sLine;
							}
						}

						var sHeader='';
						for(var i in vKeys){
							if(sHeader) sHeader+=',';
							sHeader+='"'+vKeys[i]+'"';
						}

						sCsv=(sHeader+sCrlf+sCsv);
						if(sCsv){
							var xFnDst = new CLocalFile(sFnDst);
							var nBytes=bUtf8 ? xFnDst.saveUtf8(sCsv) : xFnDst.saveAnsi(sCsv);
							if(nBytes>0){
								if(confirm(_lc2('Done', 'Successfully exported the CSV file. View it now?')+'\n\n'+sFnDst)){
									//xFnDst.exec('');
									textbox({
										sTitle: plugin.getScriptTitle()
										, sDescr: _lc2('Descr', 'Comma-Separated Values')
										, sDefTxt: xFnDst.loadText()
										, bReadonly: true
										, bWordwrap: false
										, nWidth: 90
										, nHeight: 80
									});
								}
							}else{
								alert(_lc2('Failure', 'Failed to export records to CSV file.')+'\n\n'+sFnDst);
							}
						}
					}
				}
			}else{
				alert('Bad input of file path or field names');
			}
		}
	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}
}catch(e){
	alert(e);
}
