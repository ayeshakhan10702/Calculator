// Get screen elements
const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");
const casioAnimation = document.getElementById("casioAnimation");
const buttons = document.querySelectorAll(".keys button");
const onBtn = document.getElementById("onButton");

// States
let isOn = false;
let expression = "";
let result = "";
let blinkInterval;
let cursorVisible = true;

// Function to show CASIO animation
function showCasioAnimation() {
  casioAnimation.style.display = 'flex';
  
  // Reset animation by removing and re-adding the class
  const casioText = document.querySelector('.casio-text');
  casioText.classList.remove('casio-text');
  void casioText.offsetWidth; // Trigger reflow
  casioText.classList.add('casio-text');
  
  // Hide after animation completes
  setTimeout(() => {
    casioAnimation.style.display = 'none';
  }, 2000);
}

// Function to render screen with cursor
function renderScreen() {
  if (!isOn) {
    expressionDisplay.innerHTML = "";
    resultDisplay.textContent = "";
    return;
  }
  
  // Display expression with cursor
  expressionDisplay.innerHTML = expression + (cursorVisible ? '<span class="cursor">|</span>' : '');
  
  // Display result if exists
  resultDisplay.textContent = result;
}

// Function to start blinking cursor
function startBlink() {
  renderScreen();
  blinkInterval = setInterval(() => {
    cursorVisible = !cursorVisible;
    renderScreen();
  }, 500);
}

// Function to stop blinking
function stopBlink() {
  clearInterval(blinkInterval);
  expressionDisplay.innerHTML = "";
  resultDisplay.textContent = "";
}

// Toggle ON/OFF
onBtn.addEventListener("click", () => {
  if (isOn) {
    // Turn off - show animation first
    showCasioAnimation();
    
    // Wait for animation to complete before turning off
    setTimeout(() => {
      isOn = false;
      stopBlink();
      expression = "";
      result = "";
    }, 2000);
  } else {
    // Turn on
    isOn = true;
    expression = "";
    result = "";
    startBlink();
  }
});

// Handle button clicks
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (!isOn) return; // ignore if calculator is off

    let value = btn.textContent.trim();

    // Handle icon buttons
    if (btn.querySelector("i")) {
      if (btn.querySelector("i").classList.contains("fa-divide")) {
        value = "÷";
      } else if (btn.querySelector("i").classList.contains("fa-xmark")) {
        value = "×";
      } else if (btn.querySelector("i").classList.contains("fa-minus")) {
        value = "-";
      } else if (btn.querySelector("i").classList.contains("fa-plus")) {
        value = "+";
      } else if (btn.querySelector("i").classList.contains("fa-square-root-variable")) {
        value = "√";
      } else if (btn.querySelector("i").classList.contains("fa-percent")) {
        value = "%";
      }
    }

    // AC → clear
    if (value === "AC") {
      expression = "";
      result = "";
      renderScreen();
      return;
    }

    // DEL → delete last character
    if (value === "DEL") {
      expression = expression.slice(0, -1);
      renderScreen();
      return;
    }

    // = → evaluate
    if (value === "=") {
      try {
        // Replace symbols for evaluation
        let evalExpression = expression
          .replace(/÷/g, "/")
          .replace(/×/g, "*")
          .replace(/√/g, "Math.sqrt");
        
        result = eval(evalExpression);
        if (typeof result === "number") {
          // Format number to avoid long decimals
          result = parseFloat(result.toPrecision(12)).toString();
        }
      } catch (e) {
        result = "Error";
      }
      
      // Display result at bottom-right
      renderScreen();
      return;
    }

    // Add to expression
    expression += value;
    renderScreen();
  });
});