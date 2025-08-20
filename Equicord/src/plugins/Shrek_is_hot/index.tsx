import { React } from "@webpack/common";
import definePlugin from "@utils/types";
import { ModalRoot, ModalSize, openModal } from "@utils/modal";
import { findByPropsLazy } from "@webpack";

const IMAGE_URL = "https://i.imgur.com/yRcAQn5.png";
const AUDIO_URL =
  "https://jumpshare.com/download/6OOYl1xsRPvpvuaPI9k2/shimmy-shimmy-yay-made-with-Voicemod.mp3";

import "./style.css";

const ShrekButton = ({ onClick }: { onClick: () => void }) => {
  const buttonRef = React.useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (buttonRef.current) {
      buttonRef.current.classList.add("shrek-jiggle");
      setTimeout(() => buttonRef.current?.classList.remove("shrek-jiggle"), 500);
    }
    onClick();
  };

  return (
    <div
      ref={buttonRef}
      className="shrek-button"
      onClick={handleClick}
    >
      <img src={IMAGE_URL} alt="Shrek" className="shrek-button-img" />
      Shrek
    </div>
  );
};

export default definePlugin({
  name: "ShrekButton",
  description: "Adds a Shrek button that shows a modal with music.",
  authors: [{ id: 676767676767, name: "[repo](<https://github.com/iloveoldman/Vencord-plugins>)" }],

  start() {
    const HeaderBar = findByPropsLazy("container", "children");
    if (!HeaderBar) {
      console.error("[ShrekButton] Could not find HeaderBar.");
      return;
    }

    const orig = HeaderBar.default.prototype.render;
    const plugin = this;

    HeaderBar.default.prototype.render = function (...args: any[]) {
      const res = orig.apply(this, args);

      res.props.children.push(
        <ShrekButton key="shrek-button" onClick={() => plugin.openShrekModal()} />
      );

      return res;
    };

    this.unpatch = () => {
      HeaderBar.default.prototype.render = orig;
    };
  },

  stop() {
    this.unpatch?.();
  },

  openShrekModal() {
    openModal((props) => (
      <ModalRoot {...props} size={ModalSize.MEDIUM}>
        <div className="shrek-modal">
          <img src={IMAGE_URL} alt="Shrek" className="shrek-modal-img" />
          <audio
            ref={(el) => {
              if (el) {
                el.loop = true;
                el.volume = 0.8;
                el.currentTime = 0;
                el.play().catch(() => {});
              }
            }}
            style={{ display: "none" }}
            src={AUDIO_URL}
          />
        </div>
      </ModalRoot>
    ));
  },
});
