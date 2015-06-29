
//sValidation=nyfjs
//sCaption=.mdatt2InfoItem
//sHint=Load .MD Attachment to InfoItem 02062015
//sCategory=Context.Attachments; MainMenu.Attachments
//sPosition=XZ-255
//sCondition=CURDB; DBRW; CURINFOITEM;
//sID=p.gzhaha.MarkDownAtta
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=Xia Zhang

/////////////////////////////////////////////////////////////////////
// Extension scripts for myBase Desktop v7.x
// Copyright 2015 Xia Zhang (MIT Licensed)
/////////////////////////////////////////////////////////////////////

//12:16 6/29/2015 revised by wjj;
//Ver7-b20 revised the function plugin.getSelectedAttachments(), with a totally different return values, to conform to the V7 JSAPI Specs.;
//For details: www.wjjsoft.com/mybase_v7_jsapi.html#plugin_getSelectedAttachments
//In addition, Ver7-b20 adds support for non-HTML content (e.g. Markdown) to be rendered and displayed in the HTML editor,
//This revision tries to reflect the API changes and make markdown content work more smoothly;

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

try{
	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		var sSsgFn, sMD;
		{
			var bFullPath=true;
			var vFiles=plugin.getSelectedAttachments(-1, bFullPath);
			if(vFiles && vFiles.length>0){
				for(var i in vFiles){
					var xFn=new CLocalFile(vFiles[i]);
					var sExt=(xFn.getSuffix(false)||'').toLowerCase();
					if(sExt == 'md'){
						sSsgFn=xFn.toString();
					}
				}

				if(!sSsgFn){

					//For non-MD attachments, a popup asking for confirmation would be safer;

					sSsgFn=vFiles[0]; //consider the first one if no .md documents selected;
				}

				if(sSsgFn){
					sMD=xNyf.loadText(sSsgFn)||'';
				}
			}else{
				sSsgFn=plugin.getCurDocFile();
				sMD=plugin.getTextContent()||'';
			}
		}

		if(sSsgFn && sMD && sMD.replace(/^\s+|\s+$/g, '')){

			//load marked.js
			var sCode;
			{
				var xFn=new CLocalFile(plugin.getScriptFile());
				var sDir=xFn.getDirectory();
				xFn=new CLocalFile(sDir, 'marked.js');
				sCode=xFn.loadText();
			}

			if(sCode){

				eval.call(null, sCode);

				var sHtml = marked(sMD);

				if(sHtml){

					if(plugin.isContentEditable()) plugin.commitCurrentChanges();

					plugin.setTextContent(-1, sHtml, true, sSsgFn);

					//formats(table,code,blockquote)
					sCode='\n'+'var x = document.createElement("STYLE"); var t = document.createTextNode("body, table{font-family: Arial; font-size: 18pt}\\ntable {border-collapse:collapse;border:solid black;border-width:2px 0 2px 1px;}\\nth, td {border:solid black;border-width:2px 1px 1px 0;padding:1px;}\\nth {background-color:#DDD}\\ntable tr:nth-child(2n) {background-color: #f8f8f8;}\\nblockquote{border-left: 6px solid #DDD; color:#777}\\ncode {background-color:#EEE;border-radius: 3px; padding: 3px 5px 0px 5px;border: 1px solid #D6D6D6;color: #D14;}\\np{font-weight:normal}"); x.appendChild(t); document.head.appendChild(x);';
					plugin.runDomScript(-1, sCode);

					plugin.setDomDirty(-1, false);
					plugin.setDomReadonly(-1, true);

				}else{
					alert('No content available to render.');
				}

			}else{
				alert('Component script file missing.'+'\n\n'+'marked.js');
			}
		}else{
			alert('No markdown documents selected.');
		}





		/*
		var f=new CLocalFile(plugin.getCurInfoItem());
		var sRes=plugin.getSelectedAttachments('\t')||'';
		if(sRes){
			var vLines=sRes.split('\n');
			for(var i in vLines){
				var v=(vLines[i]||'').split('\t');
				var sDbPath=v[0], sSsgPath=v[1], sSsgName=v[2];
				var xFn=new CLocalFile(sSsgPath); xFn.append(sSsgName);
					sFnSel=xFn.toString();
			}
		}else{
			var xFn=new CLocalFile(plugin.getCurDocFile());
			sFnSel=xFn.toString();			
		}
		if(sFnSel){
			var sRtf=xNyf.loadText(sFnSel,'utf-8');
		}
		//load marked.js
		var sFile = plugin.getScriptFile();
		var jsPath = sFile.substring(0,sFile.lastIndexOf('/'));
		var s=new CLocalFile(jsPath+"/marked.js");
		var sJs=s.loadText();
		eval.call(null, sJs);
		
		var html = marked(sRtf);
		plugin.setTextContent(-1, html, true);
		
		//formats(table,code,blockquote)
		var sCode='\n'+'var x = document.createElement("STYLE"); var t = document.createTextNode("body, table{font-family: Arial; font-size: 18pt}\\ntable {border-collapse:collapse;border:solid black;border-width:2px 0 2px 1px;}\\nth, td {border:solid black;border-width:2px 1px 1px 0;padding:1px;}\\nth {background-color:#DDD}\\ntable tr:nth-child(2n) {background-color: #f8f8f8;}\\nblockquote{border-left: 6px solid #DDD; color:#777}\\ncode {background-color:#EEE;border-radius: 3px; padding: 3px 5px 0px 5px;border: 1px solid #D6D6D6;color: #D14;}\\np{font-weight:normal}"); x.appendChild(t); document.head.appendChild(x);';
		plugin.runDomScript(-1, sCode);
		plugin.setDomDirty(-1, true);
		*/
				
	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}
}catch(e){
	alert(e);
}

