let date = new Date('2025-02-15T16:28:59.999Z')
let date1 = new Date(Date.now())
console.log(date, date1)
console.log(date <= date1.setHours(date1.getHours() + 1))
