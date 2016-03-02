# Meowtown

## Concepts

Number | Name
-------|------
1 | REST
2 | Express
3 | Handlebars
4 | Eugene


We're going to play with a fun project called [meowtown](http://meowtown.herokuapp.com/cats) that was written by [Eugene.](https://github.com/data-doge)


Eugene is an EDA grad who went on to teach some of the course. He's a of blend of coder + artist + musician. He also has a very cool [website](http://fuckafucka.com) but it's down at the moment.

Unfortunately Eugene's version of meowtown is written in rails. That's oldschool so we're going to improve things and rewrite it using node.


## Release 1

For Release 1, open the `cats.js` file and complete the two functions, one to write the `cats` object out to a file using `fs`, and the other to read that file and return the object. You'll want to convert (`stringify`) the object into JSON before writing it to the file, and `parse` it back to a JavaScript object after reading it from the file.

There are tests to see if you've successfully coded your functions. You can run them with `npm test`. When both tests pass, you've successfully completed Release 1. (Don't change the tests.)

## Release 2

