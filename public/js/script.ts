/* Para redimensionar márgenes de nombre */
console.log("carga archivo js");
interface Lineas {
  lineHeightH: number;
  heightH: number;
  linesH: number;
}

function lineas(h: HTMLElement): Lineas {
  const lineHeightH = parseFloat(getComputedStyle(h).lineHeight);
  const heightH = h.offsetHeight;
  const linesH = Math.round(heightH / lineHeightH);

  return {
    lineHeightH,
    heightH,
    linesH
  };
}

function margin(
  lineasFuncion: Lineas,
  lineasNombre: Lineas,
  contNombre: HTMLElement
): void {

  console.log("lineasFuncion.linesH", lineasFuncion.linesH);
  console.log("lineasNombre.linesH", lineasNombre.linesH);
  switch (lineasFuncion.linesH) {

    case 1:
      switch (lineasNombre.linesH) {
        case 1: contNombre.style.marginTop = "35.25px"; break;
        case 2: contNombre.style.marginTop = "28px"; break;
        case 3: contNombre.style.marginTop = "16.35px"; break;
        case 4: contNombre.style.marginTop = "8.55px"; break;
      }
      break;

    case 2:
      switch (lineasNombre.linesH) {
        case 1: contNombre.style.marginTop = "32.3px"; break;
        case 2: contNombre.style.marginTop = "22.5px"; break;
        case 3: contNombre.style.marginTop = "13.4px"; break;
        case 4: contNombre.style.marginTop = "3.6px"; break;
      }
      break;

    case 3:
      switch (lineasNombre.linesH) {
        case 1: contNombre.style.marginTop = "29.5px"; break;
        case 2: contNombre.style.marginTop = "20.25px"; break;
        case 3: contNombre.style.marginTop = "11.6px"; break;
        case 4: contNombre.style.marginTop = "1.8px"; break;
      }
      break;
  }
  console.log("contNombre.style.marginTop", contNombre.style.marginTop);
}

window.addEventListener("load", function () {
  document.querySelectorAll(".container").forEach(container => {

    const h2 = container.querySelector("h2") as HTMLElement | null;
    console.log("h2", h2);
    const h3 = container.querySelector("h3") as HTMLElement | null;
    console.log("h3", h3);
    const contNombre = document.querySelector(".contNombre") as HTMLElement | null;
    console.log("contNombre", contNombre);
    if (h2 && h3 && contNombre) {
      console.log("entra al if, h2 h3 contNombre");
      const lineasNombre = lineas(h2);
      console.log("lineasNombre", lineasNombre);
      console.log("lineasNombre.lineHeightH", lineasNombre.lineHeightH);
      console.log("lineasNombre.heightH", lineasNombre.heightH);
      console.log("lineasNombre.linesH", lineasNombre.linesH);
      
      const lineasFuncion = lineas(h3);
      console.log("lineasFuncion", lineasFuncion);
      console.log("lineasFuncion.lineHeightH", lineasFuncion.lineHeightH);
      console.log("lineasFuncion.heightH", lineasFuncion.heightH);
      console.log("lineasFuncion.linesH", lineasFuncion.linesH);

      margin(lineasFuncion, lineasNombre, contNombre);
    }

  });
});
