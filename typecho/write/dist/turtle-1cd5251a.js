var curPunc;function wordRegexp(t){return new RegExp("^(?:"+t.join("|")+")$","i")}wordRegexp([]);var keywords=wordRegexp(["@prefix","@base","a"]),operatorChars=/[*+\-<>=&|]/;function tokenBase(t,e){var n=t.next();if(curPunc=null,"<"!=n||t.match(/^[\s\u00a0=]/,!1)){if('"'==n||"'"==n)return e.tokenize=tokenLiteral(n),e.tokenize(t,e);if(/[{}\(\),\.;\[\]]/.test(n))return curPunc=n,null;if("#"==n)return t.skipToEnd(),"comment";if(operatorChars.test(n))return t.eatWhile(operatorChars),null;if(":"==n)return"operator";if(t.eatWhile(/[_\w\d]/),":"==t.peek())return"variableName.special";e=t.current();return keywords.test(e)?"meta":"A"<=n&&n<="Z"?"comment":"keyword"}return t.match(/^[^\s\u00a0>]*>?/),"atom"}function tokenLiteral(r){return function(t,e){for(var n,o=!1;null!=(n=t.next());){if(n==r&&!o){e.tokenize=tokenBase;break}o=!o&&"\\"==n}return"string"}}function pushContext(t,e,n){t.context={prev:t.context,indent:t.indent,col:n,type:e}}function popContext(t){t.indent=t.context.indent,t.context=t.context.prev}const turtle={startState:function(){return{tokenize:tokenBase,context:null,indent:0,col:0}},token:function(t,e){if(t.sol()&&(e.context&&null==e.context.align&&(e.context.align=!1),e.indent=t.indentation()),t.eatSpace())return null;var n=e.tokenize(t,e);if("comment"!=n&&e.context&&null==e.context.align&&"pattern"!=e.context.type&&(e.context.align=!0),"("==curPunc)pushContext(e,")",t.column());else if("["==curPunc)pushContext(e,"]",t.column());else if("{"==curPunc)pushContext(e,"}",t.column());else if(/[\]\}\)]/.test(curPunc)){for(;e.context&&"pattern"==e.context.type;)popContext(e);e.context&&curPunc==e.context.type&&popContext(e)}else"."==curPunc&&e.context&&"pattern"==e.context.type?popContext(e):/atom|string|variable/.test(n)&&e.context&&(/[\}\]]/.test(e.context.type)?pushContext(e,"pattern",t.column()):"pattern"!=e.context.type||e.context.align||(e.context.align=!0,e.context.col=t.column()));return n},indent:function(t,e,n){var e=e&&e.charAt(0),o=t.context;if(/[\]\}]/.test(e))for(;o&&"pattern"==o.type;)o=o.prev;e=o&&e==o.type;return o?"pattern"==o.type?o.col:o.align?o.col+(e?0:1):o.indent+(e?0:n.unit):0},languageData:{commentTokens:{line:"#"}}};export{turtle};