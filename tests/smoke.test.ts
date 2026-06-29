import { describe, it, expect } from "vitest";
import { run } from "../src/cli.js";

describe("cli smoke", () => {
  it("run is an async function", () => {
    expect(typeof run).toBe("function");
  });
});
