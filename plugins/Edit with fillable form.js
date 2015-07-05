
//sValidation=nyfjs
//sCaption=Edit with fillable form ...
//sHint=Edit [Key=Value] fields within a fillable form
//sCategory=MainMenu.TxtUtils; Context.HtmlEdit
//sCondition=CURDB; DBRW; CURINFOITEM; HTMLEDIT
//sID=p.FillableForm
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

//18:30 7/5/2015 Initial commit by wjj;
//This plugin is intended for editing a list of fields [key=value] within a fillable form;
//Note: The latest build of v7 b-20 required for a scrollable form;


var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

var _html_encode=function(s)
{
	//http://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references
	s=s.replace(/&/g,	'&amp;');
	s=s.replace(/</g,	'&lt;');
	s=s.replace(/>/g,	'&gt;');
	s=s.replace(/\"/g,	'&quot;');
	s=s.replace(/\'/g,	'&apos;');
	s=s.replace(/\xA0/g,	'&nbsp;'); //http://www.fileformat.info/info/unicode/char/a0/index.htm
	s=s.replace(/  /g,	'&nbsp; ');
	s=s.replace(/\t/g,	'&nbsp; &nbsp; &nbsp; &nbsp; '); //&emsp;
	//and more ...
	return s;
};

try{
	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			if(plugin.isContentEditable()){

				var c_sFontSize='10pt';
				var c_sFontName='Lucida Console, Courier New';

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
								var k=sLine;
								vFields.push({sKey: k, sVal: '', iPos: -1});
							}
						}
					}
					return vFields;
				};

				var nMaxKeyLen=0;
				var _update_field_lines=function(vLines, vFields){
					
					for(var i in vFields){
						var f=vFields[i];
						if(nMaxKeyLen<f.sKey.length) nMaxKeyLen=f.sKey.length;
					}

					for(var i in vFields){
						var f=vFields[i];
						if(f.iPos>=0 && f.iPos<vLines.length){
							vLines[f.iPos]=f;
						}else{
							vLines.push(f);
						}
					}
				};

				var _make_into_html=function(v){
					var sHtml='';
					for(var i in v){
						var s=v[i];
						if(sHtml) sHtml+='\n';
						if(typeof(s)=='object' && s.sKey){
							sHtml+='<div>'
								+ '<span style="display: inline-block; width: %nWidth%em">'.replace(/%nWidth%/g, Math.round(nMaxKeyLen*4/5))
								+ _html_encode(s.sKey||'')
								+ '</span>'
								+ '='
								+ '<span style="padding-left: 1em;">'
								+ _html_encode(s.sVal||'')
								+ '</span>'
								+ '</div>'
								;
						}else{ //if(typeof(s)=='string')
							if(s){
								sHtml+='<div>' + _html_encode(s||'') + '</div>';
							}else{
								sHtml+='<div>' + '<br />' + '</div>';
							}
						}
					}
					return sHtml;
				};

				var sTxt=_trim(plugin.getSelectedText(-1, false)||''), bFullContent=false;
				if(!sTxt){
					bFullContent=true;
					sTxt=_trim(plugin.getTextContent(-1, false)||'');
				}

				if(sTxt){

					var vLines=sTxt.split('\n');
					var v0=_parse_fields(vLines), vFields=[];
					for(var i=0; i<v0.length; ++i){
						var f=v0[i];
						vFields.push({sField: "lineedit", sLabel: f.sKey, sInit: f.sVal});
					}

					if(vFields.length>=0){

						vFields.push({sField: "lineedit", sLabel: '* Add New Fields *', vItems: [], sInit: ''});

						var vRes = input(plugin.getScriptTitle(), vFields, {nSpacing: 3, nMinSize: 650, vMargins: [2, 0, 20, 0], bAutoScroll: true});
						if(vRes && vRes.length==v0.length+1){

							for(var i=0; i<vRes.length-1; ++i){
								v0[i].sVal=vRes[i];
							}

							var sNew=_trim(vRes[vRes.length-1]||''), bNewFields=true;
							var v=_parse_fields(sNew.split(';'), bNewFields);
							v0=v0.concat(v);

							_update_field_lines(vLines, v0);

							var sHtml='<div style="font-family: %FONTNAME%">'.replace(/%FONTNAME%/, c_sFontName)
								+ _make_into_html(vLines)
								+ '</div>'
								;

							if(bFullContent){
								plugin.selectAllText(-1);
							}

							plugin.replaceSelectedText(-1, sHtml, true);
						}
					}else{
						alert('No text fields available.');
					}

				}else{
					alert(_lc('Prompt.Warn.NoTextSelected', 'No text content is currently selected.'));
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
