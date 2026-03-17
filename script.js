let data = JSON.parse(localStorage.getItem("budgetData")) || {}
let currentMonth = ""

function save(){
localStorage.setItem("budgetData", JSON.stringify(data))
}

function newMonth(){
let name = prompt("Enter month (ex: March 2026)")
if(!name) return

data[name] = {essential:[], non:[], savings:[]}
currentMonth = name
updateMonth()
save()
}

function updateMonth(){
let select = document.getElementById("monthSelect")
select.innerHTML=""

for(let m in data){
let opt = document.createElement("option")
opt.value=m
opt.innerText=m
select.appendChild(opt)
}

select.value=currentMonth
loadData()
}

document.getElementById("monthSelect").onchange=function(){
currentMonth=this.value
loadData()
}

function loadData(){
if(!data[currentMonth]) return

renderTable("essential")
renderTable("non")
renderTable("savings")
}

function renderTable(type){
let tbody = document.querySelector("."+type)
tbody.innerHTML=""

for(let i=0;i<31;i++){
let row = data[currentMonth][type][i] || {name:"", cost:"", note:""}

let tr = document.createElement("tr")

tr.innerHTML=`
<td contenteditable oninput="updateCell('${type}',${i},'name',this.innerText)">${row.name}</td>
<td contenteditable oninput="updateCell('${type}',${i},'cost',this.innerText)">${row.cost}</td>
<td contenteditable oninput="updateCell('${type}',${i},'note',this.innerText)">${row.note}</td>
`

tbody.appendChild(tr)
}

calculate()
}

function updateCell(type,i,key,value){
data[currentMonth][type][i] = data[currentMonth][type][i] || {}
data[currentMonth][type][i][key]=value
save()
calculate()
}

function parseNum(x){
return Number(x.replace(/\./g,"")) || 0
}

function calculate(){
calcType("essential","totalEssential","statusEssential")
calcType("non","totalNon","statusNon")
calcSavings()
generateAdvice()
}

function calcType(type,totalId,statusId){
let total=0

data[currentMonth][type].forEach(r=>{
total += parseNum(r.cost || "0")
})

document.getElementById(totalId).innerText = total.toLocaleString("id-ID")

let budget = parseNum(document.getElementsByClassName("budget")[type==="essential"?0:1].value)

let status="-"

if(!budget){
status="-"
}else if(total>budget){
status="Over Budget"
}else if(total>budget*0.85){
status="Tight Budget"
}else{
status="Under Budget"
}

document.getElementById(statusId).innerText=status
}

function calcSavings(){
let total=0

data[currentMonth].savings.forEach(r=>{
total += parseNum(r.cost || "0")
})

document.getElementById("totalSavings").innerText = total.toLocaleString("id-ID")

document.getElementById("statusSavings").innerText="Keep building your savings consistently"
}

function generateAdvice(){

let e = document.getElementById("statusEssential").innerText
let n = document.getElementById("statusNon").innerText

let text=""

text += "<b>Essential Expenses</b><br>"
text += advice(e)

text += "<br><b>Non Essential Expenses</b><br>"
text += advice(n)

text += "<br><b>Savings</b><br>"
text += "• Save at least 20% of your income<br>"
text += "• Build emergency fund<br>"

document.getElementById("adviceText").innerHTML=text
}

function advice(status){

if(status==="Over Budget"){
return "• Reduce spending<br>• Prioritize needs<br>"
}

if(status==="Tight Budget"){
return "• Be careful with spending<br>"
}

if(status==="Under Budget"){
return "• Good job, keep it up<br>"
}

return ""
}
