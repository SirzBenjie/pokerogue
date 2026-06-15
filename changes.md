Changes

- Renamed `IgnoreProtectOnContactAbAttr` to `HitThroughProtectOnContactAbAttr` to more accurately convey the ability's effect.
- Removed the "MoveFlags.IGNORE_PROECT" special case from `Move#doesFlagEffectApply`; the call will now only check if the move has the flag.