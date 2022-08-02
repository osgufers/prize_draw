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
var winner = { name: "", email: "" };

/** Components */
let authorizeButton = document.getElementById('authorize_button');
let signoutButton = document.getElementById('signout_button');
let form = document.getElementById('form');
let formId = document.getElementById('form-id');
let loadingButton = document.getElementById('loading_button');
let submitButton = document.getElementById('submit-form');
let signinButton = document.getElementById('signin_button');
let modalWinner = document.getElementById('modal-winner');
let modalDrums = document.getElementById('modal-drums');

/** Hidde Elements */
form.classList.add('hidden');
signoutButton.classList.add('hidden');
authorizeButton.classList.add('hidden');
loadingButton.classList.add('hidden');
signinButton.classList.add('hidden');

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
    signinButton.innerText = 'Atualizar';
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

    addNotification(err.result.error.message, "linear-gradient(to right, #f43f5e, #db2777)");
    setLoading(false);
    return
  }

  responses = response.result.responses
  getWinner();
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
 * Get winner
 */
function getWinner() {

  /** Show modal Drums */
  modalDrums.classList.remove('hidden');
  modalWinner.classList.add('hidden');

  /** Set participants description */
  let participants = responses.length > 1 ? 'participantes' : 'participante';
  document.getElementById('modal-description').innerText = `Nossa IA identificou o total de ${responses.length} ${participants}`;

  setTimeout(() => {
    /** Hide/Show Modals */
    modalDrums.classList.add('hidden');
    modalWinner.classList.remove('hidden');
    /** Show Cofetti */
    showConfetti();
  }, 6000); // 5 seconds


  setTimeout(() => {
    document.getElementById('modal-description').innerText = 'Estamos quase lá...';
  }, 3000); // 2 seconds

  let answer = responses[Math.floor(Math.random() * responses.length)];
  let winnerAnswers = [];

  for (const [_, value] of Object.entries(answer.answers)) {
    winnerAnswers.push(value.textAnswers.answers[0].value);
  }

  winner.email = winnerAnswers[0];
  winner.name = winnerAnswers[1];

  let email = censorEmail(winner.email);

  document.getElementById('winner-name').innerText = `Parabéns ${winner.name}!`;
  document.getElementById('winner-email').innerHTML = `Entraremos em contato através do endereço de email:
    <a class="cursor-pointer text-primary-500" alt="copy" id="copy-email">${email}</a>
    para mais instruções sobre seu prmeio.
  `;

  document.getElementById('copy-email').addEventListener("click", copyWinnerEmail)
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
  modalWinner.classList.add('hidden');
}

/** Hide Email address */
function censorEmail(email) {
  let arr = email.split("@");
  return censorWord(arr[0]) + "@" + censorWord(arr[1]);
}

/** Hide String */
function censorWord(str) {
  return str[0] + "*".repeat(str.length - 2) + str.slice(-1);
}

function copyWinnerEmail() {
  navigator.clipboard.writeText(winner.email);
  addNotification("Email copiado para a área de transferência!", "linear-gradient(to right, #4ade80, #38bdf8)");
}