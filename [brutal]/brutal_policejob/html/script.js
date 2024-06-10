ChoosedButton = 0
InSubMenu = false
InSearchMenu = "people"
OpenFromJail = false
InPanelPos = false
PressedLicence = [0,0]
OpenedMDT = false
MenuColors = ["",""]
Involveds = [[],[],[]]
AddInvolved = ""
Job = undefined

if (localStorage.getItem("VehControlTop") != "null"){
  let vc = document.getElementById("vehicle_control")
  let vp = document.getElementById("plate_reader")

  vc.style.top = localStorage.getItem("VehControlTop")
  vc.style.left = localStorage.getItem("VehControlLeft")
  vp.style.top = localStorage.getItem("VehPlateTop")
  vp.style.left = localStorage.getItem("VehPlateLeft")
}

window.addEventListener('message', function(event) {
    let data = event.data
   
    if (data.action === "OpenPoliceMenu"){
      InteractionsTable = data.interactionstable
      CreatePoliceMenu()
      MenuColors = data.menucolors
      RefreshColors()
    }
    else if (data.action === "OpenCloakRoom"){
      Outfits = data.outfits
      CreateDressMenu()
      MenuColors = data.menucolors
      RefreshColors()
    }
    else if (data.action === "OpenArmory"){
      CreateArmoryMenu()
      MenuColors = data.menucolors
      RefreshColors()
    }
    else if (data.action === "OpenGarage"){
      Vehicles = data.vehicles
      CreateGarageMenu()
      MenuColors = data.menucolors
      RefreshColors()
    }
    else if (data.action === "OpenMDTMenu"){
      OpenedMDT = true
      Cameras = data.cameras
      CamStatus = data.status
      MoneyForm = data.moneyform
      OpenFromJail = false
      Job = data.job
      Cops = data.cops
      Street = data.street
      PlayerName = data.name
      MenuColors = data.menucolors
      NoteRank = data.rank
      Incidents = data.incidents
      Licenses = data.licenses
      LicenseRank = data.licenserank
      CitizenCallRank = data.citizencallrank
      AllNames = data.names
      AllPlates = data.plates
      RefreshColors()
      document.getElementById("MDT").style.animation = "Show_panel 0.5s ease";
      $(".MDT").css("display","block")
      $("#jail_back_btn").css("display", "block")
      $(".LSDP_logo_img").attr('src', "assets/"+Job.job+".png")
      InsertHomeData()
      RefreshTime()
    }
    else if(data.action === "RefreshMDTMenu"){
      MDTTable = data.table
      if (data.value == 'search'){
        CreateSearchElements()
      }
      else if(data.value == 'incident'){
        if (MDTTable.length > 0){
          if (AddInvolved == 'add_vehicle'){
            if (Involveds[0].includes(MDTTable[0].plate) == false){
              Involveds[0].push(MDTTable[0].plate)
            }
          }
          else if (AddInvolved == 'add_people'){
            if (Involveds[1].includes(MDTTable[0].firstname+' '+MDTTable[0].lastname) == false){
              Involveds[1].push(MDTTable[0].firstname+' '+MDTTable[0].lastname)
            }
          }
        }
        RefreshInvolveds()
      }
    }
    else if(data.action === "MDTRefreshIncidents"){
      Incidents = data.table
      CreateIncidents()
      CreateTypeahead(".typeahead", Incidents, 'title')
      CreateTypeahead(".people_typeahead", AllNames, false)
      CreateTypeahead(".vehicle_typeahead", AllPlates, false)
    }
    else if(data.action === "MDTRefreshNotes"){
      Notes = data.table
      CreateNotes(false)
    }
    else if (data.action === "OpenShopMenu"){
      ShopItems = data.items
      MoneyForm = data.moneyform
      Card = data.card
      CreateShop(Card)
    }
    else if (data.action === "EnableCam"){
      CamLabel = data.label
      Connected = data.connected
      ShowCamMenu()
    }
    else if (data.action === "DisableCam"){
      HideCamMenu()
    }
    else if (data.action === "MDTShowLicences"){
      PlayerLicences = data.table
      CreateLicences()
    }
    else if (data.action === "MDTShowFines"){
      PlayerFines = data.table
      CreateFines()
    }
    else if (data.action === "OpenSendToJailMenu"){
      Player_target = data.target
      MenuColors = data.menucolors
      RefreshColors()
      $("#jail_back_btn").css("display", "none")
      $('#jail_reason_modal').modal('show')
      OpenFromJail = true
    }
    else if (data.action === "SpeedNotify"){
      PlayerSpeed = data.speed
      SpeedLimit = data.limit
      SpeedFine = data.amount
      Metric = data.metric
      MoneyForm = data.moneyform
      SpeedNotify()
    }
    else if (data.action === "JailHud"){
      JailMinute = data.jailminute
      $(".jail_hud h3").html(`${JailMinute} minutes left`)
      $(".jail_hud").css("display", "block")
    }
    else if (data.action === "HideJailHud"){
      $(".jail_hud").css("display", "none")
    }
    else if (data.action === "PlateReaderStatus"){
      if (data.enable == true){
        document.getElementById("plate").classList.add("vehicle_btn_active")
        $(".plate_reader").css("display", "block")
      }
      else{
        document.getElementById("plate").classList.remove("vehicle_btn_active")
        $(".plate_reader").css("display", "none")
      }
    }
    else if (data.action === "VehiclePanel"){
      $(".vehicle_menu").css("display", "block")
      MenuColors = data.menucolors
      RefreshColors()
    }
    else if (data.action === "HideVehiclePanel"){
      $(".vehicle_menu").css("display", "none")
    }
    else if (data.action === "VehicleSystem"){
      FrontVehicle = data.frontvehicle
      RearVehicle = data.rearvehicle
      Horn = data.horn
      Siren = data.siren
      Light = data.vehiclelight

      if (Horn == true){
        document.getElementById("horn").classList.add("vehicle_btn_active")
      }
      else{
        document.getElementById("horn").classList.remove("vehicle_btn_active")
      }

      if (Siren == true){
        document.getElementById("siren").classList.add("vehicle_btn_active")
      }
      else{
        document.getElementById("siren").classList.remove("vehicle_btn_active")
      }

      if (Light == true){
        document.getElementById("light").classList.add("vehicle_btn_active")
      }
      else{
        document.getElementById("light").classList.remove("vehicle_btn_active")
      }

      if (FrontVehicle.plate != ""){
        document.getElementById("front_speed").innerHTML = FrontVehicle.speed
        document.getElementById("front_plate").innerHTML = FrontVehicle.plate
        $(".plate_reader #top").css("background-color","rgb(59, 196, 28)")
      }
      else{
        $(".plate_reader #top").css("background-color","rgb(196, 28, 28)")
      }
      if (RearVehicle.plate != ""){
        document.getElementById("rear_speed").innerHTML = RearVehicle.speed
        document.getElementById("rear_plate").innerHTML = RearVehicle.plate
        $(".plate_reader #bottom").css("background-color","rgb(59, 196, 28)")
      }
      else{
        $(".plate_reader #bottom").css("background-color","rgb(196, 28, 28)")
      }
    }
    else if (data.action === "VehiclePanelEdit"){
      InPanelPos = true
      dragElement(document.getElementById("vehicle_control"))
      dragElement(document.getElementById("plate_reader"))
    }
    else if(data.action === "CitizenCallMenu"){
      document.getElementById("create_citizen_call").style.animation = "Appear_Menu 0.5s ease";
      $("#create_citizen_call").css("display", "block")
    }
    else if(data.action === "MDTGetCitizenCalls"){
      CitizenCalls = data.table
      PlayerId = data.myid
      CurrentTime = data.time
      CreateCitizenCalls()
    }
    else if(data.action === "LiveryMenu"){
      document.getElementById("vehicle_livery").style.animation = "Appear_Menu 0.5s ease";
      $(".vehicle_livery").css("display", "block")
      $("#livery").html("Livery: "+data.livery)
    }
    else if(data.action === "HideLiveryMenu"){
      document.getElementById("vehicle_livery").style.animation = "Hide_panel 0.5s ease";
      setTimeout(function(){
        $(".vehicle_livery").css("display","none")
      }, 400)
    }
    else if(data.action === "AreaLockMenu"){
      MenuColors = data.menucolors
      RefreshColors()
      document.getElementById("area_lock").style.animation = "Appear_Menu 0.5s ease";
      $("#area_lock").css("display", "block")
    }
	else if(data.action === "RemoveObjects"){
		document.getElementById("delete_object").style.animation = "Appear_Menu 0.5s ease";
		$(".delete_object").css("display", "block")
	}
	else if(data.action === "HideRemoveObjects"){
		document.getElementById("delete_object").style.animation = "Hide_panel 0.5s ease";
		setTimeout(function(){
			$(".delete_object").css("display","none")
		}, 400)
	}
    else if (data.action === "ControlReleased"){
      Control = data.control
      if(Control === "up" || Control === "down" ){
        ChangeFocus(Control)
      }
      else if(Control === "enter"){
        document.getElementById("circle_"+ChoosedButton).click()
      }
      else if(Control === "backspace"){
        if(InSubMenu){
          BackPoliceMenu()
        }
        else{
          Close()
        }
      }
    }
})

document.onkeydown = function(data) {
  if (event.key == 'Escape') {
    Close()
  }
}

function Close(){
  HideInteractionMenu()
  HidePoliceMenu()
  CloseShop()
  CloseMDT()
  CloseCitizenCall()
  CloseAreaLock()
  setTimeout(function(){
    $('.modal').modal('hide')
  },500)
  if (InPanelPos == true){
    let vc = document.getElementById("vehicle_control")
    let vp = document.getElementById("plate_reader")

    localStorage.setItem("VehControlTop", vc.style.top)
    localStorage.setItem("VehControlLeft", vc.style.left)
    localStorage.setItem("VehPlateTop", vp.style.top)
    localStorage.setItem("VehPlateLeft", vp.style.left)
  }
  InPanelPos = false
  $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"close"}))
}

function RefreshColors(){
  var r = document.querySelector(':root')
  r.style.setProperty('--main_color', MenuColors[0])
  r.style.setProperty('--main_color_darker', MenuColors[1])
}

function RefreshTime(){
  if (OpenedMDT){
    setTimeout(function(){
      RefreshTime()
    },100)
  }
  
  var date=new Date();  
  var day=date.getDate();  
  var month=date.getMonth()+1;  
  var year=date.getFullYear();  
  $("#home_date").html(day+"/"+month+"/"+year+"<br>"+date.toLocaleTimeString()); 
}

function InsertHomeData(){
  $("#available_cops").html(Cops)
  $("#player_rang").html(Job.label)
  $("#salary").html(Job.salary+MoneyForm)
  $("#job_name").html(Job.name+" - Database")
  $("#street").html(`<i class="fa-solid fa-location-dot"></i> `+Street[0]+",<br>"+Street[1])
  $(".welcome_text .hand_written").html(PlayerName)
}

function ChangeFocus(direction){
  if(direction === "up"){
    if(InSubMenu === false){
      if(InteractionsTable.length >= ChoosedButton +2){
        ChoosedButton++
      }
      else if(InteractionsTable.length === ChoosedButton +1){
        ChoosedButton = 0
      }
    }
    else{
      if(InteractionsTable[SubNumber].table.length > ChoosedButton + 1){
        ChoosedButton++
      }
      else if(InteractionsTable[SubNumber].table.length === ChoosedButton +1){
        ChoosedButton = 0
      }
    }
  }
  else{
    if(InSubMenu === false){
      if(ChoosedButton === 0){
        ChoosedButton = InteractionsTable.length -1
      }
      else{
        ChoosedButton = ChoosedButton -1
      }
    }
    else{
      if(ChoosedButton === 0){
        ChoosedButton = InteractionsTable[SubNumber].table.length -1
      }
      else{
        ChoosedButton = ChoosedButton -1
      }
    }
  }

  if(InSubMenu){
    for(let i=0; i<InteractionsTable[SubNumber].table.length; i++){
      document.getElementById("circle_"+i).classList.remove("hovered_circle")
    }
    Circle_Label = InteractionsTable[SubNumber].table[ChoosedButton].label
  }
  else{
    for(let i=0; i<InteractionsTable.length; i++){
      document.getElementById("circle_"+i).classList.remove("hovered_circle")
    }
    Circle_Label = InteractionsTable[ChoosedButton].label
  }

  document.getElementById("circle_"+ChoosedButton).classList.add("hovered_circle")
  $(".circles_label").html(Circle_Label)

  if(InSubMenu){
	let idnumber = ChoosedButton
	for(let i=0; i<InteractionsTable[SubNumber].table.length; i++){
	  if (i == idnumber){
		  $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"PoliceMenuSetObject", id:InteractionsTable[SubNumber].table[i].id}))
		break
	  }
	}
  }
}

function CreatePoliceMenu(){
  InSubMenu = false
  let Num_elements = InteractionsTable.length
  let Angle = 144/(Num_elements-1)
  let Rot = -108

  document.getElementById("police_menu").style.animation = "ShowPoliceMenu 1s ease";

  $(".police_menu").css("display","block")

  $(".circle_container").html("")
  for(let i=0; i<Num_elements; i++){
    if (InteractionsTable[i].table == undefined){
      $(".circle_container").append(`
      <button class="circle_element" id="circle_${i}" onclick="SendBackIntButton(id, false)">${InteractionsTable[i].icon}</button>
      `)
    }
    else{
      $(".circle_container").append(`
      <button class="circle_element" id="circle_${i}" onclick="ChangePoliceButtons(id)">${InteractionsTable[i].icon}</button>
      `)
    }
    
    $(".police_menu #circle_"+i).css("transform", "rotate("+Rot+"deg) translate(150px) rotate("+Rot*(-1)+"deg)")
    Rot = Rot - Angle
  }
  document.getElementById("circle_"+ChoosedButton).classList.add("hovered_circle")
  $(".circles_label").html(InteractionsTable[0].label)
}

function HidePoliceMenu(){
  document.getElementById("police_menu").style.animation = "HidePoliceMenu 1s ease";
  setTimeout(function(){
    $(".police_menu").css("display","none")
  },900)
}

function ChangePoliceButtons(id){
  InSubMenu = true
  document.getElementById("police_menu").style.animation = "ChangePoliceMenu 0.8s ease";

  SubNumber = id.split('_').pop();
  let Num_elements = InteractionsTable[SubNumber].table.length
  let Angle = 144/(Num_elements-1)
  let Rot = -108

  setTimeout(function(){
    $(".circle_container").html("")
    for(let i=0; i<Num_elements; i++){
      $(".circle_container").append(`
      <button class="circle_element" id="circle_${i}" onclick="SendBackIntButton(id, true)">${InteractionsTable[SubNumber].table[i].icon}</button>
      `)
      $(".police_menu #circle_"+i).css("transform", "rotate("+Rot+"deg) translate(150px) rotate("+Rot*(-1)+"deg)")
      Rot = Rot - Angle
    }
    ChoosedButton = 0
    document.getElementById("circle_"+ChoosedButton).classList.add("hovered_circle")
    $(".circles_label").html(InteractionsTable[SubNumber].table[0].label)
  },400)

  if (SubNumber == 2){
	$.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"PoliceMenuObject"}))
  }
}

function BackPoliceMenu(){
  InSubMenu = false
  let Num_elements = InteractionsTable.length
  let Angle = 144/(Num_elements-1)
  let Rot = -108

  document.getElementById("police_menu").style.animation = "BackPoliceMenu 0.8s ease";

  setTimeout(function(){
    $(".circle_container").html("")
    for(let i=0; i<Num_elements; i++){
      if (InteractionsTable[i].table == undefined){
        $(".circle_container").append(`
        <button class="circle_element" id="circle_${i}" onclick="SendBackIntButton(id, false)">${InteractionsTable[i].icon}</button>
        `)
      }
      else{
        $(".circle_container").append(`
        <button class="circle_element" id="circle_${i}" onclick="ChangePoliceButtons(id)">${InteractionsTable[i].icon}</button>
        `)
      }
      $(".police_menu #circle_"+i).css("transform", "rotate("+Rot+"deg) translate(150px) rotate("+Rot*(-1)+"deg)")
      Rot = Rot - Angle
    }
    ChoosedButton = 0
    document.getElementById("circle_"+ChoosedButton).classList.add("hovered_circle")
    $(".circles_label").html(InteractionsTable[0].label)
  },400)
}

function SendBackIntButton(id, value){
  let idnumber = id.split('_').pop()
  
  if (value == true){
    let number = +SubNumber + 1
    for(let i=0; i<InteractionsTable[SubNumber].table.length; i++){
      if (i == idnumber){
        $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"PoliceMenu", id:InteractionsTable[SubNumber].table[i].id, number}))
        break
      }
    }
  }
  else{
    for(let i=0; i<InteractionsTable.length; i++){
      if (i == idnumber){
        HidePoliceMenu()
        $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"PoliceMenu", id:InteractionsTable[i].id, idnumber}))
        break
      }
    }
  }
  
}

function CreateDressMenu(){
  $(".interactions h2").html("Cloak room")

  $(".int_con_sec").html("")
  for(let i=0; i<Outfits.length; i++){
    $(".int_con_sec").append(`
    <div class="col">
        <div class="d-flex flex-column justify-content-center align-items-center">
            <button class="long_btn mb-3" id="${Outfits[i].id}" onclick="SetDress(id)">${Outfits[i].label}</button>
        </div>
    </div>
    `)
    if (Outfits[i].label.length > 17){
      $("#"+Outfits[i].id).css("font-size", "15px")
    }
  }
  document.getElementById("interactions").style.animation = "ShowIneractionMenu 0.7s ease";
  $(".interactions").css("display","block")
}

function HideInteractionMenu(){
  document.getElementById("interactions").style.animation = "HideInteractionMenu 0.7s ease";
  setTimeout(function(){
    $(".interactions").css("display","none")
  },680)
}

function SetDress(id){
  $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"SetDress", id}))
}

function CreateArmoryMenu(){
  $(".interactions h2").html("Storage")

  $(".int_con_sec").html("")
  $(".int_con_sec").html(`
		<div class="col">
			<div class="d-flex flex-column justify-content-center align-items-center">
			<button class="long_btn mb-3" onclick="Armory()">Armory</button>
			</div>
		</div>
		<div class="col">
			<div class="d-flex flex-column justify-content-center align-items-center">
			<button class="long_btn mb-3" onclick="Buy()">Shop</button>
			</div>
		</div>
	`)

  document.getElementById("interactions").style.animation = "ShowIneractionMenu 0.7s ease";
  $(".interactions").css("display","block")
}

function Armory(){
  Close()
  $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"Armory"}))
}

function Buy(){
  HideInteractionMenu()
  $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"Buy"}))
}

function CreateGarageMenu(){
  $(".interactions h2").html("Garage")

  $(".int_con_sec").html("")
  for(let i=0; i<Vehicles.length; i++){
    $(".int_con_sec").append(`
    <div class="col">
        <div class="d-flex flex-column justify-content-center align-items-center">
            <button class="long_btn mb-3" id="${Vehicles[i].model}-${Vehicles[i].livery}" onclick="SpawnVehicle(id)">${Vehicles[i].label}</button>
        </div>
    </div>
    `)
    if (Vehicles[i].label.length > 17){
      $("#"+Vehicles[i].model+"-"+Vehicles[i].livery).css("font-size", "15px")
    }
  }
  document.getElementById("interactions").style.animation = "ShowIneractionMenu 0.7s ease";
  $(".interactions").css("display","block")
}

function SpawnVehicle(id){
  model = id.split('-')[0]
  livery = id.split('-')[1]
  Close()
  $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"SpawnVehicle", model, livery}))
}

function RefreshSearchBTN(){
  if (InSearchMenu == "people"){
    let first_name = document.getElementById("in_first_name").value
    let last_name = document.getElementById("in_last_name").value

    if (first_name.length > 0 || last_name.length > 0 ){
      document.getElementById("search_btn").disabled = false
    }
    else{
      document.getElementById("search_btn").disabled = true
    }
  }
  else{
    let plate = document.getElementById("in_plate").value

    if (plate.length > 0){
      document.getElementById("search_btn").disabled = false
    }
    else{
      document.getElementById("search_btn").disabled = true
    }

  }
}

function ChangeSearch(id){
  $(".table_container").html(`
    <div class="text-white text-center">
      <h2>No results found</h2>
    </div>
  `)
  if (id === "people"){
    InSearchMenu = "people"
    $("#title_text").html("Person details")
    $(".search_in_container").html(`
    <div class="row">
      <div class="col">
        <div class="input-group input-group-lg">
          <input type="text" id="in_first_name" class="form-control" placeholder="First name" oninput="RefreshSearchBTN()">
        </div>
      </div>
      <div class="col">
        <div class="input-group input-group-lg">
          <input type="text" id="in_last_name" class="form-control" placeholder="Last name" oninput="RefreshSearchBTN()">
        </div>
      </div>
    </div>
    `)
    $("#fcell").html("First name")
    $("#scell").html("Last name")
    $("#tcell").html("Sex")
    document.getElementById("search_btn").disabled = true
  }
  else{
    InSearchMenu = "vehicle"
    $("#title_text").html("Vehicle details")
    $(".search_in_container").html(`
    <div class="input-group input-group-lg float-end">
      <input type="text" id="in_plate" class="form-control" placeholder="Plate" oninput="RefreshSearchBTN()">
    </div>
    `)
    $("#fcell").html("Plate")
    $("#scell").html("Model")
    $("#tcell").html("Type")
    document.getElementById("search_btn").disabled = true
  }
}

function RefreshDetailsModal(id){
  MDTTableNum = id
  if (InSearchMenu == "people"){
    if (MDTTable[id].jail_time > 0){
        $("#details_modal .datas_container").html(`
        <div class="row">
          <div class="col">
        <div class="img_container">
              
        </div>
        <div class="text-center mt-3">
          <h4><b>Name:</b> ${MDTTable[id].firstname} ${MDTTable[id].lastname}</h4>
          <h4><b>Sex:</b> ${MDTTable[id].sex}</h4>
          <h4><b>Birth:</b> ${MDTTable[id].dateofbirth}</h4>
        </div>
          </div>
          <div class="col">
              <h3><b>Licences</b></h3>
              <div class="licences_container mb-3">
  
              </div>
              <h3><b>Actions</b></h3>
              <button class="details_btn px-3 m-2" id="jail" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#jail_reason_modal" disabled>Jail</button>
              <button class="details_btn px-3 m-2" onclick="SendUnjail()" data-bs-dismiss="modal" >Unjail</button>
              <button class="details_btn px-3 m-2" id="fine" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#fine_modal">Give fine</button>
              <br>
              <button class="details_btn px-3 m-2" id="show_fines" onclick="SendFines()" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#player_fines_modal">Show fines</button>
              <button class="details_btn px-3 m-2" id="show_incidents" onclick="GetIncidents('${MDTTable[id].firstname} ${MDTTable[id].lastname}', true)" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#player_incidents_modal">Incidents</button>
          </div>
      </div>
      `) 
    }
    else{
        $("#details_modal .datas_container").html(`
        <div class="row mt-2">
          <div class="col">
        <div class="img_container">
            
        </div>
              <div class="text-center mt-3">
                  <h4><b>Name:</b> ${MDTTable[id].firstname} ${MDTTable[id].lastname}</h4>
                  <h4><b>Sex:</b> ${MDTTable[id].sex}</h4>
                  <h4><b>Birth:</b> ${MDTTable[id].dateofbirth}</h4>
              </div>
          </div>
          <div class="col">
              <h3><b>Licences</b></h3>
              <div class="licences_container mb-3">
  
              </div>
              <h3><b>Actions</b></h3>
              <button class="details_btn px-3 m-2" id="jail" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#jail_reason_modal">Jail</button>
              <button class="details_btn px-3 m-2" onclick="SendUnjail()" disabled>Unjail</button>
              <button class="details_btn px-3 m-2" id="fine" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#fine_modal">Give fine</button>
              <br>
              <button class="details_btn px-3 m-2" id="show_fines" onclick="SendFines()" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#player_fines_modal">Show fines</button>
              <button class="details_btn px-3 m-2" id="show_incidents" onclick="GetIncidents('${MDTTable[id].firstname} ${MDTTable[id].lastname}', true)" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#player_incidents_modal">Incidents</button>
            </div>
      </div>
      `)
    }
    CreateNotes(true)
    
    let TargetIdentifier = MDTTable[MDTTableNum].identifier
    $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTUserAction", type:"getlicences", TargetIdentifier}))
  }
  else{
      $("#details_modal .datas_container").html(`
      <div class="row">
        <div class="col">
            <div class="text-center mt-3">
                <h4><b>Plate:</b> ${MDTTable[id].plate}</h4>
                <h4><b>Model:</b> ${MDTTable[id].model}</h4>
                <h4><b>Type:</b> ${MDTTable[id].class}</h4>
                <h4><b>Owner:</b> ${MDTTable[id].owner}</h4>
            </div>
            <button class="details_btn mx-auto d-block px-3" id="show_incidents" onclick="GetIncidents('${MDTTable[id].plate}', false)" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#player_incidents_modal">Incidents</button>
        </div>
        <div class="col img_container">
          
        </div>
      </div>
      `)
    CreateNotes(true)
  }
  CreateIMG()
}

function CreateIMG(){
	if (MDTTable[MDTTableNum].photo != null && MDTTable[MDTTableNum].photo.length > 0){
		$(".img_container").html(`
		<img class="veh_img mx-auto d-block mt-3" src="${MDTTable[MDTTableNum].photo}"></img>
		<button class="edit_img mx-auto d-block" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#add_img_modal"><i class="fa-solid fa-pen"></i></button>
	  	`)
	}
	else{
		$(".img_container").html(`
		<button class="veh_add_img mx-auto d-block mt-3" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#add_img_modal" ><i class="fa-solid fa-plus"></i></button>
	  	`)
	}
}

function AddIMG(){
  let Plate = MDTTable[MDTTableNum].plate
  let Url = document.getElementById("in_add_img").value

  $(".img_container").html(`
    <img class="veh_img mx-auto d-block mt-3" src="${Url}"></img>
    <button class="edit_img mx-auto d-block" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#add_img_modal"><i class="fa-solid fa-pen"></i></button>
  `)

  if (InSearchMenu == "people"){
    let TargetIdentifier = MDTTable[MDTTableNum].identifier
    $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTUserAction", type:"edit_photo", TargetIdentifier, Url}))
  }
  else{
    $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTVehicleAction", type:"edit_photo", Plate, Url}))
  }
  
  document.getElementById("in_add_img").value = ""
  
  setTimeout(function(){
    DoSearch()
  }, 1000)
}

function CreateSearchElements(){
  $(".table_container").html("")
  if (MDTTable.length > 0){
    if (InSearchMenu == "people"){
      for(let i=0; i<MDTTable.length; i++){
        $(".table_container").append(`
          <div class="table_element">
		  <div class="background_effect"></div>
              <table class="table table-borderless">
                  <tbody>
                      <tr>
                          <th class="cell align-middle">${MDTTable[i].firstname}</th>
                          <th class="cell align-middle">${MDTTable[i].lastname}</th>
                          <th class="cell align-middle">${MDTTable[i].sex}</th>
                          <th class="cell align-middle"><button class="details_btn px-2" id="${i}" data-bs-toggle="modal" data-bs-target="#details_modal" onclick="RefreshDetailsModal(id)">More details</button></th>
                      </tr>
                  </tbody>
              </table>
          </div>
        `)
      }
    }
    else{
      for(let i=0; i<MDTTable.length; i++){
        $(".table_container").append(`
          <div class="table_element">
              <table class="table table-borderless">
                  <tbody>
                      <tr>
                          <th class="cell align-middle">${MDTTable[i].plate}</th>
                          <th class="cell align-middle">${MDTTable[i].model}</th>
                          <th class="cell align-middle">${MDTTable[i].class}</th>
                          <th class="cell align-middle"><button class="details_btn px-2" id="${i}" data-bs-toggle="modal" data-bs-target="#details_modal" onclick="RefreshDetailsModal(id)">More details</button></th>
                      </tr>
                  </tbody>
              </table>
          </div>
        `)
      }
    }
  }
  else{
    $(".table_container").append(`
    <div class="text-white text-center">
      <h2>No results found</h2>
    </div>
    `)
  }
}

function CreateLicences(){
    $(".licences_container").html("")

    if (PlayerLicences == "false"){
      $(".licences_container").html(`
      <div class="text-white text-center mt-3">
        <h4>The player in not online</h4>
      </div>
      `)
    }
    else if(PlayerLicences == "none"){
      $(".licences_container").html(`
      <div class="text-white text-center mt-3">
        <h4>No licences found</h4>
      </div>
      `)
    }
    else{
      if (PlayerLicences.length != 0){
        for(let i=0; i<PlayerLicences.length; i++){
          $(".licences_container").append(`
          <div class="licence_element px-2">${PlayerLicences[i].label}<button class="licence_btn" id="licence_${i}" onclick="RemoveLicence(id)"><i class="fa-solid fa-x"></i></button></div>
          `)
        }
      }
      else{
        $(".licences_container").html(`
        <div class="text-white text-center mt-3">
          <h4>No licences found</h4>
        </div>
        `)
      }
    }

    if (Licenses.length != 0){
      for(let i=0; i<Licenses.length; i++){
        let have = false
        for(let _i=0; _i<PlayerLicences.length; _i++){
          if (PlayerLicences[_i].type == Licenses[i][0]){
            have = true
          }
        }
        if (have == false && Job.rank >= LicenseRank){
          $(".licences_container").append(`
          <div class="licence_element add px-2">${Licenses[i][1]}<button class="licence_btn" id="addlicence_${i}" onclick="AddLicence(id,'${Licenses[i][0]}', '${Licenses[i][1]}')"><i class="fa-solid fa-plus"></i></button></div>
          `)
        }
      }
    }
    
    PressedLicence[0] = 0
    PressedLicence[1] = 0
}

function AddLicence(id, license, label){
  let TargetIdentifier = MDTTable[MDTTableNum].identifier
  let LicenceType = license

  for(let i=0; i<PlayerLicences.length; i++){
    $("#addlicence_"+i).css("color", "white")
  }

  if (PressedLicence[0] == 0){
    $("#"+id).css("color", "green")
    PressedLicence[0] = 1
    PressedLicence[1] = id
  }
  else if (PressedLicence[0] == 1 && PressedLicence[1] == id){
    $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTUserAction", type:"addlicence", TargetIdentifier, LicenceType}))
    if (PlayerLicences == "false" || PlayerLicences == "none"){
      PlayerLicences = []
    }
    PlayerLicences.push({'label' : label, 'type' : license})
    CreateLicences()
  }
  else if (PressedLicence[0] == 1){
    $("#"+id).css("color", "green")
    PressedLicence[1] = id
  }
}

function RemoveLicence(id){
  let TargetIdentifier = MDTTable[MDTTableNum].identifier
  let num = id.split('_')[1]
  let LicenceType = PlayerLicences[num].type

  for(let i=0; i<PlayerLicences.length; i++){
    $("#licence_"+i).css("color", "white")
  }

  if (PressedLicence[0] == 0){
    $("#"+id).css("color", "red")
    PressedLicence[0] = 1
    PressedLicence[1] = id
  }
  else if (PressedLicence[0] == 1 && PressedLicence[1] == id){
    $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTUserAction", type:"removelicence", TargetIdentifier, LicenceType}))
    delete PlayerLicences.splice(num, 1)
    CreateLicences()
  }
  else if (PressedLicence[0] == 1){
    $("#"+id).css("color", "red")
    PressedLicence[1] = id
  }
}

function DoSearch(){
  if (InSearchMenu == "people"){
    value1 = document.getElementById("in_first_name").value
    value2 = document.getElementById("in_last_name").value

    if (value1.length > 0 && value2.length === 0){
      SearchType = "firstname"
    }
    else if(value1.length === 0 && value2.length > 0){
      SearchType = "lastname"
    }
    else if(value1.length > 0 && value2.length > 0){
      SearchType = "fullname"
    }

    $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTGetData", type:SearchType, value1, value2, value3:'search'}))
  }
  else{
    SearchType = "plate"
    value1 = document.getElementById("in_plate").value
    $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTGetData", type:SearchType, value1, value3:'search'}))
  }
}

function CreateShop(value){
  $(".shop").css("display", "block")
  setTimeout(function(){
    $(".shop").css("scale", "1")
  }, 50)

  if (value == true){
    $(".slider_btn").css("display", "block")
    $("#shop_back").css("display", "block")
  }
  else{
    $(".slider_btn").css("display", "none")
    $("#shop_back").css("display", "none")
  }

  $(".shop_elements_container").html("")
  for(let i=0; i<ShopItems.length; i++){
    $(".shop_elements_container").append(`
    <div class="col">
        <div class="d-flex flex-column justify-content-center align-items-center">
            <div class="shop_element">
                <div class="price">${ShopItems[i].price+MoneyForm}</div>
                <img class="mx-auto d-block" src="assets/${ShopItems[i].item}.png"></img>
                <h4>${ShopItems[i].label}</h4>
                <div class="mx-auto d-block">
                    <div class="input-group input-group-lg num">
                        <input class="form-control" id="${ShopItems[i].item}" type="text" autofocus="autofocus" value="0" oninput="setlenght(id)" onkeypress="return isNumber(event)">
                    </div>
                </div>
            </div>
        </div>
    </div>
    `)
  }
}

function CloseShop(){
  $(".shop").css("scale", "0")
  setTimeout(function(){
    $(".shop").css("display", "none")
  }, 600)
}

function changemoney(){
  let AllMoney = 0
  for (let i = 0; i < ShopItems.length; i++) {
    AllMoney += ShopItems[i].price * document.getElementById(ShopItems[i].item).value
  }
  $('.checkout_container h3').html('TOTAL: '+AllMoney+'<money>'+MoneyForm+'</money>')
}

function BuyInShop(){
  BuyItems = []
  for (let i = 0; i < ShopItems.length; i++) {
    if (document.getElementById(ShopItems[i].item).value > 0){
      BuyItems.push([ShopItems[i].item, document.getElementById(ShopItems[i].item).value, ShopItems[i].price, ShopItems[i].label])
    }
  }

  if (BuyItems.length > 0){
    let Element = document.getElementById("slider_shop")
    let Left = Element.offsetLeft
    if (Left == 0){
      $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"BuyInShop", BuyItems, paytype:"money"}))
    }
    else{
      $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"BuyInShop", BuyItems, paytype:"bank"}))
    }
  }

  setTimeout(function(){
    for (let i = 0; i < ShopItems.length; i++) {
      document.getElementById(ShopItems[i].item).value = 0
    }
    changemoney()
  }, 200)
}

function ChangeSliderbtn(id){
  if (id == "shop_slider"){
    let Element = document.getElementById("slider_shop")
    let Left = Element.offsetLeft
    if (Left == 0){
      Element.style.left = "50%"
    }
    else{
      Element.style.left = "0%"
    }
  }
  else if (id == "MDT_slider"){
    let Element = document.getElementById("slider_MDT")
    let Left = Element.offsetLeft
    if (Left == 0){
      Element.style.left = "50%"
      ChangeSearch("vehicles")
    }
    else{
      Element.style.left = "0%"
      ChangeSearch("people")
    }
  }
}

function isNumber(evt) {
  evt = (evt) ? evt : window.event
  var charCode = (evt.which) ? evt.which : evt.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false
  }
  return true
}

function setlenght(id) {
  if (document.getElementById(id).value.length === 2 && document.getElementById(id).value[0] == 0){
    document.getElementById(id).value = document.getElementById(id).value.substring(1)
  }
  if (document.getElementById(id).value.length === 4){
    document.getElementById(id).value = document.getElementById(id).value.substring(1)
  }
  if (document.getElementById(id).value.length === 0){
    document.getElementById(id).value = 0
  }
  changemoney()
  return true
}

function SwitchPage(id){
  $("#camera").css("border", "none")
  $("#search").css("border", "none")
  $("#sos_alert").css("border", "none")
  $("#home").css("border", "none")
  $("#incidents").css("border", "none")
  $("#"+id).css("border-bottom", "solid 3px var(--main_color)")

  if (id == "home"){
    MoveBackLogo()
    $(".page_data_container").html(`
    <div class="home_label mt-3">
        <div class="row">
            <div class="col ms-3 mt-1" id="job_name"></div>
            <div class="col-2 mt-1" id="home_date">date 213 23</div>
            <div class="col me-3 mt-1 text-end" id="street"></div>
        </div>
    </div>

    <div class="row mt-3 mx-2">
        <div class="col">
            <div class="home_stat_con mx-auto d-block">
                <div class="label">Cops</div>
                <div class="main" id="available_cops">0</div>
            </div>
        </div>
        <div class="col">
            <div class="home_stat_con mx-auto d-block">
                <div class="label">Rank</div>
                <div class="main small" id="player_rang"></div>
            </div>
        </div>
        <div class="col">
            <div class="home_stat_con mx-auto d-block">
                <div class="label">Salary</div>
                <div class="main" id="salary">100$</div>
            </div>
        </div>
    </div>

    <div class="welcome_text mt-3">Welcome,<br> <span class="hand_written">Name</span></div>
      
    `)
    InsertHomeData()
  }
  else if (id == "search"){
    MoveLogo()
    $(".page_data_container").html(`
        <div class="slider_btn" id="MDT_slider" onclick="ChangeSliderbtn(id)">
            <div class="slider" id="slider_MDT"></div>
                <div class="row button_container">
                    <div class="col"><i class="fa-solid fa-users"></i></div>
                    <div class="col"><i class="fa-solid fa-car"></i></div>
                </div>
        </div>
        <div class="row row-cols-1">
        <div class="col">
              <div class="d-flex align-items-center justify-content-end" style="padding-top: 10px; padding-bottom: 20px;">
                  <div class="search_in_container">
                    <div class="row">
                      <div class="col">
                        <div class="input-group input-group-lg">
                          <input type="text" id="in_first_name" class="form-control" placeholder="First name" oninput="RefreshSearchBTN()">
                        </div>
                      </div>
                      <div class="col">
                        <div class="input-group input-group-lg">
                          <input type="text" id="in_last_name" class="form-control" placeholder="Last name" oninput="RefreshSearchBTN()">
                        </div>
                      </div>
                    </div>
                  </div>
                  <button class="search_btn mx-3 float-end" id="search_btn" disabled onclick="DoSearch()">Search</button>
              </div>
        </div>
        <div class="col">
            <div class="table_header">
                <table class="table table-borderless">
                    <tbody>
                        <tr>
                            <th class="cell align-middle" id="fcell">First name</th>
                            <th class="cell align-middle" id="scell">Last name</th>
                            <th class="cell align-middle" id="tcell">Sex</th>
                            <th class="cell align-middle">Action</th>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table_container">
              <div class="text-white text-center">
                <h2>No results found</h2>
              </div>
            </div>
        </div>
    </div>
    `)
  }
  else if (id == "camera"){
    MoveLogo()
    $(".page_data_container").html(`
      <div class="cam_shadow">
      </div>
      <div class="row mx-3 mt-3 cam_container">
      </div>
    `)
    CreateCameraElements()
  }
  else if (id == "sos_alert"){
    MoveLogo()
    $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTCitizenCall", type:"getcalls"}))
    $(".page_data_container").html(`
      <div class="cam_shadow">
      </div>
      <div class="alert_container_out mt-3">
        <div class="alert_container row row-cols-2 p-4">
                          
        </div>
      </div>
    `)
  }
  else if (id == "incidents"){
    MoveLogo()
    $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTIncident"}))
    $(".page_data_container").html(`
      <div class="title my-2">INCIDENTS</div>

      <div class="small_con">
          <div class="big_label mt-2">INCIDENTS</div>
          <div class="input-group input-group-lg mt-2" style="width: 310px;">
              <input type="text" id="search_incidents" class="form-control text-center fw-normal rounded typeahead"  data-provide="typeahead" placeholder="Search" onkeyup="SearchIncidents(id)">
          </div>
          <div class="incidents_con mt-3">

          </div>
      </div>

      <div class="big_con">
          <div class="light"></div>
          <div class="big_label mt-2" id="incident_main_label">CREATE</div>

          <div class="row mx-2 mt-3">
              <div class="col">
                  <div class="small_label">TITLE</div>
                  <div class="input-group input-group-lg mt-2" style="width: 238px;">
                      <input type="text" id="incident_title" class="form-control text-center" placeholder="Title" oninput="RefreshAddToInvolvedBTN(id)">
                  </div>

                  <div class="small_label mt-4">VEHICLE INVOLVED</div>
                  <div class="row m-0 p-0">
                      <div class="col m-0 p-0">
                          <div class="input-group input-group-lg mt-2" style="width: 197px;">
                              <input type="text" id="add_involved_vehicle" class="form-control text-center fw-normal typeahead rounded vehicle_typeahead" data-provide="vehicle_typeahead" placeholder="Search" oninput="RefreshAddToInvolvedBTN(id)">
                          </div>
                      </div>
                      <div class="col m-0 p-0">
                          <button class="add_btn mt-2" id="add_vehicle" disabled onclick="AddToInvolved(id)"><i class="fa-solid fa-plus"></i></button>
                      </div>
                  </div>
                  <div class="involved_con empty mt-2" id="involvedcon_0">
                      
                  </div>
              </div>
              <div class="col">
                  <div class="small_label">PEOPLE INVOLVED</div>
                  <div class="row m-0 p-0">
                      <div class="col m-0 p-0">
                          <div class="input-group input-group-lg mt-2" style="width: 197px;">
                              <input type="text" id="add_involved_people" class="form-control text-center fw-normal rounded typeahead people_typeahead" data-provide="people_typeahead" placeholder="Search" oninput="RefreshAddToInvolvedBTN(id)">
                          </div>
                      </div>
                      <div class="col m-0 p-0">
                          <button class="add_btn mt-2" id="add_people" disabled onclick="AddToInvolved(id)"><i class="fa-solid fa-plus"></i></button>
                      </div>
                  </div>
                  <div class="involved_con mt-2 empty" id="involvedcon_1">

                  </div>

                  <div class="small_label mt-4">SOCIETY INVOLVED</div>
                  <div class="row m-0 p-0">
                      <div class="col m-0 p-0">
                          <div class="input-group input-group-lg mt-2" style="width: 197px;">
                              <input type="text" id="add_involved_society" class="form-control text-center fw-normal rounded" placeholder="Search" oninput="RefreshAddToInvolvedBTN(id)">
                          </div>
                      </div>
                      <div class="col m-0 p-0">
                          <button class="add_btn mt-2" id="add_society" disabled onclick="AddToInvolved(id)"><i class="fa-solid fa-plus"></i></button>
                      </div>
                  </div>
                  <div class="involved_con empty mt-2" id="involvedcon_2">
                      
                  </div>
              </div>
          </div>

          <div class="wide_label">CONTENT</div>
          <div class="input-group description">
              <textarea class="form-control" id="incident_content" placeholder=""></textarea>
          </div>
          <div class="row bottom_btn_con">
              <div class="col p-0">
                  <button class="create_incident px-3" id="create_incident" disabled onclick="CreateIncident()">CREATE</button>
              </div>
          </div>
      </div>
    `)
    Involveds = [[],[],[]]
    RefreshInvolveds()
    $(".MDT .big_con .light").css("background-color", "#94969e")
  }
}

function MoveLogo(){
  $(".LSDP_logo_img").css({
    "height": "80px",
    "left": "15.2px",
  })
}

function MoveBackLogo(){
  $(".LSDP_logo_img").css({
    "height": "200px",
    "left": "870px",
  })
}

function CreateCameraElements(){
  $(".cam_container").html("")
  for (let i = 0; i < Cameras.length; i++) {
    if (CamStatus[i] == true){
      $(".cam_container").append(`
      <div class="col">
          <div class="camera_element mx-auto d-block">
          <div class="background_effect"></div>
              <img class="mx-auto d-block" src="${Cameras[i].img}"></img>
              <h4>${Cameras[i].label}</h4>
              <button class="details_btn px-3 mt-3 mx-auto d-block" id="cam_${i}" onclick="SendCameraBack(id)">Show live</button>
          </div>
      </div>
    `)
    }
    else{
      $(".cam_container").append(`
      <div class="col">
          <div class="camera_element mx-auto d-block">
          <div class="background_effect"></div>
              <img class="mx-auto d-block" src="${Cameras[i].img}"></img>
              <h4>${Cameras[i].label}</h4>
              <button class="details_btn px-3 mt-3 mx-auto d-block" disabled id="cam_${i}" onclick="SendCameraBack(id)">Show live</button>
          </div>
      </div>
    `)
    }
    
  }
}

function SendCameraBack(id){
  Close()
  cameraid = +id.split('_').pop() + +1
  $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"ActivateCamera", cameraid}))
}

function CloseMDT(){
  OpenedMDT = false
  document.getElementById("MDT").style.animation = "Hide_panel 0.5s ease";
  setTimeout(function(){
    $(".MDT").css("display","none")
  }, 400)
}

function CloseCitizenCall(){
  document.getElementById("create_citizen_call").style.animation = "Hide_panel 0.5s ease";
  setTimeout(function(){
    $("#create_citizen_call").css("display","none")
  }, 400)
}

function CloseAreaLock(){
  document.getElementById("area_lock").style.animation = "Hide_panel 0.5s ease";
  setTimeout(function(){
    $("#area_lock").css("display","none")
  }, 400)
}

function ShowCamMenu(){
  $(".cam_label").html(CamLabel)
  $(".cam_menu").css("display", "block")
}

function HideCamMenu(){
  $(".cam_menu").css("display", "none")
}

function RefreshJailBTN(){
  let time = document.getElementById("in_jail_time").value
  let reason = document.getElementById("in_jail_reason").value

  if (time.length > 0 && reason.length > 0){
    document.getElementById("jail_btn").disabled = false
  }
  else{
    document.getElementById("jail_btn").disabled = true
  }
}

function SendJail(){
  let time = document.getElementById("in_jail_time").value
  let reason = document.getElementById("in_jail_reason").value

  if (OpenFromJail == false){
    let TargetIdentifier = MDTTable[MDTTableNum].identifier
    $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTUserAction", type:"jail_mdt", TargetIdentifier, time, reason}))
    SwitchPage("search")
  }
  else{
    $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTUserAction", type:"jail_marker", TargetIdentifier:Player_target, time, reason}))
  }
  
  document.getElementById("in_jail_time").value = ""
  document.getElementById("in_jail_reason").value = ""
}

function SendUnjail(){
  let TargetIdentifier = MDTTable[MDTTableNum].identifier
  $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTUserAction", type:"unjail", TargetIdentifier}))
  SwitchPage("search")
}


// Get players incidents

function GetIncidents(Name, value){
  $(".incidents_container").html("")
  if (Incidents.length > 0){
    let helptable = []
    for (let i = 0; i < Incidents.length; i++) {
      let LocalInvolveds = JSON.parse(Incidents[i].involveds)
      if (value){
        for (let _i = 0; _i < LocalInvolveds[1].length; _i++) {
          if (LocalInvolveds[1][_i] == Name){
            helptable.push(i)
          }
        }
      }
      else{
        for (let _i = 0; _i < LocalInvolveds[0].length; _i++) {
          if (LocalInvolveds[0][_i] == Name){
            helptable.push(i)
          }
        }
      }
    }
    
    if (helptable.length > 0){
      for (let i = 0; i < helptable.length; i++) {
        $(".incidents_container").append(`
          <div class="incident_element" onclick="OpenIncident(${helptable[i]})">
              <div class="background_effect"></div>
              <div class="label">${Incidents[helptable[i]].title}</div>
              <div class="date">${Incidents[helptable[i]].date}</div>                           
          </div>
        `)
      }
    }
    else{
      $(".incidents_container").html(`
      <h3 class="text-center">No incidents have found</h3>
      `)
    }
      
  }
  else{
    $(".incidents_container").html(`
    <h3 class="text-center">No incidents have found</h3>
    `)
  }
}

function CreateTypeahead(Class, Table, data){
  let TypeAheadList = []

  for(let i = 0; i < Table.length; i++){
    if (data == false){
      TypeAheadList.push(Table[i].toString())
    }
    else{
      TypeAheadList.push(Table[i][data].toString())
    }
  }

  var $input = $(Class);

  $input.typeahead('destroy');

  $input.typeahead({
    autocomplete: true,
    source: TypeAheadList,
  });

  $input.change(function() {
      var current = $input.typeahead("getActive");
      matches = [];

      if (current) {
        if (current.name == $input.val()) {
            matches.push(current.name);
        }
      }
  });
}

// Incident menu

function RefreshAddToInvolvedBTN(id){
  if (id == "incident_title"){
    if (document.getElementById(id).value.length > 0){
      document.getElementById('create_incident').disabled = false
    }
    else{
      document.getElementById('create_incident').disabled = true 
    }
  }
  else if (id == "add_involved_vehicle"){
    if (document.getElementById(id).value.length > 0){
      document.getElementById('add_vehicle').disabled = false
    }
    else{
      document.getElementById('add_vehicle').disabled = true
    }
  }
  else if (id == "add_involved_people"){
    if (document.getElementById(id).value.length > 0){
      document.getElementById('add_people').disabled = false
    }
    else{
      document.getElementById('add_people').disabled = true
    }
  }
  else if (id == "add_involved_society"){
    if (document.getElementById(id).value.length > 0){
      document.getElementById('add_society').disabled = false
    }
    else{
      document.getElementById('add_society').disabled = true
    }
  }
}

function CreateIncidents(){
  $(".incidents_con").html("")
  if (Incidents.length > 0){
    for (let i = Incidents.length-1; i > -1; i=i-1) {
      $(".incidents_con").append(`
        <button class="incident_elm" id='incident_${Incidents[i].id}' onclick='LoadIncident(${i})'>
            <div class="incident_label">${Incidents[i].title} #${Incidents[i].id}</div>
            <div class="name">${Incidents[i].creator}</div>
            <div class="date">${Incidents[i].date}</div>
        </button>
      `)
    }
  }
  else{
    $(".incidents_con").html(`
    <h3 class="text-center">No incidents have found</h3>
    `)
  }
}

function SearchIncidents(id){
  $(".incidents_con").html("")
  let filter = document.getElementById(id).value.toUpperCase()
  for (let i = 0; i < Incidents.length; i++) {
    if (Incidents[i].title.toUpperCase().indexOf(filter) > -1){
      $(".incidents_con").append(`
        <button class="incident_elm" id='incident_${Incidents[i].id}' onclick='LoadIncident(${i})'>
            <div class="incident_label">${Incidents[i].title} #${Incidents[i].id}</div>
            <div class="name">${Incidents[i].creator}</div>
            <div class="date">${Incidents[i].date}</div>
        </button>
      `)
    }
  }
}

function OpenIncident(Num){
  SwitchPage('incidents')
  $('.modal').modal('hide')
  setTimeout(function(){
    LoadIncident(Num)
  }, 500)
}

function LoadIncident(Num){
  for (let i = 0; i < Incidents.length; i++) {
    if (document.getElementById('incident_'+Incidents[i].id) != undefined){
      document.getElementById('incident_'+Incidents[i].id).classList.remove("choosed")
    }
  }

  document.getElementById('incident_'+Incidents[Num].id).classList.add("choosed")

  $(".MDT .big_con .light").css("background-color", "var(--main_color)")

  Involveds = JSON.parse(Incidents[Num].involveds)
  RefreshInvolveds()

  $("#incident_main_label").html("EDIT")
  document.getElementById("incident_main_label").classList.add("edit")
  document.getElementById("incident_title").value = Incidents[Num].title
  document.getElementById("incident_content").value = Incidents[Num].content

  $(".bottom_btn_con").html(`
      <div class="col p-0">
          <button class="delete_incident px-3" onclick="DeleteIncident(${Incidents[Num].id})">DELETE</button>
      </div>
      <div class="col p-0">
          <button class="create_incident px-3" onclick="SaveIncident(${Incidents[Num].id})">SAVE</button>
      </div>
  `)
}

function AddToInvolved(id){
  AddInvolved = id
  if (id == 'add_vehicle'){
    let value1 = document.getElementById('add_involved_vehicle').value
    document.getElementById('add_involved_vehicle').value = ''
    $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTGetData", type:'plate', value1, value3:'incident'}))
  }
  else if (id == 'add_people'){
    let input = document.getElementById('add_involved_people').value
    if (input.indexOf(' ') >= 0){
      let value1 = input.split(' ')[0]
      let value2 = input.split(' ')[1]
      $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTGetData", type:'fullname', value1, value2, value3:'incident'}))
    }
    else{
      let value1 = input
      $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTGetData", type:'firstname', value1, value3:'incident'}))
    }
    document.getElementById('add_involved_people').value = ''
  }
  else if (id == 'add_society'){
    let value1 = document.getElementById('add_involved_society').value
    document.getElementById('add_involved_society').value = ''
    Involveds[2].push(value1)
    RefreshInvolveds()
  }
  document.getElementById(id).disabled = true
}

function RefreshInvolveds(){
  for (let i = 0; i < 3; i++) {
    $('#involvedcon_'+i).html('')
    if (Involveds[i].length > 0){
      for (let _i = 0; _i < Involveds[i].length; _i++) {
        $('#involvedcon_'+i).append(`
          <div class="involved_elm ps-1" >
              <div class="name">${Involveds[i][_i]}</div>
              <button class="remove_btn p-0" onclick='RemoveInvolved(${i}, ${_i})'><i class="fa-solid fa-trash"></i></button>
          </div>
        `)
        if (Involveds[i].length > 1 && i == 1){
          $('#involvedcon_'+i).css(
            "margin-bottom", "-20px"
          )
        }
        else{
          $('#involvedcon_'+i).css(
            "margin-bottom", "0px"
          )
        }
      }
      document.getElementById('involvedcon_'+i).classList.remove("empty")
    }
    else{
      $('#involvedcon_'+i).css(
        "margin-bottom", "0px"
      )
      document.getElementById('involvedcon_'+i).classList.add("empty")
    }
  }
}

function RemoveInvolved(first, second){
  Involveds[first].splice(second, 1)
  RefreshInvolveds()
}

function CreateIncident(){
  let title = document.getElementById("incident_title").value
  let content = document.getElementById("incident_content").value
  console.log(Involveds)
  $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTIncidentAction", type:"create", title, involveds:Involveds, content}))
  SwitchPage('incidents')
}

function DeleteIncident(id){
  $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTIncidentAction", type:"delete", id}))
  SwitchPage('incidents')
}

function SaveIncident(id){
  let title = document.getElementById("incident_title").value
  let content = document.getElementById("incident_content").value
  $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTIncidentAction", type:"save", title, involveds:Involveds, content, id}))
  SwitchPage('incidents')
}

function RefreshFineBTN(){
  let name = document.getElementById("in_fine_name").value
  let amount = document.getElementById("in_fine_amount").value

  if (name.length > 0 && amount.length > 0){
    document.getElementById("fine_btn").disabled = false
  }
  else{
    document.getElementById("fine_btn").disabled = true
  }
}

function SendFine(){
  let name = document.getElementById("in_fine_name").value
  let amount = document.getElementById("in_fine_amount").value
  let TargetIdentifier = MDTTable[MDTTableNum].identifier
  let targetname = MDTTable[MDTTableNum].firstname+" "+MDTTable[MDTTableNum].lastname

  $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTUserAction", type:"givefine", TargetIdentifier, name, amount, targetname}))
  
  document.getElementById("in_fine_name").value = ""
  document.getElementById("in_fine_amount").value = ""
}

function CreateFines(){
  $(".fines_container").html("")
  if (PlayerFines.length > 0){
    let Fines_all = 0
    let Fines_count = PlayerFines.length
    for (let i = 0; i < PlayerFines.length; i++) {
      $(".fines_container").append(`
        <div class="fine_element">
        <div class="background_effect"></div>
            <div class="row">
                <div class="col-6 d-flex align-items-center justify-content-center">
                    <h3 class="my-1">${PlayerFines[i].label}</h3>
                </div>
                <div class="col d-flex align-items-center justify-content-center">
                    <h3 class="my-1">${PlayerFines[i].amount+MoneyForm}</h3>
                </div>
            </div>
        </div>
      `)
      Fines_all = +Fines_all + +PlayerFines[i].amount
    }

    $("#fines_all").html("All: "+Fines_all+MoneyForm)
    $("#fines_count").html("Count: "+Fines_count)
  }
  else{
    $(".fines_container").html(`
    <h3 class="text-center">No fines found</h3>
    `)

    $("#fines_all").html("All: -")
    $("#fines_count").html("Count: -")
  }
  
}

function SendFines(){
  let TargetIdentifier = MDTTable[MDTTableNum].identifier
  $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTUserAction", type:"showfines", TargetIdentifier}))
}

function SpeedNotify(){
  document.getElementById("speeding_notify").style.animation = "Show_panel 0.5s ease";
  $(".speeding_notify").css("display", "block")
  $(".speeding_notify .main_text").html(`You went with <span class="your_speed">${PlayerSpeed+Metric}</span> at a <span class="speed_limit">${SpeedLimit+Metric}</span> speed limit`)
  $(".speeding_notify .fine").html(SpeedFine+MoneyForm)
  setTimeout(function(){
    document.getElementById("speeding_notify").style.animation = "Hide_panel 0.5s ease";
    setTimeout(function(){
      $(".speeding_notify").css("display", "none")
    },400)
  },5000)
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();

    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    elmnt.style.opacity = "0.8"

    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    elmnt.style.opacity = "1"
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function CreateNotes(value){
  $(".notes_container").html("")
  if (value == true){
    if (MDTTable[MDTTableNum].notes != undefined){
      for(let i=MDTTable[MDTTableNum].notes.length -1 ; i>-1; i = i-1){
        if (Job.rank >= NoteRank){
          $(".notes_container").append(`
            <div class="note_element">
            <div class="background_effect"></div>
            <button class="delete_note" onclick="DeleteNotes(${i})">Delete</button>
                <div class="row">
                    <div class="col-4">
                        <h4 class="m-2">${MDTTable[MDTTableNum].notes[i].name}</h4>
                        <h5 class="m-2 fs-6">${MDTTable[MDTTableNum].notes[i].date}</h5>
                    </div>
                    <div class="col">
                        <div class="main_text w-75">${MDTTable[MDTTableNum].notes[i].text}</div>
                    </div>
                </div>
            </div>
          `)
        }
        else{
          $(".notes_container").append(`
            <div class="note_element">
            <div class="background_effect"></div>
                <div class="row ">
                    <div class="col-4">
                        <h4 class="m-2">${MDTTable[MDTTableNum].notes[i].name}</h4>
                        <h5 class="m-2 fs-6">${MDTTable[MDTTableNum].notes[i].date}</h5>
                    </div>
                    <div class="col">
                        <div class="main_text">${MDTTable[MDTTableNum].notes[i].text}</div>
                    </div>
                </div>
            </div>
          `)
        }
      }
    }
  }
  else{
    if (Notes != undefined){
      for(let i=Notes.length -1 ; i>-1; i = i-1){
        if (Job.rank >= NoteRank){
          $(".notes_container").append(`
          <div class="note_element">
          <div class="background_effect"></div>
          <button class="delete_note" onclick="DeleteNotes(${i})">Delete</button>
              <div class="row">
                  <div class="col-4">
                      <h4 class="m-2">${Notes[i].name}</h4>
                      <h5 class="m-2 fs-6">${Notes[i].date}</h5>
                  </div>
                  <div class="col">
                      <div class="main_text w-75">${Notes[i].text}</div>
                  </div>
              </div>
          </div>
          `)
        }
        else{
          $(".notes_container").append(`
          <div class="note_element">
          <div class="background_effect"></div>
              <div class="row">
                  <div class="col-4">
                      <h4 class="m-2">${Notes[i].name}</h4>
                      <h5 class="m-2 fs-6">${Notes[i].date}</h5>
                  </div>
                  <div class="col">
                      <div class="main_text">${Notes[i].text}</div>
                  </div>
              </div>
          </div>
          `)
        } 
      }
    }
  }
}

function DeleteNotes(Number){
  let TargetIdentifier = MDTTable[MDTTableNum].identifier
  if (InSearchMenu == "people"){
    $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTUserAction", type:"deletenote", TargetIdentifier, NoteNum:Number+1}))
  }
  else{
    let Plate = MDTTable[MDTTableNum].plate
    $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTVehicleAction", type:"deletenote", Plate, NoteNum:Number+1}))
  }
}

function RefreshNoteBTN(){
    let in_note = document.getElementById("in_note").value

    if (in_note.length > 0){
        document.getElementById("note_btn").disabled = false
    }
    else{
        document.getElementById("note_btn").disabled = true
    }
}

function CreateNote(){
  let TargetIdentifier = MDTTable[MDTTableNum].identifier
  let Text = document.getElementById("in_note").value

  if (InSearchMenu == "people"){
    $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTUserAction", type:"createnote", TargetIdentifier, Text}))
  }
  else{
    let Plate = MDTTable[MDTTableNum].plate
    $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTVehicleAction", type:"createnote", Plate, Text}))
  }
  

  document.getElementById("in_note").value = ""
  document.getElementById("note_btn").disabled = true
}

function RefreshCreateCallBTN(){
  let in_citizen_call_reason = document.getElementById("in_citizen_call_reason").value

  if (in_citizen_call_reason.length > 0){
      document.getElementById("create_call_btn").disabled = false
  }
  else{
      document.getElementById("create_call_btn").disabled = true
  }
}

function CreateCall(){
  let text = document.getElementById("in_citizen_call_reason").value
  let time = Math.round(Date.now() / (1000 * 60))
  $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTCitizenCall", type:"create", text, time}))
  Close()
  document.getElementById("in_citizen_call_reason").value = ""
}

function AcceptCall(){
  $(".call_actions_container").html(`
  <div class="input-group mt-3 call_reason_con">
      <textarea class="form-control mx-4" id="in_call_reason" oninput="RefreshCloseCallBTN()" placeholder="Reason to close..."></textarea>
  </div>
	<button class="submenu_btn my-3 px-3 mx-auto d-block" id="close_call" data-bs-dismiss="modal" onclick="CloseCall()" disabled>Close</button>
  `)

  let tableid = +CallNumber + +1
  $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTCitizenCall", type:"accept", tableid}))

  setTimeout(function(){
    $(".involved_container").html("")
    for (let i = 0; i < CitizenCalls[CallNumber].cops.length; i++) {
      $(".involved_container").append(`
      <div class="involved_element">
          ${CitizenCalls[CallNumber].cops[i].name}
      </div>
      `)
      if (i +1 < CitizenCalls[CallNumber].cops.length){
        $(".involved_container").append(`
        <hr>
        `)
      }
    }
  },700)
  
}

function RefreshCallModul(id){
  CallNumber = id.split('_')[1]
  let Accepted = false

  $(".involved_container").html("")
  for (let i = 0; i < CitizenCalls[CallNumber].cops.length; i++) {
    if (CitizenCalls[CallNumber].cops[i].id == PlayerId){
      Accepted = true
    }
    $(".involved_container").append(`
    <div class="involved_element">
        ${CitizenCalls[CallNumber].cops[i].name}
    </div>
    `)
    if (i +1 < CitizenCalls[CallNumber].cops.length){
      $(".involved_container").append(`
      <hr>
      `)
    }
  }

  if (CitizenCalls[CallNumber].closed == false){
    if (Accepted == true){
      $(".call_actions_container").html(`
      <div class="input-group mt-3 call_reason_con">
          <textarea class="form-control mx-4" id="in_call_reason" oninput="RefreshCloseCallBTN()" placeholder="Reason to close"></textarea>
      </div>
    	<button class="submenu_btn px-3 my-3 mx-auto d-block" id="close_call" data-bs-dismiss="modal" onclick="CloseCall()" disabled>Close</button>
      `)
    }
  }
  else{
    $(".call_actions_container").html(`
		<h3 class="text-white text-center mt-3">Reason to close</h3>
		<div class="input-group call_reason_con">
			<textarea class="form-control mx-4" id="in_call_reason" disabled>${CitizenCalls[CallNumber].reason}</textarea>
		</div>
    `)
  }

}

function SendPinOnMap(){
  Close()
  let tableid = +CallNumber + +1
  let coords = CitizenCalls[CallNumber].coords
  $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTCitizenCall", type:"blip", coords, tableid}))
}

function CreateCitizenCalls(){
  $(".alert_container_out").html(`
  <div class="alert_container row row-cols-2 p-4"></div>
  `)
  if (CitizenCalls.length > 0){
    for (let i = CitizenCalls.length-1; i > -1; i = i-1) {
      if (CitizenCalls[i].cops.length > 0){
        $(".alert_container").append(`
            <div class="col">
              <div class="alert_element mx-auto d-block" id="alert_element_${i}">
              <div class="background_effect"></div>
                  <div class="row">
                      <div class="col"><h2>Citizen call</h2></div>
                      <div class="col"><div class="police_on"><i class="fa-solid fa-user-group"></i> ${CitizenCalls[i].cops.length}</div></div>
                  </div>
                  <div class="main_text">${CitizenCalls[i].text}</div>
                  <div class="row">
                      <div class="col">
                          <button class="details_btn float-start px-3 ms-3 me-0 mt-2" id="call_${i}" onclick="RefreshCallModul(id)" data-bs-toggle="modal" data-bs-target="#call_modal">More</button>
                          <button class="details_btn red float-start px-3 ms-2 me-0 mt-2" id="call_${i}_delete" onclick="DeleteCall('${i}')"><i class="fa-solid fa-trash"></i></button>
                      </div>
                      <div class="col">
                          <div class="time">${CurrentTime-CitizenCalls[i].time} minutes ago</div>
                          <div class="street">${CitizenCalls[i].street}</div>
                      </div>
                  </div>
              </div>
          </div>
        `)
      }
      else{
        $(".alert_container").append(`
            <div class="col">
              <div class="alert_element mx-auto d-block" id="alert_element_${i}">
              <div class="background_effect"></div>
                  <div class="row">
                      <div class="col"><h2>Citizen call</h2></div>
                      <div class="col"><div class="police_on"><i class="fa-solid fa-user-group"></i> ${CitizenCalls[i].cops.length}</div></div>
                  </div>
                  <div class="main_text">${CitizenCalls[i].text}</div>
                  <div class="row">
                      <div class="col">
                          <button class="details_btn float-start px-3 ms-3 me-0 mt-2" id="call_${i}" onclick="RefreshCallModul(id), AcceptCall()" data-bs-toggle="modal" data-bs-target="#call_modal">Accept</button>
                          <button class="details_btn red float-start px-3 ms-2 me-0 mt-2" id="call_${i}_delete" onclick="DeleteCall('${i}')"><i class="fa-solid fa-trash"></i></button>
                      </div>
                      <div class="col">
                          <div class="time">${CurrentTime-CitizenCalls[i].time} minutes ago</div>
                          <div class="street">${CitizenCalls[i].street}</div>
                      </div>
                  </div>
              </div>
          </div>
        `)
      }

      if (Job != undefined){
        if (Job.rank >= CitizenCallRank){
          for (let i = CitizenCalls.length-1; i > -1; i = i-1) {
            $("#call_"+i+"_delete").css("display", "block")
          }
        }
      }
      
      if (CitizenCalls[i].closed){
        document.getElementById("alert_element_"+i).style.animation = "DoneAlert 2s ease infinite, Appear_Menu 0.7s ease";
      }
      else if (CitizenCalls[i].cops.length > 0){
        document.getElementById("alert_element_"+i).style.animation = "ProgressAlert 2s ease infinite, Appear_Menu 0.7s ease";
      }
    }
  }
  else{
    $(".alert_container_out").html(`
    <div class="col not_found_con py-1"><h1 class="text-center">There isn't any call</h1></div>
    `)
  }
}

function DeleteCall(id){
  let tableid = +id +1
  $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTCitizenCall", type:"delete", tableid}))
}

function RefreshCloseCallBTN(){
  let reason = document.getElementById("in_call_reason").value

  if (reason.length > 0){
    document.getElementById("close_call").disabled = false
  }
  else{
    document.getElementById("close_call").disabled = true
  }
}

function CloseCall(){
  let tableid = +CallNumber + +1
  let text = document.getElementById("in_call_reason").value
  $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"MDTCitizenCall", type:"close", tableid, text}))
  
  document.getElementById("in_call_reason").value = ""
}

function SyncDataRange(id){
  $("#range_number").html(document.getElementById(id).value+"m") 
}

function SyncDataMin(id){
  $("#range_min_number").html(document.getElementById(id).value+"min") 
}

function RefreshCreateLockBTN(){
  if (document.getElementById("area_lock_label").value.length > 0){
    document.getElementById("create_lock_btn").disabled = false
  }
  else{
    document.getElementById("create_lock_btn").disabled = true
  }
}

function ChangeBlipBTN(id){
  $('.blip_btn').removeClass("active_btn")
  document.getElementById(id).classList.add("active_btn")
}

function CreateLock(){
  let label = document.getElementById("area_lock_label").value
  let time = document.getElementById("min_area_lock").value
  let range = document.getElementById("range_area_lock").value
  let sprite = document.getElementsByClassName('active_btn')[0].id
  $.post('https://'+GetParentResourceName()+'/UseButton', JSON.stringify({action:"AreaLock", label, time, range, sprite}))
  document.getElementById("range_area_lock").value = "20"
  document.getElementById("min_area_lock").value = "1"
  Close()
  $("#range_min_number").html("1min") 
  $("#range_number").html("20m") 
}