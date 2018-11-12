# Dev todo list

## Dialogue UI

- Make scrollbar nicer / more tightly-coupled to the dialogue stack/frame

## Dialogue System

- Allow arbitrary running of dialogue scripts from anywhere (e.g. inventory items)
- Generally play around with new UI and scripts to see how to best write them
- Don't show a continuation after dialogue choice; instead show next dialogue fragment

## Game state

- Also figure out where to put this (Separate persistent scene, maybe?)
- Discard/destroy/forget options
- Scale options (e.g. morality, corruption, sanity, etc.)

## Inventory/notes

- Dynamically redraw inventory on game state update (case for game state living with UI)
- Entrypoint to dialogue scripts from inventory items
- Enable Almendra font for inventory and notes headers (don't know why it doesn't work)

## Camera

- Add a focus object that the camera follows around

## Scene management

- Specific logic to handle transfer from one scene to another (camera fade, state, etc.)