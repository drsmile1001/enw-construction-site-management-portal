const packageJson = await Deno.readTextFile("package.json").then((json) =>
  JSON.parse(json)
);
console.log("oldversion", packageJson.version);
//ask for new version
const version = prompt("new version: ");
if (!version) throw new Error("version is required");
//update package.json
packageJson.version = version;
await Deno.writeTextFile("package.json", JSON.stringify(packageJson, null, 2));

// git commit
await new Deno.Command("git", {
  args: ["add", "."],
}).spawn().status;

await new Deno.Command("git", {
  args: ["commit", "-m", `release ${version}`],
}).spawn().status;

await new Deno.Command("git", {
  args: ["tag", version],
}).spawn().status;

await new Deno.Command("git", {
  args: ["push"],
}).spawn().status;

await new Deno.Command("git", {
  args: ["push", "--tags"],
}).spawn().status;
