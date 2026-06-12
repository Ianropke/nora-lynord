import os
import re

def update_fishing_game():
    with open("src/components/FishingGame.tsx", "r") as f:
        content = f.read()
    
    # 1. Fix the bug with the target word
    content = content.replace("const targetWord = currentWord || words[0].text;", "const targetWord = currentWord || words[0]?.text || '';")
    
    # Wait, the bug was that wordToSpawn logic was: 
    # words[Math.floor(Math.random() * words.length)].text
    # But wait, it already says that.
    # What if we ensure the target spawns frequently?
    old_spawn = """        const targetWord = currentWord || words[0].text;
        const hasTarget = prev.some(f => f.word === targetWord);
        const shouldSpawnTarget = Math.random() < 0.5 || !hasTarget;
        
        const wordToSpawn = shouldSpawnTarget ? targetWord : words[Math.floor(Math.random() * words.length)].text;"""
    
    new_spawn = """        const targetWord = currentWord || words[0]?.text || "";
        const hasTarget = prev.some(f => f.word === targetWord);
        // Force spawn target if it's not on screen, otherwise 30% chance
        const shouldSpawnTarget = !hasTarget || Math.random() < 0.3;
        
        let wordToSpawn = targetWord;
        if (!shouldSpawnTarget) {
            const wrongWords = words.filter(w => w.text !== targetWord);
            if (wrongWords.length > 0) {
                wordToSpawn = wrongWords[Math.floor(Math.random() * wrongWords.length)].text;
            }
        }"""
    content = content.replace(old_spawn, new_spawn)

    # 2. Pokémon Theme (Magikarp styling for fishes)
    content = content.replace('bg-cyan-600', 'bg-blue-500')
    content = content.replace('bg-gradient-to-b from-cyan-400 to-blue-700', 'bg-gradient-to-b from-blue-300 to-blue-800')
    
    # Magikarp colors: Orange, Red, Gold
    content = content.replace('const FISH_COLORS = [\n  "bg-orange-400", "bg-red-400", "bg-yellow-400", \n  "bg-green-400", "bg-purple-400", "bg-pink-400"\n];', 
                              'const FISH_COLORS = [\n  "bg-orange-500", "bg-red-500", "bg-yellow-500"\n];')
                              
    old_fish_ui = """              <div 
                className={`relative flex items-center justify-center px-6 py-3 rounded-full shadow-lg ${fish.color} border-2 border-white/20`}
                style={{ transform: fish.direction === -1 ? 'scaleX(-1)' : 'none' }}
              >
                {/* Fish Tail */}
                <div className={`absolute -left-6 w-0 h-0 border-y-[12px] border-y-transparent border-r-[20px] ${fish.color.replace('bg-', 'border-r-')}`} />
                {/* Fish Eye */}
                <div className="absolute right-4 top-2 w-2 h-2 bg-white rounded-full">
                  <div className="absolute right-0.5 top-0.5 w-1 h-1 bg-black rounded-full" />
                </div>
                {/* Fish Fin */}
                <div className={`absolute left-1/2 -top-3 w-6 h-4 ${fish.color} rounded-t-full opacity-80`} />
                
                <span 
                  className="text-white font-black text-xl drop-shadow-md relative z-10"
                  style={{ transform: fish.direction === -1 ? 'scaleX(-1)' : 'none' }}
                >
                  {fish.word}
                </span>
              </div>"""

    new_fish_ui = """              <div 
                className={`relative flex items-center justify-center px-8 py-4 rounded-[40px] shadow-lg ${fish.color} border-4 border-white/30`}
                style={{ transform: fish.direction === -1 ? 'scaleX(-1)' : 'none' }}
              >
                {/* Magikarp Whiskers */}
                <div className="absolute -bottom-2 right-2 w-4 h-6 border-b-2 border-r-2 border-yellow-300 rounded-br-full" />
                <div className="absolute -bottom-2 right-6 w-4 h-6 border-b-2 border-r-2 border-yellow-300 rounded-br-full" />
                
                {/* Fish Tail */}
                <div className={`absolute -left-8 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[20px] border-y-transparent border-r-[30px] ${fish.color.replace('bg-', 'border-r-')}`} />
                {/* Fish Eye */}
                <div className="absolute right-4 top-3 w-4 h-4 bg-white rounded-full border-2 border-black">
                  <div className="absolute right-0.5 top-0.5 w-1.5 h-1.5 bg-black rounded-full" />
                </div>
                {/* Fish Fin */}
                <div className={`absolute left-1/2 -top-4 w-8 h-6 ${fish.color} rounded-t-full border-2 border-white/20`} />
                <div className={`absolute left-1/2 -bottom-4 w-6 h-4 ${fish.color} rounded-b-full border-2 border-white/20`} />
                
                {/* Crown (Gold Magikarp) */}
                {fish.color.includes('yellow') && (
                  <div className="absolute right-8 -top-3 text-yellow-300 text-lg">👑</div>
                )}
                
                <span 
                  className="text-white font-black text-2xl drop-shadow-md relative z-10 px-2"
                  style={{ transform: fish.direction === -1 ? 'scaleX(-1)' : 'none' }}
                >
                  {fish.word}
                </span>
              </div>"""
    content = content.replace(old_fish_ui, new_fish_ui)
    
    with open("src/components/FishingGame.tsx", "w") as f:
        f.write(content)

def update_balloon_game():
    with open("src/components/BalloonPopGame.tsx", "r") as f:
        content = f.read()
    
    # Theme: Drifloon balloons
    # Drifloon is purple with a yellow cross patch
    
    old_balloon_ui = """              <motion.button
                key={balloon.id}
                initial={{ y: "120vh", x: `calc(${balloon.x}vw - 50%)` }}
                animate={{ y: "-20vh" }}
                transition={{ duration: balloon.speed, ease: "linear" }}
                onAnimationComplete={() => removeBalloon(balloon.id)}
                onClick={() => handlePop(balloon)}
                className="absolute flex flex-col items-center group pointer-events-auto cursor-pointer"
              >
                <div className={`w-24 h-28 ${balloon.color} rounded-[50%] shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.2)] flex items-center justify-center relative border-2 border-white/20 group-hover:brightness-110 transition-all group-active:scale-95`}>
                  {/* Balloon reflection */}
                  <div className="absolute top-2 left-4 w-4 h-8 bg-white/40 rounded-full rotate-45" />
                  
                  <span className="text-white font-black text-2xl drop-shadow-md z-10">
                    {balloon.word}
                  </span>
                  
                  {/* Balloon knot */}
                  <div className={`absolute -bottom-2 w-4 h-4 ${balloon.color} rotate-45`} />
                </div>
                {/* String */}
                <div className="w-0.5 h-16 bg-white/50 -mt-1" />
              </motion.button>"""

    new_balloon_ui = """              <motion.button
                key={balloon.id}
                initial={{ y: "120vh", x: `calc(${balloon.x}vw - 50%)` }}
                animate={{ y: "-20vh" }}
                transition={{ duration: balloon.speed, ease: "linear" }}
                onAnimationComplete={() => removeBalloon(balloon.id)}
                onClick={() => handlePop(balloon)}
                className="absolute flex flex-col items-center group pointer-events-auto cursor-pointer"
              >
                <div className={`w-28 h-28 ${balloon.color.includes('purple') ? 'bg-purple-500' : balloon.color} rounded-full shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.2)] flex items-center justify-center relative border-4 border-white/20 group-hover:brightness-110 transition-all group-active:scale-95`}>
                  {/* Drifloon fluff on top */}
                  <div className="absolute -top-4 w-12 h-6 bg-white rounded-full opacity-90 shadow-sm" />
                  
                  {/* Drifloon patch (yellow cross) */}
                  <div className="absolute text-yellow-300 font-bold text-3xl opacity-80 z-0">✖</div>
                  
                  {/* Balloon reflection */}
                  <div className="absolute top-4 left-4 w-4 h-8 bg-white/40 rounded-full rotate-45" />
                  
                  <span className="text-white font-black text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] z-10 bg-black/20 px-2 rounded-lg">
                    {balloon.word}
                  </span>
                  
                </div>
                {/* Strings (Drifloon has two thin arms) */}
                <div className="flex gap-4 -mt-2">
                   <div className="w-1 h-12 bg-yellow-500 rounded-b-full shadow-sm relative">
                     <div className="absolute -bottom-2 -left-1 w-3 h-3 bg-yellow-300 rounded-full" />
                   </div>
                   <div className="w-1 h-12 bg-yellow-500 rounded-b-full shadow-sm relative">
                     <div className="absolute -bottom-2 -left-1 w-3 h-3 bg-yellow-300 rounded-full" />
                   </div>
                </div>
              </motion.button>"""

    content = content.replace(old_balloon_ui, new_balloon_ui)
    
    # Change color pool
    content = content.replace('const BALLOON_COLORS = [\n  "bg-red-500", "bg-blue-500", "bg-green-500", \n  "bg-yellow-400", "bg-purple-500", "bg-pink-500"\n];',
                              'const BALLOON_COLORS = [\n  "bg-purple-600", "bg-purple-500", "bg-purple-400", \n  "bg-pink-500"\n];')
                              
    with open("src/components/BalloonPopGame.tsx", "w") as f:
        f.write(content)

def update_train_game():
    with open("src/components/TrainGame.tsx", "r") as f:
        content = f.read()

    # Magnet Train Theme
    # Replace background
    content = content.replace('bg-green-400', 'bg-sky-400')
    content = content.replace('bg-yellow-700', 'bg-gray-400') # Tracks
    
    # Train UI
    old_engine = """                {/* Engine */}
                <div className="w-32 h-24 bg-red-600 rounded-t-3xl rounded-r-3xl relative border-4 border-black shadow-lg">
                  <div className="absolute top-2 right-4 w-8 h-10 bg-black rounded-t-sm" />
                  <div className="absolute top-8 right-2 w-12 h-8 bg-blue-200 border-2 border-black rounded-md" />
                  <div className="absolute -bottom-2 left-2 w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-400" />
                  <div className="absolute -bottom-2 right-2 w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-400" />
                </div>"""
                
    new_engine = """                {/* Magnet Train Engine */}
                <div className="w-36 h-20 bg-gray-200 rounded-r-full rounded-tl-xl relative border-y-4 border-r-4 border-gray-400 shadow-xl overflow-hidden flex flex-col justify-between">
                  <div className="w-full h-3 bg-orange-500" />
                  <div className="absolute top-4 right-4 w-16 h-8 bg-sky-800 rounded-r-full border-2 border-gray-500 opacity-80" />
                  <div className="w-full h-3 bg-orange-500" />
                  {/* Floating base instead of wheels */}
                  <div className="absolute -bottom-2 w-full h-2 bg-cyan-400 blur-sm opacity-60" />
                </div>"""
                
    old_wagon = """                {/* Empty Wagon or Selected Wagon */}
                <div className="w-40 h-20 bg-orange-400 rounded-lg relative border-4 border-black shadow-lg flex items-center justify-center">
                  <div className="absolute -bottom-2 left-4 w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-400" />
                  <div className="absolute -bottom-2 right-4 w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-400" />
                  {selectedOption ? (
                     <span className="text-white font-black text-xl px-2 text-center break-words">{selectedOption}</span>
                  ) : (
                    <div className="w-32 h-12 border-4 border-dashed border-orange-200 rounded-md flex items-center justify-center">
                      <span className="text-orange-200 font-bold">?</span>
                    </div>
                  )}
                </div>"""
                
    new_wagon = """                {/* Magnet Train Wagon */}
                <div className="w-40 h-20 bg-gray-200 rounded-md relative border-y-4 border-gray-400 shadow-xl overflow-hidden flex flex-col justify-between items-center">
                  <div className="w-full h-3 bg-orange-500 absolute top-0" />
                  <div className="w-full h-3 bg-orange-500 absolute bottom-0" />
                  <div className="absolute -bottom-2 w-full h-2 bg-cyan-400 blur-sm opacity-60" />
                  
                  <div className="w-full h-full flex items-center justify-center pt-1">
                    {selectedOption ? (
                       <span className="text-gray-800 font-black text-xl px-2 text-center break-words">{selectedOption}</span>
                    ) : (
                      <div className="w-32 h-10 border-4 border-dashed border-gray-400 rounded-md flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400 font-bold">?</span>
                      </div>
                    )}
                  </div>
                </div>"""

    content = content.replace(old_engine, new_engine)
    content = content.replace(old_wagon, new_wagon)
    
    with open("src/components/TrainGame.tsx", "w") as f:
        f.write(content)

def update_spell_game():
    with open("src/components/SpellWordGame.tsx", "r") as f:
        content = f.read()

    # Pokedex Theme
    content = content.replace('bg-indigo-500', 'bg-red-600')
    content = content.replace('bg-indigo-400', 'bg-red-500')
    content = content.replace('border-indigo-700', 'border-red-800')
    content = content.replace('text-indigo-600', 'text-red-700')
    content = content.replace('text-indigo-500', 'text-red-600')
    
    # Decorate selected area as Pokedex screen
    content = content.replace('bg-white/10 rounded-3xl w-full max-w-lg border-2 border-dashed border-white/30',
                              'bg-cyan-100 rounded-lg w-full max-w-lg border-8 border-gray-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.3)] relative')
    
    # Add pokedex lights
    old_selected_area = """          {/* Selected Letters Area */}
          <div className="flex gap-2 flex-wrap justify-center min-h-[80px] p-4 bg-cyan-100 rounded-lg w-full max-w-lg border-8 border-gray-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.3)] relative">"""
    new_selected_area = """          {/* Pokédex Screen Area */}
          <div className="flex gap-2 flex-wrap justify-center min-h-[100px] p-6 bg-cyan-100 rounded-lg w-full max-w-lg border-8 border-gray-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.3)] relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-2 bg-red-500 rounded-full" />
            <div className="absolute -bottom-4 left-4 w-4 h-4 bg-red-500 rounded-full border-2 border-gray-800" />
            <div className="absolute -bottom-4 left-10 w-4 h-4 bg-yellow-500 rounded-full border-2 border-gray-800" />"""
    content = content.replace(old_selected_area, new_selected_area)
    
    with open("src/components/SpellWordGame.tsx", "w") as f:
        f.write(content)

update_fishing_game()
update_balloon_game()
update_train_game()
update_spell_game()
