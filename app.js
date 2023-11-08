document.addEventListener('DOMContentLoaded', () => { //only load the contents of this file once all the html has been loaded
    const grid = document.querySelector('.grid');//quesryselector allows us to select an element from the html file using the class name or id 
    const doodler = document.createElement('div');//create a div element in the html file 
    let startPoint = 150; //set the starting point to 150px
    let spacefrombottomtoDoodler = startPoint; //set the space from the bottom to the doodler to 150px
    let spacefromlefttoDoodler = 50; //set the space from the left to the doodler to 50px
    let isGameOver = false; 
    let platformCount = 5; //set the platform count to 5
    let platformsarray = []; //create an empty array called platforms\
    let upTimerId; 
    let downTimerId;
    let isJumping = true;
    let isleft = false;
    let isright = false;
    let leftTimerID;
    let rightTimerID;
    let score = 0;
    

    function initializeDoodler() {
        grid.appendChild(doodler); //add the doodler to the grid(grid is the parent we put the child doodler into it)
        doodler.classList.add('doodler'); //add the doodler class to the doodler element    
        spacefromlefttoDoodler = platformsarray[0].left; //set the doodler left space to the first platform's left space
        doodler.style.left =  spacefromlefttoDoodler + 'px'; //set the doodler's left position to the variable spacefromlefttoDoodler
        doodler.style.bottom = spacefrombottomtoDoodler + 'px'; //set the doodler's bottom position to the variable spacefrombottomtoDoodler

    }

    class Platform {
        constructor(newPlatformBottom) { //newPlatformBottom is a parameter passed to the constructor, representing the vertical position of the platform.
            this.bottom = newPlatformBottom; //this.bottom is a property of the platform object, storing the vertical position.
            this.left = Math.random() * 315; //this.left is a property storing the horizontal position, set to a random value between 0 and 315.
            this.visual = document.createElement('div'); //create a div element in the html file
            const visual = this.visual; 
            visual.classList.add('platform'); //add the platform class to the visual
            visual.style.left = this.left + 'px'; 
            visual.style.bottom = this.bottom + 'px'; 
            grid.appendChild(visual); //add the visual to the grid
        }
    }
    
    function initializePlatforms() {
        for (let i = 0; i < platformCount; i++) {
            let platformGap = 600 / platformCount; //set the platform gap to 600(height of the grid) divided by the platform count
            let newPlatformBottom = 100 + i * platformGap; //set the new platform bottom to 100 + i * platform gap
            let newPlatform = new Platform(newPlatformBottom); //create a new platform object with the new platform bottom 

            platformsarray.push(newPlatform); //each time this loops, we push the newly created platform into the platforms array
            console.log(platformsarray);
        }
    }

    function updatePlatformPositions() {
        if (spacefrombottomtoDoodler> 200) { //if the doodler is below 200px from the bottom
            platformsarray.forEach(platform => { //for each platform in the platforms array
                platform.bottom -= 4; //move the platform down by 4px
                let visual = platform.visual; //store the platform.visual in the visual variable
                visual.style.bottom = platform.bottom + 'px'; //set the visual style bottom to the platform bottom

                if (platform.bottom < 10) { //if the platform is below 10px from the bottom of the grid 
                    let firstPlatform = platformsarray[0].visual; //store the first platform in the firstPlatform variable
                    firstPlatform.classList.remove('platform'); //remove the platform class from the first platform
                    platformsarray.shift(); //remove the first platform from the platforms array
                    score++; //increase the score by 1
                    console.log(platformsarray);
                    let newPlatform = new Platform(600); //create a new platform with the bottom of 600px
                    platformsarray.push(newPlatform); //add the new platform to the platforms array
                }
            })
        }
    }

    function jump() {
        clearInterval(downTimerId); //clear the downTimerId interval because we dont want the doodler to move down anymore
        isJumping = true;
        upTimerId = setInterval(function () {
            spacefrombottomtoDoodler += 5; //move the doodler up by 20px
            doodler.style.bottom = spacefrombottomtoDoodler + 'px'; 
            if (spacefrombottomtoDoodler > startPoint + 200) { //if the doodler is above 350px from the bottom
                fall(); //call the fall function
            }
        }, 30)
    }

    function fall() {
        clearInterval(upTimerId); //clear the upTimerId interval because we dont want the doodler to move up anymore
        isJumping = false;
        downTimerId = setInterval(function () {
            spacefrombottomtoDoodler -= 5; //move the doodler down by 5px
            doodler.style.bottom = spacefrombottomtoDoodler + 'px';
            if (spacefrombottomtoDoodler <= 0) { //if the doodler is at the bottom of the grid
                endGame(); //call the endGame function
            }
            platformsarray.forEach(platform => {
                if (
                    (spacefrombottomtoDoodler >= platform.bottom) && //if the doodler is below the platform 
                    (spacefrombottomtoDoodler <= (platform.bottom + 15)) && //if the doodler is above the platform  
                    ((spacefromlefttoDoodler + 60) >= platform.left) && //if the doodler is to the right of the platform
                    (spacefromlefttoDoodler <= (platform.left + 85)) && //if the doodler is to the left of the platform
                    !isJumping //check if the doodler is jumping
                ) {
                    console.log("landed");
                    startPoint = spacefrombottomtoDoodler; //set the start point to the doodler's bottom position
                    jump();
                }
            })

        }, 30)
    }

    function endGame() {
        console.log("game over");
        isGameOver = true;
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild);
        }
        grid.innerHTML = score;
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(leftTimerID);
        clearInterval(rightTimerID);
    }

    function keyboardevent(e) {
        if (e.key === "ArrowLeft") {
            moveLeft();
        } else if (e.key === "ArrowRight") {
            moveRight();
        } else if (e.key === "ArrowUp") {
            moveStraight();
        }
    }

    function moveLeft() {
        if (isright) {
            clearInterval(rightTimerID);
            isright = false;
        }
        isleft = true;
        leftTimerID = setInterval(function () {
            if (spacefromlefttoDoodler >= 0) {
                spacefromlefttoDoodler -= 5;
                doodler.style.left = spacefromlefttoDoodler + 'px';
            } else moveRight();
            
        },30)
    }

    function moveRight() {
        if (isleft) {
            clearInterval(leftTimerID);
            isleft = false;
        }
        isright = true;
        rightTimerID = setInterval(function () {
            if (spacefromlefttoDoodler <= 340) {
                spacefromlefttoDoodler += 5;
                doodler.style.left = spacefromlefttoDoodler + 'px';
            } else moveLeft();
            
        },30)
    }

    function moveStraight() {
        isleft = false;
        isright = false;
        clearInterval(leftTimerID);
        clearInterval(rightTimerID);
    }

    function startGame() {  //make the doodler appear if this fuction is called
        if (!isGameOver) {
            initializePlatforms();
            initializeDoodler();   
            setInterval(updatePlatformPositions, 30); //call the updatePlatformPositions function every 30 milliseconds
            jump();
            document.addEventListener('keyup', keyboardevent); //add the keyboardevent function to the document
        }
    }
    startGame(); //call the startGame function
}); 
