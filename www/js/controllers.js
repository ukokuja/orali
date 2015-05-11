angular.module('starter.controllers', [])



.controller('DashCtrl', function($scope, $timeout, $state) {
	$scope.profesionales = []; 
		$scope.search = function(){
			document.getElementById('searchButton').disabled = true;

		var myDataRef = new Firebase('https://orali.firebaseio.com/');
		var textoABuscar = $scope.search.text;

		
		

		$scope.profesionales = [];
		var professionalesRef = myDataRef.child("profesionales");
		professionalesRef.orderByChild('calificacion').once('value', function(snapshot) {
			angular.forEach(snapshot.val() , function(p, key) {
		 //$scope.profesionales.push(profesional);
		 if(textoABuscar == null || textoABuscar.trim() == "" || p.nombre.toLowerCase().indexOf(textoABuscar.toLowerCase()) > -1){
		 	var prof = {};
		 	prof.id = key;
		 	prof.nombre = p.nombre;
			prof.calificacion = (p.calificacion.puntos / p.calificacion.cantidad).toFixed(1);
		 	prof.ubicacion = p.ubicacion;
		 	prof.especialidad = p.especialidad;
		 	prof.imagen = p.imagen;
		 	prof.distancia = p.distancia;

		 	prof.opiniones = [];

		 	for(var i = 0; p.opiniones !=null && i < 1; i++){
		 		var op = p.opiniones[i];

		 		myDataRef.child("usuarios").child(op.usuario).once("value", function(snapshot){
		 			$timeout(function(){

		 				prof.opiniones.push({opinion: op.opinion, usuario: snapshot.val()})
		 			}, 1);
		 		})

		 	}



		 	$timeout(function(){$scope.profesionales.unshift(prof);
			document.getElementById('searchButton').disabled = false;
		 	}, 1)
		 }
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
		$scope.detalleProfesional = function(id){
			$state.go('tab.professional-detail', {id: id});
		}
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
})

.controller('SignInCtrl', function($scope, $state) {
	$scope.signIn = function(user){
		$state.go('tab.dash');
	}
})

.controller('ViewCtrl', function($scope,$timeout, $stateParams, $ionicPopup) {
	var user = {};
	user.id = "prueba";	

	var pID = $stateParams.id;
	var prof = {};
	var myDataRef = new Firebase('https://orali.firebaseio.com/');
	myDataRef.child("profesionales").child(pID).once("value", function(snapshot){
		var p = snapshot.val();
		$timeout(function(){


			prof.nombre = p.nombre;
			prof.calificacion = (p.calificacion.puntos / p.calificacion.cantidad).toFixed(1);
			prof.ubicacion = p.ubicacion;
			prof.especialidad = p.especialidad;
			prof.imagen = p.imagen;
			prof.distancia = p.distancia;
			myDataRef.child("favoritos").child(pID).child(user.id).once("value", function(fechaFavorito){
				prof.favorito = fechaFavorito.val() != null;
			});
			prof.calificado = true;

			prof.opiniones = [];
$scope.profesional = prof;
			for(var i = 0; p.opiniones !=null && i < p.opiniones.length; i++){
				var op = p.opiniones[i];
				agregarUsuario($scope.profesional.opiniones, op.opinion, op.usuario, $timeout);
				

			}

		}, 1);
	})

	myDataRef.child("profesionales").child(pID).child('vistas').transaction(function (current_value) {
  return (current_value || 0) + 1;
	});
		//console.log(prof);
		
	$scope.favorito = function(){

		var fav = myDataRef.child("favoritos").child(pID).child(user.id);
		if($scope.profesional.favorito){
			var fecha = new Date();
			fav.set(fecha.toISOString());
		}else{
			fav.set(null);	
		}
	}

	$scope.popupCalificar = function(){
		$scope.data = {}

   // An elaborate, custom popup
   var myPopup = $ionicPopup.show({
     template: '<input type="text" ng-model="calificacion.texto">',
     title: 'Escribí tu calificación!',
     subTitle: '',
     scope: $scope,
     buttons: [
       { text: 'Cancelar' },
       {
         text: '<b>Guardar</b>',
         type: 'button-positive',
         onTap: function(e) {
         	alert($scope.calificacion.texto);
           if (!$scope.calificacion.texto) {
             //don't allow the user to close unless he enters wifi password
             e.preventDefault();
           } else {
             return $scope.calificacion.texto;
           }
         }
       },
     ]
   });
   myPopup.then(function(res) {
     console.log('Tapped!', res);
   });

  };
	
});

function agregarUsuario(lista, opinion, usuario, $timeout){
	var myDataRef = new Firebase('https://orali.firebaseio.com/');
	myDataRef.child("usuarios").child(usuario).once("value", function(snapUser){
					$timeout(function(){
					 lista.push({opinion: opinion, usuario:snapUser.val()
					 })}, 1);
				});
}
