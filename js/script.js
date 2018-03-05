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
 */


// region Globales und document Ready
let USERTOKEN = null;
let USERNAME = null;

//Document Ready
$( document ).ready(function() {
	checkLogin();
});

// Set up some default data for jQuery-driven AJAX requests.
// In general, ajaxSetup() builds the options hash; but when
// it comes to data, the effect is accumulative.
$.ajaxSetup({
	data: {
		token: USERTOKEN,
	},
	dataType: "jsonp"
});

//endregion

//region login und Startseite
function checkLogin(){
	let username = "lukas";
	let password = "123";

	$.ajax({
		data: {username:username,password:password},
		//url: "user/login", //TODO: Change URI
		url: "demo/login.json", //TODO: Change URI
		method:"get",
		dataType: "json"
	}).fail(function() {
		alert( "error" );
		viewLogin(false);
	}).done(function(dat) {
		USERTOKEN = dat.token;
		USERNAME = dat.username;

		if(USERTOKEN !== null){
			viewMain();
		}
		else{
			viewLogin(false);
		}
	});


}

function viewLogin(){
	$.ajax({
		url: "login.html",
		dataType: "html"
	}).fail(function() {
		alert( "error" );
	}).done(function(data) {
		document.querySelector("#myMainContent").innerHTML = data; //lädt Daten in HTML
	});
}

function viewMain() {
	$.ajax({
		url: "mainView.html", //TODO: Change URI
		dataType: "html"
	}).fail(function() {
		alert( "error" );
	}).done(function(data) {
		document.querySelector("#myMainContent").innerHTML = data;
		viewUser();
		viewAllLists();
	}).always(function() {
		document.querySelector("#myUsernameP").innerHTML= "Test";
	});
}
//endregion


//region Liste
function viewAllLists(){
	$.ajax({
		url: "listViewAll.html",
		dataType: "html"
	}).fail(function() {
		alert( "error" );
	}).done(function(data) {
		document.querySelector("#listen-div").innerHTML = data;
		getLitsts();
	});
}

function getLitsts(){
	$.ajax({
		url: "demo/lists.json", //TODO: Change URI
	}).fail(function() {
		alert( "error" );
	}).done(function(data) {
		let ul = document.querySelector("#listView-list-ul");
		ul.innerHTML = "";
		for(let i = 0; i<data.length;i++){
			ul.innerHTML += `<a href="javascript:void(0)" onclick="showListDetails(${data[i].id})">${data[i].name}</a><br>`
		}
	});
}

function addNewList(title){
	alert(title);

	console.log("Hier kommt dann ein POST");
}
//endregion

//region Elements
function getElementsFromList(listID){
	console.log("Hier stehen dann die Elemente von einer Liste");
}

function viewList(listID){
	getElementsFromList(listID);
}
//endregion

//region User
function viewUser(){
	$.ajax({
		url: "userView.html",
		dataType: "text"
	}).fail(function(err) {
		alert( "error" );
		console.log(err);
	}).done(function(data) {
		document.querySelector("#user-div").innerHTML = data;
	});
}
//endregion