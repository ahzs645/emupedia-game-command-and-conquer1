This directory preserves the `command-and-conquer-develop` refactor sources inside the merged final package.

Use it as source reference only.

- The playable merged build lives in the parent folder and starts from `index.html`.
- `refactor.html` in the parent folder is the integration page for this refactor.
- Rebuild its bundle with `./build-bundle.sh`.
- That bundle is built from the checked-in compiled CommonJS files in `js/`, because the raw TypeScript source still does not type-check cleanly enough to be the active build path.
- The current modular bundle has been stabilized enough to run through `refactor.html` without console errors in normal mode or debug-grid mode.
- Recent fixes in `js/` and the mirrored `.ts` sources include obstruction-grid correctness, `hitPoints`/`maxHitPoints` consistency, refinery harvester state transfer, missing infantry drawing, default HP initialization for spawned objects, and removal of active debugger traps from the modular runtime.
- These files are not the default runtime because the refactor is still behind the main merged build in stability and feature completeness.
- The goal of keeping them here is to preserve the modular TypeScript work for future porting without destabilizing the game that already runs.
