const CLIENT_ID = '465837555821-8kfhmd6nuqi2op58b8fndmvocs9s8db7.apps.googleusercontent.com'
const API_KEY = 'AIzaSyBbL1QE11IYguFm-p32YdAaUH8jOpAFjSo'

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_FORM = 'https://forms.googleapis.com/$discovery/rest?version=v1'

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = `https://www.googleapis.com/auth/forms.body.readonly https://www.googleapis.com/auth/forms.responses.readonly https://www.googleapis.com/auth/userinfo.profile`

let tokenClient
let gapiInited = false
let gisInited = false
let responses = [];
let winner = { name: "", email: "" };
let winners = [];

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
let winnerTable = document.getElementById('winner-table');

const themeButton = document.getElementById("theme-toggle");
const html = document.querySelector("html");

/** On Init */
(function init() {

  loadingButton.classList.add('hidden');

  themeButton.addEventListener("click", toggleTheme);
  if (localStorage.getItem("theme") === "dark") {
    html.classList.add("dark");
  }
  /** Set icon theme */
  changeThemeButtonIcon();

})();


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
  try {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_FORM],
    })
    gapiInited = true
    maybeEnableButtons()
  } catch (err) {
    addNotification(err.error.message, "linear-gradient(to right, #f43f5e, #db2777)");
  }
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
    authorizeButton.classList.add('inline-flex');
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
    authorizeButton.classList.add('inline-flex')
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

  /** Reset Values */
  resetValues();

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

  /**
   * Check if form dont have responses
   */
  if (Object.keys(response.result).length === 0) {
    addNotification("Nenhuma resposta encontrada", "linear-gradient(to right, #f43f5e, #db2777)");
    setLoading(false);
    modalDrums.classList.add('hidden');
    return
  }

  responses = response.result.responses
  getWinner();
}

/**
 * Set loading state
 */
function setLoading(loading) {
  if (loading) {
    loadingButton.classList.remove('hidden');
    loadingButton.classList.add('inline-flex');
    submitButton.classList.add('hidden');
  } else {
    loadingButton.classList.add('hidden');
    loadingButton.classList.remove('inline-flex');
    submitButton.classList.remove('hidden');
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
    document.getElementById('modal-description').innerText = 'Estamos quase lá...';
  }, 3000); // 2 seconds

  verifyWinner();

}

async function verifyWinner() {

  winner = await getRandomWinner();

  if (responses.length === winners.length) {
    addNotification("Todos os candidados foram sorteados!", "linear-gradient(to right, #4ade80, #38bdf8)");
    modalDrums.classList.add('hidden');
    renderTable();
    return;
  }

  const hasWinner = winners.some(item => item.email === winner.email);
  if (hasWinner) {
    return verifyWinner();
  }

  winners.push(winner);

  /** Hide email to display */
  let email = censorEmail(winner.email);

  document.getElementById('winner-name').innerText = `Parabéns ${winner.name}!`;
  document.getElementById('winner-email').innerHTML = `Entraremos em contato através do endereço de email:
    <a class="cursor-pointer text-primary-500" alt="copy" id="copy-email">${email}</a>
    para mais instruções sobre seu prmeio.
  `;

  document.getElementById('copy-email').addEventListener("click", copyWinnerEmail)

  setTimeout(() => {
    /** Hide/Show Modals */
    modalDrums.classList.add('hidden');
    modalWinner.classList.remove('hidden');
    /** Show Cofetti */
    showConfetti();
  }, 6000); // 5 seconds
}

/**
 * get a random winner
 */
async function getRandomWinner() {
  let answer = responses[Math.floor(Math.random() * responses.length)];
  let winnerAnswers = [];
  let winner = {};

  for (const [_, value] of Object.entries(answer.answers)) {
    winnerAnswers.push(value.textAnswers.answers[0].value);
  }

  /** Define winner information*/
  winnerAnswers.map(item => {
    if (item.includes('@')) {
      winner.email = item;
    } else {
      winner.name = item;
    }
  });

  return winner;

}

function resetValues() {
  winners = [];
  winner = { name: "", email: "" };
  responses = [];
  winnerTable.classList.add('hidden');
  winnerTable.classList.remove('flex');
}

/**
 * Change Theme
 */
function toggleTheme() {
  if (localStorage.getItem("theme") === "dark") {
    localStorage.setItem("theme", "light");
    themeButton.innerText = "Enable"
  } else {
    localStorage.setItem("theme", "dark");
    themeButton.innerText = "Disable"
  }
  html.classList.toggle("dark");
  changeThemeButtonIcon();
}

/**
 * Change Theme Button Icon
 */
function changeThemeButtonIcon() {
  if (localStorage.getItem("theme") === "dark") {
    themeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
    `
  } else {
    themeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
    `
  }
}

/**
 * Render winner table
 */
function renderTable() {
  winnerTable.classList.remove('hidden');
  winnerTable.classList.add('flex');
  document.getElementById('total-winners').innerText = `Total de ${winners.length} ${winners.length > 1 ? 'premiados' : 'premiado'}`;
  let table = document.getElementById('winner-table-body');
  table.innerHTML = '';
  winners.map((item, index) => {
    index++;
    index = String(index).padStart(2, '0');
    table.innerHTML += `
    <tr class="odd:bg-white even:bg-slate-50 dark:odd:bg-dark-700 dark:even:bg-dark-600">
      <td class="whitespace-nowrap p-3 text-center text-sm text-slate-700 dark:text-dark-200">${index}</td>
      <td class="whitespace-nowrap p-3 text-sm text-slate-700 dark:text-dark-200">${item.name}</td>
      <td class="whitespace-nowrap p-3 text-sm text-slate-700 dark:text-dark-200">${censorEmail(item.email)}</td>
    </tr>
    `
  });
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

/**
 * Close modal
 */
function handleCloseModal() {
  modalWinner.classList.add('hidden');
  if (winners.length > 0) {
    renderTable();
  }
}

/**
 * Censor email address
 */
function censorEmail(email) {
  let arr = email.split("@");
  return censorWord(arr[0]) + "@" + censorWord(arr[1]);
}

/**
 * Censor word
 */
function censorWord(str) {
  return str[0] + "*".repeat(str.length - 2) + str.slice(-1);
}

/**
 * Copy winner email
 */
function copyWinnerEmail() {
  navigator.clipboard.writeText(winner.email);
  addNotification("Endereço de Email copiado!", "linear-gradient(to right, #4ade80, #38bdf8)");
}

/** Export Winners */
function exportWinnersToCSV() {
  /** Convert array object do csv string */
  const csv = [
    ["Nome", "Email"],
    ...winners.map(item => [
      item.name,
      item.email
    ])
  ]
    .map(e => e.join(","))
    .join("\n");

  /** Create a blob of the csv string */
  const blob = new Blob([csv], { type: "text/csv" });
  /** Create a link to the blob */
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `lista de Ganhadores.csv`;
  /** Append the link to the DOM */
  document.body.appendChild(link);
  /** Click the link to trigger the download */
  link.click();
  /** Clean up the DOM */
  document.body.removeChild(link);
}