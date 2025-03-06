const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";

function toBCD(number) {
    return number.split('').map(digit => parseInt(digit, 10).toString(2).padStart(4, '0')).join(' ');
}

function toGray(number) {
    const num = parseInt(number, 10);
    return (num ^ (num >> 1)).toString(2);
}

function toExcess3(number) {
    return number.split('').map(digit => (parseInt(digit, 10) + 3).toString(2).padStart(4, '0')).join(' ');
}

function convertBase(number, fromBase, toBase) {
    if (toBase === 'BCD') {
        return toBCD(number);
    } else if (toBase === 'Gray') {
        return toGray(number);
    } else if (toBase === 'Excess3') {
        return toExcess3(number);
    } else {
        const parts = number.split('.');
        const intPart = parseInt(parts[0], fromBase).toString(toBase);
        if (parts.length === 1) {
            return intPart;
        }
        let decPart = parts[1];
        let decValue = 0;
        for (let i = 0; i < decPart.length; i++) {
            decValue += parseInt(decPart[i], fromBase) / Math.pow(fromBase, i + 1);
        }
        let resultDecPart = '';
        for (let i = 0; i < 5; i++) {  // 精度到小數點後 5 位
            decValue *= toBase;
            resultDecPart += Math.floor(decValue).toString(toBase);
            decValue -= Math.floor(decValue);
        }
        return intPart + '.' + resultDecPart;
    }
}

function checkCustomInput(selectId, inputId) {
    let selectElement = document.getElementById(selectId);
    let inputElement = document.getElementById(inputId);
    if (selectElement.value === "Other") {
        inputElement.style.display = "inline";
    } else {
        inputElement.style.display = "none";
    }
}

document.getElementById('convertButton').addEventListener('click', function () {
    let inputNumber = document.getElementById('inputNumber').value;
    let inputBase = document.getElementById('inputBase').value;
    let outputBase = document.getElementById('outputBase').value;

    if (inputBase === "Other") {
        inputBase = parseInt(document.getElementById('customInputBase').value);
        if (isNaN(inputBase) || inputBase < 17 || inputBase > 63) {
            alert("請輸入17到63之間的有效進制數值作為輸入進制。");
            return;
        }
    } else {
        inputBase = parseInt(inputBase);
    }

    if (outputBase === "Other") {
        outputBase = parseInt(document.getElementById('customOutputBase').value);
        if (isNaN(outputBase) || outputBase < 17 || outputBase > 63) {
            alert("請輸入17到63之間的有效進制數值作為輸出進制。");
            return;
        }
    } else if (["BCD", "Gray", "Excess3"].includes(outputBase)) {
        // 直接使用編碼模式名稱
    } else {
        outputBase = parseInt(outputBase);
    }

    let result = convertBase(inputNumber, inputBase, outputBase).toUpperCase();
    document.getElementById('result').textContent = result;
});

document.getElementById('swapButton').addEventListener('click', function () {
    let inputBase = document.getElementById('inputBase');
    let customInputBase = document.getElementById('customInputBase');
    let outputBase = document.getElementById('outputBase');
    let customOutputBase = document.getElementById('customOutputBase');
    
    if (inputBase.value === "Other") {
        let temp = customInputBase.value;
        customInputBase.value = customOutputBase.value;
        customOutputBase.value = temp;
    }
    
    let temp = inputBase.value;
    inputBase.value = outputBase.value;
    outputBase.value = temp;

    checkCustomInput('inputBase', 'customInputBase');
    checkCustomInput('outputBase', 'customOutputBase');
});
