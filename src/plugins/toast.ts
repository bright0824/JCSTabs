import Toast, { POSITION, type PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";

const options: PluginOptions = {
  timeout: 3000,
  position: POSITION.TOP_RIGHT,
  closeOnClick: true,
  draggable: true,
  pauseOnFocusLoss: true,
};

export { Toast, options };
