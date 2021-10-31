const { ipcRenderer } = require('electron')
let locationCoordinates = [];
var locationCount = ""

//let directionsService;
//let directionsDisplay;
function initMap() {


    //const start = new google.maps.LatLng(40.765470, 29.940592);
    //kargo başlangıç yeri


    var options = {
        zoom: 15,
        center: { lat: 40.765470, lng: 29.940592 },
    }
    const map = new google.maps.Map(document.getElementById("map"), options);
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map)


    ipcRenderer.invoke('get-latlongs').then(() => console.log('')).catch((err) => console.error('Error'));
    ipcRenderer.on("send-latlongs", (e, args) => {
        const receivedLists = JSON.parse(args)
        locationCoordinates = receivedLists;
        console.log(locationCoordinates)
        locationCount = locationCoordinates.length;
        const start = { lat: 40.765470, lng: 29.940592 };
        var distanceMatrix = []
        var distanceCenter = []
        for (var i = 0; i < locationCount; i++) {
            distanceMatrix[i] = new Array(locationCount);
        }
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function createMatrix(distanceCenter, distanceMatrix, locationCoordinates, locationCount) {
            let count = 0
            for (var i = 0; i < locationCount; i++) {
                count = count + 1
                if (count != 0 && count % 7 == 0) {
                    await sleep(1000 + i*200);

                }

                distanceCenter[i] = await calcDistance(start, locationCoordinates[i])

            }
            for (var i = 0; i < locationCount; i++) {
                for (var j = 0; j < locationCount; j++) {
                    if (i == j) {
                        distanceMatrix[i][j] = 0
                        continue;
                    }
                    console.log("i", i)
                    console.log("j", j)
                    count = count + 1
                    if (count % 7 == 0) {

                        await sleep(1700 + Math.pow(locationCount,1.3)  * 400);

                    }

                    distanceMatrix[i][j] = await calcDistance(locationCoordinates[i], locationCoordinates[j]);


                }
            }
            var matrix = []
            matrix[0] = distanceCenter;
            matrix[1] = distanceMatrix;
            return matrix

        }
        createMatrix(distanceCenter, distanceMatrix, locationCoordinates, locationCount).then(matrix => shortestPath(locationCoordinates, locationCount, start, matrix).then(shortestpath => {
            showRoute(start, shortestpath[locationCount - 1], shortestpath, locationCount);
            deleteVisited(shortestpath,locationCount)
        }))
        async function deleteVisited(shortestpath,locationCount){
            for (var i = 0; i < locationCount; i++) {
                await sleep(5000);
                showRoute(shortestpath[i],shortestpath[locationCount - 1],shortestpath.slice(i+1,locationCount-1),locationCount-(i+1))
            }
        }
        //  var start = '40.765470, 29.940592';
        //  var end = '40.76124439803489, 29.9436904870682';
        /**
         * 
         * @param {*} start 
         * @param {*} destination 
         * @returns void
         */
        function showRoute(start, destination, array, length) {
            let waypts = []
            console.log(length)
            console.log("start", start)
            console.log("destination", destination)
            console.log("array", array)
            for (var i = 0; i < length - 1; i++) {
                waypts.push({
                    location: array[i],
                    stopover: true
                });

            }
            let request = {
                origin: start,
                destination: destination,
                waypoints: waypts,
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    var distance = 0
                    //directionsDisplay.setDirections(response);
                    for (var i = 0; i < length; i++) {
                        distance = distance + response.routes[0].legs[i].distance.value
                        console.log("uzaklik", response.routes[0].legs[i].distance.value)
                    }
                    console.log("DISTANCE", distance);
                    directionsDisplay.setDirections(response);
                    /* let starter = new google.maps.Marker({
                        position: start,
                        map: map
                    })
                    let marker = new google.maps.Marker({
                        position: destination,
                        map: map
                    }) */
                }
            })
        }
        function calcDistance(start, destination) {

            return new Promise((resolve, reject) => {
                let request = {
                    origin: start,
                    destination: destination,
                    travelMode: google.maps.TravelMode.DRIVING
                };
                directionsService.route(request, function (response, status) {
                    console.log("DIRACTION", status);
                    if (status == 'OK') {
                        //directionsDisplay.setDirections(response);
                        var distance = response.routes[0].legs[0].distance.value
                        console.log("DISTANCE", distance);
                        resolve(distance)
                    } else {
                        console.log("calcDistance REJECT", response);
                        reject(response) // error
                    }
                })
            })
        }

        //  var end={lat:'40.76124439803489' ,lng:' 29.9436904870682'}
        function factorial(locationCount) {

            if (locationCount == 0) {
                return 1;

            }
            return locationCount * factorial(locationCount - 1);
        }

        async function shortestPath(locationCoordinates, locationCount, start, matrix) {
            var pathLength = 99999999999999
            var temp
            var tempArr
            var arr
            var fact = factorial(locationCount);
            var p = permute(locationCoordinates);
            try {
                for (var i = 0; i < fact; i++) {
                    tempArr = p.next().value
                    temp = await calcPathLength(tempArr, locationCount, matrix)
                    console.log("temp", temp)
                    if (temp < pathLength) {
                        pathLength = temp
                        arr = tempArr
                    }
                    console.log(temp)
                }
            } catch (e) {
                console.log("shortestPath", e);
            }
            console.log(arr)
            return arr
        }
        //shortestPath(locationCoordinates, locationCount, start).then(shortestpath => {
        //    showRoute(start, shortestpath[length - 1], shortestpath, locationCount);
        //})



        function permute(arr) {
            var l = arr.length,
                used = Array(l),
                data = Array(l);
            return function* backtracking(pos) {
                if (pos == l) yield data.slice();
                else for (var i = 0; i < l; ++i) if (!used[i]) {
                    used[i] = true;
                    data[pos] = arr[i];
                    yield* backtracking(pos + 1);
                    used[i] = false;
                }
            }(0);
        }


        function calcPathLength(array, length, matrix) {
            return new Promise(async resolve => {
                let sum;
                var distanceCenterCopy = matrix[0]
                var distanceMatrixCopy = matrix[1]
                console.log(distanceCenterCopy)
                console.log(distanceMatrixCopy)
                console.log(array)
                try {
                    sum = distanceCenterCopy[(array[0].number) - 1]
                    for (var i = 0; i < length - 1; i++) {
                        var temp1 = array[i].number
                        var temp2 = array[i + 1].number
                        sum = sum + distanceMatrixCopy[temp1 - 1][temp2 - 1]
                    }
                    console.log("SUM", sum);
                    resolve(sum)
                } catch (e) {
                    console.log("calcPathLength", e);
                }
            })

        }
    });

}