import { getEnvMixPanel } from "./getEnvMixPanel";
import mixpanel, { Config } from "mixpanel-browser";

// record_heatmap_data is a valid runtime option but missing in the TypeScript types
interface MixpanelExtendedConfig extends Partial<Config> {
  record_heatmap_data?: boolean;
}

// Analytics event types
enum AnalyticsEvent {
  USER_VISITED_HOME = "user_visited_home",
}

// Common properties for all events
interface BaseEventProperties {
  timestamp: number;
  user_address?: string;
  network: string;
  environment: string;
}

// Analytics utility class
class Analytics {
  private userAddress?: string;
  private isInitialized: boolean = false;
  private isMixpanelLoaded: boolean = false;
  private pendingIdentify: { address: string } | null = null;

  constructor() {
    const config: MixpanelExtendedConfig = {
      autocapture: true,
      record_sessions_percent: 100,
      record_heatmap_data: true,
      api_host: "https://api-eu.mixpanel.com",
      loaded: () => {
        console.info("Mixpanel loaded successfully");
        this.onMixpanelLoaded();
      },
    };

    try {
      mixpanel.init(getEnvMixPanel(), config);
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize Mixpanel:", error);
      this.isInitialized = false;
    }
  }

  onMixpanelLoaded() {
    this.isMixpanelLoaded = true;
    if (this.pendingIdentify) {
      this.identifyUser(this.pendingIdentify.address);
      this.pendingIdentify = null;
    }
  }

  private checkInitialization() {
    if (!this.isInitialized) {
      console.warn("Mixpanel is not initialized. Analytics events will not be tracked.");
      return false;
    }
    if (!this.isMixpanelLoaded) {
      console.warn("Mixpanel is not loaded. Analytics events will not be tracked.");
      return false;
    }
    return true;
  }

  setUserAddress(address: string) {
    this.userAddress = address;
  }

  clearUserAddress() {
    this.userAddress = undefined;
  }

  private getBaseProperties(): BaseEventProperties {
    return {
      timestamp: Date.now(),
      user_address: this.userAddress,
      network: import.meta.env.VITE_APP_ENV || "development",
      environment: import.meta.env.MODE || "development",
    };
  }

  // Track user visited home event
  trackUserVisitedHome(properties: Omit<BaseEventProperties, keyof BaseEventProperties>) {
    if (!this.checkInitialization()) return;
    mixpanel.track(AnalyticsEvent.USER_VISITED_HOME, {
      ...this.getBaseProperties(),
      ...properties,
    });
  }

  // Set user identity when wallet connects
  identifyUser(address: string) {
    if (!this.checkInitialization()) {
      this.pendingIdentify = { address };
      return;
    }

    try {
      mixpanel.identify(address);
      mixpanel.people.set({
        $email: `${address}@vechain.org`,
        $name: address,
        wallet_address: address,
        last_login: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to identify user in Mixpanel:", error);
    }
  }

  // Reset user identity when wallet disconnects
  resetUser() {
    if (!this.checkInitialization()) return;

    try {
      mixpanel.reset();
    } catch (error) {
      console.error("Failed to reset user in Mixpanel:", error);
    }
  }
}

// Export singleton instance
export const analytics = new Analytics();
