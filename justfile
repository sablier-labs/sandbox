import "./node_modules/@sablier/devkit/just/settings.just"

# ---------------------------------------------------------------------------- #
#                                 DEPENDENCIES                                 #
# ---------------------------------------------------------------------------- #

# ni: https://github.com/antfu-collective/ni
na := require("na")
nlx := require("nlx")

# ---------------------------------------------------------------------------- #
#                                   CONSTANTS                                  #
# ---------------------------------------------------------------------------- #

GLOBS_CLEAN := ```
    arr=(
        ".next"
        ".cache"
        "*.tsbuildinfo"
    )
    echo "${arr[*]}"
```

GLOBS_PRETTIER := "\"**/*.{md,mdx,yaml,yml}\""

# ---------------------------------------------------------------------------- #
#                                    SCRIPTS                                   #
# ---------------------------------------------------------------------------- #

# Default recipe
default:
    just --list

# Clean the generated files
@clean globs=GLOBS_CLEAN:
    nlx del-cli {{ globs }}

# ---------------------------------------------------------------------------- #
#                                    CHECKS                                    #
# ---------------------------------------------------------------------------- #

# Check code with Biome - runs both the checker and the linter
[group("checks")]
@biome-check +globs=".":
    na biome check {{ globs }}
alias bc := biome-check

# Fix code with Biome
[group("checks")]
@biome-write +globs=".":
    na biome check --write {{ globs }}
    na biome lint --unsafe --write --only correctness/noUnusedImports {{ globs }}
alias bw := biome-write

# Lint code with ESLint
[group("checks")]
@eslint-check +globs=".":
    just run-eslint {{ globs }}
alias ec := eslint-check

# Fix code with ESLint
[group("checks")]
@eslint-write +globs=".":
    just run-eslint --fix {{ globs }}
alias ew := eslint-write

# Run ESLint with cache
[arg("fix", long="fix", value="true")]
[private]
@run-eslint fix="false" +globs=".":
    na eslint \
        --cache \
        --cache-location {{ justfile_dir() }}/.cache/eslint/.eslintcache \
        --concurrency auto \
        {{ if fix == "true" { "--fix" } else { "" } }} \
        {{ globs }}

# Check Prettier formatting
[group("checks")]
@prettier-check +globs=GLOBS_PRETTIER:
    na prettier \
        --check \
        --cache \
        --log-level warn \
        --no-error-on-unmatched-pattern \
        {{ globs }}
alias pc := prettier-check

# Format using Prettier
[group("checks")]
@prettier-write +globs=GLOBS_PRETTIER:
    na prettier \
        --write \
        --cache \
        --log-level warn \
        --no-error-on-unmatched-pattern \
        {{ globs }}
alias pw := prettier-write

# Type check with tsgo
[group("checks")]
@type-check project="tsconfig.json":
    na tsgo --noEmit --project {{ project }}
alias tc := type-check

# Run all code checks
[group("checks")]
@full-check:
    just _run-with-status biome-check
    just _run-with-status eslint-check
    just _run-with-status prettier-check
    just _run-with-status type-check
    echo ""
    echo '{{ GREEN }}All code checks passed!{{ NORMAL }}'
alias fc := full-check

# Run all code fixes
[group("checks")]
@full-write:
    just _run-with-status biome-write
    just _run-with-status eslint-write
    just _run-with-status prettier-write
    echo ""
    echo '{{ GREEN }}All code fixes applied!{{ NORMAL }}'
alias fw := full-write

# Run a check with formatted output
[private]
@_run-with-status recipe *args:
    echo ""
    echo '{{ CYAN }}→ Running {{ recipe }}...{{ NORMAL }}'
    just {{ recipe }} {{ args }}
    echo '{{ GREEN }}✓ {{ recipe }} completed{{ NORMAL }}'
alias rws := _run-with-status

# ---------------------------------------------------------------------------- #
#                                      APP                                     #
# ---------------------------------------------------------------------------- #

# Start the Next.js app
[group("app")]
@build:
    na next build

# Start the Next.js app in development mode on a random port
[group("app")]
@dev:
    na next dev --port 0

# Build and start the Next.js app
[group("app")]
start: build
    na next start
