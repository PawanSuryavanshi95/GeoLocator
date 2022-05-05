const socketio = require("socket.io");

const db = require('./db');

const io = socketio();

io.on("connection", socket => {
    console.log("a user connected :D");
    io.emit("hello", "Yo boi, what's up?");

    io.emit("RECEIVE_COORDINATES", {
        point: {
            latitude: 26.472486,
            longitude:  73.114755,
        },
        friend: 'test',
    });

    socket.on("SEND_COORDINATES", (data)=>{
        console.log(data);
        const { currentLocation, user } = data;

        if(user)
            db.User.findById(user).then(user2 => {
                //var x = 37.788988, y = -122.433645;
                var x = currentLocation.latitude, y = currentLocation.longitude;
                var flag = false;
                user2.zones.forEach(element => {
                    var count = 0;
                    for(var i = 0; i<(element.markers.length-1);i++){
                        var x1 = element.markers[i]['latitude'];
                        var y1 = element.markers[i]['longitude'];
                        var x2 = element.markers[i+1]['latitude'];
                        var y2 = element.markers[i+1]['longitude'];
                        if( ( y<y1 != y<y2 ) && ( x < ((x2 - x1) * (y - y1)/(y2 - y1) + x1) ) ){
                            count += 1;
                            
                        }
                    }
                    if(count%2==1){
                        flag = true;
                    }

                });
                if(flag){
                    console.log('bhejna h isko');
                    io.emit("RECEIVE_COORDINATES", {
                        point: {
                            latitude: x,
                            longitude: y,
                        },
                        friend: user2.user,
                    });
                }
                
            }).catch(error => {
                console.log(error);
            });

    })

  });

module.exports = io;