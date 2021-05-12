# mwc-pwa-auth

Federated identity packed into a material design icon button.

## Usage

Drop into a top app bar and set one or more provider keys:

```html
<mwc-top-app-bar centerTitle>
  <div slot="title">mwc-pwa-auth</div>
  <mwc-pwa-auth slot="actionItems" googlekey="…"></mwc-pwa-auth>
</mwc-top-app-bar>
```

**Notice**: In order to make use of this component, you need to [create a provider key](https://github.com/pwa-builder/pwa-auth#creating-keys).

## Powered by

- [lit](https://lit.dev/)
- [Material Web Components](https://github.com/material-components/material-components-web-components)
- [pwa-auth](https://github.com/pwa-builder/pwa-auth)
