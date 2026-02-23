/* Para redimensionar márgenes de nombre */

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
}


document.querySelectorAll(".container").forEach(container => {

  const h2 = container.querySelector("h2") as HTMLElement | null;
  const h3 = container.querySelector("h3") as HTMLElement | null;
  const contNombre = document.querySelector(".contNombre") as HTMLElement | null;

  if (h2 && h3 && contNombre) {

    const lineasNombre = lineas(h2);
    const lineasFuncion = lineas(h3);

    margin(lineasFuncion, lineasNombre, contNombre);
  }

});
