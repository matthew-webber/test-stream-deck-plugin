/**
 * @prettier
 */

import { action, KeyAction, KeyUpEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

/**
 * An example action class that displays the VPN connection status.
 */
@action({ UUID: "com.mattwebbertime.demoplugin.vpn-status" })
export class NordVpnStatus extends SingletonAction<VpnSettings> {

    override async onWillAppear(ev: WillAppearEvent<VpnSettings>): Promise<void> {
        // Verify that the action is a key so we can call getVpnStatus
        // if (!ev.action.isKey()) return;

        const connected = await this.getVpnStatus();

        if (connected) {
            ev.action.setTitle("Connected");
        } else {
            ev.action.setTitle("Disconnected");
        }
    }

    /**
     * Fetches the VPN status of the IP associated with the user's device.
     * @param action The action that triggered the event.
     * @returns A boolean indicating whether the IP is protected by a VPN.
     */
    private async getVpnStatus(): Promise<boolean> {
        try {
            const response = await fetch("https://web-api.nordvpn.com/v1/ips/info");
            const data = await response.json() as ApiResponse;
            return data.protected === true;
        } catch (error) {
            console.error("Failed to fetch VPN status", error);
            return false;
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
    foo?: string;
};