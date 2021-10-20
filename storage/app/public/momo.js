var systemObject = {
    /*版本號*/
    version : 121,

    /*設定檔資料*/
    UUID: "",
    Url: "",
    Key: "",
    Iv: "",
    Time : 60,

    /*測試用資料*/
    /*
    UUID: "18943-59333080-27822",
    Url: "http://app.quickpay.work/",
    Key: "mQKeClHubAy97W21",
    Iv: "mQKeClHubAy97W21",
    */

    /*設定檔位置*/
    basePath: "/sdcard/trans_config_momo",
    configPath: "/config.txt",
    logPath: "/log",
    logName: "",

    /*參數設定*/
    timeCount : 30000,
    holdTimeCount : null,

    /*訂單*/
    orderList : [],

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
};

function order(_transactionID,  _points){
    this.transactionID = _transactionID;
    this.points = _points;
}

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

/*讀取設定檔*/
try{
    loadConfig();
}
catch(e){
    writeLog(e);
}

/*維持連線*/
var t = threads.start(function() {
    holdTime();
});

/*先執行一次*/
try{
    run();
}
catch(e){
    writeLog(dateFormat("dd hh:mm:ss", (new Date())) + " - 執行失敗 - " + e);
}

/*checkCodeMoblie的API */
var timeCount = setInterval(function(){
    try{
        run();
    }
    catch(e){
        writeLog(dateFormat("dd hh:mm:ss", (new Date())) + " - 執行失敗 - " + e);
    }
}, systemObject.Time * 1000);

/*主執行*/
function run(){
    /* 組合資料 */
    var sendData = {
        code : systemObject.UUID,
        rand : random(1111111111, 9999999999),
        type : 923
    };
    var jsonString = JSON.stringify(sendData);
    var encryptString = Encrypt(jsonString);
    var resultStatus = 0;

    /* 發送資料 */
    try{
        var result = HttpPost(encryptString, "checkCodeMoblie");
    }
    catch(e){
        writeLog("發送失敗：" + e.toString());
        resultStatus = 1;
    }

    result = result.replace(/-/g,"+");
    result = result.replace(/_/g,"\/");
    result = result.replace(/\./g,"=");
    result = result.replace(/\\/g,"");
    result = result.replace(/"/g,"");
    result = result.trim();

    result = Decrypt(result);
    resultJson = JSON.parse(result);

    /* 判斷是否可以執行 */
    if(resultJson["status"] != "10000"){
        writeLog(resultJson["status"] + ", ");
        return;
    }

    Info.moneyBankID = resultJson["moneyBankID"];
    Info.Bank = resultJson["bank"];
    Info.Account = resultJson["account"];
    Info.Password = resultJson["password"];
    Info.useinfo = resultJson["useinfo"];

    try{
        /*執行MoMo刷單*/
        MoMo();
    }
    catch(e){
        returnApp(false);
        log(e);
    }
    
    sleep(1000);

    /*上分*/
    if(systemObject.orderList.length > 0){
        /* 回傳結果 */
        /* 組合資料 */
        sendData = {
            code : systemObject.UUID,
            rand : random(1111111111, 9999999999),
            type : 923,
            moneyBankID : Info.moneyBankID,
            dataRow : JSON.stringify(systemObject.orderList)
        };
        var jsonString = JSON.stringify(sendData);
        var encryptString = Encrypt(jsonString);

        var result = HttpPost(encryptString, "reOrderMoblie");

        result = result.replace(/-/g,"+");
        result = result.replace(/_/g,"\/");
        result = result.replace(/\./g,"=");
        result = result.replace(/\\/g,"");
        result = result.replace(/"/g,"");
        result = result.trim();

        result = Decrypt(result);
        resultJson = JSON.parse(result);
    }

    /*清空資料*/
    systemObject.orderList = [];
}

/*開啟MOMO刷單*/
function MoMo(){
    launch("com.mservice.momotransfer");
    sleep(1000);

    /*登入*/
    var itemString = "ĐĂNG NHẬP", page = [];
    if(waitItem(itemString, 5)){
        /*判斷是否有連線失敗的錯誤訊息*/
        itemString = "Úi! Mất kết nối rồi";
        if(waitItem(itemString, 3)){
            back();
        }

        systemObject.PageItemList = [];
        page = className("android.widget.FrameLayout").findOnce();
        if(page != null){
            getPageItemList(page, systemObject.PageItemList);
        }

        var TextViewList = [], EditTextList = [];
        systemObject.PageItemList.forEach(function(item){
            if(item.className() == "android.widget.EditText"){
                EditTextList.push(item);
            }
        });

        /*先將值清空*/
        EditTextList[0].setText("");
        sleep(1000);
        EditTextList[0].setText(Info.Password);
        sleep(2000);
    }

    /*是否成功進入*/
    itemString = "VÍ CỦA TÔI";
    if(!waitItem(itemString, 15)){
        log("登入失敗");
        returnApp(false);
        return;
    }

    /*判斷是否有連線失敗的錯誤訊息*/
    itemString = "Úi! Mất kết nối rồi";
    if(waitItem(itemString, 3)){
        back();
    }
    sleep(2000);

    for(var i = 0;i < 4;i++){
        var temp = className("android.view.ViewGroup").depth(8).find();
        if(temp.length > 0){
            sleep(1000);
        }
        else{
            break;
        }
    }
    /*點擊鈴鐺*/
    var temp = className("android.view.ViewGroup").depth(27).find();
    var lingItem, lingSwitch = false;
    var c = 0;
    var tempList = [];
    temp.forEach(function(item){
        item.children().some(function(child){
            if(c >= 1){
                return true;
            }
            if(child.className() == ClassName.ImageView && item.drawingOrder() == 3){
                tempList.push(child);
                lingItem = item;
                lingSwitch = true;
                c += 1;
            }
        })
    });
    if(!lingSwitch){
        /*找不到鈴鐺強制離開*/
        log("no ling - 空的");
        back();
        returnApp(true);
        return false;
    }
    lingItem.click();
    sleep(3000);

    /*將通知已讀*/
    var ImageViewList = className("android.widget.ImageView").depth(29).drawingOrder(1).find();
    /*撈取所有圖標元件*/
    for(var key in ImageViewList){
        /*判斷是否為UIObject*/
        if(typeof(ImageViewList[key]) == "object"){
            /*此元件是否在限定座標內(右上角邊邊)*/
            if(ImageViewList[key].bounds().centerX() <= 500 && ImageViewList[key].bounds().centerX() >= 400 &&
                ImageViewList[key].bounds().centerY() <= 100 && ImageViewList[key].bounds().centerY() >= 20){
                click(ImageViewList[key].bounds().centerX(), ImageViewList[key].bounds().centerY());
                break;
            }
        }
        else{
            break;
        }
    }
    sleep(2000);

    /*執行刷單*/
    /*取得明細資料*/
    for(var x = 1;x <= 15; x++){
        /*取得頁面元件*/
        page = null, findSwitch = false, systemObject.PageItemList = [];
        for(var i = 0;i < 10;i++){
            systemObject.PageItemList = [], loginList = null;
            page = className("android.widget.FrameLayout").findOnce();
            if(page != null){
                getPageItemList(page, systemObject.PageItemList);
                if(systemObject.PageItemList.length > 200 && text("Quan tâm").exists()){
                    findSwitch = true;
                    break;
                }
            }
            sleep(1000);
        }

        /*過濾資料*/
        TextViewList = [];
        systemObject.PageItemList.forEach(function(item){
            if(item.text() != "" && item.className() == ClassName.TextView){
                TextViewList.push(item);
            }
        });

        /*取出資料*/
        var tempPoints = "", tempID = "";
        /*regex正則為"OO/OO"，O為數字且一定要是兩位數*/
        /*越南文的時分秒*/
        var regex = /^[0-9]{2,2}\/[0-9]{2,2}$/, hour = "giờ trước", min = "phút trước", sec = "giây trước";
        for(var i = 0; i < TextViewList.length; i++){
            var tempList = TextViewList[i].text().split(" ");
            if(tempList.length > 0){
                if(regex.test(tempList[tempList.length - 1]) || TextViewList[i].text().indexOf(hour) > -1 || TextViewList[i].text().indexOf(min) > -1 || TextViewList[i].text().indexOf(sec) > -1){
                    tempPoints = TextViewList[i + 1].text().replace(/[^0-9]/g,"");
                    tempID = TextViewList[i + 2].text().replace(/[^0-9]/g,"");
                    if(tempID != "" && tempPoints != ""){
                        var tempOrder = new order(tempID, tempPoints);
                        if(!checkList(systemObject.orderList, tempOrder)){
                            systemObject.orderList.push(tempOrder);
                        }
                        /*判斷筆數*/
                        if(systemObject.orderList.length >= 20){
                            break;
                        }
                    }
                }
            }
        }

        /*判斷筆數*/
        if(systemObject.orderList.length >= 20){
            break;
        }

        /*滾動頁面*/
        var ScrollViewFind = className("android.widget.ScrollView").scrollable(true).depth(29).findOnce();
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

    /*返回後停頓一秒*/
    back();
    sleep(1000);

    returnApp(true);
}

function holdTime(){
    systemObject.holdTimeCount = setInterval(function(){
        LineThreadFun();
    }, 10000);
}

/*維持連線*/
function LineThreadFun(){
    /* 組合資料 */
    var sendData = {
        id : systemObject.UUID,
        time : 1000
    };
    var jsonString = JSON.stringify(sendData);
    
    /* 發送資料 */
    try{
        var result = HttpPost(jsonString, "linev2");
    }
    catch(e){
        sendLog("發送失敗 - 請檢查網路是否正常連線");
        writeLog("發送失敗：" + e.toString());
    }
}


/* 回到快付 APP */
function returnApp(_loginState){
    if(_loginState){
        /*點擊個人資訊*/
        var page = null, findSwitch = false, TextViewList = [];
        systemObject.PageItemList = [];
        for(var i = 0;i < 10;i++){
            systemObject.PageItemList = [], loginList = null;
            page = className("android.widget.FrameLayout").findOnce();
            if(page != null){
                getPageItemList(page, systemObject.PageItemList);
                if(systemObject.PageItemList.length > 35 && text("VÍ CỦA TÔI").exists()){
                    findSwitch = true;
                    break;
                }
            }
            sleep(1000);
        }

        var c = 0, tempText;
        systemObject.PageItemList.some(function(item){
            if(c > 0){
                return true;
            }
            if(item.className() == ClassName.TextView && item.text() == "VÍ CỦA TÔI"){
                tempText = item;
                c += 1;
            }
        });
        /*點擊個人資訊*/
        tempText.parent().click();
        sleep(1000);

        /*是否有到帳通知*/
        checkAlert();

        page = null, findSwitch = false, TextViewList = [];
        systemObject.PageItemList = [];
        for(var i = 0;i < 10;i++){
            systemObject.PageItemList = [], loginList = null;
            page = className("android.widget.FrameLayout").findOnce();
            if(page != null){
                getPageItemList(page, systemObject.PageItemList);
                if(systemObject.PageItemList.length > 35 && text("Đăng xuất").exists()){
                    findSwitch = true;
                    break;
                }
            }
            sleep(1000);
        }

        c = 0;
        systemObject.PageItemList.some(function(item){
            if(c > 0){
                return true;
            }
            if(item.className() == ClassName.TextView && item.text() == "Đăng xuất"){
                TextViewList.push(item);
                c += 1;
            }
        });
        /*點擊登出*/
        TextViewList[0].parent().click();
        sleep(1000);

        page = null, findSwitch = false, TextViewList = [];
        systemObject.PageItemList = [];
        for(var i = 0;i < 10;i++){
            systemObject.PageItemList = [], loginList = null;
            page = className("android.widget.FrameLayout").findOnce();
            if(page != null){
                getPageItemList(page, systemObject.PageItemList);
                if(systemObject.PageItemList.length > 35 && text("ĐỒNG Ý").exists()){
                    findSwitch = true;
                    break;
                }
            }
            sleep(1000);
        }

        c = 0;
        systemObject.PageItemList.some(function(item){
            if(c > 0){
                return true;
            }
            if(item.className() == ClassName.TextView && item.text() == "ĐỒNG Ý"){
                TextViewList.push(item);
                c += 1;
            }
        });
        /*點擊確認登出*/
        TextViewList[0].parent().click();
        sleep(2000);
    }
    
    /*顯示最近開啟的APP*/
    recents();
    sleep(1000);
    
    try{
        if(launch("com.transconfigmomo")){
            sleep(2000);
        }
    }
    catch(e){
        writeLog("沒有這個app");
    }

    /*顯示最近開啟的APP*/
    recents();
    sleep(1000);
    
    /*再切回"快付APP"*/
    var quickSwitch = false;
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
                    var startString = "开始执行";
                    if (text(startString).findOne(2000) != null) {
                        text(startString).click();
                        sleep(1000);
                    }
                }
                else{
                    /*失敗表示沒有安裝，回到MoMo的APP*/
                    launch("com.mservice.momotransfer");
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

/*判斷到帳通知*/
function checkAlert(){
    /*最多10個通知*/
    for(var x = 1; x <= 10; x++){
        var page = null, findSwitch = false, TextViewList = [];
        systemObject.PageItemList = [];
        for(var i = 0;i < 2;i++){
            systemObject.PageItemList = [], loginList = null;
            page = className("android.widget.FrameLayout").findOnce();
            if(page != null){
                getPageItemList(page, systemObject.PageItemList);
                if(systemObject.PageItemList.length > 35 && text("Xem chi tiết").exists()){
                    findSwitch = true;
                    break;
                }
            }
            sleep(1000);
        }

        if(findSwitch){
            c = 0;
            systemObject.PageItemList.some(function(item){
                if(c > 0){
                    return true;
                }
                if(item.className() == ClassName.TextView && item.text() == "Xem chi tiết"){
                    TextViewList.push(item);
                    c += 1;
                }
            });

            click(TextViewList[0].bounds().centerX(), TextViewList[0].bounds().centerY());
            sleep(1000);
        }
        else{
            return;
        }
    }
    
}

/*讀取config*/
function loadConfig(){
    var reKey = false, tempString = "";
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

            if(systemObject.filetext.indexOf("uuid") >= 0){
                tempString = systemObject.filetextSplitString[0].replace("uuid:", "");
                if(tempString == ""){
                    reKey = true;
                    tempString += String(random(10000, 99999));
                    tempString += "-" + String(random(10000000, 99999999));
                    tempString += "-" + String(random(10000, 99999));
                }
                systemObject.UUID = tempString;
            }
            
            if(systemObject.filetext.indexOf("url") >= 0){
                systemObject.Url = systemObject.filetextSplitString[1].replace("url:", "");
            }
            
            if(systemObject.filetext.indexOf("key") >= 0){
                systemObject.Key = systemObject.filetextSplitString[2].replace("key:", "");
                systemObject.Iv = systemObject.Key;
            }

            if(systemObject.filetext.indexOf("time") >= 0){
                systemObject.Time = systemObject.filetextSplitString[3].replace("time:", "");
            }

            if(systemObject.filetext.indexOf("MoMoVersion") >= 0){
                systemObject.MoMoVersion = systemObject.filetextSplitString[4].replace("MoMoVersion:", "");
            }
        }

        if(reKey){
            files.write(systemObject.basePath + systemObject.configPath , "uuid:" + systemObject.UUID + "\r\nurl:" + systemObject.Url + "\r\nkey:" + systemObject.Key + "\r\ntime:" + systemObject.Time + "\r\nMoMoVersion:" + systemObject.MoMoVersion);
        }
    }
    catch(e){
        log(e);
        toastLog("設定檔內容錯誤");
        exit();
    }
}


/*
    通用函式
 * /

/*發送log到畫面上顯示*/
function sendLog(_log){
    events.broadcast.emit("log", _log);
    sleep(500);
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

function checkList(_checkList, _item){
    for(var i = 0;i < _checkList.length;i++){
        if(_checkList[i].transactionID == _item.transactionID && _checkList[i].points == _item.points){
            return true;
        }
    }
    return false;
}

/*發送 Http*/
function HttpPost(_params, _path) {
    var result = http.postJson(systemObject.Url + _path, {
        params: _params
    });
    result = result.body.string();
    var resultJson = JSON.parse(result);
    return resultJson;
}


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

/*寫log檔*/
function writeLog(_string){
    systemObject.logName = systemObject.basePath + systemObject.logPath + "/" + dateFormat("MM-dd hh", (new Date())) + ".txt";
    if(!files.exists(systemObject.logName)){
        files.create(systemObject.logName);
    }
    files.append(systemObject.logName, (dateFormat("dd hh:mm:ss", (new Date())) + " - " + _string + "\n"));
    return true;
}

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
