
//sValidation=nyfjs
//sCaption=.mdatt2InfoItem
//sHint=load Markdown Attachment to InfoItem 26052015
//sCategory=MainMenu.Edit;Context.Attachments
//sPosition=TB-255
//sCondition=CURDB
//sID=p.gzhaha.MarkDownAtta
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=Xia Zhang

try{
	if(plugin.getCurDbIndex()>=0){
		
		var nyf=new CNyfDb(-1);
		var f=new CLocalFile(plugin.getCurInfoItem(), 'note.md');
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
		var sFile = plugin.getScriptFile(); 
		var jsPath = sFile.substring(0,sFile.lastIndexOf('/'));
		var sTxt=platform.parseFile(jsPath+"/marked.js");
		eval.call(null, sTxt);
		
		var html = marked(sRtf);
		plugin.setTextContent(-1, html, true);
		
		//formats(table,code,blockquote)
		var sCode='\n'+'var x = document.createElement("STYLE"); var t = document.createTextNode("body, table{font-family: 微软雅黑; font-size: 18pt}\\ntable {border-collapse:collapse;border:solid black;border-width:2px 0 2px 1px;}\\nth, td {border:solid black;border-width:2px 1px 1px 0;padding:1px;}\\nth {background-color:#DDD}\\ntable tr:nth-child(2n) {background-color: #f8f8f8;}\\nblockquote{border-left: 6px solid #DDD; color:#777}\\ncode {font-size: 98%;background-color: rgba(0, 0, 0, 0.04);border-radius: 3px;}\\np{font-weight:normal}"); x.appendChild(t); document.head.appendChild(x);';
		plugin.runDomScript(-1, sCode);
		
		plugin.setDomDirty(-1, true);
				
	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}
}catch(e){
	alert(e);
}

