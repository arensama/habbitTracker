import type { ThemeConfig } from "antd";

const themeConfig: ThemeConfig = {
  token: {},
  components: {
    Typography: {
      fontFamilyCode: "Space Grotesk Regular",
    },
    DatePicker: {
      colorPrimary: "rgb(0, 0, 0)",
      // colorPrimaryBorder: "rgba(0, 0, 0, 0.53)",
      // colorLinkHover: "rgba(89, 89, 89, 0.61)",
      // colorLinkActive: "rgba(97, 97, 97, 0.6)",
      // colorLink: "rgb(0, 0, 0)",
      // activeBorderColor: "rgb(0, 0, 0)",
      // cellHoverWithRangeBg: "rgb(96, 96, 96)",
      // cellRangeBorderColor: "rgb(159, 160, 161)",
      // hoverBorderColor: "rgb(76, 76, 77)",
      // cellActiveWithRangeBg: "rgb(199, 197, 197)",
      controlItemBgActive: "rgb(207, 207, 207)",
    },
    Spin: {
      colorPrimary: "rgb(0, 0, 0)",
    },
  },
};

export default themeConfig;
