/******
 *
 * Part von Lukas
 *
 * Datum: 2018-02-26
 *
 */

/**
 * TODO:
 *  *Bennenung überdenken
 *  *UserView,ListsView und View für einzelne Elemenete vorbereiten, diese dann per JSON Füllen
 *  *Kommentierung
 *
 *  *Update Elemente
 *  *Update Liste
 *  *Update User
 *
 *  Vorgehen: View laden - Daten laden.
 *
 *  Sprich: zuerst wird eine "leere" Seite angezeigt, und diese dann mit Daten gefüllt.
 */


// region Globales und document Ready
/**
 * Globale Variablen
 */
let USERTOKEN = null;
let USERNAME = null;

let URL = "http://uberlistwebapi.azurewebsites.net/";


function myFetch(backendMethod, data, type) {
	//waitingDialog.show();
	let url = URL + backendMethod;

	if(data !== null && data !== undefined){
		data = JSON.stringify(data);
	}
	else{
		data = undefined;
	}
  // Default options are marked with *
  return fetch(url, {
    body: data, // must match 'Content-Type' header
    headers: {
      'content-type': 'application/json',
			'authorization': USERTOKEN,
    },
		mode: 'cors',
    method: type, // *GET, POST, PUT, DELETE, etc.
  }).then(response => response.json()).catch(error => console.log(error)); // parses response to JSON
}


/**
 * Document Ready - Prüfe Login
 */
$(document).ready(function () {
	document.querySelector("#mainContent").style.display = 'none';
	login();

});
//endregion

//region login und Startseite
/**
 * Check den Login --> True: mainView, false: Login
 */
function login(){
	let username = document.querySelector("#loginUsername").value;
	let password = document.querySelector("#loginPassword").value;

	if (username !== "") {

		localStorage.setItem("uberListUsername", username);
		localStorage.setItem("uberListPassword", password);
	}

	if (username === "") {

		username = localStorage.getItem("uberListUsername");
		password = localStorage.getItem("uberListPassword");
	}

	if (username !== "" && password !== "") {
		let data = {
			username: username,
			password: password,
		};
		myFetch('authenticate', data, "POST").then(function(dat){
			console.log(dat);
				USERTOKEN = dat.token;
				USERNAME = dat.username;
				//Ändern der Darstellung zwischen Main (Normale Seiten) und Login (ausgeloggt)
				document.querySelector("#mainContent").style.display = 'block';
				document.querySelector("#loginContent").style.display = 'none';
				//getUserData();
				getLitsts();
				setBackgroundColor(dat.color);
			}).catch(function(error) { console.log(error); });
	}
}

$("#form-login").submit(function(e) {
	e.preventDefault();
	login();
});


$("#form-register").submit(function(e) {
	e.preventDefault();

	let username = document.querySelector("#registerUsername").value;
	let password = document.querySelector("#registerPassword").value;
	let passwordCheck = document.querySelector("#registerPasswordCheck").value;
	let email = document.querySelector("#registerEmail").value;

	if (password !== passwordCheck) {
		alert("Password ungleich");
	}
	else {
		let sendData = {
			username: username,
			password: password,
			email: email,
		};
		myFetch('register', sendData, "POST")
			.then(function(dat){
				alert("Registriert");
			}) // JSON from `response.json()` call

	}
});

function logout(){
	myFetch('authenticate', null, "DELETE")
		.then(function(){
			document.querySelector("#mainContent").style.display = 'none';
			document.querySelector("#loginContent").style.display = 'block';
		});
}

//endregion


//region Liste
/**
 * Bekomme alle Listen
 */

function getLitsts() {
	myFetch('secure/list', null, "GET")
		.then(function (data) {
			console.log(data)
			let lists = data.lists;
				let ul = document.querySelector("#listView-list-ul");
				ul.innerHTML = "";
				for (let i = 0; i < lists.length; i++) {
					ul.innerHTML += `<li> <a href="javascript:void(0)" onclick="showListDetails()"><i class="fas fa-pencil-alt"></i></a> <a href="javascript:void(0)" onclick="showElements(${lists[i]._id})">${lists[i].title}</a></li>`
				}
		});
}

function showListDetails() {
	$('#listDetailsModal').modal("toggle");
}

$('.nav-tabs a').on('shown.bs.tab', function () {
	document.querySelector("#showElements").style.display = "none";
	document.querySelector("#showListen").style.display = "block";
});

function showLists() {
	document.querySelector("#showElements").style.display = "none";
	document.querySelector("#showListen").style.display = "block";
}

/**
 * Neue Liste anlegen, Parameter: Titel der Liste
 * @param element
 */
function addNewList(element) {

	let title = element.value;
	if (title.length > 2) {
		//alert("Die Liste " + title + " wird angelegt.");

		myFetch('secure/list', {title: title}, "POST")
			.then(data => function (data) {
				console.log(data);
				getLitsts();
				element.value = "";
			}) // JSON from `response.json()` call
			.catch(error => console.error(error))
		}
}

function deleteList() {

}

//endregion

//region Elements
/**
 * Lade elemente von einer ID
 * @param listID
 */
function showElements(listID) {
	getElementsFromList(listID);
}

function getElementsFromList(listID) {

	myFetch('secure/getElements', {listId: listID}, "POST")
		.then(data => function (data) {
			console.log(data);

			document.querySelector("#myCurrentList").value = listID;

			document.querySelector("#showElements").style.display = "block";
			document.querySelector("#showListen").style.display = "none";


			document.querySelector("#listNameHeading").innerHTML = data['name'];


			let ul = document.querySelector("#listElements-element-ul");
			ul.innerHTML = "";
			for (let i = 0; i < data['elements'].length; i++) {
				let dat = data['elements'][i];
				ul.innerHTML += `<li><a href="javascript:void(0)" onclick="showElementDetails(${dat.id})"><i class="fas fa-pencil-alt"></i></a> <a href="javascript:void(0)" onclick="checkElement(${dat.id})"><i class="fas fa-check"></i></a> ${dat.name}</li>`
			}
		}) // JSON from `response.json()` call
		.catch(error => console.error(error));
}


function showElementDetails() {
	let data = getElementDetails();

	document.querySelector("#elementEditName").value = data.name;
	document.querySelector("#elementEditOrt").value = data.place;
	document.querySelector("#elementEditTimePicker").value = data.time;
	document.querySelector("#elementEditFreetext").value = data.freetext;

	$('#elementsDetailsModal').modal("toggle");
}

function getElementDetails() {
	//TODO load Ajax

	return {"name": "Name", "place": "Büro", "time": "2019-01-01T20:00:00", "freetext": "Text"};
}

function checkElement(id) {
	//TODO ajax Check#

	myFetch('secure/checkElement', {element: id}, "POST")
		.then(data => function (data) {
			console.log(data);
			getLitsts();
			element.value = "";
		}) // JSON from `response.json()` call
		.catch(error => console.error(error));
}

function deleteElement(id) {
	//TODO ajax delete

	myFetch('secure/deleteElement', {element: id}, "POST")
		.then(data => function (data) {
			console.log(data);
			getLitsts();
			element.value = "";
		}) // JSON from `response.json()` call
		.catch(error => console.error(error));
}

function updateElement() {
	//TODO fetch update

	myFetch('secure/updateElement', data, "POST")
		.then(data => function (data) {
			console.log(data);
			getLitsts();
			element.value = "";
		}) // JSON from `response.json()` call
		.catch(error => console.error(error));
}

function addNewElement(element) {
	let text = element.value;
	if (text.length > 2) {
		let listID = document.querySelector("#myCurrentList").value;
		alert("Hier wird dann das Element " + text + " an die Liste " + listID + " angefügt");

		myFetch('secure/addElement', {list: listID, element: text}, "POST")
			.then(data => function (data) {
				console.log(data);
				getLitsts();
				element.value = "";
			}) // JSON from `response.json()` call
			.catch(error => console.error(error));
	}
}

//endregion

//region User
/**
 * Lade Userdaten
 */
function getUserData() {
	/*myFetch('secure/getUser', {}, "GET")
		.then(data => function (data) {
			document.querySelector("#user_username").value = data.username;
			document.querySelector("#user_password").value = data.password;
			document.querySelector("#user_name").value = data.name;
			document.querySelector("#user_anschrift").value = data.strasse;
			document.querySelector("#user_plz").value = data.plz;
			document.querySelector("#user_ort").value = data.ort;
			document.querySelector("#user_telefon").value = data.telefonnummer;
			document.querySelector("#user_email").value = data.email;
			document.querySelector("#user_geburtsdatum").value = data.geburtsdatum;
		}) // JSON from `response.json()` call
		.catch(error => console.error(error));
		*/
}

/**
 * setBackgroundColor --> Hintergrundfarbe setzen
 * @param color
 */
function setBackgroundColor(color) {
	if (color !== null)
		document.querySelector("body").style.background = color;
}

//endregion

//region Search User
/**
 * searchForUserName
 * @param search --> Suchname
 * @param element --> DOM Element auf das die Suche angewendet werden soll
 */
function searchForUserName(search, element) {
	myFetch('secure/searcUser', {"search":search}, "GET")
		.then(data => function (data) {
			$(element).typeahead({source: data});
		}) // JSON from `response.json()` call
		.catch(error => console.error(error));
}

//endregion

//region Onload
$(function () {
	$('#elementEditTimePicker').datetimepicker({
		locale: 'de',
		icons: {
			time: "fas fa-clock",
			date: "fas fa-calendar",
			up: "fas fa-arrow-up",
			down: "fas fa-arrow-down"
		},
	});

	$('#user_geburtsdatum').datetimepicker({
		locale: 'de',
		icons: {
			time: "fas fa-clock",
			date: "fas fa-calendar",
			up: "fas fa-arrow-up",
			down: "fas fa-arrow-down"
		},
		format: "DD.MM.YYYY",
	});


});


//endregion
