<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<body>

<p>Click the button to open an about:blank page in a new browser window that is 200px wide and 100px tall.</p>

<button onclick="myFunction()">Try it</button>

<script>
function myFunction() {
  var myWindow = window.open("https://www.w3schools.com/jsref/met_win_open.asp", "", "width=1200,height=600, left = 2300,top = 200");
}
</script>

</body>
</html>
