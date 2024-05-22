const viewBtn = document.querySelector("#view");
const result = document.querySelector("#result");
const expression = document.querySelector("#expression");
const buttons = document.querySelectorAll(".buttons button");

let isBinary = false;
viewBtn.onclick = () => {
  if (isBinary) {
    convertToDecimal();
  } else {
    convertToBinary();
  }
  isBinary = !isBinary;
  viewBtn.textContent = isBinary ? "Calculator" : "Binary";
  toBinary();
};

buttons.forEach((button) => {
  button.addEventListener("click", () => clickHandler(button.id));
});

document.addEventListener("keydown", (event) => {
  const key = event.key;
  if (
    !isNaN(key) ||
    ["+", "-", "*", "/", ".", "Enter", "Backspace", "Escape"].includes(key)
  ) {
    keyboardHandler(key);
  }
});

function clickHandler(id) {
  const keyMap = {
    percent: "%",
    ce: "CE",
    c: "C",
    backspace: "Backspace",
    inverse: "1/x",
    square: "x^2",
    sqrt: "√",
    divide: "/",
    seven: "7",
    eight: "8",
    nine: "9",
    multiply: "*",
    four: "4",
    five: "5",
    six: "6",
    subtract: "-",
    one: "1",
    two: "2",
    three: "3",
    add: "+",
    negate: "±",
    zero: "0",
    decimal: ".",
    equals: "=",
  };
  const key = keyMap[id];
  processInput(key);
}

function keyboardHandler(key) {
  const keyMap = {
    Enter: "=",
    Backspace: "Backspace",
    Escape: "C",
  };
  const mappedKey = keyMap[key] || key;
  processInput(mappedKey);
}

function processInput(key) {
  if (isBinary) {
    if (["0", "1", "+", "-", "Backspace", "C", "CE", "="].includes(key)) {
      updateDisplay(key);
    }
  } else {
    if (
      !isNaN(key) ||
      [
        "+",
        "-",
        "*",
        "/",
        ".",
        "=",
        "Backspace",
        "C",
        "CE",
        "%",
        "1/x",
        "x^2",
        "√",
        "±",
      ].includes(key)
    ) {
      updateDisplay(key);
    }
  }
}

function updateDisplay(key) {
  if (isBinary) {
    if (key == "C") {
      clear();
    } else if (key == "CE") {
      result.value = "";
    } else if (key == "Backspace") {
      result.value = result.value.slice(0, -1);
    } else if (key == "=") {
      try {
        const binary = result.value;
        const decimal = eval(binary.replace(/[01]+/g, (match) => parseInt(match, 2)));
        result.value = decimal.toString(10);
        expression.textContent = `${binary} = ${decimal}`;
      } catch (error) {
        result.value = "Error";
        expression.textContent = "Error";
      }
    } else {
      if (!isValidInput(result.value + key)) {
        return;
      }
      result.value += key;
    }
  } else {
    if (key == "C") {
      clear();
    } else if (key == "CE") {
      result.value = "";
    } else if (key == "Backspace") {
      result.value = result.value.slice(0, -1);
    } else if (key == "=") {
      const expressionValue = result.value;
      if (expressionValue) {
        let resultValue;
        try {
          resultValue = eval(expressionValue);
          result.value = resultValue;
          expression.textContent = expressionValue + " = " + resultValue;
        } catch (error) {
          result.value = "Error";
          expression.textContent = "Error";
        }
      }
    } else if (key == "1/x") {
      const inputValue = parseFloat(result.value);
      if (inputValue != 0) {
        result.value = 1 / inputValue;
        expression.textContent = `1/${inputValue}`;
      } else {
        result.value = "Error";
        expression.textContent = "Error: Division by zero";
      }
    } else if (key == "x^2") {
      const inputValue = parseFloat(result.value);
      result.value = Math.pow(inputValue, 2);
      expression.textContent = `${inputValue}^2`;
    } else if (key == "√") {
      const inputValue = parseFloat(result.value);
      if (inputValue >= 0) {
        result.value = Math.sqrt(inputValue);
        expression.textContent = `√${inputValue}`;
      } else {
        result.value = "Error";
        expression.textContent = "Error: Invalid input for square root";
      }
    } else if (key == "±") {
      const inputValue = parseFloat(result.value);
      result.value *= -1;
      expression.textContent = `±${inputValue}`;
    } else if (key == "%") {
      const inputValue = parseFloat(result.value);
      result.value = inputValue / 100;
      expression.textContent = `${inputValue}%`;
    } else {
      if (!isValidInput(result.value + key)) {
        return;
      }
      result.value += key;
    }
  }
}

function toBinary() {
  buttons.forEach((button) => {
    const id = button.id;
    if (isBinary) {
      if (
        [
          "ce",
          "c",
          "backspace",
          "zero",
          "one",
          "equals",
          "add",
          "subtract",
        ].includes(id)
      ) {
        button.style.display = "block";
      } else {
        button.style.display = "none";
      }
    } else {
      button.style.display = "block";
    }
  });
}

function clear() {
  result.value = "";
  expression.textContent = "Form";
}

function convertToBinary() {
  const decimalValue = parseFloat(result.value);
  if (!isNaN(decimalValue)) {
    result.value = decimalValue.toString(2);
    expression.textContent = `${decimalValue} to binary`;
  }
}

function convertToDecimal() {
  const binaryValue = result.value;
  if (/^[01]+$/.test(binaryValue)) {
    const decimalValue = parseInt(binaryValue, 2);
    result.value = decimalValue.toString(10);
    expression.textContent = `${binaryValue} to decimal`;
  }
}

function isValidInput(input) {
  const operators = ["+", "-", "*", "/"];
  const lastChar = input[input.length - 1];
  const secondLastChar = input[input.length - 2];
  if (lastChar == "." && secondLastChar == ".") {
    return false;
  }
  if (operators.includes(lastChar) && operators.includes(secondLastChar)) {
    return false;
  }
  if (lastChar == "." && input.split(".").length > 2) {
    return false;
  }
  return true;
}