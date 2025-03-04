import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { IncrementCounter } from "./actions/increment-counter";
import { NordVpnStatus } from "./actions/vpn-status";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.DEBUG);

streamDeck.logger.error("Failures or exceptions");
streamDeck.logger.warn("Recoverable errors");
streamDeck.logger.info("Hello world");
streamDeck.logger.debug("Debugging information");
streamDeck.logger.trace("Detailed messages");

// Register the actions
streamDeck.actions.registerAction(new IncrementCounter());
streamDeck.actions.registerAction(new NordVpnStatus());

// Finally, connect to the Stream Deck.
streamDeck.connect();


