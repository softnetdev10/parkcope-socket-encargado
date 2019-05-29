$(document).ready(function() {
    var connection;
    var establishmentLabel = $('#establishment')[0];
    var data = {};

    $('#btnOn').on('click', function() {

        $(this).css('display', 'none');
        $('#btnOff').css('display', 'block');
        connection = new WebSocket('wss://avvvkojx4c.execute-api.us-east-1.amazonaws.com/dev/');
        connection.onopen = function(event) {
            console.log('Conectado');
            var msg = { "action": "getConecctionEstablishment", "message": "Se habilita la conexión", "statusCode": "002" };
            connection.send(JSON.stringify(msg));
        };
        connection.onerror = function(error) {
            console.log('WebSocket Error ' + error);
        };
        connection.onmessage = function(e) {
            var data = JSON.parse(e.data);
            if (data.statusCode === "001") {
                if (confirm('Tienes una solicitud, desea aceptarla?')) {
                    var msg = {
                        "action": "acceptService",
                        "message": "Se acepta la solicitud de servicio",
                        "statusCode": "003",
                        "idConnectionClient": data.idConnectionClient,
                        "idSolicitudServicio": data.idSolicitudServicio
                    };
                    connection.send(JSON.stringify(msg));
                } else {
                    var msg = {
                        "action": "rejectService",
                        "message": "Se rechaza la solicitud de servicio",
                        "statusCode": "004",
                        "idConnectionClient": data.idConnectionClient,
                        "idSolicitudServicio": data.idSolicitudServicio
                    };
                    connection.send(JSON.stringify(msg));
                }
            }
            if (data.statusCode === "002") {

                var idConnectionEstablishment = data.idConnectionEstablishment;
                $('#connectionEst').val(idConnectionEstablishment);
                data = {
                    "conexion_establecimiento": idConnectionEstablishment,
                    "id_establecimiento": establishmentLabel.value
                };
                $.ajax({
                    "async": true,
                    "crossDomain": true,
                    "url": "https://n2cbyezsdj.execute-api.us-east-1.amazonaws.com/prod/service/establishment/updateConnectionEstablishment/",
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json",
                        "cache-control": "no-cache",
                        "Access-Control-Allow-Origin": "*"
                    },
                    "processData": false,
                    "data": JSON.stringify(data),
                });


            }
            if (data.statusCode === "005") {

                alert("Se solicita fin de servicio");
                var msg = {
                    "action": "acceptServiceExit",
                    "message": "Se acepta la solicitud de salida",
                    "statusCode": "006",
                    "idConnectionClient": data.idConnectionClient,
                    "idSolicitudServicio": data.idSolicitudServicio
                };
                connection.send(JSON.stringify(msg));

            }
        };


        connection.setTimeout(10000);

    });
    $('#btnOff').on('click', function() {
        $(this).css('display', 'none');
        $('#btnOn').css('display', 'block');
        connection.close();
        $('#connectionEst').val('');
        console.log('Desconectado');

    });




});