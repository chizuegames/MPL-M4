const ASSETS = {
  introIncoming: "M01a.png",
  introMission: "M01b.png",
  stationOnly: "MIa.png",
  dockedStation: "MIb.png",
  playerShip: "NVOrion.png",
  playerIcon: "ICOORION.png",
  map100: "MIc100.png",
  map60: "MIc60.png",
  map20: "MIc20.png"
};

/*
 * Misión 4 conserva el mapa/recorrido de la base más reciente.
 * A15 y A16 no se activan porque están vacíos en el Excel de la misión.
 */
const ROOM_LAYOUT = {
  B1:{x:13.3,y:29.8}, A13:{x:31.6,y:29.8}, A14:{x:70.2,y:29.8}, B2:{x:86.9,y:29.8},
  A9:{x:13.3,y:39.9}, A10:{x:31.6,y:39.9}, B8:{x:50.0,y:39.9}, A11:{x:70.2,y:39.9}, A12:{x:86.9,y:39.9},
  B5:{x:31.6,y:50.0}, B7:{x:70.2,y:50.0},
  B3:{x:13.3,y:60.0}, A8:{x:31.6,y:60.0}, B6:{x:50.0,y:60.0}, A7:{x:70.2,y:60.0}, B4:{x:86.9,y:60.0},
  A3:{x:13.3,y:70.1}, A6:{x:31.6,y:70.1}, A5:{x:70.2,y:70.1}, A4:{x:86.9,y:70.1},
  A1:{x:13.3,y:80.2}, A2:{x:86.9,y:80.2}
};

const ENTRY_POS = {x:50, y:80.2};

const GRAPH = {
  ENTRADA:["B6","A6","A5"],
  B1:["A9","A13"], A13:["B1"], A9:["B1","A10"], A10:["A9","B8","B5"], B8:["A10","A11"], B5:["A10","A8"], A8:["B5","B6","B3"],
  B2:["A12","A14"], A14:["B2"], A12:["B2","A11"], A11:["A12","B8","B7"], B7:["A11","A7"], A7:["B7","B6","B4"],
  B6:["A8","A7"], B3:["A8","A3"], A3:["B3","A6","A1"], A6:["A3"], A1:["A3"],
  B4:["A7","A4"], A4:["B4","A5","A2"], A5:["A4"], A2:["A4"]
};

/* Salas A: fijas, según el Excel de Misión 4. */
const FIXED_DEFINITIONS = {
  A1:{type:"lootLocked",label:"SALA DE BOTÍN",card:"A1E.png",finalCard:"A1F.png",icon:"ICOBT.png",requires:["A3","A4"]},
  A2:{type:"simple",label:"CAJA DE OBJETO",card:"CJO.png",icon:"ICOCO.png",reward:"TOMA UN OBJETO"},
  A3:{type:"combat",label:"MARCIANO CP",card:"A3E.png",finalCard:"A3F.png",icon:"ICOMR.png",hp:{100:3,60:3,20:5},finalRule:"always"},
  A4:{type:"simple",label:"CAJA DE OBJETO",card:"CJO.png",icon:"ICOCO.png"},
  A5:{type:"combat",label:"MARCIANO ROJO E3",card:"A5E.png",finalCard:"A5F.png",icon:"ICOMR.png",hp:{100:3,60:3,20:5},finalRule:"fistsAtLeastGuns"},
  A6:{type:"combat",label:"MARCIANO ROJO E3",card:"A6E.png",finalCard:"A6F.png",icon:"ICOMR.png",hp:{100:3,60:3,20:5},finalRule:"fistsAtLeastGuns"},
  A7:{type:"combat",label:"MARCIANO ROJO",card:"A7E.png",finalCard:"A7F.png",icon:"ICOMR.png",hp:{100:2,60:3,20:4},finalRule:"fistsAtLeastGuns"},
  A8:{type:"combat",label:"MARCIANO ROJO",card:"A8E.png",finalCard:"A8F.png",icon:"ICOMR.png",hp:{100:2,60:3,20:4},finalRule:"fistsAtLeastGuns"},
  A9:{type:"simple",label:"TRAMPA DE ENERGÍA",card:"TRE.png",icon:"ICOTR.png",reward:"PIERDE 1 DE ENERGÍA"},
  A10:{type:"simple",label:"VIDA",card:"SDV.png",icon:"ICOTL.png",reward:"MÁS 1 DE VIDA"},
  A11:{type:"simple",label:"TRAMPA DE VIDA",card:"TRV.png",icon:"ICOTR.png",reward:"PIERDE 1 DE VIDA"},
  A12:{type:"simple",label:"VIDA",card:"SDV.png",icon:"ICOTL.png",reward:"MÁS 1 DE VIDA"},
  A13:{type:"nurse",label:"ENFERMERA",card:"A13E.png",finalCard:"A13F.png",icon:null,reward:"PIERDE 1 OBJETO · GANA 4 DE VIDA"},
  /* A14 no trae vidas en el Excel. Se trata como interacción especial y usa el icono de ayuda disponible. */
  A14:{type:"assist",label:"MARCIANO IG",card:"A14E.png",finalCard:"A14F.png",icon:"ICORT.png",reward:"TOMA UN OBJETO"}
};

/* Las ocho fichas B se sortean una sola vez al iniciar la partida, sin repetir. */
const B_EVENT_POOL = [
  {sourceId:"B1",type:"simple",label:"TRAMPA DE VIDA",card:"TRV.png",icon:"ICOTR.png",reward:"PIERDE 1 DE VIDA"},
  {sourceId:"B2",type:"simple",label:"TRAMPA DE ENERGÍA",card:"TRE.png",icon:"ICOTR.png",reward:"PIERDE 1 DE ENERGÍA"},
  {sourceId:"B3",type:"simple",label:"VIDA",card:"SDV.png",icon:"ICOTL.png",reward:"MÁS 1 DE VIDA"},
  {sourceId:"B4",type:"empty",label:"SALA VACÍA",card:"SLV.png",icon:null},
  {sourceId:"B5",type:"combat",label:"MARCIANO ROJO E2",card:"B5E.png",finalCard:"B5F.png",icon:"ICOMR.png",hp:{100:3,60:4,20:4},finalRule:"fistsAtLeastGuns",reward:"RECIBE UN GALACTIC PUREE"},
  {sourceId:"B6",type:"simple",label:"TRAMPA DE ENERGÍA",card:"TRE.png",icon:"ICOTR.png",reward:"PIERDE 1 DE ENERGÍA"},
  /* El Excel registra B7F como encuentro y B7E como final; se respeta literalmente. */
  {sourceId:"B7",type:"combat",label:"MARCIANO ROJO E2",card:"B7F.png",finalCard:"B7E.png",icon:"ICOMR.png",hp:{100:3,60:4,20:4},finalRule:"fistsAtLeastGuns",reward:"RECIBE UN GALACTIC PUREE"},
  {sourceId:"B8",type:"simple",label:"CAJA DE OBJETO",card:"CJO.png",icon:"ICOCO.png",reward:"TOMA UN OBJETO"}
];

const DEFINITIONS = {...FIXED_DEFINITIONS};

function randomIndex(max){
  if(window.crypto && window.crypto.getRandomValues){
    const d = new Uint32Array(1);
    window.crypto.getRandomValues(d);
    return d[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function shuffle(items){
  const result = [...items];
  for(let i=result.length-1;i>0;i--){
    const j = randomIndex(i+1);
    [result[i],result[j]] = [result[j],result[i]];
  }
  return result;
}

function randomizeBRooms(){
  const rooms = ["B1","B2","B3","B4","B5","B6","B7","B8"];
  const draw = shuffle(B_EVENT_POOL).map(d=>({...d,hp:d.hp?{...d.hp}:undefined}));
  rooms.forEach((room,index)=>{DEFINITIONS[room]=draw[index];});
}
randomizeBRooms();

function definitionFor(room){
  return DEFINITIONS[room] || {type:"empty",label:"SALA VACÍA",card:"SLV.png",icon:null};
}

const state = {
  currentRoom:"ENTRADA",
  oxygen:100,
  scannerActive:false,
  pendingRoom:null,
  encounterMode:null,
  combat:null,
  gameLocked:true,
  ended:false,
  rooms:{}
};
Object.keys(ROOM_LAYOUT).forEach(room=>{
  state.rooms[room]={revealed:false,completed:false,visited:false};
});

const $ = id => document.getElementById(id);
const introOverlay=$("introOverlay"), introPage1=$("introPage1"), introPage2=$("introPage2"), dockPage=$("dockPage"), acceptMissionButton=$("acceptMissionButton"), dockBaseImage=$("dockBaseImage"), dockShip=$("dockShip"), dockFlash=$("dockFlash"), game=$("game"), mapImage=$("mapImage"), roomsLayer=$("roomsLayer"), iconsLayer=$("iconsLayer"), scannerButton=$("scannerButton"), useObjectButton=$("useObjectButton"), musicButton=$("musicButton"), oxygenCounter=$("oxygenCounter"), tutorialOverlay=$("tutorialOverlay"), tutorialText=$("tutorialText"), tutorialNext=$("tutorialNext"), encounter=$("encounter"), encounterCard=$("encounterCard"), encounterImage=$("encounterImage"), enemyHp=$("enemyHp"), gunButton=$("gunButton"), fistButton=$("fistButton"), specialButton=$("specialButton"), encounterBackButton=$("encounterBackButton"), message=$("message"), endOverlay=$("endOverlay"), endTitle=$("endTitle"), endSubtitle=$("endSubtitle"), introMusic=$("introMusic"), bgMusic=$("bgMusic");

let messageTimer=null, musicPlaying=false, combatLocked=false, introLocked=false, audioCtx=null, tutorialIndex=0;
introMusic.volume=.34;
bgMusic.volume=.32;

function buildRooms(){
  Object.entries(ROOM_LAYOUT).forEach(([room,pos])=>{
    const button=document.createElement("button");
    button.type="button";
    button.className="room";
    button.id=`room-${room}`;
    button.setAttribute("aria-label",`Habitación ${room}`);
    button.style.left=`${pos.x}%`;
    button.style.top=`${pos.y}%`;
    button.addEventListener("click",()=>handleRoomClick(room));
    roomsLayer.appendChild(button);
  });
}
buildRooms();

const preload=[...Object.values(ASSETS)];
Object.values(DEFINITIONS).forEach(d=>{
  [d.card,d.finalCard,d.icon].filter(Boolean).forEach(src=>preload.push(src));
});
preload.filter(Boolean).forEach(src=>{const image=new Image();image.src=src;});

function getAudioContext(){
  try{
    if(!audioCtx){
      const Context=window.AudioContext||window.webkitAudioContext;
      audioCtx=new Context();
    }
    if(audioCtx.state==="suspended")audioCtx.resume();
    return audioCtx;
  }catch(error){return null;}
}

function toneSweep(from,to,duration,volume=.1,type="sine"){
  try{
    const context=getAudioContext();
    if(!context)return;
    const oscillator=context.createOscillator();
    const gain=context.createGain();
    oscillator.type=type;
    oscillator.frequency.setValueAtTime(from,context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20,to),context.currentTime+duration);
    gain.gain.setValueAtTime(volume,context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+duration);
    oscillator.connect(gain);gain.connect(context.destination);
    oscillator.start();oscillator.stop(context.currentTime+duration+.02);
  }catch(error){}
}

const scannerSound=()=>toneSweep(380,1240,.48,.085,"sine");
const punchSound=()=>toneSweep(165,48,.17,.32,"triangle");
const gunSound=()=>toneSweep(1250,170,.15,.2,"sawtooth");
const energySound=()=>toneSweep(720,180,.33,.11,"sine");
const itemSound=()=>toneSweep(520,900,.24,.08,"triangle");
const deathSound=()=>[430,300,180,95].forEach((f,i)=>setTimeout(()=>toneSweep(f,Math.max(45,f*.55),.2,.11,i<2?"square":"sawtooth"),i*85));
const gameOverSound=()=>toneSweep(240,45,1.1,.18,"sawtooth");
const dockingTravelSound=()=>toneSweep(58,98,2.25,.09,"sawtooth");
function dockingImpactSound(){toneSweep(115,42,.25,.24,"square");setTimeout(()=>toneSweep(610,610,.11,.08,"sine"),170);setTimeout(()=>toneSweep(830,830,.11,.08,"sine"),270);}

function showIntroPage(page){
  [introPage1,introPage2,dockPage].forEach(p=>p.classList.remove("active"));
  page.classList.add("active");
}

introPage1.addEventListener("click",async()=>{
  if(introLocked)return;
  getAudioContext();
  showIntroPage(introPage2);
  try{introMusic.currentTime=0;await introMusic.play();}catch(error){}
});

function crossfadeToGameMusic(){
  bgMusic.volume=.03;
  bgMusic.play().then(()=>{
    musicPlaying=true;
    musicButton.classList.add("music-on");
  }).catch(()=>{});
  let current=0;
  const steps=18;
  const start=introMusic.volume;
  const timer=setInterval(()=>{
    current++;
    const progress=current/steps;
    introMusic.volume=Math.max(0,start*(1-progress));
    bgMusic.volume=.03+(.32-.03)*progress;
    if(current>=steps){
      clearInterval(timer);
      introMusic.pause();
      introMusic.currentTime=0;
      introMusic.volume=.34;
      bgMusic.volume=.32;
    }
  },65);
}

acceptMissionButton.addEventListener("click",event=>{
  event.stopPropagation();
  if(introLocked)return;
  introLocked=true;
  getAudioContext();
  crossfadeToGameMusic();
  dockingTravelSound();
  startDockingSequence();
});

function startDockingSequence(){
  showIntroPage(dockPage);
  dockBaseImage.src=ASSETS.stationOnly;
  dockShip.src=ASSETS.playerShip;
  dockShip.style.display="block";
  dockShip.classList.remove("docking");
  void dockShip.offsetWidth;
  setTimeout(()=>dockShip.classList.add("docking"),180);
  setTimeout(()=>{
    dockingImpactSound();
    dockFlash.classList.remove("flash");
    void dockFlash.offsetWidth;
    dockFlash.classList.add("flash");
    dockBaseImage.src=ASSETS.dockedStation;
    dockShip.style.display="none";
  },2450);
  setTimeout(startGame,3150);
}

function startGame(){
  state.oxygen=100;
  updateOxygenUI();
  introOverlay.style.display="none";
  game.style.display="block";
  window.scrollTo(0,0);
  refreshRoomMarkers();
  showTutorial();
}

async function toggleMusic(){
  if(!musicPlaying){
    try{
      await bgMusic.play();
      musicPlaying=true;
      musicButton.classList.add("music-on");
    }catch(error){showMessage("NO SE PUDO ACTIVAR LA MÚSICA");}
    return;
  }
  bgMusic.pause();
  musicPlaying=false;
  musicButton.classList.remove("music-on");
}
musicButton.addEventListener("click",event=>{event.stopPropagation();toggleMusic();});

const TUTORIAL_MESSAGES=[
  "Durante esta misión el Intergalactic Purée vale x2 de vida.",
  "No olvides llevar una batería de emergencia.",
  "Si necesitas usar un objeto, da clic en USAR OBJETO."
];

function showTutorial(){
  state.gameLocked=true;
  tutorialIndex=0;
  tutorialText.textContent=TUTORIAL_MESSAGES[0];
  tutorialNext.textContent="SIGUIENTE";
  tutorialOverlay.classList.add("show");
}

tutorialNext.addEventListener("click",()=>{
  tutorialIndex++;
  if(tutorialIndex>=TUTORIAL_MESSAGES.length){
    tutorialOverlay.classList.remove("show");
    state.gameLocked=false;
    return;
  }
  tutorialText.textContent=TUTORIAL_MESSAGES[tutorialIndex];
  tutorialNext.textContent=tutorialIndex===TUTORIAL_MESSAGES.length-1?"ENTENDIDO":"SIGUIENTE";
});

function showMessage(html){
  clearTimeout(messageTimer);
  message.classList.remove("show");
  void message.offsetWidth;
  message.innerHTML=html;
  message.classList.add("show");
  messageTimer=setTimeout(()=>message.classList.remove("show"),1550);
}

function oxygenPhase(){
  if(state.oxygen<20)return 20;
  if(state.oxygen<60)return 60;
  return 100;
}
function formatOxygen(value){return `${Number.isInteger(value)?value:value.toFixed(1).replace(".",",")}%`;}
function updateOxygenUI(){
  const phase=oxygenPhase();
  oxygenCounter.textContent=formatOxygen(state.oxygen);
  oxygenCounter.classList.remove("phase60","phase20");
  mapImage.src=phase===100?ASSETS.map100:phase===60?ASSETS.map60:ASSETS.map20;
  if(phase===60)oxygenCounter.classList.add("phase60");
  if(phase===20)oxygenCounter.classList.add("phase20");
}
function consumeOxygen(amount){
  if(state.ended)return false;
  state.oxygen=Math.max(0,Math.round((state.oxygen-amount)*10)/10);
  updateOxygenUI();
  if(state.oxygen<=0){triggerGameOver();return false;}
  return true;
}
function movementOxygenCost(target){
  if(state.currentRoom==="ENTRADA")return 0;
  return state.rooms[target]?.visited?2.5:5;
}

useObjectButton.addEventListener("click",()=>{
  if(state.gameLocked||state.ended||encounter.classList.contains("show"))return;
  itemSound();
  if(consumeOxygen(5))showMessage("OBJETO UTILIZADO<br>−5% O₂");
});

function removeMarker(id){const el=$(id);if(el)el.remove();}
function clearMarkers(){
  removeMarker("player-marker");
  Object.keys(ROOM_LAYOUT).forEach(room=>{
    removeMarker(`check-${room}`);
    removeMarker(`event-${room}`);
    removeMarker(`scan-${room}`);
  });
}
function markerAt(id,pos,className,text=""){
  removeMarker(id);
  const el=document.createElement("div");
  el.id=id;el.className=className;el.style.left=`${pos.x}%`;el.style.top=`${pos.y}%`;el.textContent=text;
  iconsLayer.appendChild(el);
  return el;
}
function roomMarker(id,room,className,text=""){
  const pos=ROOM_LAYOUT[room];
  if(!pos)return null;
  return markerAt(id,pos,className,text);
}
function imageMarker(id,room,src,className="map-icon event-icon"){
  removeMarker(id);
  const pos=ROOM_LAYOUT[room];
  if(!pos||!src)return null;
  const image=document.createElement("img");
  image.id=id;image.className=className;image.src=src;image.draggable=false;image.style.left=`${pos.x}%`;image.style.top=`${pos.y}%`;
  iconsLayer.appendChild(image);
  return image;
}
function playerMarker(){
  removeMarker("player-marker");
  const pos=state.currentRoom==="ENTRADA"?ENTRY_POS:ROOM_LAYOUT[state.currentRoom];
  if(!pos)return;
  const image=document.createElement("img");
  image.id="player-marker";image.className="map-icon player-image";image.src=ASSETS.playerIcon;image.draggable=false;image.style.left=`${pos.x}%`;image.style.top=`${pos.y}%`;
  iconsLayer.appendChild(image);
}
function refreshRoomMarkers(){
  clearMarkers();
  playerMarker();
  Object.keys(ROOM_LAYOUT).forEach(room=>{
    if(room===state.currentRoom)return;
    const status=state.rooms[room];
    const definition=definitionFor(room);
    if(status.completed){roomMarker(`check-${room}`,room,"check-marker","✓");return;}
    if(status.revealed&&definition.icon){imageMarker(`event-${room}`,room,definition.icon);}
  });
}

function moveToRoom(room){
  state.currentRoom=room;
  state.rooms[room].visited=true;
  refreshRoomMarkers();
}
function adjacentRooms(){return GRAPH[state.currentRoom]||[];}
function isAdjacent(room){return adjacentRooms().includes(room);}
function directionBetween(from,to){
  if(from==="ENTRADA"){
    if(to==="B6")return "up";
    if(to==="A6")return "left";
    return "right";
  }
  const a=ROOM_LAYOUT[from],b=ROOM_LAYOUT[to];
  if(!a||!b)return "up";
  const dx=b.x-a.x,dy=b.y-a.y;
  return Math.abs(dx)>Math.abs(dy)?(dx>0?"right":"left"):(dy>0?"down":"up");
}

function turnOffScanner(){
  state.scannerActive=false;
  scannerButton.classList.remove("scanner-on");
  Object.keys(ROOM_LAYOUT).forEach(room=>removeMarker(`scan-${room}`));
}
function scanNearbyRooms(){
  if(state.gameLocked||state.ended||encounter.classList.contains("show"))return;
  if(state.scannerActive){turnOffScanner();return;}
  let count=0;
  adjacentRooms().forEach(room=>{
    const status=state.rooms[room];
    if(!status.completed&&!status.revealed){
      const marker=roomMarker(`scan-${room}`,room,`scan-marker dir-${directionBetween(state.currentRoom,room)}`,"⌃");
      if(marker)count++;
    }
  });
  if(!count){showMessage("SIN NUEVAS SEÑALES");return;}
  state.scannerActive=true;
  scannerButton.classList.add("scanner-on");
  scannerSound();
}
scannerButton.addEventListener("click",scanNearbyRooms);

function revealRoom(room){
  const status=state.rooms[room],definition=definitionFor(room);
  if(!status)return;
  status.revealed=true;
  removeMarker(`scan-${room}`);
  if(definition.icon)imageMarker(`event-${room}`,room,definition.icon);
  energySound();
  showMessage(`${definition.label}<br>−2 ENERGÍAS`);
}

function setEncounterImage(src){encounterImage.onerror=null;encounterImage.src=src||"";}
function resetEncounterUI(){
  encounterCard.className="";
  encounterCard.style.cursor="default";
  enemyHp.style.display="none";
  gunButton.style.display="none";
  fistButton.style.display="none";
  specialButton.style.display="none";
  encounterBackButton.style.display="none";
  combatLocked=false;
  state.combat=null;
}
function currentEnemyHp(definition){return definition.hp?definition.hp[oxygenPhase()]:1;}
function requirementsMet(definition){return (definition.requires||[]).every(room=>state.rooms[room]?.completed);}

function openEncounter(room){
  const definition=definitionFor(room);
  turnOffScanner();
  state.pendingRoom=room;
  state.rooms[room].visited=true;
  resetEncounterUI();
  setEncounterImage(definition.card);
  encounterImage.alt=definition.label;
  encounter.classList.add("show");

  if(definition.type==="lootLocked"){
    if(!requirementsMet(definition)){
      state.encounterMode="locked";
      encounterCard.style.cursor="pointer";
      return;
    }
    state.encounterMode="loot";
    encounterCard.style.cursor="pointer";
    return;
  }

  if(definition.type==="combat"){
    state.encounterMode="combat";
    encounterCard.classList.add("combat");
    enemyHp.style.display="flex";
    gunButton.style.display="block";
    fistButton.style.display="block";
    const hp=currentEnemyHp(definition);
    state.combat={room,sourceId:definition.sourceId||room,hp,fists:0,guns:0};
    enemyHp.textContent=hp;
    return;
  }

  if(definition.type==="nurse"||definition.type==="assist"){
    state.encounterMode=definition.type;
    encounterCard.classList.add("special");
    specialButton.style.display="block";
    encounterBackButton.style.display="block";
    return;
  }

  state.encounterMode=definition.type;
  encounterCard.style.cursor="pointer";
}

function rewardMessage(definition){
  if(definition?.reward)showMessage(definition.reward);
}
function completeCurrentRoom(){
  const room=state.pendingRoom;
  if(!room)return;
  const definition=definitionFor(room);
  state.rooms[room].completed=true;
  state.rooms[room].revealed=true;
  encounter.classList.remove("show");
  state.pendingRoom=null;
  state.encounterMode=null;
  resetEncounterUI();
  moveToRoom(room);
  rewardMessage(definition);
}
function closeUnresolvedToMap(){
  const room=state.pendingRoom;
  if(!room)return;
  state.rooms[room].revealed=true;
  encounter.classList.remove("show");
  state.pendingRoom=null;
  state.encounterMode=null;
  resetEncounterUI();
  moveToRoom(room);
}
function animateHit(){encounterCard.classList.remove("hit");void encounterCard.offsetWidth;encounterCard.classList.add("hit");}

function shouldShowCombatFinal(definition,combat){
  if(!definition.finalCard)return false;
  if(definition.finalRule==="always")return true;
  if(definition.finalRule==="fistsAtLeastGuns")return combat.fists>=combat.guns;
  return false;
}

function attack(kind){
  if(state.encounterMode!=="combat"||combatLocked||!state.combat||state.ended)return;
  combatLocked=true;
  const combat=state.combat;
  if(kind==="fist"){
    combat.fists++;
    punchSound();
    showMessage("−1 VIDA");
  }else{
    combat.guns++;
    gunSound();
    showMessage("−1 ENERGÍA");
  }
  combat.hp=Math.max(0,combat.hp-1);
  enemyHp.textContent=combat.hp;
  animateHit();

  setTimeout(()=>{
    if(combat.hp>0){combatLocked=false;return;}
    const definition=definitionFor(combat.room);
    if(shouldShowCombatFinal(definition,combat)){
      state.encounterMode="final";
      encounterCard.classList.remove("combat");
      enemyHp.style.display="none";
      gunButton.style.display="none";
      fistButton.style.display="none";
      setEncounterImage(definition.finalCard);
      encounterCard.style.cursor="pointer";
      combatLocked=false;
      return;
    }
    deathSound();
    setTimeout(completeCurrentRoom,430);
  },320);
}

gunButton.addEventListener("click",event=>{event.stopPropagation();attack("gun");});
fistButton.addEventListener("click",event=>{event.stopPropagation();attack("fist");});

specialButton.addEventListener("click",event=>{
  event.stopPropagation();
  const room=state.pendingRoom;
  if(!room)return;
  const definition=definitionFor(room);
  if(state.encounterMode!=="nurse"&&state.encounterMode!=="assist")return;
  state.encounterMode="specialFinal";
  encounterCard.classList.remove("special");
  specialButton.style.display="none";
  encounterBackButton.style.display="none";
  setEncounterImage(definition.finalCard);
  encounterCard.style.cursor="pointer";
  itemSound();
});

encounterBackButton.addEventListener("click",event=>{
  event.stopPropagation();
  if(state.encounterMode==="nurse"||state.encounterMode==="assist")closeUnresolvedToMap();
});

encounterCard.addEventListener("click",event=>{
  if(event.target===gunButton||event.target===fistButton||event.target===specialButton||event.target===encounterBackButton)return;

  if(state.encounterMode==="locked"){
    showMessage("PUERTA CERRADA<br>COMPLETA A3 Y A4");
    closeUnresolvedToMap();
    return;
  }

  if(state.encounterMode==="loot"){
    const definition=definitionFor(state.pendingRoom);
    if(definition.finalCard){
      state.encounterMode="lootFinal";
      setEncounterImage(definition.finalCard);
      return;
    }
    completeCurrentRoom();
    return;
  }

  if(["simple","empty","final","specialFinal","lootFinal"].includes(state.encounterMode)){
    completeCurrentRoom();
  }
});

function handleRoomClick(room){
  if(state.gameLocked||state.ended||encounter.classList.contains("show"))return;
  if(room===state.currentRoom){showMessage("ESTÁS EN ESTA SALA");return;}
  if(!isAdjacent(room)){showMessage("SOLO PUEDES IR A UNA SALA ALEDAÑA");return;}
  if(state.scannerActive&&!state.rooms[room].revealed){revealRoom(room);return;}
  const cost=movementOxygenCost(room);
  if(cost>0&&!consumeOxygen(cost))return;
  if(state.rooms[room].completed){turnOffScanner();moveToRoom(room);return;}
  openEncounter(room);
}

function triggerGameOver(){
  if(state.ended)return;
  state.ended=true;
  state.gameLocked=true;
  turnOffScanner();
  encounter.classList.remove("show");
  gameOverSound();
  endOverlay.className="show gameover";
  endTitle.textContent="GAME OVER";
  endSubtitle.textContent="Te has quedado sin oxígeno.";
}

let lastTouchEnd=0;
document.addEventListener("touchend",event=>{
  const now=Date.now();
  if(now-lastTouchEnd<=300)event.preventDefault();
  lastTouchEnd=now;
},{passive:false});
