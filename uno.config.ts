import { defineConfig } from "unocss"
import { colors } from "./src/theme"

export default defineConfig({
  theme: {
    colors,
  },
  rules: [
    [
      /^bg-assets-\[(.+)\]$/,
      ([, file]) => ({ "background-image": `url("@/assets/${file}")` }),
    ],
  ],
})
