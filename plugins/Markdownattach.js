
//sValidation=nyfjs
//sCaption=.mdatt2InfoItem
//sHint=Load .MD Attachment to InfoItem 02062015
//sCategory=Context.Attachments
//sPosition=XZ-255
//sCondition=CURDB; DBRW; CURINFOITEM; HTMLEDIT
//sID=p.gzhaha.MarkDownAtta
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=Xia Zhang

try{
	if(plugin.getCurDbIndex()>=0){
		
		var nyf=new CNyfDb(-1);
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
			var sRtf=nyf.loadText(sFnSel,'utf-8');
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
		var sCode='\n'+'var x = document.createElement("STYLE"); var t = document.createTextNode("body, table{font-family: 微软雅黑; font-size: 18pt}\\ntable {border-collapse:collapse;border:solid black;border-width:2px 0 2px 1px;}\\nth, td {border:solid black;border-width:2px 1px 1px 0;padding:1px;}\\nth {background-color:#DDD}\\ntable tr:nth-child(2n) {background-color: #f8f8f8;}\\nblockquote{border-left: 6px solid #DDD; color:#777}\\ncode {background-color:#EEE;border-radius: 3px; padding: 3px 5px 0px 5px;border: 1px solid #D6D6D6;color: #D14;}\\np{font-weight:normal}"); x.appendChild(t); document.head.appendChild(x);';
		plugin.runDomScript(-1, sCode);
		plugin.setDomDirty(-1, true);
				
	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}
}catch(e){
	alert(e);
}

