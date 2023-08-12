import TelegrafI18n from "telegraf-i18n";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url || "");
const __dirname = path.dirname(__filename || "");

const i18n = new TelegrafI18n({
  defaultLanguage: "en",
  allowMissing: false, // Default true
  directory: path.resolve(__dirname, "../locales"),
});

export default i18n;
