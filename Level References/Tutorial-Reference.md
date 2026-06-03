# Tutorial Reference 

Key:

``the code the user will be typing`` 

_dialouge from characters or bunny's notebook_

**Associated Hotspot**
***

## Please Read
Honestly I'm this unsure as to what exactly is being added to evidence, but there is certain information that needs to be stored / shouldn't require hovering over a hotspot.

Especially because the next levels require writing functions / larger peices of code, which the user should only submitting a couple lines of at a time in building this larger program. 

This information / the program they're building needs to be displayed somewhere on the sidepannel. I will indicate whenever such information arises, but I cannot/will not at this time convey where this information should be updated. 
If we have latter decided on where something should go, I will mention that explicitly. If I do not mention any specific location, assume this decision was left up to YOUR DISCRETION as the implementer. Do not ask us where to put it, WE DO NOT KNOW, and time will be wasted while you wait for a responce. I will include suggestions wherever possible, or enough context for you to make an edecuated decisions. Once you have made this decision, please update these reference docs accordingly.  

If any code changes are made (like using different logic / syntax) please be mindful and cross reverence with the other levles. 
There is a high chance the skill is being used elsewhere in later levels, where players will be expected to use this skill without specefic instuction / less hanholding. Ensure no other clue is dependednt on the current lesson before any changes are made. Please note that the differntion of some paramaters being string and othes being objects is intentional. Strings are typically related to incorporial actions, while objects typically reference the room/enviornment. The distinction is important, as it cues to the player that said object is an interactable field, while a string is not. 

The hotspots are mostly flexible. If you feel their is a better way to convey the information, or you think a different position in the scene might make more sence just make a note of the change in this document.  

The dialouge is bad. Please change it. It was only included b/c it helps gives context to you regarding the overal story, and should tell what neccesary information needs to be conveyed to the user for said story. 
I am writing this in github and there is no spellcheck. Every other word is mispelled. I repeat THIS IS NOT THE INTENDED DIALOUGE, just a reference. 

 If there are any questions/concerns please contact Sahana or Darci. 

***

### First Action 
``self.search("look around room");``    the string is flexible. Preferably not a single word to really differentiate from the later string usage

Maybe upon entering the level the tutorial could force the slide pannel notebook to pop up, and draw the user's attention to **Bunny's Notebook** and the lesson for this tutorial
- Intended to get the user used to reading the lesson first, before examing the room for hotpots

The Notebook will have some dialouge like: _Thanks so much for helping out ૮꒰˶ᵔ ᵕ ᵔ˶꒱ა. I got you a thank you gift but I think I forgot to take it out of my super secret locked drawer before leaving
૮꒰˶´ ꒳ `꒱ა. But the key is somewhere in my office, if you look around the room I'm sure you'll be able to find it! I think it left is somewhere near one of the plants..._
_Hey! It's just like you're solving one of my mysteries ૮꒰˶ᵔ ᗜ ᵔ˶꒱ა I usually start those by doing self.search("look around room") too!!_

- The code and the looking around the room text should be emphasized in some way (diff color, bolded)
- I think the emoticons might be cute if we use them sparingly.
- This action should add something to the edvidence tab / whever such gathered information will be displayed, to teach the user they need to navigate there
- What exactly is added is somewhat dependent on what information is in the other hotspots. Origionally this was meant to provide the variable names for the drawer and the plantPot so the user know's how to reference them, but if that information is in a hotspot it obviously doesn't make complete sence for that to be the outcome of this input.
- THE ISSUE is that there needs to be a relativly simplie initial command, with ONE PARAMETER as the other code uses introduces two paramaters, and a little more complexity.
  This is one line of code that can be changed, if that would help with figuring out the output. Just ensure it's off the format self.search("string")


### Second Action 
`` self.search("under", plantPot);``

**The plant to the left of the desk** 

The hotspot / bunny's journal should teach the user that funcion can take multiple parameters, seperated by a comma. It should refer to plantPot. Imply that the key is under 
- Bunny's Journal: _Sometimes I need to be more specifc / intentional about my searches. I do this by adding more parameters to the search, like self.search("behind", someObject). But I have to be really careful, the objects in some of the cases I work are really sesitive. You could say that they're...caseSensative ૮꒰ - ﻌ •꒱ა_
- Dialouge also needs to convey that param order matters, since JS does't have a fancy compliler. 
- **Plant Hotspot**: is there something under this plantPot?

- Upon the correct input, the background changed to the shifted plant with the key


### Third Action
``self.unlock(lockedDrawer, key)`` 

`` let lockedDrawer`` 

````self.unlock(lockedDrawer, key)`` 


**The drawer to the left of the screen**

This also somewhat depends on how evidence / the "lizard notes" are going to be displayed. It doesn't really make sence for the user to be changing const to let if "const drawer" is showing up anywhere on their screen. Variable assignments aren't used in any subsequent levels, so if neccesarry this action could be shortened so that the drawer unlocks on first try, skipping the lesson on constants. The main focus will then be to teach the user about functions, by furthing the action metaphor by proviing them a new behavior to try: unlock(); 

If we aren't skipping the constants, then upon the first input the game will output _Error: oh no, this looks like the right key, it goes all the way in, but for some reason the lock won't turn? I wonder if there's something blocking/preventing it?_ 
- And then the hotspot or the journal will give the lesson on constants, explaing that const objects are immutable, and once their value is assigned they cannot be changed. Thus, we cannot chage a const drawer = lock to drawer = unlock. let objects "lets" objects be changed.
- The user then types the second input and something like _oh! I think i can move the key now. I should try unlokcing it again_ is output to prompt to user to retry the command
- Open writing the command again, the drawer will open, switching to the open drawer background and ending the level's gameplay.


### Transition "cutscene" 

- the baker sheep will come into the office saying _Help! Help! Someone broke into my bakery! Detective please I need your help_
- Then the lizard will be prompted (maybe through a hotspot on the sheep or a popup) that _I should tell the sheep that I'm not actually a detective._ and direct the user to make a print statement
- the baker will say something about how he really needs the lizards help, maybe offering baked goods, or just gathering evidence for the bunny detective to review when they come back
- the lizard/user reluctantly agrees to come with the sheep to the bakery 
- fade to black, the level has ended 





  
