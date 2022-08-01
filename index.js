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

let authorizeButton = document.getElementById('authorize_button');
let signoutButton = document.getElementById('signout_button');
let form = document.getElementById('form');
let formId = document.getElementById('form-id');
let loadingButton = document.getElementById('loading_button');
let submitButton = document.getElementById('submit-form');
let signinButton = document.getElementById('signin_button');

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
  console.log(response.result.responses)
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
function addNotification(message, colors) {
  Toastify({
    text: message,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: colors,
    }
  }).showToast();
}