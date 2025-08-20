import { definePluginSettings } from "@api/Settings";
import definePlugin from "@utils/types";
import { after } from "@utils/patcher.js";
import { findByPropsLazy } from "@webpack";

const settings = definePluginSettings({
    triggerWord: {
        default: "",
        description: "Messages containing this word will be highlighted and appear in Mentions. https://github.com/iloveoldman/Vencord-plugins"
    }
});

const MessageClasses = findByPropsLazy("message", "mentioned");
const CurrentUser = findByPropsLazy("getCurrentUser");

export default definePlugin({
    name: "HighlightTrigger",
    description: "Highlights messages with your trigger word as if they mentioned you.",
    authors: [{ id: 0, name: "you" }],
    settings,

    patches: [
        {
            find: "Message",
            replacement: {
                match: /renderMessage.+?;/,
                replace: (orig: string) => {
                    after("renderMessage", MessageClasses, (args: any[], res: any) => {
                        const trigger = settings.store.triggerWord?.trim();
                        if (!trigger) return res;

                        const content: string = args?.[0]?.message?.content ?? "";
                        if (!content) return res;

                        if (content.toLowerCase().includes(trigger.toLowerCase())) {
                            res.props.className += ` ${MessageClasses.mentioned}`;
                        }

                        return res;
                    });

                    return orig; // ✅ returns string as required
                }
            }
        },
        {
            find: "MessageStore",
            replacement: {
                match: /receiveMessage\(.+?\){/,
                replace: (orig: string) => {
                    after("receiveMessage", null, (args: any[]) => {
                        const msg = args?.[1];
                        const trigger = settings.store.triggerWord?.trim();
                        if (!msg || !trigger) return;

                        const content: string = msg.content ?? "";
                        if (!content) return;

                        if (content.toLowerCase().includes(trigger.toLowerCase())) {
                            const user = CurrentUser?.getCurrentUser?.();
                            if (user) {
                                msg.mentions ??= [];
                                if (!msg.mentions.find((m: any) => m.id === user.id)) {
                                    msg.mentions.push({ id: user.id, username: user.username });
                                }
                                msg.mention_everyone = false;
                            }
                        }
                    });

                    return orig; // ✅ returns string
                }
            }
        }
    ]
});