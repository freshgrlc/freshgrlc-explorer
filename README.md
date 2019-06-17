# FreshGRLCExplorer

<table>
  <tr>
    <td>
      <a href="https://dev.azure.com/FreshGRLC/freshgrlc-explorer/_build/latest?definitionId=1&branchName=master" target="_blank" rel="noopener noreferrer">
        <img src="https://img.shields.io/azure-devops/build/FreshGRLC/d3aa1c3d-62c2-4731-a4b8-9139bf49fba8/1/master.svg?style=flat-square&logo=azuredevops" alt="Build Status" />
      </a>
    </td>
    <td>
      <a href="https://dependabot.com" target="_blank" rel="noopener noreferrer">
        <img src="https://img.shields.io/badge/Dependabot-enabled-brightgreen.svg?style=flat-square&logo=dependabot" alt="Dependabot Status" />
      </a>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/freshgrlc/freshgrlc-explorer#freshgrlcexplorer">
        <img src="https://img.shields.io/badge/PRs-welcome-blue.svg?style=flat-square&logo=git&logoColor=white" alt="PRs Welcome" />
      </a>
    </td>
    <td>
      <a href="https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html" target="_blank" rel="noopener noreferrer">
        <img src="https://img.shields.io/badge/License-GPL%20v2-blue.svg?style=flat-square" alt="GPLv2 License" />
      </a>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://discord.gg/cF3WrQW" target="_blank" rel="noopener noreferrer">
        <img src="https://img.shields.io/discord/404767431685308417.svg?color=%237289da&logo=discord&logoColor=white&style=flat-square" alt="Discord" />
      </a>
    </td>
    <td></td>
  </tr>
</table>

## Overview

A blockchain explorer for Garlicoin (GRLC), Testnet Garlicoin (tGRLC), and Tuxcoin (TUX). All of the coins are based on the allium mining algorithm. GRLC and TUX are visible on the overview page while tGRLC is only visible on the specific information pages (blocks, transactions, and addresses). This explorer gets its data from an blockchain [indexer](https://github.com/freshgrlc/freshgrlc-indexer) also developed in house.

## Development

1. Make sure [yarn](https://yarnpkg.com/) is installed
2. Clone this repo
3. If you have VSCode with remote containers we provide a configuration file and some helpful snippets. Opening in a container will automatically install the dependencies, so step 4 can be skipped.
4. Install dependencies with `yarn install`

### `yarn start`

Starts a development server for continued development.

### `yarn test`

Runs tests for the codebase.

### `yarn build`

Creates a production build for distribution.

### `yarn lint`

Lints the files for any formatting errors.

### `yarn fromat`

Fixes any formatting errors that can be automatically resolved

## Contributions

We are open to any contributions. Just open a pull request and we will get right to it. To avoid doing work we may not want done, open an issue so feedback can be given before valuable development hours are spent on a feature or bug that is already in progress or fixed.
