/**
 * @prettier
 */

import streamDeck, { action, KeyAction, KeyUpEvent, SingletonAction, WillAppearEvent, DidReceiveSettingsEvent, SendToPluginEvent, JsonValue } from "@elgato/streamdeck";

const countryEmojis: Record<string, string> = {
    "us": "🇺🇸",
    "ca": "🇨🇦",
    "gb": "🇬🇧",
    "uk": "🇬🇧",
    "de": "🇩🇪",
    "fr": "🇫🇷",
    "jp": "🇯🇵",
    "au": "🇦🇺",
    "se": "🇸🇪",
    "no": "🇳🇴",
    "ch": "🇨🇭",
    "nl": "🇳🇱",
    "fi": "🇫🇮",
    "dk": "🇩🇰",
    "it": "🇮🇹",
    "es": "🇪🇸"
};

const stateFlags: Record<string, string> = {
    "nc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAADVCAMAAAARktncAAAAPFBMVEUAKGi/oRlOWUfuvgffhJfYsQ+MgC7///+/CjD/ygClkSQzSVZsbDseO1xQbJcNMGM9HlXY3uh0iq2qt8x9Wp0IAAAJcklEQVR42u3d25IUOQ4GYB1Wyv1lubzdvP+77kUeKuvUQMNsxJblK2BgIviwLVl22kT/s/aff79jowIswAIswAIswAIswAIswAIswAIswAIswAIswAIswAIswAIswAIswAIswAIswAIswAIswAIswAIswAIswAIswAL8fwUcvTURyUzPzBRprY8C/IXWm6SHmSpum6pZeErrBfiqNUm2e7j7psYu0gvwfsy2ZMOvNrWQNgrw0BO/4mkCAELSwK37w1DefmCcrQCJiNqhpwEgOwAEtS5KmaSc4IPRmgD7OLeQMTvgEN403GAjgeEAIALvQYoRIRq5+TFRQgeJ6zaWs88MOISPrkUNsJFBCgDB8B4D6NlH8y5rL1XuDmgIOWL9s88IZwHcVGIFJAdskGyiThEDaB6JSNt+LygAQLoiqe2EY0rAHhsVJQCmHAYwbb+aFGACKCLhiYytoxoAJwNgQtvQ5jYhYDsCbyMDmGwI9ikQRg4ocZCFnwCD9v8IqAwGr7/ufT5ABRCDgaQGBBFRAC23AdwHcRI5TNx9B/QOQBoAaOsG2/8lYr4hnOvMx3CiQBAjhyHXOVDdgxXMANRMEWuHdQGYDID2btAu0QQAZMI50AAkUTBJ1xiANl/JvlqEALKKDQOc2ja0x3SA3ROADqKkGBnjoXZgxlszM70rLwQFAOVcu2PONgeONEQAyOFE7mR2rRaEp4i01nofRKP31loTyYxrsYEDQDdgBIAAn3OZ9wdcM7hUQEcGJbaMjl1eFKzGVnOQ9GvVQRJGDJgBiDYPYK79yHzN6bZQ4dJ/sWaYsfZEptZlT8Whx8r4zQGPDBpugLZY6wL9d0rWLcMAmAeA2Md19BkA20PpCva6MvVVDWwL2HoN3CbvDyg3sZQBmHt+Z+toeDIAnEuGKm8O2N3MzI5gmopwBdo3AB0avkWQa/Px5j1wjN572wt85hmqZvH7fqIALI8OaOv+nfQp8sA8Oox7BLOP3wbMiAhm0WuxdU93JgCMm2FnIb/fA5tB9ToZwPpEifQ4zVuWbXwnhlA/70UB2mZaieixjyTf09snwpOhTAQoeLmf8bu5TD/2VXIiwMRjCeX7hhthTAQYD1X4v0BoYxrAwQ/7QH/Yeiq0TwPYH3ci/5wwrlHk7QFbo3+gyTyA/1DrBVhHfAuwAAuwAAuwAAuwAAuwAAuwAAuwAAuwAAuwAAuwAAuwAAuwAAvwO60V4J8BfhTgHwFell6AfwL4Y/n8+lxRa4/nM6cDHP3lYY+P5ccXfy7X45Us8wH66UhkA4DnI7Uty/L6KIfdfNwwIaD+DHB8Lsty+bnffkZ/NsDtQNoXPfBjWV6O4dtPs3NKQPsJYF+WZXmRyMjdt+xjRsD1E6/XgJ/LsizL8wBj+7dx21f/MiUgfw34sSzL8jyRadd/gPWzHZ8SEP0rwLEsL8dwng7m97uLT2YC9HvAz8/Pz8/Py+VyuVzWEbwsl3PbbOMcOXROQN3m/hvA8WP5qn208xS4/yTdfcI50HXtRHdD+PMLvx9HrD3lkVOuhR2A+4pwPwe2j1fd75pTj2sW9CTA/Osd2xPAvs5jD0HkxTD+cUr1xsPy46aE847tCSDxfvXifRR+NoxvlnT94caxKQHXW7CepTH9fhh/3P6GAlxTGAPA/WkeeDuM75PpGsIrYAKAPE+kz4KPufRXQWQiQFJgvTirv1iGPJsA99z5SGPSb+6emQUwTiuSR8DLl0N4LWaNk6bN2QP7S8DbOfBhDMepAnM/Ic7UA48LUPqLEbxH4/asmLB9pC53IXkqwPYC8LInz5fnY7hf70kYfFeSngEwjj7DTwG3xcjlWNl9PK/om/t2LXyftAfupfn+ZARvpZcVs39d0o+50phxBVwLU3eA43Ja+47x+SwO31wfpZ1mHcLbRWT9IQZfbj0fxvA4b8vJjIn0Bjj0SQ98WPt+PB6SGfbcbwrAZOY8l/fvqjE/7g+8jB9P9pZkfQni/g6fGQB/0p5tMT0/odCf3P1WgH/YCrAAC7AAC7AAC7AAC7AAC7AAC7AAC7AAC7AAC7AAC7AAC7AAC7AAC3CMf8TteJ7p/Xtg9L/P1yPmGcL+Nx8EWvlSrycE3x8wj4dY/9botfMBmfcHFAX+4rNK6zfr1xNu7w+4vTEc7S9Ek+NhueurXu8PeBxMY/lDwpbHGTefKQ+8ni5Vl/7tvueszy4+mQAwb47n8jeeCKfutn/1fn/IcgJAub6MG8xs30gMW0R4xDGET6+7TgB4PO8qEmbM34jI3VSBCD+eVxdprbX21oBDmJn5eBfdGZ56c+nLr7YhgCVDr2fNVVW5vXkPFD3PfgnA0vk7cWTE+o1NnP+P0d9+CLfT1wmp339neByPM58+GFnf7HzzObAff2F2ADAA5u138z9WAOoBHBPCvjx8+yAi299YAGhrRy7zi0n1aBl2XF4WRxc8ChTvH4W7bxEE2qkDWz5snq2Pr3NnyTDdY0YMy8AaR3iqPJDEoAlo602Afp0Z1cKltd5vqq69NZF0ZjsiBguJtxAHwHozjU5R0h+ZCsiwlgiKRsxsp4TEzJgj3COYzUzPsRamjVoTJ2pDANxOoZPsiTggRDIcIkB3uY3Qr5t5p3BDilEDkwG3edAcgA1IYhZio1R0H+lJnLnG5VeN02k0CgAi6A1KfHeF6iRDmAEJgMlyDOqdyYARLZHtC8A2jAHiFZApfb2zY7bvhanzfgM0hmu45nBjsuGQo1aTBg1nmKodRT/D1utEAB7rl7MTzoHbNeTRghQAWh80RInR/ShQhY7ehgrb1iuZKXbAlGtAnnJjva2rWM/1MsUAD2cy3e+hsE7sDUrRMnpurN13wPX6PFiOaU8miOv10ggFugetYXVNZohVweRNYkRu1x0LAAoAnC82BWY62nFUBLIBoMiGoCNfIQN4CDLQDG1bsAEYa3fUeLqnMtfZmCahAIwBIxY5BWEjQ4xUpEMY614ekwLJAPhVEWe2w0VDcluEONwhfb9Mh0l1u21VM7DuX+qwn+2jTHg6a7SMfZ3LniI7YKxrlnRm7CUYtZ/s5E16vK03uSpuJS4oM5/2LtX4F7ZBZz4fOHqT9FjLB6rrPoeqmYWntF8rGdYBy1WytSbrVlvvv3WAoQDrhGoBFmABFmABFmABFmABFmABFmABFmABFmABFmABFmABFmABFmABFmABFmABFmABFmABFmABFmABFmABFmAB/rz9F822wkjbE1ISAAAAAElFTkSuQmCC",
    "unknown": "data:image/png;base64,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",
};

/**
 * An example action class that displays the VPN connection status.
 */
@action({ UUID: "com.mattwebbertime.demoplugin.vpn-status" })
export class NordVpnStatus extends SingletonAction<VpnSettings> {


    override onSendToPlugin(ev: SendToPluginEvent<JsonValue, VpnSettings>): void {
        streamDeck.logger.info("🟢🟢🟢 onSendToPlugin", ev);
    }

    override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<VpnSettings>): Promise<void> {
        // streamDeck.logger.info("🟢🟢🟢 onDidReceiveSettings", ev);
        // streamDeck.logger.info("🧊🧊🧊 displayOptions", ev.payload.settings.displayOptions);

        if (ev.payload.settings.displayOptions?.includes('showStateFlag')) {
            streamDeck.logger.info("🌝🌝🌝 showStateFlag has changed");
            await ev.action.setSettings({
                ...ev.payload.settings,
                showStateFlagChanged: true,
            });
        } else {
            await ev.action.setSettings({
                ...ev.payload.settings,
                showStateFlagChanged: false,
            });
            streamDeck.logger.info("🌙🌙🌙 showStateFlag has not changed");
        }
    }

    override async onWillAppear(ev: WillAppearEvent<VpnSettings>): Promise<void> {
        // Verify that the action is a key so we can call getVpnStatus
        // if (!ev.action.isKey()) return;

        const vpnStatus = await this.getVpnStatus();

        if (vpnStatus.connected) {
            const countryCode = vpnStatus.countryCode?.toLowerCase();
            const stateCode = vpnStatus.stateCode?.toLowerCase();

            const emoji = countryCode ? (countryEmojis[countryCode] || '🤮') : '';

            ev.action.setTitle(`connected\n${emoji}`);

            // streamDeck.logger.info("🧠🧠🧠 ev.payload.settings.displayOptions", ev.payload.settings.displayOptions)
            const shouldShowStateFlag = ev.payload.settings.displayOptions?.includes('showStateFlag')
            streamDeck.logger.info("🔴 shouldShowStateFlag", shouldShowStateFlag);
            if (shouldShowStateFlag) {
                const stateFlagImage = stateCode ? (stateFlags[stateCode] || stateFlags['unknown']) : '';
                ev.action.setImage(stateFlagImage);
            } else if (ev.payload.settings.showStateFlagChanged) {
                // ev.action.setImage(null);
            }
        } else {
            ev.action.setTitle("D");
        }
    }

    /**
     * Fetches the VPN status of the IP associated with the user's device.
     * @param action The action that triggered the event.
     * @returns Object containing connection status and country code if available.
     */
    private async getVpnStatus(): Promise<{ connected: boolean, countryCode?: string, stateCode?: string }> {
        try {
            const response = await fetch("https://web-api.nordvpn.com/v1/ips/info");
            const data = await response.json() as ApiResponse;
            streamDeck.logger.info("data is", data);
            return {
                connected: data.protected === true,
                countryCode: data.country_code,
                stateCode: data.state_code,
            };
        } catch (error) {
            console.error("Failed to fetch VPN status", error);
            return { connected: false };
        }
    }
}

type ApiResponse = {
    ip: string;
    country: string;
    country_code: string;
    region: string;
    zip_code: string;
    city: string;
    state_code: string;
    longitude: number;
    latitude: number;
    isp: string;
    isp_asn: string;
    gdpr: boolean;
    protected: boolean;
};

type VpnSettings = {
    displayOptions: string[]
    clearImageButton: JsonValue;
    showStateFlagChanged: boolean;
};