declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
          };
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          show: () => void;
          hide: () => void;
          onClick: (fn: () => void) => void;
        };
      };
    };
  }
}

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export class TelegramAPI {
  private static instance: TelegramAPI;
  private webApp: any;

  private constructor() {
    this.webApp = window.Telegram?.WebApp;
  }

  public static getInstance(): TelegramAPI {
    if (!TelegramAPI.instance) {
      TelegramAPI.instance = new TelegramAPI();
    }
    return TelegramAPI.instance;
  }

  public isAvailable(): boolean {
    return !!this.webApp;
  }

  public getUser(): TelegramUser | null {
    return this.webApp?.initDataUnsafe?.user || null;
  }

  public ready(): void {
    if (this.webApp) {
      this.webApp.ready();
      this.webApp.expand();
    }
  }

  public close(): void {
    if (this.webApp) {
      this.webApp.close();
    }
  }

  public showMainButton(text: string, onClick: () => void): void {
    if (this.webApp?.MainButton) {
      this.webApp.MainButton.text = text;
      this.webApp.MainButton.onClick(onClick);
      this.webApp.MainButton.show();
    }
  }

  public hideMainButton(): void {
    if (this.webApp?.MainButton) {
      this.webApp.MainButton.hide();
    }
  }
}

export const telegram = TelegramAPI.getInstance();
