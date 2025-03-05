import streamDeck, { LogLevel, ApplicationDidTerminateEvent, ApplicationDidLaunchEvent } from "@elgato/streamdeck";

import { IncrementCounter } from "./actions/increment-counter";
import { NordVpnStatus } from "./actions/vpn-status";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.DEBUG);

streamDeck.system.onApplicationDidLaunch((ev: ApplicationDidLaunchEvent) => {
    // Handle a registered application launching
    streamDeck.logger.info('🚀🚀🚀 Application launched:', ev.application); // e.g. "Elgato Wave Link.exe"
});


streamDeck.system.onApplicationDidTerminate((ev: ApplicationDidTerminateEvent) => {
    streamDeck.logger.info('⭕⭕⭕ Application terminated:', ev.application); // e.g. "Elgato Wave Link.exe"
});

// Register the actions
streamDeck.actions.registerAction(new IncrementCounter());
streamDeck.actions.registerAction(new NordVpnStatus());

// Finally, connect to the Stream Deck.
streamDeck.connect();


