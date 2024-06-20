import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-a79b7-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListInDB = ref(database, "Endorsements")

const publishBtn = document.getElementById("publish-btn")
const endorsementInput = document.getElementById("endorsement-input")
const fromInput = document.getElementById("from-input")
const toInput = document.getElementById("to-input")

const endorsementEl = document.getElementById("endorsement-el")

publishBtn.addEventListener("click", function(){
    let endorsement = {
        from : fromInput.value,
        to : toInput.value,
        text : endorsementInput.value
    }
    
    push(endorsementListInDB, endorsement)
    
    clearInputFields()
})

function clearInputFields(){
    endorsementInput.value = ""
    fromInput.value = ""
    toInput.value = ""
}

function clearEndorsementList(){
    endorsementEl.innerHTML = ""
}

onValue(endorsementListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearEndorsementList()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendEndorsementToEndorsementEl(currentItem)
        }    
    } else {
        endorsementEl.innerHTML = `<span style = "color: white; font-family: Inter;">No Endorsements here... yet</span>`
    }
})


function appendEndorsementToEndorsementEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("p")
    
    newEl.innerHTML = `<strong>To ${itemValue.to}</strong>
                                <br>
                                <br>
                                ${itemValue.text}
                                <br>
                                <br>
                                <strong>From ${itemValue.from}</strong>`
 
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `Endorsements/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    endorsementEl.append(newEl)
}