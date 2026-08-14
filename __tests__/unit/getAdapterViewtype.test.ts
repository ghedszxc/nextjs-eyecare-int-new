import { getAdapterViewtype } from "@/lib/utilities";

const mock = [
  { viewtype: "viewtype_to_select" },
  { viewtype: "viewtype_unselect_1" },
  { viewtype: "viewtype_unselect_2" },
  { viewtype: "viewtype_unselect_3" },
];

const mockviewtype = "viewtype_to_select";
const adapter = getAdapterViewtype(mock, "viewtype_to_select");

describe("getAdapterViewtype test", () => {
  it("Unselected items length must be lessthan 1 if there is something to select", () => {
    expect(adapter.unselected?.length === mock.length - 1).toBeTruthy();
  });

  it("Selected item matches viewtype condition", () => {
    expect(adapter.selected.viewtype).toMatch(mockviewtype);
  });

  it("Unselected items will not have the selected viewtype in array", () => {
    expect(adapter.unselected?.find((item) => item?.viewtype === mockviewtype)).toBeUndefined();
  });
});
