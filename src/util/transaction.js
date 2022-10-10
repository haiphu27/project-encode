let format = require('string-format');

let dicts={};
function T(key,language,...options) {
   let sentence=dicts[language]!==undefined?(dicts[language]||key):key;
   return options.length?format(sentence,...options):sentence;
}

module.exports = {
   T:T,
   _T:T,
}