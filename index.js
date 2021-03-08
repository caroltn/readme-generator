const fs = require('fs')
const inquirer = require('inquirer')

let usage = ''
let license = ''
let mdGen = ''
let screenshot = ''

const input = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'owner',
      message: 'Enter your name.'
    },
    {
      type: 'input',
      name: 'username',
      message: 'Enter your Github username.'
    },
    {
      type: 'input',
      name: 'email',
      message: 'Enter your e-mail address.'
    },
    {
      type: 'input',
      name: 'year',
      message: 'Enter the year.'
    },
    {
      type: 'input',
      name: 'title',
      message: 'Enter project title.'
    },
    {
      type: 'input',
      name: 'purpose',
      message: 'What is the purpose of this project?'
    },
    {
      type: 'input',
      name: 'solution',
      message: 'What issues did you have during this project? How did you solve them?'
    },
    {
      type: 'input',
      name: 'installation',
      message: 'What steps required to install your project?'
    },
    {
      type: 'input',
      name: 'credits',
      message: 'What resources were used for this project? (Did you collaborate with a team? Use third-party CDN? etc.'
    },
    {
      type: 'list',
      name: 'licensetype',
      message: 'License: ',
      choices: ['ISC', 'MIT', 'Apache', 'GNU']
    },
    {
      type: 'input',
      name: 'contribute',
      message: 'How to contribute?: '
    },
    {
      type: 'input',
      name: 'test',
      message: 'Test Examples: '
    }
  ])
    .then(res => {
      console.log(res)
      license = format(res.licensetype, res)

      const inputUsage = () => {
        inquirer.prompt([
          {
            type: 'input',
            name: 'instructions',
            message: 'How to use (Demo/Instructions)?: '
          },
          {
            type: 'input',
            name: 'screenshot',
            message: 'Screenshot File Location: '
          },
          {
            type: 'confirm',
            name: 'choice',
            message: 'Continue?'
          }
        ])
          .then(data => {
            screenshot = `![alt screenshot](${data.screenshot})`
            usage += `${data.instructions}\n${screenshot}\n`
            if (data.choice) {
              console.log(usage)
              inputUsage()
            }
            else {
              mdForm(res, usage, license)
            }
          })
          .catch(err => console.log(err))
      }
      inputUsage()
    })
    .catch(err => console.log(err))
}


const format = (licensetype, res) => {
  let format = ''
  switch (licensetype) {
    case 'ISC':
      format = `Copyright (c) ${res.year} ${res.owner}\nThis project is [ISC](https://choosealicense.com/licenses/isc/) Licensed.`
      break;
    case 'MIT':
      format = `Copyright (c) ${res.year} ${res.owner}\nThis project is [MIT](https://choosealicense.com/licenses/mit/) Licensed.`
      break;
    case 'Apashe':
      format = `Copyright (c) ${res.year} ${res.owner}\nThis project is [Apashe](https://choosealicense.com/licenses/apache-2.0/) Licensed.`
      break;
    case 'GNU':
      format = `Copyright (c) ${res.year} ${res.owner}\nThis project is [GNU](https://choosealicense.com/licenses/gpl-3.0/) Licensed.`
      break;
  }
  return format
}



const mdForm = (res, usage) => {
  mdGen = `# ${res.title}
![badmath](https://img.shields.io/github/languages/top/nielsenjared/badmath)
![license](https://img.shields.io/badge/license-${res.licensetype}-brightgreen)
## Description
- ${res.motivation}
- ${res.purpose}
- ${res.solution}
## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)
## Installation
*Steps required to install project and how to get the development environment running:*
${res.installation}
## Usage
${usage}
## Credits
${res.credits}
## License
${license}
`

  fs.writeFile('README.md', mdGen, err => {
    if (err) { console.log(err) }
  })

  if (res.contribute != '') {
    mdGen = `## How to Contribute\n\n${res.contribute}\n\n`
    fs.appendFile('README.md', mdGen, err => {
      if (err) { console.log(err) }
    })
  }
  if (res.test != '') {
    mdGen = `## Tests\n\n${res.test}\n\n`
    fs.appendFile('README.md', mdGen, err => {
      if (err) { console.log(err) }
    })
  }

  mdQuestions = `## Questions\n\nFeel free to contact me with any questions via the information below:\n\nGitHub: [@${res.username}](https://github.com/${res.username})\n\nEmail: [${res.email}](${res.email})`

  fs.appendFile('README.md', mdQuestions, err => {
    if (err) { console.log(err) }
  })
}

console.log("\nA README.md file will be generated based off of your responses.")

input()

console.log("\n README.md file successfully generated. Please review file before submitting.")