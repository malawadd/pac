# Pac
 
# [Mode DeFi Degen Hack](https://mode-defi-degen-hack.devpost.com)

  
  
<h1 align="center">
  <br>
  <a href=""><img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEixVLVTNmbQDzslY0qcLZZwpRHm2Akvo34PskUsALMAI6ccoSBci9mCXuCm0-N5r0l9XINyzZALqqAOkeIJr0yMwY_5oZbuB4Zfb25r0xkhsWHs_0DHse3enP_7A56ZR4SCPKEKFmbLGBaGZNxnKXSIsipfjCoaZYzdUAw8OIQiXkx3sSOswLuwQeUzWVQ/s1792/city.png" width="300"></a>
  <br>
  Pac 
  <br>
</h1>

<h4 align="center">a decentralized trading protocol. It's designed to be fast and easy to use by anyone
</h4>

<p align="center">
  <a href="#introduction">Introduction</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#local-deployment">Local deployment</a> •
  <a href="#credits ">Credits </a> •
  <a href="#license">License</a>
</p>

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhcIl1qlk4C4LfxJ9X5kJPJyg8GRrUTEm-9ypH6YZndMEAIURga4i4NBpWs6ztFO1DNNcI_02VU75xY6wvX0YQJFpIvlsGKllp0iVR2-xj_S3WAkWn8VuRnPN5tSzaevLsGEWnTpNmuRJT25T_QLLwGILYdpVLz9TEB452s474AGfhH6svuaywHFhKfkxo/s1000/pac.png)


## Introduction 

 Pac with its unique approach to digital asset trading, leverages the creativity of Web3 developers. It introduces novel solutions to existing problems, showcasing the diversity of thought and innovation possible within the Klaytn ecosystem.

## Key Features

Key Features of Pac :

1. **User-Friendly Interface:** Pac  s designed with simplicity in mind, enabling traders to start trading directly from their wallets without navigating complex processes. This ease of use makes the platform accessible not only to experienced traders but also to newcomers in the digital asset space, thus broadening its appeal and usability..

2. **Support for different types of bonding curves:** Pac Ensure that orders are executed and settled within seconds. This feature is crucial in the volatile world of digital asset trading, where market conditions can change rapidly. Fast execution allows traders to capitalize on market opportunities as they arise, without the delays often encountered on traditional platforms..


3. **Minimal Transaction Fees:** Pac is designed with ultra gas-optimized contracts, significantly reducing the transaction fees. This cost-effectiveness is a major advantage for traders, especially those who perform frequent transactions, as it ensures that a larger portion of their profits is retained rather than being eroded by high fees.




## Local deployment

### deploying the graph node 

1. in the `local-graph-node` directory make sure to have [docker](https://www.docker.com/get-started/) installed on the system and run 

    ```bash
    docker-compose up 
    ```
### deploying the subgraph  

1. in the `subgraphs` directory make sure to have [graph-cli](https://www.npmjs.com/package/@graphprotocol/graph-cli)  installed on the system and run. 

    ```bash
    yarn codgen
    ```

2. then create a local subgraph.

    ```bash
    yarn create-local
    ```

3. deploy the local subgraph.

    ```bash
    yarn deploy-local
    ```
4. from the console choose the subgraph version , and we are done 

### deploying the webapp  

1. in the `client` deploy the app by runing 

    ```bash
    yarn dev
    ```

## Credits

Pac uses the following open source packages:

- [hardhat](https://hardhat.org/) Ethereum development environment for professionals


- [svelte](https://svelte.dev/) a UI framework that uses a compiler to let you write breathtakingly concise components that do minimal work in the browse.

- [mode network](https://www.mode.network/)  Mode is the Ethereum L2 designed for builders and users to grow as the network grows. Part of the OP Superchain

- [The Graph ](https://thegraph.com/) The Graph is an indexing protocol for organizing and accessing data from blockchains and storage networks


- [docker](https://www.docker.com/get-started/) Build applications faster and more securely with Docker for developers.


- [rollup](https://rollupjs.org/) Compile small pieces of code into something larger and more complex



## License

MIT
