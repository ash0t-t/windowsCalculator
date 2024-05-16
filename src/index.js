const viewBtn = document.querySelector("#view");
const result = document.querySelector("#result");
const expression = document.querySelector("#expression");
const buttons = document.querySelectorAll(".buttons button");

let isBinaryView = false;
viewBtn.onclick = () => {
  isBinaryView = !isBinaryView;
  viewBtn.textContent = isBinaryView ? "Calculator" : "Binary";
  updateButtonVisibility();
};

buttons.forEach((button) => {
  button.addEventListener("click", () => handleButtonClick(button.id));
});

document.addEventListener("keydown", (event) => {
  const key = event.key;
  if (
    !isNaN(key) ||
    ["+", "-", "*", "/", ".", "Enter", "Backspace", "Escape"].includes(key)
  ) {
    handleKeyboardInput(key);
  }
});

function handleButtonClick(id) {
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

function handleKeyboardInput(key) {
  const keyMap = {
    Enter: "=",
    Backspace: "Backspace",
    Escape: "C",
    "*": "*",
    "/": "/",
    "+": "+",
    "-": "-",
  };
  const mappedKey = keyMap[key] || key;
  processInput(mappedKey);
}

function processInput(key) {
  if (isBinaryView) {
    if (["0", "1", "Backspace", "C", "CE", "="].includes(key)) {
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
  if (isBinaryView) {
    if (key == "C") {
      clearCalculator();
    } else if (key == "CE") {
      result.value = "";
    } else if (key == "Backspace") {
      result.value = result.value.slice(0, -1);
    } else if (key == "=") {
      const temp = result.value;
      result.value = binToDec(result.value);
      expression.textContent = temp;
    } else {
      result.value += key;
    }
  } else {
    if (key == "C") {
      clearCalculator();
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
      if (inputValue !== 0) {
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
      result.value += key;
    }
  }
}

function evalBinary(binaryString) {
  const decimalValue = parseInt(binaryString, 2);
  return decimalValue.toString(2);
}

function binToDec(binaryString) {
  return parseInt(binaryString, 2);
}

function decToBin(decimalValue) {
  return decimalValue.toString(2);
}

function updateButtonVisibility() {
  buttons.forEach((button) => {
    const id = button.id;
    if (isBinaryView) {
      if (["ce", "c", "backspace", "zero", "one", "equals"].includes(id)) {
        button.style.display = "block";
      } else {
        button.style.display = "none";
      }
    } else {
      button.style.display = "block";
    }
  });
}

function clearCalculator() {
  result.value = "";
  expression.textContent = "Form";
}
