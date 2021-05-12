import resolve from "@rollup/plugin-node-resolve";
import html from "@open-wc/rollup-plugin-html";
import copy from "rollup-plugin-copy";

const rollupCopyOptions = ({ dest }) => ({
  flatten: false,
  targets: [
    { src: "font", dest },
    { src: "favicon.ico", dest },
    {
      src: "node_modules/@pwabuilder/pwaauth/assets/google-icon.svg",
      dest: dest,
    },
    {
      src: "node_modules/@pwabuilder/pwaauth/assets/*-icon-list.svg",
      dest: dest,
    },
  ],
});

export default ({ dest }) => ({
  input: "index.html",
  output: {
    dir: dest,
    format: "es",
  },
  plugins: [resolve(), html(), copy(rollupCopyOptions({ dest }))],
});
