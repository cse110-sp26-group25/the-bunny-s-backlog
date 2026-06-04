# Tutorial Reference 

Key:

``the code the user will be typing`` 

_dialouge from characters or bunny's notebook_

**Associated Hotspot**

***

### First Action 
```
self.search(suspectFiles)
```
Hotspot: **The desk in the middle of the screen**

This will switch to the background of the 3 files with the animal pictures on them to the right. Maybe a paper shuffeling noise could be added during this transition? 

This isn't entierly neccessary, it's just a simpler command to ease the user into the level, and provide a transition between the "blank" background and the one with the individual files showing.  

When activating the animalfolder hotspot, we were hoping the game could make the relevant animal noise. Like an owl sound for the owl folder. 
- It's not completely nessasary, but this hotspot should transition to the background with the big folder in the center, with the following text on the folder, with the ____ filled in.
- `` const suspect1 = {
    earShape: ____,
    height: ___,
    sound: ___,
  } `
  - this is to tell the player what to refer to the suspect folders as, and to provide a reference for the number of error each one produced: inftead of having them assume we tell them outright the dog has big ears, is small, and does not squeak. Then they understand why their code output 2 out of the errors. 



### Second Action 
```
function crossRef(suspect)
```
Hotspot: **The desk in the middle of the screen**

Maybe the hotspot could say something like "wow, that's a lot of suspects". I think it would make sence to have another character here. The bat would be suffecient, but if there's time I think a poilce character would make the dialouge a little easier to write / narrativly make more sence. 
- Essentially we need to convey to player that the first thing they should be doing is the function header, not the try catch.
- Then the information this hotspot given can switch after the user sucesffuly types the code

Bunny's Notebook: This should be the first lesson in the notebook, above the try-catch lesson, again to indicate that this needs to be done first. 
- _Sometimes I need to preform a repetetive task on similar objects over and over again. to help save time, I can write a function, to prep how I will behave to some object.
- Once I prepare the function eatCarrot.(someCarrot) {} by writing the actions I want to take in {}, I can call the function over and over again on different object,
  without having to rewrite all my actions. Like eatCarrot.(bigCarrot) or eatCarrot(smallCarrot). someCarrot acts as a placeholder, so I can prepare and ready my actions before I want to preform them on the real thing!  _


  ### Third Action
  `` try { self.readFile(suspect) }

Police officer or whoever says that the first thing they need to do is read the file 

### Forth Action 

``` 
catch (notBigEars) { contradiction++}

catch (notSmall) { contradiction++}

catch (doesNotSqueak) { contradiction++}
```


Someone (maybe police officer character if there's time to animate another one) needs to convey that _these files contain information regarding the suspects. We're looking for someone who matches the description the Bat gave
If anyone doesn't match the description, it would be an Error to keep them here. For every suspect, let's keep track of the number of errors, or contradictory evidence_

Bunny's notebook: Explains how to use catch, that contradiction is a count variable, and that ++ is how we increment. 
- _After we try something, we use catch to keep track of the errors that occured. We specify which particular errors we're looking for inside catch(errorType) and how we should respond to that error with {responceToError}. Ex: catch(moldyCarrot){self.throwAway(carrot)}_
-_ Sometimes we don't need to keep track a lot of different objects, but rather a lot of the same objects. To do this we use a count variable, like numOfCarrots. To add to this counter we use the ++. To add to my number of carrots, I would do numOfCarrots++_

The user will first be propted to do this with noBigEars, the the other two. When the character / police officer is speaking he should list out the errors by their names (ex noBigEars) so the user knows what to type. 


### 5th Action 
Origionally we were going to have them write a finally, and use an if statement to accuse the victim if there were 0 errors, but I think that might be too much, 

Instead after completing the try catch, the user will call the crossRef() function on each suspect, and the game will output how many errors each one triggered. Then the other character in the room can ask them to accuse whoever they think the theif was using a ``console.log("I accuse ${suspect3}")``, and just teach them the $() instead, of finally and if statements. 


