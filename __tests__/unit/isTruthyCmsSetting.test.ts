import { isTruthyCmsSetting } from "@/lib/utilities";

describe("isTruthyCmsSetting test", () => {
  it("isTruthyCmsSetting accepts the shapes CoreMedia settings arrive in", () => {
    expect(isTruthyCmsSetting(true)).toBe(true);
    expect(isTruthyCmsSetting("true")).toBe(true);
    expect(isTruthyCmsSetting("True")).toBe(true);
    expect(isTruthyCmsSetting(["true"])).toBe(true);
  });

  it("isTruthyCmsSetting treats anything else as unset", () => {
    expect(isTruthyCmsSetting(undefined)).toBe(false);
    expect(isTruthyCmsSetting(null)).toBe(false);
    expect(isTruthyCmsSetting(false)).toBe(false);
    expect(isTruthyCmsSetting("false")).toBe(false);
    expect(isTruthyCmsSetting([])).toBe(false);
    expect(isTruthyCmsSetting("1")).toBe(false);
  });
});
