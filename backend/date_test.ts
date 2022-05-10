let a = new Date(2021,1,1)
console.log(a);

console.log(`month: ${a.getMonth()}, day: ${a.getDate()}`);

let b = new Date(a.getFullYear(), a.getMonth(), a.getDate())
console.log(b);
