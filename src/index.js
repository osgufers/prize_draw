const CLIENT_ID = '1024488896918-2r80k7bvonr8rprf49j3pumdikei5elf.apps.googleusercontent.com'
const API_KEY = 'AIzaSyBr1hOfL5rt9ed-HjTGKVFNlHvx8J2a5Bs'
const FORM_ID = '1jnRSY-Rq68zvn6XBCpk0jieH4cGioSGO4jKkyqwN8XM'

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_FORM = 'https://forms.googleapis.com/$discovery/rest?version=v1'

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = `https://www.googleapis.com/auth/forms.body.readonly https://www.googleapis.com/auth/forms.responses.readonly https://www.googleapis.com/auth/userinfo.profile`

let tokenClient
let gapiInited = false
let gisInited = false

document.getElementById('authorize_button').style.visibility = 'hidden'
document.getElementById('signout_button').style.visibility = 'hidden'

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
    document.getElementById('authorize_button').style.visibility = 'visible'
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp
    }
    document.getElementById('signout_button').style.visibility = 'visible'
    document.getElementById('authorize_button').innerText = 'Refresh'
    await getFormResponses()
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
    document.getElementById('content').innerText = ''
    document.getElementById('authorize_button').innerText = 'Authorize'
    document.getElementById('signout_button').style.visibility = 'hidden'
  }
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */

async function getFormResponses() {
  let response
  try {
    response = await gapi.client.forms.forms.responses.list({
      formId: FORM_ID,
    })
  } catch (err) {
    document.getElementById('content').innerText = err.message
    return
  }
  console.log(response)
}