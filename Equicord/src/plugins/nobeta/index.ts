import definePlugin from "../../utils/types";
import { addMessagePreSendListener, MessageObject, removeMessagePreSendListener } from "../../api/MessageEvents";

export default definePlugin({
    name: "NoBetaURLs",
    description: "Removes the canary and ptb subdomains from urls",
    authors: [{ name: "ICodeInAssembly", id: 702973430449832038n }],
    dependencies: ["MessageEventsAPI"],
    removeBetas(msg: MessageObject) {
        msg.content = msg.content.replace(/(?<=https:\/\/)(canary.|ptb.)(?=discord(?:app)?.com\/channels\/(?:\d{17,20}|@me)\/\d{17,20}\/\d{17,20})/g, ""); // Ven W
    },

    start() {
        this.preSend = addMessagePreSendListener((_, msg) => this.removeBetas(msg));
    },

    stop() {
        removeMessagePreSendListener(this.preSend);
    }
});