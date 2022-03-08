export function stringGen(length) {
  const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscin `; // length 50
  const multiply = Math.ceil((length || 100) / lorem.length);
  return lorem.repeat(multiply).slice(0, length || 100);
}

export function clickButton(contains){
  cy.get("button").contains(contains).parent().click();
}




