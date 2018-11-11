# Dev todo list

## Dialogue UI

- Make scrollbar nicer / more tightly-coupled to the dialogue stack/frame
- Improve continuations so they disappear when clicked
- Snazzier font choices

## Dialogue System

- Figure out where to put the bloody thing
- Allow arbitrary running of dialogue scripts from anywhere (e.g. inventory items)
- refactor all the dialogue gubbins currently in StaticNPC into the dialogue runner object
- Tidy up script flow
- Generally play around with new UI and scripts to see how to best write them

## Game state

- Also figure out where to put this (Separate persistent scene, maybe?)
- Discard/destroy/forget options
- Scale options (e.g. morality, corruption, sanity, etc.)

## Inventory/notes

- Dynamically redraw inventory on game state update (case for game state living with UI)
- Entrypoint to dialogue scripts from inventory items
````