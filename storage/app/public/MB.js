
/*AES加解密函式*/
var CryptoJS=CryptoJS||function(u,p){var d={},l=d.lib={},s=function(){},t=l.Base={extend:function(a){s.prototype=this;var c=new s;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
r=l.WordArray=t.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=p?c:4*a.length},toString:function(a){return(a||v).stringify(this)},concat:function(a){var c=this.words,e=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var k=0;k<a;k++)c[j+k>>>2]|=(e[k>>>2]>>>24-8*(k%4)&255)<<24-8*((j+k)%4);else if(65535<e.length)for(k=0;k<a;k+=4)c[j+k>>>2]=e[k>>>2];else c.push.apply(c,e);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=u.ceil(c/4)},clone:function(){var a=t.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],e=0;e<a;e+=4)c.push(4294967296*u.random()|0);return new r.init(c,a)}}),w=d.enc={},v=w.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++){var k=c[j>>>2]>>>24-8*(j%4)&255;e.push((k>>>4).toString(16));e.push((k&15).toString(16))}return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j+=2)e[j>>>3]|=parseInt(a.substr(j,
2),16)<<24-4*(j%8);return new r.init(e,c/2)}},b=w.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++)e.push(String.fromCharCode(c[j>>>2]>>>24-8*(j%4)&255));return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j++)e[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new r.init(e,c)}},x=w.Utf8={stringify:function(a){try{return decodeURIComponent(escape(b.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return b.parse(unescape(encodeURIComponent(a)))}},
q=l.BufferedBlockAlgorithm=t.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=x.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,e=c.words,j=c.sigBytes,k=this.blockSize,b=j/(4*k),b=a?u.ceil(b):u.max((b|0)-this._minBufferSize,0);a=b*k;j=u.min(4*a,j);if(a){for(var q=0;q<a;q+=k)this._doProcessBlock(e,q);q=e.splice(0,a);c.sigBytes-=j}return new r.init(q,j)},clone:function(){var a=t.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});l.Hasher=q.extend({cfg:t.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){q.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,e){return(new a.init(e)).finalize(b)}},_createHmacHelper:function(a){return function(b,e){return(new n.HMAC.init(a,
e)).finalize(b)}}});var n=d.algo={};return d}(Math);
(function(){var u=CryptoJS,p=u.lib.WordArray;u.enc.Base64={stringify:function(d){var l=d.words,p=d.sigBytes,t=this._map;d.clamp();d=[];for(var r=0;r<p;r+=3)for(var w=(l[r>>>2]>>>24-8*(r%4)&255)<<16|(l[r+1>>>2]>>>24-8*((r+1)%4)&255)<<8|l[r+2>>>2]>>>24-8*((r+2)%4)&255,v=0;4>v&&r+0.75*v<p;v++)d.push(t.charAt(w>>>6*(3-v)&63));if(l=t.charAt(64))for(;d.length%4;)d.push(l);return d.join("")},parse:function(d){var l=d.length,s=this._map,t=s.charAt(64);t&&(t=d.indexOf(t),-1!=t&&(l=t));for(var t=[],r=0,w=0;w<
l;w++)if(w%4){var v=s.indexOf(d.charAt(w-1))<<2*(w%4),b=s.indexOf(d.charAt(w))>>>6-2*(w%4);t[r>>>2]|=(v|b)<<24-8*(r%4);r++}return p.create(t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(u){function p(b,n,a,c,e,j,k){b=b+(n&a|~n&c)+e+k;return(b<<j|b>>>32-j)+n}function d(b,n,a,c,e,j,k){b=b+(n&c|a&~c)+e+k;return(b<<j|b>>>32-j)+n}function l(b,n,a,c,e,j,k){b=b+(n^a^c)+e+k;return(b<<j|b>>>32-j)+n}function s(b,n,a,c,e,j,k){b=b+(a^(n|~c))+e+k;return(b<<j|b>>>32-j)+n}for(var t=CryptoJS,r=t.lib,w=r.WordArray,v=r.Hasher,r=t.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;r=r.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(q,n){for(var a=0;16>a;a++){var c=n+a,e=q[c];q[c]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var a=this._hash.words,c=q[n+0],e=q[n+1],j=q[n+2],k=q[n+3],z=q[n+4],r=q[n+5],t=q[n+6],w=q[n+7],v=q[n+8],A=q[n+9],B=q[n+10],C=q[n+11],u=q[n+12],D=q[n+13],E=q[n+14],x=q[n+15],f=a[0],m=a[1],g=a[2],h=a[3],f=p(f,m,g,h,c,7,b[0]),h=p(h,f,m,g,e,12,b[1]),g=p(g,h,f,m,j,17,b[2]),m=p(m,g,h,f,k,22,b[3]),f=p(f,m,g,h,z,7,b[4]),h=p(h,f,m,g,r,12,b[5]),g=p(g,h,f,m,t,17,b[6]),m=p(m,g,h,f,w,22,b[7]),
f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,
m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,
E,15,b[50]),m=s(m,g,h,f,r,21,b[51]),f=s(f,m,g,h,u,6,b[52]),h=s(h,f,m,g,k,10,b[53]),g=s(g,h,f,m,B,15,b[54]),m=s(m,g,h,f,e,21,b[55]),f=s(f,m,g,h,v,6,b[56]),h=s(h,f,m,g,x,10,b[57]),g=s(g,h,f,m,t,15,b[58]),m=s(m,g,h,f,D,21,b[59]),f=s(f,m,g,h,z,6,b[60]),h=s(h,f,m,g,C,10,b[61]),g=s(g,h,f,m,j,15,b[62]),m=s(m,g,h,f,A,21,b[63]);a[0]=a[0]+f|0;a[1]=a[1]+m|0;a[2]=a[2]+g|0;a[3]=a[3]+h|0},_doFinalize:function(){var b=this._data,n=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;n[c>>>5]|=128<<24-c%32;var e=u.floor(a/
4294967296);n[(c+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360;n[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(n.length+1);this._process();b=this._hash;n=b.words;for(a=0;4>a;a++)c=n[a],n[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});t.MD5=v._createHelper(r);t.HmacMD5=v._createHmacHelper(r)})(Math);
(function(){var u=CryptoJS,p=u.lib,d=p.Base,l=p.WordArray,p=u.algo,s=p.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:p.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,r){for(var p=this.cfg,s=p.hasher.create(),b=l.create(),u=b.words,q=p.keySize,p=p.iterations;u.length<q;){n&&s.update(n);var n=s.update(d).finalize(r);s.reset();for(var a=1;a<p;a++)n=s.finalize(n),s.reset();b.concat(n)}b.sigBytes=4*q;return b}});u.EvpKDF=function(d,l,p){return s.create(p).compute(d,
l)}})();
CryptoJS.lib.Cipher||function(u){var p=CryptoJS,d=p.lib,l=d.Base,s=d.WordArray,t=d.BufferedBlockAlgorithm,r=p.enc.Base64,w=p.algo.EvpKDF,v=d.Cipher=t.extend({cfg:l.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){t.reset.call(this);this._doReset()},process:function(e){this._append(e);return this._process()},
finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,k,d){return("string"==typeof k?c:a).encrypt(e,b,k,d)},decrypt:function(b,k,d){return("string"==typeof k?c:a).decrypt(e,b,k,d)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=p.mode={},x=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<b;d++)e[a+d]^=
c[d]},q=(d.BlockCipherMode=l.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();q.Encryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;x.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});q.Decryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,a);x.call(this,
e,a,c);this._prevBlock=d}});b=b.CBC=q;q=(p.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,l=[],n=0;n<c;n+=4)l.push(d);c=s.create(l,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:q}),reset:function(){v.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,
this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=d.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(p.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;return(a?s.create([1398893684,
1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},a=d.SerializableCipher=l.extend({cfg:l.extend({format:b}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var l=a.createEncryptor(c,d);b=l.finalize(b);l=l.cfg;return n.create({ciphertext:b,key:c,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),p=(p.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=s.random(8));a=w.create({keySize:b+c}).compute(a,d);c=s.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:p}),encrypt:function(b,c,d,l){l=this.cfg.extend(l);d=l.kdf.execute(d,
b.keySize,b.ivSize);l.iv=d.iv;b=a.encrypt.call(this,b,c,d.key,l);b.mixIn(d);return b},decrypt:function(b,c,d,l){l=this.cfg.extend(l);c=this._parse(c,l.format);d=l.kdf.execute(d,b.keySize,b.ivSize,c.salt);l.iv=d.iv;return a.decrypt.call(this,b,c,d.key,l)}})}();
(function(){for(var u=CryptoJS,p=u.lib.BlockCipher,d=u.algo,l=[],s=[],t=[],r=[],w=[],v=[],b=[],x=[],q=[],n=[],a=[],c=0;256>c;c++)a[c]=128>c?c<<1:c<<1^283;for(var e=0,j=0,c=0;256>c;c++){var k=j^j<<1^j<<2^j<<3^j<<4,k=k>>>8^k&255^99;l[e]=k;s[k]=e;var z=a[e],F=a[z],G=a[F],y=257*a[k]^16843008*k;t[e]=y<<24|y>>>8;r[e]=y<<16|y>>>16;w[e]=y<<8|y>>>24;v[e]=y;y=16843009*G^65537*F^257*z^16843008*e;b[k]=y<<24|y>>>8;x[k]=y<<16|y>>>16;q[k]=y<<8|y>>>24;n[k]=y;e?(e=z^a[a[a[G^z]]],j^=a[a[j]]):e=j=1}var H=[0,1,2,4,8,
16,32,64,128,27,54],d=d.AES=p.extend({_doReset:function(){for(var a=this._key,c=a.words,d=a.sigBytes/4,a=4*((this._nRounds=d+6)+1),e=this._keySchedule=[],j=0;j<a;j++)if(j<d)e[j]=c[j];else{var k=e[j-1];j%d?6<d&&4==j%d&&(k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255]):(k=k<<8|k>>>24,k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255],k^=H[j/d|0]<<24);e[j]=e[j-d]^k}c=this._invKeySchedule=[];for(d=0;d<a;d++)j=a-d,k=d%4?e[j]:e[j-4],c[d]=4>d||4>=j?k:b[l[k>>>24]]^x[l[k>>>16&255]]^q[l[k>>>
8&255]]^n[l[k&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,t,r,w,v,l)},decryptBlock:function(a,c){var d=a[c+1];a[c+1]=a[c+3];a[c+3]=d;this._doCryptBlock(a,c,this._invKeySchedule,b,x,q,n,s);d=a[c+1];a[c+1]=a[c+3];a[c+3]=d},_doCryptBlock:function(a,b,c,d,e,j,l,f){for(var m=this._nRounds,g=a[b]^c[0],h=a[b+1]^c[1],k=a[b+2]^c[2],n=a[b+3]^c[3],p=4,r=1;r<m;r++)var q=d[g>>>24]^e[h>>>16&255]^j[k>>>8&255]^l[n&255]^c[p++],s=d[h>>>24]^e[k>>>16&255]^j[n>>>8&255]^l[g&255]^c[p++],t=
d[k>>>24]^e[n>>>16&255]^j[g>>>8&255]^l[h&255]^c[p++],n=d[n>>>24]^e[g>>>16&255]^j[h>>>8&255]^l[k&255]^c[p++],g=q,h=s,k=t;q=(f[g>>>24]<<24|f[h>>>16&255]<<16|f[k>>>8&255]<<8|f[n&255])^c[p++];s=(f[h>>>24]<<24|f[k>>>16&255]<<16|f[n>>>8&255]<<8|f[g&255])^c[p++];t=(f[k>>>24]<<24|f[n>>>16&255]<<16|f[g>>>8&255]<<8|f[h&255])^c[p++];n=(f[n>>>24]<<24|f[g>>>16&255]<<16|f[h>>>8&255]<<8|f[k&255])^c[p++];a[b]=q;a[b+1]=s;a[b+2]=t;a[b+3]=n},keySize:8});u.AES=p._createHelper(d)})();

var systemObject = {
    /*版本號*/
    version : 3047,
    APPVersion : "",
    /*設定檔位置*/
    sdcardPath : "/sdcard",
    basePath: "/sdcard/QuickPayTCB",
    transPath : "trans_config_tcb",
    configPath: "/config.txt",
    beepPath : "./ding.mp3",
    /*截圖路徑*/
    savePath: "/pay_page",
    /*截圖檔名*/
    saveFile : "",
    /*log路徑*/
    logPath: "/log",
    orderLogPath : "/orderLog",
    checkPath: "/check",
    logName: "",
    orderLogName: "",
    Bank : "",

    /*計時器變數*/
    timeCount: null,
    /*上分計時器*/
    holdTimeCount : null,
    /*訂單停止時間*/
    StopTime : 86400000,
    /*餘額計時器*/
    ClockPointsNumMIS : 0,
    ClockNumTime : 0,
    ClockPointsNum : 0,
    ClockNum : 0,
    ClockNumSwitch : false,
    GetPointStatus : false,
    pointsSwitch : false,
    notificationSwitch : false,
    captureStatus : false,
    ordersSwitch : false,
    /*訂單狀態*/
    orderStatus : false,
    /*轉圈圈計數*/
    loadCount : 0,

    returnPath : 0,

    /*存放設定檔資料*/
    filetext: "",
    filetextSplitString: "",

    PUID: "",
    UUID: "",
    Url: "",
    Key: "",
    Iv: "",
    TCBVersion: "",

    getOrderData: "",

    HavePoints : 0,
    HavePointsStr : "",
    /*帳戶餘額*/
    points : 0,
    orderList : [],
    pointsList : [],
    transactionIDList : [],
    dateString : "",

    /*目前語言*/
    language : "EN",
    /*找尋字串列表*/
    findStringList : "",

    /*存放頁面元件*/
    PageItemList : []
};

/*className*/
var ClassName = {
    ViewGroup : "android.view.ViewGroup",
    TextView : "android.widget.TextView",
    ImageView : "android.widget.ImageView",
    Button : "android.widget.Button",
    EditText : "android.widget.EditText",
    AbsListView : "android.widget.AbsListView",
    LinearLayout : "android.widget.LinearLayout",
    FrameLayout : "android.widget.FrameLayout",
    RelativeLayout : "android.widget.RelativeLayout",
    ScrollView : "android.widget.ScrollView"
};

var Info = {
    UUID : "",
    Type : 0,
    Key : "",
    ApiUrl : "",
    ShowMsg : "",
    transactionID : 0,
    moneyBankID : 0,
    Bank : 0,
    Account : "",
    Password : "",
    useinfo : 0,
    runinfo : 0,
    errorSum : 0,
    row : 0,

    realName : false,
    realNameUp : false,
    agribSwitch : false,
};

var SendData = {
    code : "",
    rand : "",
    type : 0,
    transactionID : 0,
    useinfo : 0,
    points : 0,
    orderID : "",
    moneyBankID : 0,
    dataRow : "",
    row : 0,
    apiName : "",
    pageName : "",
    rm : 0,
    rmu : 0
};

var HoldLineData = {
    code : "",
    rand : "",
    type : 0,
    transactionID : 0,
    useinfo : 0,
    points : 0,
    orderID : "",
    moneyBankID : 0,
    dataRow : "",
    row : 0,
    apiName : "",
    pageName : "",
    rm : 0,
    rmu : 0
};

var OrderBox = {
    transactionID : 0,
    type : 0,
    match : 0,
    points : 0,

    payBank : 0,
    payCard : "",
    payAccount : "",
    payPassword : "",

    getBank : 0,
    getCard : "",
    getAccount : "",
    getPassword : "",

    status : 0,
    overTime : 0,
    custom : "",
    moneyBankID : 0,
    otpPassword : "",
    realName : "",
    realNameV : "",
    realNameVB : "",
};
var GetPageOrder = {
    transactionID : 0,
    points : 0
};

var CheckBoxSwitch = {
    realName : false,
    realNameUp : false,
    agribSwitch : false
};

function orders(_transactionID,  _points){
    this.transactionID = _transactionID, this.points = _points;
}

/*獲取當前APP的版本*/
try{
    systemObject.APPVersion = app.versionName;
}
catch(e){
    writeLog(e);
}

/*檢查舊的設定資料夾是否存在*/
if(files.exists(systemObject.basePath + "/")){
    if(!files.exists(systemObject.sdcardPath + "/" + systemObject.transPath)){
        if(systemObject.APPVersion != "2.1.1"){
            /*更改資料名稱*/
            files.rename(systemObject.basePath + "/", systemObject.transPath);
            
            /*變更指定位置*/
            systemObject.basePath = systemObject.sdcardPath + "/" + systemObject.transPath;
        }
    }
}
else{
    /*變更指定位置*/
    systemObject.basePath = systemObject.sdcardPath + "/" + systemObject.transPath;
}

/*先判斷是否存在訂單log資料夾*/
if(!files.exists(systemObject.basePath + "/" + systemObject.orderLogPath + "/")){
    files.createWithDirs(systemObject.basePath + "/" + systemObject.orderLogPath + "/");
}

/**/
/*測試用函式*/
function test(){
    /*Test*/
    OrderBox.payPassword = "THc321456@";
    OrderBox.getAccount = "00018939439171122";
    OrderBox.points = 51000;
    OrderBox.transactionID = 20210923001;
    OrderBox.otpPassword = "666888";
    OrderBox.getBank = 2011;

    launch("com.mbmobile");
    sleep(2000);
    /*
        980,510,1045,575
        650,76,700,126
     */
    var functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    var TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if(item.className() == ClassName.ImageView && item.bounds().left > 0){
            ImageView.push(item);
            log(item.bounds());
        }
    });
    ImageView[1].parent().click();
    sleep(1000);
    toastLog("end");
    exit();
}


if(!requestScreenCapture()){
    sendLog("請求截圖權限失敗");
    writeLog("請求截圖權限失敗");
    events.broadcast.emit("capture", "failed");
}
else{
    systemObject.captureStatus = true;
    sleep(2000);
}

/*先判斷是否存在訂單log資料夾*/
if(!files.exists(systemObject.basePath + "/" + systemObject.orderLogPath + "/")){
    files.createWithDirs(systemObject.basePath + "/" + systemObject.orderLogPath + "/");
}

/*成功得到截圖權限*/
if(systemObject.captureStatus){
    systemObject.captureStatus = false;
    try{
        loadConfig();

        loadCheck();
        if(!CheckStart()){
            exit();
        }
        if(CheckBoxSwitch.realName == "true"){
            Info.realName = true;
        }
        Info.realNameUp = false;
        if(CheckBoxSwitch.realNameUp == "true"){
            Info.realNameUp = true;
        }
        Info.agribSwitch = false;
        if(CheckBoxSwitch.agribSwitch == "true"){
            Info.agribSwitch = true;
        }
        
        var t = threads.start(function() {
            timeCount();
        });
        holdTime();
    }
    catch(e){
        writeLog(e);
    }
}

/*執行計時器*/
function timeCount(){
    systemObject.timeCount = setInterval(function(){
        if(systemObject.ClockNum != 4){
        /* if(systemObject.ClockNum == 0 || systemObject.ClockNum == 2 || systemObject.ClockNum == 4){ */
            /*重新驗證*/
            var result = Send("checkCode");
            if(result[0] != "success"){
                sendLog(dateFormat("dd hh:mm:ss", (new Date())) + " - 重新驗證失敗");
                return;
            }

            /*資料轉存*/
            var ResultJson = JSON.parse(result[1]);

            /*伺服器狀態*/
            try{
                if(ResultJson["useinfo"] == "0"){
                    sendLog(dateFormat("dd hh:mm:ss", (new Date())) + " - 重新驗證失敗 － 後台關閉伺服器");
                    return;
                }
            }
            catch(e){
                sendLog(dateFormat("dd hh:mm:ss", (new Date())) + " - 重新驗證失敗 － 沒有取得狀態");
                return;
            }
            /*代付取餘額 - 已時間戳判定是否為取餘額*/
            if((new Date().getTime() - systemObject.ClockNumTime) > 0){
                var sendData = "{\"moneyBankID\":\"" + String(Info.moneyBankID) + "\",\"bank\":\"" + String(Info.Bank) + "\",\"account\":\"" + Info.Account + "\",\"password\":\"" + Info.Password + "\"}";
                systemObject.GetPointStatus = true;
                GetPointsLineFun(sendData);
                systemObject.ClockPointsNum = random(30, 360);
                var now = new Date().getTime();
                systemObject.ClockNumTime = new Date(now + systemObject.ClockPointsNum * 1000).getTime();
            }
            else{
                clearOrderdata();
                OrderThreadFun();
            }

   
        }
        if(Info.Type == 712){
            systemObject.ClockPointsNum = systemObject.ClockPointsNum - 2;
        }

        if(systemObject.ClockNum == 4){
            systemObject.ClockNum = 0;
        }
        else{
            systemObject.ClockNum += 1;
        }
    }, 2000);
}

/*holdLine*/
function holdTime(){
    systemObject.holdTimeCount = setInterval(function(){
        LineThreadFun();
    }, 5000);
}

/*執行序相關*/
function GetPointsLineFun(_obj){
    var ResultJson = JSON.parse(_obj);
    OrderBox.points = 0;
    OrderBox.moneyBankID = ResultJson["moneyBankID"];
    OrderBox.payBank = Number(ResultJson["bank"]);
    OrderBox.payAccount = ResultJson["account"];
    OrderBox.payPassword = ResultJson["password"];
    OrderBox.overTime = (new Date() - (new Date("1970/01/01")));
    OrderBox.overTime = OrderBox.overTime + systemObject.StopTime;

    sendLog(dateFormat("dd hh:mm:ss", (new Date())) + " - 銀行：" + String(OrderBox.payBank) + "，帳號：" + OrderBox.payAccount + " - 開始取餘額");
    Send("ingLine");

    var viewStatus = 99;
    try{
        viewStatus = Run(systemObject.GetPointStatus);
    }
    catch(e){
        writeLog(e);
    }

    var viewStatusString = "";
    switch (viewStatus) {
        case 0:
            viewStatusString = "餘額：" + String(OrderBox.points);
            break;
        case 9:
            viewStatusString = "銀行頁面錯誤";
            break;
        case 10:
            viewStatusString = "開始處理";
            break;
        case 11:
            viewStatusString = "登入中";
            break;
        case 12:
            viewStatusString = "帳密錯誤";
            break;
        case 13:
            viewStatusString = "驗證碼錯誤";
            break;
        case 19:
            viewStatusString = "登入頁面錯誤";
            break;
        case 21:
            viewStatusString = "輸入資料";
            break;
        case 22:
            viewStatusString = "餘額不足";
            break;
        case 23:
            viewStatusString = "資料錯誤";
            break;
        case 24:
            viewStatusString = "跨行銀行錯誤";
            break;
        case 29:
            viewStatusString = "轉帳頁面錯誤";
            break;
        case 31:
            viewStatusString = "確認資料";
            break;
        case 39:
            viewStatusString = "確認資料頁面錯誤";
            break;
        case 41:
            viewStatusString = "確認資料";
            break;
        case 42:
            viewStatusString = "OTP輸入錯誤";
            break;
        case 43:
            viewStatusString = "OTP驗證失敗";
            break;
        case 49:
            viewStatusString = "OTP頁面錯誤";
            break;
        case 51:
            viewStatusString = "輸入登入OTP";
            break;
        case 52:
            viewStatusString = "登入OTP輸入錯誤";
            break;
        case 53:
            viewStatusString = "登入OTP驗證失敗";
            break;
        case 59:
            viewStatusString = "登入OTP頁面錯誤";
            break;
        case 61:
            viewStatusString = "轉帳完成";
            break;
        case 62:
            viewStatusString = "等待上分";
            break;

        case 90:
            viewStatusString = "轉手動";
            break;
        case 91:
            viewStatusString = "無法開啟";
            break;
        case 92:
            viewStatusString = "回調失敗";
            break;
        case 93:
            viewStatusString = "無法處理此銀行";
            break;
        case 97:
            viewStatusString = "與伺服器失去連線";
            break;
        case 98:
            viewStatusString = "意外關閉";
            break;
        case 99:
            viewStatusString = "訂單超時";
            break;

        case 999:
            viewStatusString = "意外關閉";
            break;
        default:
            viewStatusString = "執行失敗";
            break;
    }

    sendLog(dateFormat("dd hh:mm:ss", (new Date())) + " - 銀行：" + String(OrderBox.payBank) + "，帳號：" + OrderBox.payAccount + " - 取得餘額 - " + viewStatusString);
    sleep(1000);
    systemObject.GetPointStatus = false;
}

function OrderThreadFun(){
    /*取訂單*/
    var result = Send("getOrder");

    var StartStatus = false;
    var resultJson = JSON.parse(result[1]);
    result = resultJson;

    try{
        if(result["status"] == 10000){
            if(Info.Type == result["type"]){
                if(Info.transactionID != Number(result["transactionID"])){
                    sendLog(dateFormat("dd hh:mm:ss", (new Date())) + " - 取得訂單 - 訂單號：" + result["transactionID"]);
                    toastLog("已自動取得訂單");
                }

                OrderBox.transactionID = Number(result["transactionID"]);
                OrderBox.type = Number(result["type"]);
                OrderBox.match = Number(result["match"]);
                OrderBox.points = Number(result["points"]);
                OrderBox.otpPassword = result["payOtpPassword"];

                OrderBox.payBank = Number(result["payBank"]);
                OrderBox.payCard = result["payCard"];
                OrderBox.payAccount = result["payAccount"];
                OrderBox.payPassword = result["payPassword"];

                OrderBox.getBank = Number(result["getBank"]);
                OrderBox.getCard = result["getCard"];
                OrderBox.getAccount = result["getAccount"];
                OrderBox.getPassword = result["getPassword"];

                if(result["realName"] == undefined){
                    OrderBox.realName = "";
                }
                else if (result["realName"] == ""){
                    OrderBox.realName = "";
                }
                else if(result["realName"] != ""){
                    OrderBox.realName = result["realName"];
                    if(OrderBox.realName == "no"){
                        OrderBox.realName = "";
                    }
                    else{
                        OrderBox.realName = result["realName"];
                        OrderBox.realNameV = result["realNameV"];
                        OrderBox.realNameVB = result["realNameVB"];
                        /*處理去掉奇怪的字*/
                        OrderBox.realName = trimUnNull(OrderBox.realName);
                        OrderBox.realNameV = trimUnNull(OrderBox.realNameV);
                        OrderBox.realNameVB = trimUnNull(OrderBox.realNameVB);
                        /*去掉雙空白*/
                        OrderBox.realName = OrderBox.realName.replace(/  /g," ");
                        OrderBox.realNameV = OrderBox.realNameV.replace(/  /g," ");
                        OrderBox.realNameVB = OrderBox.realNameVB.replace(/  /g," ");
                    }
                }

                var bDate = result["bDate"].replace(/-/g,"/");

                OrderBox.overTime = (new Date(bDate) - (new Date("1970/01/01")));
                OrderBox.overTime = OrderBox.overTime + systemObject.StopTime;

                /*是否逾時*/
                if((new Date()) - (new Date("1970/01/01")) > OrderBox.overTime){
                    sendLog(dateFormat("dd hh:mm:ss", (new Date())) + " - 訂單 " + String(OrderBox.transactionID) + "：交易超時");

                    OrderBox.status = 99;
                    Send("setOrder");
                }
                else{
                    if(Info.transactionID != Number(result["transactionID"])){
                        StartStatus = true;
                    }
                }
            }
        }
    }
    catch(e){
        sendLog(dateFormat("dd hh:mm:ss", (new Date())) + " - 取得訂單失敗 - 參數錯誤");
        writeLog(e);
    }

    if(StartStatus){
        setClip(String(OrderBox.points));
        systemObject.saveFile = systemObject.basePath + systemObject.savePath + "/" + String(OrderBox.transactionID) + ".jpg";

        Info.runinfo = 1;
        Send("ingLine");

        OrderBox.status = 10;
        Send("setOrder");

        var viewStatus = 99;

        try{
            viewStatus = Run(systemObject.GetPointStatus);
        }
        catch(e){
            writeLog("訂單號：" + String(OrderBox.transactionID) + "處理時錯誤 - " + e);
            sendLog(dateFormat("dd hh:mm:ss", (new Date())) + " - 訂單號：" + String(OrderBox.transactionID) + "處理時錯誤");
        }

        /*處理狀態*/
        var viewStatusString = "";
        switch (viewStatus) {
            case 0:
                viewStatusString = "處理 *** 成功 ***";
                break;
            case 9:
                viewStatusString = "銀行頁面錯誤";
                break;
            case 10:
                viewStatusString = "開始處理";
                break;
            case 11:
                viewStatusString = "登入中";
                break;
            case 12:
                viewStatusString = "帳密錯誤";
                break;
            case 13:
                viewStatusString = "驗證碼錯誤";
                break;
            case 19:
                viewStatusString = "登入頁面錯誤";
                break;
            case 21:
                viewStatusString = "輸入資料";
                break;
            case 22:
                viewStatusString = "餘額不足";
                break;
            case 23:
                viewStatusString = "資料錯誤";
                break;
            case 24:
                viewStatusString = "跨行銀行錯誤";
                break;
            case 25:
                sendLog("LOG: \\log\\" + OrderBox.transactionID + "-" + OrderBox.payBank + "-realName.txt");
                viewStatusString = "實名錯誤";
                break;
            case 29:
                viewStatusString = "轉帳頁面錯誤";
                break;
            case 31:
                viewStatusString = "確認資料";
                break;
            case 39:
                viewStatusString = "確認資料頁面錯誤";
                break;
            case 41:
                viewStatusString = "確認資料";
                break;
            case 42:
                viewStatusString = "OTP輸入錯誤";
                break;
            case 43:
                viewStatusString = "OTP驗證失敗";
                break;
            case 49:
                viewStatusString = "OTP頁面錯誤";
                break;
            case 51:
                viewStatusString = "輸入登入OTP";
                break;
            case 52:
                viewStatusString = "登入OTP輸入錯誤";
                break;
            case 53:
                viewStatusString = "登入OTP驗證失敗";
                break;
            case 59:
                viewStatusString = "登入OTP頁面錯誤";
                break;
            case 61:
                viewStatusString = "轉帳完成";
                break;
            case 62:
                viewStatusString = "等待上分";
                break;

            case 90:
                viewStatusString = "轉手動";
                break;
            case 91:
                viewStatusString = "無法開啟";
                break;
            case 92:
                viewStatusString = "回調失敗";
                break;
            case 93:
                viewStatusString = "無法處理此銀行";
                break;
            case 97:
                viewStatusString = "與伺服器失去連線";
                break;
            case 98:
                viewStatusString = "意外關閉";
                break;
            case 99:
                viewStatusString = "訂單超時";
                break;

            case 999:
                viewStatusString = "意外關閉";
                break;
            default:
                viewStatusString = "執行失敗";
                break;
        }
        sendLog(dateFormat("dd hh:mm:ss", (new Date())) + " - 訂單號：" + String(OrderBox.transactionID) + "：" + viewStatusString);
        sleep(1000);

        /*訂單跑完的緩衝時間*/
        for(var x = 5;x >= 0; x--){
            toastLog(String(x));
            sleep(2000);
        }
    }
}

/*維持連線*/
function LineThreadFun(){
    var result = Send("holdLine");
    if(result[0] != "success"){
        sendLog(dateFormat("dd hh:mm:ss", (new Date())) + " - 維持連線失敗 － " + result[0]);
        if(Info.errorSum >= 5){
            return;
        }
        Info.errorSum += 1;
    }
    else{
        Info.errorSum = 1;
    }

    systemObject.LineSwitch = false;
}

/*執行APP _getPoints true為取餘額*/
function Run(_getPoints){
    if(!_getPoints){
        if(!reSend(11)){
            returnApp();
            return 97;
        }
    }

    /*歸零*/
    systemObject.HavePoints = 0;

    /*顯示訂單資訊*/
    if(!systemObject.GetPointStatus){
        sendLog("---------------------------");
        sendLog(dateFormat("dd hh:mm:ss", (new Date())) + " - 此次處理訂單資訊 - " + "訂單編號：" + OrderBox.transactionID + "，收款帳號：" + OrderBox.payAccount + "，訂單金額：" + OrderBox.points);
        sendLog("---------------------------");
    }

    var LoginStatus = 0;
    try{
        LoginStatus = Login(_getPoints);
    }
    catch(e){
        LoginStatus = 19;
        writeLog(e);
    }
    if(LoginStatus != 0){
        /*登入失敗*/
        if(_getPoints){
            returnApp(0);
            return LoginStatus;
        }
        else{
            if(!reSend(LoginStatus)){
                LoginStatus = reOrderStatus(97);
            }
            returnApp();
            return LoginStatus;
        }
    }
    

    if(_getPoints){
        GetPoints(_getPoints);

        GetOrder();

        returnApp(0);

        return 0;
    }
    try{
        GetPoints(_getPoints);
    }
    catch(e){
    }
    if(systemObject.HavePoints > 0 && OrderBox.points > systemObject.HavePoints){
        ReturnStatus = reOrderStatus(22);
        returnApp(0);
        return ReturnStatus;
    }

    if(!reSend(21)){
        var ReturnStatus = reOrderStatus(97);
        returnApp();
        return ReturnStatus;
    }

    /*同行*/
    if(OrderBox.match == 1){
        var bankReturn = 0;
        try{
            bankReturn = match();
        }
        catch(e){
            writeLog(e);
            bankReturn = 29;
            if(!reSend(bankReturn)){
                bankReturn = reOrderStatus(97);
            }
            returnApp();
            return bankReturn;
        }
        if(bankReturn != 0){
            if(!reSend(bankReturn)){
                bankReturn = reOrderStatus(97);
            }
            returnApp(systemObject.returnPath);
            return bankReturn;
        }
    }
    /*跨行*/
    else if(OrderBox.match == 0){
        var bankReturn = 0;
        try{
            bankReturn = noMatch();
        }
        catch(e){
            writeLog(e);
            bankReturn = 29;
            if(!reSend(bankReturn)){
                bankReturn = reOrderStatus(97);
            }
            returnApp();
            return bankReturn;
        }
        if(bankReturn != 0){
            if(!reSend(bankReturn)){
                bankReturn = reOrderStatus(97);
            }
            returnApp(systemObject.returnPath);
            return bankReturn;
        }
    }

    systemObject.orderStatus = true;

    /*轉帳成功 - 送出資料*/
    reSuccesSend(61);

    /*轉帳等待上分 - 送出資料*/
    reSuccesSend(62);

    returnApp(systemObject.returnPath);

    return 0;
}



/*
    43,1865,1037,1987
    980,101,1045,166
    281,745,799,1285

    281,745,799,1285
    depth 7
    drawingOrder 1
    indexInParent 1
 */

/*辨別是否為第一次執行*/
function getFirst(){
    return 1;
}


function Login(){
    launch("com.mbmobile");
    sleep(2000);

    /*確認是否停留在轉圈畫面*/
    if(!waitBlock(1)){
        if(systemObject.loadCount > 2){
            media.playMusic(systemObject.beepPath);
            sleep(media.getMusicDuration());
        }
        systemObject.loadCount += 1;
        return 9;
    }

    /*抓取頁面元件*/
    var functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    /*輸入帳密*/
    var EditList = [], TextView = [];
    systemObject.PageItemList.forEach(function(item){
        if(item.className() == ClassName.EditText){
            EditList.push(item);
        }
        else if(item.className() == ClassName.TextView && item.text() == "Login"){
            TextView.push(item);
        }
    });

    if(!systemObject.GetPointStatus){
        checkEngineStatus(OrderBox.transactionID, "執行訂單-輸入帳號前");
    }
    else{
        checkEngineStatus("", "取餘額-輸入帳號前");
    }

    EditList[0].setText(OrderBox.payPassword);
    sleep(500);
    TextView[0].parent().parent().click();
    sleep(2000);

    if(!waitBlock(10)){
        return 19;
    }

    /*是否帳密錯誤*/
    if(waitItem("Login information is invalid.(GW21)" , 2)){
        toastLog("帳密錯誤");
        return 12;
    }
    
    return 0;
}

/*取餘額*/
function GetPoints(_getPoints){
    var ItemString = "Transfer";
    if(!waitItem(ItemString, 10)){
        return 19;
    }

    if(!systemObject.GetPointStatus){
        checkEngineStatus(OrderBox.transactionID, "執行訂單-首頁");
    }
    else{
        checkEngineStatus("", "取餘額-首頁");
    }

    var functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    /*點開帳號*/
    var TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if(item.className() == ClassName.ImageView){
            ImageView.push(item);
        }
        else if (item.className() == ClassName.TextView && item.text() == "Show accounts"){
            TextView.push(item);
        }
    });
    /*
        writeLog(ImageView);
        writeLog("---------");
        writeLog(TextView);
        
        writeLog("textview centY : " + TextView[0].bounds().centerY());
        writeLog("-------");
        for(var i = 0; i < ImageView.length; i++){
            writeLog("imageCenterY : " + i + ImageView[i].bounds().centerY() + "\n");
            if(ImageView[i].bounds().centerY() > TextView[0].bounds().centerY()){

            }
        }
     */
    ImageView[1].parent().click();
    sleep(3000);

    ItemString = "My account";
    if(!waitItem(ItemString, 10)){
        toastLog("not found");
        return 19;
    }
    sleep(1000);
    
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text().indexOf("VND") > -1){
            TextView.push(item);
        }
    });

    writeLog(TextView[0].text());
    systemObject.HavePoints = Number(TextView[0].text().replace("VND","").replace(/,/g,""));
    if(_getPoints){
        if(systemObject.HavePoints != 0){
            OrderBox.points = systemObject.HavePoints;
            /*有抓到的情況*/
            systemObject.pointsSwitch = true;
        }
    }

    if(!systemObject.GetPointStatus){
        checkEngineStatus(OrderBox.transactionID, "執行訂單-取餘額完回首頁");
    }
    else{
        checkEngineStatus("", "取餘額-取餘額完回首頁");
    }

    /*切回預設值*/
    systemObject.pointsSwitch = false;
    if(_getPoints && systemObject.HavePoints > 0){
        Send("setPoints");
    }
}

/*取明細*/
function GetOrder(){
    if(!systemObject.GetPointStatus){
        checkEngineStatus(OrderBox.transactionID, "執行訂單-點擊鈴鐺前");
    }
    else{
        checkEngineStatus("", "取餘額-點擊鈴鐺前");
    }
    /*點擊鈴鐺*/
    var functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    var TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if(item.className() == ClassName.ImageView && item.bounds().left > 0){
            ImageView.push(item);
        }
    });
    ImageView[12].parent().click();
    sleep(1000);
    if(!waitBlock(60)){
        return;
    }

    /*切換到明細*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    var TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == "Balance alert"){
            TextView.push(item);
        }
    });
    TextView[0].parent().click();
    sleep(1000);
    if(!waitBlock(60)){
        return;
    }
    /*處理明細資料*/
    var functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    var TextView = [], ImageView = [];
    var orderTemp = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() != ""){
            TextView.push(item);
        }
    });
    var countIndext = 0;
    for(var x = 0;x < TextView.length;x++){
        if(TextView[x].text() == "Balance alert"){
            countIndext = (x + 1);
            break;
        }
    }
    var orderList = [];
    var orderliststr = "";
    for(var x = countIndext ; x < TextView.length; x++){
        if(TextView[x].text().indexOf("VND") > -1){
            orderTemp.push(TextView[x].text());
        }
    }
    for(var x = 0;x < orderTemp.length;x++){
        var tempPoints = "", tempID = "";
        var tempArray = orderTemp[x].split("|");

        var PointArray = tempArray[1].split(" ");
        tempPoints = PointArray[1].replace(/[^0-9]/g,"");
        if(tempArray[3].indexOf("/") > -1){
            var IdArray = tempArray[3].split("/");
            tempID = IdArray[0].replace(/[^0-9]/g,"");
            orderliststr += x + "id : " + tempID + ",points : " + tempPoints + "\n";
            if(tempID != "" && tempPoints != ""){
                if(tempID != undefined){
                    systemObject.orderList.push(new orders(Number(tempID), Number(tempPoints)));
                }
            }
        }
        else{
            tempID = tempArray[3].replace(/[^0-9]/g,"");
            orderliststr += x + "id : " + tempID + ",points : " + tempPoints + "\n";
            if(tempID != "" && tempPoints != ""){
                if(tempID != undefined){
                    systemObject.orderList.push(new orders(Number(tempID), Number(tempPoints)));
                }
            }
        }
    }
    systemObject.ordersSwitch = true;
    Send("reOrder");

    /*返回首頁*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    var TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if(item.className() == ClassName.ImageView && item.bounds().left > 0){
            ImageView.push(item);
        }
    });
    ImageView[1].parent().click();
    sleep(1000);

    if(!systemObject.GetPointStatus){
        checkEngineStatus(OrderBox.transactionID, "執行訂單-刷明細返回首頁");
    }
    else{
        checkEngineStatus("", "取餘額-刷明細返回首頁");
    }
    /*清空*/
    systemObject.orderList.length = 0;
    SendData.dataRow = "";
}

/*舊版明細*/
function orderOLD(){
    var functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text().indexOf("VND") > -1){
            TextView.push(item);
        }
    });
    TextView[0].parent().click();
    sleep(1000);

    var ItemString = "Total balance";
    if(!waitItem(ItemString, 10)){
        return;
    }
    sleep(1000);

    if(!systemObject.GetPointStatus){
        checkEngineStatus(OrderBox.transactionID, "執行訂單-帳號清單頁面");
    }
    else{
        checkEngineStatus("", "取餘額-帳號清單頁面");
    }

    for(var x = 1;x <= 3;x++){
        functionReturn = checkPageItemList(60);
        TextView = [], ImageView = [];
        systemObject.PageItemList.forEach(function(item){
            if (item.className() == ClassName.ImageView){
                ImageView.push(item);
            }
        });
        if(ImageView.length > 0){
            break;
        }
        sleep(1000);
    }
    if(functionReturn != 0){
        return functionReturn;
    }
    ImageView[ImageView.length - 1].parent().click();
    sleep(1000);
    
    if(!waitBlock(60)){
        return;
    }

    if(!systemObject.GetPointStatus){
        checkEngineStatus(OrderBox.transactionID, "執行訂單-訂單明細");
    }
    else{
        checkEngineStatus("", "取餘額-訂單明細");
    }

    functionReturn = checkPageItemList(30);
    if(functionReturn != 0){
        return functionReturn;
    }
    /*明細紀錄*/
    var orderTempList = [];
    var ImageView = [], TextView = [];
    systemObject.PageItemList.some(function(item){
        if(item.className() == ClassName.TextView && item.text() != ""){
            orderTempList.push(item.text());
        }
        if(orderTempList.length > 800){
            return true;
        }
    });
    /*過濾資料*/
    var orderList = [];
    var flag = 0;
    for(var i = 0; i < orderTempList.length; i++){
        if(orderTempList[i] == "Period"){
            flag = i;
            break;
        }
    }
    for(var i = flag; i < orderTempList.length; i++){
        orderList.push(orderTempList[i]);
    }
    var tempPoints = "", tempID = "";
    /*regex正則為"OO/OO"，O為數字且一定要是兩位數*/
    var orderliststr = "", regex = /^[0-9]{2,2}\/[0-9]{2,2}$/;
    for(var i = 0; i < orderList.length;i++){
        tempPoints = "", tempID = "";
        
        /*判斷位置*/
        /*收款*/
        if(orderList[i + 6] == "Period"){
            tempPoints = orderList[i + 3].replace(/[^0-9]/g,"");
            tempID = orderList[i + 5].replace(/[^0-9]/g,"");
            orderliststr += i + "id : " + tempID + ",points : " + tempPoints + "\n";
            if(tempID != "" && tempPoints != ""){
                if(tempID != undefined){
                    systemObject.orderList.push(new orders(Number(tempID), Number(tempPoints)));
                }
            }
            /*判斷是不是最後一筆*/
            if(orderList[i + 6] == undefined){
                break;
            }
        }
        /*出款*/
        else if(orderList[i + 12]){
            var idArray = orderList[i + 5].split("/");
            tempPoints = orderList[i + 3].replace(/[^0-9]/g,"");
            tempID = idArray[0].replace(/[^0-9]/g,"");
            orderliststr += i + "id : " + tempID + ",points : " + tempPoints + "\n";
            if(tempID != "" && tempPoints != ""){
                if(tempID != undefined){
                    systemObject.orderList.push(new orders(Number(tempID), Number(tempPoints)));
                }
            }
            /*判斷是不是最後一筆*/
            if(orderList[i + 12] == undefined){
                break;
            }
        }

        /*判斷是否滿40筆*/
        if(systemObject.orderList.length >= 40){
            break;
        }

    }
    /*writeLog(orderliststr);*/
    systemObject.ordersSwitch = true;
    Send("reOrder");

    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if(item.className() == ClassName.ImageView && item.bounds().left > 0){
            ImageView.push(item);    
        }
    });
    ImageView[1].parent().click();
    sleep(1000);
}

/*同行*/
function match(){
    var BankString = "Military Commercial Joint Stock Bank";

    checkEngineStatus(OrderBox.transactionID, "同行-進入轉帳頁面前");

    /*點選產品*/
    var functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    var TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == "Product"){
            TextView.push(item);
        }
    });
    TextView[0].parent().click();
    sleep(1000);

    /*點選轉帳*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == "Transfer"){
            TextView.push(item);
        }
    });
    TextView[1].parent().click();
    sleep(1000);

    /*點選新的交易*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }

    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == "New beneficiary"){
            TextView.push(item);
        }
    });
    TextView[0].parent().click();
    sleep(1000);

    /*點選帳號轉帳*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == "Transfer to a bank account"){
            TextView.push(item);
        }
    });
    TextView[0].parent().click();
    sleep(1000);

    /*等待轉圈*/
    if(!waitBlock(10)){
        return 29;
    }

    checkEngineStatus(OrderBox.transactionID, "同行-輸入帳號前");

    /*開啟銀行選單*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == "Bank"){
            TextView.push(item);
        }
    });
    TextView[0].parent().click();
    sleep(1000);

    /*搜尋MB*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    var EditList = [];
    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.EditText){
            EditList.push(item);
        }
    });
    EditList[0].setText(BankString);
    sleep(1000);

    /*點擊MB*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == BankString){
            TextView.push(item);
        }
    });
    TextView[0].parent().click();
    sleep(1000);

    /*點擊帳號輸入框*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == "Account number"){
            TextView.push(item);
        }
    });
    TextView[0].parent().click();
    sleep(1000);
    back();
    sleep(1000);

    /*輸入帳號*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], EditList = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.EditText){
            EditList.push(item);
        }
    });
    EditList[1].setText(OrderBox.getAccount);
    sleep(1000);

    /*點擊金額輸入框確認資料是否有誤*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == "Amount of money"){
            TextView.push(item);
        }
    });
    TextView[0].parent().click();
    sleep(1000);

    if(!waitBlock(10)){
        return 29;
    }
    
    if(waitItem("Account number is invalid", 3)){
        systemObject.returnPath = 1;
        toastLog("資料錯誤");
        return 23;
    }

    /*抓取實名*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    var EditText = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.EditText && item.text() != ""){
            EditText.push(item);
        }
    });
    /*判斷實名*/
    if(OrderBox.realName != ""){
        var pageName = EditText[2].text().trim();
        var apiName = OrderBox.realName.trim();

        /*前置作業*/
        pageName = pageName.replace(OrderBox.getAccount, "");
        pageName = pageName.trim();
        var pageNameTemp = pageName;

        writeLog("抓到的實名 - " + pageName + ",api的資料 - " + OrderBox.realName);
        /*判斷實名*/
        if(pageName != apiName){
            /*模糊實名checkbox*/
            if(Info.realName){
                pageName = VNReplaceEN(pageName);
                apiName = OrderBox.realNameV.trim();
                
                /*大小寫轉換*/
                if(Info.realNameUp){
                    pageName = pageName.toUpperCase();
                    apiName = OrderBox.realNameVB.trim();
                }
                
                /*取代掉銀行名稱*/
                pageNameTemp = pageNameTemp.replace(BankString, "");
                /*去除前後空白*/
                pageNameTemp = pageNameTemp.trim();
                
                if(pageNameTemp != apiName){
                    WriteRealNameTxt(OrderBox.transactionID, OrderBox.payBank, pageName , apiName);
                    SendData.apiName = apiName;
                    SendData.pageName = pageName;
                    systemObject.returnPath = 2;
                    return 25;
                }
            }
        }
    }


    /*點擊金額輸入框*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == "Amount of money"){
            TextView.push(item);
        }
    });
    TextView[0].parent().click();
    sleep(1000);

    /*輸入金額*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], EditList = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.EditText && item.text() == ""){
            EditList.push(item);
        }
    });
    EditList[0].setText(OrderBox.points);
    sleep(1000);

    /*輸入附言*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }

    TextView = [], EditList = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.EditText){
            EditList.push(item);
        }
    });
    EditList[4].setText(OrderBox.transactionID);
    sleep(1000);

    checkEngineStatus(OrderBox.transactionID, "同行-進入確認頁面前");
    
    /*點擊下一步*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    var ItemString = "Next";
    TextView = [], EditList = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == ItemString){
            TextView.push(item);
        }
    });
    TextView[0].parent().parent().click();
    sleep(1000);

    /*確認頁面*/
    ItemString = "Transaction information";
    if(!waitItem(ItemString, 5)){
        toastLog("確認資料頁面錯誤");
        return 39;
    }

    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return 39;
    }
    TextView = [], EditList = [];
    systemObject.PageItemList.forEach(function(item){
        if(item.className() == ClassName.TextView && item.text() != BankString && item.text().indexOf(BankString) > -1){
            TextView.push(item);
        }
    });

    
    /*點擊確認*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return 39;
    }
    ItemString = "Confirm";
    TextView = [], EditList = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == ItemString){
            TextView.push(item);
        }
    });
    TextView[0].parent().parent().click();
    sleep(1000);

    /*輸入OTP密碼*/
    ItemString = "Get OTP Code";
    if(!waitItem(ItemString, 5)){
        toastLog("OTP頁面錯誤");
        return 49;
    }

    checkEngineStatus(OrderBox.transactionID, "同行-OTP頁面前");

    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return 49;
    }

    TextView = [], EditList = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.EditText){
            EditList.push(item);
        }
    });
    EditList[5].setText(OrderBox.otpPassword);
    sleep(1000);

    /*點擊取得OTP*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return 49;
    }
    TextView = [], EditList = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == ItemString && item.indexInParent() == 0){
            TextView.push(item);
        }
    });
    TextView[0].parent().parent().click();
    sleep(1000);

    if(!waitBlock(10)){
        return 49;
    }
    sleep(1000);

    /*輸入OTP*/
    ItemString = "Input OTP";
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return 49;
    }
    TextView = [], EditList = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == ItemString){
            TextView.push(item);
        }
    });
    TextView[0].parent().parent().click();
    sleep(1000);

    if(!waitBlock(10)){
        return 49;
    }
    sleep(1000);

    checkEngineStatus(OrderBox.transactionID, "同行-確認轉帳頁面前");

    /*點選下一步*/
    ItemString = "Next";
    functionReturn = checkPageItemList(5);
    if(functionReturn != 0){
        return 49;
    }
    TextView = [], EditList = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == ItemString){
            TextView.push(item);
        }
    });
    TextView[1].parent().parent().click();
    sleep(1000);

    if(!waitBlock(10)){
        return 49;
    }

    ItemString = "The transaction was successfully made by MB";
    if(!waitItem(ItemString, 10)){
        return 49;
    }

    /*滾動頁面*/
    for(var x = 1;x <= 3;x++){
        var ScrollViewFind = className("android.widget.ScrollView").depth(11).drawingOrder(1).find();
        
        /*沒找到直接跳掉*/
        if(ScrollViewFind == null){
            break;
        }
        var result = ScrollViewFind.scrollDown();
        /*滾動失敗後返回*/
        if(!result){
            break;
        }
        sleep(1000);
    }

    checkEngineStatus(OrderBox.transactionID, "同行轉帳完成");

    systemObject.returnPath = 3;
    return 0;
}

/*跨行*/
function noMatch(){
    var BankString = "";

    checkEngineStatus(OrderBox.transactionID, "跨行-進入轉帳頁面前");

    /*點選產品*/
    var functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    var TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == "Product"){
            TextView.push(item);
        }
    });
    TextView[0].parent().click();
    sleep(1000);

    /*點選轉帳*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == "Transfer"){
            TextView.push(item);
        }
    });
    TextView[1].parent().click();
    sleep(1000);

    /*點選新的交易*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == "New beneficiary"){
            TextView.push(item);
        }
    });
    TextView[0].parent().click();
    sleep(1000);

    /*點選帳號轉帳*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == "Transfer to a bank account"){
            TextView.push(item);
        }
    });
    TextView[0].parent().click();
    sleep(1000);

    /*等待轉圈*/
    if(!waitBlock(10)){
        return 29;
    }

    checkEngineStatus(OrderBox.transactionID, "跨行-輸入帳號前");

    /*開啟銀行選單*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == "Bank"){
            TextView.push(item);
        }
    });
    TextView[0].parent().click();
    sleep(1000);

    /*
        1548'  => 'VIB', "Vietnam International Commercial Joint Stock Bank (VIB)"
        1549'  => 'VPB', 
        2001'  => 'BIDV', "Bank for Investment and Development of Vietnam (BIDV)"
        2002'  => 'CTG', "Vietnam bank for industry and trade (VIETINBANK)"
        2003'  => 'SHB', "Saigon - Ha Noi Commercial Joint Stock Bank (SHB)"
        2004'  => 'ABB', "An Binh Commercial Joint Stock Bank (ABBANK)"
        2005'  => 'AGRIB', "Vietnam Bank for Agriculture and Rural Development (Vietnam Bank for Agriculture and Rural Development (VBA))"
        2006'  => 'VCB', "Joint Stock Commercial Bank for Foreign Trade of Vietnam (VCB)"
        2007'  => 'TCB', "Vietnam Technology and Commercial Joint Stock Bank (TCB)"
        2008'  => 'ACB', "Asia Commercial Joint Stock Bank (ACB)"
        2009'  => 'SCB', "Saigon Joint Stock Commercial Bank (SCB)"
        2011'  => 'MBB', 
        2012'  => 'EIB', "Vietnam Export Import Bank (EIB)"
        2020'  => 'STB', "Saigon Thuong Tin Commercial Joint Stock Bank (STB)"
        2031'  => 'DongABank',  "Dong A Commercial Joint Stock Bank (DAB)"
        2032'  => 'GPBank', "Global Petro Commercial Joint Stock Bank (GPB)"
        2033'  => 'Saigonbank', "Saigon Bank for Industry and Trade (SGB)"
        2034'  => 'PG Bank', "Petrolimex Group Commercial Joint Stock Bank (PGB)"
        2035'  => 'Oceanbank', "Ocean Bank (OJB)"
        2036'  => 'NamABank', "Nam A comercial Join Stock Bank (NAMABANK)"
        2037'  => 'TPB', "Tien Phong Commercial Joint Stock Bank (TPB)"
        2038'  => 'HDB', "Ho Chi Minh City Development Joint Stock Commercial Bank (HDB)"
        2039'  => 'VAB', "Vietnam Asia Commercial Joint Stock Bank (VAB)"
        '2040' => 'OCB', "Orient Commercial Joint Stock Bank (OCB)"
        '2041' => 'SEABANK', "SouthEast Asia Commercial Joint Stock Bank (SEAB)"
        '2042' => 'LienVietPostBank(LPB)', "LienVietPostBank (LPB)"
        '2044' => 'MARITIME BANK(MSB)', "Vietnam Maritime Commercial Joint Stock Bank (MSB)"
        '2045' => 'VIETBANK', "Vietnam Thuong Tin Commercial Joint Stock Bank (VIETBANK)"
        '2046' => 'BVB', "Bao Viet Joint Stock Commercial Bank (BVB)"
        '2047' => 'CAKE', "Việt Nam Thinh Vượng CAKE BANK(VPB)"
        '2048' => 'CBBANK', "Xây dựng Việt Nam (CBB)"
        '2049' => 'CIMB', "CIMB BANK VIETNAM LIMITED (CIMB)"
        '2050' => 'DBS', "DBS Bank (DBS)"
        '2051' => 'HSBC', "HSBC Private International Bank (HSBC)"
        '2052' => 'IBK',
        '2053' => 'IVB',"Indovina (IVB)"
        '2054' => 'KIEN LONG BANK', "Kien Long Commercial Joint Stock Bank (KLB)"
        '2056' => 'NCB', "National Citizen Commercial Bank (NCB)"
        '2057' => 'NHB',
        '2058' => 'PBVN', "Public Bank Vietnam Limited (VID)"
        '2059' => 'PVCOMBANK', "Vietnam Public Bank (PVC)"
        '2060' => 'SCVN', "STANDARD CHARTERED (STANDARDCHARTERED)"
        '2061' => 'UOB',
        '2062' => 'VIET CAPITAL BANK', "Vietcapital Commercial Joint Stock Bank (VCCB)"
        '2063' => 'VRB', "Vietnam - Russia Joint Venture Bank (VRB)"
        '2064' => 'WOORI', "Woori Bank Vietnam Limited (Woori)"
    */

    var BankCheckString = "";
    /*點選銀行*/
    switch (OrderBox.getBank) {
        case 1548:
            BankCheckString = "Vietnam International Commercial Joint Stock Bank (VIB)";
            BankString = "VIB";
            break;
        case 1549:
            BankCheckString = "Vietnam Prosperity Joint Stock Commercial Bank (VPB)";
            BankString = "Prosperity ";
            break;
        case 2001:
            BankCheckString = "Bank for Investment and Development of Vietnam (BIDV)";
            BankString = "BIDV";
            break;
        case 2002:
            BankCheckString = "Vietnam bank for industry and trade (VIETINBANK)";
            BankString = "VIETINBANK";
            break;
        case 2003:
            BankCheckString = "Saigon - Ha Noi Commercial Joint Stock Bank (SHB)";
            BankString = "Saigon -";
            break;
        case 2004:
            BankCheckString = "An Binh Commercial Joint Stock Bank (ABBANK)";
            BankString = "ABBANK";
            break;
        case 2005:
            /*根據是否勾選agrib*/
            if(Info.agribSwitch){
                BankCheckString = "Vietnam Bank for Agriculture and Rural Development (Vietnam Bank for Agriculture and Rural Development (VBA))";
                BankString = "VBA";
            }
            break;
        case 2006:
            BankCheckString = "Joint Stock Commercial Bank for Foreign Trade of Vietnam (VCB)";
            BankString = "VCB";
            break;
        case 2007:
            BankCheckString = "Vietnam Technology and Commercial Joint Stock Bank (TCB)";
            BankString = "TCB";
            break;
        case 2008:
            BankCheckString = "Asia Commercial Joint Stock Bank (ACB)";
            BankString = "ACB";
            break;
        case 2009:
            BankCheckString = "Saigon Joint Stock Commercial Bank (SCB)";
            BankString = "SCB";
            break;
        case 2012:
            BankCheckString = "Vietnam Export Import Bank (EIB)";
            BankString = "EIB";
            break;
        case 2020:
            BankCheckString = " Saigon Thuong Tin Commercial Joint Stock Bank (STB)";
            BankString = "Saigon Thuong";
            break;
        case 2031:
            BankCheckString = "Dong A Commercial Joint Stock Bank (DAB)";
            BankString = "DAB";
            break;
        case 2032:
            BankCheckString = "Global Petro Commercial Joint Stock Bank (GPB)";
            BankString = "GPB";
            break;
        case 2033:
            BankCheckString = "Saigon Bank for Industry and Trade (SGB)";
            BankString = "SGB";
            break;
        case 2034:
            BankCheckString = "Petrolimex Group Commercial Joint Stock Bank (PGB)";
            BankString = "PGB";
            break;
        case 2035:
            BankCheckString = "Ocean Bank (OJB)";
            BankString = "OJB";
            break;
        case 2036:
            BankCheckString = "Nam A comercial Join Stock Bank (NAMABANK)";
            BankString = "NAMABANK";
            break;
        case 2037:
            BankCheckString = "Tien Phong Commercial Joint Stock Bank (TPB)";
            BankString = "TPB";
            break;
        case 2038:
            BankCheckString = "Ho Chi Minh City Development Joint Stock Commercial Bank (HDB)";
            BankString = "HDB";
            break;
        case 2039:
            BankCheckString = "Vietnam Asia Commercial Joint Stock Bank (VAB)";
            BankString = "VAB";
            break;
        case 2040:
            BankCheckString = "Orient Commercial Joint Stock Bank (OCB)";
            BankString = "OCB";
            break;
        case 2041:
            BankCheckString = "SouthEast Asia Commercial Joint Stock Bank (SEAB)";
            BankString = "SEAB";
            break;
        case 2042:
            BankCheckString = "LienVietPostBank (LPB)";
            BankString = "LPB";
            break;
        case 2044:
            BankCheckString = "Vietnam Maritime Commercial Joint Stock Bank (MSB)";
            BankString = "MSB";
            break;
        case 2045:
            BankCheckString = "Vietnam Thuong Tin Commercial Joint Stock Bank (VIETBANK)";
            BankString = "VIETBANK";
            break;
        case 2046:
            BankCheckString = "Bao Viet Joint Stock Commercial Bank (BVB)";
            BankString = "BVB";
            break;
        case 2047:
            BankCheckString = "Việt Nam Thinh Vượng CAKE BANK(VPB)";
            BankString = "CAKE BANK";
            break;
        case 2048:
            BankCheckString = "Xây dựng Việt Nam (CBB)";
            BankString = "CBB";
            break;
        case 2049:
            BankCheckString = "CIMB BANK VIETNAM LIMITED (CIMB)";
            BankString = "CIMB";
            break;
        case 2050:
            BankCheckString = "DBS Bank (DBS)";
            BankString = "DBS";
            break;
        case 2051:
            BankCheckString = "";
            break;
        case 2053:
            BankCheckString = "Indovina (IVB)";
            BankString = "IVB";
            break;
        case 2054:
            BankCheckString = "Kien Long Commercial Joint Stock Bank (KLB)";
            BankString = "KLB";
            break;
        case 2056:
            BankCheckString = "National Citizen Commercial Bank (NCB)";
            BankString = "NCB";
            break;
        case 2058:
            BankCheckString = "Public Bank Vietnam Limited (VID)";
            BankString = "VID";
            break;
        case 2059:
            BankCheckString = "Vietnam Public Bank (PVC)";
            BankString = "PVC";
            break;
        case 2062:
            BankCheckString = "Vietcapital Commercial Joint Stock Bank (VCCB)";
            BankString = "VCCB";
            break;
        case 2063:
            BankCheckString = "Vietnam - Russia Joint Venture Bank (VRB)";
            BankString = "VRB";
            break;
        case 2064:
            BankCheckString = "Woori Bank Vietnam Limited (Woori)";
            BankString = "Woori";
            break;
        default:
            BankString = "";
            break;
    }
    if(BankString == ""){
        systemObject.returnPath = 4;
        return 24;
    }

    /*搜尋MB*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    var EditList = [];
    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.EditText){
            EditList.push(item);
        }
    });
    EditList[0].setText(BankString);
    sleep(1000);

    /*點擊銀行*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text().indexOf(BankString) > -1){
            TextView.push(item);
        }
    });
    TextView[0].parent().click();
    sleep(1000);

    /*點擊帳號輸入框*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == "Account number"){
            TextView.push(item);
        }
    });
    TextView[0].parent().click();
    sleep(1000);
    back();
    sleep(1000);

    /*輸入帳號*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], EditList = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.EditText){
            EditList.push(item);
        }
    });
    EditList[1].setText(OrderBox.getAccount);
    sleep(1000);

    /*點擊金額輸入框*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == "Amount of money"){
            TextView.push(item);
        }
    });
    TextView[0].parent().click();
    sleep(1000);

    if(!waitBlock(10)){
        return 29;
    }
    sleep(1500);

    /*確認有無資料錯誤框*/
    functionReturn = checkPageItemList(6);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if(item.className() == ClassName.TextView){
            if(item.text() == "Tài khoản hoặc thẻ thụ hưởng không tồn tại" || item.text() == "Account number is invalid" || item.text() == "Giao dịch chưa hoàn tất. Quý khách vui lòng liên hệ MB 24/7 theo số 1900545426 để biết thêm chi tiết nếu tài khoản đã bị trừ tiền"){
                TextView.push(item);
            }
        }
    });
    if(TextView.length > 0){
        toastLog("資料錯誤");
        systemObject.returnPath = 1;
        return 23;
    }

    /*抓取實名*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    var EditText = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.EditText && item.text() != ""){
            EditText.push(item);
        }
    });
    /*判斷實名*/
    if(OrderBox.realName != ""){
        var pageName = EditText[2].text().trim();
        var apiName = OrderBox.realName.trim();

        /*前置作業*/
        pageName = pageName.replace(OrderBox.getAccount, "");
        pageName = pageName.trim();
        var pageNameTemp = pageName;

        writeLog("抓到的實名 - " + pageName + ",api的資料 - " + OrderBox.realName);
        /*判斷實名*/
        if(pageName != apiName){
            /*模糊實名checkbox*/
            if(Info.realName){
                pageName = VNReplaceEN(pageName);
                apiName = OrderBox.realNameV.trim();
                
                /*大小寫轉換*/
                if(Info.realNameUp){
                    pageName = pageName.toUpperCase();
                    apiName = OrderBox.realNameVB.trim();
                }
                
                /*取代掉銀行名稱*/
                pageNameTemp = pageNameTemp.replace(BankString, "");
                /*去除前後空白*/
                pageNameTemp = pageNameTemp.trim();
                
                if(pageNameTemp != apiName){
                    WriteRealNameTxt(OrderBox.transactionID, OrderBox.payBank, pageName , apiName);
                    SendData.apiName = apiName;
                    SendData.pageName = pageName;
                    systemObject.returnPath = 2;
                    return 25;
                }
            }
        }
    }

    /*點擊金額輸入框*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    TextView = [], ImageView = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == "Amount of money"){
            TextView.push(item);
        }
    });
    TextView[0].parent().click();
    sleep(1000);

    /*輸入金額*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }

    TextView = [], EditList = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.EditText && item.text() == ""){
            EditList.push(item);
        }
    });
    EditList[0].setText(OrderBox.points);
    sleep(1000);

    /*輸入附言*/
    var functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }

    TextView = [], EditList = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.EditText){
            EditList.push(item);
        }
    });
    EditList[4].setText(OrderBox.transactionID);
    sleep(1000);
    
    checkEngineStatus(OrderBox.transactionID, "跨行-進入確認頁面前");

    /*點擊下一步*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return functionReturn;
    }
    var ItemString = "Next";
    TextView = [], EditList = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == ItemString){
            TextView.push(item);
        }
    });
    TextView[0].parent().parent().click();
    sleep(1000);

    /*確認頁面*/
    ItemString = "Transaction information";
    if(!waitItem(ItemString, 5)){
        toastLog("確認資料頁面錯誤");
        return 39;
    }

    /*點擊確認*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return 39;
    }
    ItemString = "Confirm";
    TextView = [], EditList = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == ItemString){
            TextView.push(item);
        }
    });
    TextView[0].parent().parent().click();
    sleep(1000);

    /*輸入OTP密碼*/
    ItemString = "Get OTP Code";
    if(!waitItem(ItemString, 5)){
        toastLog("OTP頁面錯誤");
        return 49;
    }

    checkEngineStatus(OrderBox.transactionID, "跨行-OTP頁面前");

    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return 49;
    }

    TextView = [], EditList = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.EditText){
            EditList.push(item);
        }
    });
    EditList[5].setText(OrderBox.otpPassword);
    sleep(1000);

    /*點擊取得OTP*/
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return 49;
    }
    TextView = [], EditList = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == ItemString && item.indexInParent() == 0){
            TextView.push(item);
        }
    });
    TextView[0].parent().parent().click();
    sleep(1000);

    if(!waitBlock(10)){
        return 49;
    }

    /*輸入OTP*/
    ItemString = "Input OTP";
    functionReturn = checkPageItemList(10);
    if(functionReturn != 0){
        return 49;
    }
    TextView = [], EditList = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == ItemString){
            TextView.push(item);
        }
    });
    TextView[0].parent().parent().click();
    sleep(1000);

    checkEngineStatus(OrderBox.transactionID, "跨行-確認轉帳頁面前");

    /*點選下一步*/
    ItemString = "Next";
    functionReturn = checkPageItemList(5);
    if(functionReturn != 0){
        return 49;
    }
    TextView = [], EditList = [];
    systemObject.PageItemList.forEach(function(item){
        if (item.className() == ClassName.TextView && item.text() == ItemString){
            TextView.push(item);
        }
    });
    TextView[1].parent().parent().click();
    sleep(1000);

    if(!waitBlock(10)){
        return 49;
    }

    ItemString = "The transaction was successfully made by MB";
    if(!waitItem(ItemString, 10)){
        return 49;
    }

    /*滾動頁面*/
    for(var x = 1;x <= 3;x++){
        var ScrollViewFind = className("android.widget.ScrollView").depth(11).drawingOrder(1).find();
        
        /*沒找到直接跳掉*/
        if(ScrollViewFind == null){
            break;
        }
        var result = ScrollViewFind.scrollDown();
        /*滾動失敗後返回*/
        if(!result){
            break;
        }
        sleep(1000);
    }

    checkEngineStatus(OrderBox.transactionID, "跨行轉帳完成");

    systemObject.returnPath = 3;
    return 0;
}

/*返回*/
function returnApp(_returnPath){
    /*log寫進完成，執行訂單的情況才紀錄log*/
    if(systemObject.orderStatus){
        systemObject.orderLogName = systemObject.basePath + systemObject.orderLogPath + "/" + dateFormat("MM-dd hh", (new Date())) + ".txt";
        if(!files.exists(systemObject.orderLogName)){
            files.create(systemObject.orderLogName);
        }
        files.append(systemObject.orderLogName, (dateFormat("dd hh:mm:ss", (new Date())) + " - 交易單號：" + String(OrderBox.transactionID) + " 交易完成\n"));
        /*改回預設*/
        systemObject.orderStatus = false;
    }

    /*設為預設值*/
    setDefault();
    clearNamedata();

    if(!systemObject.GetPointStatus){
        var t = threads.start(function() {
            var img = captureScreen(systemObject.saveFile);
        });
        sleep(2000);

        var result = "", timeCount = 0;
        result = UpImages();
        while(result != "" && timeCount <= 10){
            timeCount++;
        }

        if(!files.remove(systemObject.saveFile)){
            log("刪除截圖失敗");
        }

        checkEngineStatus(OrderBox.transactionID, "截圖上傳完成後");
    }

    switch(_returnPath){
        case 0:
            /*點擊人頭*/
            functionReturn = checkPageItemList(40);
            if(functionReturn != 0){
                return functionReturn;
            }
            var TextView = [], ImageView = [];
            systemObject.PageItemList.forEach(function(item){
                if(item.className() == ClassName.ImageView && item.bounds().left > 0){
                    ImageView.push(item);
                }
            });
            ImageView[1].parent().click();
            sleep(1000);

            functionReturn = checkPageItemList(10);
            if(functionReturn != 0){
                return functionReturn;
            }
            var TextView = [], ImageView = [];
            systemObject.PageItemList.forEach(function(item){
                if (item.className() == ClassName.TextView && item.text() == "Logout"){
                    TextView.push(item);
                }
            });
            TextView[0].parent().parent().click();
            sleep(1000);

            waitItem("Notification", 10);
            functionReturn = checkPageItemList(1);
            if(functionReturn != 0){
                return functionReturn;
            }
            var TextView = [], ImageView = [];
            systemObject.PageItemList.forEach(function(item){
                if (item.className() == ClassName.TextView && item.text() == "Yes"){
                    TextView.push(item);
                }
            });
            TextView[0].parent().parent().click();
            sleep(1000);
            break;
        case 1:
            var functionReturn = checkPageItemList(1);
            if(functionReturn != 0){
                return functionReturn;
            }
            var TextView = [], ImageView = [];
            systemObject.PageItemList.forEach(function(item){
                if (item.className() == ClassName.TextView && item.text() == "Accept"){
                    TextView.push(item);
                }
            });
            TextView[0].parent().parent().click();
            sleep(1000);

            /*點擊home圖示*/
            functionReturn = checkPageItemList(10);
            if(functionReturn != 0){
                return functionReturn;
            }
            var TextView = [], ImageView = [];
            systemObject.PageItemList.forEach(function(item){
                if (item.className() == ClassName.ImageView && item.bounds().left > 0){
                    ImageView.push(item);
                }
            });
            ImageView[1].parent().click();
            sleep(1000);

            /*點擊人頭*/
            functionReturn = checkPageItemList(10);
            if(functionReturn != 0){
                return functionReturn;
            }
            var TextView = [], ImageView = [];
            systemObject.PageItemList.forEach(function(item){
                if(item.className() == ClassName.ImageView && item.bounds().left > 0){
                    ImageView.push(item);
                }
            });
            ImageView[1].parent().click();
            sleep(1000);
            break;
        case 2:
            /*點擊home圖示*/
            var functionReturn = checkPageItemList(10);
            if(functionReturn != 0){
                return functionReturn;
            }
            var TextView = [], ImageView = [];
            systemObject.PageItemList.forEach(function(item){
                if (item.className() == ClassName.ImageView && item.bounds().left > 0){
                    ImageView.push(item);
                }
            });
            ImageView[1].parent().click();
            sleep(1000);

            /*點擊人頭*/
            functionReturn = checkPageItemList(10);
            if(functionReturn != 0){
                return functionReturn;
            }
            var TextView = [], ImageView = [];
            systemObject.PageItemList.forEach(function(item){
                if(item.className() == ClassName.ImageView && item.bounds().left > 0){
                    ImageView.push(item);
                }
            });
            ImageView[1].parent().click();
            sleep(1000);
            break;
        case 3:
            /*點選完成*/
            ItemString = "Completed";
            var functionReturn = checkPageItemList(5);
            if(functionReturn != 0){
                return 49;
            }
            TextView = [], EditList = [];
            systemObject.PageItemList.forEach(function(item){
                if (item.className() == ClassName.TextView && item.text() == ItemString){
                    TextView.push(item);
                }
            });
            TextView[0].parent().parent().click();
            sleep(1000);

            ItemString = "Home";
            functionReturn = checkPageItemList(5);
            if(functionReturn != 0){
                return 49;
            }
            TextView = [], EditList = [];
            systemObject.PageItemList.forEach(function(item){
                if (item.className() == ClassName.TextView && item.text() == ItemString){
                    TextView.push(item);
                }
            });
            TextView[0].parent().parent().click();
            sleep(1000);

            back();
            waitItem("Notification", 15);
            functionReturn = checkPageItemList(1);
            if(functionReturn != 0){
                return functionReturn;
            }
            var TextView = [], ImageView = [];
            systemObject.PageItemList.forEach(function(item){
                if (item.className() == ClassName.TextView && item.text() == "Yes"){
                    TextView.push(item);
                }
            });
            TextView[0].parent().parent().click();
            sleep(1000);
            break;
        case 4:
            functionReturn = checkPageItemList(10);
            if(functionReturn != 0){
                return functionReturn;
            }
            var EditList = [];
            TextView = [], ImageView = [];
            systemObject.PageItemList.forEach(function(item){
                if (item.className() == ClassName.ImageView){
                    ImageView.push(item);
                }
            });
            ImageView[0].parent().click();
            sleep(1000);
            for(var x = 1; x <= 4;x++){
                back();
                sleep(1000);
            }
            waitItem("Notification", 10);
            functionReturn = checkPageItemList(1);
            if(functionReturn != 0){
                return functionReturn;
            }
            var TextView = [], ImageView = [];
            systemObject.PageItemList.forEach(function(item){
                if (item.className() == ClassName.TextView && item.text() == "Yes"){
                    TextView.push(item);
                }
            });
            TextView[0].parent().parent().click();
            sleep(1000);
            break;
    }

    if(_returnPath != 0 && _returnPath != 3){
        var functionReturn = checkPageItemList(10);
        if(functionReturn != 0){
            return functionReturn;
        }
        var TextView = [], ImageView = [];
        systemObject.PageItemList.forEach(function(item){
            if (item.className() == ClassName.TextView && item.text() == "Logout"){
                TextView.push(item);
            }
        });
        TextView[0].parent().parent().click();
        sleep(1000);

        waitItem("Notification", 10);
        functionReturn = checkPageItemList(1);
        if(functionReturn != 0){
            return functionReturn;
        }
        var TextView = [], ImageView = [];
        systemObject.PageItemList.forEach(function(item){
            if (item.className() == ClassName.TextView && item.text() == "Yes"){
                TextView.push(item);
            }
        });
        TextView[0].parent().parent().click();
        sleep(1000);
    }
    
    sleep(3000);

    /*顯示最近開啟的APP*/
    recents();
    sleep(1000);

    /*判斷是否成功開啟*/
    var quickSwitch = false;

    /*先嘗試開啟最新設定的包名*/
    if(launch("com.transpaytcb")){
        sleep(2000);
        quickSwitch = true;
    }
    
    if(!quickSwitch){
        try{
            if(launch("com.quickpayapp")){
                sleep(2000);
                quickSwitch = true;
            }
        }
        catch(e){
            writeLog("沒有這個app");
        }
    }

    var itemString = "";
    /*判斷是否成功開啟*/
    quickSwitch = false;

    /*顯示最近開啟的APP*/
    recents();
    sleep(1000);
    /*再切回"快付APP"*/
    try{
        if(launch("com.transpayget")){
            sleep(2000);
            quickSwitch = true;
        }
    }
    catch(e){
        writeLog("沒有這個app");
    }
    if(quickSwitch){
        itemString = "包名資訊";
        if(text(itemString).findOne(2000) == null){
            itemString = "開始監聽";
            if(text(itemString).findOne(2000) != null){
                click(itemString);
                sleep(1000);
            }
        }
    }
    else{
        /*沒有就嘗試開啟"舊版快付APP"*/
        try{
            quickSwitch = false;
            if(launch("com.quickpayv2")){
                sleep(2000);
                quickSwitch = true;
            }
            if(quickSwitch){
                itemString = "包名資訊";
                if(text(itemString).findOne(2000) == null){
                    itemString = "開始監聽";
                    if(text(itemString).findOne(2000) != null){
                        click(itemString);
                        sleep(1000);
                    }
                }
            }
            else{
                quickSwitch = false;
                if(launch("com.example.myapplication")){
                    sleep(2000);
                    quickSwitch = true;
                }
                
                if(quickSwitch){
                    /*點擊開始執行的按紐*/
                    var startString = "开始执行";
                    if (text(startString).findOne(2000) != null) {
                        text(startString).click();
                        sleep(1000);
                    }
                }
                else{
                    /*失敗表示沒有安裝，回到MB的APP*/
                    launch("com.mbmobile");
                    sleep(2000);
                    writeLog("沒有安裝快付APP");
                }
            }
        }
        catch(e){
            writeLog("開啟舊版快付APP失敗" + e);
        }
    }
}

/*頁面元件相關*/
/*測試字串是否存在*/
function waitItem(_itemString, _time){
    for(var i = 1;i <= _time; i++){
        if(text(_itemString).exists()){
            return true;
        }
        sleep(1000);
    }
    return false;
}

/*確認頁面資料*/
function checkPageItemList(_count){
    var page = null, findSwitch = false;
    for(var i = 0;i < 10;i++){
        systemObject.PageItemList = [], loginList = null;
        page = className("android.widget.FrameLayout").findOnce();
        if(page != null){
            getPageItemList(page, systemObject.PageItemList);
            if(systemObject.PageItemList.length >= _count){
                findSwitch = true;
                break;
            }
        }
        sleep(1000);
    }
    if(!findSwitch){
        writeLog("空的");
        return 29;
    }

    return 0;
}

/*擷取頁面的所有元件*/
function getPageItemList(_list, _saveList){
    for(var i = 0;i < _list.childCount();i++){
        if(_list.child(i).childCount() <= 0){
            _saveList.push(_list.child(i));
        }
        if(_list.child(i).childCount() > 0){
            getPageItemList(_list.child(i), _saveList);
        }
    }
}

/*等待load結束 */
function waitBlock(_time){
    var ImageViewList = className("android.widget.ImageView").depth(8).drawingOrder(1).findOnce(1000);

    for(var x = 1;x <= _time;x++){
        ImageViewList = className("android.widget.ImageView").depth(8).drawingOrder(1).findOnce();
        if(ImageViewList == null){
            return true;
        }
        sleep(1000);
    }
    
    return false;
}

/*寫文字檔相關*/
/*寫log檔*/
function writeLog(_string){
    systemObject.logName = systemObject.basePath + systemObject.logPath + "/" + dateFormat("MM-dd hh", (new Date())) + ".txt";
    if(!files.exists(systemObject.logName)){
        files.create(systemObject.logName);
    }
    files.append(systemObject.logName, (dateFormat("dd hh:mm:ss", (new Date())) + " - " + _string + "\n"));
    return true;
}

/*紀錄實名錯誤資訊*/
function WriteRealNameTxt(_transactionID, _payBank, _pageName, _apiName){
    var FileName = systemObject.basePath + systemObject.logPath + "/" + _transactionID + " - " + _payBank + "-realName.txt";
    if(!files.exists(FileName)){
        files.create(FileName);
    }
    files.append(FileName, (dateFormat("dd hh:mm:ss", (new Date())) + " - pageName: " + _pageName + ", apiName: " + _apiName));
}

/*讀檔案相關*/
/*讀取config*/
function loadConfig(){
    var reKey = false;
    try{
        /*擷取設定檔資料*/
        systemObject.filetext = files.read(systemObject.basePath + systemObject.configPath);
        if(systemObject.filetext != ""){
            /*判斷讀取設定檔的關鍵字*/
            var configCheck = false;
            if(systemObject.filetext.indexOf("\r\n") <= 0){
                if(systemObject.filetext.indexOf("\n") > -1){
                    configCheck = true;
                }
            }
            if(configCheck){
                systemObject.filetextSplitString = systemObject.filetext.split("\n");
            }
            else{
                systemObject.filetextSplitString = systemObject.filetext.split("\r\n");
            }

            if(systemObject.filetext.indexOf("puid") >= 0){
                systemObject.PUID = systemObject.filetextSplitString[0].replace("puid:", "");
            }
            
            if(systemObject.filetext.indexOf("url") >= 0){
                systemObject.Url = systemObject.filetextSplitString[1].replace("url:", "");
            }
            
            if(systemObject.filetext.indexOf("key") >= 0){
                systemObject.Key = systemObject.filetextSplitString[2].replace("key:", "");
                systemObject.Iv = systemObject.Key;
            }
            if(systemObject.filetext.indexOf("TCBversion") >= 0){
                systemObject.TCBVersion = systemObject.filetextSplitString[3].replace("TCBversion:", "");
            }
            if(systemObject.filetext.indexOf("bank") >= 0){
                systemObject.Bank = systemObject.filetextSplitString[4].replace("bank:", "");
            }
        }

        Info.UUID = systemObject.PUID;
    }
    catch(e){
        toastLog("設定檔內容錯誤");
        exit();
    }

    Info.useinfo = 0;
}

/*讀取check檔*/
function loadCheck(){
    try{
        /*擷取設定檔資料*/
        systemObject.filetext = files.read(systemObject.basePath + systemObject.checkPath);
        if(systemObject.filetext != ""){
            systemObject.filetextSplitString = systemObject.filetext.split("\r\n");
            if(systemObject.filetext.indexOf("realName:") >= 0){
                CheckBoxSwitch.realName = systemObject.filetextSplitString[0].replace("realName:", "");
            }

            if(systemObject.filetext.indexOf("realNameUp:") >= 0){
                CheckBoxSwitch.realNameUp = systemObject.filetextSplitString[1].replace("realNameUp:", "");
            }

            if(systemObject.filetext.indexOf("agribSwitch:") >= 0){
                CheckBoxSwitch.agribSwitch = systemObject.filetextSplitString[2].replace("agribSwitch:", "");
            }
        }
    }
    catch(e){
    }
}

/*API傳送相關*/
/*檢查啟動*/
function CheckStart(){
    Info.Type = 712;
    Info.ApiUrl = systemObject.Url;
    Info.ShowMsg = "";
    Info.transactionID = 0;
    Info.useinfo = 0;
    Info.errorSum = 1;

    var result = Send("checkCode");
    if(result[0] != "success"){
        sendLog(dateFormat("dd hh:mm:ss", (new Date())) + " - 啟動失敗 － " + result);
        return false;
    }
    
    var ResultJson = JSON.parse(result[1]);

    try{
        if(ResultJson["useinfo"] == "0"){
            sendLog(dateFormat("dd hh:mm:ss", (new Date())) + " - 啟動失敗 - 後台關閉伺服器");
            return false;
        }

        /*存活狀態*/
        Info.useinfo = 1;

        if(ResultJson["bank"] == ""){
            Info.Bank = 0;
        }
        else{
            Info.Bank = Number(ResultJson["bank"]);
        }

        if(Info.Bank != Number(systemObject.Bank)){
            sendLog(dateFormat("dd hh:mm:ss", (new Date())) + " - UUID與銀行不相符");
            return false;
        }
        if(ResultJson["moneyBankID"] == ""){
            Info.moneyBankID = 0;
        }
        else{
            Info.moneyBankID = Number(ResultJson["moneyBankID"]);
        }
        Info.Account = ResultJson["account"];
        Info.Password = ResultJson["password"];
    }
    catch(e){
        sendLog(dateFormat("dd hh:mm:ss", (new Date())) + " - 啟動失敗 － 沒有取得狀態");
        return false;
    }

    sendLog(dateFormat("dd hh:mm:ss", (new Date())) + " - 成功啟動 － 運行中");
    return true;
}

/*發送API*/
function Send(_Type){
    /*清空傳送資料*/
    clearSenddata();

    switch(_Type){
        case "getOrder":
            SendData.row = Info.row;
            break;
        case "setOrder":
            SendData.transactionID = OrderBox.transactionID;
            SendData.useinfo = OrderBox.status;
            break;
        case "reOrder":
            SendData.moneyBankID = OrderBox.moneyBankID;
            if(systemObject.ordersSwitch){
                SendData.dataRow = JSON.stringify(systemObject.orderList);
            }
            else{
                SendData.dataRow = "[" + JSON.stringify(GetPageOrder) + "]";
            }
            /*sendLog("reOrder : " + SendData.dataRow);*/
        case "setPoints":
            SendData.moneyBankID = OrderBox.moneyBankID;
            SendData.points = OrderBox.points;
            break;
        case "ingLine":
            _Type = "setLine";
            SendData.useinfo = 2;
            break;
        case "onLine":
            _Type = "setLine";
            SendData.useinfo = 1;
            break;
        case "offLine":
            _Type = "setLine";
            SendData.useinfo = 0;
            break;
        case "setUseinfo":
            SendData.moneyBankID = OrderBox.moneyBankID;
            break;
    }
    
    SendData.code = Info.UUID;
    SendData.rand = Random();
    SendData.type = Info.Type;

    if(Info.realName){
        SendData.rm = 1;
    }
    else{
        SendData.rm = 0;
    }
    if(Info.realNameUp){
        SendData.rmu = 1;
    }
    else{
        SendData.rmu = 0;
    }

    var jsonSend = JSON.stringify(SendData);

    jsonSend = Encrypt(jsonSend);
    var result = "";

    var thread = threads.start(function() {
        result = HttpPost(jsonSend, _Type);
    });
    thread.join();
    result = result.replace(/-/g,"+");
    result = result.replace(/_/g,"\/");
    result = result.replace(/\./g,"=");
    result = result.replace(/\\/g,"");
    result = result.replace(/"/g,"");
    result = result.trim();
    
    result = Decrypt(result);
    if(String(result).length < 10){
        return "Decrypt Failed";
    }
    var checkResult = CheckJsonData(result);
    if(checkResult != "success"){
        return checkResult;
    }
    
    return ["success", result];
}

/*確認回傳狀態*/
function CheckJsonData(_JsonString){
    var result = "success";

    if(!TestJson(_JsonString)){
        return "No Json";
    }

    var ResultJson = JSON.parse(_JsonString);

    try{
        if(!TestNum(ResultJson["status"])){
            return "Status No Num";
        }
    }
    catch(e){
        return "No Status";
    }

    /*取出狀態*/
    var status = Number(ResultJson["status"]);
    if(status != 10000 && status != 10001){
        try{
            return "伺服器回傳：" + ResultJson["msg"].toString();
        }
        catch(e){
            return "No Msg";
        }
    }

    return result;
}

/*上傳圖片*/
function UpImages(){
    SendData.code = Info.UUID;
    SendData.rand = String(random(100000, 99999999));
    SendData.type = Info.Type;
    SendData.transactionID = OrderBox.transactionID;

    var jsonSend = JSON.stringify(SendData);
    jsonSend = Encrypt(jsonSend);
    var result = "";
    var thread = threads.start(function() {
        result = http.postMultipart(systemObject.Url + "savePayPage", {
            params: jsonSend,
            payPage: open(systemObject.saveFile)
        });
        result = result.body.string();
    });
    thread.join();

    result = result.replace(/-/g,"+");
    result = result.replace(/_/g,"\/");
    result = result.replace(/\./g,"=");
    result = result.replace(/\\/g,"");
    result = result.replace(/"/g,"");
    result = result.trim();

    result = Decrypt(result);
    if(String(result).length < 10){
        return "Decrypt Failed";
    }
    result = JSON.parse(result);

    if(result["status"] != 10000){
        return result;
    }

    return "success";
}

/*重複送出*/
function reSend(_status){
    var SendSuccess = false;
    for(var x = 1; x <= 3; x++){
        OrderBox.status = _status;
        var result = Send("setOrder");
        if(result[0] == "success"){
            SendSuccess = true;
            break;
        }
        sleep(2000);
    }

    return SendSuccess;
}

/*統一修改訂單狀態*/
function reOrderStatus(_status){
    for(var x = 1;x <= 3;x++){
        OrderBox.status = _status;
        var result = Send("setOrder");
        if(result[0] == "success"){
            break;
        }
        sleep(2000);
    }

    return _status;
}

/*成功後送出資料*/
function reSuccesSend(_status){
    OrderBox.status = _status;
    Send("setOrder");
}

/*HTTP傳送相關*/
/*發送 Http*/
function HttpPost(_params, _path) {
    var result = http.postJson(systemObject.Url + _path, {
        params: _params
    });
    result = result.body.string();
    var resultJson = JSON.parse(result);
    return resultJson;
}

/*更改為預設值相關*/
/*清除訂單資訊*/
function clearOrderdata(){
    
    OrderBox.transactionID = 0;
    OrderBox.type = 0;
    OrderBox.match = 0;
    OrderBox.points = 0;

    OrderBox.payBank = 0;
    OrderBox.payCard = "";
    OrderBox.payAccount = "";
    OrderBox.payPassword = "";

    OrderBox.getBank = 0;
    OrderBox.getCard = "";
    OrderBox.getAccount = "";
    OrderBox.getPassword = "";

    OrderBox.status = 0;
    OrderBox.overTime = 0;
    OrderBox.custom = "";
    OrderBox.moneyBankID = 0;
    OrderBox.otpPassword = "";
}

/*清除訂單資訊*/
function clearSenddata(){    
    SendData.code = "";
    SendData.rand = "";
    SendData.type = 0;
    SendData.transactionID = 0;
    SendData.useinfo = 0;
    SendData.points = 0;
    SendData.orderID = "";
    SendData.moneyBankID = 0;
    SendData.dataRow = "";
    SendData.row = 0;
}

/*清除HoldLine資訊*/
function clearHoldLinedata(){
    HoldLineData.code = "";
    HoldLineData.rand = "";
    HoldLineData.type = 0;
    HoldLineData.transactionID = 0;
    HoldLineData.useinfo = 0;
    HoldLineData.points = 0;
    HoldLineData.orderID = "";
    HoldLineData.moneyBankID = 0;
    HoldLineData.dataRow = "";
    HoldLineData.row = 0;
}

/*清空實名紀錄*/
function clearNamedata(){
    SendData.apiName = "";
    SendData.pageName = "";
}

function setDefault(){
    systemObject.HavePointsStr = "";
}

/*共用工具*/
/*加密*/
function Encrypt(_string){
    var key = CryptoJS.enc.Utf8.parse(systemObject.Key);
    var iv = CryptoJS.enc.Utf8.parse(systemObject.Iv);
    srcs = CryptoJS.enc.Utf8.parse(_string);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv,mode:CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7});
    return encrypted.toString();
}

/*解密*/
function Decrypt(_string){
    var key = CryptoJS.enc.Utf8.parse(systemObject.Key);
    var iv = CryptoJS.enc.Utf8.parse(systemObject.Iv);
    var decrypt = CryptoJS.AES.decrypt(_string, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return decrypt.toString(CryptoJS.enc.Utf8);
}

/*確認主畫面腳本是否執行*/
function checkEngineStatus(_transactionID, _stopPath){
    var enginesList = engines.all(), checkEngine = false, EngineSwitch = false, TCBCounts = 0, logString = "";
    /*判斷腳本*/
    for(var i = 0; i < enginesList.length;i++){
        if(enginesList[i].getSource() == "main.js"){
            checkEngine = true;
        }
        else if(String(enginesList[i].getSource()).indexOf("TCB.js") > -1){
            TCBCounts += 1;
        }
    }
    logString += "交易編號：" + String(_transactionID) + ",在" + _stopPath + "停止,原因：";
    /*主腳本不存在、腳本數量大於2、TCB腳本數量大於1*/
    if(!checkEngine){
        logString += "主腳本不存在";
        EngineSwitch = true;
    }
    else if(enginesList.length > 2){
        logString += "腳本數量異常";
        EngineSwitch = true;
    }
    else if(TCBCounts > 1){
        logString += "TCB腳本數量異常";
        EngineSwitch = true;
    }
    if(EngineSwitch){
        writeLog(logString);
        engines.stopAll();
    }
    return true;
}

/*將越南字母轉英文*/
function VNReplaceEN(_originstr){
    var chuString = "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVXYỲỶỸÝỴZaàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvxyỳỷỹýỵz";
    var enString = "AAAAAAAAAAAAAAAAAABCDDEEEEEEEEEEEEFGHIIIIIIJKLMNOOOOOOOOOOOOOOOOOOPQRSTUUUUUUUUUUUUVXYYYYYYZaaaaaaaaaaaaaaaaaabcddeeeeeeeeeeeefghiiiiiijklmnoooooooooooooooooopqrstuuuuuuuuuuuuvxyyyyyyz";
    var chuArray = chuString.split("");
    var enArray = enString.split("");
    var charArray = _originstr.split("");
    var result = _originstr;
    
    for(var i = 0;i < charArray.length;i++){
        var index = chuArray.indexOf(charArray[i]);
        if(index > 0){
            result = result.replace(chuArray[index],enArray[index]);
        }
    }
    return result;
}

/*刪除奇怪符號*/
function trimUnNull(_originstr){
    var all_whitespaces = ['\u2028','\u2029','\u0009','\u000A','\u000B', '\u000C', '\u000D', '\u0085', '\u00A0','\u200B', '\uFEFF'];
    for(var i = 0;i < all_whitespaces.length; i++){
        var replaceIndex = _originstr.indexOf(all_whitespaces[i]);
        while(replaceIndex > -1){
            _originstr = _originstr.replace(all_whitespaces[replaceIndex],"");
            replaceIndex = _originstr.indexOf(all_whitespaces[i]);
        }
    }
    return _originstr;
}
/*亂數*/
function Random(){
    return String(random(100000, 99999999));
}

/*判斷數字*/
function TestNum(_num){
    if(isNaN(_num)){
        return false;
    }
    else{
        return true;
    }
}

/*判斷Json*/
function TestJson(_json){
    try{
        JSON.parse(_json);
        return true;
    }
    catch(e){
        return false;
    }
}

/*使用函数的方式進行定義*/
function dateFormat(fmt,date){
    var o = {
        "M+" : date.getMonth()+1,                 /*月份*/
        "d+" : date.getDate(),                    /*日*/
        "h+" : date.getHours(),                   /*小時*/
        "m+" : date.getMinutes(),                 /*分*/
        "s+" : date.getSeconds(),                 /*秒*/
        "q+" : Math.floor((date.getMonth()+3)/3), /*季度*/
        "S"  : date.getMilliseconds()             /*毫秒*/
    };
    if(/(y+)/.test(fmt)){
        fmt = fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

/*傳送到main*/
function sendLog(_log){
    events.broadcast.emit("log", _log);
    sleep(500);
}