'use strict';

$(document).ready(function () {
    // Partie: Generer des questions aleatoires faciles a partir d'artistes aleatoire
    document.getElementById('genererXQuestionsTest').addEventListener('click', function (event) {
        event.preventDefault();
        const nbQuestion = document.getElementById('nbTestQuestion').value;
        if (nbQuestion < 101 && nbQuestion > 0) {
            generateTestQuestion(nbQuestion);
        }
    });

    function generateTestQuestion(nbQuestion) {
        document.querySelector('#testAleatoireDiv textarea').innerHTML = '';
        document.querySelector('#testAleatoireDiv p').innerHTML = 'Loading...';
        document.querySelector('#genererXQuestionsTest').disabled = true;

        $.ajax({
            url: `/db/questions/gen10/test?nbQuestion=${nbQuestion}`,
            data: {},
            success: (res) => {
                document.querySelector('#testAleatoireDiv p').innerHTML = '';
                document.getElementsByClassName('downloadDivFromAleatoireTest')[0].style.display = 'block';
                document.getElementsByClassName('backToTestDivFromAleatoireTest')[0].style.display = 'block';

                const textArea = document.querySelector('#testAleatoireDiv textarea');
                textArea.innerHTML = JSON.stringify(res);
                document.querySelector('#genererXQuestionsTest').disabled = false;
            },
            error: (error) => {
                document.querySelector('#testAleatoireDiv p').innerHTML = '';
                const textArea = document.querySelector('#testAleatoireDiv textarea');

                textArea.innerHTML = (error && error.error) ? error.error : JSON.stringify(error);
            }
        });
    }

    //Partie : bouton retour
    document.getElementsByClassName('backToTestDivBtnFromAleatoire')[0].addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('testDiv').style.display = 'block';
        document.getElementById('testAleatoireDiv').style.display = 'none';
        document.getElementsByClassName('downloadDivFromAleatoireTest')[0].style.display = 'none';
        document.getElementsByClassName('backToTestDivFromAleatoireTest')[0].style.display = 'none';

        document.getElementById('nbTestQuestion').value = '';

        document.querySelector('#testAleatoireDiv p').innerHTML = '';
        document.querySelector('#testAleatoireDiv textarea').innerHTML = '';

        document.querySelector('#genererXQuestionsTest').disabled = false;
    });

    // Partie: Bouton de download
    document.getElementsByClassName('downloadButtonTest')[0].addEventListener('click', function (event) {
        event.preventDefault();
        const textArea = document.querySelector('#testAleatoireDiv textarea');
        saveTextAsFile(textArea.innerHTML, 'question.json');
    });


    function saveTextAsFile(textToWrite, fileNameToSaveAs) {
        const textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
        const downloadLink = document.createElement('a');
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = 'Download File';
        if (window.webkitURL != null) {
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        } else {
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
        }
        downloadLink.click();
    }

    function destroyClickedElement(event) {
        document.body.removeChild(event.target);
    }
});