-> begin

=== function hasMet(character) ===
~ return 1
=== function hasItem(character) ===
~ return 0
=== function doesKnow(character) ===
~ return 0
=== function onScale(character) ===
~ return 0


EXTERNAL hasMet(character)
EXTERNAL doesKnow(knowledge)
EXTERNAL hasItem(item)
EXTERNAL onScale(scale)

===begin===

{
- onScale("greenrocks") > 3: 
>>> HEADER The Lovely Green Rocks
- else:
>>> HEADER Some green rocks
}

* [Look at the {onScale("greenrocks") > 3: lovely }green rocks] -> look
* [Don't look at the {onScale("greenrocks") > 3:lovely }green rocks] -> END

= look_choice
+ [Keep looking at the {onScale("greenrocks") > 3:lovely }green rocks] -> look
+ [Stop looking at the {onScale("greenrocks") > 3:lovely }green rocks] -> stop

= look
>>> NOHEADER
>>> INCSCALE greenrocks
You look at the {onScale("greenrocks") > 3: lovely }green rocks.
{~The green rocks are rather attractive.|The green rocks shine with a mysterious twinkle.|The green rocks glint with a curious luminescence, inviting you to delve further into their lustreful depths}
-> look_choice

= stop
Are you sure you want to stop looking at the green rocks?
+ [Keep looking at the {onScale("greenrocks") > 3:lovely }green rocks] -> look
+ [Stop looking at the {onScale("greenrocks") > 3:lovely }green rocks] -> END