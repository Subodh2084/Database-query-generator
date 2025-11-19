const modelResponse="User Preferences:\n\n* Football\n* Barcelona\n* Real Madrid\n* La Liga\n* Match results\n"
function modelResponseMapper(modelResponse) {
  let response = modelResponse.replace("```", "").replace(``, "");
  response = response
    .split("\n*")
    .filter((item) => !item.includes("``"))
    .map((item) => item.replace("\n", "").trim())
    .slice(1)
  return response;
}
console.log(modelResponseMapper("User Preferences:\n\n* Football\n* Barcelona\n* Real Madrid\n* La Liga\n* Match results\n"))

export { modelResponseMapper };
