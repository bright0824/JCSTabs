/**
 * plugins/webfontloader.js
 *
 * webfontloader documentation: https://github.com/typekit/webfontloader
 */

export async function loadFonts() {
  const webFontLoader = await import("webfontloader");

  webFontLoader.load({
    google: {
      families: [
        // "Material+Icons",
        // "Material+Icons+Outlined",
        // "Material+Icons+Round",
        // "Material+Icons+Sharp",
        // "Material+Icons+Two+Tone",
        "Roboto:100,300,400,500,700,900&display=swap",
      ],
    },
  });
}
