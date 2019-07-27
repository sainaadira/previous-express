
// these elements control the buttons
document.getElementById("addButton").onclick = addToList;
document.getElementById('clearComplete').onclick= clearComplete;
document.getElementById('clearButton').onclick= clearList;

// this count stands for the counters starter point
let count = 0


// this is for the input
function addToList() {
  let item = document.getElementById("userInput").value;
  let ul = document.getElementById('listItems');
  let textNode = document.createTextNode(item)
  let li = document.createElement('li');
    console.log("this is the element",document.getElementById("userInput"))
    console.log("this is the item",item)


// // this is the value for the input. if the string is empty it will alert
// "please write something"
  if (item ==""){
    alert("please write something.")
  }else{
    li.appendChild(textNode);
    // this appendchild tells text to become a child of the ul and add it to the list on the dom
    ul.appendChild(li);
    count++
    document.getElementById('userInput').value = ""
    // document.getElementById("counterItems").innerHTML= count

    // this is the post that send items ti r=the data base
    fetch('todos', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'todo': item,
      })
    })
     .then(response => {
       console.log(response)
       window.location.reload(true)
     })
  }
}
// this is event delegation, targeted all the li's in the ul and if it is clicked on,
// all of things are given the classs name completed and goes away
let ul = document.querySelector("ul")
ul.addEventListener("click", function(e){
  console.log("toggle completed", e.target.innerText)
  if(e.target.tagName === 'LI'){
    e.target.classList.toggle("completed")
    let completedNumber = document.getElementsByClassName("completed").length
     let totalNumber = count - completedNumber
    console.log(e.target.classList.contains("completed"));

     fetch('todos', {
       method: 'put',
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify({
         'completed': e.target.classList.contains("completed"),
         'todo': e.target.innerText
       })
     })
     .then(response => {
       if (response.ok) return response.json()
     })
     .then(data => {
       console.log(data)
       window.location.reload(true)
     })
  }

})

function clearList(){
fetch('clearAll', {
  method: 'delete',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({


  })
}).then(function (response) {
window.location.reload()
  })
}


  function clearComplete(){
    let completed = ul.querySelectorAll(".completed")
    completed.forEach(function(li){
      fetch('clearCompleted', {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "completed": true

        })
      }).then(function (response) {
      window.location.reload()
        })
      });

    }
