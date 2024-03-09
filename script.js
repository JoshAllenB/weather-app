const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", async function() {
  currentWeather(); 
})
async function currentWeather() {
  const search = document.getElementById("location").value;

  const url = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=c3451ffeb2ae4f15b6761756240803&q=${search}`,
    { mode: "cors" }
  );

  const data = await url.json();
  console.log(data);
}
