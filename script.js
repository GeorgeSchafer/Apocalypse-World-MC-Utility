
// Classes
class AWDice {
  constructor() {
    this.sides = 6;
  }

  roll() {
    const result = {
      d1: Math.floor(Math.random() * this.sides) + 1,
      d2: Math.floor(Math.random() * this.sides) + 1
    }
    return result;
  }
}

/*
  @class
  I wanted to replace the distribution object and wanted to 
  create an easy way to add segments of an array together.
  A DistributionArray adds a function to the Array class
  which allows a segment of elements in an array to be 
  added together easily. This particular implementation
  converts the inputs from a dice value to an index and
  adds those values together.
*/
class DistributionArray extends Array {
  arraySegmentSum(result1,result2){
    let result = 0.00;
    const i1 = result1 - 2;
    const i2 = result2 - 2;

    for( let i=i1 ; i<=i2 ; i++){
      i > 10 || i < 0 ? result += 0.00 : result += this[i];
    }

    return result;
  }
}

// HTML Elements
const Elements = {
  rollWithModifier: {
    modifierDiv: document.querySelector("#RollModifier"),
    success: document.querySelector("#success"),
    fumble: document.querySelector("#fumble"),
    fail: document.querySelector("#fail"),
    input1: document.getElementById("input1"),
    input2: document.getElementById("input2"),
    input3: document.getElementById("input3"),
    output: document.getElementById("output")
  },
  scaleCollapser: {
    head: document.querySelector("#successScaleHead"),
    prob: document.querySelector("#successScaleProbabilityHead"),
    body: document.querySelector("#successScaleBody")
  },
  calculateHarm: {
    submitHarm: document.querySelector("#submitHarm"),
    weaponHarm: document.querySelector("#weaponHarm"),
    armorHarm: document.querySelector("#armorHarm"),
    netHarm: document.querySelector("#netHarm")
  },
  basicMoves: {
    selector: document.querySelector("#basicMovesSelector"),
    showButton: document.querySelector("#getMove"),
    clearButton: document.querySelector("#clearMove"),
    currentElement: null
  }
};

// Event Listeners
const Listeners = {
  rollWithModifier: [
    Elements.rollWithModifier.modifierDiv.addEventListener("click", (e) => { Functions.statRollWithModifier(e) })
  ],
  scaleCollapser: [
    Elements.scaleCollapser.head.addEventListener("click", () => { Functions.collapseSuccessScale() })
  ],
  calculateHarm: [
    Elements.calculateHarm.submitHarm.addEventListener("click", (e) => { Functions.calculateHarm(e) })
  ],
  basicMoves: [
    Elements.basicMoves.showButton.addEventListener("click", (e) => { 
      Functions.basicMoves.displayMove(e) 
    }),
    Elements.basicMoves.clearButton.addEventListener("click", (e) => { 
      Functions.basicMoves.clearMove(e) 
    })
  ]
};

// Functions
const Functions = {
  statRollWithModifier: (e) => {
    e.preventDefault();
  
    const dice = new AWDice(6);
    const modifier = parseInt(e.target.value);
    const result = dice.roll();
    const probability = new Object();
  
    //Success Distribution Array
    const d = new DistributionArray(
           //dice => index
      2.78,  // 2  = 0
      5.56,  // 3  = 1
      8.33,  // 4  = 2
      11.11, // 5  = 3
      13.89, // 6  = 4
      16.67, // 7  = 5
      13.89, // 8  = 6
      11.11, // 9  = 7
      8.33,  // 10 = 8
      5.56,  // 11 = 9
      2.78   // 12 = 10
    );
    
    /*
      @TODO Fix the outcome values of success, fumble, fail.
      Although they are in the right ball park, these values 
      no longer add up to 100% as they did when d was an 
      object. 
      The 0.01 modifier is there to adjust for rounding errors, 
      it cannot be added to success because at modifier -3 
      there is zero chance of rolling a success.
    */
    probability.success = d.arraySegmentSum(10-modifier,12-modifier);
    probability.fumble = d.arraySegmentSum(7-modifier, 9-modifier) - 0.01;
    probability.fail = d.arraySegmentSum(2-modifier,6-modifier);
  
    Elements.rollWithModifier.input1.textContent = result.d1;
    Elements.rollWithModifier.input2.textContent = result.d2;
    Elements.rollWithModifier.input3.textContent = modifier;
    Elements.rollWithModifier.output.textContent = result.d1 + result.d2 + modifier;
    Elements.rollWithModifier.success.textContent = probability.success.toFixed(2);
    Elements.rollWithModifier.fumble.textContent = probability.fumble.toFixed(2);
    Elements.rollWithModifier.fail.textContent = probability.fail.toFixed(2);
  },
  collapseSuccessScale: () => {
    Elements.scaleCollapser.body.classList.toggle("hidden");
    Elements.scaleCollapser.prob.classList.toggle("hidden");
  },
  calculateHarm: (e) => {
    e.preventDefault();

    let result = Elements.calculateHarm.weaponHarm.value - Elements.calculateHarm.armorHarm.value;
    result = (result < 0) ? 0 : result;

    Elements.calculateHarm.netHarm.textContent = result;
  },
  basicMoves: {
    displayMove: (e) => {
      e.preventDefault();

      const basicMoves = Elements.basicMoves;
      
      basicMoves.currentElement?.classList.add("hidden");
      
      basicMoves.currentElement = document.querySelector(`#${basicMoves.selector.value}`);
      basicMoves.currentElement.classList.remove("hidden");
    },
    clearMove: (e) => {
      e.preventDefault();
      
      const basicMoves = Elements.basicMoves;

      basicMoves.currentElement?.classList.toggle("hidden");
      basicMoves.currentElement = null;
    }
  }
};
