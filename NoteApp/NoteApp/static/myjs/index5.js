let id_user = 0;
let username = "";
let email = "";
let url_notes = "http://lazaronotesapp.pythonanywhere.com/notes/api/"
let url_user = "http://lazaronotesapp.pythonanywhere.com/api/authentication/user/"
let token = document.getElementById("token").value;
let lastNoteId;
let allNotes; 

//temporal info of eiting note
let temporalTitle;
let temporalContent;
let temporalId;
let temporalEditLink;

//get User info
getUser();
function getUser() {
  fetch(url_user)
    .then((response) => response.json())
    .then((data) => infoUser(data));
}
//show all the data of the user. All this on the model modalInfoUser
function infoUser(data) {
  if (data.username != undefined) { //if the user is authenticated 
    id_user = data.pk;
    username = data.username;
    email = data.email;

    let a = document.getElementById("showUsername");
    let e = document.createTextNode(username);
    a.appendChild(e);

    //username
    let labelUsername = document.getElementById("username");
    let contentUsername = document.createTextNode(username);
    labelUsername.appendChild(contentUsername);

    //email
    let labelEmail = document.getElementById("email");
    let contentEmail = document.createTextNode(email);
    labelEmail.appendChild(contentEmail);

    //phone

    //picture profile
  }
}

//get all notes
fetch(url_notes)
.then((response) => generateTable(response)
);
//call the function that will generate all the notes
function generateTable(response) {
  if (response.status == 200) {
    response.json()
    .then((data) => showAllNotes(data));
  }else{
    response.json()
    .then((data) => showMessageNoNotes(data));
  }
}
//show a message when the user is not authenticate
function showMessageNoNotes(data) {
  let mainDiv = document.getElementById("notes")
  let div = document.createElement("div")
  div.setAttribute("id","messageNoAuthenticated")
  div.setAttribute("class","container")

  let p = document.createElement("p")
  p.setAttribute("id","messageLogin")
  
  let loginLink = document.createElement("a")
  loginLink.setAttribute("href", "#loginModal");
  loginLink.setAttribute("data-toggle", "modal");
  let registerLink = document.createElement("a")
  loginLink.setAttribute("id","loginLink")
  registerLink.setAttribute("id","registerLink")
  registerLink.setAttribute("href","#registerModal")
  registerLink.setAttribute("data-toggle", "modal");
  let textLinkLogin = document.createTextNode("Login")
  let textLinkRegister = document.createTextNode("Register")
  loginLink.appendChild(textLinkLogin)
  registerLink.appendChild(textLinkRegister)
  

  let message = document.createTextNode("Debes hacer login para ver tus notas")
  p.appendChild(message)
  div.appendChild(p)
  div.appendChild(loginLink)
  div.appendChild(registerLink)
  mainDiv.appendChild(div) 
}
//generate cards that contains the notes
function showAllNotes(data) {
  notes = data["notes"];
  allNotes = data["notes"]
  console.log(notes);
  // get the reference for the div that contain all the notes
  let mainDiv = document.getElementById("notes")

  // creating all notes
  for (let i = 0; i < notes.length; i++) {
    var nota = notes[i];
    lastNoteId = nota.id;

    //card
    let divCard = document.createElement("div");
    divCard.setAttribute("class", "card align-middle")
    divCard.setAttribute("id",nota.id);
    
    //card body
    let divCardBody = document.createElement("div");
    divCardBody.setAttribute("class", "card-body")

    //card title
    let cardTitle = document.createElement("h5")
    cardTitle.setAttribute("class","card-title")
    cardTitle.setAttribute("id",("cardTitle"+nota.id))
    let titulo = document.createTextNode(nota.title)
    cardTitle.appendChild(titulo)

    //card text
    let cardText = document.createElement("p")
    cardText.setAttribute("class","card-text")
    cardText.setAttribute("id",("cardText"+nota.id))
    if (document.createTextNode(nota.note).length >= 100){
      var text = document.createTextNode(nota.note.substring(0,100) + "...")
    }
    else{
      var text = document.createTextNode(nota.note)
    }
    cardText.appendChild(text)

    //card foother
    let cardFoother = document.createElement("div")
    cardFoother.setAttribute("class","card-foother")
    cardFoother.setAttribute("id","cardFoother")
    
    //link to open a modal that contain all the info of the note
    let linkId = document.createElement("a")
    linkId.setAttribute("href","#editNoteModal")
    linkId.setAttribute("id","linkId")
    linkId.setAttribute("data-toggle","modal")

    //create a hidden span inside of the link. Contain the id of the note 
    let span = document.createElement("span")
    span.style.display = "none";
    let contentSpan = document.createTextNode(nota.id)
    span.appendChild(contentSpan)
    let contentLink = document.createTextNode("Editar")

    linkId.appendChild(contentLink)
    linkId.appendChild(span)

    //create a <p> that contains the last time that the note was updated
    let foother = document.createElement("p")
    foother.setAttribute("id",("foother"+nota.id))
    foother.setAttribute("class","foother")
    let date = document.createTextNode(nota.updated.substring(0,10)) //limit the date to show only the year-month-day 
    foother.appendChild(date)
    cardFoother.appendChild(linkId)
    cardFoother.appendChild(foother)

    divCardBody.appendChild(cardTitle)
    divCardBody.appendChild(cardText)
    divCard.appendChild(divCardBody)
    divCard.appendChild(cardFoother)
    mainDiv.appendChild(divCard)
  }
}  

//catching when pressed the edit button of the card
document.body.addEventListener('click', function (event) {
  if(event.target.id == "linkId") {
     editNote(event.target)
  }
});

function editNote(target){
  let editTitle = document.getElementById("editTitle")
  let editContent = document.getElementById("editContent")
  let editId = document.getElementById("contentId")
  let id;
  temporalEditLink = target;

  //cojo el id del inner text de el link de editar la carta
  if((target.innerHTML).length === 44){
     id = (target.innerHTML).substring(35,37)
  }
  else if((target.innerHTML).length == 45){
     id = (target.innerHTML).substring(35,38)
  }
  else if((target.innerHTML).length == 46){
     id = (target.innerHTML).substring(35,39)
  }
  else if((target.innerHTML).length == 47){
    id = (target.innerHTML).substring(35,40)
 }
  editId.value = id

  let title;
  let content;
  
  for (let i = 0; i < allNotes.length; i++){
    nota = allNotes[i]
    if (nota.id == id){
      title = nota.title
      content = nota.note
    }
  }
  editTitle.value = title
  editContent.innerText = content
    
}
 
//sending the content of the create note form
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("createNota").addEventListener("click", function () {
    let titulo = document.getElementById("notaTitle").value;
    let content = document
      .getElementById("divContent")
      .innerText.replace("<", "");

    fetch("http://lazaronotesapp.pythonanywhere.com/notes/api/", {
      method: "POST",
      headers: {
        "X-CSRFToken": token.substring(55, 119),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: titulo,
        note: content,
        user: id_user,
      }),
    }).then((x) => addNewNote(x.status, titulo, content));
  });
});

//add new Note
function addNewNote(status, titulo, content) {
  if (status == 201) {
    let fecha = new Date();
    let title = document.createTextNode(titulo);
    let note = document.createTextNode(content);
    let updated = document.createTextNode(
      fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate()
    );
    let id = lastNoteId + 1

    allNotes.push({
      "id":id,
      "title":titulo,
      "note":content
    })

    let divCard = document.createElement("div");
    divCard.setAttribute("class", "card align-middle")
    divCard.setAttribute("id",id)

    let divCardBody = document.createElement("div");
    divCardBody.setAttribute("class", "card-body")
    divCardBody.setAttribute("id",("divCardBody" + id))

    let cardTitle = document.createElement("h5")
    cardTitle.setAttribute("class","card-title")
    cardTitle.setAttribute("id",("cardTitle"+id))
    cardTitle.appendChild(title)

    let cardText = document.createElement("p")
    cardText.setAttribute("class","card-text")
    cardText.setAttribute("id",("cardText"+id))
    if (note.length >= 100){
      var text = note.substring(0,100) + "..."
    }
    else{
      var text = note
    }
    cardText.appendChild(text)

    let cardFoother = document.createElement("div")
    cardFoother.setAttribute("class","card-foother")
    cardFoother.setAttribute("id",("cardFoother"+id))
    let linkId = document.createElement("a")
    linkId.setAttribute("href","#editNoteModal")
    linkId.setAttribute("id","linkId")
    linkId.setAttribute("data-toggle","modal")
    let span = document.createElement("span")
    span.style.display = "none";
    let contentSpan = document.createTextNode(id)
    span.appendChild(contentSpan)
    let contentLink = document.createTextNode("Editar")
    linkId.appendChild(contentLink)
    linkId.appendChild(span)
    let foother = document.createElement("p")
    foother.setAttribute("id",("foother"+id))
    foother.setAttribute("class","foother")
    foother.appendChild(updated)
    cardFoother.appendChild(linkId)
    cardFoother.appendChild(foother)

    divCardBody.appendChild(cardTitle)
    divCardBody.appendChild(cardText)
    divCard.appendChild(divCardBody)
    divCard.appendChild(cardFoother)
    let mainDiv = document.getElementById("notes")
    mainDiv.appendChild(divCard)

  } else {
    alert("Error al crear la nota");
  }
}
//editing a note
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("editNota").addEventListener("click", function () {
    let id = document.getElementById("contentId").value
    let titulo = document.getElementById("editTitle").value;
    let content = document
      .getElementById("editContent")
      .innerText.replace("<", "");

      temporalId = id 
      temporalTitle = titulo
      temporalContent = content
    fetch(("http://lazaronotesapp.pythonanywhere.com/notes/api/"+id+"/").replace(" ",""), {
      method: "PUT",
      headers: {
        "X-CSRFToken": token.substring(55, 119),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: titulo,
        note: content,
        user: id_user,
      }),
    }).then((x) => editNewNote(x.status));
  });
});

//edit note
function editNewNote(status) {
  if (status == 200) {
    //info actual de la carta
    let fecha = new Date()
    let updated = (
      fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate()
    );
    let linkId = temporalEditLink
      console.log(temporalId)
    //card format-----------------------------------------------------------------------------------------------
    let title =document.getElementById(("cardTitle"+temporalId))
    title.innerText = temporalTitle

    let content = document.getElementById("cardText"+temporalId)
    content.innerText = temporalContent

    let update = document.getElementById("foother"+temporalId)
    update.innerText = updated

    for (let i = 0; i < allNotes.length; i++){
      nota = allNotes[i]
      if (nota.id == temporalId){
        nota.title = temporalTitle 
        nota.note = temporalContent
      }
    }
    //----------------------------------------------------------------------------------------------------------

  } else {
    alert("Error al crear la nota");
  }
}
//delete a note 
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("deleteNota").addEventListener("click", function () {
    let id = document.getElementById("contentId").value

    fetch(("http://lazaronotesapp.pythonanywhere.com/notes/api/"+id+"/").replace(" ",""), {
      method: "DELETE",
      headers: {
        "X-CSRFToken": token.substring(55, 119),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        
      }),
    }).then((x) => deleteNote(x.status, id));
  });
});
//delete note
function deleteNote(status, id){
  if(status == 200){
    let card = document.getElementById(id)
    card.remove();
    for (let i = 0; i < allNotes.length; i++){
      nota = allNotes[i]
      if (nota.id == id){
        allNotes.splice(i,1)
      }
    }
    console.log(allNotes)

  }else{
    alert("Error al borrar la nota")
  }
}
//hacer login 
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("sendLogin").addEventListener("click", function () {
    let username = document.getElementById("loginUsername").value;
    let password = document.getElementById("loginPassword").value;
    console.log(username, password);
    if (username === "" || password === "") {
      alert("Debes llenar todos los campos");
    } else {
      fetch("http://lazaronotesapp.pythonanywhere.com/api/authentication/login/", {
        method: "POST",
        headers: {
          "X-CSRFToken": token.substring(55, 119),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }).then((x) => correct(x));
    }
  });
});

//registrarce 
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("sendRegister").addEventListener("click", function () {
    let username = document.getElementById("registerUsername").value;
    let email = document.getElementById("registerEmail").value;
    let password = document.getElementById("registerPassword").value;
    let confirmPassword = document.getElementById("confirmRegisterPassword").value;

    if (username === "" || password === "" || confirmPassword === ""){
      alert("Debes llenar todos los campos");
    }
    else if(email.indexOf("@") == -1 && email.length > 0){
      alert("The email address is note correct")
    }
    else if(password != confirmPassword){
      alert("The passwords do not match")
    }
    else if(password.length < 8){
      alert("The password is too short")
    }
    else {
      console.log(username, email, password, confirmPassword)
      fetch("http://lazaronotesapp.pythonanywhere.com/api/authentication/register/", {
        method: "POST",
        headers: {
          "X-CSRFToken": token.substring(55, 119),
          "Content-Type": "application/json",
          "Vary": "Accept"
        },
        body: JSON.stringify({
          "username": username,
          "email": email,
          "password1": password,
          "password2": confirmPassword,
        }),
      }).then((x) => correct(x));
    }
  });
});

function correct(x) {
  if (x.status == 200 || x.status == 201) {
    window.location.reload();
  }else{
    alert("Error al autenticarce")
  }
}
//hacer logout 
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("logout").addEventListener("click", function () {
      fetch("http://lazaronotesapp.pythonanywhere.com/api/authentication/logout/", {
        method: "POST",
        headers: {
          "X-CSRFToken": token.substring(55, 119),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        }),
      }).then((x) => correct(x));
})})   
