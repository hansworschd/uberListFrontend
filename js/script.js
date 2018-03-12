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

/**
 * Document Ready - Prüfe Login
 */
$( document ).ready(function() {
	document.querySelector("#mainContent").style.display = 'none';

	checkLogin();
});

// Set up some default data for jQuery-driven AJAX requests.
// In general, ajaxSetup() builds the options hash; but when
// it comes to data, the effect is accumulative.
$.ajaxSetup({
	data: {
		token: USERTOKEN,
	},
});

//endregion

//region login und Startseite
/**
 * Check den Login --> True: mainView, false: Login
 */
function checkLogin(){
	let username = "lukas";
	let password = "123";

	$.ajax({
		data: {username:username,password:password},
		//url: "user/login", //TODO: Change URI
		url: "demo/login.json", //TODO: Change URI
		method:"get",
		dataType: "json"
	}).fail(function(err) {
		console.log(err);
		alert( "error" );
	}).done(function(dat) {
		USERTOKEN = dat.token;
		USERNAME = dat.username;

		//Ändern der Darstellung zwischen Main (Normale Seiten) und Login (ausgeloggt)
		//Ändern der Darstellung zwischen Main (Normale Seiten) und Login (ausgeloggt)
		document.querySelector("#mainContent").style.display = 'block';
		document.querySelector("#loginContent").style.display = 'none';
		getUserData();
		getLitsts();
	});
}
//endregion


//region Liste
/**
 * Bekomme alle Listen
 */
function getLitsts() {
	$.ajax({
		url: "demo/lists.json", //TODO: Change URI
	}).fail(function(err) {
		alert( "error" );
		console.log(err)
	}).done(function(data) {
		let ul = document.querySelector("#listView-list-ul");
		ul.innerHTML = "";
		for(let i = 0; i<data.length;i++){
			ul.innerHTML += `<a href="javascript:void(0)" onclick="showElements(${data[i].id})">${data[i].name}</a> <a href="javascript:void(0)" onclick="showListDetails()"><i class="fas fa-search"></i></a></a> <br>`
		}
	});
}

function showListDetails(){
	$('#listDetailsModal').modal("toggle");
}

$('.nav-tabs a').on('shown.bs.tab', function(event){
	document.querySelector("#showElements").style.display = "none";
	document.querySelector("#showListen").style.display = "block";

});

/**
 * Neue Liste anlegen, Parameter: Titel der Liste
 * @param title
 */
function addNewList(title){
	alert("Die Liste " + title + " wird angelegt.");

	$.ajax({
		url: "demo/lists.json", //TODO: Change URI
		type: "POST",
		data: {},

	}).fail(function(err) {
		alert( "error" );
		console.log(err)
	}).done(function(data) {
		getLitsts();
	});
}
//endregion

//region Elements
/**
 * Lade elemente von einer ID
 * @param listID
 */
function showElements(listID){
	getElementsFromList(listID);
}

function getElementsFromList(listID){
	$.ajax({
		url: "demo/elements.json", //TODO: Change URI
	}).fail(function(err) {
		alert( "error" );
		console.log(err)
	}).done(function(data) {
		document.querySelector("#myCurrentList").value= listID;

		document.querySelector("#showElements").style.display = "block";
		document.querySelector("#showListen").style.display = "none";


		let ul = document.querySelector("#listElements-element-ul");
		ul.innerHTML = "";
		for(let i = 0; i<data.length;i++){
			ul.innerHTML += `<a href="javascript:void(0)" onclick="showElementDetails(${data[i].id})">${data[i].name}</a><br>`
		}
	});
}


function showElementDetails(){
	getElementDetails();

	$('#elementsDetailsModal').modal("toggle");
}

function getElementDetails(){

}

function addNewElement(element){
	let listID = document.querySelector("#myCurrentList").value;
	alert("Hier wird dann das Element" + element + " an die Liste "+listID+" angefügt");
	$.ajax({
		url: "demo/lists.json", //TODO: Change URI
		type: "POST",
		data: {list: listID, element: element},

	}).fail(function(err) {
		alert( "error" );
		console.log(err)
	}).done(function(data) {
		getLitsts();
	});
}
//endregion

//region User
/**
 * Lade Userdaten
 */
function getUserData(){
	$.ajax({
		url: "demo/user.json",
		dataType: "json"
	}).fail(function(err) {
		alert( "error" );
		console.log(err);
	}).done(function(data) {
		document.querySelector("#user_username").value = data.username;
		document.querySelector("#user_password").value=data.password;
		document.querySelector("#user_name").value=data.name;
		document.querySelector("#user_anschrift").value=data.strasse;
		document.querySelector("#user_plz").value=data.plz;
		document.querySelector("#user_ort").value=data.ort;
		document.querySelector("#user_telefon").value=data.telefonnummer;
		document.querySelector("#user_email").value=data.email;
		document.querySelector("#user_geburtsdatum").value=data.geburtsdatum;
	});
}
//endregion

//region Search User
function searchForUserName(search){
	$.ajax({
		url: "demo/user.json",
		data:{search: search},
		dataType: "json"
	}).fail(function(err) {
		alert( "error" );
		console.log(err);
	}).done(function(data) {
		//mach was
	});
}
//endregion
