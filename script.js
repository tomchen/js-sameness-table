// IE6+

var values = [
    'true',
    'false',
    '1',
    '0',
    '-0',
    '-1',
    '"true"',
    '"false"',
    '"anystring"',
    '"1"',
    '"0"',
    '"-0"',
    '"-1"',
    '""',
    'null',
    'undefined',
    'Infinity',
    '-Infinity',
    '[]',
    '["anyarray"]',
    '{}',
    '{anyobject:true}',
    '[[]]',
    '[0]',
    '[-0]',
    '[1]',
    '[-1]',
    '[true]',
    '[false]',
    'NaN'
];

// Simple polyfill of Array.prototype.forEach, doesn't take `this` into account
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback) {
		for (var i = 0; i < this.length; i++) {
			callback(this[i], i, this);
		}
    }
}

var c = function(tagName, text, className) {
    var el = document.createElement(tagName);
    if (typeof text === "string") {
        var textNode = document.createTextNode(text);
        el.appendChild(textNode);
    }
    if (typeof className === "string") {
        el.className = className;
    }
    return el;
}

// type can be "==", "===", "SameValue" (Object.is()), or "SameValueZero" (Array.prototype.includes())
var createCompTable = function(type) {
    var table = c("table");
    var tr1 = c("tr", null, "tableheader");
    tr1.appendChild(c("th"));
    table.appendChild(tr1);
    
    var th, span, result;
    
    values.forEach(function(currentValue) {
        eval("var currentValueEvaluated = " + currentValue);
        th = c("th");
        span = c("span", currentValue);
        th.appendChild(span);
        tr1.appendChild(th);
    
        var currentTr = c("tr");
        currentTr.appendChild(c("th", currentValue));
    
        values.forEach(function(comparingValue) {
            eval("var comparingValueEvaluated = " + comparingValue);
            switch (type) {
                case "==":
                    result = currentValueEvaluated == comparingValueEvaluated;
                    break;
                case "===":
                    result = currentValueEvaluated === comparingValueEvaluated;
                    break;
                case "SameValue":
                    result = Object.is(currentValueEvaluated, comparingValueEvaluated);
                    break;
                case "SameValueZero":
                    result = [currentValueEvaluated].includes(comparingValueEvaluated);
                    break;
                default:
                    break;
            }
            if (result === true) {
                currentTr.appendChild(c("td", "T", "true"));
            } else {
                currentTr.appendChild(c("td", "F", "false"));
            }
        })
    
        table.appendChild(currentTr);
    });
    return table;
}

document.body.appendChild(createCompTable("=="));
document.body.appendChild(createCompTable("==="));
document.body.appendChild(createCompTable("SameValue"));
document.body.appendChild(createCompTable("SameValueZero"));
