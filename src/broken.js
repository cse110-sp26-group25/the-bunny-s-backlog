// This file is missing semicolons — will fail the ESLint check in CI
function add(a, b) {
  return a + b
}

function greet(name) {
  console.log('hello ' + name)
}
