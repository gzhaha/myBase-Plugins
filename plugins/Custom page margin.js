
//sValidation=nyfjs
//sCaption=Custom page margin ...
//sHint=Set the margin attributes for <body> of the page
//sCategory=MainMenu.Paragraph
//sPosition=
//sCondition=CURDB; DBRW; CURINFOITEM; HTMLEDIT
//sID=p.CustomPageMargins
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

//11:20 9/24/2015 initial commit by wjj;
//This plugin is used to set margin-left/right for <body> element of the current HTML content;

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

try{
	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			if(plugin.isContentEditable()){

				var _unit_of=function(s){
					//return (s||'').replace(/^([e\d\s]+)(?=em|px|pt|%$)/i, '');
					return (s||'').replace(/^([e\d\s]+)(?=[a-z%]{0,2}$)/i, '');
				};

				var sCfgKey1='CustomPageMargins.Left', sCfgKey2='CustomPageMargins.Right';

				var vVals=[
					  '|'+_lc('p.Common.Initial', 'Initial')
					, '0.2em', '0.4em', '0.6em', '0.8em', '1em', '1.2em', '1.4em', '1.6em', '1.8em', '2em', '2.5em', '3em', '4em', '5em'
					, '5px', '10px', '15px', '20px', '25px', '30px', '35px', '40px', '45px', '50px'
				];

				var sLeft0='';
				{
					var sCode='cssUtil(document.body, "margin-left");';
					sLeft0=plugin.runDomScript(-1, sCode);
				}

				var sRight0='';
				{
					var sCode='cssUtil(document.body, "margin-right");';
					sRight0=plugin.runDomScript(-1, sCode);
				}

				var vFields = [
					{sField: "comboedit", sLabel: _lc2('Left', 'Left margin of page'), vItems: vVals, sInit: sLeft0||localStorage.getItem(sCfgKey1)||'', bReq: false}
					, {sField: "comboedit", sLabel: _lc2('Right', 'Right margin of page'), vItems: vVals, sInit: sRight0||localStorage.getItem(sCfgKey2)||'', bReq: false}
				];

				var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 400, vMargins: [8, 0, 30, 0]});
				if(vRes && vRes.length==2){

					var sLeft=vRes[0], sRight=vRes[1];

					localStorage.setItem(sCfgKey1, sLeft);
					localStorage.setItem(sCfgKey2, sRight);

					if(sLeft != '' && _unit_of(sLeft)=='') sLeft+='px';
					if(sRight != '' && _unit_of(sRight)=='') sRight+='px';

					var sCode='\n'+'g_xUndoStack.beginMacro("body margin");'
						+ 'cssUtil(document.body, [{key: "margin-left", val: "%LEFT%"}, {key: "margin-right", val: "%RIGHT%"}]);'
							.replace(/%LEFT%/g, sLeft).replace(/%RIGHT%/g, sRight)
						+ 'g_xUndoStack.endMacro();'
						;
					if(plugin.runDomScript(-1, sCode)){
						//done;
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
