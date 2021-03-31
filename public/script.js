const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})

const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata',() => {
    video.play()
  })
  videoGrid.append(video)
}

window.addEventListener('load', () => {
 
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");

  canvas.height = window.innerHeight/1.4;
  canvas.width = window.innerWidth/1.4;

  let painting = false;

  socket.on('mouse', newDraw);

  function newDraw(data) {
    ctx.lineTo(data.x, data.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(data.x, data.y);
  }

  function startPosition(e) {
      painting = true;
      draw(e);
  }

  function finishedPosition() {
      painting = false;
      ctx.beginPath();
  }

  function draw(e) {
      if(!painting) return;
      ctx.lineCap = "round";

      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
      var data = {
        x: e.clientX,
        y: e.clientY
      }
      socket.emit('mouse',data);
  }

  

  canvas.addEventListener("mousedown", startPosition)
  canvas.addEventListener("mouseup", finishedPosition)
  canvas.addEventListener("mousemove", draw)
});



function red() {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "red";
  ctx.lineWidth = 5;
  var cdata = {
    color: "red",
  }
  socket.emit('color',cdata)
}

function yellow() {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 5;
  var cdata = {
    color: "yellow",
  }
  socket.emit('color',cdata)
}

function green() {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "green";
  ctx.lineWidth = 5;
  var cdata = {
    color: "green",
  }
  socket.emit('color',cdata)
}

function blue() {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 5;
  var cdata = {
    color: "blue",
  }
  socket.emit('color',cdata)
}

function black() {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "black";
  ctx.lineWidth = 5;
  var cdata = {
    color: "black",
  }
  socket.emit('color', cdata)
}

function incpen() {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = ctx.lineWidth + 5;
  var ldata = {
    width: ctx.lineWidth
  }
  socket.emit('linew', ldata)
}

function decpen() {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = ctx.lineWidth - 5;
  var ldata = {
    width: ctx.lineWidth
  }
  socket.emit('linew', ldata)
}

function eraser() {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "white";
  ctx.lineWidth = 30;
  var edata = {
    color: "white",
    width: 30
  }
  socket.emit('eraser', edata);
}




socket.on('color', colorChange);
function colorChange(cdata) {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = 5;
  ctx.strokeStyle = cdata.color;
}

socket.on('linew', widthChange);
function widthChange(ldata) {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = ldata.width;
}

socket.on('eraser', Eraser);
function Eraser(edata) {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = edata.color;
  ctx.lineWidth = edata.width;
}
