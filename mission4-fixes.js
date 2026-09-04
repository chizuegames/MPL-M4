/* =========================================================
   MPL — MISIÓN 4
   Correcciones del mapa y del Excel (04-09-2026)
   ========================================================= */

/*
 * Las franjas rojas del esquema son los únicos pasillos válidos.
 * Las coordenadas se ajustan a la disposición real de MIc100/60/20.
 */
const M4_ROOM_LAYOUT = {
  A1:{x:50.0,y:22.5},

  B3:{x:11.8,y:31.9}, A2:{x:29.3,y:31.9}, A3:{x:50.0,y:31.9}, A4:{x:70.7,y:31.9}, B4:{x:88.2,y:31.9},
  B1:{x:11.8,y:40.6}, A5:{x:29.3,y:40.6}, B8:{x:50.0,y:40.6}, A6:{x:70.7,y:40.6}, B2:{x:88.2,y:40.6},

  A7:{x:11.8,y:48.9}, A9:{x:50.0,y:48.9}, A8:{x:88.2,y:48.9},
  A10:{x:50.0,y:58.2},

  B5:{x:11.8,y:69.2}, A11:{x:29.3,y:69.2}, B6:{x:50.0,y:69.2}, A12:{x:70.7,y:69.2}, B7:{x:88.2,y:69.2},
  A13:{x:11.8,y:80.9}, A14:{x:88.2,y:80.9}
};

Object.entries(M4_ROOM_LAYOUT).forEach(([room,pos])=>{
  if(!ROOM_LAYOUT[room])ROOM_LAYOUT[room]={x:pos.x,y:pos.y};
  ROOM_LAYOUT[room].x=pos.x;
  ROOM_LAYOUT[room].y=pos.y;

  const button=document.getElementById(`room-${room}`);
  if(button){
    button.style.left=`${pos.x}%`;
    button.style.top=`${pos.y}%`;
  }
});

/* Orion entra por el acople inferior, frente a B6. */
ENTRY_POS.x=50;
ENTRY_POS.y=78.6;

/*
 * Conexiones exactas del esquema. No se crean conexiones por cercanía.
 */
Object.keys(GRAPH).forEach(key=>delete GRAPH[key]);
Object.assign(GRAPH,{
  ENTRADA:["B6"],

  A1:["A3"],
  A3:["A1"],

  B3:["A2","B1"],
  A2:["B3"],

  A4:["B4"],
  B4:["A4","B2"],

  B1:["B3","A5","A7"],
  A5:["B1","B8"],
  B8:["A5","A6","A9"],
  A6:["B8","B2"],
  B2:["A6","B4","A8"],

  A7:["B1"],
  A9:["B8","A10"],
  A8:["B2"],
  A10:["A9","B6"],

  B5:["A11","A13"],
  A11:["B5","B6"],
  B6:["A10","A11","A12"],
  A12:["B6","B7"],
  B7:["A12","A14"],
  A13:["B5"],
  A14:["B7"]
});

/* =========================================================
   Correcciones de encuentros / vidas
   ========================================================= */

/* A3: 6 / 6 / 7 vidas. */
FIXED_DEFINITIONS.A3.hp={100:6,60:6,20:7};
DEFINITIONS.A3.hp={100:6,60:6,20:7};

/* A5 y A6: 4 / 4 / 5 vidas. */
["A5","A6"].forEach(room=>{
  FIXED_DEFINITIONS[room].hp={100:4,60:4,20:5};
  DEFINITIONS[room].hp={100:4,60:4,20:5};
});

/*
 * A14 ya no es una interacción sin combate.
 * Marciano IG: 4 / 5 / 6 vidas y el desenlace A14F aparece al derrotarlo.
 */
FIXED_DEFINITIONS.A14={
  type:"combat",
  label:"MARCIANO IG",
  card:"A14E.png",
  finalCard:"A14F.png",
  icon:null,
  hp:{100:4,60:5,20:6},
  finalRule:"always"
};
DEFINITIONS.A14={...FIXED_DEFINITIONS.A14,hp:{...FIXED_DEFINITIONS.A14.hp}};

/* La enfermera ya tiene icono propio. */
FIXED_DEFINITIONS.A13.icon="ICOEMF.png";
DEFINITIONS.A13.icon="ICOEMF.png";

/*
 * Las cajas de objeto son eventos simples: muestran CJO.png y se resuelven
 * al tocar la ficha; nunca requieren una condición de derrota.
 */
["A2","A4"].forEach(room=>{
  const reward=room==="A2"?"TOMA UN OBJETO":undefined;
  Object.assign(FIXED_DEFINITIONS[room],{
    type:"simple",
    label:"CAJA DE OBJETO",
    card:"CJO.png",
    icon:"ICOCO.png"
  });
  if(reward)FIXED_DEFINITIONS[room].reward=reward;
  delete FIXED_DEFINITIONS[room].hp;
  delete FIXED_DEFINITIONS[room].finalRule;
  delete FIXED_DEFINITIONS[room].finalCard;
  DEFINITIONS[room]={...FIXED_DEFINITIONS[room]};
});

const objectBoxB=B_EVENT_POOL.find(event=>event.sourceId==="B8");
if(objectBoxB){
  Object.assign(objectBoxB,{
    type:"simple",
    label:"CAJA DE OBJETO",
    card:"CJO.png",
    icon:"ICOCO.png",
    reward:"TOMA UN OBJETO"
  });
  delete objectBoxB.hp;
  delete objectBoxB.finalRule;
  delete objectBoxB.finalCard;
}

/* B7: encuentro = E; desenlace = F. */
const b7=B_EVENT_POOL.find(event=>event.sourceId==="B7");
if(b7){
  b7.card="B7E.png";
  b7.finalCard="B7F.png";
}

/* Rehacer el sorteo B con las definiciones ya corregidas. */
randomizeBRooms();

/* Precarga del icono nuevo. */
const nurseIconPreload=new Image();
nurseIconPreload.src="ICOEMF.png";
