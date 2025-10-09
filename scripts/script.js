// TODO: Heckler needs to only work on a racer's turn, not every time they move.
// TODO: Duelist issue with tripping while he is dueling. Image does not flip but he IS tripped and will skip next turn.
// TODO: Leadtoad only works on first track.

let univCurrentRacer = "";
let univCurrentRacerIndex = 0;

class Racer {
    constructor(name, abilityName) {
        this.name = name;
        this.abilityName = abilityName;
        this.currentSpace = 0;
        this.isTripped = false;
        this.isInLead = true;
        this.isInLast = true;
        this.isAlone = false;
        this.skipMainMove = false;
        this.isMyTurn = false;
        this.src = "./img/racers/racer_" + name.toLowerCase() + ".png";
    }
    setMyTurn() {
        racers.forEach(function(racer) {
            racer.isMyTurn = false;
        })

        this.isMyTurn = true;
        univCurrentRacer = this;
        document.querySelector(".js_turn-text").textContent = "It is " + this.name + "'s turn.";

        this.startTurn();
    }
    startTurn() {
        console.log("----- " + this.name + " is starting their turn. -----");

        this.updateStatus();
        this.beforeMainMove();

        if (this.skipMainMove) {
            this.skipMainMove = false;
        } else if (this.isTripped) {
            this.standUp();
            setNextTurn();
        } else {
            // this.mainMove();
        }

        this.updateStatus();
    }

    // Update if racer is in the lead, in last, and or alone
    updateStatus() {
        let currentSpace = this.currentSpace;
        let name = this.name;

        let isInLead = true;
        racers.forEach(function(racer) {
            if (racer.currentSpace > currentSpace) {
                isInLead = false;
            }
        });
        this.isInLead = isInLead ? true : false;

        let isInLast = true;
        racers.forEach(function(racer) {
            if (racer.currentSpace < currentSpace) {
                isInLast = false;
            }
        });
        this.isInLast = isInLast ? true : false;

        let isAlone = true;
        racers.forEach(function(racer) {
            if (racer.currentSpace === currentSpace && racer.name !== name) {
                isAlone = false;
            }
        });
        this.isAlone = isAlone ? true : false;
    }
    beforeMainMove() {

    }
    mainMove() {
        console.log(this.name + " is doing their main move.");
        let numberRolled = this.roll();

        let racer = this;

        setTimeout(function() {

            let canMove = racer.rollCheck(numberRolled);

            if (canMove) {
                let finalNumber = numberRolled + racer.diceMod(numberRolled);
                racer.move(finalNumber, true);
            }

        }, rollTime);
    }
    roll() {
        let die = document.querySelector(".cube");
        let numberRolled = Math.floor(Math.random() * 6) + 1;
        let numberAsString = JSON.stringify(numberRolled);
        console.log(this.name + " rolls a " + numberRolled + ".");

        if (die.classList.contains("low")) {
            die.className = "";
            die.classList.add("cube", "high");
            die.classList.add("face-" + numberAsString + "-high");
        } else {
            die.className = "";
            die.classList.add("cube", "low");
            die.classList.add("face-" + numberAsString + "-low");
        }

        return numberRolled;
    }
    rollCheck(numberRolled) {
        let canMove = true;

        if (racers.includes(inchworm) && numberRolled === 1 && this !== inchworm) {
            inchworm.wriggle(this);
            canMove = false;
        }

        if (racers.includes(lackey) && numberRolled === 6 && this !== lackey) {
            lackey.veryGoodSire();
        }

        return canMove;
    }
    diceMod(numberRolled) {
        return 0;
    }
    move(numberRolled, isMainMove) {
        let startingSpace = this.currentSpace;
        let racer = this;
        let moveModifier = this.checkForMoveModifier(startingSpace, isMainMove, numberRolled);
        let totalMovement = numberRolled + moveModifier;

        this.currentSpace += totalMovement;

        if (this.currentSpace < 0) {
            this.currentSpace = 0;
        } else if (this.currentSpace > 30) {
            this.currentSpace = 30;
        }

        console.log(this.name + " moves " + totalMovement + " spaces. Their current space is " + this.currentSpace + ".");

        let racerImage = document.querySelectorAll("[data-name='" + this.name + "']");
        racerImage = racerImage[0];
        racerImage.remove();

        this.placeRacer();

        if (this.currentSpace >= 11 && this.currentSpace <= 20) {
            this.faceLeft();
        } else {
            this.faceRight();
        }

        this.checkOtherMoveAbilities(racer, this.currentSpace, startingSpace);

        this.updateStatus();

        if (isMainMove) {
            setNextTurn();
        }
    }
    placeRacer() {
        let newImage = document.createElement('img');
        newImage.src = this.src;
        newImage.classList.add("racer");
        if (this.isTripped) {
            newImage.classList.add("racer--tripped");
        }
        newImage.dataset.name = this.name;

        let spaceToPlace = document.querySelector("[data-space='" + this.currentSpace + "']");
        // spaceToPlace = spaceToPlace[0];

        spaceToPlace.appendChild(newImage);
    }
    faceLeft() {
        let racerImage = document.querySelectorAll("[data-name='" + this.name + "']");
        racerImage = racerImage[0];
        racerImage.classList.add("racer--face-left");
    }
    faceRight() {
        let racerImage = document.querySelectorAll("[data-name='" + this.name + "']");
        racerImage = racerImage[0];
        racerImage.classList.remove("racer--face-left");
    }
    // Check to see if any abilities would affect how much the racer moves
    checkForMoveModifier(startingSpace, isMainMove, num) {
        let moveModifier = 0;

        if (racers.includes(coach)) {
            if (startingSpace === coach.currentSpace && isMainMove) {
                moveModifier += coach.goodHustle();
            }
        }

        if (racers.includes(gunk)) {
            if (this !== gunk) {
                moveModifier += gunk.goopEm();
            }        
        }

        if (racers.includes(hugeBaby)) {
            if (this !== hugeBaby) {
                if (startingSpace + num + moveModifier === hugeBaby.currentSpace && startingSpace + num + moveModifier !== 0) {
                    moveModifier += hugeBaby.reallyHuge();
                }
            }        
        }

        if (this === leaptoad) {
            if (isMainMove) {
                moveModifier += leaptoad.jumpfrog(startingSpace, num);
            }
        }

        return moveModifier;
    }
    // Check to see if my ability triggered while moving or when I stopped
    myMoveAbility() {

    }
    // Check to see if any abilities triggered while racer was moving or when they stopped moving
    checkOtherMoveAbilities(movingRacer, currentSpace, startingSpace) {

        let activatetheSlip = false;
        if (racers.includes(banana) && movingRacer !== banana) {
            if (startingSpace < banana.currentSpace && currentSpace > banana.currentSpace) {
                activatetheSlip = true;
            }
        }

        let activateLegIt = false;
        let legItTargetArray = [];
        if (racers.includes(babaYaga)) {
            if (movingRacer === babaYaga) {
                racers.forEach(function(arrayRacer) {
                    if (arrayRacer.currentSpace === babaYaga.currentSpace && arrayRacer !== babaYaga) {
                        activateLegIt = true;
                        legItTargetArray.push(arrayRacer);
                    }
                })
            } else if (currentSpace === babaYaga.currentSpace) {
                activateLegIt = true;
                legItTargetArray.push(movingRacer);
            }
        }

        let activateDuel = false;
        let duelistTarget = "";
        if (racers.includes(duelist)) {
            if (movingRacer === duelist) {
                racers.forEach(function(arrayRacer) {
                    if (arrayRacer.currentSpace === duelist.currentSpace && arrayRacer !== duelist) {
                        activateDuel = true;
                        duelistTarget = arrayRacer;
                    }
                })
            } else if (currentSpace === duelist.currentSpace) {
                activateDuel = true;
                duelistTarget = movingRacer;
            }
        }

        let activateSchadenfruede = false;
        if (racers.includes(heckler)) {
            if (Math.abs(currentSpace - startingSpace) <= 1) {
                activateSchadenfruede = true;
            }
        }

        let activateReallyHuge = false;
        if (racers.includes(hugeBaby) && movingRacer === hugeBaby) {
            racers.forEach(function(arrayRacer) {
                if (arrayRacer.currentSpace === hugeBaby.currentSpace && arrayRacer !== hugeBaby) {
                    console.log(this.name + "'s " + this.abilityName + " stops them from being on the same space.");
                    arrayRacer.move(-1, false);
                }
            })
        }

        let activateAhLove = false;
        let numberOnSpace = 1;
        let otherRacer = "";
        if (racers.includes(romantic)) {
            racers.forEach(function(arrayRacer) {
                if (movingRacer.currentSpace === arrayRacer.currentSpace && movingRacer !== arrayRacer) {
                    otherRacer = arrayRacer;
                    numberOnSpace++;
                }
            })
            if (numberOnSpace === 2) {
                romantic.ahLove(movingRacer, otherRacer);
            }
        }

        this.myMoveAbility(currentSpace, startingSpace);

        this.runTheQueue(movingRacer, activatetheSlip, activateLegIt, legItTargetArray, activateDuel, duelistTarget, activateSchadenfruede);
    }
    // Let all abilities queue up first so that none are missed, then run all in order
    runTheQueue(movingRacer, activatetheSlip, activateLegIt, legItTargetArray, activateDuel, duelistTarget, activateSchadenfruede) {
        if (activatetheSlip) {
            banana.theSlip(movingRacer);
        }
        if (activateLegIt) {
            legItTargetArray.forEach(function(target) {
                babaYaga.legIt(target);
            });
        }
        if (activateDuel) {
            duelist.duel(duelistTarget);
        }
        if (activateSchadenfruede) {
            heckler.schadenfreude(movingRacer);
        }
    }
    trip() {
        this.isTripped = true;
        console.log(this.name + " trips.");

        let racerImage = document.querySelectorAll("[data-name='" + this.name + "']");
        racerImage = racerImage[0];
        racerImage.classList.add("racer--tripped");

    }
    standUp() {
        console.log(this.name + " stands up and skips their main move.");
        this.isTripped = false;

        let racerImage = document.querySelectorAll("[data-name='" + this.name + "']");
        racerImage = racerImage[0];
        racerImage.classList.remove("racer--tripped");
    }
    warp(space) {
        this.currentSpace = space;
    }
};

class Alchemist extends Racer {
    roll() {
        let numberRolled = Math.floor(Math.random() * 6) + 1;
        console.log(this.name + " rolls a " + numberRolled + ".");

        if (numberRolled < 3) {
            console.log(this.name + " uses " + this.abilityName + " to turn the " + numberRolled + " into a 4.");
            numberRolled = 4;
        }

        return numberRolled;
    }
};

let alchemist = new Alchemist("Alchemist", "Transmute 'n' Scoot");
let alchemistBtn = document.querySelector(".js_alchemist");
alchemistBtn.addEventListener('click', function() {
    alchemist.startTurn();
});

class BabaYaga extends Racer {
    legIt(racer) {
        console.log(this.name + "'s " + this.abilityName + " causes " + racer.name + " to trip.")
        racer.trip();
    }
};

let babaYaga = new BabaYaga("Baba Yaga", "Leg It");
let babaYagaBtn = document.querySelector(".js_baba-yaga");
babaYagaBtn.addEventListener('click', function() {
    babaYaga.startTurn();
});

class Banana extends Racer {
    theSlip(racer) {
        console.log(this.name + "'s " + this.abilityName + " causes " + racer.name + " to trip.")
        racer.trip();
    }
};

let banana = new Banana("Banana", "The Slip");
let bananaBtn = document.querySelector(".js_banana");
bananaBtn.addEventListener('click', function() {
    banana.startTurn();
});

class Blimp extends Racer {
    diceMod() {
        if (this.currentSpace < 15) {
            console.log(this.name + "'s " + this.abilityName + " adds 3 to their move.");
            return 3;
        } else {
            console.log(this.name + "'s " + this.abilityName + " subtracts 1 from their move.");
            return -1;
        }
    }
}

let blimp = new Blimp("Blimp", "Blow It");
let blimpBtn = document.querySelector(".js_blimp");
blimpBtn.addEventListener('click', function() {
    blimp.startTurn();
});

class Centaur extends Racer {

    myMoveAbility(currentSpace, startingSpace) {
        let activateHoofwhack = false;
        let hoofwhackTargetArray = [];
        racers.forEach(function(racer) {
            if (startingSpace < racer.currentSpace && currentSpace > racer.currentSpace) {
                activateHoofwhack = true;
                hoofwhackTargetArray.push(racer);
            }
        });

        if (activateHoofwhack) {
            hoofwhackTargetArray.forEach(function(target) {
                centaur.hoofwhack(target);
            });
        }
    }

    hoofwhack(racer) {
        console.log(centaur.name + " uses " + centaur.abilityName + " to kick " + racer.name + " back 2 spaces.");
        racer.move(-2, false);
    }
}

let centaur = new Centaur("Centaur", "Hoofwhack");
let centaurBtn = document.querySelector(".js_centaur");
centaurBtn.addEventListener('click', function() {
    centaur.startTurn();
});

class Cheerleader extends Racer {
    beforeMainMove() {
        let doesAbilityActivate = false;
        console.log(cheerleader.name + "'s " + this.abilityName + " causes all racers in last place to move 2 spaces.");
        racers.forEach(function(racer) {
            if (racer.isInLast) {
                racer.move(2, false);
                doesAbilityActivate = true;
            };
        });

        if (doesAbilityActivate) {
            console.log(cheerleader.name + "'s " + this.abilityName + " causes Cheerleader to move 1 space.");
            cheerleader.move(1, false);
        }
    }
}

let cheerleader = new Cheerleader("Cheerleader", "Rah Rah");
let cheerleaderBtn = document.querySelector(".js_cheerleader");
cheerleaderBtn.addEventListener('click', function() {
    cheerleader.startTurn();
});

class Coach extends Racer {
    goodHustle() {
        console.log(coach.name + "'s " + this.abilityName + " adds 1 to their move.");
        return 1;
    }
}

let coach = new Coach("Coach", "Good Hustle");
let coachBtn = document.querySelector(".js_coach");
coachBtn.addEventListener('click', function() {
    coach.startTurn();
});

class CopyCat extends Racer {
}

let copyCat = new CopyCat("Copy Cat", "Copy That");
let copyCatBtn = document.querySelector(".js_copy-cat");
copyCatBtn.addEventListener('click', function() {
    copyCat.startTurn();
});

class Dicemonger extends Racer {
}

let dicemonger = new Dicemonger("Dicemonger", "Dicey Deals");
let dicemongerBtn = document.querySelector(".js_dicemonger");
dicemongerBtn.addEventListener('click', function() {
    dicemonger.startTurn();
});

class Duelist extends Racer {
    duel(racer) {
        console.log("Duelist initiates a DUEL against " + racer.name + ".");

        let duelistRoll = Math.floor(Math.random() * 6) + 1;
        console.log(duelist.name + " rolls a " + duelistRoll + " for the duel.");

        let otherRoll = Math.floor(Math.random() * 6) + 1;
        console.log(racer.name + " rolls a " + otherRoll + " for the duel.");

        if (duelistRoll >= otherRoll) {
            console.log(duelist.name + " wins the duel and moves 2 spaces.");
            duelist.move(2, false);
        } else {
            console.log(racer.name + " wins the duel and moves 2 spaces.");
            racer.move(2, false);
        }
    }
}

let duelist = new Duelist("Duelist", "DUEL!");
let duelistBtn = document.querySelector(".js_duelist");
duelistBtn.addEventListener('click', function() {
    duelist.startTurn();
});

class Egg extends Racer {
}

let egg = new Egg("Egg", "Scramble");
let eggBtn = document.querySelector(".js_egg");
eggBtn.addEventListener('click', function() {
    egg.startTurn();
});

class FlipFlop extends Racer {
}

let flipFlop = new FlipFlop("Flip Flop", "Flop Flip");
let flipFlopBtn = document.querySelector(".js_flip-flop");
flipFlopBtn.addEventListener('click', function() {
    flipFlop.startTurn();
});

class Genius extends Racer {
}

let genius = new Genius("Genius", "Think Good");
let geniusBtn = document.querySelector(".js_genius");
geniusBtn.addEventListener('click', function() {
    genius.startTurn();
});

class Gunk extends Racer {
    goopEm() {
        console.log(gunk.name + "'s " + this.abilityName + " subtracts 1 from their move.");
        return -1;
    }
}

let gunk = new Gunk("Gunk", "Goop'Em");
let gunkBtn = document.querySelector(".js_gunk");
gunkBtn.addEventListener('click', function() {
    gunk.startTurn();
});

class Hare extends Racer {
    beforeMainMove() {
        if (this.isInLead && this.isAlone) {
            console.log(this.name + "'s " + this.abilityName + " makes them skip their main move.");
            this.skipMainMove = true;
        }
    }
    diceMod() {
        console.log(this.name + "'s " + this.abilityName + " adds 2 to their move.");

        let diceMod = 2;

        return diceMod;
    }
}

let hare = new Hare("Hare", "Hubris");
let hareBtn = document.querySelector(".js_hare");
hareBtn.addEventListener('click', function() {
    hare.startTurn();
});

class Heckler extends Racer {
    schadenfreude(racer) {
        console.log(heckler.name + " uses " + this.abilityName + " towards " + racer.name + " to move 2 spaces.");
        heckler.move(2, false);
    }
}

let heckler = new Heckler("Heckler", "Schadenfreude");
let hecklerBtn = document.querySelector(".js_heckler");
hecklerBtn.addEventListener('click', function() {
    heckler.startTurn();
});

class HugeBaby extends Racer {
    reallyHuge() {
        console.log(this.name + "'s " + this.abilityName + " stops them from being on the same space.");
        return -1;
    }
}

let hugeBaby = new HugeBaby("Huge Baby", "Really Huge");
let hugeBabyBtn = document.querySelector(".js_huge-baby");
hugeBabyBtn.addEventListener('click', function() {
    hugeBaby.startTurn();
});

class Inchworm extends Racer {
    wriggle(racer) {
        console.log(inchworm.name + "'s Wriggle stops " + racer.name + " from moving.");
        inchworm.move(1, false);
        setNextTurn();
    }
}

let inchworm = new Inchworm("Inchworm", "Wriggle");
let inchwormBtn = document.querySelector(".js_inchworm");
inchwormBtn.addEventListener('click', function() {
    inchworm.startTurn();
});

class Lackey extends Racer {
    veryGoodSire() {
        console.log(lackey.name + "'s Very Good Sire lets him move.");
        lackey.move(2, false);
    }
}

let lackey = new Lackey("Lackey", "Very Good Sire");
let lackeyBtn = document.querySelector(".js_lackey");
lackeyBtn.addEventListener('click', function() {
    lackey.startTurn();
});

class Leaptoad extends Racer {
    jumpfrog(startingSpace, num) {
        let endingSpace = startingSpace + num;
        if (endingSpace > 30) {
            endingSpace = 30;
        }
        let spacesSkipped = 0;
        let trackSpaces = document.querySelectorAll(".track__space");
        let distance = endingSpace - startingSpace;

        for (let i = startingSpace + 1; i < distance + startingSpace + 1; i++) {
            let space = trackSpaces[i];
            
            if (space.querySelector('img') && i < 30) {
                spacesSkipped++;
                distance++;
            }
        }

        if (spacesSkipped !== 0) {
            console.log(leaptoad.name + "'s " + this.abilityName + " lets them skip over " + spacesSkipped + " spaces.");
        }

        return spacesSkipped;
    }
}

let leaptoad = new Leaptoad("Leaptoad", "Jumpfrog");
let leaptoadBtn = document.querySelector(".js_leaptoad");
leaptoadBtn.addEventListener('click', function() {
    leaptoad.startTurn();
});

class Romantic extends Racer {
    ahLove(racer1, racer2) {
        console.log(romantic.name + "'s Ah, Love! lets her move because " + racer1.name + " and " + racer2.name + " are alone on a space together.");
        romantic.move(2, false);
    }
}

let romantic = new Romantic("Romantic", "Ah, Love!");
let romanticBtn = document.querySelector(".js_romantic");
romanticBtn.addEventListener('click', function() {
    romantic.startTurn();
});

let racers = [banana, dicemonger, inchworm, lackey, leaptoad];
let numberOfRacers = racers.length;
let racerWidth = 100 / numberOfRacers;
let spaces = document.querySelectorAll(".track__space");

init()
function init() {
    putRacersOnTrack();
    setNextTurn();
}

function putRacersOnTrack() {
    racers.forEach(function(racer) {
        let newImage = document.createElement('img');
        newImage.src = racer.src;
        newImage.classList.add("racer");
        newImage.dataset.name = racer.name;

        document.querySelector(".js_start").appendChild(newImage);
    });
}

let isDiceRolling = false;
let roll = 0;
let rollTime = 0;
let modifier = 0;
let numberOfDice = 2;
let log = [];
let isLogShown = true;
let style = "classic";

document.querySelector(".cube").addEventListener('click', () => {
    univCurrentRacer.mainMove();
});

function setNextTurn() {
    univCurrentRacerIndex++;

    if (univCurrentRacerIndex === racers.length + 1) {
        univCurrentRacerIndex = 1;
    }

    racers[univCurrentRacerIndex-1].setMyTurn();
}