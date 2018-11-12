-> begin

=== function hasMet(character) ===
~ return 1
=== function hasItem(character) ===
~ return 0
=== function doesKnow(character) ===
~ return 0


EXTERNAL hasMet(character)
EXTERNAL doesKnow(knowledge)
EXTERNAL hasItem(item)

===begin===

>>> SETHEADER Bevin

{
- hasMet("bartleby"): -> already_met
- else: -> introduction
}

= introduction
Hello there. My name's Bevin.

>>> SETHEADER Bartleby

Why hello there, Bevin. My name is Bartlebly.

>>> MEETS bartleby

-> already_met

= already_met

>>> SETHEADER Bevin

* Hello Bartleby. I was wondering if I could ask you a favour 

-> favour
* Hello Bartleby. I was wondering if I could ask you a question 

-> question

= favour

>>> SETHEADER Bartleby

No. Piss off.
-> END

= question

>>> SETHEADER Bartleby

No. Piss off.

-> END

-> END