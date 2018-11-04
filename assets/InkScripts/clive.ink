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


=== begin ===
* {hasMet("clive")} -> hello_friend
+ -> hello_stranger
 
= hello_stranger
BEVIN: Hello, stranger.

CLIVE: Why hello there. My name is Clive, and I'm a zombie.
>>> MEETS clive
-> options

= hello_friend
BEVIN: Hello again, Clive.

CLIVE: Why hello again!
-> options

= options

CLIVE: What can I do for you today?

* {not hasItem("apple")} [I'd like you to give me an apple, please.] -> give_apple
* [I'd like you to tell me if I've got an apple] -> has_apple
* [I'd like you to tell me a secret, please] -> secret
* [Nothing thanks, Clive. Goodbye.] -> END

= give_apple
BEVIN: I'd like you to give me an apple, please.

CLIVE: Why certainly. Here is an apple.
>>> ISGIVEN apple

[BEVIN: Thank you. Goodbye.] -> END

= has_apple
- BEVIN: I'd like you to tell me if I've got an apple.

- CLIVE: Why certainly. {hasItem("apple"): Yes, you do|No, you do not} have an apple.

* [BEVIN: Thanks for that, Clive. Goodbye.] -> END

= secret

- BEVIN: I'd like you to tell me a secret, please.

{
- doesKnow("CliveFavouriteFilm"): CLIVE: Well, you already know my favourite film is Turner and Hooch, so there aren't really any more secrets beyond that
    BEVIN: Ah well.
- else:
    CLIVE: Okay. My favourite film is Turner and Hooch.
    >>> LEARNS CliveFavouriteFilm Clive's favourite film is 'Turner and Hooch'
    BEVIN: That is quite a secret!
}

* [BEVIN: Thanks, Clive. Goodbye.] -> END

