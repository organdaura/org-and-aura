/**
 * Global Locale Normalization
 *
 * Ensures deterministic international ('en-US') formatting for all numbers and dates
 * across both Node.js SSR and client browsers globally, eliminating React hydration mismatches.
 */
export function initLocaleNormalization() {
  if (typeof Number !== "undefined" && Number.prototype.toLocaleString) {
    const origNumLocale = Number.prototype.toLocaleString;
    Number.prototype.toLocaleString = function (
      locales?: string | string[],
      options?: Intl.NumberFormatOptions
    ) {
      return origNumLocale.call(this, locales || "en-US", options);
    };
  }

  if (typeof Date !== "undefined") {
    const origDateLocale = Date.prototype.toLocaleString;
    Date.prototype.toLocaleString = function (
      locales?: string | string[],
      options?: Intl.DateTimeFormatOptions
    ) {
      return origDateLocale.call(this, locales || "en-US", options);
    };

    const origDateDate = Date.prototype.toLocaleDateString;
    Date.prototype.toLocaleDateString = function (
      locales?: string | string[],
      options?: Intl.DateTimeFormatOptions
    ) {
      return origDateDate.call(this, locales || "en-US", options);
    };

    const origDateTime = Date.prototype.toLocaleTimeString;
    Date.prototype.toLocaleTimeString = function (
      locales?: string | string[],
      options?: Intl.DateTimeFormatOptions
    ) {
      return origDateTime.call(this, locales || "en-US", options);
    };
  }
}

// Execute immediately when imported in any module
initLocaleNormalization();

export default initLocaleNormalization;
