
//sValidation=nyfjs
//sCaption=Custom table style ...
//sHint=Custom CSS properties for the current table
//sCategory=MainMenu.Table;
//sPosition=TBL-03-ATTR-03
//sCondition=CURDB; DBRW; CURINFOITEM; HTMLEDIT; TABLE
//sID=p.Table.CustomStyle
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

//17:11 8/6/2015 Initial commit by wjj;
//This plugin is intended for sophisticated (IT) users to edit CSS properties for the current table with in a fillable form.
//For a full list of CSS properties, see: http://www.w3.org/TR/CSS21/propidx.html

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

try{
	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			if(plugin.isContentEditable()){

				var _unserialize_style=function(sCss){
					var v2=sCss.split(';'), xCss={};
					for(var i in v2){
						var a=_trim(v2[i]||'');
						var p=a.indexOf(':');
						if(p>0){
							var key=_trim(a.substr(0, p)), val=_trim(a.substr(p+1));
							if(key){
								xCss[key]=val;
							}
						}
					}
					return xCss;
				};

				var _add_prop=function(vCss, k, v){
					if(vCss && vCss.length!=undefined && k){
						var bFound=false;
						for(var i in vCss){
							if(vCss[i].sKey==k){
								vCss[i].sVal=v;
								bFound=true;
							}
						}
						if(!bFound) vCss.push({sKey: k, sVal: v});
					}
				};

				var vWidths=[
					'|'+_lc('p.Common.Default', 'Default')
					, '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%'
					, '100%|'+'100% (Full)'
					, '10pt', '20pt', '30pt', '40pt', '50pt', '60pt', '70pt', '80pt', '90pt'
					, '100pt', '150pt', '200pt', '250pt', '300pt', '350pt', '400pt', '450pt'
					, '500pt', '550pt', '600pt', '650pt', '700pt', '750pt', '800pt', '850pt'
					, '900pt', '950pt', '1000pt'
					, '10px', '20px', '30px', '40px', '50px', '60px', '70px', '80px', '90px'
					, '100px', '150px', '200px', '250px', '300px', '350px', '400px', '450px'
					, '500px', '550px', '600px', '650px', '700px', '750px', '800px', '850px'
					, '900px', '950px', '1000px'
				];

				var sCode='var xTbl=curTable(); cssUtil(xTbl)||"";';
				var sCss=plugin.runDomScript(-1, sCode)||'';

				var vFields=[], vCss=[];

				var xCss=_unserialize_style(sCss);
				for(var k in xCss){
					var v=k ? xCss[k] : '';
					if(k && v){
						var f={sField: 'lineedit', sLabel: k, sInit: v||'', bReq: false};
						if(k=='width'){
							f.sField='comboedit';
							f.vItems=vWidths;
						}else if(k.indexOf('-color')>0){
							f.sField='color';
						}
						vFields.push(f);
						_add_prop(vCss, k, v);
					}
				}

				vFields.push({sField: 'lineedit', sLabel: _lc2('AddProp', '* Add CSS properties *'), sInit: '', bReq: false});

				var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 500, vMargins: [8, 0, 30, 0]});
				if(vRes && vRes.length>1){

					for(var i=0; i<vRes.length-1; ++i){
						vCss[i].sVal=vRes[i];
					}

					var sNew=vRes[vRes.length-1];
					if(sNew){
						var xCss=_unserialize_style(sNew);
						for(var k in xCss){
							_add_prop(vCss, k, xCss[k]);
						}
					}

					var sCssNew='';
					for(var i in vCss){
						var d=vCss[i];
						var k=d.sKey, v=d.sVal;
						if(k && v){
							if(sCssNew) sCssNew+='; ';
							sCssNew+=k+': '+v;
						}
					}

					if(sCssNew!=sCss){
						var sCode='var xTbl=curTable(); g_xUndoStack.beginMacro("Custom table style"); g_xUndoStack.pushMacro(new _CCmdChgElmAttr(xTbl, "style", "%CSS%")); g_xUndoStack.endMacro();'
							.replace(/%CSS%/g, sCssNew);
						plugin.runDomScript(-1, sCode);
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
