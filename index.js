// Import Inquirer, Fs and classes from shape.js file
const inquirer = require("inquirer");
const fs = require("fs");
const { Triangle, Square, Circle } = require("./test/shape");
const { log } = require("console");

// Function to create the questions prompt to users
function questions() {
  inquirer.prompt([{
    type: 'input',
    name: 'characters',
    message: 'What three text characters would you like for your logo?',
    validate: (input) => input.lenght <= 3, 
  },
  { 
    type: 'input',
    name: 'color', 
    message: 'What is your desired color for the text in the hexodecimal numer or color name?', 
  },
  { 
    type: 'list', 
    name: 'shapes', 
    message: 'Which shape would you like for your logo?', 
    choices: ['circle', 'triangle', 'square'], 
  }, 
  { 
    type: 'input', 
    name: 'backColor', 
    message: `What is your desired color for the background of your logo's shape?`, 
  }])
  .then((answers) => { 
    if (answers.text.length > 3) {
      console.log(`Something went wrong please try again!`);
      questions();
    } else {
      console.log(`Your answers have been saved!`);
      writeToFile ('logoGenerated.svg', answers);
    }
  });
}


// Function to create the SVG file base on the users answers
function writeToFile(fileName, answers) {
  let svg = "";
  svg = '<svg version="1.1" width="300" height="200" xmlns="http://www.w3.org/2000/svg">';
  svg += "<g>";
  svg += `${answers.shapes}`;
  let shapeChoice;
  if (answers.shape === "circle") {
    shapeChoice = new Circle();
    svg += `<circle cx="25" cy="75" r="20" fill="${answers.backColor}"/>`;
  } else if (answers.shape === "triangle") {
    shapeChoice = new Triangle();
    svg += `<path d="M150 0L75 200 L225 200Z fill="${answers.backColor}"/>`;
  } else {
    shapeChoice = new Square();
    svg += `<rect x="10" y="10" width="30" height="30" fill="${answers.backColor}"/>`;
  }

  svg += `<text x="0" y="15" font-size="40" fill="${answers.color}">${answers.characters}</text>`;
  svg += "</g>";
  svg += "</svg>";

  fs.writeFile(fileName, svg, (err) => {
    if (err) throw err;
  });
}

// This function utilizes inquirer .prompt to prompt the user to answer questions in the command line and save user input
function promptUser() {
  inquirer
    .prompt([
      // Text prompt
      {
        type: "input",
        message:
          "What text would you like you logo to display? (Enter up to three characters)",
        name: "text",
      },
      // Text color prompt
      {
        type: "input",
        message:
          "Choose text color (Enter color keyword OR a hexadecimal number)",
        name: "textColor",
      },
      // Shape choice prompt
      {
        type: "list",
        message: "What shape would you like the logo to render?",
        choices: ["Triangle", "Square", "Circle"],
        name: "shape",
      },
      // Shape color prompt
      {
        type: "input",
        message:
          "Choose shapes color (Enter color keyword OR a hexadecimal number)",
        name: "shapeBackgroundColor",
      },
    ])
    .then((answers) => {
      // Error handling for text prompt (user must enter 3 characters or less for logo to generate)
      if (answers.text.length > 3) {
        console.log("Must enter a value of no more than 3 characters");
        promptUser();
      } else {
        // Calling write file function to generate SVG file
        writeToFile("logo.svg", answers);
      }
    });
}

// Calling promptUser function so inquirer prompts fire off when application is ran
promptUser();