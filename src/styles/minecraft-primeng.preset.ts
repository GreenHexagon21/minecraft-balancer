import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const minecraftShadow =
  '0 0 0 2px rgba(0, 0, 0, 0.35), 0 6px 0 rgba(0, 0, 0, 0.45)';

const schemeTokens = {
  primary: {
    color: 'var(--mat-sys-primary)',
    inverseColor: 'var(--mat-sys-on-primary)',
    hoverColor: 'color-mix(in srgb, var(--mat-sys-primary) 88%, black)',
    activeColor: 'color-mix(in srgb, var(--mat-sys-primary) 76%, black)'
  },

  surface: {
    0: 'var(--mat-sys-surface)',
    50: 'color-mix(in srgb, var(--mat-sys-surface) 92%, white)',
    100: 'color-mix(in srgb, var(--mat-sys-surface) 86%, white)',
    200: 'color-mix(in srgb, var(--mat-sys-surface) 76%, white)',
    300: 'color-mix(in srgb, var(--mat-sys-surface-container) 82%, white)',
    400: 'color-mix(in srgb, var(--mat-sys-surface-container-high) 86%, var(--mat-sys-outline))',
    500: 'color-mix(in srgb, var(--mat-sys-surface-container-high) 72%, var(--mat-sys-on-surface))',
    600: 'color-mix(in srgb, var(--mat-sys-surface-container-high) 58%, var(--mat-sys-on-surface))',
    700: 'color-mix(in srgb, var(--mat-sys-surface-container-high) 42%, var(--mat-sys-on-surface))',
    800: 'color-mix(in srgb, var(--mat-sys-surface-container-high) 28%, var(--mat-sys-on-surface))',
    900: 'color-mix(in srgb, var(--mat-sys-surface-container-high) 16%, var(--mat-sys-on-surface))',
    950: 'color-mix(in srgb, var(--mat-sys-background) 24%, black)'
  },

  formField: {
    background: 'var(--mat-sys-surface-variant)',
    filledBackground: 'var(--mat-sys-surface-variant)',
    filledHoverBackground: 'var(--mat-sys-surface-container-high)',
    filledFocusBackground: 'var(--mat-sys-surface-container-high)',
    borderColor: 'var(--mat-sys-outline)',
    hoverBorderColor: 'var(--mat-sys-primary)',
    focusBorderColor: 'var(--mat-sys-primary)',
    invalidBorderColor: 'var(--mat-sys-error)',
    color: 'var(--mat-sys-on-surface)',
    placeholderColor: 'var(--mat-sys-on-surface-variant)',
    borderRadius: '2px',
    shadow: 'none',
    focusRing: {
      width: '2px',
      style: 'solid',
      color: 'var(--mat-sys-primary)',
      offset: '1px',
      shadow: 'none'
    }
  },

  content: {
    background: 'var(--mat-sys-surface)',
    borderColor: 'var(--mat-sys-outline)',
    color: 'var(--mat-sys-on-surface)',
    borderRadius: '2px'
  },

  overlay: {
    select: {
      background: 'var(--mat-sys-surface-variant)',
      borderColor: 'var(--mat-sys-outline)',
      color: 'var(--mat-sys-on-surface)',
      borderRadius: '2px',
      shadow: minecraftShadow
    },
    popover: {
      background: 'var(--mat-sys-surface)',
      borderColor: 'var(--mat-sys-outline)',
      color: 'var(--mat-sys-on-surface)',
      borderRadius: '2px',
      padding: '1rem',
      shadow: minecraftShadow
    },
    modal: {
      background: 'var(--mat-sys-surface)',
      borderColor: 'var(--mat-sys-outline)',
      color: 'var(--mat-sys-on-surface)',
      borderRadius: '2px',
      padding: '1rem',
      shadow: minecraftShadow
    }
  },

  list: {
    option: {
      focusBackground: 'var(--mat-sys-surface-container-high)',
      selectedBackground: 'var(--mat-sys-primary-container)',
      selectedFocusBackground:
        'color-mix(in srgb, var(--mat-sys-primary-container) 82%, black)',
      color: 'var(--mat-sys-on-surface)',
      focusColor: 'var(--mat-sys-on-surface)',
      selectedColor: 'var(--mat-sys-on-primary-container)',
      selectedFocusColor: 'var(--mat-sys-on-primary-container)',
      borderRadius: '2px'
    }
  },

  navigation: {
    item: {
      focusBackground: 'var(--mat-sys-surface-container-high)',
      color: 'var(--mat-sys-on-surface)',
      focusColor: 'var(--mat-sys-primary)',
      borderRadius: '2px',
      icon: {
        color: 'var(--mat-sys-on-surface-variant)',
        focusColor: 'var(--mat-sys-primary)'
      }
    }
  },

  highlight: {
    background: 'var(--mat-sys-primary-container)',
    focusBackground:
      'color-mix(in srgb, var(--mat-sys-primary-container) 82%, black)',
    color: 'var(--mat-sys-on-primary-container)',
    focusColor: 'var(--mat-sys-on-primary-container)'
  }
};

const MinecraftPrimePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: 'color-mix(in srgb, var(--mat-sys-primary) 10%, white)',
      100: 'color-mix(in srgb, var(--mat-sys-primary) 18%, white)',
      200: 'color-mix(in srgb, var(--mat-sys-primary) 26%, white)',
      300: 'color-mix(in srgb, var(--mat-sys-primary) 40%, white)',
      400: 'color-mix(in srgb, var(--mat-sys-primary) 70%, white)',
      500: 'var(--mat-sys-primary)',
      600: 'color-mix(in srgb, var(--mat-sys-primary) 88%, black)',
      700: 'color-mix(in srgb, var(--mat-sys-primary) 76%, black)',
      800: 'color-mix(in srgb, var(--mat-sys-primary) 62%, black)',
      900: 'color-mix(in srgb, var(--mat-sys-primary) 48%, black)',
      950: 'color-mix(in srgb, var(--mat-sys-primary) 34%, black)'
    },

    focusRing: {
      width: '2px',
      style: 'solid',
      color: 'var(--mat-sys-primary)',
      offset: '2px'
    },

    colorScheme: {
      light: schemeTokens,
      dark: schemeTokens
    }
  },

  components: {
    button: {
      root: {
        borderRadius: '2px',
        paddingX: '1rem',
        paddingY: '0.875rem',
        raisedShadow: minecraftShadow,
        label: {
          fontWeight: '400'
        }
      }
    },

    inputtext: {
      root: {
        borderRadius: '2px'
      }
    },

    select: {
      root: {
        background: 'var(--mat-sys-surface-variant)',
        borderRadius: '2px'
      },
      overlay: {
        background: 'var(--mat-sys-surface-variant)',
        borderColor: 'var(--mat-sys-outline)',
        borderRadius: '2px',
        shadow: minecraftShadow
      },
      option: {
        borderRadius: '2px'
      }
    },

    card: {
      root: {
        background: 'var(--mat-sys-surface)',
        color: 'var(--mat-sys-on-surface)',
        borderRadius: '2px',
        shadow: minecraftShadow
      },
      subtitle: {
        color: 'var(--mat-sys-on-surface-variant)'
      }
    },

    dialog: {
      root: {
        background: 'var(--mat-sys-surface)',
        borderColor: 'var(--mat-sys-outline)',
        color: 'var(--mat-sys-on-surface)',
        borderRadius: '2px',
        shadow: minecraftShadow
      }
    },

    menu: {
      root: {
        background: 'var(--mat-sys-surface)',
        borderColor: 'var(--mat-sys-outline)',
        color: 'var(--mat-sys-on-surface)',
        borderRadius: '2px',
        shadow: minecraftShadow
      },
      item: {
        borderRadius: '2px'
      }
    }
  },

  css: () => `
    .p-component {
      font-family: "Press Start 2P", var(--mat-sys-body-large-font), monospace;
    }

    .p-button,
    .p-inputtext,
    .p-select,
    .p-card,
    .p-dialog,
    .p-menu,
    .p-tieredmenu,
    .p-contextmenu,
    .p-popover,
    .p-datepicker-panel {
      border-radius: 2px;
    }

    .p-card,
    .p-dialog,
    .p-menu,
    .p-tieredmenu,
    .p-contextmenu,
    .p-popover,
    .p-select-overlay,
    .p-datepicker-panel {
      border: 2px solid var(--mat-sys-outline);
      box-shadow: ${minecraftShadow};
    }

    .p-select {
      background: var(--mat-sys-surface-variant);
    }

    .p-select-label,
    .p-inputtext,
    .p-button {
      letter-spacing: 0;
      text-transform: none;
    }

    a {
      color: var(--mat-sys-primary);
    }

    a:hover {
      color: var(--mat-sys-tertiary);
    }
  `
});

export default MinecraftPrimePreset;