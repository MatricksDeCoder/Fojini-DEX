To get started with repo.
Get repo

```
1. Fork repository the <upstream>
2. Clone your fork git clone <your fork url>
3. Set upstream git remote add upstream <upstream url>
```

Before any work ensure you are up to date with upstream

```
4. git fetch upstream
5. git merge upstream/develop
```

Install packages to check work locally

```
6. Install packages npm install
```

**\*\***WORKING ON FRONT END******\*\*******
Create your feature branch issue and work in it
Also see READ.me file to understand working with project

```
7. New branch git branch <feature or issue name>
8. Move into git checkout <feature or issue name>
```

Implement your features and commit changes

```
9. git add .
10. git commit m "short clear message"
```

Check work locally

```
11. Front End Only npm run start
```

Create pull request

```
13. git push --set-upstream origin <feature or issue name>
```

\***\*BLOCKCHAIN AND SMART CONTRACTS**\*\*\*****
Changing blockchain related files like smart contracts, migrations, truffle-config requires new deployments to the blockchain
Colloboration options under consideration include
Also see READ.me file to understand working with project

```
> Truffle Teams
> New contract changes board that all agree on before any new work or commits
> Upgradable contracts
``
Else, process is same as Front end but you can test your contracts locally on ganache
If you suggest blockchain and contract related changes only admins will deploy new contracts
** ADMIN merge pull request **
```

git checkout develop
git pull origin develop
git checkout master
git merge develop
git push origin master

```

```
