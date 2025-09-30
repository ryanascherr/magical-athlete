console.log("Hello world!");

class Racer {
    constructor(name, abilityName) {
        this.name = name;
        this.abilityName = abilityName;
        this.isTripped = false;
        this.currentSpace = 0;
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
        this.currentSpace += num;
        console.log(this.name + " moves " + num + " spaces. Their current space is " + this.currentSpace + ".");
    }
    trip() {

    }
    warp(space) {

    }
};

class Alchemist extends Racer {
    roll() {
        let randomNumber = Math.floor(Math.random() * 6) + 1;
        console.log(this.name + " rolled a " + randomNumber + ".");

        if (randomNumber < 3) {
            console.log(this.name + " uses " + this.abilityName + " to turn the " + randomNumber + " into a 4.");
            randomNumber = 4;
        }

        this.move(randomNumber);
    }
};

let alchemist = new Alchemist("Alchemist", "Transmute 'n' Scoot");
console.log(alchemist);
alchemist.mainMove();

class Blimp extends Racer {
    roll() {
        let randomNumber = Math.floor(Math.random() * 6) + 1;
        console.log(this.name + " rolled a " + randomNumber + ".");

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
console.log(blimp);
// blimp.mainMove();

let blimpBtn = document.querySelector(".js_blimp");
blimpBtn.addEventListener('click', function() {
    blimp.mainMove();
});