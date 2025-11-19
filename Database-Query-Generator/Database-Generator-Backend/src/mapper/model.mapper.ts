function modelResponseMapper(modelResponse: string) {
  let response = modelResponse.replace("```", "").replace(`sql`, "");
  response = response
    .split("\n")
    .filter((item: string) => !item.includes("```"))
    .join("");
  return response;
}

export { modelResponseMapper };
