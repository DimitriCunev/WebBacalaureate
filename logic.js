let status = undefined;

function login(){
    
    client = io.connect('http://localhost:8080')


    let me = {user:document.querySelector("#exampleInputEmail1").value,key:document.querySelector("#exampleInputPassword1").value}

    client.on('connect',()=>{
        client.emit('requestConnection',{indent:me})
    })

    client.on('hello',(data)=>{
        status = data.status;
        onConnection()
    })

    client.on('examTime',(data)=>{
        drawCountDown(data)
    })

    client.on('examQuestions',(data)=>{
        drawQuestions(data)
    })


}




function onConnection(){
    if(status===true){
        console.log('S-a connectat la server')

    } else if (status===false){
        console.log('Serverul a refuzat connectarea.')
        document.querySelector("#warningStuff").innerHTML = `
        <div class="alert alert-danger" role="alert">
            IDNP inexistent , sau parola este incorectă.
        </div>
        `
    } else {
        console.log('erroare')
    }

}


function drawCountDown(data){ // string of time
    
    document.querySelector('body>div').innerHTML=`<br>

    


    <div class="alert alert-success" role="alert">
        <h4 class="alert-heading">Informație</h4>
        <p>Datele elevului sunt corecte, însă examenul încă nu a început.</p>
        <hr>
        <h5 class="mb-0">Examenul începe pe data de ${data.date}, la ora ${data.time}.</h5>
    </div>
    `
}


function drawQuestions(data){ //array of questions
    console.log(data)
    document.querySelector("body>div").innerHTML=`
    <br>
    <div class="card">
        <div class="card-body">
            <h4>Anexă</h4>
            <h6>${data.anexa}</h6>
        </div>
    </div>
    <br>
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
        Transmitere!
    </button>
    <button type="button" class="btn btn-secondary">
        Ajutor tehnic
    </button>
    <br><br>
    `
    data.questions.forEach(e=>{
        document.querySelector("body > div").innerHTML+=`
        <div class="card border-dark">
            <div class="card-header " >
                ${e.name}
            </div>
            <div class="card-body">
                <h5 class="card-title">${e.content}</h5>
                <p class="card-text">${e.aditional}</p>
                <h6>Răspuns</h6>
                ${e.type=='text'?/*text*/'<input class="form-control" type="text" >':e.type=='number'?/*Number*/'<input type="number" class="form-control" id="inputZip">':e.type=='largetext'?/*Large Text*/'<textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>':0}
                
                ${e.explicatie==true?'<br><h6>Explicație</h6><textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>':""}
                <br>
                <form>
                    <div class="form-group">
                        <h6>Atașare fișier (opțional)</h6>
                        <input type="file" class="form-control-file" id="FILE${e.name}">
                    </div>
                </form>
                ${e.desen?'<h6>Desen</h6><canvas width="300" height="300" style="border: 1px solid black;" id="DRAW${e.name}" class = "draw"></canvas>':''}
                
                </div>
        </div><br>`
    })
    document.querySelectorAll('canvas').forEach(cvs=>{
        cvs.oncontextmenu = function (e) {
            e.preventDefault();
        };
        cvs.addEventListener('mousemove', function (evt) {
            if(evt.which==1){
                ctx = cvs.getContext("2d")
                ctx.beginPath();
                ctx.arc(evt.offsetX, evt.offsetY, 1, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'black';
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'black';
                ctx.stroke();
            }
            if(evt.which==3){
                ctx = cvs.getContext("2d")
                ctx.beginPath();
                ctx.arc(evt.offsetX, evt.offsetY, 1, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.lineWidth = 7;
                ctx.strokeStyle = 'white';
                ctx.stroke();
            }
        })

    })
}


function finishExam(){
    document.querySelector("body > div").innerHTML = `
    <br><div class="alert alert-success" role="alert">
        Răspunsurile vor fi anunțate de instituția locală.<br> Success!
    </div>
    `
}


$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
  })



//login()