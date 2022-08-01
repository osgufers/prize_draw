const CLIENT_ID = '1024488896918-2r80k7bvonr8rprf49j3pumdikei5elf.apps.googleusercontent.com'
const API_KEY = 'AIzaSyBr1hOfL5rt9ed-HjTGKVFNlHvx8J2a5Bs'

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_FORM = 'https://forms.googleapis.com/$discovery/rest?version=v1'

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = `https://www.googleapis.com/auth/forms.body.readonly https://www.googleapis.com/auth/forms.responses.readonly https://www.googleapis.com/auth/userinfo.profile`

let tokenClient
let gapiInited = false
let gisInited = false
let responses = [];

let authorizeButton = document.getElementById('authorize_button');
let signoutButton = document.getElementById('signout_button');
let form = document.getElementById('form');
let formId = document.getElementById('form-id');
let loadingButton = document.getElementById('loading_button');
let submitButton = document.getElementById('submit-form');
let signinButton = document.getElementById('signin_button');
let modal = document.getElementById('modal');

/** Hidde Elements */
form.classList.add('hidden');
signoutButton.classList.add('hidden');
authorizeButton.classList.add('hidden');
loadingButton.classList.add('hidden');
signinButton.classList.add('hidden');

/** Confetti */
var confettiSettings = {
  target: 'confetti',
  animate: false,
  max: 300,
  props: ['circle', 'square', 'triangle', 'line'],
  clock: '10',
  rotate: false,

  // colors: []
};
var confetti = new ConfettiGenerator(confettiSettings);
// confetti.render();

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load('client', intializeGapiClient)
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function intializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_FORM],
  })
  gapiInited = true
  maybeEnableButtons()
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  })
  gisInited = true
  maybeEnableButtons()
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    authorizeButton.classList.remove('hidden');
    signinButton.classList.remove('hidden');
  }
}

/**
 *  Sign in the user button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp
    }
    signoutButton.classList.remove('hidden');
    authorize_button.classList.add('hidden');
    form.classList.remove('hidden');
    signinButton.innerText = 'Refresh';
  }

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: 'consent' })
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: '' })
  }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  const token = gapi.client.getToken()
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token)
    gapi.client.setToken('')
    authorizeButton.classList.remove('hidden')
    signoutButton.classList.add('hidden')
    form.classList.add('hidden');
    signinButton.innerText = 'Sign-in';
  }
}

/**
 * Find formID by button click
 */
function handleSearchFormIdClick() {
  if (formId.value !== '') {
    getFormResponsesById(formId.value);
  }
}

/**
 * Get form responses.
 */
async function getFormResponsesById(formId) {
  let response;
  setLoading(true);
  try {
    response = await gapi.client.forms.forms.responses.list({
      formId: formId,
    })
    setLoading(false);
  } catch (err) {

    addNotification(err.result.error.message, '#be123c');
    setLoading(false);
    return
  }

  responses = response.result.responses
  modal.classList.remove('hidden');
}

function setLoading(loading) {
  if (loading) {
    // document.getElementById('loading_button').innerText = 'Loading...'
    loadingButton.classList.remove('hidden');
    submitButton.classList.add('hidden');
  } else {
    loadingButton.classList.add('hidden');
    submitButton.classList.remove('hidden');
    // document.getElementById('loading_button').innerText = 'Procurar'
  }
}

/**
 * Show notification alert.
 */
function addNotification(message, background) {
  Toastify({
    text: message,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: background,
    }
  }).showToast();
}

/** Close Modal */
function handleCloseModal() {
  modal.classList.add('hidden');
}

responses = [
  {
    "responseId": "ACYDBNhxm2qXHc8i4gHQuAc-KWGF-GbOB2KZxfliLi66-dbzICd8TdSfviPcSnkyZE1-2vw",
    "createTime": "2022-08-01T20:23:28.870Z",
    "lastSubmittedTime": "2022-08-01T20:23:28.870191Z",
    "answers": {
      "1fbbe6ef": {
        "questionId": "1fbbe6ef",
        "textAnswers": {
          "answers": [
            {
              "value": "jonatas@gmail.com"
            }
          ]
        }
      },
      "7835c942": {
        "questionId": "7835c942",
        "textAnswers": {
          "answers": [
            {
              "value": "Jonatas Maia"
            }
          ]
        }
      }
    }
  },
  {
    "responseId": "ACYDBNjr-lJ5s_nBj3uCVGxj4AmjfryGdPKE4Buwd4mSTsBlF3sHEisXyWS0t0oysKVNLxU",
    "createTime": "2022-08-01T20:23:41.384Z",
    "lastSubmittedTime": "2022-08-01T20:23:41.384703Z",
    "answers": {
      "1fbbe6ef": {
        "questionId": "1fbbe6ef",
        "textAnswers": {
          "answers": [
            {
              "value": "natalia@gmail.com"
            }
          ]
        }
      },
      "7835c942": {
        "questionId": "7835c942",
        "textAnswers": {
          "answers": [
            {
              "value": "Natalia Santos"
            }
          ]
        }
      }
    }
  },
  {
    "responseId": "ACYDBNjz_2wxbrsbHziAsx_DEVncYO6j7zDzoVB8K1Pf9LVgX7-HeiMzCVy1p_ddI02Tv3o",
    "createTime": "2022-08-01T20:22:42.498Z",
    "lastSubmittedTime": "2022-08-01T20:22:42.498351Z",
    "answers": {
      "1fbbe6ef": {
        "questionId": "1fbbe6ef",
        "textAnswers": {
          "answers": [
            {
              "value": "luiza@gmail.com"
            }
          ]
        }
      },
      "7835c942": {
        "questionId": "7835c942",
        "textAnswers": {
          "answers": [
            {
              "value": "Luiza Santos"
            }
          ]
        }
      }
    }
  },
  {
    "responseId": "ACYDBNip7TZP6oJ0y6ZH06i7nRcEfnoU7BlOeiOF4DMJSAoKCZU8xzYbG3wDrLyLY1VmU9A",
    "createTime": "2022-08-01T20:21:52.249Z",
    "lastSubmittedTime": "2022-08-01T20:21:52.249663Z",
    "answers": {
      "1fbbe6ef": {
        "questionId": "1fbbe6ef",
        "textAnswers": {
          "answers": [
            {
              "value": "rodrigo@gmail.com"
            }
          ]
        }
      },
      "7835c942": {
        "questionId": "7835c942",
        "textAnswers": {
          "answers": [
            {
              "value": "Rodrigo Muniz"
            }
          ]
        }
      }
    }
  },
  {
    "responseId": "ACYDBNgOItmvHkrclw6hl_Mcf1knh-aDiy1j4kvkJVhCllzUopK4a0nZvMFq0Gz211KaTlI",
    "createTime": "2022-08-01T20:22:22.476Z",
    "lastSubmittedTime": "2022-08-01T20:22:22.476239Z",
    "answers": {
      "1fbbe6ef": {
        "questionId": "1fbbe6ef",
        "textAnswers": {
          "answers": [
            {
              "value": "junior@gmail.com"
            }
          ]
        }
      },
      "7835c942": {
        "questionId": "7835c942",
        "textAnswers": {
          "answers": [
            {
              "value": "Junior Santos"
            }
          ]
        }
      }
    }
  },
  {
    "responseId": "ACYDBNhZD86GsrpHsGGGllye7Ue1IlQ8SXi9zZgtLK5ojLwvRQkXn4WOCV2w5SGN470GUew",
    "createTime": "2022-08-01T20:22:03.242Z",
    "lastSubmittedTime": "2022-08-01T20:22:03.242319Z",
    "answers": {
      "1fbbe6ef": {
        "questionId": "1fbbe6ef",
        "textAnswers": {
          "answers": [
            {
              "value": "thiago@gmail.com"
            }
          ]
        }
      },
      "7835c942": {
        "questionId": "7835c942",
        "textAnswers": {
          "answers": [
            {
              "value": "Thiago Sampaio"
            }
          ]
        }
      }
    }
  }
]

var item = responses[Math.floor(Math.random() * responses.length)];
let name = '';
let email = '';

console.log(item.answers)
for (const [_, value] of Object.entries(item.answers)) {
  console.log(value.textAnswers.answers[0].value)
}