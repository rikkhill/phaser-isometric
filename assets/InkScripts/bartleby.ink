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
Hello there. My name's Bevin. #>>> HEADER Bevin

Why hello there, Bevin. My name is Bartlebly. #>>> HEADER Bartleby #>>> MEETS bartleby

-> already_met

= already_met
* Hello Bartleby. I was wondering if I could ask you a favour #>>> HEADER Bevin

-> favour
* Hello Bartleby. I was wondering if I could ask you a question 

-> question

= favour



No. Piss off. #>>> HEADER Bartleby
-> END

= question



No. Piss off. #>>> HEADER Bartleby

-> END

-> END