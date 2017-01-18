//sValidation=nyfjs
//sCaption=Insert Checkbox
//sHint=Insert checkbox at current HTML Content
//sCategory=MainMenu.Insert
//sCondition=CURDB; DBRW; CURINFOITEM; HTMLEDIT
//sID=p.Ins.Checkbox
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=jun4rui

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};
var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};
try{
    var xNyf=new CNyfDb(-1);
    if(xNyf.isOpen()){
        if(!xNyf.isReadonly()){
            if(plugin.isContentEditable()){
                var sTxt="<input type='checkbox'>&nbsp;";
                plugin.replaceSelectedText(-1, sTxt, true);
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
