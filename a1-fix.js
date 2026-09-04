/* =========================================================
   MPL — MISIÓN 4 — Corrección A1
   A1 se desbloquea al derrotar a los dos marcianos clave:
   A3 = Marciano CP y A14 = Marciano IG.
   Mientras esté bloqueada, Orion NO entra a la sala ni cambia de posición.
   ========================================================= */

FIXED_DEFINITIONS.A1.requires=["A3","A14"];
DEFINITIONS.A1.requires=["A3","A14"];

function a1Unlocked(){
  return requirementsMet(definitionFor("A1"));
}

function removeMissionCompleteBanner(){
  const banner=document.getElementById("missionCompleteBanner");
  if(banner)banner.remove();
}

function showMissionCompleteBanner(){
  removeMissionCompleteBanner();

  const banner=document.createElement("div");
  banner.id="missionCompleteBanner";
  banner.textContent="MISIÓN CUMPLIDA";
  banner.style.position="absolute";
  banner.style.left="50%";
  banner.style.top="8%";
  banner.style.transform="translateX(-50%) scale(.88)";
  banner.style.zIndex="180";
  banner.style.minWidth="64%";
  banner.style.padding="14px 22px";
  banner.style.border="3px solid #d9ff74";
  banner.style.borderRadius="18px";
  banner.style.background="rgba(12,26,20,.94)";
  banner.style.color="#f4ffcc";
  banner.style.fontSize="clamp(22px,5vw,38px)";
  banner.style.fontWeight="1000";
  banner.style.letterSpacing="1.4px";
  banner.style.textAlign="center";
  banner.style.textShadow="0 2px 3px #000";
  banner.style.boxShadow="0 0 28px rgba(168,211,54,.75)";
  banner.style.pointerEvents="none";
  banner.style.opacity="0";
  banner.style.transition="opacity .28s ease, transform .28s ease";

  encounterCard.appendChild(banner);

  requestAnimationFrame(()=>{
    banner.style.opacity="1";
    banner.style.transform="translateX(-50%) scale(1)";
  });
}

/*
 * Interceptamos el clic antes de que la lógica general cobre oxígeno
 * o cambie la habitación actual. Si A1 sigue bloqueada, solo se muestra
 * A1E como aviso narrativo y Orion permanece en la sala anterior.
 */
const handleRoomClickBeforeA1Fix=handleRoomClick;
handleRoomClick=function(room){
  if(room!=="A1"){
    return handleRoomClickBeforeA1Fix(room);
  }

  if(state.gameLocked||state.ended||encounter.classList.contains("show"))return;
  if(room===state.currentRoom){showMessage("ESTÁS EN ESTA SALA");return;}
  if(!isAdjacent(room)){showMessage("SOLO PUEDES IR A UNA SALA ALEDAÑA");return;}

  if(state.scannerActive&&!state.rooms.A1.revealed){
    revealRoom("A1");
    return;
  }

  if(!a1Unlocked()){
    turnOffScanner();
    resetEncounterUI();
    removeMissionCompleteBanner();
    state.pendingRoom=null;
    state.encounterMode="a1Locked";
    setEncounterImage(definitionFor("A1").card);
    encounterImage.alt="Sala bloqueada";
    encounterCard.style.cursor="pointer";
    encounter.classList.add("show");
    return;
  }

  /* Solo cuando A3 y A14 están completadas se permite el acceso real. */
  return handleRoomClickBeforeA1Fix(room);
};

/*
 * Cuando A1 ya está desbloqueada y la lógica general abre el encuentro,
 * saltamos directamente a A1F y mostramos el aviso de misión cumplida.
 */
const openEncounterBeforeA1Fix=openEncounter;
openEncounter=function(room){
  if(room!=="A1"){
    removeMissionCompleteBanner();
    return openEncounterBeforeA1Fix(room);
  }

  const definition=definitionFor("A1");
  turnOffScanner();
  state.pendingRoom="A1";
  state.rooms.A1.visited=true;
  resetEncounterUI();
  removeMissionCompleteBanner();
  encounter.classList.add("show");
  encounterImage.alt=definition.label;
  encounterCard.style.cursor="pointer";

  if(a1Unlocked()){
    state.encounterMode="lootFinal";
    setEncounterImage(definition.finalCard);
    itemSound();
    setTimeout(showMissionCompleteBanner,300);
    return;
  }

  /* Salvaguarda: si por cualquier motivo se llama aquí estando bloqueada. */
  state.pendingRoom=null;
  state.rooms.A1.visited=false;
  state.encounterMode="a1Locked";
  setEncounterImage(definition.card);
};

/*
 * Mensaje visible para el jugador: no revela la condición interna.
 * Al cerrar, Orion continúa exactamente en la habitación desde la que intentó entrar.
 */
encounter.addEventListener("click",function(event){
  if(state.encounterMode!=="a1Locked")return;
  if(event.target===encounterBackButton)return;

  event.preventDefault();
  event.stopImmediatePropagation();

  encounter.classList.remove("show");
  state.pendingRoom=null;
  state.encounterMode=null;
  resetEncounterUI();
  removeMissionCompleteBanner();
  refreshRoomMarkers();

  showMessage("LA SALA ESTÁ BLOQUEADA<br>ALGUIEN LA ESTÁ BLOQUEANDO DE FORMA REMOTA");
},true);
