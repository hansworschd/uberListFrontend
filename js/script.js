/**
	Login von Lukas
*/
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
