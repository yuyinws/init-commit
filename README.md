![preivew](https://cdn.jsdelivr.net/gh/yuyinws/static@master/2024/05/upgit_20240521_1716273548.png)

<p align="center">
<a href="https://initcommit.info/">Website</a>
</p>

## Features

- Search GitHub repositories by keyword.
- Specified branch.
- Save as PNG.
- Share on 𝕏 with og-image support.

## UserScript

![user-script](https://cdn.jsdelivr.net/gh/yuyinws/static@master/2024/05/upgit_20240521_1716276872.png)

>  Find initial commit with one-click.

<p align="center">
<a href="https://greasyfork.org/scripts/495668-open-in-initcommit" target="_blank">Install UserScript</a>
</p>

## Develop

Generate a new (GitHub Token)[https://github.com/settings/tokens]

Set your environment variables in a `.env` file:

```
NUXT_GITHUB_TOKEN=
```

### Setup

```shell
# install dependencies
corepack enable
pnpm install

# serve in dev mode, with hot reload at localhost:3000
pnpm dev

# build for production
pnpm build

# preview in production mode
pnpm preview
```

## Credits

Thanks [danielroe/firstcommit.is](https://github.com/danielroe/firstcommit.is)
