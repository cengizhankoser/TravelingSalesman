//const { Button } = require('bootstrap');

function initialize() {

	var mapOptions, map, marker, searchBox, 
		infoWindow = '',
		addressEl = document.querySelector( '#map-search' ),
		latEl = document.querySelector( '#latitude' ),
		longEl = document.querySelector( '#longitude' ),
		element = document.getElementById( 'map' );


	mapOptions = {
		// How far the maps zooms in.
		zoom: 15,
		center: new google.maps.LatLng( 40.765470, 29.940592 ),
		// Current Lat and Long position of the pin/
		
		// center : {
		// 	lat: -34.397,
		// 	lng: 150.644
		// },
		disableDefaultUI: false, // Disables the controls like zoom control on the map if set to true
		scrollWheel: true, // If set to false disables the scrolling on the map.
		draggable: true, // If set to false , you cannot move the map around.
		// mapTypeId: google.maps.MapTypeId.HYBRID, // If set to HYBRID its between sat and ROADMAP, Can be set to SATELLITE as well.
		// maxZoom: 11, // Wont allow you to zoom more than this
		// minZoom: 9  // Wont allow you to go more up.

	};

	/**
	 * Creates the map using google function google.maps.Map() by passing the id of canvas and
	 * mapOptions object that we just created above as its parameters.
	 *
	 */
	// Create an object map with the constructor function Map()
	map = new google.maps.Map( element, mapOptions ); // Till this like of code it loads up the map.

	/**
	 * Creates the marker on the map
	 *
	 */
	marker = new google.maps.Marker({
		position: mapOptions.center,
		map: map,
		// icon: 'http://pngimages.net/sites/default/files/google-maps-png-image-70164.png',
		draggable: true
	});

	/**
	 * Creates a search box
	 */
	searchBox = new google.maps.places.SearchBox( addressEl );

	/**
	 * When the place is changed on search box, it takes the marker to the searched location.
	 */
	google.maps.event.addListener( searchBox, 'places_changed', function () {
		var places = searchBox.getPlaces(),
			bounds = new google.maps.LatLngBounds(),
			i, place, lat, long, resultArray,
			addresss = places[0].formatted_address;

		for( i = 0; place = places[i]; i++ ) {
			bounds.extend( place.geometry.location );
			marker.setPosition( place.geometry.location );  // Set marker position new.
		}

		map.fitBounds( bounds );  // Fit to the bound
		map.setZoom( 15 ); // This function sets the zoom to 15, meaning zooms to level 15.
		// console.log( map.getZoom() );

		
		lat = marker.getPosition().lat();
		long = marker.getPosition().lng();
		latEl.value = lat;
		longEl.value = long;


		resultArray =  places[0].address_components;

		// Get the city and set the city input value to the one selected
		

		// Closes the previous info window if it already exists
		if ( infoWindow ) {
			infoWindow.close();
		}
		/**
		 * Creates the info Window at the top of the marker
		 */
		infoWindow = new google.maps.InfoWindow({
			content: addresss
		});

		infoWindow.open( map, marker );
	} );


	/**
	 * Finds the new position of the marker when the marker is dragged.
	 */
	google.maps.event.addListener( marker, "dragend", function ( event ) {
		var  lat, long, address, resultArray;

		console.log( 'i am dragged' );
		lat = marker.getPosition().lat();
		long = marker.getPosition().lng();

		var geocoder = new google.maps.Geocoder();
		geocoder.geocode( { latLng: marker.getPosition() }, function ( result, status ) {
			if ( 'OK' === status ) {  // This line can also be written like if ( status == google.maps.GeocoderStatus.OK ) {
				address = result[0].formatted_address;
				resultArray =  result[0].address_components;

				// Get the city and set the city input value to the one selected
				
				addressEl.value = address;
				latEl.value = lat;
				longEl.value = long;

			} else {
				console.log( 'Geocode was not successful for the following reason: ' + status );
			}

			// Closes the previous info window if it already exists
			if ( infoWindow ) {
				infoWindow.close();
			}

			/**
			 * Creates the info Window at the top of the marker
			 */
			infoWindow = new google.maps.InfoWindow({
				content: address
			});

			infoWindow.open( map, marker );
		} );

    	})
}
	const taskForm = document.querySelector("#taskForm");
	const c = document.querySelector("#client");
	const adres = document.querySelector('#map-search');
	const Liste = document.querySelector("#Liste");
	const lat = document.querySelector( '#latitude' );
	const lng = document.querySelector( '#longitude' );
	const teslim = document.querySelector( '#teslim' );
	const {ipcRenderer} = require('electron')
	let lists = [];
	ipcRenderer.invoke('get-list').then(()=> console.log('')).catch((err)=> console.error('Error'));
	ipcRenderer.on("send-list", (e, args) => {
		const receivedLists= JSON.parse(args);
		lists= receivedLists;
		renderList(lists);
	  });
	ipcRenderer.invoke('cl').then(()=> console.log('cl')).catch((err)=> console.error('Error'));
	ipcRenderer.on("get-tasks", (e, args) => {
	   const tasks = JSON.parse(args);
	for(var i = 0; i < tasks.length; i++) {
		var opt = tasks[i];
		var el = document.createElement("option");
		el.textContent = opt;
		el.value = opt;
	   c.appendChild(el);
	}});
	function deleteK(id) {
		
      ipcRenderer.invoke('delete-kargo',id).then(()=> console.log('cl')).catch((err)=> console.error('Error'));
    
    return;
  }
	  let idToUpdate = "";
	  let updateStatus = false;
	
	  function edit(id) {
		updateStatus = true;
		idToUpdate =id;
		const k = lists.find(k => k._id === id);
	   c.value = k.clientName;
	   adres.value =k.address;
	   lat.value= k.lat;
	   lng.value=k.lng;
	   teslim.value=k.teslimDurumu
	   adres.focus()
	  }

	function renderList(lists) {
		Liste.innerHTML = "";
		console.log(lists);
		lists.map(t => {
		  Liste.innerHTML += `
				<li class="card">
				<style display:inline-block>
	table, th, td {
	  border:1px solid black;
	  border-collapse: collapse;
	}
	</style>
				<div>
				<table style="width:70%">
				<tr>
				  <th>KargoId</th>
				  <th>MüşteriAdı</th> 
				  <th>Adres</th>
				  <th>TeslimDurumu</th> 
				</tr>
				<tr>
		<td>${t._id}</td>
		<td>${t.clientName}</td>
		<td>${t.address}</td>
		<td>${t.teslimDurumu}</td>
	  <td>  <button onclick="edit('${t._id}')" />  ✎ Edit</td>
	  <td>  <button onclick="deleteK('${t._id}')" /> 🗑 Delete</td>
	  </tr>
			  
			  </table> </div>
				  
				 
				</li>
			  `;
		});
	  }
	  

	
				
			taskForm.reset()	
			  
	
	
	  
	 
	  
	taskForm.addEventListener("submit", async e => {
		e.preventDefault();
	  
		const list = {
			
		  clientName: c.value,
		  address: adres.value,
		  lat: lat.value,
		  lng: lng.value,
		  teslimDurumu:teslim.value
		};
		if (!updateStatus) {
			ipcRenderer.invoke('new-kargo', list).then(()=> console.log('new kargo')).catch((err)=> console.error('Error'));
		  } else {
		   ipcRenderer.invoke("update-kargo", { ...list, idToUpdate }).then(()=> console.log('update kargo')).catch((err)=> console.error('Error'));;
		   
		  
		  }
	  taskForm.reset()
		  renderList(lists);
	
		 
		});
		renderList(lists)
	  
	  ipcRenderer.on("new-kargo-created", (e, arg) => {
		console.log(arg);
		const taskSaved = JSON.parse(arg);
		lists.push(taskSaved);
		
		renderList(lists);
		
		
	  });
	 
	  ipcRenderer.on("update-kargo-success", (e, args) => {
		updateStatus = false;
		
		const updatedkargo = JSON.parse(args);
	lists = lists.map((t, i) => {
		   
		  if (t._id === updatedkargo._id) {
		  
			t.clientName = updatedkargo.clientName;
			t.address = updatedkargo.address;
			t.lat= updatedkargo.lat;
			t.lng=updatedkargo.lng;
			t.teslimDurumu=updatedkargo.teslimDurumu;
		}
		return t;
	  });
	  renderList(lists);
	});
	
	ipcRenderer.on("delete-kargo-success", (e, args) => {
		const deletedKargo = JSON.parse(args);
		const newLists = lists.filter(t => {
		  return t._id !== deletedKargo._id;
		});
	   lists = newLists;
		renderList(lists);


	  });
	
	  ipcRenderer.on("teslim-durumu", (e, args) => {
	
		
		const updated = JSON.parse(args);
		console.log(updated._id)
	lists = lists.map((t, i) => {
		   
		  if (t._id === updated._id) {
		  
			
			t.teslimDurumu=updatedkargo.teslimDurumu;
		}
		return t;
	  });
	
		renderList(lists);

	});