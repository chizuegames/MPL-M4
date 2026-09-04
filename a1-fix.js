/* =========================================================
   MPL — MISIÓN 4 — Corrección A1
   A1 se desbloquea al derrotar a los dos marcianos clave:
   A3 = Marciano CP y A14 = Marciano IG.
   Si ambos ya fueron derrotados, al entrar se muestra A1F directamente.
   ========================================================= */

FIXED_DEFINITIONS.A1.requires=["A3","A14"];
DEFINITIONS.A1.requires=["A3","A14"];

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
    /* Marciano CP (A3) y Marciano IG (A14) derrotados: mostrar A1F. */
    state.encounterMode="lootFinal";
    setEncounterImage(definition.finalCard);
    itemSound();
    return;
  }

  /* Todavía falta derrotar a A3 o A14: mostrar A1E. */
  state.encounterMode="a1Locked";
  setEncounterImage(definition.card);
};

encounter.addEventListener("click",function(event){
  if(state.encounterMode!=="a1Locked")return;
  if(event.target===encounterBackButton)return;

  event.preventDefault();
  event.stopImmediatePropagation();
  showMessage("DERROTA AL MARCIANO CP Y AL MARCIANO IG");
  closeUnresolvedToMap();
},true);
