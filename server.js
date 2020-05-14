
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var fs = require('fs')


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

function userExists(user){
    if(users[user.user]){
        if(users[user.user].key==user.key){
            return true;
        } else {
            return false;
        }
    } else {return false;}
    
}

let exam = {
    active:true,
    time:'14:00PM',
    date:'04.06.2020',
    anexa:"aici se afla anexa si formule importante ! <br> hey",
    questions:[
        {name:'Intrebarea 1',content:'Cat este 2+2 ?',type:'number',aditional:"",explicatie:false,desen:false},
        {name:'Intrebarea 2',content:'De ce soarele este rotund ?',type:'text',aditional:"",explicatie:true,desen:true},
        {name:'Intrebarea 3',content:'Viteza luminii la patrat ?',type:'number',aditional:"",explicatie:false,desen:false},
        {name:'Intrebarea 4',content:'Demonstrati teza lui Riemann',type:'text',aditional:"",explicatie:true,desen:false}
    ]
}

let users = {
    'admin':{key:123,rank:'admin',active:false}
}

let rawUsers = fs.readFileSync('elevi.txt','utf8').split('\n').map(e=>e.split(':').map(j=>j.trimRight()))

rawUsers.forEach(e=>{
    users[e[0]]={}
    users[e[0]]['key'] = e[1]
})






io.on('connection',(socket)=>{
    //console.log(socket.id)


    socket.on('requestConnection',(data)=>{    
        if(userExists(data.indent)){
            console.log('Found user!')
            socket.emit('hello',{status:true})

            //Check for exam
            if (exam.active){
                console.log('ye')
                socket.emit('examQuestions',{questions:exam.questions,anexa:exam.anexa})

            } else {

                socket.emit('examTime',{time:exam.time,date:exam.date})
            }




        } else {
            console.log('Nope user!')
            socket.emit('hello',{status:false})
        }
    })
})



http.listen(8080, function(){
    console.log('Server is running on port 3000');
});