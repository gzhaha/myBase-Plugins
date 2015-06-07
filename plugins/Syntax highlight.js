
//sValidation=nyfjs
//sCaption=Syntax highlight ...
//sHint=Make selected source code syntax highlighted
//sCategory=MainMenu.Edit; Context.HtmlEdit
//sPosition=
//sCondition=CURDB; DBRW; CURINFOITEM; HTMLEDIT
//sID=p.SyntaxHighlight
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=wjjsoft


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
	s=s.replace(/  /g,	' &nbsp;'); //&nbsp; = non-breaking space;
	//and more ...
	return s;
};

try{
	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		if(!xNyf.isReadonly() && plugin.isContentEditable()){

			var c_sFontSize='10pt';
			var c_sFontName='Lucida Console, Courier New';

			var c_sColorNormal='#000000';
			var c_sColorRemarks='#008000';
			var c_sColorStrings='#800080';
			var c_sColorNumbers='#ff0000';

			var c_sColorKeywords='#0000ff';

			var c_sColorReservedTags1='#8000ff';
			var c_sColorReservedTags2='#004080';
			var c_sColorReservedTags3='#ff8000';
			var c_sColorReservedTags4='#0080c0';

			var sTags_Cpp=
				//for C++ Macros
				'include,defined,define,ifdef,endif,elif,pragma,null'

				//for C (ISO/ANSI C90)
				+ ',auto,break,case,char,const,continue,default,do,double,else,enum,extern'
				+ ',float,for,goto,if,inline,int,long,register,restrict,return'
				+ ',short,signed,sizeof,static,struct,switch,typedef'
				+ ',union,unsigned,void,volatile,while'

				//for C (ISO/ANSI C99 appendix)
				+ ',_Bool,_Complex,_Imaginary'

				//for C++
				+ ',and,and_eq,asm,bitand,bitor,bool,catch,class,compl'
				+ ',const_cast,delete,dynamic_cast,explicit,export,false,friend'
				+ ',mutable,namespace,new,not,not_eq,operator,or,or_eq'
				+ ',private,protected,public,reinterpret_cast,static_cast'
				+ ',template,this,throw,true,try,typeid,typename,using'
				+ ',wchar_t,virtual,xor,xor_eq'

				//for C++0x
				+ ',alignof,char16_t,char32_t,constexpr,decltype,noexcept,nullptr'
				+ ',static_assert,thread_local'
				;

			var sTags_Stl=
				'std,exception'
				+ ',string,list,vector,stack,pair,map,set,multimap,multiset,queue,deque'
				+ ',priority_queue,bitset,valarray'
				+ ',cin,cout,cerr,clog,wcin,wcout,wcerr,wclog'
				+ ',ios,fstream,wfstream,ifstream,wifstream,ofstream,wofstream'
				+ ',istream,wistream,ostream,wostream,streambuf,wstreambuf'
				+ ',stringstream,wstringstream,istringstream,wistringstream,ostringstream,wostringstream'
				+ ',strstream,istrstream,wistrstream,ostrstream,wostrstream'
				+ ',iterator,const_iterator,reverse_iterator,const_reverse_iterator'
				+ ',back_insert_iterator,front_insert_iterator,insert_iterator'
				+ ',istream_iterator,ostream_iterator,istreambuf_iterator,ostreambuf_iterator'
				;

			var sTags_Java=
				'abstract,boolean,break,byte,case,catch,char,class,continue,default'
				+ ',do,double,else,enum,extends,false,final,finally,float,for'
				+ ',if,implements,import,instanceof,int,interface,long,native,new,null'
				+ ',package,private,protected,public,return,short,static,strictfp,super,switch'
				+ ',synchronized,this,throw,throws,transient,true,try,void,volatile,while'
				+ ',const,goto'
				;

			var sTags_CSharp=
				'abstract,event,new,struct,as,explicit,null,switch,base,extern,object,this'
				+ ',bool,false,operator,throw,break,finally,out,true,byte,fixed,override,try'
				+ ',case,float,params,typeof,catch,for,private,uint,char,foreach,protected,ulong'
				+ ',class,if,readonly,unsafe,const,implicit,ref,ushort,continue,in,return,using'
				+ ',decimal,int,sbyte,virtual,default,interface,sealed,volatile,delegate,internal,short,void'
				+ ',do,is,sizeof,while,double,lock,stackalloc,else,long,static,enum,namespace,string'
				;

			var sTags_JS=
				//js keywords
				'break,case,catch,continue,default,delete,do,else,finally,for,function'
				+ ',if,in,instanceof,new,return,switch,this,throw,try,typeof,var,void,while,with'

				//js reserved
				+ ',abstract,boolean,byte,char,class,const,debugger,double,enum,export'
				+ ',extends,final,float,goto,implements,import,int,interface,long,native'
				+ ',package,private,protected,public,short,static,super,synchronized'
				+ ',throws,transient,volatile'

				//js classes
				+ ',Array,Boolean,Date,Math,Number,String,RegExp,Functions,Events'
				;

			var sTags_JSConst=
				//JS window constants
				'null,undefined,NaN,E,PI,SQRT2,SQRT1_2,LN2,LN10,LOG2E,LOG10E'

			var sTags_JSDom=
				//JS DOM objects
				'window,self,document,navigator,screen,history,location,alert,confirm,prompt,Infinity,java,Packages'

			var sTags_JSEvent=
				//JS DOM events
				'onabort,onblur,onchange,onclick,ondblclick,onerror,onfocus,onkeydown,onkeypress,onkeyup,onload'
				+ ',onmousedown,onmousemove,onmouseout,onmouseover,onmouseup,onreset,onresize,onselect,onsubmit,onunload'

			var sTags_HTML=
				'!DOCTYPE,a,abbr,acronym,address,applet,area,b,base,basefont,bdo,big'
				+ ',blockquote,body,br,button,caption,center,cite,code,col,colgroup,dd,del'
				+ ',dir,div,dfn,dl,em,fieldset,font,form,frame,frameset,h1,h2,h3,h4,h5,h6,h7,h8'
				+ ',head,hr,html,i,iframe,img,input,ins,isindex,kbd,label,legend,li,link,map'
				+ ',menu,meta,noframes,noscript,object,ol,optgroup,option,p,param,pre,q,s'
				+ ',samp,script,select,small,span,strike,strong,style,sub,sup,table,tbody'
				+ ',td,textarea,tfoot,th,thead,title,tr,tt,u,ul,var,xmp'
				;

			var sTags_Sql=
				'add,exit,primary'
				+ ',all,fetch,print'
				+ ',alter,file,privileges'
				+ ',and,fillfactor,proc'
				+ ',any,floppy,procedure'
				+ ',as,for,processexit'
				+ ',asc,foreign,public'
				+ ',authorization,freetext,raiserror'
				+ ',avg,freetexttable,read'
				+ ',backup,from,readtext'
				+ ',begin,full,reconfigure'
				+ ',between,goto,references'
				+ ',break,grant,repeatable'
				+ ',browse,group,replication'
				+ ',bulk,having,restore'
				+ ',by,holdlock,restrict'
				+ ',cascade,identity,return'
				+ ',case,identity_insert,revoke'
				+ ',check,identitycol,right'
				+ ',checkpoint,if,rollback'
				+ ',close,in,rowcount'
				+ ',clustered,index,rowguidcol'
				+ ',coalesce,inner,rule'
				+ ',column,insert,save'
				+ ',commit,intersect,schema'
				+ ',committed,into,select'
				+ ',compute,is,serializable'
				+ ',confirm,isolation,session_user'
				+ ',constraint,join,set'
				+ ',contains,key,setuser'
				+ ',containstable,kill,shutdown'
				+ ',continue,left,some'
				+ ',controlrow,level,statistics'
				+ ',convert,like,sum'
				+ ',count,lineno,system_user'
				+ ',create,load,table'
				+ ',cross,max,tape'
				+ ',current,min,temp'
				+ ',current_date,mirrorexit,temporary'
				+ ',current_time,national,textsize'
				+ ',current_timestamp,nocheck,then'
				+ ',current_user,nonclustered,to'
				+ ',cursor,not,top'
				+ ',database,null,tran'
				+ ',dbcc,nullif,transaction'
				+ ',deallocate,of,trigger'
				+ ',declare,off,truncate'
				+ ',default,offsets,tsequal'
				+ ',delete,on,uncommitted'
				+ ',deny,once,union'
				+ ',desc,only,unique'
				+ ',disk,open,update'
				+ ',distinct,opendatasource,updatetext'
				+ ',distributed,openquery,use'
				+ ',double,openrowset,user'
				+ ',drop,option,values'
				+ ',dummy,or,varying'
				+ ',dump,order,view'
				+ ',else,outer,waitfor'
				+ ',end,over,when'
				+ ',errlvl,percent,where'
				+ ',errorexit,perm,while'
				+ ',escape,permanent,with'
				+ ',except,pipe,work'
				+ ',exec,plan,writetext'
				+ ',execute,precision'
				+ ',exists,prepare'
				;

			var sTags_Php=
				'and,or,xor,__FILE__,exception'
				+ ',__LINE__,array,as,break,case'
				+ ',class,const,continue,declare,default'
				+ ',die,do,echo,else,elseif'
				+ ',empty,enddeclar,endfor,endforeach,endif'
				+ ',endswitch,endwhile,eval,exit,extends'
				+ ',for,foreach,function,global,if'
				+ ',include,include_once,isset,list,new'
				+ ',print,require,require_once,return,static'
				+ ',switch,unset,use,var,while'
				+ ',__FUNCTION__,__CLASS__,__METHOD__,final,php_user_filter'
				+ ',interface,implements,extends,public,private'
				+ ',protected,abstract,clone,try,catch'
				+ ',throw,cfunction,this'
				;

			//2012.7.19 added for R-language;
			var sTags_R=
				'break,else,for,function,if,TRUE,in'
				+ ',next,repeat,return,while,FALSE,switch'
				+ ',NULL,NA,NaN'
				;

			//2012.7.19  added for Google GO
			//https://golang-china.googlecode.com/svn/trunk/Chinese/golang.org/index.html
			var sTags_Go=
				'package,import,func,const,var,for'
				+ ',if,else,switch,case,default,select,return,break,continue'
				+ ',range,map,type,struct,interface,new,go,defer'
				+ ',byte,int,string,uint32,uint64,float32,float64'
				+ ',nil,true,false'
				;

			//2012.7.27 added for Visual Basic;
			//http://msdn.microsoft.com/en-us/library/ksh7h19t%28v=vs.80%29.aspx
			var sTags_VB_Reserved=
				'AddHandler,AddressOf,Alias,And,AndAlso,As,Boolean,ByRef,Byte,ByVal'
				+ ',Call,Case,Catch,CBool,CByte,CChar,CDate,CDec,CDbl,Char,CInt,Class'
				+ ',CLng,CObj,Const,Continue,CSByte,CShort,CSng,CStr,CType,CUInt,CULng'
				+ ',CUShort,Date,Decimal,Declare,Default,Delegate,Dim,DirectCast,Do'
				+ ',Double,Each,Else,ElseIf,End,EndIf,Enum,Erase,Error,Event,Exit,False'
				+ ',Finally,For,Friend,Function,Get,GetType,Global,GoSub,GoTo,Handles,If'
				+ ',Implements,Imports,In,Inherits,Integer,Interface,Is,IsNot,Let,Lib,Like'
				+ ',Long,Loop,Me,Mod,Module,MustInherit,MustOverride,MyBase,MyClass,Namespace'
				+ ',Narrowing,New,Next,Not,Nothing,NotInheritable,NotOverridable,Object,Of,On'
				+ ',Operator,Option,Optional,Or,OrElse,Overloads,Overridable,Overrides,ParamArray'
				+ ',Partial,Private,Property,Protected,Public,RaiseEvent,ReadOnly,ReDim,REM,RemoveHandler'
				+ ',Resume,Return,SByte,Select,Set,Shadows,Shared,Short,Single,Static,Step,Stop'
				+ ',String,Structure,Sub,SyncLock,Then,Throw,To,True,Try,TryCast,TypeOf,Variant'
				+ ',Wend,UInteger,ULong,UShort,Using,When,While,Widening,With,WithEvents,WriteOnly'
				+ ',Xor,#Const,#Else,#ElseIf,#End,#If'
				;
			var sTags_VB_Unreserved=
				'Ansi,Assembly,Auto,Binary,Compare,Custom,Explicit,IsFalse,IsTrue,Mid,Off'
				+ ',Preserve,Strict,Text,Unicode,Until,#ExternalSource,#Region'
				;
			
			//2015.6.6 added for Python by gzhaha;
			//https://docs.python.org/2/library/functions.html
			var sTags_Python=
				'abs,all,any,apply,basestring,bin,bool,buffer,callable'
				+ ',chr,classmethod,cmp,coerce,compile,complex,delattr,dict,dir'
				+ ',divmod,enumerate,eval,execfile,file,filter,float,format,frozenset'
				+ ',getattr,globals,hasattr,hash,help,hex,id,input,int,intern'
				+ ',isinstance,issubclass,iter,len,list,locals,long,map,max,min,next'
				+ ',object,oct,open,ord,pow,print,property,range,raw_input,reduce'
				+ ',reload,repr,reversed,round,set,setattr,slice,sorted,staticmethod'
				+ ',str,sum,super,tuple,type,type,unichr,unicode,vars,xrange,zip,__import__'
				;
			
			//2015.6.6 added for Python by gzhaha;
			var sTags_Pythonkw=
				'and,as,assert,break,class,continue,def,del,elif,else'
				+ ',except,exec,finally,for,from,global,if,import,in,is'
				+ ',lambda,not,or,pass,print,raise,return,try,while,with,yield'
				;
				
			//2015.6.6 added for Perl by gzhaha;
			//http://perldoc.perl.org/index-functions.html
			var sTags_Perl=
				'abs,accept,alarm,atan2,bind,binmode,chdir,chmod,chomp,chop,chown,chr'
				+ ',chroot,close,closedir,connect,cos,crypt,defined,delete,each,endgrent'
				+ ',endhostent,endnetent,endprotoent,endpwent,endservent,eof,exec,exists'
				+ ',exp,fcntl,fileno,flock,fork,format,formline,getc,getgrent,getgrgid'
				+ ',getgrnam,gethostbyaddr,gethostbyname,gethostent,getlogin,getnetbyaddr'
				+ ',getnetbyname,getnetent,getpeername,getpgrp,getppid,getpriority'
				+ ',getprotobyname,getprotobynumber,getprotoent,getpwent,getpwnam,getpwuid'
				+ ',getservbyname,getservbyport,getservent,getsockname,getsockopt,glob'
				+ ',gmtime,grep,hex,index,int,ioctl,join,keys,kill,lc,lcfirst,length,link'
				+ ',listen,localtime,lock,log,lstat,map,mkdir,msgctl,msgget,msgrcv,msgsnd'
				+ ',oct,open,opendir,ord,pack,pipe,pop,pos,print,printf,prototype,push'
				+ ',quotemeta,rand,read,readdir,readline,readlink,readpipe,recv,rename'
				+ ',reset,reverse,rewinddir,rindex,rmdir,scalar,seek,seekdir,select,semctl'
				+ ',semget,semop,send,setgrent,sethostent,setnetent,setpgrp,setpriority'
				+ ',setprotoent,setpwent,setservent,setsockopt,shift,shmctl,shmget,shmread'
				+ ',shmwrite,shutdown,sin,sleep,socket,socketpair,sort,splice,split,sprintf'
				+ ',sqrt,srand,stat,study,substr,symlink,syscall,sysopen,sysread,sysseek'
				+ ',system,syswrite,tell,telldir,time,times,tr,truncate,uc,ucfirst,umask'
				+ ',undef,unlink,unpack,unshift,utime,values,vec,wait,waitpid,warn,write'
				;
			
			var sTags_Perlkw=
				'bless,caller,continue,dbmclose,dbmopen,die,do,dump,else,elsif,eval,exit'
				+ ',for,foreach,goto,if,import,last,local,my,next,no,our,package,redo,ref'
				+ ',require,return,sub,tie,tied,unless,untie,until,use,wantarray,while'
				;
			
			//Array objects to save strings/remarks substituted with internal tags;
			var vRem=[]; //for remarks (blocks & lines);
			var vStr=[]; //for Strings;
			var nRefID=0; //ID of remarks/strings;

			//2012.1.31 The tags are used to temporarily substitute for strings/remarks;
			//The ref-tags must be absolutely strange to any programming languages;
			var sRefTag1='!`', sRefTag2='`!';

			var _ref_tag=function(){return sRefTag1+(nRefID++)+sRefTag2;};

			var _parse_remark_blocks=function(sSrc, sRemBlockStart, sRemBlockEnd){
				//To substitute internal tags for /*...*/ remark blocks;
				if(sRemBlockStart && sRemBlockEnd){
					var s2=sSrc; sSrc='';
					while(s2){
						var p1=s2.indexOf(sRemBlockStart);
						if(p1>=0){
							var p2=s2.indexOf(sRemBlockEnd, p1+sRemBlockStart.length);
							if(p2<0) p2=s2.length; else p2+=sRemBlockEnd.length;
							//if(p2>0)
							{
								var left=s2.substr(0, p1), sRem=s2.substring(p1, p2), right=s2.substr(p2);
								var sTag=_ref_tag();
								sSrc+=(left+sTag);
								s2=right;
								vRem[vRem.length]={sTag: sTag, sVal: sRem};
							}
						}else{
							sSrc+=s2;
							s2='';
						}
					}
				}
				return sSrc;
			};

			var _parse_remark_line=function(sLine, vRemLineTag){

				var _replace=function(sLine, sRemLineTag){
					if(sLine && sRemLineTag){
						xRE=new RegExp(sRemLineTag+'(.*)$', '');
						sLine=sLine.replace(xRE, function(w){
							var sTag=_ref_tag();
							vRem[vRem.length]={sTag: sTag, sVal: w};
							return sTag;
						});
					}
					return sLine;
				};

				//substitute internal tags for the remark lines;
				for(var i in vRemLineTag){
					sLine=_replace(sLine, vRemLineTag[i]);
				}
				return sLine;
			};

			var _parse_strings=function(sLine, sQuotationMark){

				//substitute for constants of C-string/HTML-value, like "...";
				//substitute for constants of JS-string/HTML-value/C-char, like '...';

				var _pos_of_quotationmark=function(s, iStart){
					var p;
					while( (p=s.indexOf(sQuotationMark, iStart)) >0 ){
						if(s.charAt(p-1)=='\\'){
							iStart=p+sQuotationMark.length;
						}else{
							break;
						}
					}
					return p;
				};

				var s=sLine; sLine='';
				while(s){
					var p1=_pos_of_quotationmark(s, 0);
					if(p1>=0){
						var p2=_pos_of_quotationmark(s, p1+sQuotationMark.length);
						if(p2<0) p2=s.length; else p2+=sQuotationMark.length;
						//if(p2>0)
						{
							var left=s.substr(0, p1), sStr=s.substring(p1, p2), right=s.substr(p2);
							var sTag=_ref_tag();
							sLine+=(left+sTag);
							s=right;
							vStr[vStr.length]={sTag: sTag, sVal: sStr};
						}
					}else{
						sLine+=s;
						s='';
					}
				}
				return sLine;
			};

			var _restore_strings=function(s){
				//restore String contants;
				for(var j=vStr.length-1; j>=0; --j){
					var sTag=vStr[j].sTag, sVal=vStr[j].sVal;
					var r='<span style="color: %COLOR%">'.replace(/%COLOR%/g, c_sColorStrings)+_html_encode(sVal)+'</span>';
					s=s.replace(sTag, r);
				}
				return s;
			};

			var _restore_remarks=function(s){
				//restore remark blocks and lines;
				for(var j=vRem.length-1; j>=0; --j){
					var sTag=vRem[j].sTag, sVal=vRem[j].sVal;
					var v=sVal.split('\n'), r='';
					for(var i in v){
						if(r) r+='\n';
						r+='<span style="color: %COLOR%">'.replace(/%COLOR%/g, c_sColorRemarks)+_html_encode(v[i])+'</span>';
					}
					s=s.replace(sTag, r);
				}
				return s;
			};

			var _syntax_cpplike=function(s, vTags, sRemBlockStart, sRemBlockEnd, vRemLineTag){

				s=s.replace(/\r\n/g, '\n')
					.replace(/\r/g, '\n')
					//.replace(/\\/g, '\\\\')
					;

				s=_parse_remark_blocks(s, sRemBlockStart, sRemBlockEnd);

				var _highlight_tags=function(sLine, sTags, sColor, bNoCase){
					sTags=sTags.replace(/,/g, '|').replace(/\s/g, ''); //make into RegExp pattern;
					if(sLine && sTags){

						var sFmt='<span style="color: %COLOR%;">'.replace(/%COLOR%/g, sColor);

						//This RegExp tests but not save/consume trailing characters;
						var xRE=new RegExp( '(\\W+|^)(' + sTags + ')(?=\\W|$)', 'g'+(bNoCase?'i':''));
						sLine=sLine.replace(xRE, function(w, s1, s2){
							return s1+sFmt+s2+'</span>';
						});
					}
					return sLine;
				};

				var _highlight_numbers=function(sLine, sColor){
					if(sLine){
						var sFmt='<span style="color: %COLOR%;">'.replace(/%COLOR%/g, sColor);

						//Hexadecimal, Decimal/Float;
						var xRE=new RegExp( '(\\W+)((?:0x[0-9a-f]+)|(?:[0-9.]+))(?=\\W?)', 'ig');
						sLine=sLine.replace(xRE, function(w, s1, s2){
							//first check to see if it is a tag for strings/remarks;
							var p=s1.indexOf(sRefTag1);
							if(p>=0 && p==s1.length-sRefTag1.length){
								return w; //avoid replacing temporary tags of strings/remarks;
							}else{
								return s1+sFmt+s2+'</span>';
							}
						});
					}
					return sLine;
				};

				var vLines=s.split('\n'), xRE;

				plugin.initProgressRange(plugin.getScriptTitle(), vLines.length);

				for(var k in vLines){

					var sLine=vLines[k];

					var sTitle=_trim(sLine), nMaxLen=32; if(sTitle.length>nMaxLen) sTitle=sTitle.substr(0,nMaxLen);
					var bContinue=plugin.ctrlProgressBar(sTitle, 1, true);
					if(!bContinue) return '';

					sLine=_parse_remark_line(sLine, vRemLineTag); //cpp-like comment lines;
					sLine=_parse_strings(sLine, '\''); //js-like strings;
					sLine=_parse_strings(sLine, '\"'); //cpp-like strings;

					sLine=_highlight_numbers(sLine, c_sColorNumbers);

					for(var j in vTags){
						var d=vTags[j];
						var sTags=d.sTags, sColor=d.sColor, bNoCase=d.bNoCase;
						sLine=_highlight_tags(sLine, sTags, sColor, bNoCase);
					}

					vLines[k]=sLine;
				}

				s='';
				for(var j in vLines){
					if(s) s+='\n';
					s+=vLines[j];
				}

				s=_restore_strings(s);
				s=_restore_remarks(s);

				s='<pre><code style="font-family: %FONTNAME%; font-size: %FONTSIZE%;">'
					.replace(/%FONTNAME%/g, c_sFontName)
					.replace(/%FONTSIZE%/g, c_sFontSize)
					+s
					+'</code></pre>'
					;

				return s;
			};

			var sSrc=plugin.getSelectedText(-1, false);

			if(sSrc){

				var xLang={
					  'cpp': 'C/C++'
					, 'cppstl': 'C/C++ with STL'
					, 'java': 'Java'
					, 'cs': 'C#'
					, 'js': 'Javascript'
					, 'sql': 'T-SQL'
					, 'php': 'PHP'
					, 'go': 'Google GO'
					, 'gnur': 'GNU/R Language'
					, 'vb': 'Visual Basic'
					, 'py': 'Python'
					, 'pl': 'Perl' 
				};

				var vIDs=[], vLangs=[];
				for(var i in xLang){
					vIDs[vIDs.length]=i;
					vLangs[vLangs.length]=xLang[i];
				}

				sCfgKey='SyntaxHighlight.iAction';
				var sMsg=_lc2('SelLang', 'Please select in which programming language to highlight the code');
				var iSel=dropdown(sMsg, vLangs, localStorage.getItem(sCfgKey));
				if(iSel>=0){

					localStorage.setItem(sCfgKey, iSel);

					//sSrc='\n'+sSrc;

					var sID=vIDs[iSel];

					var vTags=[], sRemBlockStart='/*', sRemBlockEnd='*/', vRemLineTag=['//'], sGenre='cpp';
					switch(sID){
						case 'cpp':
							vTags=[{sTags: sTags_Cpp, sColor: c_sColorKeywords}];
							break;
						case 'cppstl':
							vTags=[{sTags: sTags_Cpp, sColor: c_sColorKeywords}, {sTags: sTags_Stl, sColor: c_sColorReservedTags1}];
							break;
						case 'java':
							vTags=[{sTags: sTags_Java, sColor: c_sColorKeywords}];
							break;
						case 'cs':
							vTags=[{sTags: sTags_CSharp, sColor: c_sColorKeywords}];
							break;
						case 'js':
							vTags=[
								{sTags: sTags_JS, sColor: c_sColorKeywords}
								, {sTags: sTags_JSConst, sColor: c_sColorNumbers}
								, {sTags: sTags_JSDom, sColor: c_sColorReservedTags1}
								, {sTags: sTags_JSEvent, sColor: c_sColorReservedTags2}
							];
							break;
						case 'sql':
							vTags=[{sTags: sTags_Sql, sColor: c_sColorKeywords, bNoCase: true}];
							vRemLineTag=['--'];
							break;
						case 'php':
							vTags=[{sTags: sTags_Php, sColor: c_sColorKeywords}];
							break;
						case 'gnur':
							vTags=[{sTags: sTags_R, sColor: c_sColorKeywords}];
							sRemBlockStart='';
							sRemBlockEnd='';
							vRemLineTag=['#'];
							break;
						case 'go':
							vTags=[{sTags: sTags_Go, sColor: c_sColorKeywords}];
							break;
						case 'vb':
							vTags=[
								{sTags: sTags_VB_Reserved, sColor: c_sColorKeywords, bNoCase: true}
								, {sTags: sTags_VB_Unreserved, sColor: c_sColorReservedTags1, bNoCase: true}
							];
							sRemBlockStart='';
							sRemBlockEnd='';
							vRemLineTag=['REM', '\''];
							break;
						case 'py':
							vTags=[
								{sTags: sTags_Pythonkw, sColor: c_sColorKeywords}
								, {sTags: sTags_Python, sColor: c_sColorReservedTags3}
							];
							vRemLineTag=['#'];
							sRemBlockStart="'''";
							sRemBlockEnd="'''";
							break;
						case 'pl':
							vTags=[
								{sTags: sTags_Perlkw, sColor: c_sColorKeywords}
								, {sTags: sTags_Perl, sColor: c_sColorReservedTags3}
							];
							vRemLineTag=['#'];
							sRemBlockStart="=pod";
							sRemBlockEnd="=cut";
							break;
					}

					var sHtml;
					{
						if(sGenre=='cpp'){
							sHtml=_syntax_cpplike(sSrc, vTags, sRemBlockStart, sRemBlockEnd, vRemLineTag);
						}else if(sGenre=='html'){
							//todo ......
						}
					}

					if(sHtml){
						plugin.replaceSelectedText(-1, sHtml, true);
					}
				}

			}else{
				alert(_lc('Prompt.Warn.NoTextSelected', 'No text is currently selected.'));
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
