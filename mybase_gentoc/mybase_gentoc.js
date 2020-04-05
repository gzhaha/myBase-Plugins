//sValidation=nyfjs
//sCaption=generate toc for html
//sHint=generate toc for html
//sCategory=MainMenu.Tools;
//sCondition=
//sID=p.GenerateHtmlTOC
//sAppVerMin=7.0
//sAuthor=THEZIPPER

/////////////////////////////////////////////////////////////////////

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

try{	
	var nyf=new CNyfDb(-1);
	sFnSel=plugin.getCurDocFile();
	var aim_file=new CLocalFile(sFnSel);
	var toc_js_code=new CLocalFile(plugin.getAppWorkingDir()+'/plugins', 'gentoc.txt');
	if(aim_file){
			var con_aim_file=nyf.loadText(aim_file);
			var con_toc_js_code=toc_js_code.loadText('auto');
			var result=con_aim_file+con_toc_js_code;
			if(result){
			if(nyf.saveUtf8(aim_file, result, true)>0){       
				plugin.refreshDocViews(-1, '');     
				alert('generate the toc');
			}else{
				alert('Failed to generate the toc' + '\n\n' + aim_file.toString());
			}
		}
	}

}catch(e){
	alert(e);
}
