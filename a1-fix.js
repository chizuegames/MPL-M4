/* =========================================================
   MPL — MISIÓN 4 — Corrección A1
   A1 se desbloquea al derrotar a los dos Marcianos E3: A5 y A6.
   Si ambos ya fueron derrotados, al entrar se muestra A1F directamente.
   ========================================================= */

FIXED_DEFINITIONS.A1.requires=["A5","A6"];
DEFINITIONS.A1.requires=["A5","A6"];

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
  encounterCard.style.cursor="pointer";

  if(requirementsMet(definition)){
    /* Los dos Marcianos E3 ya fueron derrotados: mostrar el desenlace. */
    state.encounterMode="lootFinal";
    setEncounterImage(definition.finalCard);
    itemSound();
    return;
  }

  /* Todavía falta derrotar a A5 o A6: mostrar la ficha inicial A1E. */
  state.encounterMode="a1Locked";
  setEncounterImage(definition.card);
};

/* Evita que el manejador antiguo muestre el mensaje de A3/A4. */
encounter.addEventListener("click",function(event){
  if(state.encounterMode!=="a1Locked")return;

  if(event.target===encounterBackButton)return;

  event.preventDefault();
  event.stopImmediatePropagation();
  showMessage("DERROTA A LOS DOS MARCIANOS");
  closeUnresolvedToMap();
},true);
