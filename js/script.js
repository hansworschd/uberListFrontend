/******
 *
 * Part von Lukas E. und Vera G.
 *
 * Datum: 2018-04-05
 *
 */
// region Globales und onLoad
/**
 * Globale Variablen
 */
let USERTOKEN = null;
let URL = "http://uberlistwebapi.azurewebsites.net/";

/**
 * myFetch
 *
 * Methode für fetch von Anfragen
 *
 * @param backendMethod
 * @param data
 * @param type
 * @returns {Promise<any>}
 */
function myFetch(backendMethod, data, type) {
	let url = URL + backendMethod;

	if (data !== null && data !== undefined) {
		data = JSON.stringify(data); //Server akzeptiert nur JSON als String
	}
	else {
		data = undefined;
	}

//Eigentlicher ajx Call
	let res = $.ajax({
		url: url,
		type: type,
		async: false,
		cache: false,
		timeout: 10000,
		data: data,
		//wird für die Authentifizierung benötigt
		beforeSend: function (request) {
			request.setRequestHeader("authorization", USERTOKEN);
			request.setRequestHeader("content-type", 'application/json');
		},
		error: function (error) {
			console.log("error", error);
			new PNotify({
				text: 'Du hast nicht genügend Rechte oder es ist ein anderer Fehler aufgetreten.',
				type: 'error',
			})
			return false;
		},
		success: function (response) {
			return response;
		},
	});
	return res;
}

/**
 * Onload mit jQuery
 *
 * Initialisieren von Werten und Deaktivieren von MainContent
 */
$(function () {
	//MainContent ausblenden --> sonst sehen nicht eingeloggte User diverse Dinge; Auth jedoch auf Server und Client seite, daher recht sicher
	document.querySelector("#mainContent").style.display = 'none';

	//EInstellungen für die Datetimepicker
	$('#elementEditTimePicker').datetimepicker({
		locale: 'de',
		icons: {
			time: "fas fa-clock",
			date: "fas fa-calendar",
			up: "fas fa-arrow-up",
			down: "fas fa-arrow-down"
		},
		format: "DD.MM.YYYY",
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

	//Felder mit undefined beim clicken leeren.
	$("input, textarea").click(function(e){
		if(e.target.value === "undefined" || e.target.innerHTML === "undefined"){
			$(this).val("");
		}

	});

//EInstellungen des Colorpickers
	$('#user_backgroundcolor').colorpicker({
		format: "hex",
		useAlpha: false,
	});

//Globale Einstellungen für notify für die Darstellung von Meldungen
	PNotify.prototype.options.delay = 2000;
	//PNotify.prototype.options.addclass = "stack-bottomright";
//automatische prüfen des Logins
	login();
});
//endregion

//region Startseite, Login und Suche
/**
 * Methode zum Login
 * Check den Login --> True: mainView, false: Login
 */
function login() {
	let username = document.querySelector("#loginUsername").value;
	let password = document.querySelector("#loginPassword").value;

//Username und password lokal im Browser speichern, für späteren Login sinnvoll
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
		myFetch('authenticate', data, "POST").then(function (dat) {
			if (dat !== undefined) {

				USERTOKEN = dat.token;
				//Ändern der Darstellung zwischen Main (Normale Seiten) und Login (ausgeloggt)
				document.querySelector("#mainContent").style.display = 'block';
				document.querySelector("#loginContent").style.display = 'none';

				document.querySelector("#usernameHead").innerHTML = " von " + username;

				getUserData();
				getLitsts();
				setBackgroundColor(dat.color);
			}
			else {
				new PNotify({
					text: 'Fehler beim Login',
					type: 'danger',
				});
			}
		});
	}
}

/**
 *    Login submit
 * Wird ausgelöst wenn Login Button gedrückt wird
 */
$("#form-login").submit(function (e) {
	e.preventDefault();
	login();
});

/**
 * Register Submit
 * Methode zum Registrieren
 */
$("#form-register").submit(function (e) {
	e.preventDefault();

	let username = document.querySelector("#registerUsername").value;
	let password = document.querySelector("#registerPassword").value;
	let passwordCheck = document.querySelector("#registerPasswordCheck").value;
	let email = document.querySelector("#registerEmail").value;

//Prüfen ob Passwörter gleich sind
	if (password !== passwordCheck) {
		new PNotify({
			text: 'Die Passwörter stimmen nicht überein.',
			type: 'danger'
		});
	}
	else {
		let sendData = {
			username: username,
			password: password,
			email: email,
		};
		myFetch('register', sendData, "POST")
			.then(function (dat) {
				new PNotify({
					text: 'Der Benutzer wurde angelegt und eingeloggt.',
					type: 'success'
				});
			})
			.then(function () {
				localStorage.setItem("uberListUsername", username);
				localStorage.setItem("uberListPassword", password);
				login();
			}
		);
	}
});

/**
 * Logout von user
 */
function logout() {
	myFetch('authenticate', null, "DELETE")
		.then(function () {
			document.querySelector("#mainContent").style.display = 'none';
			document.querySelector("#loginContent").style.display = 'block';
		});

//Localen Speicher leeren bei Logout
	localStorage.setItem("uberListUsername", "");
	localStorage.setItem("uberListPassword", "");
}

/**
 * searchForUserName
 * @param search --> Suchname
 * @param element --> DOM Element auf das die Suche angewendet werden soll
 */
function searchForUserName(search, element) {
//erst suchen wenn Begriff > 2 Wörter
	if (search.length > 2) {
		element.classList.add("loading");
		myFetch('secure/user/search/' + search, null, "GET")
			.then(function (data) {
				//Autocomplete mit Search Daten füllen
				let source = data.data;

				let typeahead = $(element).typeahead({
					updater:function (item) {

						if(element.id !== "elementEditUserSearch"){
							//Für Suche nach User in Liste
							addMemberToList(element,item);
						}
						else{
							//für die Suche im Element
							return item;
						}
    			}
				});
				//Suchdaten müssen sepparat eingegeben werden, da sie sonst nicht aktualisiert werden.
				$(element).data('typeahead').source = source;
			});
		element.classList.remove("loading");
	}
}

//endregion

//region Listen
/**
 * Bekomme alle Listen
 */
function getLitsts() {
	myFetch('secure/list', null, "GET")
		.then(function (data) {
			let lists = data.lists;
			let ul = document.querySelector("#listView-list-ul");
			ul.innerHTML = "";
			//Aufbauen der Listen
			for (let i = 0; i < lists.length; i++) {
				ul.innerHTML += `<li> <a href="javascript:void(0)" onclick="showListDetails('${lists[i]._id}')"><i class="fas fa-pencil-alt"></i></a> <a href="javascript:void(0)" onclick="getElementsFromList('${lists[i]._id}','${lists[i].title}')">${lists[i].title}</a></li>`
			}
		});
}

/**
 * showListDetails
 *
 * Details über eine Liste mit der ID xxx
 *
 * @param id
 */
function showListDetails(id) {
	myFetch('secure/list/' + id, null, "GET")
		.then(function (data) {
			let list = data.list;
			document.querySelector("#listEditID").value = list._id;
			document.querySelector("#listEditName").value = list.title;
			document.querySelector("#listEditFreetext").value = list.description;

			loadListMemberShip(list._id);
			$('#listDetailsModal').modal("toggle");
		});
//Details Modal öffnen
}

/**
 * Details zu den List-Members wegen geteilter Listen
 * @param id
 */
function loadListMemberShip(id) {
	myFetch('secure/list_membership/' + id, null, "GET")
		.then(function (data) {
			let members = data.membership;
			let memberList = "";
			if(members.length === 0){
					memberList = "Leider keine anderen Benutzer gefunden..";
			}
			for (let i = 0; i < members.length; i++) {
				memberList += `<p>${members[i].user} <a href="javascript:void(0)" onclick='deleteListMemberShip("${members[i].user}")'><i class='fas fa-trash'></i></a></p>`;
			}
			document.querySelector("#listEditMembers").innerHTML = memberList;
		});
}

/**
 * Member zu Liste hinzufügen
 *    @param username
 */
function addMemberToList(element,username) {
	let id = document.querySelector("#listEditID").value;
	myFetch('secure/list_membership/', {username: username, listId: id}, "POST")
		.then(function () {
			element.value = "";
			loadListMemberShip(id);
		});
}

/**
 * Member von Liste entfernen
 * @param username
 * @param id --> ID der Liste von die der User entfernt werden soll
 */
function deleteListMemberShip(userName) {
	let listId = document.querySelector("#listEditID").value;
	myFetch('secure/list_membership/' + listId, null, "GET")
		.then(function (data) {
			let membership = data.membership;
			let userPos = -1;
			for (let i = 0; i < membership.length; i++) {
				if (membership[i].user === userName) {
					userPos = i;
					break;
				}
			}

			myFetch('secure/list_membership/' + membership[userPos]._id, null, "DELETE")
				.then(function () {
					new PNotify({
						text: 'Der User wurde von der Liste entfernt.',
						type: 'warning'
					});
					loadListMemberShip(listId);
				});
		});


}

/**
 * Methode zum Ändern der Tab Darstellung je nachdem ob Liste oder Elemente angezeigt werden sollen
 */
$('.nav-tabs a').on('shown.bs.tab', function () {
	document.querySelector("#showElements").style.display = "none";
	document.querySelector("#showListen").style.display = "block";
});

/**
 * Methode zum anzeigen der Liste anstatt element - wird für zurück benötigt.
 */
function showLists() {
	document.querySelector("#showElements").style.display = "none";
	document.querySelector("#showListen").style.display = "block";
}

/**
 * Liste Updaten
 * Wird beim Clicken des Buttons im Modal aufgerufen
 */
function updateList() {
	let id = document.querySelector("#listEditID").value;
	let data = {
		title: document.querySelector("#listEditName").value,
		description: document.querySelector("#listEditFreetext").value,
	};

	myFetch('secure/list/' + id, data, "PATCH")
		.then(function (data) {
			new PNotify({
				text: 'Die Liste wurde aktualisiert.',
				type: 'success'
			});
		})
		.then($('#listDetailsModal').modal("toggle"))
		.then(getLitsts());
}

/**
 * Löschen eine Liste
 * Wird beim Delete Button im Modal aufgerufen
 */
function deleteList() {
	let id = document.querySelector("#listEditID").value;

	new PNotify({
		title: 'Liste löschen?',
		text: 'Soll die Liste wirklich gelöscht werden?',
		icon: 'far fa-question-circle',
		hide: false,
		confirm: {
			confirm: true
		},
		buttons: {
			closer: false,
			sticker: false
		},
		history: {
			history: false
		}
	}).get().on('pnotify.confirm', function() {
		myFetch('secure/list/' + id, null, "DELETE")
			.then($('#listDetailsModal').modal("hide"))
			.then(
				new PNotify({
					text: 'Die Liste wurde gelöscht.',
					type: 'warning'
				})
			).then(getLitsts());
	});
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
			.then(function (data) {
				getLitsts();
				element.value = "";
			}) // JSON from `response.json()` call
			.catch(error => console.error(error));
	}
}

//endregion

//region Element / Entry

/**
 * Elemente von einer Liste mit ID xxx
 * @param listID
 */
function getElementsFromList(listID, listName = null) {
/*	myFetch('secure/list/' + listID, null, "GET")
		.then(function (data) {
			let list = data.list;

			loadListMemberShip(list._id);
		});
*/
	//Namen einmal übergeben, sonst Null
	//Listendetails nur von Owner, nicht von Usern einsehbar die nur geteilten Zugriff haben.
	if(listName != null){
		document.querySelector("#listNameHeading").innerHTML = listName;
	}

	myFetch('secure/list_entry/getall/' + listID, null, "GET")
		.then(function (data) {

			document.querySelector("#myCurrentList").value = listID;

			document.querySelector("#showElements").style.display = "block";
			document.querySelector("#showListen").style.display = "none";


			let ul = document.querySelector("#listElements-element-ul");
			ul.innerHTML = "<br>";

			let ulDone = document.querySelector("#listElementsDone-element-ul");
			ulDone.innerHTML = "";

			let entries = data['listEntries'];

			let bgColorCount = 0; //wird benötigt um Hintergrund korrekt darzustellen
			for (let i = 0; i < entries.length; i++) {
				let dat = entries[i];

				if (dat.isDone === true) {
					ulDone.innerHTML += `<li class="listElementOld">${dat.title}</li>`;

				}
				else {
					bgColorCount++
					let bgClass = null;
					if (bgColorCount % 2 === 0) {
						bgClass = "liBgColor";
					}

					ul.innerHTML += `<li class="${bgClass}"> <a href="javascript:void(0)" onclick="checkElement('${dat._id}')"><i class="far fa-square" id="checkElementSquare_${dat._id}"></i></a> <a href="javascript:void(0)" onclick="getElementDetails('${dat._id}')"><i class="fas fa-pencil-alt"></i></a> ${dat.title}</li>`

				}

			}
		}) // JSON from `response.json()` call
		.catch(error => console.error(error));
}


/**
 * Details von einem Element
 */
function getElementDetails(id) {
	myFetch('secure/list_entry/' + id, null, "GET")
		.then(function (data) {
			let element = data;

			document.querySelector("#elementEditName").value = element.title;
			document.querySelector("#elementEditOrt").value = element.place;
			document.querySelector("#elementEditTimePicker").value = moment(element.deadline).format("DD.MM.YYYY");
			document.querySelector("#elementEditFreetext").value = element.description;
			document.querySelector("#elementEditID").value = element._id;

			//checken ob assignTo nicht gesetzt ist, da sonst ein Fehler auftritt!
			if(element.assignTo !== undefined && element.assignTo !== null){
				document.querySelector("#elementEditUserSearch").value = element.assignTo.username;
			}


//Details anzeigen in Modal
			$('#elementsDetailsModal').modal("toggle");
		});
}

/**
 * Element abhacken
 * @param id
 */
function checkElement(id) {
	let element = document.querySelector("#checkElementSquare_" + id);

	if (element.classList.contains("fa-check-square")) {
		myFetch('secure/list_entry/check/' + id, {isDone: false}, "POST");
		element.className = "far fa-square";
	}
	else {
		myFetch('secure/list_entry/check/' + id, {isDone: true}, "POST");
		element.className = "far fa-check-square";
	}

//Überlegen ob anders besser?
//reload, durchstreichen??

}

/**
 * Delete Element mit id xxx
 * @param id
 */
function deleteElement() {
	let listID = document.querySelector("#myCurrentList").value;
	let id = document.querySelector("#elementEditID").value;

	myFetch('secure/list_entry/' + id, null, "DELETE")
		.then(function () {
			new PNotify({
				text: 'Das Element wurde gelöscht',
				type: 'warning'
			});
			$('#elementsDetailsModal').modal("toggle");
			getElementsFromList(listID);
		});
}

/**
 * Update Element mit id XXX
 * @param id
 */
function updateElement() {
	let listID = document.querySelector("#myCurrentList").value;
	let id = document.querySelector("#elementEditID").value;

	let assignTo = null;
	if(document.querySelector("#elementEditUserSearch").value !== ""){
		assignTo = document.querySelector("#elementEditUserSearch").value;
	}

	let data = {
		title: document.querySelector("#elementEditName").value,
		deadline: moment(document.querySelector("#elementEditTimePicker").value, "DD.MM.YYYY").toJSON(),
		place: document.querySelector("#elementEditOrt").value,
		description: document.querySelector("#elementEditFreetext").value,
		assignTo: assignTo,
	};

	myFetch('secure/list_entry/' + id, data, "PATCH")
		.then(function (data) {
			new PNotify({
				text: 'Das Element wurde aktualisiert.',
				type: 'success'
			});
			$('#elementsDetailsModal').modal("toggle");
			getElementsFromList(listID);
		});
}

/**
 * Neues Element anlegen
 * @param element
 */
function addNewElement(element) {
	let text = element.value;

	if (text.length > 2) {
		let listID = document.querySelector("#myCurrentList").value;

		let post = {
			"listId": listID,
			"title": text
		};

		myFetch('secure/list_entry', post, "POST")
			.then(function (data) {
				getElementsFromList(listID);
				element.value = "";
			});
	}
}

//endregion
//region User
/**
 * Lade Userdaten
 */
function getUserData() {
	myFetch('secure/user', null, "GET")
		.then(function (data) {
			let user = data.user;

			document.querySelector("#user_username").value = user.username;
			document.querySelector("#user_name").value = user.name;
			document.querySelector("#user_anschrift").value = user.strasse;
			document.querySelector("#user_plz").value = user.plz;
			document.querySelector("#user_ort").value = user.ort;
			document.querySelector("#user_email").value = user.email;
			document.querySelector("#user_backgroundcolor").value = user.color;
			document.querySelector("#user_geburtsdatum").value = moment(user.gebDate).format("DD.MM.YYYY");

			setBackgroundColor(user.color);
		});
}

$("#form-user-data").submit(function (e) {
	e.preventDefault();

	let update = {
		"name": document.querySelector("#user_name").value,
		"strasse": document.querySelector("#user_anschrift").value,
		"plz": document.querySelector("#user_plz").value,
		"ort": document.querySelector("#user_ort").value,
		"email": document.querySelector("#user_email").value,
		"color": document.querySelector("#user_backgroundcolor").value,
		"gebDate": moment(document.querySelector("#user_geburtsdatum").value, "DD.MM.YYYY").toJSON(), //da Backend einen JSON Datumsobject benötigt
	};

	let password = document.querySelector("#user_password").value;
	let password_check = document.querySelector("#user_password_check").value;


	if (password !== "") {
		update.password = password;
	}

	if (password_check === password) {
		myFetch('secure/user', update, "POST")
			.then(function (data) {
				new PNotify({
					text: 'Die geänderten Daten wurden gespeichert',
					type: 'success'
				});
				getUserData();
			});
	}
	else {
		new PNotify({
			text: 'Die Passwörter stimmen nicht überein.',
			type: 'warning'
		});
	}
});


/**
 * setBackgroundColor --> Hintergrundfarbe setzen
 * @param color
 */
function setBackgroundColor(color) {
	if (color !== null && color !== undefined)
		document.querySelector("body").style.background = color;
}

//endregion
