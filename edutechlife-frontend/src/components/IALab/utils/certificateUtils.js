// Paleta fiel al diseño original del certificado
export const NAVY = "#1B3A5F";
export const GOLD = "#B08D3F";
export const GOLD_LINE = "#C9A227";
export const LINK = "#2563EB";

// Logos reales del certificado
export const CERT_LOGOS = {
  tic: "/images/cert/tic.png",
  mzlAlcaldia: "/images/cert/mzl-alcaldia.png",
  edutechlife: "/images/cert/edutechlife.png",
};

// Carga cualquier imagen a data URL PNG con dimensiones
export const loadImageDataUrl = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve({
          dataUrl: canvas.toDataURL("image/png"),
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error("image load failed: " + src));
    img.src = src;
  });

// Carga imagen con timeout (evita esperas infinitas)
export const loadImageWithTimeout = async (src, ms = 2500) => {
  try {
    return await Promise.race([
      loadImageDataUrl(src),
      new Promise((res) => setTimeout(() => res(null), ms)),
    ]);
  } catch {
    return null;
  }
};
