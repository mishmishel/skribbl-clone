const words = [
    'bamboo', 'bandaid', 'bicycle', 'panda', 'noodles', 'chicken',
    'rainbow', 'volcano', 'king', 'sudoku', 'monkey', 'computer',
    'broccoli', 'cucumber', 'potato', 'tomato', 'onion', 'garlic',
    'apple', 'banana', 'orange', 'pear', 'pineapple', 'strawberry',
    'doctor', 'engineer', 'teacher', 'student', 'police', 'fireman',
    'nurse', 'pilot', 'sailor', 'astronaut', 'chef', 'baker',
    'artist', 'writer', 'musician', 'actor', 'director', 'painter',
    'rapper', 'hay', 'rose', 'password', 'nose', 'mouth', 'ear', 'eyes',
    'umbrella', 'castle', 'dolphin', 'cactus', 'princess',
    'lamb', 'sun', 'moon', 'star', 'flower', 'tree', 'bird', 'fish',
    'glue', 'water', 'fire', 'earth', 'air', 'light', 'dark', 'magic',
    'fishing', 'menu', 'world', 'football', 'basketball', 'tennis',
    'salad', 'hair', 'haircut', 'hairbrush', 'hairdryer', 'hairspray',
    'river', 'lake', 'sea', 'ocean', 'beach', 'island', 'mountain', 'hill',
    'piano', 'guitar', 'violin', 'cello', 'drums', 'bass', 'saxophone',
    'signature', 'desk', 'cheek', 'sister', 'brother', 'grandfather',
    'grandmother', 'mother', 'father', 'audience', 'temperature', 'humidity',
    'professor', 'poster', 'pot', 'fan', 'plate', 'fork', 'spoon', 'knife',
    'jacket', 'shirt', 'pants', 'dress', 'skirt', 'jeans', 'sweater', 'coat',
    'book', 'library', 'shelf', 'table', 'chair', 'bed', 'sofa', 'couch',
    'pen', 'pencil', 'eraser', 'notebook', 'bookcase', 'bookworm',
    'beachball', 'toothpaste', 'highlighter', 'mascara', 'lipstick',
    'eyeliner', 'eyelash', 'eyebrow', 'fence', 'door', 'window', 'doorbell',
    'camera', 'university', 'bear', 'vest', 'tie', 'watch', 'wallet', 'purse',
    'chart', 'robot', 'bottle', 'candle', 'rugby', 'rain', 'thunder',
    'comb', 'xylophone', 'xray', 'skeleton', 'ghost', 'witch', 'wizard', 'warlock',
    'vampire', 'werewolf', 'zombie', 'skull', 'toe', 'finger', 'tongue', 'teeth',
    'dentist', 'dance', 'headphones', 'perfume', 'tap', 'sushi', 'taco', 'hotdog',
    'penguin', 'flamingo', 'giraffe', 'crocodile', 'octopus', 'donut', 'icecream', 
    'popcorn', 'swimming', 'sleeping', 'sneezing', 'yawning', 'surfing', 'mosquito',
    'hammock', 'escalator', 'telescope', 'parachute', 'compass', 'selfie',
    'snorkel', 'pirate', 'mermaid', 'superhero','diamond', 'ring', 'trophy', 'tornado',
    'bacteria', 'skunk', 'garbage', 'airport',
];
  
function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}
  
module.exports = { getRandomWord };