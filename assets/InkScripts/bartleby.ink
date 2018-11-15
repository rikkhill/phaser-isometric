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
- hasMet("bartleby"): -> already_met
- else: -> introduction
}
= introduction
>>> HEADER Bevin
* Hello there, stranger! My name is Bevin.

>>> HEADER Bartleby
Why hello there, Bevin. My name is Bartlebly. As you can see, I am a zombie! Please don't let that put you off conversing with me, though. I promise you, I hardly ever eat people, and on the occasions where I *do* eat people, they're nothing like the sort of person you are, whatever sort of person that might be.
>>> MEETS bartleby

-> already_met

= already_met
>>> HEADER Bevin
* Um, okay. Nice to meet you, Bartleby. I was wondering if I could ask you a favour
    -> favour
* Um, okay. Nice to meet you, Bartleby. I was wondering if I could ask you a question 
    -> question

= favour


>>> HEADER Bartleby
No. Piss off.
-> END

= question


>>> HEADER Bartleby
Certainly. Ask your question.

>>> HEADER Bevin
* Can you tell whether or not I've been staring at the {onScale("greenrocks") > 3:lovely }green rocks?

- >>> HEADER Bartleby
{
-onScale("greenrocks") > 3: Oh, you've definitely been looking at the green rocks.
-else: I don't *think* you've been looking at the green rocks, but it's hard to be sure
}-> tygb

= tygb
>>> SETHEADER Bevin
* Thank you. Goodbye.
-> END

-> END