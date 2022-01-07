# msc-sidebar

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/msc-sidebar) [![DeepScan grade](https://deepscan.io/api/teams/16372/projects/19762/branches/518552/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=16372&pid=19762&bid=518552)

A sidebar provides a way to display meta content intended for temporary access (navigation links, buttons, menus, etc.). The sidebar can be revealed by a button tap while the main content remains visually underneath.

Let's take a try and see what can &lt;msc-sidebar /> do.

![<msc-sidebar />](https://blog.lalacube.com/mei/img/preview/msc-sidebar.png)

## Basic Usage

&lt;msc-sidebar /> is a web component. All we need to do is put the required script into your HTML document. Then follow &lt;msc-sidebar />'s html structure and everything will be all set.

- Required Script

```html
<script 
  type="module"
  src="https://your-domain/wc-msc-sidebar.js"
</script>
```

- Structure

Put the content inside &lt;msc-sidebar /> as its child. When &lt;msc-sidebar /> opened. It will display the content with the whole viewport size.

```html
<msc-sidebar>
  <script type="application/json">
    {
      "open": false,
      "side": "left"
    }
  </script>

  <!-- content node, add slot="content" to it. -->
  <nav slot="content">
    ...
  </nav>
</msc-sidebar>
```

Or set attributes directly.

```html
<msc-sidebar side="left">
  <!-- content node, add slot="content" to it. -->
  <nav slot="content">
    ...
  </nav>
</msc-sidebar>
```

Otherwise, developers could also choose remoteconfig to fetch config for

```html
<msc-sidebar remoteconfig="https://your-domain/api-path">
  <!-- content node, add slot="content" to it. -->
  <nav slot="content">
    ...
  </nav>
</msc-sidebar>
```

## JavaScript Instantiation

&lt;msc-sidebar /> could also use JavaScript to create DOM element. Here comes some examples.

```html
<msc-sidebar /> could also use JavaScript to create DOM element. Here comes some examples.

<script type="module">
import { MscSidebar } from 'https://your-domain/wc-msc-sidebar.js';

// use DOM api
const nodeA = document.createElement('msc-sidebar');
document.body.appendChild(nodeA);
nodeA.side = "right";
nodeA.appendChild(
  document.querySelector(".your-content-node")
);

// new instance with Class
const nodeB = new MscSidebar();
document.body.appendChild(nodeB);
nodeB.side = "right";
nodeB.appendChild(
  document.querySelector(".your-content-node")
);

// new instance with Class & default config
const config = {
  open: false,
  side: "right"
};
const nodeC = new MscStretchTextarea(config);
document.body.appendChild(nodeC);
nodeC.appendChild(
  document.querySelector(".your-content-node")
);
</script>
```

## Style Customization

&lt;msc-sidebar /> uses CSS variables to style its interface. That means developer could easy change them into the lookup you like.

```html
<style>
msc-sidebar {
  --msc-sidebar-z-index: 1000;
  --msc-sidebar-background: cubic-bezier(0,0,.21,1);
  --msc-sidebar-overlay: rgba(0,0,0,.5);
  --msc-sidebar-timing-function: cubic-bezier(0,0,.21,1);
  --msc-sidebar-duration: 233ms;
}
</style>
```

## Attributes

&lt;msc-sidebar /> supports some attributes to let it become more convenience & useful.

- **open**

Set open for &lt;msc-sidebar />. Default is `false` (not set).

```html
<msc-sidebar open>
  <!-- content node -->
  <nav slot="content">
    ...
  </nav>
</msc-sidebar>
```

- **side**

This attribute will positioned the content node's displayed position. There are two valid value which are "`left`" and "`right`". Default is "`left`".

```html
<msc-sidebar side="left">
  <!-- content node -->
  <nav slot="content">
    ...
  </nav>
</msc-sidebar>
```

## Properties

| Property Name | Type | Description |
| ----------- | ----------- | ----------- |
| open | Boolean | Getter / Setter for open. Default is `false`. |
| side | String | Getter / Setter for side. Valid value should be "`left`" or "`right`". Default is "`left`". |

## Method

| Method Signature | Description |
| ----------- | ----------- |
| toggle([force]) | Toggle <msc-sidebar /> open or not. When argument is present: If the argument is true, <msc-sidebar /> will be opened, and if it is false, close it. |

## Event

| Event Signature | Description |
| ----------- | ----------- |
| msc-sidebar-change | Fired when <msc-sidebar /> open or not. |


## Reference
- [&lt;msc-sidebar /&gt;](https://blog.lalacube.com/mei/webComponent_msc-sidebar.html)
