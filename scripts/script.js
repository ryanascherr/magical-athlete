// TODO: Centaur and Banana issue. Centaur hoofwhacks and THEN checks current space of banana.
// TODO: Centaur and Coach issue. Coach's ability activates on any movement, not just main movement. (FIXED)
// TODO: Cheerleader not tripping when landing on Baba Yaga's space. (FIXED)
// TODO: Heckler needs to only work on a racer's turn, not every time they move.
// TODO: Timing issues, need to add things to a queue. For example, if Duelist lands on Baba Yaga's space, a duel is called, one of them moves, but Duelist never trips. It depends on the order of the racers in the array

// TODO: Do Huge Baby ability if they move onto someone's space.
// TODO: Rework LegIt for Baba Yaga.

class Racer {
    constructor(name, abilityName) {
        this.name = name;
        this.abilityName = abilityName;
        this.currentSpace = 0;
        this.isTripped = false;
        this.isInLead = true;
        this.isInLast = true;
        this.isAlone = false;
    }
    startTurn() {
        console.log("----- " + this.name + " is starting their turn. -----");
        this.updateStatus();

        this.beforeMainMove();

        if (this.isTripped) {
            console.log(this.name + " stands up and skips their main move.");
            this.isTripped = false;
        } else {
            this.mainMove();
        }

        this.updateStatus();
    }
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
        this.roll();
    }
    roll() {
        let randomNumber = Math.floor(Math.random() * 6) + 1;
        console.log(this.name + " rolls a " + randomNumber + ".");

        this.move(randomNumber, true);
    }
    move(num, isMainMove) {
        let startingSpace = this.currentSpace;
        let moveModifier = this.checkForMoveModifier(startingSpace, isMainMove, num);

        let totalMovement = num + moveModifier;

        this.currentSpace += totalMovement;

        if (this.currentSpace < 0) {
            this.currentSpace = 0;
        }

        console.log(this.name + " moves " + totalMovement + " spaces. Their current space is " + this.currentSpace + ".");

        this.currentRacerMoveAbility();
        this.checkMoveAbilities(this.currentSpace, startingSpace);
    }
    checkForMoveModifier(startingSpace, isMainMove, num) {
        let moveModifier = 0;

        if (racers.includes(coach)) {
            if (startingSpace === coach.currentSpace && isMainMove) {
                moveModifier += coach.goodHustle(this);
            }
        }

        if (racers.includes(gunk)) {
            if (this !== gunk) {
                moveModifier += gunk.goopEm(this);
            }        
        }

        if (racers.includes(hugeBaby)) {
            if (this !== hugeBaby) {
                if (startingSpace + num + moveModifier === hugeBaby.currentSpace && startingSpace + num + moveModifier !== 0) {
                    moveModifier += hugeBaby.reallyHuge();
                }
            }        
        }

        return moveModifier;
    }
    currentRacerMoveAbility() {

    }
    checkMoveAbilities(currentSpace, startingSpace) {

        let activatetheSlip = false;
        if (racers.includes(banana) && this !== banana) {
            if (startingSpace < banana.currentSpace && currentSpace > banana.currentSpace) {
                activatetheSlip = true;
                // banana.theSlip(this);
            }
        }

        let activateLegIt = false;
        if (racers.includes(babaYaga) && this !== babaYaga) {
            if (currentSpace === babaYaga.currentSpace) {
                activateLegIt = true;
                // babaYaga.legIt(this);
            }
        } else if (racers.includes(babaYaga) && this === babaYaga) {
            racers.forEach(function(racer) {
                if (racer.currentSpace === babaYaga.currentSpace && racer !== babaYaga) {
                    activateLegIt = true;
                    // babaYaga.legIt(racer);
                }
            });
        }

        let activateDuel = false;
        if (racers.includes(duelist) && this !== duelist) {
            if (currentSpace === duelist.currentSpace) {
                activateDuel = true;
                // duelist.duel(this);
            }
        }

        let activateSchadenfruede = false;
        if (racers.includes(heckler)) {
            if (Math.abs(currentSpace - startingSpace) <= 1) {
                activateSchadenfruede = true;
                // heckler.schadenfreude(this);
            }
        }

        console.log(activatetheSlip, activateLegIt, activateDuel, activateSchadenfruede);

        // Run the queue!
        if (activatetheSlip) {
            banana.theSlip(this);
        }
        if (activateLegIt) {
            babaYaga.legIt(this);
        }
        if (activateDuel) {
            duelist.duel(this);
        }
        if (activateSchadenfruede) {
            heckler.schadenfreude(this);
        }
    }
    trip() {
        this.isTripped = true;
        console.log(this.name + " trips.");
    }
    warp(space) {

    }
};

class Alchemist extends Racer {
    roll() {
        let randomNumber = Math.floor(Math.random() * 6) + 1;
        console.log(this.name + " rolls a " + randomNumber + ".");

        if (randomNumber < 3) {
            console.log(this.name + " uses " + this.abilityName + " to turn the " + randomNumber + " into a 4.");
            randomNumber = 4;
        }

        this.move(randomNumber, true);
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

    currentRacerMoveAbility() {
        racers.forEach(function(racer) {
            if (racer.currentSpace === babaYaga.currentSpace && racer !== babaYaga) {
                babaYaga.legIt(racer);
            }
        });
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
    roll() {
        let randomNumber = Math.floor(Math.random() * 6) + 1;
        console.log(this.name + " rolls a " + randomNumber + ".");

        if (this.currentSpace < 15) {
            console.log(this.name + "'s " + this.abilityName + " adds 3 to their move.");
            randomNumber += 3;
        } else {
            console.log(this.name + "'s " + this.abilityName + " subtracts 1 from their move.");
            randomNumber -= 1;
        }

        this.move(randomNumber, true);
    }
}

let blimp = new Blimp("Blimp", "Blow It");
let blimpBtn = document.querySelector(".js_blimp");
blimpBtn.addEventListener('click', function() {
    blimp.startTurn();
});

class Centaur extends Racer {
    move(num, isMainMove) {
        let startingSpace = this.currentSpace;
        let moveModifier = this.checkForMoveModifier(startingSpace, isMainMove, num);

        let totalMovement = num + moveModifier;

        this.currentSpace += totalMovement;

        if (this.currentSpace < 0) {
            this.currentSpace = 0;
        }

        console.log(this.name + " moves " + totalMovement + " spaces. Their current space is " + this.currentSpace + ".");

        racers.forEach(function(racer) {
            if (racer.currentSpace > centaur.currentSpace - num && racer.currentSpace < centaur.currentSpace) {
                centaur.hoofwhack(racer);
            }
        });

        this.currentRacerMoveAbility();
        this.checkMoveAbilities(this.currentSpace, startingSpace);
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

    currentRacerMoveAbility() {
        racers.forEach(function(racer) {
            if (racer.currentSpace === duelist.currentSpace && racer !== duelist) {
                duelist.duel(racer);
            }
        });
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
        console.log(this.name + "'s " + this.abilityName + " stops them from landing on their space.");
        return -1;
    }
}

let hugeBaby = new HugeBaby("Huge Baby", "Really Huge");
let hugeBabyBtn = document.querySelector(".js_huge-baby");
hugeBabyBtn.addEventListener('click', function() {
    hugeBaby.startTurn();
});



let racers = [babaYaga, duelist];