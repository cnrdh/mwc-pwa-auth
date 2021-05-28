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
    error,
    icon,
    microsoftkey,
    googlekey,
    applekey,
    facebookkey,
    handleAvatarClick,
    handlePwaSigninCompleted,
  } = host;

  return html`<slot name="avatar">
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
            applekey="${applekey}"
            facebookkey="${facebookkey}"
            appearance="${appearance}"
            credentialmode="${credentialmode}"
            @signin-completed=${handlePwaSigninCompleted}
          ></pwa-auth>
        </mwc-menu>
      </div>
    </slot>

    <slot name="error">
      <mwc-snackbar
        labeltext="Authentication with ${provider} failed"
        ?open="${ifDefined(error)}"
      >
        <mwc-icon-button icon="close" slot="dismiss"> </mwc-icon-button>
      </mwc-snackbar>
    </slot>`;
};
