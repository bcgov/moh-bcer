export function stringGen(length) {
  const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscin `; // length 50
  const multiply = Math.ceil((length || 100) / lorem.length);
  return lorem.repeat(multiply).slice(0, length || 100);
}

export function clickButton(contains){
  cy.get("button").contains(contains).parent().should('exist')
  cy.get("button").contains(contains).parent().click();
}

export function insideDialog(func){
  cy.get(".MuiDialog-paper").should("exist").within(() => {
    func();
  })
}

export class Selector {
  #selector = "";

  constructor(selector){
    this.#selector = selector;
  }

  addType(type){
    this.addProperty('type', type);
    return this;
  }

  addName(name){
    this.addProperty('name', name);
    return this;
  }

  addValue(value){
    this.addProperty('value', value);
    return this;
  }

  addHref(href){
    this.addProperty('href', href);
    return this;
  }

  addIndex(index){
    this.addProperty('index', index);
    return this;
  }

  addTitle(title){
    this.addProperty('title', title);
    return this;
  }

  addProperty(propertyName, propertyValue){
    this.#selector = this.#selector + `[${propertyName}="${propertyValue}"]`;
    return this;
  }

  addSelector(selector){
    this.#selector = this.#selector + ` > ${selector}`;
    return this;
  }

  build(){
    return this.#selector;
  }
}




