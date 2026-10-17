import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { MoveLockTag } from "#data/battler-tags";
import type { BattlerIndex } from "#enums/battler-index";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { isVirtual, MoveUseMode } from "#enums/move-use-mode";
import type { Pokemon } from "#field/pokemon";
import { PokemonPhase } from "#phases/pokemon-phase";

export class MoveEndPhase extends PokemonPhase {
  public readonly phaseName = "MoveEndPhase";
  /**
   * The {@linkcode MoveUseMode} of the current move.
   * Used to prevent ticking down Encore and similar effects when copying moves.
   */
  private readonly useMode: MoveUseMode;

  /** Targets from the preceding MovePhase */
  private readonly targets: Pokemon[];
  constructor(battlerIndex: BattlerIndex, targets: Pokemon[], useMode: MoveUseMode = MoveUseMode.NORMAL) {
    super(battlerIndex);

    this.targets = targets;
    this.useMode = useMode;
  }

  start() {
    super.start();

    const pokemon = this.getPokemon();

    // Reset hit-related temporary data.
    // TODO: These properties should be stored inside a "move in flight" object,
    // which this Phase would promptly destroy
    if (pokemon) {
      pokemon.turnData.hitsLeft = -1;
    }

    if (pokemon?.isActive(true)) {
      if (!isVirtual(this.useMode)) {
        pokemon.lapseTags(BattlerTagLapseType.AFTER_MOVE);
      } else if (this.useMode === MoveUseMode.FOLLOW_UP) {
        // A lock started by a called move (e.g. Metronome into Outrage) is added after the calling move's
        // own `AFTER_MOVE` lapse has already occurred, so the called move must tick it down instead.
        const lockTag = pokemon.getTag(MoveLockTag);
        if (lockTag) {
          pokemon.lapseTag(lockTag.tagType, BattlerTagLapseType.AFTER_MOVE);
        }
      }
    }

    // Remove effects which were set on a Pokemon which removes them on summon (i.e. via Mold Breaker)
    globalScene.arena.setIgnoreAbilities(false);
    for (const target of this.targets) {
      if (target) {
        applyAbAttrs("PostSummonRemoveEffectAbAttr", { pokemon: target });
      }
    }

    this.end();
  }
}
