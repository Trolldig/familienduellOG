// Globale Variablen für die Antwortdaten und den Status der Buttons
var jsonData;
var buttonClickedStatus = [];
var frageText = document.getElementById("question");
var answersDiv = document.getElementById("answers");
var honorableMentionsDiv = document.getElementById("honorableMention");
var errorDiv = document.getElementById("error");

// Funktion, um die Frage und Antwortbuttons zu erstellen
function createFrageUndAntworten() {
    var selectedJson = document.getElementById("jsonSelect").value;

    fetch(selectedJson)
        .then(response => response.json())
        .then(data => {
            // Frage aktualisieren
            frageText.textContent = '';
            // Antworten löschen, um Platz für neue Antworten zu machen
            answersDiv.innerHTML = '';
            // Reset der Ehrenvollen Erwähnungen
            honorableMentionsDiv.textContent = '';
            // Reset der Error Message
            errorDiv.textContent = '';
            // Frage aktualisieren
            frageText.textContent = data.Frage;

            // Setze die Antwortdaten und den Status der Buttons zurück
            jsonData = data;
            buttonClickedStatus = new Array(data.Antworten.length).fill(false);

            // Antwortbuttons einfügen
            data.Antworten.forEach(function (antwort, index) {
                var answerDiv = document.createElement("div");
                answerDiv.classList.add("answerDiv");

                var id = document.createElement("span");
                var answerButton = document.createElement("button");
                var countSpan = document.createElement("span");

                id.textContent = antwort.ID;
                countSpan.textContent = "-"; // Platzhalter "-" für die Anzahl
                answerButton.textContent = "X"; // Platzhalter für die Antwort
                answerButton.addEventListener("click", function () {
                    changeButtonText(answerButton, antwort.Antwort, countSpan, antwort.Anzahl);
                    updateClickedAnswers(index); // Aktualisiere den Status des geklickten Buttons
                    answerButton.classList.add("clicked"); // Füge eine Klasse hinzu, um den geklickten Zustand darzustellen
                });

                answerDiv.appendChild(id);
                answerDiv.appendChild(answerButton);
                answerDiv.appendChild(countSpan);
                answerDiv.appendChild(document.createElement("br")); // Um eine Zeilenumbruch hinzuzufügen

                answersDiv.appendChild(answerDiv);
            });
        })
        .catch(error => {
            resetDivs();
            // Fehlermeldung anzeigen
            errorDiv.textContent = 'Fehler beim Laden der Daten: ' + error.message;
        });
}

//Reset aller Divs
function resetDivs(){
    // Frage aktualisieren
    frageText.textContent = '';
    // Antworten löschen, um Platz für neue Antworten zu machen
    answersDiv.innerHTML = '';
    // Reset der Ehrenvollen Erwähnungen
    honorableMentionsDiv.textContent = '';
    // Reset der Error Message
    errorDiv.textContent = '';
}

// Funktion, um den Status des geklickten Buttons zu aktualisieren
function updateClickedAnswers(index) {
    buttonClickedStatus[index] = true;
    if (buttonClickedStatus.every(status => status)) {
        showHonorableMentions(); // Alle Buttons wurden mindestens einmal geklickt, zeige "honorable mentions" an
    }
}

// Funktion, um den Text des angeklickten Buttons zu ändern und die Anzahl anzuzeigen
function changeButtonText(answerButton, newText, countSpan, count) {
    answerButton.textContent = newText;
    countSpan.textContent = " (" + count + ")";
}

// Funktion, um die "honorable mentions" anzuzeigen
function showHonorableMentions() {
    var honorableMentionsDiv = document.getElementById("honorableMention");

    // "Honorable Mentions" anzeigen
    if (jsonData.HonorableMentions) {
        honorableMentionsDiv.textContent = "Honorable Mentions: " + jsonData.HonorableMentions;
    } else {
        honorableMentionsDiv.textContent = ''; // Wenn keine "Honorable Mentions" vorhanden sind, leeres Element anzeigen
    }
}

// Funktion, um die Antworten neu zu laden, wenn eine andere JSON-Datei ausgewählt wird
document.getElementById("jsonSelect").addEventListener("change", function () {
    createFrageUndAntworten(); // Neue Antworten laden
});

// Initialer Aufruf der Funktion, um Frage und Antwortbuttons zu erstellen
createFrageUndAntworten();