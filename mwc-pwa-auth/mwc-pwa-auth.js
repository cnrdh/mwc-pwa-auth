import { PwaAuth } from "@pwabuilder/pwaauth/build/pwa-auth.js";
import "../mwc.js";
import { html, LitElement } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export const renderPwaAuth = ({
  name = "",
  id = "",
  iconURL,
  host,
  error,
  icon = host.icon ?? "person",
} = {}) => {
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
      <div style="position: relative">
        <mwc-menu id="user-menu">
          ${id && name
            ? html`<mwc-list-item twoline graphic="avatar" noninteractive>
                <span>${name}</span>
                <span slot="secondary">${id}</span>
                <mwc-icon slot="graphic">
                  <img
                    src="${ifDefined(iconURL)}"
                    width="42"
                    height="42"
                    alt="avatar for ${name}"
                  />
                </mwc-icon>
              </mwc-list-item> `
            : null}
          <pwa-auth
            googlekey="${host.googlekey}"
            microsoftkey="${host.microsoftkey}"
            appearance="list"
            credentialmode="prompt"
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
    provider: { type: String },
    applekey: { type: String },
    googlekey: { type: String },
    microsoftkey: { type: String },
  };

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

  async connectedCallback() {
    PwaAuth.assetBaseUrl = "/@pwabuilder/pwaauth/assets";
    super.connectedCallback();
  }

  async firstUpdated() {
    const iconButton = this.renderRoot.querySelector("mwc-icon-button");
    this.usermenu.anchor = iconButton;

    if (window.FederatedCredential) {
      const providers = this.providers;

      const fedCred = await navigator.credentials.get({
        federated: {
          providers,
        },
      });

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

    setTimeout(() => (this.usermenu.open = false), 1000);

    this.dispatchEvent(
      new CustomEvent("mwc-pwa-auth", {
        detail: { ...event.detail, id: email, iconURL: imageUrl },
        bubbles: true,
      })
    );
  }

  render() {
    const host = this;
    const { id, name, iconURL, provider, error } = host;
    return renderPwaAuth({ host, id, name, iconURL, error });
  }
}
