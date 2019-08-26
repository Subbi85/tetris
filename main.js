"use strict";
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
let scoreDisplay = document.getElementById("score");
let userInput= document.getElementById("username");
let username;
//##################################################################
/*  Jeder Block besteht aus einer Matix 3x3
    Die Positionen, die gezeichnet werden sollen    ->1
    Nicht gezeichnete Positionen                    ->0 */
const zeilen = 15;
const spalten = 10;
const kantenlaenge=40;
const frei="#fff";
const besetzt ="gray";
let gameOver=false;
let score=0;
let jetzt = Date.now();
scoreDisplay.innerHTML=score;

/* Figuren in Ihren verschiedenen States */
const Lulatsch = [
	[
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	],
	[
		[0, 0, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 1, 0],
	],
	[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
	],
	[
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
	]
];

const J = [
	[
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 1],
		[0, 1, 0],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 0, 1]
	],
	[
		[0, 1, 0],
		[0, 1, 0],
		[1, 1, 0]
	]
];

const L = [
	[
		[0, 0, 1],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 1]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[1, 0, 0]
	],
	[
		[1, 1, 0],
		[0, 1, 0],
		[0, 1, 0]
	]
];

const Cube = [
	[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0],
	]
];

const S = [
	[
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0]
	],
	[
		[0, 1, 0],
		[0, 1, 1],
		[0, 0, 1]
	],
	[
		[0, 0, 0],
		[0, 1, 1],
		[1, 1, 0]
	],
	[
		[1, 0, 0],
		[1, 1, 0],
		[0, 1, 0]
	]
];

const Dreieck = [
	[
		[0, 1, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 0],
		[0, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 1, 0],
		[1, 1, 0],
		[0, 1, 0]
	]
];

const Z = [
	[
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 0, 1],
		[0, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 0],
		[0, 1, 1]
	],
	[
		[0, 1, 0],
		[1, 1, 0],
		[1, 0, 0]
	]
];
//Alle Figuren in einem Array
const figuren = [
    [Cube,"blue"],
    [Dreieck,"yellow"],
    [J,"orange"],
    [L,"purple"],
    [S,"green"],
    [Z,"red"],
    [Lulatsch,"cyan"],  
];

// Zeichne ein Feld
let zeichneFeld=(x,y,color)=>{
    ctx.fillStyle = color; 
    ctx.fillRect (x*kantenlaenge, y*kantenlaenge, kantenlaenge, kantenlaenge);  
    ctx.strokeStyle="#111";
    ctx.strokeRect(x*kantenlaenge, y*kantenlaenge, kantenlaenge, kantenlaenge); 
}

/*Spielfeld:
Besteht aus 15 Reihen à 10 Felder/Spalten => 150 Felder */
let spielfeld=[];       // Array für das Spielfeld
for(let z=0; z<zeilen;z++){     
    spielfeld[z]= [];    //Leeres Array für jede Zeile
    for(let s=0; s<spalten; s++){
        spielfeld[z][s]= frei;
    }
}

let zeichneSpielfeld=()=>{
    for(let z=0; z<zeilen;z++){
        for(let s=0; s<spalten; s++){
            if(spielfeld[z][s] == "#111"){
            zeichneFeld(s,z,besetzt);
            }else{
            zeichneFeld(s,z,frei);
            }
        }
    }    
}
zeichneSpielfeld();

// Das Figur-Objekt (aktuelles Objekt)
function Figur(figur,color){
    this.figur = figur;     //Zeile aus dem Array
    this.color = color;   
    this.figurMatrix=0; //Wir fangen immer mit der Grundform an!
    this.aktiveFigur= this.figur[this.figurMatrix];
    // Startpunkt der Figur auf dem Spielfeld
    this.x = 3;
    this.y = -1;
}

//Funktion zum erzeugen eines zufälligen neuen Objekts
let zufallsFigur=()=>{
    let zufall =  Math.floor(Math.random()*figuren.length);
    return new Figur(figuren[zufall][0], figuren[zufall][1]);
}
    let f = zufallsFigur();


/*  Da ALLE weiteren Funktionalitäten vom Objekt abhängen, bauen wir 
    uns Methoden per prototyping. */
//  Zeichnen der aktuellen Figur im Spiel
Figur.prototype.zeichnen=function(){
    for(let i=0;i<this.aktiveFigur.length;i++){
        for(let j=0; j<this.aktiveFigur[i].length;j++){
            if(this.aktiveFigur[i][j]!=0){
                zeichneFeld(this.x+j,this.y+i,this.color);
            }
        }
    }
}

//Löscht die gezeichnete Figur
Figur.prototype.loeschen=function(){
    for(let i=0;i<this.aktiveFigur.length;i++){
        for(let j=0; j<this.aktiveFigur[i].length;j++){
            if(this.aktiveFigur[i][j]!=0){
                zeichneFeld(this.x+j,this.y+i,"#fff");
            }
        }
    }
}

//Bewegungsmethoden
/*Grundsätzlich war die Idee, die Figuren per Intervall fallen zu lassen,
allerdings erwies sich das Händeln von verschiedensten Intervallaufrufen und 
-abbrüchen als relativ kompliziert.
Im Netz bin ich dann auf die Idee gestoßen, mit Date.now() und der Differenz zu 
arbeiten */
let startPunkt = Date.now();
let fallenlassen=()=>{
    jetzt = Date.now();
    let diff = jetzt-startPunkt;
    if(diff>1000){
        startPunkt = Date.now();
        f.bewegeRunter();
        startPunkt=Date.now();
    }
    if( !gameOver){
        requestAnimationFrame(fallenlassen);
    }
}

//
Figur.prototype.kollisionsKontrolle=function(dx,dy,figur){
    for(let i=0;i<figur.length;i++){
        for(let j=0; j<figur[i].length;j++){

            //Leere Felder werden ignoriert
            if(!figur[i][j]){
                continue;
            }
            //Nächste Position
            let neuPosX = this.x+j+dx;
            let neuPosY = this.y+i+dy;
            //console.log ( )
            if(neuPosY>=zeilen || neuPosX>=spalten || neuPosX <0){
                return true;
            }
            if (spielfeld[neuPosY][neuPosX]== '#111'){
                return true;
            }
        }
    }
    return false;
}

//Bewegungsfunktionen Rauf, Runter, Links, Rechts
Figur.prototype.bewegeRunter=function(){
    jetzt = Date.now();
    if(!this.kollisionsKontrolle(0,1,this.aktiveFigur)){
        this.loeschen();
        this.y++;   //Nach Unten
        this.zeichnen();
    }else{
        this.ablegen();
        f=zufallsFigur();
    }
}

Figur.prototype.bewegeNachRechts=function(){
    jetzt = Date.now();
    if(!this.kollisionsKontrolle(1,0,this.aktiveFigur)){
        this.loeschen();
        this.x++; //Nach Rechts
        this.zeichnen();
    }
}

Figur.prototype.bewegeNachLinks=function(){
    jetzt = Date.now();
    if(!this.kollisionsKontrolle(-1,0,this.aktiveFigur)){
        this.loeschen();
        this.x--; //Nach Links
        this.zeichnen();
    }
}

//Figur ablegen indem das Spielfeld eingefärbt wird
Figur.prototype.ablegen=function(){
    for(let i=0;i<this.aktiveFigur.length;i++){
        for(let j=0; j<this.aktiveFigur[i].length;j++){
           //Die freien Felder
            if(!this.aktiveFigur[i][j]){
                continue;
            }
            //Spielende
            if(this.y+i<0){
                //Beende den Frame
                gameOver=true;
                alert("Game Over");

                break;
            }
            if(this.aktiveFigur[i][j]==1){
                spielfeld[this.y+i][this.x+j]="#111";
            }
        }
    }
    if(!gameOver){
        score+=10;
    }
    scoreDisplay.innerHTML=score;
    kompletteReihe();  
    zeichneSpielfeld();
}

let canvasClearen=()=>{
    for(let z=0; z<zeilen;z++){
        for(let s=0; s<spalten; s++){
            if(spielfeld[z][s] == "#111"){
            zeichneFeld(s,z,besetzt);
            }else{
            zeichneFeld(s,z,frei);
            }
        }
    }    
}

//Prüfung auf eine komplette Reihe
let kompletteReihe=()=>{
    let counter=0;
    let array=[];
    let reiheVoll=false;
    //Prüfen der Reihe ob alle Felder belegt sind oder nicht
    for (let zeile=14; zeile>0;zeile--){
        counter=0;
        for(let i=0; i<10; i++){
            if(spielfeld[zeile][i]=="#111"){
                counter++;
            }
        }
        if(counter==10){    //Aufbau Array mit vollen Reihen
            reiheVoll=true;
            array.push(zeile);
        }
    }
    //Befüllen mit leerem Array
    for(let zeile=0; zeile<array.length; zeile++){
        spielfeld[array[zeile]]=[];
    }

    let laenge= array.length;   //Anzahl der zu verschiebenden Spalten
    let ersteZeile= array[laenge-1]; //Erste zu verschiebende Zeile

    for (let zeilen=ersteZeile-1; zeilen>=0; zeilen--){
        //Zeilen um den versatz nach unten verschieben
        spielfeld[zeilen+laenge]=spielfeld[zeilen];
        spielfeld[zeilen]=[];   //Löschen der kopierten Zeile
    }

    //Ausgabe und Zurücksetzen
    score += (100*laenge);
    scoreDisplay.innerHTML=score;
    array=[];//Vorbereitung für den nächsten Aufruf
}

//Figuren manipulieren / drehen
/*Es soll im Uhrzeigersinn gedreht werden 
Erfolgt durch Auswahl der nächsten Matrix
*/
Figur.prototype.drehen=function(){
    this.loeschen();
    this.figurMatrix = (this.figurMatrix + 1)%this.figur.length; // (0+1)%4 => 1
    this.aktiveFigur = this.figur[this.figurMatrix];
    this.zeichnen();
}

//Bringen wir Bewegung ins Spiel
//Knöpfe drücken anzeigen
document.addEventListener("keydown",CONTROL);
let rauf = document.querySelector("#grid1");
let rechts = document.querySelector("#grid2");
let links = document.querySelector("#grid3");
let runter = document.querySelector("#grid5");
let buttonA =document.querySelector("#buttonA");

function CONTROL(event){
    //Pfeiltasten
    if(event.keyCode == 38){
        pfeileResetten();
        rauf.style.color="blue";
    }else if(event.keyCode == 39){
        pfeileResetten();
        rechts.style.color="blue";
        f.bewegeNachRechts();
    }else if(event.keyCode == 40){
        pfeileResetten();
        runter.style.color="blue";
        f.bewegeRunter();
    }else if(event.keyCode == 37){
        pfeileResetten();
        links.style.color="blue";
        f.bewegeNachLinks();
    }
    //Buttons A und B
    else if(event.keyCode ==65){
        pfeileResetten();
        buttonA.style.color="blue";
        f.drehen();
    }else if(event.keyCode==66 ){
        pfeileResetten();
        buttonB.style.color="blue";
    }
}

//Farben zurücksetzen
let pfeileResetten=()=>{
    rauf.style.color="white";
    rechts.style.color="white";
    runter.style.color="white";
    links.style.color="white";
    buttonA.style.color="white";
    buttonB.style.color="white";
}

userInput.onchange=()=>{
    fallenlassen();
}