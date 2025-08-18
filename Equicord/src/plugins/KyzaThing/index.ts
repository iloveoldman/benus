import definePlugin from "../../utils/types";
import { addMessagePreSendListener, addMessagePreEditListener, MessageObject, removeMessagePreSendListener, removeMessagePreEditListener } from "../../api/MessageEvents";

const dictionary = {
    " i ": " I ",
    " i?": " I?",
    " i!": " I!",
    " i.": " I.",
    "i'll": "I'll",
    "i'd": "I'd",
    "Https://": "https://",
}; // dictionary of words and replacements

export default definePlugin({
    name: "NerdMode",
    description: "Fixes your goofy grammar",
    authors: [{
        name: "DustyAngel47",
        id: 714583473804935238n
    }],
    dependencies: ["MessageEventsAPI"],

    getPunctuation(msg) {
        const endingChar = msg.slice(-1);
        return (
            endingChar === "." ||
            endingChar === "?" ||
            endingChar === "!" ||
            endingChar === "‽"
        ) ? "" : ".";
    },

    correct(msg: string) {
        msg = msg[0].toUpperCase() + msg.slice(1); // make first character uppercase
        msg += this.getPunctuation(msg); // append period to string if punctuation doesn't exist already
        Object.keys(dictionary).forEach(v => {
            msg = msg.replaceAll(v, dictionary[v]);
        });
        msg = msg.replaceAll(/(?<=[\.\?\!\‽] )./gm, m => m.toUpperCase()); // handle having multiple sentences (such an advancement of technology!)
        return msg;
    },

    handler(msg: MessageObject) {
        msg.content = this.correct(msg.content);
    },

    start() {
        this.preSend = addMessagePreSendListener((_, msg) => this.handler(msg));
        this.preEdit = addMessagePreEditListener((_cid, _mid, msg) => this.handler(msg));
    },

    stop() {
        removeMessagePreSendListener(this.preSend);
        removeMessagePreEditListener(this.preEdit);
    }
});