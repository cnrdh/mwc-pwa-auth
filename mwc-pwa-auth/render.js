export const renderPwaAuth = ({
  host,
  html,
  ifDefined,
  unsafeSVG,
  personSVG,
}) => {
  const {
    name,
    id,
    iconURL,
    welcome,
    appearance,
    credentialmode,
    provider,
    providerIconURL,
    error,
    icon,
    microsoftkey,
    googlekey,
    applekey,
    facebookkey,
    handleAvatarClick,
    handlePwaSigninCompleted,
  } = host;

  return html`<div>
    <slot name="avatar">
      <mwc-icon-button
        icon="${iconURL ? undefined : icon}"
        @click="${handleAvatarClick}"
        >${icon || iconURL ? undefined : unsafeSVG(personSVG)}${iconURL
          ? html`<img src="${iconURL}" alt="${name ?? id}" />`
          : null}
      </mwc-icon-button>
    </slot>
    <slot name="user-menu">
      <div style="position: relative;">
        <mwc-menu id="user-menu">
          ${id
            ? html`<mwc-list-item twoline noninteractive>
                  <span>${name ?? id}</span>
                  <span slot="secondary">${id}</span>
                </mwc-list-item>
                <p>
                  <img
                    src="${ifDefined(iconURL)}"
                    style="width:100%"
                    alt="profile image for ${name ?? id}"
                  />
                </p>
                <mwc-list-item graphic="icon" ?hasMeta=${false} noninteractive>
                  <span>Signed in with ${provider}</span>

                  <img
                    slot="graphic"
                    src="${ifDefined(providerIconURL)}"
                    alt="provider logo"
                  />
                  <!-- <span slot="meta">info</span> -->
                </mwc-list-item>
                <mwc-list-item noninteractive></mwc-list-item>`
            : html`<slot name="welcome"
                >${id
                  ? null
                  : html`<mwc-list-item noninteractive
                      >${welcome}
                    </mwc-list-item>`}
              </slot>`}

          <div ?hidden="${ifDefined(id)}">
            <pwa-auth
              googlekey="${googlekey}"
              microsoftkey="${microsoftkey}"
              applekey="${applekey}"
              facebookkey="${facebookkey}"
              appearance="${appearance}"
              credentialmode="${credentialmode}"
              @signin-completed=${handlePwaSigninCompleted}
            ></pwa-auth>
          </div>
        </mwc-menu>
      </div>
    </slot>

    <slot name="error">
      <mwc-snackbar
        id="snackbar-error"
        labeltext="Authentication with ${provider} failed"
        ?open="${ifDefined(error)}"
      >
        <mwc-icon-button icon="close" slot="dismiss"> </mwc-icon-button>
      </mwc-snackbar>
    </slot>

    <slot name="info"> </slot>
  </div>`;
};
