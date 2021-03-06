import { install, pack } from "../packager"
import * as luaParser from '../parser/lua_parser';
import fs, { writeJSONSync } from 'fs-extra';
import { Storage } from "../storage"
import { expect } from "chai";
import { MemoryProvider } from "../storage/memory";
import path from "path"
import os from "os"
import rimraf from "rimraf"
import util from "util"
const rmAll = util.promisify(rimraf);

import {testTemplateLuaConfig} from "../parser/test_template_config";
import { generateLuaConfig } from "..";
const testLua = testTemplateLuaConfig(`${__dirname}/../fixtures`)


describe("packing function test", () => {

    //TODO needs better test to check correct pkg results 
    it("should package a MachineConfig return a package Object", async () => {
        let machineConfig = await luaParser.parseLuaMachineConfig(testLua.toString())
        const storage = new Storage(new MemoryProvider())
        const pkgConfig = await pack(machineConfig, storage);
        console.log(JSON.stringify(pkgConfig,null,2))
        expect(pkgConfig.assets.length === 3).true
    })

    //TODO more exhaustive test here for proper installation
    it("should install a package config", async () => {
        let machineConfig = await luaParser.parseLuaMachineConfig(testLua.toString())
        const storage = new Storage(new MemoryProvider())
        const pkgConfig = await pack(machineConfig, storage);
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp-carti-p'))
        // TODO more exhaustive quote test for boot args
        // Test relies on default atm this just injects new args
        pkgConfig.machineConfig.boot = { args: "echo 'Hello World'" }
        const cfg = await install(pkgConfig, storage, dir, "/opt/carti/packages")
        let example = fs.readFileSync(`${dir}/baenrwigfd3thblxcse7nvzwsebphtfre5nsmfl3wymz5n3jgi3aqwhsocy/rom.bin`)
        expect(cfg.rom.image_filename === '/opt/carti/packages/baenrwigfd3thblxcse7nvzwsebphtfre5nsmfl3wymz5n3jgi3aqwhsocy/rom.bin')
        expect(Buffer.from(example).toString() === "fakerom").true
        fs.writeFile(`${dir}`, JSON.stringify(pkgConfig, null, 2))
        await rmAll(dir)
        return
    })
})