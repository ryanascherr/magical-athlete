// TODO: Centaur and Banana issue. Centaur hoofwhacks and THEN checks current space of banana.

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
        // this.updateStatus();
        if (this.isTripped) {
            console.log(this.name + " stands up and skips their Main Move.");
            this.isTripped = false;
        } else {
            this.mainMove();
        }
    }
    updateStatus() {
        let currentSpace = this.currentSpace;

        let isInLead = true;
        racers.forEach(function(racer) {
            if (racer.currentSpace > currentSpace) {
                isInLead = false;
            }
        });
        this.isInLead = isInLead ? true : false;
        console.log(this.isInLead);

        let isInLast = true;
        racers.forEach(function(racer) {
            if (racer.currentSpace < currentSpace) {
                isInLast = false;
            }
        });
        this.isInLast = isInLast ? true : false;
        console.log(this.isInLast);

        let isAlone = true;
        racers.forEach(function(racer) {
            if (racer.currentSpace === currentSpace) {
                isAlone = false;
            }
        });
        this.isAlone = isAlone ? true : false;
        console.log(this.isAlone);
    }
    mainMove() {
        console.log(this.name + " is doing their main move.");
        this.roll();
    }
    roll() {
        let randomNumber = Math.floor(Math.random() * 6) + 1;
        console.log(this.name + " rolls a " + randomNumber + ".");

        this.move(randomNumber);
    }
    move(num) {
        let startingSpace = this.currentSpace;
        this.currentSpace += num;

        if (this.currentSpace < 0) {
            this.currentSpace = 0;
        }

        console.log(this.name + " moves " + num + " spaces. Their current space is " + this.currentSpace + ".");

        this.currentRacerMoveAbility();
        this.checkMoveAbilities(this.currentSpace, startingSpace);
    }
    currentRacerMoveAbility() {}
    checkMoveAbilities(currentSpace, startingSpace) {
        if (racers.includes(banana) && this !== banana) {
            if (startingSpace < banana.currentSpace && currentSpace > banana.currentSpace) {
                banana.theSlip(this);
            }
        }

        if (racers.includes(babaYaga) && this !== babaYaga) {
            if (currentSpace === babaYaga.currentSpace) {
                babaYaga.legIt(this);
            }
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

        this.move(randomNumber);
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

        this.move(randomNumber);
    }
}

let blimp = new Blimp("Blimp", "Blow It");
let blimpBtn = document.querySelector(".js_blimp");
blimpBtn.addEventListener('click', function() {
    blimp.startTurn();
});

class Centaur extends Racer {
    move(num) {
        let startingSpace = this.currentSpace;
        this.currentSpace += num;

        if (this.currentSpace < 0) {
            this.currentSpace = 0;
        }

        console.log(this.name + " moves " + num + " spaces. Their current space is " + this.currentSpace + ".");

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
        racer.move(-2);
    }
}

let centaur = new Centaur("Centaur", "Hoofwhack");
let centaurBtn = document.querySelector(".js_centaur");
centaurBtn.addEventListener('click', function() {
    centaur.startTurn();
});

class Coach extends Racer {
    roll() {
        let randomNumber = Math.floor(Math.random() * 6) + 1;
        console.log(this.name + " rolls a " + randomNumber + ".");

        console.log(this.name + "'s " + this.abilityName + " adds 1 to their move.");
        randomNumber += 1;

        this.move(randomNumber);
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



let racers = [blimp, centaur, alchemist, coach, babaYaga, banana];