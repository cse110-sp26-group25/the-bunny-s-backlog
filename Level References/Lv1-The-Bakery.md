# Tutorial Reference 

Key:

``the code the user will be typing`` 

_dialouge from characters or bunny's notebook_

**Associated Hotspot**

***

### First Action 
```
displayCase.forEach( dessert => { } )
```
Hotspot: **The display case**

When the level starts, the sheep will say something like _See, look at the state of my Bakery! The theif completely destroyed my perfectly organized displayCase. 
I have no idea what they took! Could you make me a remainingDessert lisit of what's still left, while I try to clean up all this glass. It might give the police a clue to whoever did this._

Bunny's Journal should have a lesson on arrays and one on lists. We can kind of glace over explining what exactly for loops are and how they function, they just need to be informed that for element in arrayName will allow them to acess each element in an array in order. 
- Emphasize that array's that array's are kind of like a numbered list, and that each item is called an elment (don't need to explain 0-indexing)


### Second Action 
``missingDessertList.push(dessert.name);``

The user should understand that this code is going within the {}, maybe like adding a { and } symobl around the input space, similar to a command prompt. 

_When examining an array of objects, I also need to consider what exactly I'm checking for. To ensure I don't forget, I list spefic actions I want to preform in a { } after the for each.
  To prevent confusion, I use a ; to indicate the end of an action_
  
_Because the elements of an array are numbered, it's not easy to go and add a new element in between two other. This would require re-numbering every evelement that comes after! That's why I usually array.push(newEelement). 
By pushing the newElement onto the end, I don't change the order of the elements already on the list, saving me a lot of effort!_

They also need to be taught to acess fields using . this might be information better conveyed through a hotspot, rather than cluttering the journal. Or like adding a bunch of options like dessert.name, dessert.hasEggs, etx... and let them choose which field to access. 

It might be best to add these to the notebook (grouped with the first lesson, to dierentiate from the next concept) after the first input has been sucesfully types, to keep the lesson from being too overwhelming. 

### Third Action 
``missingDessertlist.sort((dessert1, dessert2) => dessert1.sheepOrdering(dessert2));``

After completing the second action (maybe even having an intermiedarry console.log("I've finished"); with the sheep as a hotspot to get his attention) the sheep will come over and say 
_Wow. This list is a mess. A complete disaster. The messy disply case has resulted in a completely disorganized mess. 
This is not helpful at all. Here, just this one, I'll give you acess to our super secret family sotring method .sheepOrdering(). Please use it to reorder this missingDessertList so it's easier to read_

The bunny's notebook will then show the lesson on sorting evidece. It'll say something like _Oftentimes I need to organize evidence for my cases, but sometimes using .sort() to organize things alphabetically isn't enough / right for the task. 
In cases like these, I need to define my own .sortingFunction, to determine the relation of each peice to eachother. Then, when doing evidece.sort(), I can speficy my own custom sorting method, like this: evidence.sort((evidence1, evidence2) => evidence1.customOrdering(evidence2));_


the paramaters can be changed to (a,b) instead, i'm just worried the user might be a little confused without the direct relationship in name. The function name for .sheepOrdering is also flexible.


### Transition "Cutscene" 

The bat witness comes into the bakery and says _Oh no, did someone break in! I guess that what all the noise was last night_

The sheep says that there was an ask if the bat knew who did it. The bat says _not very celarly. I saw that they had round ears, were small, and...Oh! They sqeaked!_

The sheep then talks to the lizard. _I think they already have some suspects down at the police office. You should go with Bat check them out to see if they match his discription_
