function insertErrorElement(input, newErrorElement) {
  const parentElement = input.parentNode;
  const haveErrorMessage =
    parentElement.lastElementChild.classList.contains("error-message");

  if (!haveErrorMessage) {
    input.parentNode.appendChild(newErrorElement);
  } else if (haveErrorMessage) {
    const actualErrorElement = parentElement.lastElementChild;
    if (actualErrorElement.textContent !== newErrorElement.textContent) {
      actualErrorElement.remove();
      input.parentNode.appendChild(newErrorElement);
    }
  }
}

function createErrorElement(element, errorMessage) {
  const errorElement = document.createElement(element);
  errorElement.className = "error-message";
  errorElement.textContent = errorMessage;

  return errorElement;
}

function handleInvalidInput(input, errorMessage) {
  input.classList.add("input-error");
  const errorElementToInsert = createErrorElement("span", errorMessage);
  insertErrorElement(input, errorElementToInsert);
}

function formIsValid(inputs) {
  let valid = true;
  const regexJustNumbers = /^[0-9]+$/;

  for (let input of inputs) {
    const inputValue = input.value.replace(/\s+/g, "");
    const inputIsBlank = inputValue.length === 0;
    const invalidCardNumberLength =
      input.id === "number" && inputValue.length < 16;
    const inputWithWrongFormat =
      input.id !== "name" && !regexJustNumbers.test(inputValue);
    const haveErrorMessage =
      input.parentNode.lastElementChild.classList.contains("error-message");

    if (inputIsBlank) {
      handleInvalidInput(input, "Can't be blank.");
      valid = false;
    } else if (invalidCardNumberLength) {
      handleInvalidInput(input, "Invalid length, provide all the numbers.");
      valid = false;
    } else if (inputWithWrongFormat) {
      handleInvalidInput(input, "Wrong format, numbers only.");
      valid = false;
    } else if (haveErrorMessage) {
      let haveError = false;
      input.classList.remove("input-error");

      for (let child of input.parentNode.children) {
        if (child.classList.contains("input-error")) haveError = true;
      }

      if (!haveError) input.parentNode.lastElementChild.remove();
    }
  }
  return valid;
}

function handleSubmit(event) {
  event.preventDefault();

  if (formIsValid(inputs)) {
    form.classList.add("disabled");
    document.querySelector("#acknowledgment").classList.remove("disabled");
  }
}

const form = document.getElementById("card-form");
form.addEventListener("submit", handleSubmit);

function fillCardValues(input) {
  const cardText = document.querySelector(`#card-${input.id}`);
  cardText.textContent = input.value;
  if (input.value.length === 0) {
    if (cardText.id === "card-number")
      cardText.textContent = "0000 0000 0000 0000";
    else if (cardText.id === "card-name")
      cardText.textContent = "jane appleseed";
    else if (cardText.id === "card-month" || cardText.id === "card-year")
      cardText.textContent = "00";
    else if (cardText.id === "card-cvc") cardText.textContent = "000";
  }
}

const inputs = document.querySelectorAll("#card-form input");
inputs.forEach((input) => {
  input.addEventListener("keyup", () => {
    fillCardValues(input);
  });
});

const inputCardNumber = document.getElementById("number");
inputCardNumber.addEventListener("input", () => {
  const number = inputCardNumber.value.replace(/\s/g, "");
  let formattedNumber = "";
  for (let i = 0; i < number.length; i++) {
    if (i > 0 && i % 4 === 0) {
      formattedNumber += " ";
    }
    formattedNumber += number[i];
  }
  inputCardNumber.value = formattedNumber;
});

function handleFinish() {
  document.querySelector("#acknowledgment").classList.add("disabled");
  form.classList.remove("disabled");

  inputs.forEach((input) => {
    input.value = "";
    fillCardValues(input);
  });
}

const btnContinue = document.querySelector("#btn-continue");
btnContinue.addEventListener("click", handleFinish);
