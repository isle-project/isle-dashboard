"use strict";Object.defineProperty(exports,"__esModule",{value:!0});for(var base={8:"Backspace",9:"Tab",10:"Enter",12:"NumLock",13:"Enter",16:"Shift",17:"Control",18:"Alt",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",44:"PrintScreen",45:"Insert",46:"Delete",59:";",61:"=",91:"Meta",92:"Meta",106:"*",107:"+",108:",",109:"-",110:".",111:"/",144:"NumLock",145:"ScrollLock",160:"Shift",161:"Shift",162:"Control",163:"Control",164:"Alt",165:"Alt",173:"-",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'",229:"q"},shift={48:")",49:"!",50:"@",51:"#",52:"$",53:"%",54:"^",55:"&",56:"*",57:"(",59:":",61:"+",173:"_",186:":",187:"+",188:"<",189:"_",190:">",191:"?",192:"~",219:"{",220:"|",221:"}",222:'"',229:"Q"},chrome=typeof navigator!="undefined"&&/Chrome\/(\d+)/.exec(navigator.userAgent),safari=typeof navigator!="undefined"&&/Apple Computer/.test(navigator.vendor),gecko=typeof navigator!="undefined"&&/Gecko\/\d+/.test(navigator.userAgent),mac=typeof navigator!="undefined"&&/Mac/.test(navigator.platform),ie=typeof navigator!="undefined"&&/MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent),brokenModifierNames=chrome&&(mac||+chrome[1]<57)||gecko&&mac,i=0;i<10;i++)base[48+i]=base[96+i]=String(i);for(var i=1;i<=24;i++)base[i+111]="F"+i;for(var i=65;i<=90;i++)base[i]=String.fromCharCode(i+32),shift[i]=String.fromCharCode(i);for(var code in base)shift.hasOwnProperty(code)||(shift[code]=base[code]);function keyName(event){var ignoreKey=brokenModifierNames&&(event.ctrlKey||event.altKey||event.metaKey)||(safari||ie)&&event.shiftKey&&event.key&&event.key.length==1,name=!ignoreKey&&event.key||(event.shiftKey?shift:base)[event.keyCode]||event.key||"Unidentified";return name=="Esc"&&(name="Escape"),name=="Del"&&(name="Delete"),name=="Left"&&(name="ArrowLeft"),name=="Up"&&(name="ArrowUp"),name=="Right"&&(name="ArrowRight"),name=="Down"&&(name="ArrowDown"),name}exports.base=base,exports.keyName=keyName,exports.shift=shift;

//# sourceMappingURL=d2c028bda186fdc653a9.cjs.map