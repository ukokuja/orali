angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $timeout) {
	$scope.profesionales = []; 
	$scope.search = function(){
	var myDataRef = new Firebase('https://orali.firebaseio.com/');
		var textoABuscar = $scope.search.text;

		
		

		 $scope.profesionales = [];
		var professionalesRef = myDataRef.child("profesionales");
		professionalesRef.once('value', function(snapshot) {
		   angular.forEach(snapshot.val() , function(p, key) {
		 //$scope.profesionales.push(profesional);
		 if(textoABuscar=="" || p.nombre.toLowerCase().indexOf(textoABuscar.toLowerCase()) > -1)
		 	var prof = {};
			prof.nombre = p.nombre;
			prof.calificacion = p.calificacion;
			prof.ubicacion = p.ubicacion;
			prof.especialidad = p.especialidad;
			prof.imagen = p.imagen;
			prof.distancia = p.distancia;

			prof.opiniones = [];

			 for(var i = 0; p.opiniones !=null && i < p.opiniones.length; i++){
			 	var op = p.opiniones[i];
			 	myDataRef.child("usuarios").child(op.usuario).once("value", function(snapshot){
			 		$timeout(function(){prof.opiniones.push({opinion: op.opinion, usuario: snapshot.val()})}, 1);
			 	})

			 }

			 

		 	$timeout(function(){$scope.profesionales.push(prof);}, 1)
		   });
		});
		
		 var especialidadesRef = myDataRef.child("especialidades")
		 //especialidadesRef.push({nombre:"Pediatra"});
	}
	/*var myDataRef = new Firebase('https://orali.firebaseio.com/');

	var especialidadesRef = myDataRef.child("especialidades")
	var card = {nombre:"Dentista"};
	especialidadesRef.push(card);
		var professionalesRef = myDataRef.child("profesionales");

	var prof = {};
		prof.nombre = "Elba Garto";
		prof.calificacion = 10;
		prof.ubicacion = "Caballito";
		prof.especialidad = card;
		prof.imagen = "http://static1.squarespace.com/static/5133c93de4b066ad532ebdb3/t/53fe47e3e4b0675e17701866/1409173477210/lionelhutz";
		prof.distancia = "10.7";
		professionalesRef.push(prof);*/
})
.controller('MapCtrl', function($scope, $ionicLoading, $compile) {
  $scope.initialize = function() {
    var myLatlng = new google.maps.LatLng(-34.603075,-58.381653);
    
    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);


    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Uluru (Ayers Rock)'
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });

    $scope.map = map;
  }
  //google.maps.event.addDomListener(window, 'load', initialize);

  
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
