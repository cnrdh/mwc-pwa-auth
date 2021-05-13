import { PwaAuth } from "../pwaauth.js";
import "../mwc.js";
import { html, LitElement, ifDefined } from "../lit.js";

export const renderPwaAuth = ({ host, html, ifDefined }) => {
  const {
    name,
    id,
    iconURL,
    welcome,
    appearance,
    credentialmode,
    error,
    icon,
    microsoftkey,
    googlekey,
  } = host;

  return html`<slot name="avatar">
      <mwc-icon-button
        icon="${iconURL ? undefined : icon}"
        @click="${host.handleAvatarClick}"
        >${iconURL && id
          ? html`<img src="${iconURL}" alt="${name ?? id}" />`
          : null}
      </mwc-icon-button>
    </slot>
    <slot name="user-menu">
      <div style="position: relative;">
        <mwc-menu id="user-menu">
          ${id && name
            ? html`<mwc-list-item twoline noninteractive>
                  <span>${name}</span>
                  <span slot="secondary">${id}</span>
                </mwc-list-item>
                <img
                  src="${ifDefined(iconURL)}"
                  style="width:100%"
                  alt="profile image for ${name}"
                /> `
            : html`<slot name="welcome">
                <mwc-list-item noninteractive>${welcome}</mwc-list-item>
              </slot>`}

          <pwa-auth
            googlekey="${googlekey}"
            microsoftkey="${microsoftkey}"
            appearance="${host.appearance}"
            credentialmode="${host.gredentialmode}"
            @signin-completed=${host.handlePwaSigninCompleted}
          ></pwa-auth>
        </mwc-menu>
      </div>
    </slot>

    <mwc-snackbar
      labeltext="Authentication with ${host.provider} failed"
      ?open="${ifDefined(error)}"
    >
      <mwc-icon-button icon="close" slot="dismiss"></mwc-icon-button
    ></mwc-snackbar> `;
};

export class MwcPwaAuth extends LitElement {
  static properties = {
    id: { type: String },
    name: { type: String },
    icon: { type: String },
    iconURL: { type: String },
    welcome: { type: String },
    provider: { type: String },
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
    this.icon = "person";
  }

  get pwaauth() {
    return this.renderRoot.querySelector("pwa-auth");
  }
  get usermenu() {
    return this.renderRoot.querySelector("#user-menu");
  }

  get providers() {
    return [
      this.googlekey && "https://account.google.com",
      this.microsoftkey && "https://graph.microsoft.com",
      this.applekey && "https://appleid.apple.com",
    ];
  }

  firstUpdated() {
    if (this.assets) {
      PwaAuth.assetBaseUrl = this.assets;
    }

    const iconButton = this.renderRoot.querySelector("mwc-icon-button");
    this.usermenu.anchor = iconButton;

    if (window.FederatedCredential) {
      const providers = this.providers;

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
    this.providerData = providerData;
    this.error = error ? JSON.stringify(error) : undefined;

    setTimeout(() => (this.usermenu.open = false), 2000);

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
    });
  }
}
