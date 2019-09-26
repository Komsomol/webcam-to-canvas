app = {
	select: document.getElementById('select'),
	video: document.querySelector('video'),
	videoDebug: document.querySelector('.video-debug'),
	serverDebug: document.querySelector('.server-debug'),
	saveBtn: document.querySelector('.saveBtn'),
	sendBtn: document.querySelector('.sendBtn'),
	canvas: document.getElementById('canvas'),
	photo : document.getElementById('photo'),
	settings:{
		width:640,
		height:480
	},
	init:() =>{


		navigator.mediaDevices.getUserMedia({audio: true, video: true})
		.then(function(stream) {
			navigator.mediaDevices.enumerateDevices().then(app.listDevices);
		})
		.catch(function(err) {
			console.log('GUM failed with error, time diff: ', Date.now() - now);
		});

		app.bindEvents();
		
	},

	listDevices:(mediaDevice)=>{
		console.table(mediaDevice);

		app.select.innerHTML = '';
		app.select.appendChild(document.createElement('option'));

		// list video inputs
		mediaDevice.forEach(mediaDevice => {
			
			app.videoDebug.innerHTML += `<p>${mediaDevice.label} - ${mediaDevice.kind}</p>`;
			

			if (mediaDevice.kind === 'videoinput') {
				const option = document.createElement('option');
				option.value = mediaDevice.deviceId;
				const label = mediaDevice.label;
				const textNode = document.createTextNode(label);
				option.appendChild(textNode);
				select.appendChild(option);
			}
		});

		
	},

	bindEvents:()=>{

		app.saveBtn.disabled = true;
		app.sendBtn.disabled = true;

		app.saveBtn.addEventListener('click', ()=>{
			app.takePhoto();
		});

		app.sendBtn.addEventListener('click', ()=>{
			app.savePhototoPayload();
		});

		app.select.addEventListener('change', (e)=>{
			console.table(e);
			if(e.target.value == ''){
				console.log('select a camera');
			} else {
				app.deviceID = e.target.value;
				app.initCamera(e.target.value);
			}
		});

	},

	initCamera:(deviceID)=>{

		const constraints = {
			audio: false, 
			video: { 
				width: app.settings.width, 
				height: app.settings.height,
				deviceId: {
					exact: deviceID
				}
			} 
		}; 

		navigator.mediaDevices.getUserMedia(constraints)
		.then( (mediaStream) => {
			app.video.srcObject = mediaStream;

				app.video.onloadedmetadata = (e) => {
					app.video.style.height = constraints.video.height + 'px';
					app.video.style.width = constraints.video.width + 'px';
					app.video.play();

					app.saveBtn.disabled = false;
				};
		})
		.catch((err) => {
			console.log(err.name + ": " + err.message); 
		}); 
	},

	clearphoto:()=>{
		console.log('clearing canvas');
		var context = app.canvas.getContext('2d');
		context.fillStyle = "#AAA";
		context.fillRect(0, 0, app.canvas.width, app.canvas.height);

		var data = canvas.toDataURL('image/png');
		app.photo.setAttribute('src', data);
	},

	takePhoto:()=>{
		app.clearphoto();

		var context = app.canvas.getContext('2d');

		app.canvas.width = app.settings.width;
		app.canvas.height = app.settings.height;
		context.drawImage(app.video, 0, 0, app.settings.width, app.settings.height);
		
		var data = app.canvas.toDataURL('image/png');
		app.photo.setAttribute('src', data);

		app.sendBtn.disabled = false;

	},

	savePhototoPayload:()=>{
		
			//save blob,
	app.canvas.toBlob( (blob) =>{
		
		var payLoad = {
			name: 'random',
			email: 'random',
			photo: blob,
		};

		app.sendToAPI(payLoad);

	},'image/jpeg', 0.80);
	//post to API with payload

	},

	sendToAPI:(payLoad)=>{
		fetch('https://api.github.com/gists', {
			method: 'post',
			body: JSON.stringify(payLoad)
		}).then(function(response) {
			return response.json();
		}).then(function(data) {
			console.table(data);
		});
	}
},

window.onload = app.init;