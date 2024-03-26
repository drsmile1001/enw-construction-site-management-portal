import { GlobalThemeOverrides } from "naive-ui"

export const colors = {
  primary: {
    "400": "#64CBAD",
    "500": "#3dbe98",
    DEFAULT: "#3dbe98",
    "600": "#31987A",
  },
  secondary: {
    "300": "#a5aaaf",
    "400": "#778086",
    "500": "#4a555e",
    "600": "#3b444b",
    "700": "#1d2b36",
    "700_modal": "#1d2b367f",
  },
  tertiary: {
    DEFAULT: "#1E84DF",
  },
  warning: {
    DEFAULT: "#fbbf24",
  },
  danger: {
    DEFAULT: "#f87171",
  },
  success: {
    DEFAULT: "#34d399",
  },
}

const { primary, secondary } = colors
const white = "#ffffff"

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: primary.DEFAULT,
    bodyColor: secondary[500],
  },
  Button: {
    textColorPrimary: white,
    textColorHoverPrimary: white,
    textColorFocusPrimary: white,
  },
  Layout: {
    headerColor: secondary[700],
    siderColor: secondary[600],
  },
  DataTable: {
    tdColor: secondary[500],
    thColor: secondary[600],
    borderColor: secondary[400],
    tdColorHover: secondary[400],
  },
}
