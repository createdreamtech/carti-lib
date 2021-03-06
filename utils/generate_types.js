// This file is a utility file used to build generated types from json schema in typescript
// This allows us to have schemas for all of the data structures and types referenced
const JsonSchemaTranspiler = require("@json-schema-tools/transpiler").default;
const machineConfigSchema = require("../src/machine-config-schema.json")
const machinePackageSchema = require("../src/machine-config-package-schema.json")
const mirrorConfigSchema = require("../src/mirror-config-schema.json")
const bundleConfigSchema = require("../src/bundle-config-schema.json")
const Dereferencer = require("@json-schema-tools/dereferencer").default;
const fs = require('fs-extra')

async function generate(fileName, schema) {
    const dereffer = new Dereferencer(schema);
    const dereffedSchema = await dereffer.resolve()
    const transpiler = new JsonSchemaTranspiler(dereffedSchema);
    fs.writeFile(fileName, transpiler.toTypescript());
}
(async function () {
    try {
        await generate("./src/generated/machine_config_schema.ts", machineConfigSchema)
        await generate("./src/generated/machine_config_pkg_schema.ts", machinePackageSchema)
        await generate("./src/generated/mirror_config_schema.ts", mirrorConfigSchema)
        await generate("./src/generated/bundle_config_schema.ts", bundleConfigSchema)
    } catch (e) {
        console.log(e)
    }
})()

/*console.log(transpiler.toRust());
console.log(transpiler.to("go")); // same thing, different form/interface
console.log(transpiler.to("python")); // works with shorthand of the language aswell (py or python)
*/