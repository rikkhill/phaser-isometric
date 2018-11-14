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
>>> SETHEADER The Lovely Green Rocks
- else:
>>> SETHEADER Some green rocks
}

* [Look at the  green rocks] -> look
* [Don't look at the green rocks] -> END

= look_choice
* [Keep looking at the {onScale("greenrocks") > 3: lovely} green rocks] -> look
* [Stop looking at the {onScale("greenrocks") > 3: lovely} green rocks] -> stop

= look
>>> INCSCALE greenrocks
{~The green rocks are rather attractive.|The green rocks shine with a mysterious twinkle.}
-> look_choice

= stop
Are you sure you want to stop looking at the green rocks?
* [Keep looking at the {onScale("greenrocks") > 3: lovely} green rocks] -> look
* [Stop looking at the {onScale("greenrocks") > 3: lovely} green rocks] -> END