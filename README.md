# reproduction of an annoying quirk of tsserver

Re: https://github.com/vadimdemedes/ink-testing-library/pull/21

TS Server spun up by VSCode and neovim CoC's `coc-tsserver` will
by default use the nearest `tsconfig.json` file, and will fall
back to the default tsconfig `compilerOptions` for any file that
is excluded by that `tsconfig.json` file.

As a result, tests and other files that are excluded from a
build, will not be able to pull in types from dependencies that
only export via an `exports` field, without a top-level `main` or
`types` property in their `package.json` file.

This is really annoying for development! While it's true that the
files in question are not technically "covered" by the
tsconfig.json file that tsserver finds, the intent is typically
just to excludle them from the build; they're still edited, and
it's frustrating to not have the project configs applied to them.

## Reproducing the Issue

1. Open this project in VS Code or nvim with `coc-tsserver` enabled.
2. Edit the `test/index.ts` file
3. Observe the `tsserver 2307` error importing `some-dep`

Also, error can be observed in `src/itl.ts` or `test/itl.ts`,
loading `ink-testing-library`, for the same reason.

## Suggestion

TS Server should ignore `include` and `exclude` directives in its
tsconfig settings. If a file is being edited, then presumably
it's "included" for all intents and purposes, and should be
processed according to the same `compilerOptions` as anything
else in the project.

## Workaround 1: `"main"` or `"types"` in dependency `package.json`

This is not an option, because I do not have control over the
dependency in this case.

Also, it is only a half-measure, as it still results in the
excluded files being processed incorrectly by `tsserver`, which
can lead to providing incorrect type hints if the `require` and
`import` exports are different. (This is generally a bad idea, of
course, but it is sometimes unavoidable if using a CJS default
`module.export` for a CJS export, and the ESM style `export
default` for the ESM export.)

## Workaround 1: Separate `tsconfig.json` for build

This seems to be the best workaround for the moment, but it is
still inconvenient.

1. Create a `tsconfig.json` file that contains _only_ the
   intended `compilerOptions`, and no `include` or `exclude`
   settings.

2. Create a `tsconfig.build.json` containing:

    ```json
    {
      "extends": "./tsconfig.json",
      "include": [...],
      "exclude": [...]
    }
    ```

3. Update the `build` or `prepare` script in `package.json` from
   `tsc` to `tsc -p tsconfig.build.json`

## Workaround 2: Separate `tsconfig.json` for tests

This is a less optimal workaround, as it involves duplicating the
`compilerOptions`, and cannot work when the test files in
question live in the `src` folder.

1. Create the normal `tsconfig.json` file for building the
   project.

2. Create a `./test/tsconfig.json` file that contains just the
   `compilerOptions` without any `include` or `exclude` settings.
