import {useEffect, useState} from "react";

const CHARACTER_SIZE = 30
const GRAVITY_SCALE = 0.65
const JUMP_STRENGTH = -10
const MOVE_SPEED = 4
const BIRD_HEIGHT = 70
const BIRD_Y_SPEED = 1 / 30
const MIN_DELAY = 15

export default function JumpyDog() {
    const [running, setRunning] = useState(true)
    const [finalScore, setFinalScore] = useState(0)

    let canvas: HTMLCanvasElement
    const targetWidth = 300
    let ctx: CanvasRenderingContext2D
    let character: HTMLImageElement

    // Initial position
    const x = 35
    let y = 0;
    let velocity = 0;
    let groundY = 0;

    let maxDelay = 50
    let spawnDelay = 50
    let score = 0
    let animationIds: number[] = []

    let obstacles: {object: HTMLImageElement, x: number, y: number, type: string}[] = []

    const handleClick = (event: unknown) => {
        if (y + character.height != groundY) return

        if (event instanceof MouseEvent) {
            velocity = JUMP_STRENGTH
        }
        else if (event instanceof KeyboardEvent && event.key == ' ') {
            velocity = JUMP_STRENGTH
        }
    }

    useEffect(() => {
        canvas = document.getElementById('jumpy-canvas') as HTMLCanvasElement;

        if (!canvas) return

        ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        // Draw main character
        character = new Image(CHARACTER_SIZE, CHARACTER_SIZE);
        character.src = '/jumpy/jumpy-dog.png'; // Set the image source
        character.onload = () => {
            runGame()
        };

        // Listen for click events anywhere in the window
        window.addEventListener('click', handleClick);

        // Listen for spacebar keydown events anywhere in the window
        window.addEventListener('keydown', handleClick);

        return () => {
            // Listen for click events anywhere in the window
            window.removeEventListener('click', handleClick);

            // Listen for spacebar keydown events anywhere in the window
            window.removeEventListener('keydown', handleClick);
        }
    })

    const runGame = () => {
        const aspectRatio = character.width / character.height;
        const targetHeight = targetWidth / aspectRatio;

        // Set canvas size to match the image resolution, factoring in the device pixel ratio
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ratio = window.devicePixelRatio || 1;
        canvas.width = targetWidth * ratio;
        canvas.height = targetHeight * ratio;

        ctx.font = '15px GeistMono';
        ctx.fillStyle = 'white';

        groundY = canvas.height - 50;
        y = groundY + character.height
        const drawGround = () => {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.strokeRect(0, groundY, canvas.width, 1);
        }

        const drawRandomObject = () => {
            const imgSrcs = ['birds', 'grave', 'bush'];

            const min = 0
            const max = imgSrcs.length - 1
            const src = imgSrcs[Math.floor(Math.random() * (max - min + 1)) + min]

            const objX = canvas.width
            let objY = groundY


            if (src == 'birds') {
                objY -= BIRD_HEIGHT
            }

            // Draw main character
            const obj = new Image(CHARACTER_SIZE, CHARACTER_SIZE);
            obj.src = '/jumpy/jumpy-' + src + '.png'; // Set the image source
            obj.onload = () => {
                obstacles.push({
                    object: obj,
                    x: objX,
                    y: objY - obj.height,
                    type: src
                })
            };
        }

        const endGame = ()  => {
            setRunning(false)
            setFinalScore(score)
            console.log('Game over! Max delay', maxDelay)

            animationIds.forEach(id => cancelAnimationFrame(id));
            animationIds = [];  // Clear the array
            obstacles = []
        }

        function drawFrame() {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawGround()
            // Draw main character
            ctx.drawImage(character, x, y, CHARACTER_SIZE, CHARACTER_SIZE);


            // PLAYER PHYSICS
            y += velocity
            // Update the position with gravity
            if (y + character.height < groundY) {
                velocity += GRAVITY_SCALE
            }
            else if (y == groundY - character.height) {
                velocity = 0
            }

            if (y + character.height > groundY) {
                y  = groundY - character.height
            }

            // OBJECT PHYSICS
            for (let i = 0; i < obstacles.length; i++) {
                const object = obstacles[i].object
                const type = obstacles[i].type
                let objX = obstacles[i].x
                let objY = obstacles[i].y

                objX -= MOVE_SPEED

                if (type == 'birds') {
                    objY = groundY - (Math.sin(objX * BIRD_Y_SPEED) * 5) - BIRD_HEIGHT
                }


                if (Math.abs(objX - x) < character.width * 0.85 && Math.abs(objY - y) < character.height * 0.85) {
                    endGame()
                }

                if (objX + obstacles[i].object.width + 15 > 0) {
                    ctx.drawImage(object, objX, objY, CHARACTER_SIZE, CHARACTER_SIZE);
                    obstacles[i].x = objX
                    obstacles[i].y = objY
                }
                else { // Kill object
                    obstacles.splice(i,1)
                    score++
                    console.log('Score:', score)
                    maxDelay = Math.max(maxDelay - 0.5, MIN_DELAY)
                }

            }

            // Spawn objects periodically
            if (spawnDelay <= 0 && Math.random() < 0.05) {
                drawRandomObject()
                spawnDelay = maxDelay
            }
            spawnDelay -= 1

            // Draw text on the canvas
            ctx.fillText('Score: '  + score, 35, groundY - 100);  // (text, x, y)

            if (running) {
                animationIds.push(requestAnimationFrame(drawFrame));
            }
        }

        drawFrame()
    }

    return (
        <>
            {running ?
                <canvas id='jumpy-canvas'></canvas> :
                <div className='font-[family-name:var(--font-geist-mono)] flex flex-col justify-center items-center'>
                    <h1 className='text-6xl'>GAME 0VER</h1>
                    <h2 className='text-3xl'>SC0RE: {finalScore}</h2>
                </div>
            }
        </>
    )
}