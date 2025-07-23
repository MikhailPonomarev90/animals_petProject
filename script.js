function getRandomIndexFromArray(array) {
  return Math.floor(Math.random() * array.length);
}

function calculateRange(max) {
  return Math.floor(Math.random() * max) + 1;
}

function calculateProbability(K) {
  return calculateRange(10) > K;
}

function calculatEeagleHunger() {
  if (mice_index > 2) {
    calculateProbability(8)
  } else if (mice_index > 3) {
    calculateProbability(5)
  } else if (mice_index > 5) {
    calculateProbability(3)
  } else return false;
}

const GRASS_AMOUNT = 130;
const MICE_AMOUNT = 1000;
const EAGLES_AMOUNT = 10;
const DAYS = 365*5;

const MAX_MICE_AMOUNT = 20000;

const GRASS = {
  population: GRASS_AMOUNT
}

const MICE = {
  food: GRASS.population,
  maxAge: 365,
  maxChildren: 12,
  eatPerDay: 3,
  pregnantPeriod: 60,
  population: [],
  animalNumber: 0
};

let mice_index;

const EAGLES = {
  food: MICE.population,
  maxAge: 365,
  maxChildren: 2,
  eatPerDay: 5,
  pregnantPeriod: 120,
  population: [],
  animalNumber: 0
};

let dayNumber = 1;
let logIsEnabled = false;

class Logger {
  constructor() {
    this.dayData = [];
  }

  animalIsBorn(name) {
      if(dayNumber%20 === 0 && logIsEnabled ) console.log("New " + name + " is Born");
  } 

  animalIsEaten(name) {
      if(dayNumber%20 === 0 && logIsEnabled) console.log(name + " is Eaten");
  }

  animalIsDead(name) {
      if(dayNumber%20 === 0 && logIsEnabled) console.log(name + " is Dead");
  }

  isNoFood(name, lifepower) {
      if(logIsEnabled) console.log("==== NO FOOOD FOR " + name + "DAY IS: " + dayNumber + " LIFEPOWER" + lifepower + "===");
  }

  endDay(index) {
      if(dayNumber < 100 || (dayNumber%20 === 0 && logIsEnabled)) console.log("======END DAY " + index + " =======")
  }

  grassAmount() {
      if(dayNumber < 100 || (dayNumber%20 === 0 && logIsEnabled)) console.log("Grass amount: " + grass + " / " + Math.round(grass/GRASS_AMOUNT * 100) + "%");
  }

  animalsAmount() {
      if(dayNumber < 100 || (dayNumber%20 === 0 && logIsEnabled)) console.log("Mices amount: " + mices.length + " / Eagles amount" + eagles.length);
  }

  printNewMicesPerDay() {
      if(logIsEnabled) console.log("NEWBORN MICES: " + newMicesPerDay + "/ DAY" + dayNumber);
  }

  difficultToFindMices() {
    console.log("MICE_INDEX: " + mice_index + ", MICE: " + MICE.population.length + ", EAGLES: " + EAGLES.population.length + " / DAY " + dayNumber);
  }

  maxMiceAmount(quantity) {
    console.log("TOO MUCH MICES: " + quantity + " / DAY " + dayNumber);
  }

  worldISEmty() {
    console.log("WORLD IS EMPTY AT DAY " + dayNumber);
  }

  printDataFromDBForDay(day, index) {
    console.log("LOG DAY " + index);
    console.log("Grass amount: " + day.grassAmount + " / " + Math.round(day.grassAmount/GRASS_AMOUNT * 100) + "%");
    console.log("Mices amount: " + day.mices + " / Eagles amount" + day.eagles);
  }
}

class DataBase {
  constructor() {
    this.dayData = [];
  }
  logDayData() {
      this.dayData.push({
          eagles: EAGLES.population.length,
          mices: MICE.population.length,
          grassAmount: GRASS.population
      });
  }

  printStats(dayStep) {
      this.dayData.forEach((day, index) => {
          if (index%dayStep === 0 || index === this.dayData.length - 1) {
            logger.printDataFromDBForDay(day, index);
          }
      })
  }

  printForDay(dayNumber) {
    logger.printDataFromDBForDay(this.dayData[dayNumber - 1]. dayNumber);
  }
}

let logger = new Logger();
let DB = new DataBase();

class Animal {
  constructor(food, maxAge, maxChildren, eatPerDay, pregnantPeriod, population, animalNumber, parentName) {
      this.age = 0;
      this.lifepower = 5;
      this.gender = (Math.round(Math.random()*10)) > 5 ? 'Male' : 'Female';
      this.food = food;
      this.maxAge = maxAge;
      this.maxChildren = maxChildren;
      this.eatPerDay = eatPerDay;
      this.pregnantPeriod = pregnantPeriod;
      this.pregnantCount = 0;
      this.isPregnant = false;
      this.population = population;
      this.animalNumber = animalNumber;
      this.parentName = parentName ? parentName : "";
      this.animalName = this.constructor.name + " " + animalNumber + " " + this.gender + " " + parentName;
      this.pregnantCount = calculateRange(this.pregnantPeriod); 
  }

  dead () {
      this.population.splice(this.population.indexOf(this), 1);
  }

  multiply () {
    let childrenCount = calculateRange(this.maxChildren);

    for (let i = 0; i < childrenCount; i++) {
        this.animalNumber++;
        this.parentName = this.animalName;
        let newbornAnimal = new this.constructor(this.food, this.maxAge, this.maxChildren, this.eatPerDay, 
          this.pregnantPeriod, this.population, this.animalNumber, this.parentName);
        this.population.push(newbornAnimal);
    }
  }

  eat () {
    if (this.lifepower < this.eatPerDay) this.lifepower++;
  }

  liveOneDay () {
    this.lifepower--;

    if (this.lifepower === 0 || this.age >= this.maxAge) {
        this.dead();
        return;
    }

    let eatenPerDay = calculateRange(this.eatPerDay);
    if (eatenPerDay) {
        for (let index = 0; index < eatenPerDay; index++) {
            this.eat();
        }
    }

    if (this.gender === 'Female' && !this.isPregnant) {
        this.isPregnant = true;
    }

    if (this.isPregnant) this.pregnantCount++;
    if (this.isPregnant && this.pregnantPeriod === this.pregnantCount) {
      this.multiply();
      this.pregnantCount = 0;
      this.isPregnant = false;
    }
    
    this.age++;
  }
}

class Mouse extends Animal {
  constructor(food, maxAge, maxChildren, eatPerDay, pregnantPeriod, population, animalNumber) {
      super(food, maxAge, maxChildren, eatPerDay, pregnantPeriod, population, animalNumber);
  }

  eat () {
    if (this.food === 0) {
      logger.isNoFood(this.animalName);
      return;
    }
    super.eat();
    this.food--;
  }

  multiply() {
    if (this.population.length > MAX_MICE_AMOUNT) {
      logger.maxMiceAmount(this.population.length);
      this.pregnantCount = 0;
      this.isPregnant = false;
      return;
    }
    super.multiply();
  }
}

class Eagle extends Animal {
  constructor(food, maxAge, maxChildren, eatPerDay, pregnantPeriod, population, animalNumber) {
      super(food, maxAge, maxChildren, eatPerDay, pregnantPeriod, population, animalNumber);
  }

  eat () {
    if (this.food.length === 0) {
      logger.isNoFood(this.animalName);
      return;
    }
    if (calculatEeagleHunger()) {
      logger.difficultToFindMices();
      this.dead();
      return;
    }
    super.eat();
    this.food[getRandomIndexFromArray(this.food)].dead();
  }
}

function generateWorld() {
  for (let index = 0; index < MICE_AMOUNT; index++) {
    MICE.animalNumber++;
    MICE.population.push(new Mouse(MICE.food, MICE.maxAge, MICE.maxChildren, MICE.eatPerDay, MICE.pregnantPeriod, MICE.population, MICE.animalNumber));
  }
  for (let index = 0; index < EAGLES_AMOUNT; index++) {
    EAGLES.animalNumber++;
    EAGLES.population.push(new Eagle(EAGLES.food, EAGLES.maxAge, EAGLES.maxChildren, EAGLES.eatPerDay, EAGLES.pregnantPeriod, EAGLES.population, EAGLES.animalNumber));
  };
  startCountDays();
  DB.printStats(50);
}

function startCountDays() {
  for (let index = 1; index < DAYS; index++) {
      dayNumber = index;
      if (MICE.population.length === 0 && EAGLES.population.length ===0) {
        setTimeout(() => {
          logger.worldISEmty();
        })
        break;
      }
      MICE.population.forEach((mouse) => {
          mouse.liveOneDay();
      });
      EAGLES.population.forEach((eagle) => {
          eagle.liveOneDay();
      });
      GRASS.population = GRASS.population + (Math.floor((GRASS_AMOUNT/100)*calculateRange(10)));
      mice_index = Math.floor(MAX_MICE_AMOUNT/MICE.population.length);
      DB.logDayData();
  }
}

generateWorld();