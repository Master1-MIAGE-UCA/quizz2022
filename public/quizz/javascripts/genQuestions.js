'use strict';

$(document).ready(function () {
    // Partie: Generer des questions aleatoires faciles a partir d'artistes aleatoire
    document.getElementById('start').addEventListener('click', function (event) {
        event.preventDefault();
        let nbQuestion = 10;
        let difficulty = document.querySelector('input[name="difficultyChoice"]:checked').value;
        $.ajax({
            url: `/db/questions/gen10/test?nbQuestion=${nbQuestion}&difficulty=${difficulty}`,
            data: {},
            success: (res) => {
            },
            error: (error) => {
                console.log((error && error.error) ? error.error : JSON.stringify(error));
            }
        });
    });
});