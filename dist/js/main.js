// LOCAL STORAGE
getStorage();
function getStorage() {

    var keys = Object.keys(localStorage);
    for (i = 0; i < keys.length; i++) {

        var myKey = localStorage.key(i)

        date = JSON.parse(localStorage.getItem(myKey)).CountDown
        if (JSON.parse(localStorage.getItem(myKey)).toDo == false) createLi(myKey, 'done', 'storage', date)

        else createLi(myKey, 'tasks', 'storage', date)
    }
}

document.querySelector('#validationBtn').addEventListener('click', add)
function add(e) {
    e.preventDefault()

    if (document.querySelector('#entryInput').value == '') {
        Materialize.toast('Type smthing in ! ', 2000)
        return
    }
    if (document.querySelector('#entryInput').value in localStorage) {
        Materialize.toast('Already exist', 2000)

        return
    }
    createLi(document.querySelector('#entryInput').value, 'tasks', 'add')
    document.querySelector('#entryInput').value = '';
}



function createLi(text, parentId, trigger, date) {
    var minutes, secondes;
    if (trigger == 'add') {
        minutes = 25
        secondes = 00
        var values = JSON.stringify({ 'name': text, 'CountDown': '25:00', 'toDo': true })
        localStorage.setItem(text, values)

    }

    if (trigger == 'storage' || trigger == 'move' || trigger == 'done') {
console.log(date)
        minutes = date.split(':')[0]
        secondes = date.split(':')[1]

    }

    var li = document.createElement('li');
    var div = document.createElement('div');
    var div2 = document.createElement('div');
    var a = document.createElement('a');
    var i = document.createElement('i');
    li.setAttribute('class', 'col m10');

    a.addEventListener('click', openModal)
    li.addEventListener('click', moveLi, this)
    div.innerHTML = text
    div2.innerHTML = 'Temps restant: <span>' + minutes + ':' + secondes + '</span>'
    a.setAttribute('class', 'btn waves-effect waves-light right red-lighten')
    i.setAttribute('href', '#')
    i.setAttribute('class', 'material-icons')
    i.innerHTML = 'delete'

    a.appendChild(i)
    li.appendChild(div)
    li.appendChild(div2)
    li.appendChild(a)

    document.querySelector('#' + parentId).appendChild(li);
}

//MOVING LI ONCLICK
function moveLi(x) {
    var toMove;
    if (x.target.tagName == 'DIV' || x.target.tagName == 'LI') {
        // if you click on the text (no else so you cant click on delete button)
        if (x.target.tagName == 'DIV') toMove = x.target.parentNode;
        if (x.target.tagName == 'LI') toMove = x.target;


        //if my element is in running
        if (toMove.parentNode.id == "running")  var parent = 'tasks'


        else if (toMove.parentNode.id == "tasks") {
            document.querySelector('#timer').innerHTML = toMove.children[1].children[0].innerHTML

            var parent = 'running'

            //MOVE BACK if there one running  
            if (document.querySelector('#running').children.length >= 1) {

                var toRemove = document.querySelector('#running').children[0];
                (console.log(toRemove))
                toRemove.remove()
                createLi(toRemove.firstChild.innerHTML, 'tasks', 'move', toRemove.children[1].children[0].innerHTML)

                document.querySelector('#timer').innerHTML = toMove.children[1].children[0].innerHTML
                clearInterval(interval)
            } 
        }

        createLi(toMove.firstChild.innerHTML, parent, 'move', toMove.children[1].children[0].innerHTML)
        toMove.remove()


        if (document.querySelector('#running').children.length == 0) {
    
            document.querySelector('#timer').innerHTML = '';
        }
    }
}

//CONFIRM
function openModal(e) {
    console.log('openmodal')
    $('.modal').modal({
        dismissible: true,
        opacity: .5,
        inDuration: 0,
        outDuration: 50,

    });

    $('#modal1').modal('open');

    document.querySelector('#deleteLiBtn').addEventListener('click', function () {
        console.log(e.originalTarget.parentNode.previousSibling.previousSibling.innerHTML)
        e.originalTarget.parentNode.parentNode.remove()
        localStorage.removeItem(e.originalTarget.parentNode.previousSibling.previousSibling.innerHTML)
    });
}


var interval;
document.querySelector('#timerBtns').addEventListener('click', function (e) {
    e = e || window.event;
    if (e.preventDefault) e.preventDefault()
    else e.returnValue = false;
    var liRunning = document.querySelector('#running').firstElementChild;
    if (!liRunning) {
        Materialize.toast('Choose a task'), 4000;
        document.querySelector('#timer').innerHTML = '';
        return
    }

    var timeInLi = liRunning.childNodes[1].children[0].innerHTML;
    var text = liRunning.childNodes[0].innerHTML;

    // START BUTTON 
    if (e.target.id == 'start') {
        Materialize.toast('Wait for it..', 1000)
        clearInterval(interval)
        var temp = new Date(0)

        if (timeInLi.split(':')[0] == 0 && timeInLi.split(':')[1] == 0) {
            if (confirm('Do you want to re-do this for 25min ? ')) {
                temp.setMinutes(25)
                temp.setSeconds(0)
            }
        }

        else {
            temp.setMinutes(timeInLi.split(':')[0])
            temp.setSeconds(timeInLi.split(':')[1])
        }
        var timeleft = Date.parse(temp)

        interval = setInterval(function () {
            timeleft = timeleft - 1000;
            var newdatea = new Date(timeleft)
            // injects in timer
            document.querySelector('#timer').innerHTML = newdatea.getMinutes() + ':' + newdatea.getSeconds()
            // injects in li
            document.querySelector('#running').firstElementChild.childNodes[1].children[0].innerHTML = document.querySelector('#timer').innerHTML
            // store

            var timeInLi = liRunning.childNodes[1].children[0].innerHTML;
            var text = liRunning.childNodes[0].innerHTML;


            var values = JSON.stringify({ 'name': text, 'CountDown': timeInLi, 'toDo': true })

            localStorage.setItem(text, values)


            if (timeleft <= 0) clearInterval(interval);
        }, 1000)

    }
    // PAUSE BUTTON
    if (e.target.id == 'pause') {
        clearInterval(interval)
        document.querySelector('#timer').innerHTML += "<span> <i class=\"material-icons \">pause</i></span>"

        var values = JSON.stringify({ 'name': text, 'CountDown': timeInLi, 'toDo': true })
        localStorage.setItem(text, values)

    }

    // STOP
    if (e.target.id == 'stop') {
        clearInterval(interval)
        if (confirm('Are you sure ? There\'s no going back !')) {

            createLi(text, timeInLi ,'done', 'fini')
            
            var values = JSON.stringify({ 'name': text, 'CountDown': timeInLi, 'toDo': false })
            localStorage.setItem(text, values)
            liRunning.remove()
           
        }
    }
})