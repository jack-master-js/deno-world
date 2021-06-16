```
#dev
deno run -A --watch --unstable main.ts

#build
deno compile -A --output start main.ts
--target <target>            Target OS architecture [possible values: x86_64-unknown-linux-gnu, x86_64-pc-windows-msvc, x86_64-apple-darwin, aarch64-apple-darwin]

#cache
deno cache main.ts

#options
--lock <FILE>                Check the specified lock file
--lock-write                 Write lock file. Use with --lock.
--config <FILE>              Load tsconfig.json configuration file
--import-map <FILE>          UNSTABLE: Load import map file
--no-remote                  Do not resolve remote modules
--reload=<CACHE_BLOCKLIST>   Reload source code cache (recompile TypeScript)
--unstable                   Enable unstable APIs
--cached-only                Require that remote dependencies are already cached
--inspect=<HOST:PORT>        activate inspector on host:port ...
--inspect-brk=<HOST:PORT>    activate inspector on host:port and break at ...
--seed <NUMBER>              Seed Math.random()
--v8-flags=<v8-flags>        Set V8 command line options. For help: ...

#other
deno install [OPTIONS...] [URL] [SCRIPT_ARGS...]    install and distribute executable code.
deno fmt <FILES>        format all JS/TS files in the current directory and subdirectories
deno bundle [URL]       output a single JavaScript file, which includes all dependencies of the specified input.
deno doc <FILES>        print the JSDoc documentation for each of the module's exported members.
deno info [URL]         will inspect ES module and all of its dependencies.
deno lint <FILES>       linter for JavaScript and TypeScript.
```
