# Chorema: Project Proposal for CS255

**Omkar Yadav**  
**Pruthviraj Urankar**  

## Project Description

Chorema is a platform aimed at gamifying the process of dividing and completing household chores among members of shared living spaces. Chorema employs a ‘Karma’ system where users earn points for completing household chores. At the core of Chorema’s computational challenges is the ‘Karma Equalization’ process, which ensures that users can easily settle what they owe one another. This is underpinned by intricate algorithms which form the heart of our project.

You can view the project [here](http://34.168.230.139/home)

### Karma System: Quantifying Chores

One of the defining features of Chorema is its introduction of the ‘Karma’ system. The central idea is to assign a numeric value to every chore based on its complexity, effort, and urgency. Members accumulate or owe karma as chores are completed. The ‘Karma Equalizer’ algorithm optimizes the distribution of this karma, ensuring that everyone’s debts are cleared as fairly as possible.

### Karma Equalizer: Maximizing Harmony

The system of accumulating and owing karma between members can result in a complex mesh of transactions. As Chorema seeks to equalize the effort and contributions of members of shared living spaces, simplifying these transactions is paramount to streamline the settling of obligations and promote harmony.

For instance, picture a scenario where Alice owes karma to Bob, and Bob owes karma to Carol. The Karma Equalizer steps in to optimize these transactions, strategically reducing the need for intermediary exchanges. In this case, it orchestrates a direct exchange, allowing Alice to owe karma directly to Carol. This streamlines the process, minimizing unnecessary steps and ensuring a more efficient and equitable distribution of karma.

Conceptually, the challenge of optimizing karma distribution among members can be represented as a network flow problem, similar to the ‘maximum flow’ scenario in graph theory. Each member corresponds to a node in the network, and karmic debts between them are represented as edges. The objective is to find the optimal flow, or karma distribution, through this network while minimizing unnecessary transactions.

## System Design

Chorema will consist of a Python Django-based backend, providing RESTful APIs for data management. The frontend will be developed using React to create an intuitive user interface. NetworkX will serve as the foundation to construct the graph. Karma Equalizer will be a custom algorithm designed to optimize karma distribution on top of the NetworkX generated graph. The system will store user profiles, chores, and transactional data in a PostgreSQL database.

## References

1. [Maximal Flow Through a Network](https://www.cambridge.org/core/journals/canadian-journal-of-mathematics/article/maximal-flow-through-a-network/5D6E55D3B06C4F7B1043BC1D82D40764)
2. [M. K. Menon (2017). Algorithm behind Splitwise’s debt simplification feature](https://medium.com/@mithunmk93/algorithm-behind-splitwises-debt-simplification-feature-8ac485e97688)
3. [Yefim Dinitz (1970). Dinitz’ Algorithm: The Original Version and Even’s Version](https://link.springer.com/chapter/10.1007/11685654_10)
