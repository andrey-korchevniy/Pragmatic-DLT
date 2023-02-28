---
title: 'Setup private Ethereum network in cloud'
date: 2018-10-18
draft: false
image: ethimage.png
imagelist: 'setup_ethereum/ethimage.png'
description: This insight is a step by step guide how to launch private Ethereum network. It is a great starting point to start experiments and play with different setup and configuration options for your specific needs (block creation time,  nodes, etc...).
---

# Setup private Ethereum network in cloud

This insight is a step by step guide how to launch private Ethereum network. It is a great starting point to start experiments and play with different setup and configuration options for your specific needs (block creation time, number of nodes per availability zone, block target gas limit, etc...).

### Private chain

A private chain can potentially have huge advantages over public - level of control we get is much higher. Designing architecture for specific business needs, with private network setup we have more flexibility around transaction cost, latency and other quality attributes.

### Key points about Ethereum Clique

Ethereum Clique is Proof-of-Authority consensus algorithm implementation deployed to Rinkeby test network. PoA is a near perfect fit for private networks as it gives us full control over which nodes can seal (validate/create) blocks on the network. There are number of pre-approved seal nodes (validators) defined in genesis file. Addition of the new seal node requires voting by existing seal nodes.

There are three essential rules to note before we start:

{{<formula>}}K{{</formula>}} - number of seal nodes on chain,  
{{<formula>}}N{{</formula>}} - number of produced blocks

1. Chain will produce new blocks until {{<formula>}}floor(K2+1) {{</formula>}}of seal nodes are online
2. Node picked up to validate next block is defined as {{<formula>}}N mod K{{</formula>}}.
3. Node can be picked up as validator if last {{<formula>}} floor(K + 12) {{</formula>}} blocks was not validated by it

### Test scenario

A few words about how our test transaction looks like. In a nutshell it represents the following scenario:

{{<bold>}}Given{{</bold>}}​ user logged in as brand  
{{<bold>}}And{{</bold>}}​ balance is 100 tokens  
{{<bold>}}When{{</bold>}}​ user types unit name  
{{<bold>}}And{{</bold>}}​ clicks create  
{{<bold>}}Then{{</bold>}}​ unit appears in unit list  
{{<bold>}}And{{</bold>}}​ balance is 99 tokens

Scenario is implemented in the smart contract in the following way:
![code](code.png)
Under the hood the following business logic comes into play:

1. Check that sender has brand role (modifier)
2. Charge unitPrice as a fee from sender (erc20)
3. Create unit and save to array (update contract state)
4. Communicate what happened off-chain (emit event)

### Setup manual

##### 0. Prerequisites

As cloud platform we use Microsoft Azure. BTW, It kindly offers 200$ as trial option. We created 8 VMs in two regions. 4 VMs withing one availability zone of Central US region and three others within France Central. Each VM([DS1_v2](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes-general)) has 1 vCPU, 7GB SDD, 3.5GB of RAM and Ubuntu 16 on board. Plus, a separate VM to deploy the Ethereum statistics. There is a list of machines needed for experiment with some useful info in the name (it's a good idea to note IP address next to VM name):

1. boot-node-us
2. seal-1-node-us
3. seal-2-node-us
4. seal-3-node-us
5. boot-node-eu
6. seal-1-node-eu
7. seal-2-node-eu
8. seal-3-node-eu
9. stats-node

##### 1. Install go (to each node):

{{<bash-command>}}
$ curl https://dl.google.com/go/go1.11.linux-amd64.tar.gz > go1.11.linux-amd64.tar.gz
$ sudo tar -C /usr/local -xzf go1.11.linux-amd64.tar.gz
$ mkdir ~/.go
{{</bash-command>}}

add to /etc/profile:

{{<bash-command>}}
GOROOT=/usr/local/g </br>  
GOPATH=~/.go </br>
PATH=$PATH:$GOROOT/bin:$GOPATH/bin
{{</bash-command>}}

{{<bash-command>}}
$ sudo update-alternatives --install "/usr/bin/go" "go" "/usr/local/go/bin/go" 0 </br>
$ sudo update-alternatives --set go /usr/local/go/bin/go </br>
$ go version
{{</bash-command>}}

##### 2. Download and build go-ethereum (on each node):

{{<bash-command>}}
$ sudo apt-get update </br>
$ sudo apt-get install -y build-essential </br>
$ git clone https://github.com/ethereum/go-ethereum </br>
$ cd go-ethereum </br>
$ git checkout tags/v1.8.16` (`git tag -l`) </br>
$ make all </br>
{{</bash-command>}}

##### 3. Setup ethstats

In order to do this the best option is to use puppeth. First, install docker to stats-node:
{{<bash-command>}}
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -</br>
$ sudo apt-get install docker-compose</br>
$ sudo usermod -aG docker $USER</br>
$ relogin</br>
{{</bash-command>}}

Then, run puppeth and follow CLI instructions to deploy ethstats:
{{<bash-command>}}
$ ~/go-ethereum/build/bin/puppeth
{{</bash-command>}}

##### 4. Setup seal-node-n (repeat to all seal nodes)

{{<bash-command>}}
$ mkdir -p ~/supplychain/seal-node-n
{{</bash-command>}}

Create a bunch of tests accounts - create at least 2-3 accounts.
{{<bash-command>}}
$ cd ~/supplychain</br>
$ ~/go-ethereum/build/bin/geth --datadir seal-node-n/ account new
{{</bash-command>}}

##### 5. Create `genesis.json` using puppeth (run puppeth on stats-node and follow CLI instruction to generate genesis file)

{{<bash-command>}}
$ ~/go-ethereum/build/bin/puppeth
{{</bash-command>}}

Use puppeth CLI to export just created genesis file to home directory.

##### 6. Init seal-node-n

{{<bash-command>}}
$ cd ~/supplychain</br>
$ scp -r _user_@_stats-node-ip_:~/supplychain.json .</br>
$ ~/go-ethereum/build/bin/geth --datadir seal-node-n/ init supplychain.json</br>
{{</bash-command>}}

##### 7. Run boot-node:

{{<bash-command>}}
$ mkdir -p ~/supplychain/bootnode</br>
$ cd ~/supplychain</br>
$ scp -r _user_@_stats-node-ip_:~/supplychain.json .</br>
$ ~/go-ethereum/build/bin/geth --datadir bootnode init supplychain.json</br>
$ ~/go-ethereum/builds/bin/bootnode -genkey boot.key</br>
$ ~/go-ethereum/build/bin/bootnode -nodekey boot.key -verbosity 9 -addr :30310</br>
{{</bash-command>}}

##### 8. Run seal-node-n:

write pass to `seal-node-n.pass`
{{<bash-command>}}
$ ~/go-ethereum/build/bin/geth --datadir seal-node-n/ --syncmode 'full' --port 30311 --rpc --rpcaddr '0.0.0.0'</br>
--rpcport 8501 --rpcapi 'personal,db,eth,net,web3,txpool,miner' --bootnodes</br>
'_bootnode_enode_@_bootnode_ip_:30310'</br>
--networkid 1605 --gasprice '1' -unlock '_seal_node_n_account_' --password ./seal-node-n.pass</br>
--mine --ethstats seal-node-n-us:_pass_phrase_@_stats_node_ip_:8081 --targetgaslimit 94000000`</br>
{{</bash-command>}}

To get the network working smooth we should take care about peer discovery.

There are two options:

1. Create `_datadir_/static-nodes.json` with the following content:
   {{<bash-command>}}
   [</br>
   "enode://pubkey@ip:port",</br>
   "enode://pubkey@ip:port"</br>
   ]</br>
   {{</bash-command>}}

2. Connect to geth console using command and add peers manually:
   {{<bash-command>}}
   $ ~/go-ethereum/build/bin/geth attach ipc:seal-node-n/geth.ipc</br>
   > admin.addPeer("enode://pubkey@ip:port")</br> {{</bash-command>}}

Below you can see console output of three US seal nodes:
![ethconsole](ethconsole.png)
Whereas ethstats screen should look like this:
![ethstats](ethstats.png)

### Running transactions

We encourage you to play with network setup and configuration. Meanwhile, for demonstration purposes we provide a few results obtained with the following configuration:

1. Bootnode, 3 seal nodes in EU, 3 seal nodes in US
2. Block creation time 2 seconds
3. Block target gas limit 94000000

##### Interval tests

Transactions are submitted periodically(every second).  
500 transactions were accepted by network in 500 in 8161:
![intwrval-1](interval-1.png)
300 transactions are accepted by network in 5900:
![intwrval-2](interval-2.png)
Sequence tests
Transactions are executed in batches. Each subsequent batch starts after previous is finished.
100 transactions each were accepted by network in 5610:
![sequence-1](sequence-1.png)
700 transactions are accepted by network in 14937:
![sequence-2](sequence-1.png)
As it is stated earlier the main purpose of this article is to cover devops part. Thus, we believe, you will invest more time in understanding Clique tuning it instead of having headache setting it up. Soon we release insight how to tune private setup to get maximum TPS! You are always welcome to reach out for advice to one of our [Pragmatic DLT SWAT Teams](https://pragmaticdlt.com/) or [to add Ethereum platform to your skillset. automotive web design agencies](https://pragmaticdlt.com/onlineacademy.html) Stay tuned!
