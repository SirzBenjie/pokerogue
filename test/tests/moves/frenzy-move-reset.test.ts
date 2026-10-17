import { AbilityId } from "#enums/ability-id";
import { BattleType } from "#enums/battle-type";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { MoveUseMode } from "#enums/move-use-mode";
import { SpeciesId } from "#enums/species-id";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/framework/game-manager";
import Phaser from "phaser";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Frenzy Move Reset", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);
    game.override
      .battleStyle("single")
      .criticalHits(false)
      .enemyMoveset(MoveId.SPLASH)
      .enemyLevel(100)
      .enemySpecies(SpeciesId.SHUCKLE)
      .enemyAbility(AbilityId.BALL_FETCH);
  });

  /*
   * Thrash (or frenzy moves in general) should not continue to run if the attack fails due to paralysis or other effects.
   *
   * With the `MoveLockTag` design, the `FRENZY` tag persists after each successful use, and the holder's
   * command phase issues the locked move (with freshly-selected targets) while the tag is present.
   * If a use is disrupted (e.g. paralysis), the tag is removed, freeing the Pokemon to act normally again.
   */

  it("should cancel the frenzy if the queued follow-up fails", async () => {
    game.override.statusEffect(StatusEffect.PARALYSIS);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.THRASH);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.move.forceStatusActivation(false);
    await game.toNextTurn();

    // The successful first hit keeps the user locked in for the next turn.
    expect(player).toHaveBattlerTag(BattlerTagType.FRENZY);

    await game.move.forceStatusActivation(true);
    await game.toNextTurn();

    // Paralysis disrupted the follow-up, so the tag is removed.
    expect(player).toHaveUsedMove({ move: MoveId.NONE, result: MoveResult.FAIL });
    expect(player).not.toHaveBattlerTag(BattlerTagType.FRENZY);
  });

  it("should confuse the user when the frenzy expires naturally", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const player = game.field.getPlayerPokemon();
    vi.spyOn(player, "randBattleSeedIntRange").mockReturnValue(2); // 2-turn frenzy

    game.move.use(MoveId.THRASH);
    await game.toNextTurn();

    expect(player).toHaveBattlerTag({ tagType: BattlerTagType.FRENZY, turnCount: 1 });
    expect(player).not.toHaveBattlerTag(BattlerTagType.CONFUSED);

    await game.toNextTurn();

    expect(player).not.toHaveBattlerTag(BattlerTagType.FRENZY);
    expect(player).toHaveBattlerTag(BattlerTagType.CONFUSED);
  });

  it.each([
    { moveId: MoveId.THRASH, moveName: "Thrash" },
    { moveId: MoveId.OUTRAGE, moveName: "Outrage" },
    { moveId: MoveId.PETAL_DANCE, moveName: "Petal Dance" },
    { moveId: MoveId.RAGING_FURY, moveName: "Raging Fury" },
  ])("$moveName should select a random valid target each turn in a double battle", async ({ moveId }) => {
    game.override.battleStyle("double");
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const player = game.field.getPlayerPokemon();
    vi.spyOn(player, "randBattleSeedIntRange").mockReturnValue(3); // 3 turn duration
    // by default, randBattleSeedInt is stubbed to return the max value (2nd target)

    game.move.use(moveId);
    await game.phaseInterceptor.to("TurnEndPhase");

    // First hit succeeded against a random enemy (#2 in this case)
    expect(player).toHaveUsedMove({ move: moveId, targets: [BattlerIndex.ENEMY_2], result: MoveResult.SUCCESS });

    // change the randomly selected target for the next strike, which is rolled during the next command phase
    vi.spyOn(player, "randBattleSeedInt").mockImplementation(() => 0);

    await game.toNextTurn();
    await game.toNextTurn();

    // The follow-up re-rolls its target when the command is issued
    expect(player).toHaveUsedMove({ move: moveId, targets: [BattlerIndex.ENEMY], result: MoveResult.SUCCESS });
  });

  it("should target the sole enemy in a single battle", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.THRASH);
    await game.toNextTurn();
    await game.toNextTurn();

    expect(player).toHaveUsedMove({ move: MoveId.THRASH, targets: [BattlerIndex.ENEMY], result: MoveResult.SUCCESS });
  });

  it("should not fail if fainting an enemy on the first turn of the move (singles)", async () => {
    game.override //
      .enemyLevel(1)
      .startingLevel(100)
      .enemySpecies(SpeciesId.MAGIKARP);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.THRASH);
    await game.toNextWave();

    expect(player).toHaveUsedMove({ move: MoveId.THRASH, result: MoveResult.SUCCESS });

    const enemy = game.field.getEnemyPokemon();

    await game.toEndOfTurn();

    expect(player).toHaveUsedMove({ move: MoveId.THRASH, result: MoveResult.SUCCESS });
    expect(enemy).toHaveFainted();
  });

  // https://github.com/pagefaultgames/pokerogue/issues/7781
  it("should target the replacement after fainting a trainer's Pokemon", async () => {
    game.override
      .battleType(BattleType.TRAINER)
      .startingLevel(100)
      .enemyLevel(50)
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyMoveset(MoveId.OUTRAGE);
    await game.classicMode.startBattle(SpeciesId.FEEBAS, SpeciesId.SNORLAX);

    const [feebas, snorlax] = game.scene.getPlayerParty();
    const enemy = game.field.getEnemyPokemon();
    feebas.hp = 1;

    game.move.use(MoveId.SPLASH);
    game.doSelectPartyPokemon(1);
    await game.toNextTurn();

    expect(feebas).toHaveFainted();
    expect(enemy).toHaveBattlerTag(BattlerTagType.FRENZY);

    game.move.use(MoveId.SPLASH);
    await game.toNextTurn();

    expect(enemy).toHaveUsedMove({ move: MoveId.OUTRAGE, targets: [BattlerIndex.PLAYER], result: MoveResult.SUCCESS });
    expect(snorlax).not.toHaveFullHp();
  });

  it("should select a new target if the previous one fainted at the end of the turn", async () => {
    game.override.battleStyle("double");
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const player = game.field.getPlayerPokemon();
    const [, enemy2] = game.scene.getEnemyField();
    vi.spyOn(player, "randBattleSeedIntRange").mockReturnValue(3); // 3 turn duration
    // by default, randBattleSeedInt is stubbed to return the max value (2nd target)

    game.move.use(MoveId.THRASH);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(player).toHaveUsedMove({ move: MoveId.THRASH, targets: [BattlerIndex.ENEMY_2] });
    await game.killPokemon(enemy2);
    await game.toNextTurn();
    await game.toNextTurn();

    expect(player).toHaveUsedMove({ move: MoveId.THRASH, targets: [BattlerIndex.ENEMY], result: MoveResult.SUCCESS });
  });

  it("should prevent an enemy trainer from switching out", async () => {
    game.override
      .battleType(BattleType.TRAINER)
      .startingLevel(100)
      .enemyLevel(50)
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyMoveset(MoveId.OUTRAGE);
    await game.classicMode.startBattle(SpeciesId.SNORLAX);

    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.SPLASH);
    await game.toNextTurn();

    expect(enemy).toHaveBattlerTag(BattlerTagType.FRENZY);

    // Would cause the trainer to switch out if it were able to
    vi.spyOn(game.scene.currentBattle.trainer!, "getPartyMemberMatchupScores").mockReturnValue([
      [1, 100],
      [2, 100],
    ]);

    game.move.use(MoveId.SPLASH);
    await game.toNextTurn();

    expect(game.field.getEnemyPokemon()).toBe(enemy);
    expect(enemy).toHaveUsedMove({ move: MoveId.OUTRAGE, result: MoveResult.SUCCESS });
  });

  it("should end the frenzy without confusion if the locked move is disabled", async () => {
    game.override.enemyMoveset(MoveId.DISABLE);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const player = game.field.getPlayerPokemon();
    vi.spyOn(player, "randBattleSeedIntRange").mockReturnValue(3); // 3 turn duration

    game.move.use(MoveId.THRASH);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.toNextTurn();

    // Still locked in; the disabled move is issued and then cancelled when it is used
    expect(player).toHaveBattlerTag(BattlerTagType.DISABLED);
    expect(player).toHaveBattlerTag(BattlerTagType.FRENZY);

    await game.toNextTurn();

    expect(player).not.toHaveBattlerTag(BattlerTagType.FRENZY);
    expect(player).not.toHaveBattlerTag(BattlerTagType.CONFUSED);

    game.move.use(MoveId.SPLASH);
    await game.toNextTurn();

    expect(player).toHaveUsedMove({ move: MoveId.SPLASH, result: MoveResult.SUCCESS });
  });

  it("should keep the user locked in if the move was called by another move", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const player = game.field.getPlayerPokemon();
    vi.spyOn(player, "randBattleSeedIntRange").mockReturnValue(2); // 2-turn frenzy
    game.move.forceMetronomeMove(MoveId.OUTRAGE);

    game.move.use(MoveId.METRONOME);
    await game.toNextTurn();

    expect(player).toHaveUsedMove({ move: MoveId.OUTRAGE, result: MoveResult.SUCCESS });
    expect(player).toHaveBattlerTag({ tagType: BattlerTagType.FRENZY, turnCount: 1 });

    await game.toNextTurn();

    expect(player).toHaveUsedMove({ move: MoveId.OUTRAGE, useMode: MoveUseMode.IGNORE_PP, result: MoveResult.SUCCESS });
    expect(player).not.toHaveBattlerTag(BattlerTagType.FRENZY);
    expect(player).toHaveBattlerTag(BattlerTagType.CONFUSED);
  });

  it("should keep the user locked in if the move was called by Sleep Talk", async () => {
    game.override.statusEffect(StatusEffect.SLEEP);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const player = game.field.getPlayerPokemon();
    vi.spyOn(player, "randBattleSeedIntRange").mockReturnValue(3); // 3 turn duration
    game.move.changeMoveset(player, [MoveId.SLEEP_TALK, MoveId.OUTRAGE]);

    game.move.select(MoveId.SLEEP_TALK);
    await game.toNextTurn();

    expect(player).toHaveUsedMove({ move: MoveId.OUTRAGE, useMode: MoveUseMode.FOLLOW_UP });
    expect(player).toHaveBattlerTag({ tagType: BattlerTagType.FRENZY, turnCount: 2 });
    expect(game.scene.currentBattle.turnCommands[BattlerIndex.PLAYER]?.move?.move).toBe(MoveId.OUTRAGE);
  });
});
