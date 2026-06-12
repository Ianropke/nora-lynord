import os
import re

files = ["BalloonPopGame.tsx", "SpellWordGame.tsx", "FishingGame.tsx", "TrainGame.tsx"]

for filename in files:
    filepath = f"src/components/{filename}"
    with open(filepath, "r") as f:
        content = f.read()

    # Change currentWord access
    content = content.replace("const currentWord = world.words[currentWordIndex];", "const currentWordObj = world.words[currentWordIndex];\n  const currentWord = currentWordObj?.text || \"\";")
    content = content.replace("const currentWord = world.words[currentWordIndex] || \"\";", "const currentWordObj = world.words[currentWordIndex];\n  const currentWord = currentWordObj?.text || \"\";")

    # BalloonPopGame & FishingGame
    content = content.replace("const targetWord = currentWord || words[0];", "const targetWord = currentWord || words[0].text;")
    content = content.replace("words[Math.floor(Math.random() * words.length)]", "words[Math.floor(Math.random() * words.length)].text")
    content = content.replace("if (!currentWord)", "if (!currentWord)") # unchanged

    # TrainGame options
    content = content.replace("const wrongOptions = words.filter(w => w !== currentWord);", "const wrongOptions = words.map(w => w.text).filter(w => w !== currentWord);")
    
    with open(filepath, "w") as f:
        f.write(content)

print("Updated all 4 files to use .text")
