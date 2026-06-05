# Level 1: The Crust & Crumb Bakery

## Layout & Design Coordination Notes

**Visual Setup:** Simple three-zone screen. The left side features the 2D bakery art based on image_a960f9.jpg, showcasing a charming pastry shop where a glass display case is shattered, smashed cakes litter the floor rug, and specific pastries remain intact on their trays. The bottom is the code input box. The right side holds the sliding handbook and an evidence checklist panel.

**The Rules:** An Array is a numbered list of items. Each item inside an array is called an element. We use dot notation . to look at specific details of an element (like dessert.name).

# Phase 1: The Shattered Display Case

## Context

The level opens inside the warm, cozy shop from image_a960f9.jpg. The glass on the main pastry case is cracked and broken, with crumbs and broken cake pieces scattered on the floor rug. Baker Sheep is pacing back and forth in distress. The player moves their mouse to the left and clicks on the ruined case asset.

### Display Case Hotspot Message

> "The display case is completely broken! Let's catalog what's still left inside."

### Character Dialogue

**Baker Sheep:** "See, look at the state of my bakery! The thief completely destroyed my perfectly organized displayCase. I have no idea what they took! Could you make me a remainingDessertList of what's still left while I try to clean up all this glass? It might give the police a clue to whoever did this."

### Slide Panel (Bunny's Notebook - Page 1)

> "When you have a big group of items to look through, our security console stores them in an Array. Think of an array like a numbered list, where every item on the list is called an element!
>
> To look at every single item on the list one by one without missing anything, we use a tool called .forEach(). It lets us grab each individual element and check it out in order.
>
> Try typing this command to start inspecting every dessert inside the display case array:
>
> `displayCase.forEach( dessert => { } )`"

### Player Input

```javascript
displayCase.forEach( dessert => { } )
```

### System Output

```bash
🟢 SUCCESS: Ready to inspect elements inside displayCase!
```

# Phase 2: Pushing Sweets to the List

## Context

The player prepares to type inside the action brackets { }. A helpful hotspot prompt on the console screen shows the player their choices for accessing fields based on the real items in image_a960f9.jpg: dessert.name, dessert.hasFruit, or dessert.isFlaky.

### Slide Panel (Bunny's Notebook - Page 2)

> "Great job! When examining an array of objects, we also need to consider what exactly we're checking for. To ensure I don't forget, I list specific actions I want to perform in a { } after the for-each. To prevent confusion, I use a ; to indicate the end of an action!
>
> Because the elements of an array are numbered, it's not easy to go and add a new element in between two others. This would require re-numbering every element that comes after! That's why I usually use array.push(newElement).
>
> By pushing the new element onto the end, I don't change the order of the elements already on the list, saving me a lot of effort! Let's grab the name field and add it to our list:
>
> `remainingDessertList.push(dessert.name);`"

### Player Input

```javascript
remainingDessertList.push(dessert.name);
```

### System Output

```bash
Scanning display case elements...
Added to list: "Cinnamon Swirl"
Added to list: "Strawberry Tart"
Added to list: "Croissant"
🟢 SUCCESS: remainingDessertList updated!
```

### Side Panel Update (Evidence Checklist)

- 🌀 Cinnamon Swirl
- 🍓 Strawberry Tart
- 🥐 Croissant

### Character Dialogue

**Bill the Lizard:** "Alright, the list updated, but looking at the side panel... these items are completely out of order compared to how the baker usually arranges them. Let's let the baker know what we found anyway."

# Phase 3: The Messy List

## Context

The player clicks on Baker Sheep to show him the newly populated, yet disorganized list of the remaining counter items.

### Baker Sheep Hotspot Message

> "Show the finished list to Baker Sheep."

### Player Input

```javascript
console.log("I've finished");
```

### System Output

```bash
📋 CURRENT LIST: [ "Cinnamon Swirl", "Strawberry Tart", "Croissant" ]
```

### Character Dialogue

**Baker Sheep:** "Wow. This list is a mess. A complete disaster. The messy display case has resulted in a completely disorganized mess. This is not helpful at all! Here, just this one time, I'll give you access to our super secret family sorting method: .sheepOrdering(). Please use it to reorder this remainingDessertList so it's easier to read!"

# Phase 4: Sorting the Evidence

## Context

The player opens Page 3 of Bunny's Notebook to figure out how to apply the custom sorting rule to rearrange the pastries.

### Slide Panel (Bunny's Notebook - Page 3)

> "Oftentimes I need to organize evidence for my cases, but sometimes using .sort() to organize things alphabetically isn't enough or right for the task.
>
> In cases like these, I need to define my own sorting function to determine the relation of each piece to each other. We compare two items at a time—let's call them dessert1 and dessert2.
>
> Then, when doing a sort, I can specify my own custom family sorting method like this:
>
> `remainingDessertList.sort((dessert1, dessert2) => dessert1.sheepOrdering(dessert2));`"

### Player Input

```javascript
remainingDessertList.sort((dessert1, dessert2) => dessert1.sheepOrdering(dessert2));
```

### System Output

```bash
Applying .sheepOrdering() rules...
🟢 SUCCESS: remainingDessertList perfectly organized!
```

### Side Panel Update (Evidence Checklist)

- 🥐 Croissant
- 🍓 Strawberry Tart
- 🌀 Cinnamon Swirl

### Character Dialogue

**Bill the Lizard:** "There we go. The list matches the proper bakery order now. That should give the police exactly what they need to cross-reference the stolen treats."

# Phase 5: The Witness Arrives

## Context

With the list organized, a small bat witness flutters through the bakery door, landing right near the broken pastry glass from image_a960f9.jpg.

### Character Dialogue

**Bat Witness:** "Oh no, did someone break in! I guess that's what all the noise was last night!"

**Baker Sheep:** "Yes! Did you see who did it? Did you see the thief?"

**Bat Witness:** "Not very clearly... it was dark. But I saw that they had round ears, they were small, and... Oh! They squeaked!"

# Phase 6: Off to the Station

## Context

Baker Sheep processes the clues provided by the bat witness and turns back toward Bill to head out.

### Character Dialogue

**Baker Sheep:** "I think they already have some suspects down at the police office! You should go with Bat and check them out to see if they match his description!"

**Bill the Lizard:** "(Nods, looking at the newly sorted evidence) Round ears, small, and squeaky. Sounds like we have a solid profile to work with. Lead the way, Bat."

## Visual Transition

The bakery scene smoothly fades away, and a stylized folder icon labeled "Suspect Files" appears on the screen.

### Plaintext

```text
[TRANSITION TO LEVEL 2: THE POLICE STATION SUSPECT LINEUP]
```
