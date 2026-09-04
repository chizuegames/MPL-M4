/* Escáner Misión 4: usa Esc1.png, rota según la dirección del pasillo y mantiene el check real. */
(function(){
  const previousMarkerAt=markerAt;

  markerAt=function(id,pos,className,text=""){
    const isCheck=className.includes("check-marker");
    const isScan=className.includes("scan-marker");

    if(!isCheck&&!isScan){
      return previousMarkerAt(id,pos,className,text);
    }

    removeMarker(id);

    const image=document.createElement("img");
    image.id=id;
    image.draggable=false;
    image.style.left=`${pos.x}%`;
    image.style.top=`${pos.y}%`;

    if(isCheck){
      image.src="icocheck.png";
      image.className="check-image";
    }else{
      const direction=(className.match(/dir-(up|right|left|down)/)||[])[1]||"up";
      image.src="Esc1.png";
      image.className=`scan-image dir-${direction}`;
      image.alt=`Escáner ${direction}`;
    }

    iconsLayer.appendChild(image);
    return image;
  };
})();