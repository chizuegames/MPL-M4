/* =========================================================
   MPL — MISIÓN 4 — Icono de vida
   Todos los eventos que representan VIDA usan ICOV.png.
   ========================================================= */

["A10","A12"].forEach(room=>{
  if(FIXED_DEFINITIONS[room])FIXED_DEFINITIONS[room].icon="ICOV.png";
  if(DEFINITIONS[room])DEFINITIONS[room].icon="ICOV.png";
});

const lifeEventB=B_EVENT_POOL.find(event=>event.sourceId==="B3");
if(lifeEventB)lifeEventB.icon="ICOV.png";

/* El sorteo de salas B ya ocurrió antes de cargar este archivo.
   Por eso también corregimos cualquier evento VIDA ya sorteado. */
Object.values(DEFINITIONS).forEach(definition=>{
  if(definition && definition.label==="VIDA"){
    definition.icon="ICOV.png";
  }
});

const lifeIconPreload=new Image();
lifeIconPreload.src="ICOV.png";
