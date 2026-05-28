---
# These are optional metadata elements. Feel free to remove any of them.
status: {proposed}
date: {2026-5-14 when the decision was last updated}
decision-makers: {Shawn, Kabyan, Sahana, Quinton, Pranav, Wayne, Jordan, Hojoon}
consulted: {Ayla}
informed: {}
---

# Game Engine Usage

## Context and Problem Statement

We need to alleviate stress on ourselves trying to implement a game engine.  We don’t have a lot of time, so we are essentially outsourcing the creation of a game engine to someone else. Since we are making a puzzle game, we need a way to make levels quickly.

* decision driver 1, lack of time means we can't implement a game engine on our own
* decision driver 2, we want to make several different levels using various tricks

## Considered Options

* TC.JS
* CT.JS
* Phaser
* ROT.JS
* Pixi.JS

## Decision Outcome

Chosen option: {CT.JS}

We're using an engine and each member does not have a lot of experience with different languages. 
Using the same engine for various portions of the game will be helpful because we reduce our bus factor by interacting with other parts of the program.
Testing becomes more similar since we are using the same software, so it will be easier to get help from each other. 
For the most part, we will be using the game engine for its ability to create levels and render sprites, but the rest of the functionality is likely still going to be done in JS.


### Consequences

* Good:
  * We no longer have to make a game engine ourselves
  * Quality of our end product will likely be higher
  * We will likely have a library of assets to choose from
  * Testing environment is going to be much nicer
  * We will have a much more tangible product while we are working rather than waiting until compile
  * Sprites / animations / visual effects will be a lot easier to rig
  
* Bad:
  * We have an extra dependency
  * Changes how we will be working together (merge comflict issues)
  * Learning curve exists for learning how to use CT.JS
  * End product expectations will be higher 
