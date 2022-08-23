<p align="center">
    <img src="src/assets/images/logo.png" width="80">
</p>

<p align="center">
    <a href="https://github.com/osgufers/prize_draw/stargazers">
        <img height= "24" src="https://img.shields.io/github/stars/osgufers/prize_draw?colorA=1e1e28&colorB=fbbf24&style=for-the-badge">
    </a>
    <a href="https://github.com/osgufers/prize_draw/issues">
        <img height= "24" src="https://img.shields.io/github/issues/osgufers/prize_draw?colorA=1e1e28&colorB=db2777&style=for-the-badge">
    </a>
    <a href="https://github.com/osgufers/prize_draw/contributors">
        <img height= "24" src="https://img.shields.io/github/contributors/osgufers/prize_draw?colorA=1e1e28&colorB=34d399&style=for-the-badge">
    </a>
</p>

### Screenshots
![Screenshot - Prize Draw](src/assets/images/preview.png)

### Demo
See [Demo](https://osgufers.github.io/prize_draw) page.

#### Getting Started
To run the app, first make sure that you have live-server installed
`npm install -g live-server` 
execute `npm run dev` and `npm run tailwind`

#### How to create a google form that works with the app
The simplest way to start building a form is right from the Google Forms app. Go to docs.google.com/forms, then start a blank form.
1. Create two fields `Name` and `Email` with short answer option.
2. on the bottom of name field, click on three vertical dots button to create a answer validation.
    1. select `lenght`
    2. select `maximum number of characters` 
    3. set the value with `3`
    4. set a custom message.
3. on the bottom of email field, click on three vertical dots button to create a answer validation.
    1. select `regular expression`
    2. select `contains`
    3. set this value `[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+`
    4. set a custom message
4. See this [example](https://docs.google.com/forms/d/e/1FAIpQLSfCMgP4-UVdcAMrN41yg8ihx4hIJ3eTreiuDFgy68mGL1qseA/viewform)

#### What's a form ID ?
Form ID which identifies the form can be found in the web address. Example:
`docs.google.com/forms/d/e/`<span style="color:white;background-color:#f43f5e">1FAIpQLSfCMgP4-UVdcAMrN41yg8ihx4hIJ3eTreiuDFgy68mGL1qseA<span>`/viewform`

Read more about: https://stackoverflow.com/questions/62138139/how-to-find-google-form-id
#### Deploy on Github Pages
`git subtree push --prefix src origin gh-pages`

#### Thanks
<a href="https://www.jetbrains.com/?from=thingTalk"><img src="src/assets/images/jetbrains.png" height="120" alt="JetBrains"/></a>

#### Disclaimer
The Google name and logos are trademarks of Google.