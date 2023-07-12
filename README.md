## Setup

The following steps assume you are on a linux environment, have git, docker (with compose) & pnpm installed.

1. Clone this repository
    ```
    git clone git@github.com:ivstiv/redfour-test.git && cd redfour-test
    ```

2. Clone the redfour fork branch
    ```
    git clone -b adding-typescript-declaration git@github.com:ivstiv/redfour.git redfour-fork
    ```

3. Install the dependencies in the fork
    ```
    cd redfour-fork && npm ci && cd ..
    ```

4. Install the dependencies
    ```
    pnpm install --frozen-lockfile
    ```

5. Build the typescript
    ```
    pnpm run build
    ```

6. Start a local redis instance
    ```
    docker compose up
    ```

7. Run the javascript
    ```
    pnpm run start
    ```