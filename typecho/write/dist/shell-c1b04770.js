var words={};function define(e,t){for(var n=0;n<t.length;n++)words[t[n]]=e}var commonAtoms=["true","false"],commonKeywords=["if","then","do","else","elif","while","until","for","in","esac","fi","fin","fil","done","exit","set","unset","export","function"],commonCommands=["ab","awk","bash","beep","cat","cc","cd","chown","chmod","chroot","clear","cp","curl","cut","diff","echo","find","gawk","gcc","get","git","grep","hg","kill","killall","ln","ls","make","mkdir","openssl","mv","nc","nl","node","npm","ping","ps","restart","rm","rmdir","sed","service","sh","shopt","shred","source","sort","sleep","ssh","start","stop","su","sudo","svn","tee","telnet","top","touch","vi","vim","wall","wc","wget","who","write","yes","zsh"];function tokenBase(e,t){if(e.eatSpace())return null;var n=e.sol(),o=e.next();if("\\"===o)return e.next(),null;if("'"===o||'"'===o||"`"===o)return t.tokens.unshift(tokenString(o,"`"===o?"quote":"string")),tokenize(e,t);if("#"===o)return n&&e.eat("!")?(e.skipToEnd(),"meta"):(e.skipToEnd(),"comment");if("$"===o)return t.tokens.unshift(tokenDollar),tokenize(e,t);if("+"===o||"="===o)return"operator";if("-"===o)return e.eat("-"),e.eatWhile(/\w/),"attribute";if("<"==o){if(e.match("<<"))return"operator";n=e.match(/^<-?\s*['"]?([^'"]*)['"]?/);if(n)return t.tokens.unshift(tokenHeredoc(n[1])),"string.special"}if(/\d/.test(o)&&(e.eatWhile(/\d/),e.eol()||!/\w/.test(e.peek())))return"number";e.eatWhile(/[\w-]/);o=e.current();return"="===e.peek()&&/\w+/.test(o)?"def":words.hasOwnProperty(o)?words[o]:null}function tokenString(r,s){var i="("==r?")":"{"==r?"}":r;return function(e,t){for(var n,o=!1;null!=(n=e.next());){if(n===i&&!o){t.tokens.shift();break}if("$"===n&&!o&&"'"!==r&&e.peek()!=i){o=!0,e.backUp(1),t.tokens.unshift(tokenDollar);break}if(!o&&r!==i&&n===r)return t.tokens.unshift(tokenString(r,s)),tokenize(e,t);if(!o&&/['"]/.test(n)&&!/['"]/.test(r)){t.tokens.unshift(tokenStringStart(n,"string")),e.backUp(1);break}o=!o&&"\\"===n}return s}}function tokenStringStart(n,o){return function(e,t){return t.tokens[0]=tokenString(n,o),e.next(),tokenize(e,t)}}define("atom",commonAtoms),define("keyword",commonKeywords),define("builtin",commonCommands);var tokenDollar=function(e,t){1<t.tokens.length&&e.eat("$");var n=e.next();return/['"({]/.test(n)?(t.tokens[0]=tokenString(n,"("==n?"quote":"{"==n?"def":"string"),tokenize(e,t)):(/\d/.test(n)||e.eatWhile(/\w/),t.tokens.shift(),"def")};function tokenHeredoc(n){return function(e,t){return e.sol()&&e.string==n&&t.tokens.shift(),e.skipToEnd(),"string.special"}}function tokenize(e,t){return(t.tokens[0]||tokenBase)(e,t)}const shell={startState:function(){return{tokens:[]}},token:function(e,t){return tokenize(e,t)},languageData:{autocomplete:commonAtoms.concat(commonKeywords,commonCommands),closeBrackets:{brackets:["(","[","{","'",'"',"`"]},commentTokens:{line:"#"}}};export{shell};