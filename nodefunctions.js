"use strict";
/* Clientseitige Funktionen für NodeJS */


//Übergeben von Score und Namen an den Server

let transferDaten=(score)=>{
    let req = new Request(
        '/scoreSpeichern',
        {
            method: 'POST',
            headers: new Headers ( {'Content-Type': 'application/json'}),
            body: JSON.stringify({
                score: score,
                user: document.querySelector('#username').value,
            })
        }
    )

    fetch ( req ).then(
      data => data.json() ,
      () => console.log ( 'Fehler' )
    ).then(
        data => {
            console.log (data );
            tabelleBauen(data);
        }
    );
    console.log(score);
}
/*
userInput.onchange=()=>{
    username=userInput.value;
    console.log(username);
}
*/