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
{
- hasMet("bartleby"): -> already_met
- else: -> introduction
}
= introduction
>>> HEADER Bevin
* Hello there, stranger! My name is Bevin.

>>> HEADER Bartleby
Why hello there, Bevin. My name is Bartlebly.
>>> MEETS bartleby

-> already_met

= already_met
>>> HEADER Bevin
* Hello Bartleby. I was wondering if I could ask you a favour -> favour
* Hello Bartleby. I was wondering if I could ask you a question -> question

= favour


>>> HEADER Bartleby
No. Piss off.
-> END

= question


>>> HEADER Bartleby
No. Piss off. 

-> END

-> END