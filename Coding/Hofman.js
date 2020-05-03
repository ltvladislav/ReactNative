



function replaceAll(text, oldVar, newVar) {
    while (text.indexOf(oldVar) >= 0) {
        text = text.replace(oldVar, newVar);
    }
    return text;
}

function objectValuesReplace(value) {
    let result = {};
    for (let key in value) {
        result[value[key]] = key;
    }
    return result;
}



class Symbol {
    constructor(character, count) {
        this.character = character || '';
        this.count = count || 0;
        this.code = '';
    }

    codePlus(el) {
        this.code += el;
    }

    get Character() {
        return this.character;
    }

    static comparer = (a, b) => a.count - b.count;
    static comparerReverse = (a, b) => -Symbol.comparer(a, b);
}

class HofmanNode extends Symbol {
    constructor(leftChild, rightChild) {
        if (!rightChild) {
            super(leftChild);
            return;
        }
        super();
        this.leftChild = leftChild;
        this.rightChild = rightChild;
        this.count = leftChild.count + rightChild.count;
    }

    isSymbolNode() {
        return super.Character !== "";
    }

    get Character() {
        if (this.isSymbolNode()) {
            return super.Character;
        } else {
            return this.leftChild.Character + this.rightChild.Character;
        }
    }

    codePlus(el) {
        if (this.isSymbolNode()) {
            this.code = el + this.code;
        } else {
            this.leftChild.codePlus(el);
            this.rightChild.codePlus(el);
        }
    }

}


export default class Hofman {
    constructor(text) {
        this.setText(text || "");
    }


    setText(text) {
        this.text = text;
        this.symbols = [];

        //text = replaceAll(text, ' ', '_');
        for (let i = 0; i < text.length; i++) {
            this._getNodeByValue(text[i]).count++;
        }
        this._shifr();
    }
    getText() {
        return this.text;
    }

    getCodeText() {
        return this.text.split('').map(s => this._getNodeByValue(s).code, this).join('');
    }
    getCode() {
        return {
            code: this.getCodeText(),
            alphabet: this._getCodeAlphabet()
        };
    }
    setCode(code) {
        this._deshifr(code.code, code.alphabet);
    }
    _getCodeAlphabet() {
        return this.symbols.reduce(function(obj, item) {
            obj[item.Character] = item.code;
            return obj;
        }, {});
    }


    _getNodeByValue(character) {
        let node = this.symbols.find(s => s.Character === character)
        if (!node) {
            node = new HofmanNode(character);
            this.symbols.push(node);
        }
        return node;
    }
    _shifr() {
        let nodeStack = [...this.symbols];

        while (nodeStack.length > 1) {
            nodeStack.sort(Symbol.comparerReverse);

            let last1 = nodeStack.pop();
            let last2 = nodeStack.pop();
            last1.codePlus("1");
            last2.codePlus("0");
            nodeStack.push(new HofmanNode(last1, last2));
        }
        this.treeRoot = nodeStack[0];
    }
    _deshifr(codeText, codes) {
        codes = objectValuesReplace(codes);

        let text = '';
        let character = '';
        while (codeText.length > 0) {
            character += codeText[0];
            codeText = codeText.substring(1);
            if (codes[character]) {
                text += codes[character].replace('_', ' ');
                character = '';
            }
        }
        this.setText(text);
    }

    getThree() {
        if (!this.treeRoot) {
            return '';
        }
        return this._getInnerThree(this.treeRoot, '', true);
    }
    _getInnerThree(node, padding, isLast) {
        let threePart = '';

        threePart += padding + (isLast ? "└" : "├") + "────";
        if (node.isSymbolNode()) {
            return threePart + node.count + '\t' + node.Character + '\n';
        }

        return threePart + node.count + '\n' +
            this._getInnerThree(node.leftChild, padding + (isLast ? " " : "│") + "    ", false) +
            this._getInnerThree(node.rightChild, padding + (isLast ? " " : "│") + "    ", true);
    }

    static Code(text) {
        return new Hofman(text).getCode();
    }
}