# This is a test script for integrating with my amazing isometric adventure game

EXTERNAL meets(character)
EXTERNAL hasMet(character)

-> begin

=== begin ===
* { not hasMet("clive") } -> hello_stranger
+ { hasMet("clive") } -> hello_friend

= hello_friend
Hello again! What can I do for you, friend? -> choice

= hello_stranger
>>> MEETS clive
Hello there, stranger! What can I do for you? -> choice


= choice
* [I'd like to test some options, please!] -> END
* [I'd like to eat some cheese, please] -> cheese
* I don't know what I'd like to do today! -> END
* Is it today already? -> END

= cheese
BEVIN: I'd like to eat some cheese, please!

CLIVE: Cheese, you say? Well, I don't have much of that, I'm afraid.  Brains, perhaps?

BEVIN: Eh... I might pass on that, if it's all the same to you.

CLIVE: Suit yourself.
-> END

-> END