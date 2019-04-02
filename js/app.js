
    //Camera Authentication
    var ip_address = "178.89.1.142"
	//var ip_address = "192.168.100.130"
	//var ip_address = "192.168.100.21"
    //camera username and password
    var username = "admin";
    var password="";

    //A channel of camera stream
    Stream = require('node-rtsp-stream');
    stream = new Stream({
		//streamUrl: 'rtsp://' + ip_address + ':555/user='+ username +'&password=&channel=1&stream=0.sdp?',
		streamUrl: 'rtsp://178.89.1.142:555/user=admin&password=&channel=1&stream=0.sdp?',
		//streamUrl: 'rtsp://192.168.100.21:554/user=admin&password=&channel=1&stream=0.sdp?',
        wsPort: 9999,
		width: 1280,
		height: 720,
		ffmpegOptions: {
			'-s': "1280x720",
			'-b:v': "2048"
		}
    });