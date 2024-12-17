# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

<!-- ETH PERMIT -->

<!-- START -->

// async function signPermit({
// tokenAddress,
// owner,
// spender,
// value,
// nonce,
// deadline,
// }) {
// const domain = {
// name: 'permit test',
// version: '1',
// chainId,
// verifyingContract: contractAddress,
// }

// const types = {
// Permit: [
// { name: 'owner', type: 'address' }, // The wallet address of the user signing the permit.
// { name: 'spender', type: 'address' }, // The address being approved (e.g., your dApp/contract).
// { name: 'value', type: 'uint256' }, // The amount of tokens being approved.
// { name: 'nonce', type: 'uint256' }, // A unique value (prevents replay of signatures).
// { name: 'deadline', type: 'uint256' }, // The time after which the permit is invalid.
// ],
// }

// const message = {
// owner: address, // User's wallet address.
// spender: contractAddress, // Contract address to be approved.
// value: ethers.MaxUint256, // Amount of tokens in Wei (1 token here).
// nonce: 1, // The current nonce for the user.
// deadline: 1699999999, // Unix timestamp (e.g., valid until 11/14/2024).
// }
// const signature = await web3.currentProvider?.request({
// method: 'eth_signTypedData_v4',
// params: [owner, JSON.stringify({ domain, types, message })],
// })

// console.log(signature)
// }

  <!-- END -->

<!-- START -->
