const fn = (input) => console.log(input);
fn(10);
(function () {
  console.log('anonymous function');
})();
fn(11);

function oldwaytofunction(a, b, c) {
  console.log(a, arguments[0]);
}
oldwaytofunction('1');
