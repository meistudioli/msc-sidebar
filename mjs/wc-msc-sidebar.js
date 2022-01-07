import { _wcl } from './common-lib.js';
import { _wccss } from './common-css.js';

const defaults = {
  open: false,
  side: 'left' // left || right
};
const booleanAttrs = ['open'];
const custumEvents = {
  change: 'msc-sidebar-change'
};

const template = document.createElement('template');
template.innerHTML = `
<style>
${_wccss}

:host {
  --msc-sidebar-z-index: 10000;
  --msc-sidebar-background: transparent;
  --msc-sidebar-overlay: rgba(0,0,0,.5);
  --msc-sidebar-timing-function: cubic-bezier(0,0,.21,1);
  --msc-sidebar-duration: 233ms;

  --overlay: transparent;
}
:host{position:fixed;inset-inline-start:0;inset-block-start:0;inline-size:0;block-size:100%;background:var(--overlay);z-index:var(--msc-sidebar-z-index);overflow:hidden;transition:background var(--msc-sidebar-duration) var(--msc-sidebar-timing-function);will-change:background;}

.msc-sidebar__restrict {
  --msc-sidebar-inset-inline-start: 0;
  --msc-sidebar-inset-inline-end: auto;
  --msc-sidebar-transform-x-start: -100%;
  --msc-sidebar-transform-x-end: 0%;
  --msc-sidebar-transform-x: var(--msc-sidebar-transform-x-start);
}
:host([side="right"]) .msc-sidebar__restrict {
  --msc-sidebar-inset-inline-start: auto;
  --msc-sidebar-inset-inline-end: 0;
  --msc-sidebar-transform-x-start: 100%;
  --msc-sidebar-transform-x-end: 0%;
  --msc-sidebar-transform-x: var(--msc-sidebar-transform-x-start);
}
.msc-sidebar__restrict{position:absolute;inset-block-start:0;inline-size:fit-content;block-size:100%;inset-inline-start:var(--msc-sidebar-inset-inline-start);inset-inline-end:var(--msc-sidebar-inset-inline-end);transition:transform var(--msc-sidebar-duration) var(--msc-sidebar-timing-function);transform:translateX(var(--msc-sidebar-transform-x));background:var(--msc-sidebar-background);will-change:transform;}

:host([data-stage="ready"]){inline-size:100%;}
:host([open]) {
  --overlay: var(--msc-sidebar-overlay);
}
:host([open]) .msc-sidebar__restrict {
  --msc-sidebar-transform-x: var(--msc-sidebar-transform-x-end); 
}
</style>

<div class="msc-sidebar__restrict overscrolling">
  <slot name="content" class="msc-sidebar__slot"></slot>
</div>
`;

// Houdini Props and Vals
if (CSS?.registerProperty) {
  CSS.registerProperty({
    name: '--msc-sidebar-z-index',
    syntax: '<number>',
    inherits: true,
    initialValue: '1000'
  });

  CSS.registerProperty({
    name: '--msc-sidebar-background',
    syntax: '<color>',
    inherits: true,
    initialValue: 'transparent'
  });

  CSS.registerProperty({
    name: '--msc-sidebar-overlay',
    syntax: '<color>',
    inherits: true,
    initialValue: 'rgba(0,0,0,.5)'
  });
  
  CSS.registerProperty({
    name: '--msc-sidebar-duration',
    syntax: '<time>',
    inherits: true,
    initialValue: '233ms'
  });
}

export class MscSidebar extends HTMLElement {
  #data;
  #nodes;
  #config;

  constructor(config) {
    super();

    // template
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // data
    this.#data = {
      controller: ''
    };

    // nodes
    this.#nodes = {
      styleSheet: this.shadowRoot.querySelector('style'),
      restrict: this.shadowRoot.querySelector('.msc-sidebar__restrict')
    };

    // config
    this.#config = {
      ...defaults,
      ...config // new MscSidebar(config)
    };

    // evts
    this._onTransitionend = this._onTransitionend.bind(this);
    this._onClick = this._onClick.bind(this);
  }

  async connectedCallback() {
   const { config, error } = await _wcl.getWCConfig(this);

    if (error) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${error}`);
      this.remove();
      return;
    } else {
      this.#config = {
        ...this.#config,
        ...config
      };
    }

    // upgradeProperty
    Object.keys(defaults).forEach((key) => this._upgradeProperty(key));

    // evts
    this.#data.controller = new AbortController();
    const signal = this.#data.controller.signal;
    this.#nodes.restrict.addEventListener('transitionend', this._onTransitionend, { signal });
    this.addEventListener('click', this._onClick, { signal });
  }

  disconnectedCallback() {
    if (this.#data?.controller) {
      this.#data.controller.abort();
    }
  }

  _format(attrName, oldValue, newValue) {
    const hasValue = newValue !== null;

    if (!hasValue) {
      if (booleanAttrs.includes(attrName)) {
        this.#config[attrName] = false;
      } else {
        this.#config[attrName] = defaults[attrName];
      }
    } else {
      switch (attrName) {
        case 'side':
          this.#config[attrName] = ['left', 'right'].includes(newValue) ? newValue : defaults[attrName];
          break;
        case 'open': {
          this.#config[attrName] = true;
          break;
        }
      }
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (!MscSidebar.observedAttributes.includes(attrName)) {
      return;
    }

    this._format(attrName, oldValue, newValue);

    switch (attrName) {
      case 'open': {
        const flag = this.open;

        if (flag) {
          this.dataset.stage = 'ready';
          this.#nodes.restrict.scrollTop = 0;
        }
        
        // _wcl.scrollLock(flag);
        this._fireEvent(custumEvents.change, {
          stat: flag ? 'open' : 'close'
        });
        break;
      }
    }
  }

  static get observedAttributes() {
    return Object.keys(defaults); // MscSidebar.observedAttributes
  }

  _upgradeProperty(prop) {
    let value;

    if (MscSidebar.observedAttributes.includes(prop)) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        value = this[prop];
        delete this[prop];
      } else {
        if (booleanAttrs.includes(prop)) {
          value = (this.hasAttribute(prop) || this.#config[prop]) ? true : false;
        } else {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : this.#config[prop];
        }
      }

      this[prop] = value;
    }
  }

  set open(value) {
    if (value) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
  }

  get open() {
    return this.#config.open;
  }

  set side(value) {
    if (value) {
      this.setAttribute('side', value);
    } else {
      this.removeAttribute('side');
    }
  }

  get side() {
    return this.#config.side;
  }

  _fireEvent(evtName, detail) {
    this.dispatchEvent(new CustomEvent(evtName,
      {
        bubbles: true,
        composed: true,
        ...(detail && { detail })
      }
    ));
  }

  _onTransitionend() {
    if (!this.open) {
      this.dataset.stage = '';
    }
  }

  _onClick(evt) {
    if (evt.target === this) {
      this.open = false;
    }    
  }

  toggle(force) {
    if (typeof force === 'boolean') {
      this.open = force;
    } else {
      this.open = !this.open;
    }
  }
}

// define web component
const S = _wcl.supports();
const T = _wcl.classToTagName('MscSidebar');
if (S.customElements && S.shadowDOM && S.template && !window.customElements.get(T)) {
  window.customElements.define(_wcl.classToTagName('MscSidebar'), MscSidebar);
}