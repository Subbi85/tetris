"use strict";

//Beschaffen der Highscores aus der highscore.json

var jsonFile =new XMLHttpRequest();
jsonFile.onload = function(){
    let json= jsonFile.responseText;
    let jsonObj= JSON.parse(json);

    tabelleBauen(jsonObj);
}
jsonFile.onerror = function(){
    console.log("Keine Highscoreliste gefunden+-!");
}
jsonFile.open("GET", "highscore.json", true);
jsonFile.setRequestHeader("Accept","application/json");
jsonFile.send();

let tabelleBauen=(jsonObj)=>{
    //JSON Objekt sortieren
    let arrayScore=[];
    for(let i=0; i<jsonObj.ranks.length; i++){
        arrayScore.push[jsonObj.ranks[i].score];
    }

    console.log(arrayScore);

    console.log(jsonObj);

    var stats = document.querySelector("#stats");
    var table = document.createElement("table");
    // Tabellenkopfzeile
    var newRow = document.createElement("tr");
    // Frage
    var th = document.createElement("th");
    var thText = document.createTextNode("Punkte");
    th.appendChild(thText);
    newRow.appendChild(th);

    //Korrekt?
    var th = document.createElement("th");
    var thText = document.createTextNode("Name");
    th.appendChild(thText);
    newRow.appendChild(th);

   // Hier fehlt nur noch das Objekt für die richtige Antwort
    table.appendChild(newRow);
    for(var i=0; i<jsonObj.ranks.length; i++){
        var newRow = document.createElement("tr");

        var newTd = document.createElement("td");
        var textNode = document.createTextNode(jsonObj.ranks[i].score);
        newTd.appendChild(textNode);
        newRow.appendChild(newTd);

        var newTd = document.createElement("td");
        var textNode = document.createTextNode(jsonObj.ranks[i].user);

        newTd.appendChild(textNode);
        newRow.appendChild(newTd);
        
        table.appendChild(newRow);
    }
    stats.innerHTML = '';
    stats.appendChild(table);
}