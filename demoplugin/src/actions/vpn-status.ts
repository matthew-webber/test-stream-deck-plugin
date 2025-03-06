/**
 * @prettier
 */

import * as child from 'child_process';
import streamDeck, { action, KeyAction, KeyUpEvent, SingletonAction, WillAppearEvent, DidReceiveSettingsEvent, SendToPluginEvent, JsonValue, KeyDownEvent } from "@elgato/streamdeck";

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


/**
 * An example action class that displays the VPN connection status.
 */
@action({ UUID: "com.mattwebbertime.demoplugin.vpn-status" })
export class NordVpnStatus extends SingletonAction<VpnSettings> {

    override onKeyDown?(ev: KeyDownEvent<VpnSettings>): void {
        streamDeck.logger.info("🟢🟢🟢 onKeyDown", ev);
    }


    override onSendToPlugin(ev: SendToPluginEvent<JsonValue, VpnSettings>): void {
        streamDeck.logger.info("🟢🟢🟢 onSendToPlugin", ev);
    }

    override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<VpnSettings>): Promise<void> {
        this.refreshVpnStatus(ev);
    }

    override onWillAppear(ev: WillAppearEvent<VpnSettings>): void {

        streamDeck.logger.warn('⭕⭕⭕ onwillappear');
        this.refreshVpnStatus(ev);
    }

    private async refreshVpnStatus(ev: WillAppearEvent<VpnSettings> | DidReceiveSettingsEvent<VpnSettings>): Promise<void> {
        const vpnStatus = await this.getVpnStatus();

        let titleString = '';

        streamDeck.logger.info('ev', ev);

        if (vpnStatus.connected) {
            titleString = 'Connected';

            const countryCode = vpnStatus.countryCode?.toLowerCase();
            const stateCode = vpnStatus.stateCode?.toLowerCase();

            const shouldShowStateFlag = ev.payload.settings.displayOptions?.includes('showStateFlag');
            const shouldShowCountryFlag = ev.payload.settings.displayOptions?.includes('showCountryFlag');

            streamDeck.logger.info(`\n${generateButtonGrid(ev)}\n is reporting ${`shouldShowStateFlag: ${shouldShowStateFlag}, shouldShowCountryFlag: ${shouldShowCountryFlag}`}`);

            if (shouldShowCountryFlag && countryCode) {
                try {
                    const countrySVG = await getCountryFlagSVG(countryCode);
                    streamDeck.logger.info(`Fetched country flag SVG: ${countrySVG.substring(0, 50)}...`);
                    titleString = `${titleString}`;
                    streamDeck.logger.info('countrySVG', countrySVG);
                    ev.action.setImage(`data:image/svg+xml,${encodeURIComponent(countrySVG)}`);
                } catch (error) {
                    streamDeck.logger.error("Error fetching country flag SVG", error);
                }
            }

            if (shouldShowStateFlag && countryCode && stateCode) {
                try {
                    const stateSVG = await getStateFlagSVG(countryCode, stateCode);
                    streamDeck.logger.info(`Fetched state flag SVG: ${stateSVG.substring(0, 50)}...`);
                } catch (error) {
                    streamDeck.logger.error("Error fetching state flag SVG", error);
                }
            }
        } else {
            titleString = 'Disconnected';
        }

        ev.action.setTitle(titleString);
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

// New helper functions for fetching flag SVGs
async function getCountryFlagSVG(countryCode: string): Promise<string> {
    const url = `http://flags.ox3.in/svg/${countryCode}.svg`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch country flag from ${url}`);
    }
    return await response.text();
}

async function getStateFlagSVG(countryCode: string, stateCode: string): Promise<string> {
    const url = `http://flags.ox3.in/svg/${countryCode}/${stateCode}.svg`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch state flag from ${url}`);
    }
    return await response.text();
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

function generateButtonGrid(ev: WillAppearEvent<VpnSettings> | DidReceiveSettingsEvent<VpnSettings>): string {
    if ('coordinates' in ev.payload) {
        const { column, row } = ev.payload.coordinates;
        const grid = Array(2).fill(null).map(() => Array(4).fill('⬛️'));

        grid[row][column] = '⬜️';

        return grid.map(row => row.join('')).join('\n');
    } else {
        return '';
    }
}