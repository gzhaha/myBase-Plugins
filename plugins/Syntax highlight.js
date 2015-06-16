
//sValidation=nyfjs
//sCaption=Syntax highlight ...
//sHint=Syntax highlight the whole or selected source code
//sCategory=MainMenu.Edit; Context.HtmlEdit
//sPosition=
//sCondition=CURDB; DBRW; CURINFOITEM; HTMLEDIT;
//sID=p.SyntaxHighlight
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


//2015.6.6 commit by wjj;
//C/C++-like source code supported, such as C/C++, JS, PHP, Java, C#, etc.

//2015.6.6 by gzhaha
//added Python, Perl

//2015.6.7 by gzhaha
//updated R, added ActionScript, Ruby
//efforts on dealing with # symbol within quotation marks: '...#...' or "...#..."

//12:31 6/7/2015
//efforts on dealing with if any html-tags (e.g. <pre>, <code>) in source code

//17:47 6/7/2015
//bugfix with < > operators in source code

//2015.6.8 by gzhaha
//added Delphi, Pig Latin, Bash

//11:41 6/9/2015
//added Cpp/Qt
//deal with HTML entities in source code (&nbsp;, &amp;, &#8195, &#x2003 ...)

//12:24 6/10/2015
//removed the 'HTMLSELECTED' requirement, so it can handle all content in HTML editor without having to first select all lines;

//2015.6.11 by gzhaha
//add js+myBase

//2015.6.12 by gzhaha
//add: substitute for $ character, the issue is related to parse '$' in source code
//add: substitute for the \ character, the issue is related to parse \\ in source code.

//2015.6.14 by gzhaha
//add: Pascal

//2015.6.15 by gzhaha
//add: support multi sets of symbols for block comment.

//16:46 6/15/2015
//updates: added the data structure {start: '', end: ''} to store pairs of block-level remark tags;

//18:28 6/16/2015
//support of objc & RegExp for reversed tags;


var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

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
			var c_sColorReservedTags5='#ff007f';
			var c_sColorReservedTags6='#ff5500';
			var c_sColorReservedTags7='#ff557f';

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

			var sTags_Qt=
				+ 'qint8|qint16|qint32|qint64|qlonglong|qptrdiff|qreal|quint8|quint16|quint32|quint64|quintptr|qulonglong|uchar|uint|ulong|ushort'
				+ '|QT_\\w\+|Q_\\w\+' //global Macros
				+ '|q[A-Z]\\w\+|qgetenv|qputenv|qrand|qsrand|qtTrId' //gloabl Functions
				+ '|Q\\w\+' //Qt widgets/classes
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
			//2015.6.7 add more keywords by gzhaha
			var sTags_R=
				'break,else,for,function,if,TRUE,in'
				+ ',next,repeat,return,while,FALSE,switch'
				+ ',NULL,NA,NaN,NA_integer_,NA_real_,NA_complex_,NA_character_'
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

			//2015.6.7 added for ActionScript by gzhaha;
			//http://help.adobe.com/zh_CN/ActionScript/3.0_ProgrammingAS3/WS5b3ccc516d4fbf351e63e3d118a9b90204-7f9b.html
			var sTags_ActionScript=
				'as,break,case,catch,class,const,default,delete,do,else,extends,finally'
				+ ',for,function,if,implements,import,in,instanceof,interface,internal,is'
				+ ',native,new,null,package,private,protected,public,return,super,switch,this'
				+ ',throw,try,typeof,use,var,void,while,with,dynamic,each,final,get,include'
				+ ',namespace,native,override,set,static'
				;

			//2015.6.7 added for Ruby by gzhaha;
			var sTags_Ruby=
				'alias,and,BEGIN,begin,break,case,class,def,define_method,defined,do,each,else,elsif'
				+ ',END,end,ensure,false,for,if,in,module,new,next,nil,not,or,raise,redo,rescue,retry,return'
				+ ',self,super,then,throw,true,undef,unless,until,when,while,yield'
				;

			var sTags_RubyBI=
				'Array Bignum Binding Class Continuation Dir Exception FalseClass File::Stat File Fixnum Fload'
				+',Hash Integer IO MatchData Method Module NilClass Numeric Object Proc Range Regexp String Struct::TMS Symbol'
				+',ThreadGroup Thread Time TrueClass'
				;

			//2015.6.8 added for Delphi by gzhaha;
			var sTags_Delphi=
				'abs,addr,and,ansichar,ansistring,array,as,asm,begin,boolean,byte,cardinal'
				+',case,char,class,comp,const,constructor,currency,destructor,div,do,double'
				+',downto,else,end,except,exports,extended,false,file,finalization,finally'
				+',for,function,goto,if,implementation,in,inherited,int64,initialization'
				+',integer,interface,is,label,library,longint,longword,mod,nil,not,object'
				+',of,on,or,packed,pansichar,pansistring,pchar,pcurrency,pdatetime,pextended'
				+',pint64,pointer,private,procedure,program,property,pshortstring,pstring'
				+',pvariant,pwidechar,pwidestring,protected,public,published,raise,real,real48'
				+',record,repeat,set,shl,shortint,shortstring,shr,single,smallint,string,then'
				+',threadvar,to,true,try,type,unit,until,uses,val,var,varirnt,while,widechar'
				+',widestring,with,word,write,writeln,xor'
				;

			//2015.6.8 added for Pig Latin by gzhaha;
			var sTags_PigLatin=
				'ABS,ACOS,ARITY,ASIN,ATAN,AVG,BAGSIZE,BINSTORAGE,BLOOM,BUILDBLOOM,CBRT,CEIL'
				+ ',CONCAT,COR,COS,COSH,COUNT,COUNT_STAR,COV,CONSTANTSIZE,CUBEDIMENSIONS,DIFF,DISTINCT,DOUBLEABS'
				+ ',DOUBLEAVG,DOUBLEBASE,DOUBLEMAX,DOUBLEMIN,DOUBLEROUND,DOUBLESUM,EXP,FLOOR,FLOATABS,FLOATAVG'
				+ ',FLOATMAX,FLOATMIN,FLOATROUND,FLOATSUM,GENERICINVOKER,INDEXOF,INTABS,INTAVG,INTMAX,INTMIN'
				+ ',INTSUM,INVOKEFORDOUBLE,INVOKEFORFLOAT,INVOKEFORINT,INVOKEFORLONG,INVOKEFORSTRING,INVOKER'
				+ ',ISEMPTY,JSONLOADER,JSONMETADATA,JSONSTORAGE,LAST_INDEX_OF,LCFIRST,LOG,LOG10,LOWER,LONGABS'
				+ ',LONGAVG,LONGMAX,LONGMIN,LONGSUM,MAX,MIN,MAPSIZE,MONITOREDUDF,NONDETERMINISTIC,OUTPUTSCHEMA'
				+ ',PIGSTORAGE,PIGSTREAMING,RANDOM,REGEX_EXTRACT,REGEX_EXTRACT_ALL,REPLACE,ROUND,SIN,SINH,SIZE'
				+ ',SQRT,STRSPLIT,SUBSTRING,SUM,STRINGCONCAT,STRINGMAX,STRINGMIN,STRINGSIZE,TAN,TANH,TOBAG'
				+ ',TOKENIZE,TOMAP,TOP,TOTUPLE,TRIM,TEXTLOADER,TUPLESIZE,UCFIRST,UPPER,UTF8STORAGECONVERTER'
				;

			var sTags_PigLatinKW=
				'VOID,IMPORT,RETURNS,DEFINE,LOAD,FILTER,FOREACH,ORDER,CUBE,DISTINCT,COGROUP'
				+ ',JOIN,CROSS,UNION,SPLIT,INTO,IF,OTHERWISE,ALL,AS,BY,USING,INNER,OUTER,ONSCHEMA,PARALLEL'
				+ ',PARTITION,GROUP,AND,OR,NOT,GENERATE,FLATTEN,ASC,DESC,IS,STREAM,THROUGH,STORE,MAPREDUCE'
				+ ',SHIP,CACHE,INPUT,OUTPUT,STDERROR,STDIN,STDOUT,LIMIT,SAMPLE,LEFT,RIGHT,FULL,EQ,GT,LT,GTE,LTE'
				+ ',NEQ,MATCHES,TRUE,FALSE,DUMP'
				;

			//2015.6.8 added for Bash by gzhaha;
			var sTags_BASH=
				'if,fi,then,elif,else,for,do,done,until,while,break,continue,case,function,return,in,eq,ne,ge,le'
				;

			var sTags_BASHBI=
				'alias,apropos,awk,basename,bash,bc,bg,builtin,bzip2,cal,cat,cd,cfdisk,chgrp,chmod,chown,chroot'
				+',cksum,clear,cmp,comm,command,cp,cron,crontab,csplit,cut,date,dc,dd,ddrescue,declare,df'
				+',diff,diff3,dig,dir,dircolors,dirname,dirs,du,echo,egrep,eject,enable,env,ethtool,eval'
				+',exec,exit,expand,export,expr,false,fdformat,fdisk,fg,fgrep,file,find,fmt,fold,format'
				+',free,fsck,ftp,gawk,getopts,grep,groups,gzip,hash,head,history,hostname,id,ifconfig'
				+',import,install,join,kill,less,let,ln,local,locate,logname,logout,look,lpc,lpr,lprint'
				+',lprintd,lprintq,lprm,ls,lsof,make,man,mkdir,mkfifo,mkisofs,mknod,more,mount,mtools'
				+',mv,netstat,nice,nl,nohup,nslookup,open,op,passwd,paste,pathchk,ping,popd,pr,printcap'
				+',printenv,printf,ps,pushd,pwd,quota,quotacheck,quotactl,ram,rcp,read,readonly,renice'
				+',remsync,rm,rmdir,rsync,screen,scp,sdiff,sed,select,seq,set,sftp,shift,shopt,shutdown'
				+',sleep,sort,source,split,ssh,strace,su,sudo,sum,symlink,sync,tail,tar,tee,test,time'
				+',times,touch,top,traceroute,trap,tr,true,tsort,tty,type,ulimit,umask,umount,unalias'
				+',uname,unexpand,uniq,units,unset,unshar,useradd,usermod,users,uuencode,uudecode,v,vdir'
				+',vi,watch,wc,whereis,which,who,whoami,Wget,xargs,yes'
				;

			//2015.6.11 added for myBase by gzhaha;
			var sTags_myBase=
				'about|alert|confirm|prompt|dropdown|textbox|input|beep|sleep|_gc'

				//+ '|platform.getOpenFileName|platform.getOpenFileNames|platform.getSaveFileName|platform.browseForFolder'
				//+ '|platform.getTempFile|platform.getTempPath|platform.getHomePath|platform.getCurrentPath|platform.deferDeleteFile'
				//+ '|platform.extractTextFromRtf|platform.extractTextFromHtml|platform.parseFile|platform.tokenizeText'
				//+ '|plugin.getAppWorkingDir|plugin.getAppExeFile|plugin.getPluginID|plugin.getScriptFile|plugin.getScriptTitle'
				//+ '|plugin.getShortcutFile|plugin.getLanguageFile|plugin.getPathToLangFiles|plugin.getDefRootContainer'
				//+ '|plugin.getDefNoteFn|plugin.refreshDocViews|plugin.refreshOutline|plugin.refreshLabelTree|plugin.refreshCalendar'
				//+ '|plugin.refreshOverview|plugin.getLocaleMsg|plugin.getDbCount|plugin.getDbIndex|plugin.getCurDbIndex'
				//+ '|plugin.getCurNavigationTab|plugin.getCurDocFile|plugin.getCurDocPath|plugin.getCurInfoItem|plugin.getCurLabelItem'
				//+ '|plugin.getSelectedInfoItems|plugin.getSelectedText|plugin.getTextContent|plugin.setTextContent'
				//+ '|plugin.replaceSelectedText|plugin.getQueryResults|plugin.runQuery|plugin.appendToResults'
				//+ '|plugin.setResultsPaneTitle|plugin.showResultsPane|plugin.initProgressRange|plugin.showProgressMsg'
				//+ '|plugin.ctrlProgressBar|plugin.destroyProgressBar|plugin.commitCurrentChanges|plugin.isContentEditable'
				//+ '|plugin.runDomScript|plugin.setDomDirty|plugin.setDomReadonly|plugin.getItemIDByPath|plugin.getPathByItemID'
				//+ '|localStorage.getItem|localStorage.setItem|localStorage.removeItem|localStorage.clear'

				//2015.6.12 @gzhaha :) Nice to have an item for mybase jsapi in the language list;
				//Revised by wjj; 
				//The API lists may vary in future releases; so RegExp patterns are recommended for better flexibility;
				//It is somewhat easy to highlight the global objects/functions and classes by the hard-coded names; 
				//however; it seemed hard to recognize member functions of objects created from the classes (eg. xNyf.isOpen(...);)

				+ '|plugin\.\\w+' //or use '|plugin(?=\.)' for global objects only; without memeber functions highlighted;
				+ '|platform\.\\w+'
				+ '|localStorage\.\\w+'
				+ '|CNyfDb|CDbItem|CLocalFile|CLocalDir|CByteArray'
				+ '|CXmlDocument|CAppWord|CAppExcel|CAppOutlook'
				;

			//2015.6.14 added for Pascal by gzhaha;
			var sTags_Pascal=
				'absolute,abstract,and,array,as,asm,assembler,at,automated,begin,case,cdecl,class,const,constructor,contains'
				+ ',default,destructor,dispid,dispinterface,div,do,downto,dynamic,else,end,except,export,exports,external,far'
				+ ',file,finalization,finally,for,forward,function,goto,if,implementation,implements,in,index,inherited'
				+ ',initialization,inline,interface,is,label,library,message,mod,name,near,nil,nodefault,not,object,of,on,or'
				+ ',out,overload,override,package,packed,pascal,private,procedure,program,property,protected,public,published'
				+ ',raise,read,readonly,record,register,reintroduce,repeat,requires,resident,resourcestring,safecall,set,shl'
				+ ',shr,stdcall,stored,string,then,threadvar,to,try,type,unit,until,uses,var,virtual,while,with,write,writeonly,xor'
				;

			//2015.6.16 added for Objective-C by wjj;
			//http://www.binpress.com/tutorial/objective-c-reserved-keywords/43
			//http://www.learn-cocos2d.com/2011/10/complete-list-objectivec-20-compiler-directives/
			var sTags_ObjC=
				'auto,break,case,char,const,continue,default,do,double,else,enum,extern,float,for,goto,if,inline,int,long,register'
				+ ',restrict,return,short,signed,sizeof,static,struct,switch,typedef,union,unsinged,void,volatile,while,__Bool,__Complex'
				+ ',BOOL,Class,bycopy,byref,id,IMP,in,inout,nil,NO,NULL,oneway,out,Protocol,SEL,self,super,YES'
				+ ',@interface,@end,@implementation,@protocol,@class,@public,@protected,@private,@property,@try,@throw,@catch,@finally,@synthesize,@dynamic,@selector,atomic,nonatomic,retain'
				+ ',@defs,@required,@optional,@end,@package,@end,@synchronized,@autoreleasepool,@selector,@encode,@compatibility_alias'
				;

			//https://developer.apple.com/library/prerelease/ios/documentation/Cocoa/Reference/Foundation/ObjC_classic/index.html
			var sTags_ObjC_Cocoa=
				'NS[A-Z][a-zA-Z]{2,64}'
				;

			//Array objects to save strings/remarks substituted with internal tags;
			var vRem=[]; //for remarks (blocks & lines);
			var vStr=[]; //for Strings;
			var nRefID=0; //ID of remarks/strings;

			//2012.1.31 The tags are used to temporarily substitute for strings/remarks;
			//The ref-tags must be absolutely strange to any programming languages;
			var sRefTag1='!`', sRefTag2='`!';

			var _ref_tag=function(){return sRefTag1+(nRefID++)+sRefTag2;};

			var _parse_remark_blocks=function(sSrc, vRemBlockTag){

				//To substitute internal tags for /*...*/ remark blocks;
				if(vRemBlockTag.constructor === Array){

					//2015.6.15 Pascal has three ways to perform comment, //XXXX, (*XXXX*) and {XXXX};
					//added codes to deal with multiple set of the symbols for block comment;

					for(var i in vRemBlockTag){
						var sRemBlockStart=vRemBlockTag[i].start, sRemBlockEnd=vRemBlockTag[i].end;
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
				}

				return sSrc;
			};

			var _parse_remark_line=function(sLine, vRemLineTag){

				var _replace=function(sLine, sRemLineTag){
					if(sLine && sRemLineTag){
						//2015.6.7 efforts on dealing with # symbol within quotation marks: '...#...' or "...#..."
						//2015.6.12 no need for this changes now.
						//if (sLine.search(/\".*\#.*\"/) < 0 && sLine.search(/\'.*\#.*\'/) <0){

							var xRE=new RegExp(sRemLineTag+'(.*)$', '');
							sLine=sLine.replace(xRE, function(w){
								var sTag=_ref_tag();
								vRem[vRem.length]={sTag: sTag, sVal: w};
								return sTag;
							});

						//}
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
					var r='<span style="color: %COLOR%">'.replace(/%COLOR%/g, c_sColorStrings)+sVal+'</span>';
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
						r+='<span style="color: %COLOR%">'.replace(/%COLOR%/g, c_sColorRemarks)+v[i]+'</span>';
					}
					s=s.replace(sTag, r);
				}
				return s;
			};

			var _syntax_cpplike=function(s, vTags, vRemBlockTag, vRemLineTag){

				s=s.replace(/\r\n/g, '\n')
					.replace(/\r/g, '\n')
					//.replace(/\\/g, '\\\\')
					;

				s=_parse_remark_blocks(s, vRemBlockTag);

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

				var _highlight_tags=function(sLine, sTags, bRegExp, bNoCase, sColor){

					if(!bRegExp) sTags=sTags.replace(/,/g, '|').replace(/\s/g, ''); //make into RegExp pattern;
					
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


				//2015.6.7 the opertotors (<, &, >) in source code may cause confusion to webkit on parsing them as HTML without pre-transformation;
				//tried a solution of precedingly transforming < and > operators into HTML entities,
				//and assumed that 'lt,gt' are not listed as keywords for any languages;
				//s=s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
				//Unfortunately, both lt and gt could be in use as keywords in some languages e.g. Perl, Bash;
				//Another solution: substitute special tags for < and > operators before syntax highlighting, 
				//and finally replace the tags with the appropriate HTML entities after all done;
				//2015.6.9 also need to substitute for the & character, so HTML entities can be preserved in resulting HTML.
				//2015.6.12 also need to substitute for the $ character, the issue is related to parse '$' in source code.
				//2015.6.12 also need to substitute for the \ character, the issue is related to parse \\ in source code.

				var sTagLT='`L`T`', sTagGT='`G`T`', sTagAND='`A`N`D`', sTagDL='`D`O`L`', sTagBS='`B`W`S`';
				var xReLT=new RegExp(sTagLT, 'g'), xReGT=new RegExp(sTagGT, 'g'), xReAND=new RegExp(sTagAND, 'g'), xReDL=new RegExp(sTagDL, 'g'), xReBS=new RegExp(sTagBS, 'g');
				s=s.replace(/</g, sTagLT).replace(/>/g, sTagGT).replace(/&/g, sTagAND).replace(/\$/g, sTagDL).replace(/\\/g, sTagBS);

				var vLines=s.split('\n');

				plugin.initProgressRange(plugin.getScriptTitle(), vLines.length);

				for(var k in vLines){

					//2015.6.7 the opertotors < and > in source code may cause confusion to webkit without transformation;
					//tried to precedingly transform < and > operators into HTML entities;
					//and assumed that 'lt,gt' are not listed as keywords for any languages;
					//var sLine=vLines[k].replace(/</g, '&lt;').replace(/>/g, '&gt;');

					//Unfortunately, both lt and gt are used as keywords in Perl;
					//Workaround: substitute special tags for < and > operators, and restore them after all done;
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
						var sTags=d.sTags, sColor=d.sColor, bNoCase=d.bNoCase, bRegExp=d.bRegExp;
						sLine=_highlight_tags(sLine, sTags, bRegExp, bNoCase, sColor);
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

				s=s.replace(xReLT, '&lt;').replace(xReGT, '&gt;').replace(xReAND, '&amp;').replace(xReDL, '$').replace(xReBS, '\\');

				//2015.6.16 "word-wrap: normal" for source code;
				//http://www.w3schools.com/cssref/pr_text_white-space.asp
				//http://www.w3schools.com/cssref/css3_pr_word-wrap.asp
				s='<pre style="font-family: %FONTNAME%; font-size: %FONTSIZE%; word-wrap: normal"><code>'
					.replace(/%FONTNAME%/g, c_sFontName)
					.replace(/%FONTSIZE%/g, c_sFontSize)
					+ s
					+ '</code></pre>'
					;

				return s;
			};

			var sSrc=plugin.getSelectedText(-1, false), bWhole=false;
			if(!sSrc){
				bWhole=true;
				sSrc=plugin.getTextContent(-1, false);
			}

			if(sSrc){

				var xLang={
					  'cpp': 'C/C++'
					, 'cppstl': 'C/C++ with STL'
					, 'cppstlqt': 'C/C++ with STL/Qt'
					, 'java': 'Java'
					, 'cs': 'C#'
					, 'js': 'Javascript'
					, 'jsmybase': 'Javascript with myBase Plugin APIs'
					, 'sql': 'T-SQL'
					, 'php': 'PHP'
					, 'go': 'Google GO'
					, 'gnur': 'GNU/R Language'
					, 'vb': 'Visual Basic'
					, 'py': 'Python'
					, 'pl': 'Perl'
					, 'acsc': 'ActionScript'
					, 'ruby': 'Ruby'
					, 'delphi': 'Delphi'
					, 'pigla': 'Pig Latin'
					, 'bash': 'Bash'
					, 'pascal': 'Pascal'
					, 'objc': 'Objective-C'
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

					//2015.6.15 For more info about comments in programming languages;
					//http://www.gavilan.edu/csis/languages/comments.html
					//http://stackoverflow.com/questions/3842443/comments-in-pascal

					var vTags=[], vRemBlockTag=[{start: '/*', end: '*/'}], vRemLineTag=['//'], sGenre='cpp';
					switch(sID){
						case 'cpp':
							vTags=[{sTags: sTags_Cpp, sColor: c_sColorKeywords}];
							break;
						case 'cppstl':
							vTags=[
								{sTags: sTags_Cpp, sColor: c_sColorKeywords}
								, {sTags: sTags_Stl, sColor: c_sColorReservedTags1}
							];
							break;
						case 'cppstlqt':
							vTags=[
								{sTags: sTags_Cpp, sColor: c_sColorKeywords}
								, {sTags: sTags_Stl, sColor: c_sColorReservedTags1}
								, {sTags: sTags_Qt, sColor: c_sColorReservedTags5, bNoCase: false, bRegExp: true}
							];
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
								, {sTags: sTags_JSEvent, sColor: c_sColorReservedTags3}
							];
							break;
						case 'jsmybase':
							vTags=[
								{sTags: sTags_JS, sColor: c_sColorKeywords}
								, {sTags: sTags_JSConst, sColor: c_sColorNumbers}
								//, {sTags: sTags_JSDom, sColor: c_sColorReservedTags1}
								//, {sTags: sTags_JSEvent, sColor: c_sColorReservedTags3}
								, {sTags: sTags_myBase, sColor: c_sColorReservedTags6, bRegExp: true}
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
							vRemBlockTag=[];
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
							vRemBlockTag=[];
							vRemLineTag=['REM', '\''];
							break;
						case 'py':
							vTags=[
								{sTags: sTags_Pythonkw, sColor: c_sColorKeywords}
								, {sTags: sTags_Python, sColor: c_sColorReservedTags3}
							];
							vRemBlockTag=[{start: "'''", end: "'''"}];
							vRemLineTag=['#'];
							break;
						case 'pl':
							vTags=[
								{sTags: sTags_Perlkw, sColor: c_sColorKeywords}
								, {sTags: sTags_Perl, sColor: c_sColorReservedTags3}
							];
							vRemBlockTag=[{start: '=pod', end: '=cut'}];
							vRemLineTag=['#'];
							break;
						case 'acsc':
							vTags=[
								{sTags: sTags_ActionScript, sColor: c_sColorKeywords}
							];
							break;
						case 'ruby':
							vTags=[
								{sTags: sTags_Ruby, sColor: c_sColorKeywords}
								, {sTags: sTags_RubyBI, sColor: c_sColorReservedTags3}
							];
							vRemBlockTag=[{start: '=begin', end: '=end'}];
							vRemLineTag=['#'];
							break;
						case 'pigla':
							vTags=[
								{sTags: sTags_PigLatinKW, sColor: c_sColorKeywords}
								, {sTags: sTags_PigLatin, sColor: c_sColorReservedTags3}
							];
							vRemLineTag=['--'];
							break;
						case 'bash':
							vTags=[
								{sTags: sTags_BASH, sColor: c_sColorKeywords}
								, {sTags: sTags_BASHBI, sColor: c_sColorReservedTags3}
							];
							vRemBlockTag=[];
							vRemLineTag=['#'];
							break;
						case 'delphi':
							vTags=[
								{sTags: sTags_Delphi, sColor: c_sColorKeywords}
							];
							//vRemBlockTag=[{start: '{', end: '}'}];
							vRemBlockTag=[{start: '(*', end: '*)'}, {start: '{', end: '}'}];
							break;
						case 'pascal':
							vTags=[
								{sTags: sTags_Pascal, sColor: c_sColorKeywords}
							];
							//2015.6.15 Pascal has three ways to perform comment, //XXXX, (*XXXX*) and {XXXX};
							//Below two lines using array to define two sets of the start and end symbols;
							vRemBlockTag=[{start: '(*', end: '*)'}, {start: '{', end: '}'}];
							break;
						case 'objc':
							vTags=[
								{sTags: sTags_ObjC, sColor: c_sColorKeywords}
								, {sTags: sTags_ObjC_Cocoa, sColor: c_sColorReservedTags3, bRegExp: true}
							];
							break;
					}

					var sHtml;
					{
						if(sGenre=='cpp'){
							sHtml=_syntax_cpplike(sSrc, vTags, vRemBlockTag, vRemLineTag);
						}else if(sGenre=='html'){
							//todo ......
						}
					}

					if(sHtml){
						if(bWhole){

							if(plugin.selectAllText){ //2015.6.10 requires latest build b-20;

								plugin.selectAllText();
								plugin.replaceSelectedText(-1, sHtml, true);

							}else{

								//2015.6.10 setHTML clears the entire DOM including UNDO stack, so it needs to first save if any changes as a history revision for Undoable;
								if(plugin.isContentEditable()) plugin.commitCurrentChanges();

								plugin.setTextContent(-1, sHtml, true);
								plugin.setDomDirty(-1, true);

							}

						}else{

							plugin.replaceSelectedText(-1, sHtml, true);

						}
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
