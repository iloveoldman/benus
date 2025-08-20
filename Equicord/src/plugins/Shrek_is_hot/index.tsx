import definePlugin from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";
import { React } from "@webpack/common";
import "./style.css";

const SHREK_IMAGE_URL = "https://imgur.com/a/0Xhactf#BMcQLsf";
const SHREK_AUDIO_URL = "https://jumpshare.com/s/6OOYl1xsRPvpvuaPI9k2.mp3";

const settings = definePluginSettings({
  enabled: {
    type: OptionType.BOOLEAN,
    default: false,
    description: "Toggle the Shrek button"
  },
  volume: {
    type: OptionType.NUMBER,
    default: 0.8,
    description: "Playback volume (0.0–1.0)"
  },
  autoplayOnEnable: {
    type: OptionType.BOOLEAN,
    default: false,
    description: "Auto-play the audio when enabling the plugin"
  }
});

export default definePlugin({
  name: "ShrekButton",
  description: "Adds a Shrek button with image and audio.",
  authors: [{ id: 0, name: "iloveoldman" }],
  settings,
  onEnable() {
    if (settings.store.enabled && settings.store.autoplayOnEnable) {
      const audio = new Audio(SHREK_AUDIO_URL);
      audio.volume = settings.store.volume;
      audio.play().catch(console.error);
    }
  },
  renderSettings() {
    return React.createElement("div", { className: "shrek-plugin-settings" },
      React.createElement("img", { src: SHREK_IMAGE_URL, className: "shrek-image", alt: "Shrek" }),
      React.createElement("p", null, "Toggle the Shrek button and adjust volume."),
      React.createElement("input", {
        type: "range",
        min: 0,
        max: 1,
        step: 0.01,
        value: settings.store.volume,
        onChange: (e: any) => settings.store.volume = parseFloat(e.target.value)
      }),
      React.createElement("button", {
        onClick: () => {
          const audio = new Audio(SHREK_AUDIO_URL);
          audio.volume = settings.store.volume;
          audio.play().catch(console.error);
        }
      }, "Play Shrek")
    );
  }
});
