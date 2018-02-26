/**
	Login von Lukas
*/
$( document ).ready(function() {
	checkLogin();
});

function loadUserView(){
	$.ajax({
		url: "userView.html",
		dataType: "text"
	}).fail(function() {
		alert( "error" );
	}).done(function(data) {
		document.querySelector("#user-div").innerHTML = data;
	});
}

function loadListView(){
	$.ajax({
		url: "listView.html",
		dataType: "text"
	}).fail(function() {
		alert( "error" );
	}).done(function(data) {
		document.querySelector("#user-div").innerHTML = data;
	});
}

function checkLogin(){
	var login = true;
	var mainContent = document.querySelector("#myMainContent");
	var html = "Bitte warten...";
	mainContent.innerHTML = html;

	if(login){
		$.ajax({
			url: "mainView.html",
			dataType: "html"
		}).fail(function() {
			alert( "error" );
		}).done(function(data) {
			mainContent.innerHTML = data;
			loadUserView();
			loadListView();
		});
	}
	else{
		$.ajax({
			url: "login.html",
			dataType: "html"
		}).fail(function() {
			alert( "error" );
		}).done(function(data) {
			mainContent.innerHTML = data;
		});
	}

}

$( "#form-login" ).submit(function( event ) {
	var elements = $( this ).serializeArray();
	//elements[0] => usernameInput
	//elements[1] => password
	if(elements[1].value === "password" && elements[0].value === "user"){
		return true; //lädt neue Seite
	}
	else{
		event.preventDefault();
		return false;
	}
});

/**
	Register von Lukas
*/
$( "#form-register" ).submit(function( event ) {
	var elements = $( this ).serializeArray();
	console.log(elements);
	alert("Registriere User ...");
  event.preventDefault();
});

/**
	Lade Listen
*/
function getLists(userToken){

}

/**
	Lade Elemente von Liste
*/
function getElementsFromList(userToken,listID){
	
}
