import { PwaAuth } from "../dep/pwaauth.js";
import "../dep/mwc.js";
import { html, unsafeSVG, ifDefined, LitElement } from "../dep/lit.js";
import { personSVG } from "./person-svg.js";
import { renderPwaAuth } from "./render.js";

const _providers = new PwaAuth().providers;

const providerInfo = ({ provider, providers = _providers } = {}) =>
  providers.find(({ name, url }) => provider === name || provider === url);

const providerIconURL = ({ provider }) =>
  providerInfo({ provider })?.getIconUrl();

export class MwcPwaAuth extends LitElement {
  static properties = {
    id: { type: String },
    name: { type: String },
    icon: { type: String },
    iconURL: { type: String },
    welcome: { type: String },
    provider: { type: String },
    providerIconURL: { type: String },
    appearance: { type: String },
    credentialmode: { type: String },
    applekey: { type: String },
    googlekey: { type: String },
    microsoftkey: { type: String },
  };

  constructor() {
    super();
    this.credentialmode = "silent";
    this.appearance = "list";
  }

  get pwaauth() {
    return this.renderRoot.querySelector("pwa-auth");
  }
  get usermenu() {
    return this.renderRoot.querySelector("#user-menu");
  }

  firstUpdated() {
    if (this.assets) {
      PwaAuth.assetBaseUrl = this.assets;
    }

    const iconButton = this.renderRoot.querySelector("slot[name='avatar'] > *");
    this.usermenu.anchor = iconButton;

    if (window.FederatedCredential) {
      const providers = _providers.map(({ url }) => url);
      const fedCredP = navigator.credentials
        .get({
          federated: {
            providers,
          },
        })
        .then((fedCred) => {
          if (fedCred) {
            const { id, name, iconURL, provider, type, ...rest } = fedCred;
            this.name = name;
            this.id = id;
            this.iconURL = iconURL;
            this.provider = provider;
            this.providerIconURL = providerIconURL({ provider });

            this.dispatchEvent(
              new CustomEvent("mwc-pwa-auth", {
                detail: { id, name, iconURL, provider, type, ...rest },
                bubbles: true,
              })
            );
          }
        });
    }
  }

  handleAvatarClick() {
    this.usermenu.show();
  }

  handlePwaSigninCompleted(event) {
    const {
      detail: { name, email, imageUrl, provider, providerData, error },
    } = event;

    this.name = name;
    this.id = email;
    this.iconURL = imageUrl;
    this.provider = provider;
    this.providerIconURL = providerIconURL({ provider });
    this.providerData = providerData;
    this.error = error ? JSON.stringify(error) : undefined;

    this.usermenu.open = false;

    this.dispatchEvent(
      new CustomEvent("mwc-pwa-auth", {
        detail: { ...event.detail, id: email, iconURL: imageUrl },
        bubbles: true,
      })
    );
  }

  render() {
    return renderPwaAuth({
      host: this,
      html,
      ifDefined,
      unsafeSVG,
      personSVG,
    });
  }
}
