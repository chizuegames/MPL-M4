/* =========================================================
   MPL — MISIÓN 4 — Flujo final A1
   A1 se desbloquea al derrotar:
   A3 = Marciano CP
   A14 = Marciano IG

   Si A1 sigue bloqueada:
   - Orion NO entra
   - permanece en la sala anterior
   - se muestra A1E
   - el mensaje no revela la condición interna

   Si A1 se desbloquea:
   - se muestra A1F brevemente
   - aparece FF.png a pantalla completa con texto narrativo
   - esa pantalla espera un clic
   - al hacer clic aparece el cierre oscuro de MISIÓN CUMPLIDA
   ========================================================= */

FIXED_DEFINITIONS.A1.requires=["A3","A14"];
DEFINITIONS.A1.requires=["A3","A14"];

function a1Unlocked(){
  return requirementsMet(definitionFor("A1"));
}

function removeA1EndingLayers(){
  const story=document.getElementById("a1StoryOverlay");
  if(story)story.remove();
}

function showMissionCompleteScreen(){
  if(state.ended)return;

  removeA1EndingLayers();
  state.ended=true;
  state.gameLocked=true;
  turnOffScanner();

  state.rooms.A1.completed=true;
  state.rooms.A1.revealed=true;

  encounter.classList.remove("show");
  state.pendingRoom=null;
  state.encounterMode=null;
  resetEncounterUI();

  endOverlay.className="show missioncomplete";
  endTitle.textContent="MISIÓN CUMPLIDA";
  endSubtitle.innerHTML="¡BIEN HECHO, ORION!<br>Has completado la misión.";

  try{
    toneSweep(520,880,.35,.09,"sine");
    setTimeout(()=>toneSweep(680,1080,.42,.08,"sine"),180);
  }catch(error){}
}

function showA1StoryScreen(){
  removeA1EndingLayers();
  state.gameLocked=true;
  turnOffScanner();

  const overlay=document.createElement("div");
  overlay.id="a1StoryOverlay";
  overlay.setAttribute("role","dialog");
  overlay.setAttribute("aria-modal","true");
  overlay.setAttribute("aria-label","Epílogo de la misión");
  overlay.style.position="fixed";
  overlay.style.inset="0";
  overlay.style.zIndex="500";
  overlay.style.display="flex";
  overlay.style.alignItems="flex-end";
  overlay.style.justifyContent="center";
  overlay.style.background="#000";
  overlay.style.cursor="pointer";
  overlay.style.opacity="0";
  overlay.style.transition="opacity .3s ease";
  overlay.style.overflow="hidden";

  const image=document.createElement("img");
  image.src="FF.png";
  image.alt="Orion escapando con las muestras";
  image.draggable=false;
  image.style.position="absolute";
  image.style.inset="0";
  image.style.width="100%";
  image.style.height="100%";
  image.style.objectFit="cover";
  image.style.objectPosition="center";

  const shade=document.createElement("div");
  shade.style.position="absolute";
  shade.style.inset="0";
  shade.style.background="linear-gradient(to top, rgba(0,0,0,.94) 0%, rgba(0,0,0,.76) 22%, rgba(0,0,0,.25) 58%, rgba(0,0,0,.08) 100%)";

  const panel=document.createElement("div");
  panel.style.position="relative";
  panel.style.zIndex="2";
  panel.style.width="min(92vw,760px)";
  panel.style.margin="0 16px max(5vh,22px)";
  panel.style.padding="20px 22px 17px";
  panel.style.border="3px solid #ffd54a";
  panel.style.borderRadius="18px";
  panel.style.background="rgba(30,22,5,.9)";
  panel.style.boxShadow="0 0 28px rgba(255,213,74,.48)";
  panel.style.color="#fff7d1";
  panel.style.textAlign="center";
  panel.style.textShadow="0 2px 3px #000";
  panel.style.opacity="0";
  panel.style.transform="translateY(20px)";
  panel.style.transition="opacity .35s ease, transform .35s ease";

  const text=document.createElement("div");
  text.style.fontSize="clamp(18px,3.6vw,29px)";
  text.style.fontWeight="850";
  text.style.lineHeight="1.35";
  text.textContent="Orion logró escapar de la nave con muestras de las armas y el líquido verde, pero algo en aquella sustancia lo inquietaba. Incluso llevarla consigo le resultaba perturbador.";

  const hint=document.createElement("div");
  hint.style.marginTop="15px";
  hint.style.fontSize="clamp(13px,2.5vw,18px)";
  hint.style.fontWeight="1000";
  hint.style.letterSpacing="1px";
  hint.style.color="#ffe889";
  hint.textContent="TOCA LA PANTALLA PARA CONTINUAR";

  panel.appendChild(text);
  panel.appendChild(hint);
  overlay.appendChild(image);
  overlay.appendChild(shade);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  requestAnimationFrame(()=>{
    overlay.style.opacity="1";
    panel.style.opacity="1";
    panel.style.transform="translateY(0)";
  });

  overlay.addEventListener("click",()=>{
    overlay.style.opacity="0";
    panel.style.opacity="0";
    panel.style.transform="translateY(20px)";
    setTimeout(()=>{
      overlay.remove();
      showMissionCompleteScreen();
    },280);
  },{once:true});
}

/*
 * Si A1 sigue bloqueada, interceptamos el intento antes de que
 * la lógica general cobre oxígeno o mueva a Orion.
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
    state.pendingRoom=null;
    state.encounterMode="a1Locked";
    setEncounterImage(definitionFor("A1").card);
    encounterImage.alt="Sala bloqueada";
    encounterCard.style.cursor="pointer";
    encounter.classList.add("show");
    return;
  }

  return handleRoomClickBeforeA1Fix(room);
};

/*
 * Con A1 desbloqueada se muestra A1F brevemente y luego FF.png.
 */
const openEncounterBeforeA1Fix=openEncounter;
openEncounter=function(room){
  if(room!=="A1"){
    return openEncounterBeforeA1Fix(room);
  }

  const definition=definitionFor("A1");
  turnOffScanner();
  state.pendingRoom="A1";
  state.rooms.A1.visited=true;
  resetEncounterUI();
  encounter.classList.add("show");
  encounterImage.alt=definition.label;
  encounterCard.style.cursor="default";

  if(a1Unlocked()){
    state.encounterMode="a1Final";
    setEncounterImage(definition.finalCard);
    itemSound();

    /* A1F se alcanza a leer antes de entrar al epílogo FF. */
    setTimeout(showA1StoryScreen,1100);
    return;
  }

  state.pendingRoom=null;
  state.rooms.A1.visited=false;
  state.encounterMode="a1Locked";
  setEncounterImage(definition.card);
};

/*
 * Mensaje de bloqueo sin revelar la condición real.
 * Orion permanece en la habitación anterior.
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
  refreshRoomMarkers();

  showMessage("LA SALA ESTÁ BLOQUEADA<br>ALGUIEN LA ESTÁ BLOQUEANDO DE FORMA REMOTA");
},true);
